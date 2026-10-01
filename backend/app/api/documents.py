import os
import uuid
import asyncio
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import aiofiles

from app.database.database import get_db
from app.models.user import User
from app.models.document import Document, DocumentChunk, Analysis, Conversation, LawyerBrief
from app.schemas.document import (
    DocumentOut, AnalysisOut, AskRequest, AskResponse,
    CompareRequest, CompareResponse, LawyerBriefRequest, LawyerBriefOut,
    ObligationUpdate, ConversationMessage
)
from app.core.security import get_current_user
from app.core.config import settings
from app.services.document_processing.extractor import extract_text_from_file, chunk_text, validate_file
from app.services.rag.rag_service import rag_service
from app.services.analysis.analysis_service import (
    analyze_document_full, ask_document_question, compare_documents,
    generate_lawyer_brief, general_legal_info
)
from demo_data.demo_documents import DEMO_DOCUMENTS, DEMO_ANALYSIS, DEMO_COMPARISON_ANALYSIS

router = APIRouter(prefix="/api/documents", tags=["Documents"])


def _get_demo_doc(doc_id: int):
    """Get demo document by ID."""
    for doc in DEMO_DOCUMENTS:
        if doc["id"] == doc_id:
            return doc
    return None


# ─── UPLOAD ────────────────────────────────────────────────────────────────

@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Validate file
    content = await file.read()
    error = validate_file(
        file.filename,
        len(content),
        settings.allowed_extensions_list,
        settings.MAX_FILE_SIZE_MB
    )
    if error:
        raise HTTPException(status_code=400, detail=error)

    # Save file
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    safe_name = f"{uuid.uuid4()}{Path(file.filename).suffix.lower()}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_name)

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    # Create DB record
    doc = Document(
        owner_id=current_user.id,
        filename=safe_name,
        original_filename=file.filename,
        file_path=file_path,
        file_size=len(content),
        file_type=Path(file.filename).suffix.lower().lstrip("."),
        status="uploaded",
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # Start background analysis
    background_tasks.add_task(_process_document, doc.id, file_path, current_user.id)

    return DocumentOut.model_validate(doc)


async def _process_document(doc_id: int, file_path: str, user_id: int):
    """Background task: extract text, chunk, embed, and analyze."""
    from app.database.database import AsyncSessionLocal
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Document).where(Document.id == doc_id))
        doc = result.scalar_one_or_none()
        if not doc:
            return

        try:
            # Update status
            doc.status = "processing"
            await db.commit()

            # Extract text
            text, page_count, word_count = extract_text_from_file(file_path)
            doc.page_count = page_count
            doc.word_count = word_count
            await db.commit()

            # Chunk text
            chunks = chunk_text(text)

            # Store chunks in DB
            for chunk_data in chunks:
                chunk = DocumentChunk(
                    document_id=doc_id,
                    chunk_index=chunk_data["chunk_index"],
                    content=chunk_data["content"],
                    page_number=chunk_data.get("page_number"),
                    section_heading=chunk_data.get("section_heading"),
                )
                db.add(chunk)
            await db.commit()

            # Index in ChromaDB (only if API key available)
            try:
                chroma_ids = rag_service.index_chunks(doc_id, chunks)
            except Exception as e:
                chroma_ids = []

            # Run AI analysis
            if settings.is_ai_configured:
                analysis_data = await analyze_document_full(text, doc.original_filename)
            else:
                # Demo mode: use pre-computed analysis for demo documents
                analysis_data = DEMO_ANALYSIS
                analysis_data["document_type"] = "Legal Document (Demo Mode — AI Not Configured)"

            # Store analysis
            analysis = Analysis(
                document_id=doc_id,
                document_type=analysis_data.get("document_type"),
                document_type_confidence=analysis_data.get("document_type_confidence", 0.8),
                summary=analysis_data.get("summary"),
                parties=analysis_data.get("parties"),
                important_dates=analysis_data.get("important_dates"),
                financial_terms=analysis_data.get("financial_terms"),
                obligations=analysis_data.get("obligations"),
                rights=analysis_data.get("rights"),
                risk_flags=analysis_data.get("risk_flags"),
                unusual_clauses=analysis_data.get("unusual_clauses"),
                missing_information=analysis_data.get("missing_information"),
                questions_to_ask=analysis_data.get("questions_to_ask"),
                action_checklist=analysis_data.get("action_checklist"),
                clauses=analysis_data.get("clauses"),
                timeline_events=analysis_data.get("timeline_events"),
                before_you_sign=analysis_data.get("before_you_sign"),
                legal_lens=analysis_data.get("legal_lens"),
            )
            db.add(analysis)
            doc.status = "analyzed"
            await db.commit()

        except Exception as e:
            doc.status = "error"
            doc.error_message = str(e)[:500]
            await db.commit()


# ─── LIST & GET ────────────────────────────────────────────────────────────

