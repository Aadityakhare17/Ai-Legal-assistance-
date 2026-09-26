"""
RAG Pipeline — Chunking, Embedding, ChromaDB Vector Store, Retrieval.
"""
import uuid
from typing import List, Dict, Optional
from loguru import logger
from app.core.config import settings


class RAGService:
    def __init__(self):
        self._chroma_client = None
        self._collection = None

    def _get_collection(self, collection_name: str = None):
        """Lazy-initialize ChromaDB collection."""
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
            raise

    def _get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings from Gemini or fallback to simple hash embeddings for demo."""
        if not settings.GEMINI_API_KEY:
            # Demo mode: return zero vectors (won't do real semantic search)
            logger.warning("No GEMINI_API_KEY — using placeholder embeddings")
            return [[0.0] * 768 for _ in texts]

        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            embeddings = []
            # Embed in batches of 100
            for i in range(0, len(texts), 100):
                batch = texts[i:i+100]
                result = genai.embed_content(
                    model=settings.EMBEDDING_MODEL,
                    content=batch,
                    task_type="retrieval_document"
                )
                if isinstance(batch, list):
                    embeddings.extend(result["embedding"])
                else:
                    embeddings.append(result["embedding"])
            return embeddings
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            return [[0.0] * 768 for _ in texts]

    def index_chunks(self, document_id: int, chunks: List[Dict]) -> List[str]:
        """Embed and store chunks in ChromaDB. Returns list of chroma IDs."""
        if not chunks:
            return []

        collection = self._get_collection()
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
            raise

        return ids

    def retrieve(self, document_id: int, query: str, top_k: int = 5) -> List[Dict]:
        """Retrieve top-k relevant chunks for a query from a specific document."""
        collection = self._get_collection()

        if not settings.GEMINI_API_KEY:
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
        try:
            collection = self._get_collection()
            results = collection.get(where={"document_id": str(document_id)})
            if results and results.get("ids"):
                collection.delete(ids=results["ids"])
                logger.info(f"Deleted {len(results['ids'])} chunks for document {document_id}")
        except Exception as e:
            logger.error(f"ChromaDB delete error: {e}")


rag_service = RAGService()
