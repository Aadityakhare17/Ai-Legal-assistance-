from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime


class DocumentOut(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_size: int
    file_type: str
    page_count: int
    word_count: int
    status: str
    is_demo: bool
    error_message: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class AnalysisOut(BaseModel):
    id: int
    document_id: int
    document_type: Optional[str]
    document_type_confidence: float
    summary: Optional[str]
    parties: Optional[Any]
    important_dates: Optional[Any]
    financial_terms: Optional[Any]
    obligations: Optional[Any]
    rights: Optional[Any]
    risk_flags: Optional[Any]
    unusual_clauses: Optional[Any]
    missing_information: Optional[Any]
    questions_to_ask: Optional[Any]
    action_checklist: Optional[Any]
    clauses: Optional[Any]
    timeline_events: Optional[Any]
    before_you_sign: Optional[Any]
    legal_lens: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True


class AskRequest(BaseModel):
    question: str
    mode: str = "document"  # document | general
    conversation_id: Optional[int] = None


class AskResponse(BaseModel):
    answer: str
    source_section: Optional[str] = None
    page_number: Optional[int] = None
    relevant_clause: Optional[str] = None
    sources: Optional[List[Dict]] = None
    confidence: Optional[str] = None
    mode: str = "document"
    disclaimer: str = "This is general information, not legal advice."


class CompareRequest(BaseModel):
    document_a_id: int
    document_b_id: int


class CompareResponse(BaseModel):
    executive_summary: str
    comparison_table: List[Dict]
    change_impacts: List[Dict]
    added_clauses: List[str]
    removed_clauses: List[str]
    modified_clauses: List[Dict]


class LawyerBriefRequest(BaseModel):
    user_concern: Optional[str] = None


class LawyerBriefOut(BaseModel):
    id: int
    document_id: int
    user_concern: Optional[str]
    content: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True


class ObligationUpdate(BaseModel):
    obligation_index: int
    status: str  # pending | completed | needs_review


class ConversationMessage(BaseModel):
    role: str  # user | assistant
    content: str
    sources: Optional[List[Dict]] = None
    timestamp: Optional[datetime] = None