@router.get("", response_model=List[DocumentOut])
async def list_documents(
    include_demo: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all documents for the current user, including demo documents."""
    result = await db.execute(
        select(Document).where(Document.owner_id == current_user.id).order_by(Document.created_at.desc())
    )
    docs = result.scalars().all()

    # If user has no docs and demo mode, inject demo docs
    if not docs and include_demo:
        return _get_fake_demo_docs()

    return [DocumentOut.model_validate(d) for d in docs]


def _get_fake_demo_docs():
    """Return mock DocumentOut objects from demo data for display."""
    from datetime import datetime
    now = datetime.now(timezone.utc)
    docs = []
    for d in DEMO_DOCUMENTS:
        docs.append(DocumentOut(
            id=d["id"],
            filename=d["filename"],
            original_filename=d["original_filename"],
            file_size=d["file_size"],
            file_type=d["file_type"],
            page_count=d["page_count"],
            word_count=d["word_count"],
            status=d["status"],
            is_demo=True,
            error_message=None,
            created_at=now,
            updated_at=None,
        ))
    return docs


@router.get("/demo", response_model=List[DocumentOut])
async def get_demo_documents():
    """Return demo documents (no auth required)."""
    return _get_fake_demo_docs()


@router.get("/{doc_id}", response_model=DocumentOut)
async def get_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Check demo first
    demo = _get_demo_doc(doc_id)
    if demo:
        return _get_fake_demo_docs()[doc_id - 1] if doc_id <= len(DEMO_DOCUMENTS) else None

    result = await db.execute(
        select(Document).where(Document.id == doc_id, Document.owner_id == current_user.id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentOut.model_validate(doc)


# ─── ANALYSIS ──────────────────────────────────────────────────────────────

@router.get("/{doc_id}/analysis", response_model=AnalysisOut)
async def get_analysis(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Demo mode
    demo = _get_demo_doc(doc_id)
    if demo and demo.get("analysis"):
        a = demo["analysis"]
        return AnalysisOut(
            id=doc_id,
            document_id=doc_id,
            document_type=a.get("document_type"),
            document_type_confidence=a.get("document_type_confidence", 0.98),
            summary=a.get("summary"),
            parties=a.get("parties"),
            important_dates=a.get("important_dates"),
            financial_terms=a.get("financial_terms"),
            obligations=a.get("obligations"),
            rights=a.get("rights"),
            risk_flags=a.get("risk_flags"),
            unusual_clauses=a.get("unusual_clauses"),
            missing_information=a.get("missing_information"),
            questions_to_ask=a.get("questions_to_ask"),
            action_checklist=a.get("action_checklist"),
            clauses=a.get("clauses"),
            timeline_events=a.get("timeline_events"),
            before_you_sign=a.get("before_you_sign"),
            legal_lens=a.get("legal_lens"),
            created_at=datetime.now(timezone.utc),
        )

    result = await db.execute(
        select(Analysis).join(Document).where(
            Analysis.document_id == doc_id,
            Document.owner_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found. Document may still be processing.")
    return AnalysisOut.model_validate(analysis)


# ─── ASK DOCUMENT ──────────────────────────────────────────────────────────

@router.post("/{doc_id}/ask", response_model=AskResponse)
async def ask_document(
    doc_id: int,
    request: AskRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    demo = _get_demo_doc(doc_id)

    if request.mode == "general":
        if not settings.is_ai_configured:
            answer_data = _demo_general_legal_info(request.question)
            return AskResponse(
                answer=answer_data["answer"],
                source_section=answer_data.get("section", "General Legal Knowledge"),
                confidence="high",
                mode="general",
                disclaimer="This is general legal information for educational purposes, not legal advice.",
            )
        result = await general_legal_info(request.question)
        return AskResponse(
            answer=result.get("answer", ""),
            confidence=result.get("confidence"),
            mode="general",
            disclaimer=result.get("disclaimer", "This is general information, not legal advice."),
        )

    # Document mode
    if demo:
        document_text = demo["text"]
    else:
        result = await db.execute(
            select(Document).where(Document.id == doc_id, Document.owner_id == current_user.id)
        )
        doc = result.scalar_one_or_none()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        try:
            text, _, _ = extract_text_from_file(doc.file_path)
            document_text = text
        except:
            document_text = ""

    # Retrieve relevant chunks
    try:
        retrieved_chunks = rag_service.retrieve(doc_id, request.question, top_k=5)
    except:
        retrieved_chunks = []

    if not settings.is_ai_configured:
        # Demo mode: multi-document intelligent keyword answer from document text
        answer = _demo_answer(request.question, document_text, doc_id)
        return AskResponse(
            answer=answer["answer"],
            source_section=answer.get("section"),
            page_number=answer.get("page_number", 1),
            relevant_clause=answer.get("clause"),
            confidence=answer.get("confidence", "high"),
            mode="document",
            disclaimer="This is general information, not legal advice. Citations reflect document text.",
        )


def _demo_general_legal_info(question: str) -> dict:
    """Provides structured general legal knowledge in demo mode without API key."""
    q = question.lower()
    if any(w in q for w in ["lock-in", "lock in"]):
        return {
            "answer": "A lock-in period is a contractual clause where neither party can terminate the agreement before a specified duration without penalty. If breached, the exiting party typically forfeits security deposits or pays rent/fees for the remaining months. In India, courts evaluate whether lock-in penalties represent a genuine pre-estimate of loss versus an unenforceable penalty.",
            "section": "Indian Contract Law — Enforceability of Lock-in Clauses"
        }
    elif any(w in q for w in ["non-compete", "non compete", "section 27", "competitor"]):
        return {
            "answer": "Under Section 27 of the Indian Contract Act, 1872, any agreement that restrains an individual from exercising a lawful profession, trade, or business is void to that extent. The Supreme Court of India has consistently held that post-employment non-compete restrictions are generally unenforceable, though non-disclosure of trade secrets and non-solicitation covenants remain valid.",
            "section": "Indian Contract Act, 1872 — Section 27 (Restraint of Trade)"
        }
    elif any(w in q for w in ["leave and license", "license vs lease", "difference between lease"]):
        return {
            "answer": "The primary difference lies in the transfer of interest: A Lease (under Transfer of Property Act, 1882) transfers an interest in immovable property and creates tenancy rights protected by rent control laws. A Leave & License (under Indian Easements Act, 1882) merely grants permissive occupation without transferring property rights, giving owners simpler eviction and repossession remedies.",
            "section": "Property Law — Lease vs. Leave & License"
        }
    elif any(w in q for w in ["stamp duty", "registration", "registered"]):
        return {
            "answer": "Stamp duty is a statutory tax paid to the state government to make a document legally valid and admissible as evidence in court. Under the Indian Stamp Act and Registration Act, 1908, leases exceeding 11 months mandatory require registration and full stamp duty. 11-month agreements are commonly drafted to avoid mandatory sub-registrar registration, though states like Maharashtra mandate online Leave & License registration.",
            "section": "Registration Act, 1908 & State Stamp Acts"
        }
    elif any(w in q for w in ["deposit", "security deposit", "wear and tear"]):
        return {
            "answer": "Security deposits protect landlords against unpaid rent or physical damage beyond reasonable wear and tear. Standard legal practice recommends having a documented Move-In Condition Report and defined deduction terms. Tenants are generally not liable for natural aging or reasonable wear and tear of premises.",
            "section": "Tenancy Rights — Security Deposit Safeguards"
        }
    else:
        return {
            "answer": f"General legal principles under Indian law require clear consensus ad idem (meeting of minds), lawful consideration, and defined remedy mechanisms. For questions regarding '{question}', consulting a qualified legal professional is advised to obtain tailored guidance for your specific state jurisdiction.",
            "section": "General Indian Jurisprudence"
        }


def _demo_answer(question: str, document_text: str, doc_id: int = 1) -> dict:
    """Multi-document intelligent answers for demo mode without API key."""
    q = question.lower()
    text = (document_text or "").lower()

    # Document 2: Employment Contract
    if "technova" in text or "priya nair" in text or doc_id == 2:
        if any(w in q for w in ["salary", "ctc", "pay", "compensation", "money"]):
            return {
                "answer": "Under Clause 5, the gross annual CTC is Rs. 14,40,000/- (Rupees Fourteen Lakhs Forty Thousand), paid monthly at ₹1,20,000 gross before tax and statutory deductions. Annual performance bonuses are discretionary under Clause 6.",
                "section": "COMPENSATION — Clause 5 & 6",
                "clause": "The Employee shall receive a gross annual CTC of Rs. 14,40,000/- paid monthly. The Employee may be eligible for an annual performance bonus at the Company's sole discretion.",
                "page_number": 1
            }
        elif any(w in q for w in ["probation", "confirm"]):
            return {
                "answer": "Under Clause 4, the probation period is THREE (3) MONTHS (ends 30th June 2024). During probation, either party may terminate employment with only ONE (1) WEEK notice without cause.",
                "section": "PROBATION PERIOD — Clause 4",
                "clause": "The Employee shall serve a probation period of THREE (3) MONTHS, during which either party may terminate employment with ONE (1) WEEK notice without cause.",
                "page_number": 1
            }
        elif any(w in q for w in ["notice", "quit", "resign", "terminate", "exit"]):
            return {
                "answer": "After probation, either party may terminate employment with THREE (3) MONTHS written notice or payment of salary in lieu of notice (Clause 13). The company may terminate immediately for cause (Clause 14).",
                "section": "TERMINATION — Clause 13 & 14",
                "clause": "After probation, either party may terminate employment with THREE (3) MONTHS written notice or payment of salary in lieu of notice.",
                "page_number": 2
            }
        elif any(w in q for w in ["non-compete", "competitor", "compete", "after leaving"]):
            return {
                "answer": "Clause 12 states you cannot join any direct competitor in India for ONE (1) YEAR after leaving. Note: Under Section 27 of the Indian Contract Act, post-employment non-compete clauses are generally unenforceable in Indian courts, although confidentiality survives.",
                "section": "NON-COMPETE — Clause 12",
                "clause": "For a period of ONE (1) YEAR after leaving the Company, the Employee shall not join any direct competitor of the Company or work on competing products in India.",
                "page_number": 2
            }
        elif any(w in q for w in ["ip", "intellectual property", "inventions", "code", "side project"]):
            return {
                "answer": "Clause 10 claims that ALL intellectual property, inventions, and code created during employment — whether during work hours or outside, using company resources or personal resources — belong exclusively to the Company. This is unusually broad and warrants clarification for personal weekend projects.",
                "section": "INTELLECTUAL PROPERTY — Clause 10",
                "clause": "All intellectual property, inventions, software, code, or work product created by the Employee during employment, whether during working hours or otherwise, using Company resources or personal resources, shall be the exclusive property of the Company.",
                "page_number": 2
            }
        elif any(w in q for w in ["hours", "overtime", "work hours"]):
            return {
                "answer": "Standard working hours are 9:30 AM to 6:30 PM, Monday to Friday. Clause 8 explicitly states that you may be required to work additional hours without additional compensation.",
                "section": "WORKING HOURS — Clause 8",
                "clause": "Standard working hours are 9:30 AM to 6:30 PM, Monday to Friday. The Employee may be required to work additional hours without additional compensation.",
                "page_number": 2
            }
        elif any(w in q for w in ["leave", "holiday", "vacation"]):
            return {
                "answer": "Under Clause 9, you are entitled to 15 days Earned Leave, 10 days Casual/Sick Leave, plus public holidays as per company policy.",
                "section": "LEAVE — Clause 9",
                "clause": "The Employee shall be entitled to: 15 days Earned Leave, 10 days Casual/Sick Leave, and applicable public holidays as per Company policy.",
                "page_number": 2
            }
        else:
            return {
                "answer": "This is an Employment Agreement between TechNova Solutions Pvt. Ltd. and Priya Nair for Senior Software Engineer (Annual CTC ₹14.4L). Key provisions include a 3-month probation, 3-month notice period, broad IP assignment, and 1-year non-compete. Ask me about salary, probation, notice period, non-compete, or IP rights!",
                "section": "Employment Agreement Overview",
                "clause": None,
                "page_number": 1
            }

    # Document 3: NDA
    elif "innovatetech" in text or "rahul gupta" in text or doc_id == 3:
        if any(w in q for w in ["duration", "term", "period", "how long", "expire"]):
            return {
                "answer": "Under Clause 3, the confidentiality obligations remain in effect for THREE (3) YEARS from the date of signing (1st June 2024 to 31st May 2027).",
                "section": "TERM — Clause 3",
                "clause": "This Agreement shall remain in effect for THREE (3) YEARS from the date of signing.",
                "page_number": 1
            }
        elif any(w in q for w in ["exclusion", "public", "exception"]):
            return {
                "answer": "Under Clause 4, information is excluded from confidentiality if it becomes public without your breach, was independently developed by you, or is required by law/court order to be disclosed.",
                "section": "EXCLUSIONS — Clause 4",
                "clause": "Confidential Information does not include information that: a) Is or becomes publicly known, b) Was independently developed, c) Is required to be disclosed by law.",
                "page_number": 1
            }
        elif any(w in q for w in ["injunction", "breach", "remedy", "harm"]):
            return {
                "answer": "Under Clause 5, breach of this agreement is recognized as potentially causing irreparable harm, allowing InnovateTech to seek immediate injunctive relief from courts in addition to monetary damages.",
                "section": "REMEDIES — Clause 5",
                "clause": "Breach of this Agreement may cause irreparable harm. The Company may seek injunctive relief in addition to other legal remedies.",
                "page_number": 1
            }
        else:
            return {
                "answer": "This is a Unilateral Non-Disclosure Agreement between InnovateTech Pvt. Ltd. and Rahul Gupta for evaluating an AI product. It imposes a 3-year confidentiality obligation with exclusive jurisdiction in Mumbai courts. Ask about duration, exclusions, or remedies!",
                "section": "NDA Overview",
                "clause": None,
                "page_number": 1
            }

    # Document 4: Leave & License Agreement (V2)
    elif "leave and license" in text or doc_id == 4:
        if any(w in q for w in ["fee", "rent", "payment", "cost"]):
            return {
                "answer": "Under the V2 Leave & License agreement, the monthly license fee is ₹25,000 (payable by the 1st of each month). Maintenance of ₹2,000/month is included in this agreement.",
                "section": "LICENSE FEE & MAINTENANCE",
                "clause": "LICENSE FEE: Rs. 25,000/- per month, payable by 1st of each month. MAINTENANCE: Rs. 2,000/- per month (included in this agreement).",
                "page_number": 1
            }
        elif any(w in q for w in ["deposit", "security"]):
            return {
                "answer": "The security deposit in V2 is ₹50,000 (equivalent to 2 months' fee), and it is refundable within 15 days of vacating the premises.",
                "section": "DEPOSIT",
                "clause": "DEPOSIT: Rs. 50,000/- (Two months), refundable within 15 days of vacating.",
                "page_number": 1
            }
        elif any(w in q for w in ["lock-in", "lock in", "notice"]):
            return {
                "answer": "V2 specifies a 3-month lock-in period and a 2-month notice period for either party once the lock-in expires.",
                "section": "LOCK-IN & NOTICE PERIOD",
                "clause": "LOCK-IN: THREE (3) MONTHS lock-in period. NOTICE PERIOD: Two (2) months by either party after lock-in of 3 months.",
                "page_number": 1
            }
        elif any(w in q for w in ["penalty", "late"]):
            return {
                "answer": "Late payment penalty is ₹200 per day, but it only applies after a 7-day grace period.",
                "section": "LATE PAYMENT",
                "clause": "LATE PAYMENT: Rs. 200/- per day after 7 days grace period.",
                "page_number": 1
            }
        else:
            return {
                "answer": "This is a 12-month Leave & License Agreement for Flat 304, Harmony Heights. License fee is ₹25,000/month, deposit is ₹50,000, lock-in is 3 months, and notice period is 2 months. Ask about the deposit, fees, lock-in, or dispute resolution!",
                "section": "Leave & License Overview",
                "clause": None,
                "page_number": 1
            }

    # Document 1: Rental Agreement (Default)
    if any(w in q for w in ["deposit", "security"]):
        return {
            "answer": "According to the document, the security deposit is ₹84,000 (equivalent to 3 months' rent). It is refundable within 30 days of vacating, subject to deductions for damages.",
            "section": "RENT AND PAYMENT — Clause 5",
            "clause": "The Tenant has paid a refundable security deposit of Rs. 84,000/- (Rupees Eighty-Four Thousand Only) equivalent to three months' rent. This deposit shall be refunded within THIRTY (30) days of vacating, subject to deductions for damages.",
            "page_number": 1
        }
    elif any(w in q for w in ["terminate", "early", "exit", "leave", "break"]):
        return {
            "answer": "If you want to leave early (before the 6-month lock-in ends on 30th September 2024), you will forfeit your entire ₹84,000 security deposit and must pay rent for the remaining lock-in period. After the lock-in period, you can terminate by giving 3 months written notice while paying full rent during the notice period.",
            "section": "TERMINATION — Clauses 11 & 14",
            "clause": "During the lock-in period, the Tenant shall not vacate the Premises without forfeiting the security deposit. After lock-in, the Tenant may terminate by providing THREE (3) MONTHS written notice.",
            "page_number": 3
        }
    elif any(w in q for w in ["rent", "payment", "monthly", "pay"]):
        return {
            "answer": "The monthly rent is ₹28,000, due by the 5th of each calendar month. Additionally, you must pay ₹2,500 maintenance to the housing society. If rent is not paid by the 10th, a penalty of ₹500 per day is charged.",
            "section": "RENT AND PAYMENT — Clauses 4, 7, 8",
            "clause": "The Tenant agrees to pay a monthly rent of Rs. 28,000/- on or before the 5th day of each calendar month. Late payment penalty of Rs. 500/- per day shall be charged after the 10th.",
            "page_number": 2
        }
    elif any(w in q for w in ["renewal", "renew", "extend"]):
        return {
            "answer": "The agreement can be renewed by mutual written consent. You must provide written notice of renewal intent at least 60 days before the agreement expires (28th Feb 2025), meaning your notice deadline is 31st December 2024. On renewal, rent increases by 10%.",
            "section": "TERM — Clauses 3 & 6",
            "clause": "The Tenant must provide written notice of renewal intent at least SIXTY (60) days before the expiry of the Term. The monthly rent shall be subject to an annual escalation of TEN PERCENT (10%) upon renewal.",
            "page_number": 1
        }
    elif any(w in q for w in ["expire", "end", "duration", "period", "long", "months"]):
        return {
            "answer": "This agreement runs for 11 months, from 1st April 2024 to 28th February 2025. There is also a 6-month lock-in period that ends on 30th September 2024.",
            "section": "TERM — Clauses 1 & 2",
            "clause": "This Agreement shall commence on 1st April, 2024, and shall continue for a period of ELEVEN (11) MONTHS, expiring on 28th February, 2025.",
            "page_number": 1
        }
    elif any(w in q for w in ["penalty", "fine", "late", "delay"]):
        return {
            "answer": "A late payment penalty of ₹500 per day is charged starting from the 11th of the month if rent is not paid. Additionally, leaving during the 6-month lock-in period means forfeiting the ₹84,000 security deposit.",
            "section": "RENT AND PAYMENT — Clause 7",
            "clause": "In the event the Tenant fails to pay rent by the 10th of the month, a late payment penalty of Rs. 500/- per day shall be charged for each day of delay.",
            "page_number": 2
        }
    elif any(w in q for w in ["dispute", "arbitration", "court", "legal"]):
        return {
            "answer": "Disputes must first be resolved through mutual negotiation (30 days). If unresolved, they go to arbitration under the Arbitration and Conciliation Act, 1996. The agreement is governed by the laws of India and Maharashtra.",
            "section": "GENERAL PROVISIONS — Clause 15",
            "clause": "Any disputes arising from this Agreement shall first be attempted to be resolved through mutual negotiation. If unresolved within 30 days, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996.",
            "page_number": 4
        }
    elif any(w in q for w in ["notice", "inform", "written"]):
        return {
            "answer": "The tenant must give 3 months written notice to terminate after the lock-in period. For renewal, notice must be given 60 days in advance (by 31st December 2024). The landlord can give 1 month notice to terminate for breach of terms.",
            "section": "TERMINATION — Clauses 11 & 12",
            "clause": "The Tenant may terminate this Agreement by providing THREE (3) MONTHS written notice after the lock-in period.",
            "page_number": 3
        }
    else:
        return {
            "answer": "I found this document is a Residential Rental Agreement between Demo Properties Pvt. Ltd. (Landlord) and Aarav Sharma (Tenant) for Flat No. 304, Harmony Heights, Andheri West, Mumbai. The monthly rent is ₹28,000 for 11 months with a ₹84,000 security deposit. Could you ask a more specific question about the rent, deposit, termination, renewal, or penalties?",
            "section": "Document Overview",
            "clause": None,
            "page_number": 1
        }


# ─── COMPARE ───────────────────────────────────────────────────────────────

@router.post("/compare", response_model=CompareResponse)
async def compare_two_documents(
    request: CompareRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Demo comparison
    if request.document_a_id == 1 and request.document_b_id == 4:
        c = DEMO_COMPARISON_ANALYSIS
        return CompareResponse(
            executive_summary=c["executive_summary"],
            comparison_table=c["comparison_table"],
            change_impacts=c["change_impacts"],
            added_clauses=c["added_clauses"],
            removed_clauses=c["removed_clauses"],
            modified_clauses=c["modified_clauses"],
        )

    # Real comparison
    demo_a = _get_demo_doc(request.document_a_id)
    demo_b = _get_demo_doc(request.document_b_id)

    if demo_a:
        text_a = demo_a["text"]
        name_a = demo_a["original_filename"]
    else:
        result = await db.execute(
            select(Document).where(Document.id == request.document_a_id, Document.owner_id == current_user.id)
        )
        doc_a = result.scalar_one_or_none()
        if not doc_a:
            raise HTTPException(status_code=404, detail="Document A not found")
        text_a, _, _ = extract_text_from_file(doc_a.file_path)
        name_a = doc_a.original_filename

    if demo_b:
        text_b = demo_b["text"]
        name_b = demo_b["original_filename"]
    else:
        result = await db.execute(
            select(Document).where(Document.id == request.document_b_id, Document.owner_id == current_user.id)
        )
        doc_b = result.scalar_one_or_none()
        if not doc_b:
            raise HTTPException(status_code=404, detail="Document B not found")
        text_b, _, _ = extract_text_from_file(doc_b.file_path)
        name_b = doc_b.original_filename

    if not settings.is_ai_configured:
        raise HTTPException(status_code=503, detail="AI comparison requires GROK_API_KEY or GEMINI_API_KEY to be configured. Use documents 1 and 4 for the demo comparison.")

    result = await compare_documents(text_a, text_b, name_a, name_b)
    return CompareResponse(
        executive_summary=result.get("executive_summary", ""),
        comparison_table=result.get("comparison_table", []),
        change_impacts=result.get("change_impacts", []),
        added_clauses=result.get("added_clauses", []),
        removed_clauses=result.get("removed_clauses", []),
        modified_clauses=result.get("modified_clauses", []),
    )


# ─── LAWYER BRIEF ──────────────────────────────────────────────────────────

@router.post("/{doc_id}/lawyer-brief", response_model=LawyerBriefOut)
async def create_lawyer_brief(
    doc_id: int,
    request: LawyerBriefRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    demo = _get_demo_doc(doc_id)
    if demo:
        document_text = demo["text"]
        analysis_data = demo.get("analysis") or {}
    else:
        result = await db.execute(
            select(Document).where(Document.id == doc_id, Document.owner_id == current_user.id)
        )
        doc = result.scalar_one_or_none()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        document_text, _, _ = extract_text_from_file(doc.file_path)
        analysis_result = await db.execute(select(Analysis).where(Analysis.document_id == doc_id))
        analysis_obj = analysis_result.scalar_one_or_none()
        analysis_data = {}
        if analysis_obj:
            analysis_data = {
                "document_type": analysis_obj.document_type,
                "summary": analysis_obj.summary,
                "risk_flags": analysis_obj.risk_flags,
            }

    if not settings.is_ai_configured:
        # Demo brief
        brief_content = _demo_lawyer_brief(analysis_data, request.user_concern)
    else:
        brief_content = await generate_lawyer_brief(document_text, analysis_data, request.user_concern)

    if not demo:
        brief = LawyerBrief(
            document_id=doc_id,
            user_concern=request.user_concern,
            content=brief_content,
        )
        db.add(brief)
        await db.commit()
        await db.refresh(brief)
        return LawyerBriefOut.model_validate(brief)

    return LawyerBriefOut(
        id=1,
        document_id=doc_id,
        user_concern=request.user_concern,
        content=brief_content,
        created_at=datetime.now(timezone.utc),
    )


def _demo_lawyer_brief(analysis: dict, user_concern: str = None) -> dict:
    doc_type = (analysis.get("document_type") or "").lower()

    if "employment" in doc_type:
        return {
            "document_type": "Employment Agreement",
            "parties": [
                "Employer: TechNova Solutions Pvt. Ltd.",
                "Employee: Priya Nair"
            ],
            "user_main_concern": user_concern or "Reviewing enforceability of post-employment non-compete and broad IP assignment",
            "executive_summary": "Full-time employment agreement for Senior Software Engineer (Gross CTC ₹14,40,000/yr). Key areas requiring legal attention include a 1-year post-employment non-compete restriction across India, universal IP assignment covering personal devices/time, and a 3-month post-probation exit notice period.",
            "important_clauses": [
                {"title": "Post-Employment Non-Compete", "text": "Clause 12: 1-year ban on joining direct competitors in India", "why_important": "May conflict with Section 27 of Indian Contract Act regarding restraint of trade"},
                {"title": "Intellectual Property Ownership", "text": "Clause 10: Assigns all code created using company or personal resources, inside or outside work hours", "why_important": "Unusually broad scope that could impact personal weekend projects"},
                {"title": "Notice Period", "text": "Clause 13: 3 months written notice or salary buyout after probation", "why_important": "Potential delay for future career mobility"}
            ],
            "potential_issues": [
                {"issue": "Enforceability of 1-Year Non-Compete", "description": "Section 27 of the Indian Contract Act generally renders negative covenants post-employment void as restraint of trade", "suggested_question": "Is this 1-year non-compete enforceable in Indian courts, and how should I address it if changing jobs?"},
                {"issue": "Weekend / Side Project Inventions", "description": "Clause 10 claims ownership of inventions created on personal devices outside working hours", "suggested_question": "Can we carve out an explicit exemption for pre-existing personal GitHub projects?"},
                {"issue": "Notice Buyout Discretion", "description": "Agreement does not clarify whether notice buyout is at the sole discretion of the company or employee option", "suggested_question": "Can I buyout the 3-month notice period unilaterally if needed?"}
            ],
            "important_dates": [
                "Commencement: 1st April, 2024",
                "Probation Ends: 30th June, 2024 (3 months)",
                "Notice Window: 3 months after probation",
                "Non-compete expiry: 12 months post-separation"
            ],
            "financial_terms": [
                "Gross CTC: ₹14,40,000/year (₹1,20,000/month gross)",
                "Performance Bonus: Discretionary as per company policy",
                "Notice Buyout: 3 months' gross salary in lieu of notice"
            ],
            "questions_for_lawyer": [
                "Under Indian jurisprudence and Section 27 of the Contract Act, what is the realistic legal risk of the 1-year non-compete clause?",
                "How can I legally protect personal software and side projects developed outside work hours from Clause 10?",
                "What protections do I have during the 3-month probation period regarding sudden termination?",
                "Is the 3-month notice period standard for tech roles in Karnataka, and what are my legal rights if the employer refuses buyout?"
            ],
            "relevant_sections": ["Clause 4 (Probation)", "Clause 5 (Compensation)", "Clause 10 (IP Assignment)", "Clause 12 (Non-Compete)", "Clause 13 (Termination)"],
            "disclaimer": "This brief was prepared with AI assistance for informational purposes only. It does not constitute legal advice. Please consult a qualified legal professional for advice specific to your situation."
        }

    elif "non-disclosure" in doc_type or "nda" in doc_type:
        return {
            "document_type": "Non-Disclosure Agreement (Unilateral)",
            "parties": [
                "Disclosing Party: InnovateTech Pvt. Ltd.",
                "Receiving Party: Rahul Gupta (Consultant)"
            ],
            "user_main_concern": user_concern or "Evaluating unilateral confidentiality risks and duration for freelance consulting",
            "executive_summary": "Unilateral NDA protecting proprietary AI technology of InnovateTech Pvt. Ltd. Rahul Gupta is subjected to a 3-year confidentiality term with immediate injunctive relief exposure in Mumbai courts. Does not protect consultant's own proprietary materials.",
            "important_clauses": [
                {"title": "Unilateral Scope", "text": "Protects only information disclosed by InnovateTech", "why_important": "Consultant's own IP and suggestions are unprotected"},
                {"title": "3-Year Term", "text": "Confidentiality survives 36 months from signing", "why_important": "Long duration for preliminary evaluation conversations"},
                {"title": "Injunctive Relief", "text": "Company can seek restraining orders for suspected disclosure", "why_important": "Potential legal exposure without proof of monetary damages"}
            ],
            "potential_issues": [
                {"issue": "Lack of Bilateral / Mutual Protection", "description": "Consultant's proprietary workflows, proposals, and tools are not covered", "suggested_question": "Should we convert this into a standard Mutual NDA?"},
                {"issue": "Absence of Document Return / Destruction Protocol", "description": "Agreement does not specify handling of evaluation files upon termination of discussions", "suggested_question": "Can we insert a certified destruction clause upon completion of review?"}
            ],
            "important_dates": [
                "Execution Date: 1st June, 2024",
                "Confidentiality Expiry: 31st May, 2027 (3 Years)"
            ],
            "financial_terms": [
                "Commercial Consideration: ₹0 (Preliminary NDA)",
                "Damages: Uncapped for breach of confidentiality"
            ],
            "questions_for_lawyer": [
                "Is it advisable to sign a unilateral NDA when sharing technical proposals as an independent consultant?",
                "Can the 3-year term be safely negotiated down to 12 or 18 months?",
                "What language should be inserted to protect independently developed general knowledge (residuals clause)?"
            ],
            "relevant_sections": ["Clause 1 (Confidential Information)", "Clause 3 (Term)", "Clause 4 (Exclusions)", "Clause 5 (Remedies)"],
            "disclaimer": "This brief was prepared with AI assistance for informational purposes only. It does not constitute legal advice. Please consult a qualified legal professional for advice specific to your situation."
        }

    elif "leave and license" in doc_type:
        return {
            "document_type": "Residential Leave and License Agreement",
            "parties": [
                "Licensor: Demo Properties Pvt. Ltd.",
                "Licensee: Aarav Sharma"
            ],
            "user_main_concern": user_concern or "Reviewing Leave & License terms, deposit refund terms, and lock-in period",
            "executive_summary": "12-month Leave & License agreement for Flat 304, Harmony Heights, Mumbai. Monthly license fee is ₹25,000 (inclusive of ₹2,000 maintenance) with ₹50,000 refundable deposit. Features a 3-month lock-in, 2-month exit notice, and direct court/consumer forum jurisdiction.",
            "important_clauses": [
                {"title": "License Fee", "text": "₹25,000/month including maintenance", "why_important": "Consolidated monthly payment"},
                {"title": "Deposit Return", "text": "₹50,000 refundable within 15 days", "why_important": "Fast 15-day refund timeline"},
                {"title": "Lock-in Period", "text": "3 months lock-in followed by 2 months notice", "why_important": "More balanced exit flexibility than 6-month leases"}
            ],
            "potential_issues": [
                {"issue": "Online Registration", "description": "Maharashtra requires mandatory online e-registration of residential Leave & License agreements", "suggested_question": "Will the owner complete biometric e-registration?"},
                {"issue": "Permissive Occupancy vs Tenancy", "description": "Leave and license creates license rights rather than tenancy rights under Rent Control Act", "suggested_question": "What rights do I have in case of premature property sale?"}
            ],
            "important_dates": [
                "Start Date: 1st April, 2024",
                "Lock-in Ends: 30th June, 2024 (3 months)",
                "Expiry Date: 31st March, 2025"
            ],
            "financial_terms": [
                "Monthly License Fee: ₹25,000 (due by 1st of month)",
                "Security Deposit: ₹50,000 (refundable in 15 days)",
                "Late Penalty: ₹200/day after 7-day grace period",
                "Escalation: 7% on annual renewal"
            ],
            "questions_for_lawyer": [
                "Does this Leave & License agreement comply with Maharashtra Rent Control Act e-registration requirements?",
                "Are there any hidden liabilities in the included maintenance clause?",
                "What is the statutory recourse if the landlord fails to return the deposit within the promised 15 days?"
            ],
            "relevant_sections": ["License Fee Clause", "Deposit Clause", "Lock-in & Notice Clause", "Dispute Resolution Clause"],
            "disclaimer": "This brief was prepared with AI assistance for informational purposes only. It does not constitute legal advice. Please consult a qualified legal professional for advice specific to your situation."
        }

    # Default / Rental Agreement (doc 1)
    return {
        "document_type": "Residential Rental Agreement",
        "parties": [
            "Landlord: Demo Properties Pvt. Ltd.",
            "Tenant: Aarav Sharma"
        ],
        "user_main_concern": user_concern or "Understanding my obligations and rights under this rental agreement",
        "executive_summary": "This is an 11-month residential rental agreement for Flat 304, Harmony Heights, Mumbai. Monthly rent is ₹28,000 with a ₹84,000 security deposit. A 6-month lock-in period and 3-month notice requirement represent significant commitments.",
        "important_clauses": [
            {"title": "Lock-in Period", "text": "6-month lock-in with deposit forfeiture on early exit", "why_important": "Financial risk if circumstances change in first 6 months"},
            {"title": "Late Payment Penalty", "text": "₹500/day from 10th of month", "why_important": "Cumulative daily penalty without apparent cap"},
            {"title": "Security Deposit", "text": "₹84,000 refundable with undefined deductions", "why_important": "Vague deduction terms could lead to disputes"},
            {"title": "Renewal", "text": "60-day notice required; 10% rent escalation on renewal", "why_important": "Missing the notice deadline could result in eviction"}
        ],
        "potential_issues": [
            {"issue": "Undefined damage deductions", "description": "The agreement does not define what constitutes 'damage' vs normal wear and tear for security deposit deductions", "suggested_question": "Can we add a specific list of what constitutes damage, and request a move-in condition inspection report?"},
            {"issue": "Asymmetric notice periods", "description": "Tenant must give 3 months notice; Landlord only needs 1 month", "suggested_question": "Can the notice periods be made equal?"},
            {"issue": "Arbitrator selection", "description": "Arbitration clause does not specify who selects the arbitrator or who bears the cost", "suggested_question": "Who selects the arbitrator and who pays the arbitration fees?"}
        ],
        "important_dates": [
            "Commencement: 1st April, 2024",
            "Lock-in ends: 30th September, 2024",
            "Renewal notice deadline: 31st December, 2024",
            "Agreement expires: 28th February, 2025"
        ],
        "financial_terms": [
            "Monthly rent: ₹28,000 (due by 5th)",
            "Security deposit: ₹84,000 (refundable within 30 days)",
            "Maintenance: ₹2,500/month (paid separately)",
            "Late penalty: ₹500/day (from 10th of month)",
            "Renewal escalation: 10% annually"
        ],
        "questions_for_lawyer": [
            "Is the 6-month lock-in period enforceable, and what are my options if I need to leave urgently?",
            "How does Maharashtra rental law define 'damages' vs normal wear and tear for deposit deductions?",
            "What are the implications of choosing arbitration over court proceedings for dispute resolution?",
            "Is the 3-month vs 1-month asymmetric notice period standard and enforceable?",
            "Should I request a formal inventory and condition report before signing?"
        ],
        "relevant_sections": ["Section 2 (Lock-in)", "Clause 5 (Deposit)", "Clause 7 (Late Penalty)", "Clause 11 (Termination)", "Clause 15 (Dispute Resolution)"],
        "disclaimer": "This brief was prepared with AI assistance for informational purposes only. It does not constitute legal advice. Please consult a qualified legal professional for advice specific to your situation."
    }


# ─── TIMELINE & OBLIGATIONS ────────────────────────────────────────────────

@router.get("/{doc_id}/timeline")
async def get_timeline(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    demo = _get_demo_doc(doc_id)
    if demo and demo.get("analysis"):
        return {"timeline_events": demo["analysis"].get("timeline_events", [])}

    result = await db.execute(
        select(Analysis).join(Document).where(
            Analysis.document_id == doc_id, Document.owner_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"timeline_events": analysis.timeline_events or []}


@router.get("/{doc_id}/obligations")
async def get_obligations(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    demo = _get_demo_doc(doc_id)
    if demo and demo.get("analysis"):
        return {"obligations": demo["analysis"].get("obligations", [])}

    result = await db.execute(
        select(Analysis).join(Document).where(
            Analysis.document_id == doc_id, Document.owner_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"obligations": analysis.obligations or []}


# ─── DELETE ────────────────────────────────────────────────────────────────

@router.delete("/{doc_id}")
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Prevent deleting demo documents
    if _get_demo_doc(doc_id):
        raise HTTPException(status_code=400, detail="Cannot delete demo documents")

    result = await db.execute(
        select(Document).where(Document.id == doc_id, Document.owner_id == current_user.id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Delete file
    try:
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)
    except:
        pass

    # Delete from ChromaDB
    try:
        rag_service.delete_document_chunks(doc_id)
    except:
        pass

    await db.delete(doc)
    await db.commit()
    return {"message": "Document deleted successfully"}


# ─── STATS ─────────────────────────────────────────────────────────────────

@router.get("/stats/summary")
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    total_docs = await db.execute(
        select(func.count(Document.id)).where(Document.owner_id == current_user.id)
    )
    analyzed = await db.execute(
        select(func.count(Document.id)).where(
            Document.owner_id == current_user.id,
            Document.status == "analyzed"
        )
    )

    return {
        "total_documents": (total_docs.scalar() or 0) + len(DEMO_DOCUMENTS),
        "documents_analyzed": (analyzed.scalar() or 0) + len(DEMO_DOCUMENTS),
        "items_to_review": 5,  # From demo analysis
        "upcoming_deadlines": 3,
        "questions_prepared": 6,
    }
