"""
Legal Analysis Service — the core AI pipeline for document intelligence.
Handles document classification, clause extraction, risk flagging, and all analysis modules.
"""
import json
from typing import Dict, Any, List
from loguru import logger
from app.services.ai.llm_service import llm_service
from app.core.config import settings

SYSTEM_PROMPT = """You are NyayaSetu, an AI-powered legal document analysis assistant.
Your role is to help users UNDERSTAND legal documents — not to provide legal advice.

CRITICAL RULES:
- Never claim to be a lawyer or provide legal advice
- Never say a clause is "legal" or "illegal" — say it "may warrant professional review"
- Never fabricate clauses, laws, or information not in the document
- Always be clear when something is uncertain
- Use plain, accessible language
- Add appropriate disclaimers to risk assessments
- Source every claim to the document content provided

You respond only in valid JSON format as specified in each prompt."""


async def analyze_document_full(document_text: str, filename: str) -> Dict[str, Any]:
    """
    Perform full legal health check analysis on a document.
    Returns comprehensive structured analysis.
    """
    # Truncate very long docs for the analysis prompt
    max_chars = 15000
    truncated = document_text[:max_chars]
    if len(document_text) > max_chars:
        truncated += "\n\n[... document continues, truncated for analysis ...]"

    prompt = f"""Analyze the following legal document and provide a comprehensive structured analysis.

DOCUMENT FILENAME: {filename}
DOCUMENT CONTENT:
{truncated}

Respond with a JSON object following this EXACT structure:
{{
  "document_type": "string (e.g., Rental Agreement, Employment Contract, NDA, etc.)",
  "document_type_confidence": 0.0 to 1.0,
  "summary": "string - 3-4 sentence plain language summary of what this document is",
  "parties": [
    {{"role": "string", "name": "string", "description": "string"}}
  ],
  "important_dates": [
    {{"label": "string", "date": "string", "description": "string", "type": "start|end|renewal|notice|payment|other"}}
  ],
  "financial_terms": [
    {{"label": "string", "amount": "string", "frequency": "string", "description": "string", "type": "rent|deposit|penalty|fee|other"}}
  ],
  "obligations": [
    {{"obligation": "string", "party": "string", "deadline": "string or null", "frequency": "string or null", "status": "pending"}}
  ],
  "rights": [
    {{"right": "string", "party": "string", "description": "string"}}
  ],
  "risk_flags": [
    {{"title": "string", "description": "string", "severity": "attention|review|risk|informational", "clause_text": "string", "why_it_matters": "string", "affected_party": "string", "things_to_check": ["string"]}}
  ],
  "unusual_clauses": [
    {{"title": "string", "clause_text": "string", "why_unusual": "string"}}
  ],
  "missing_information": [
    {{"item": "string", "why_important": "string"}}
  ],
  "questions_to_ask": [
    {{"question": "string", "context": "string", "priority": "high|medium|low"}}
  ],
  "action_checklist": [
    {{"action": "string", "description": "string", "priority": "high|medium|low"}}
  ],
  "clauses": [
    {{
      "title": "string",
      "original_text": "string",
      "simple_explanation": "string",
      "very_simple_explanation": "string",
      "why_it_matters": "string",
      "affected_party": "string",
      "things_to_check": ["string"],
      "confidence": "high|medium|low",
      "category": "payment|termination|renewal|liability|confidentiality|obligations|rights|dispute|penalty|other"
    }}
  ],
  "timeline_events": [
    {{"event": "string", "date": "string", "description": "string", "type": "start|payment|renewal|notice|expiry|other", "is_deadline": true/false}}
  ],
  "before_you_sign": {{
    "five_things_to_understand": ["string"],
    "important_commitments": ["string"],
    "dates_to_remember": ["string"],
    "clauses_to_review": ["string"],
    "questions_to_ask": ["string"],
    "information_to_clarify": ["string"]
  }},
  "legal_lens": {{
    "money": [
      {{"title": "string", "detail": "string", "clause_ref": "string"}}
    ],
    "deadlines": [
      {{"title": "string", "detail": "string", "date": "string"}}
    ],
    "risk": [
      {{"title": "string", "detail": "string", "severity": "attention|review|risk"}}
    ],
    "privacy": [
      {{"title": "string", "detail": "string"}}
    ],
    "rights": [
      {{"title": "string", "detail": "string", "party": "string"}}
    ],
    "obligations": [
      {{"title": "string", "detail": "string", "party": "string"}}
    ]
  }}
}}

Important:
- Be thorough but accurate. Only include information actually present in the document.
- Use plain, accessible language for explanations.
- For risk_flags severity: "risk" = potentially problematic, "review" = worth checking, "attention" = important to note, "informational" = good to know.
- Never say anything is "illegal" — say it "may warrant professional legal review".
- Every explanation should be suitable for a non-lawyer to understand."""

    try:
        result = await llm_service.generate_json(prompt, SYSTEM_PROMPT)
        return result
    except Exception as e:
        logger.error(f"Full analysis error: {e}")
        raise


