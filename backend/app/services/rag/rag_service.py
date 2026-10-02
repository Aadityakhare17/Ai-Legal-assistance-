"""
RAG Pipeline — Chunking, Embedding, ChromaDB Vector Store, Retrieval.
ChromaDB is optional: if not installed (e.g. Vercel slim build), all methods
return empty results so the app gracefully runs in Demo Mode.
"""
import uuid
from typing import List, Dict, Optional
from loguru import logger
from app.core.config import settings
from app.services.ai.llm_service import llm_service

# Check once at import time whether chromadb is available
try:
    import chromadb as _chromadb  # noqa: F401
    CHROMADB_AVAILABLE = True
except ImportError:
    CHROMADB_AVAILABLE = False
    logger.warning("chromadb not installed — RAG vector store disabled (Demo Mode only)")


class RAGService:
    def __init__(self):
        self._chroma_client = None
        self._collection = None

    def _get_collection(self, collection_name: str = None):
        """Lazy-initialize ChromaDB collection. Returns None if unavailable."""
        if not CHROMADB_AVAILABLE:
            return None
        name = collection_name or settings.CHROMA_COLLECTION
        try:
            import chromadb
            if self._chroma_client is None:
                self._chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
            return self._chroma_client.get_or_create_collection(
                name=name,
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            logger.error(f"ChromaDB init error: {e}")
            return None

    def _get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings using llm_service."""
        try:
            return llm_service.get_embeddings(texts)
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            return [[0.0] * 768 for _ in texts]

    def index_chunks(self, document_id: int, chunks: List[Dict]) -> List[str]:
        """Embed and store chunks in ChromaDB. Returns list of chroma IDs.
        Returns empty list if ChromaDB is unavailable."""
        if not chunks:
            return []

        collection = self._get_collection()
        if collection is None:
            logger.warning(f"Skipping RAG indexing for doc {document_id} — ChromaDB unavailable")
            return []

        texts = [c["content"] for c in chunks]
        embeddings = self._get_embeddings(texts)

        ids = [str(uuid.uuid4()) for _ in chunks]
        metadatas = [
            {
                "document_id": str(document_id),
                "chunk_index": str(c.get("chunk_index", i)),
                "page_number": str(c.get("page_number") or ""),
                "section_heading": c.get("section_heading") or "",
            }
            for i, c in enumerate(chunks)
        ]

        try:
            collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas,
            )
            logger.info(f"Indexed {len(chunks)} chunks for document {document_id}")
        except Exception as e:
            logger.error(f"ChromaDB indexing error: {e}")
            return []

        return ids

    def retrieve(self, document_id: int, query: str, top_k: int = 5) -> List[Dict]:
        """Retrieve top-k relevant chunks for a query from a specific document.
        Returns empty list if ChromaDB is unavailable."""
        collection = self._get_collection()
        if collection is None:
            logger.warning(f"RAG retrieve skipped for doc {document_id} — ChromaDB unavailable")
            return []

        if not settings.is_ai_configured:
            # Demo: just return all chunks for that doc
            results = collection.query(
                query_embeddings=[[0.0] * 768],
                n_results=min(top_k, 10),
                where={"document_id": str(document_id)},
            )
        else:
            query_embedding = self._get_embeddings([query])[0]
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where={"document_id": str(document_id)},
            )

        retrieved = []
        if results and results.get("documents"):
            for i, doc in enumerate(results["documents"][0]):
                metadata = results["metadatas"][0][i] if results.get("metadatas") else {}
                distance = results["distances"][0][i] if results.get("distances") else 0
                retrieved.append({
                    "content": doc,
                    "page_number": metadata.get("page_number"),
                    "section_heading": metadata.get("section_heading"),
                    "chunk_index": metadata.get("chunk_index"),
                    "relevance_score": 1 - distance,
                })
        return retrieved

    def delete_document_chunks(self, document_id: int):
        """Remove all chunks for a document from ChromaDB."""
        collection = self._get_collection()
        if collection is None:
            return
        try:
            results = collection.get(where={"document_id": str(document_id)})
            if results and results.get("ids"):
                collection.delete(ids=results["ids"])
                logger.info(f"Deleted {len(results['ids'])} chunks for document {document_id}")
        except Exception as e:
            logger.error(f"ChromaDB delete error: {e}")


rag_service = RAGService()