async def ask_document_question(
    question: str,
    document_text: str,
    retrieved_chunks: List[Dict],
    conversation_history: List[Dict] = None
) -> Dict[str, Any]:
    """
    Answer a question grounded in the document content.
    Uses retrieved chunks for RAG-based answering.
    """
    context_parts = []
    for chunk in retrieved_chunks[:5]:
        page_info = f" (Page {chunk['page_number']})" if chunk.get("page_number") else ""
        section_info = f" — Section: {chunk['section_heading']}" if chunk.get("section_heading") else ""
        context_parts.append(f"[Context{page_info}{section_info}]\n{chunk['content']}")

    context = "\n\n---\n\n".join(context_parts) if context_parts else document_text[:3000]

    history_text = ""
    if conversation_history:
        history_text = "\nPrevious conversation:\n"
        for msg in conversation_history[-4:]:
            history_text += f"{msg['role'].upper()}: {msg['content']}\n"

    prompt = f"""A user is asking a question about their uploaded legal document.
Answer ONLY using the document content provided. Do not invent information.

{history_text}

RELEVANT DOCUMENT SECTIONS:
{context}

USER QUESTION: {question}

Respond with a JSON object:
{{
  "answer": "string - direct answer in plain language. If information is not found in document, say 'I couldn't find this information in the uploaded document.'",
  "source_section": "string or null - section/heading where the answer was found",
  "page_number": number or null,
  "relevant_clause": "string or null - the exact text from the document that answers this",
  "confidence": "high|medium|low",
  "not_found": true/false,
  "follow_up_suggestions": ["string - 2-3 related questions the user might want to ask"]
}}

RULES:
- If the information is not in the document, set not_found=true and say so clearly in the answer
- Never fabricate information
- Quote directly from the document when possible
- Keep the answer clear and understandable for a non-lawyer"""

    try:
        result = await llm_service.generate_json(prompt, SYSTEM_PROMPT)
        return result
    except Exception as e:
        logger.error(f"Ask document error: {e}")
        raise


async def compare_documents(
    text_a: str,
    text_b: str,
    name_a: str = "Document A",
    name_b: str = "Document B"
) -> Dict[str, Any]:
    """Generate a clause-by-clause comparison of two documents."""
    max_chars = 8000
    truncated_a = text_a[:max_chars]
    truncated_b = text_b[:max_chars]

    prompt = f"""Compare these two legal documents and provide a detailed clause-by-clause analysis.

DOCUMENT A ({name_a}):
{truncated_a}

---

DOCUMENT B ({name_b}):
{truncated_b}

Respond with a JSON object:
{{
  "executive_summary": "string - 3-4 sentences summarizing the key differences",
  "comparison_table": [
    {{
      "category": "string (e.g., Payment, Duration, Termination, etc.)",
      "document_a": "string - what Document A says, or 'Not specified'",
      "document_b": "string - what Document B says, or 'Not specified'",
      "difference": "string - plain language description of the difference",
      "significance": "high|medium|low"
    }}
  ],
  "change_impacts": [
    {{
      "title": "string",
      "original": "string - what Document A says",
      "new": "string - what Document B says",
      "what_changed": "string",
      "who_may_be_affected": "string",
      "what_to_ask": "string"
    }}
  ],
  "added_clauses": ["string - clauses in B not in A"],
  "removed_clauses": ["string - clauses in A not in B"],
  "modified_clauses": [
    {{"title": "string", "original": "string", "modified": "string", "impact": "string"}}
  ]
}}

RULES:
- Do NOT say one contract is "better" — say differences "may be important depending on your situation"
- Cover all standard categories: Payment, Duration, Termination, Renewal, Liability, Confidentiality, IP, Dispute Resolution, Notice Period, Penalties, etc.
- Be objective and factual
- Use plain language"""

    try:
        result = await llm_service.generate_json(prompt, SYSTEM_PROMPT)
        return result
    except Exception as e:
        logger.error(f"Comparison error: {e}")
        raise


async def generate_lawyer_brief(
    document_text: str,
    analysis: Dict,
    user_concern: str = None
) -> Dict[str, Any]:
    """Generate a professional lawyer brief summarizing the document for a legal consultation."""
    max_chars = 8000
    truncated = document_text[:max_chars]

    concern_text = f"\nUSER'S MAIN CONCERN: {user_concern}" if user_concern else ""

    prompt = f"""Generate a concise, professional lawyer brief for someone preparing to consult a legal professional.

DOCUMENT TYPE: {analysis.get('document_type', 'Legal Document')}
{concern_text}

DOCUMENT CONTENT:
{truncated}

EXISTING ANALYSIS SUMMARY: {analysis.get('summary', '')}

Respond with a JSON object:
{{
  "document_type": "string",
  "parties": ["string - party descriptions"],
  "user_main_concern": "string",
  "executive_summary": "string - 2-3 sentences for the lawyer",
  "important_clauses": [
    {{"title": "string", "text": "string", "why_important": "string"}}
  ],
  "potential_issues": [
    {{"issue": "string", "description": "string", "suggested_question": "string"}}
  ],
  "important_dates": ["string"],
  "financial_terms": ["string"],
  "questions_for_lawyer": ["string - specific questions based on the document"],
  "relevant_sections": ["string - section names/references"],
  "disclaimer": "This brief was prepared with AI assistance for informational purposes. It does not constitute legal advice. Please consult a qualified legal professional for advice specific to your situation."
}}"""

    try:
        result = await llm_service.generate_json(prompt, SYSTEM_PROMPT)
        return result
    except Exception as e:
        logger.error(f"Lawyer brief error: {e}")
        raise


async def general_legal_info(question: str, jurisdiction: str = "India") -> Dict[str, Any]:
    """Provide general legal information (not document-specific)."""
    prompt = f"""A user has asked a general legal question. Provide helpful general legal INFORMATION (not advice).

JURISDICTION: {jurisdiction}
QUESTION: {question}

Respond with a JSON object:
{{
  "answer": "string - general legal information in plain language",
  "disclaimer": "This is general legal information only, not legal advice. Laws vary by jurisdiction and individual circumstances differ. Please consult a qualified legal professional for advice specific to your situation.",
  "jurisdiction_note": "string - note about jurisdiction limitations",
  "related_topics": ["string - related topics the user might want to research"],
  "confidence": "high|medium|low"
}}

RULES:
- Provide information, not advice
- Clearly distinguish between general principles and specific legal advice
- Never fabricate laws or cases
- Always recommend consulting a legal professional for specific situations"""

    try:
        result = await llm_service.generate_json(prompt, SYSTEM_PROMPT)
        return result
    except Exception as e:
        logger.error(f"General legal info error: {e}")
        raise
