import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Loader2, FileText, MessageSquare, Info, Globe, File, Shield, ChevronDown, Sparkles } from 'lucide-react';
import { documentsApi } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sourceSection?: string;
  pageNumber?: number;
  relevantClause?: string;
  confidence?: string;
  mode?: string;
  isLoading?: boolean;
}

const documentQuestionsMap: Record<number, string[]> = {
  1: [
    'What is the security deposit amount?',
    'What happens if I terminate early?',
    'What are the late payment penalties?',
    'What is the renewal notice deadline?',
  ],
  2: [
    'What is my gross annual CTC?',
    'How long is the probation period?',
    'Is the 1-year non-compete enforceable?',
    'What are the IP and code assignment terms?',
  ],
  3: [
    'How long does confidentiality last?',
    'What information is excluded from secrecy?',
    'Is this a mutual or unilateral NDA?',
    'What remedies can the company seek for breach?',
  ],
  4: [
    'What is the monthly license fee?',
    'How much is the security deposit?',
    'How long is the lock-in period?',
    'What grace period exists for late payments?',
  ],
};

const generalQuestions = [
  'What is a lock-in period in Indian contracts?',
  'Is a post-employment non-compete enforceable under Section 27?',
  'What is the difference between a Lease and a Leave & License?',
  'Why do rental agreements in India typically run for 11 months?',
];

export default function AskDocument() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentDocId = Number(id) || 1;

  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm NyayaSetu AI. I answer questions grounded strictly in your document's text with section citations and clause quotes.\n\nAsk me anything about terms, deadlines, liabilities, or exit conditions!`,
      mode: 'document',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'document' | 'general'>('document');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    documentsApi.listDocuments().then(setAllDocs).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: question };
    const loadingMsg: Message = { role: 'assistant', content: '', isLoading: true, mode };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await documentsApi.askDocument(currentDocId, question, mode);
      const assistantMsg: Message = {
        role: 'assistant',
        content: response.answer,
        sourceSection: response.source_section,
        pageNumber: response.page_number,
        relevantClause: response.relevant_clause,
        confidence: response.confidence,
        mode: response.mode,
      };
      setMessages(prev => [...prev.slice(0, -1), assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: 'assistant',
        content: err?.response?.data?.detail || 'I encountered an error. Please try again.',
        mode,
      };
      setMessages(prev => [...prev.slice(0, -1), errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestedQuestion = (q: string) => {
    setInput(q);
    sendMessage(q);
  };

  const activeQuestions = mode === 'general'
    ? generalQuestions
    : (documentQuestionsMap[currentDocId] || documentQuestionsMap[1]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4 space-y-3">
      {/* Header */}
      <div className="p-4 border border-gray-100 bg-white rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900 text-base">Ask Your Document</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                Grounded RAG
              </span>
            </div>
            <p className="text-xs text-gray-400">Strictly grounded in document text with section & clause citations</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Document Switcher */}
          {allDocs.length > 0 && (
            <div className="relative">
              <select
                value={currentDocId}
                onChange={(e) => navigate(`/app/document/${e.target.value}/ask`)}
                className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-gray-700 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none"
              >
                {allDocs.map((d) => (
                  <option key={d.id} value={d.id}>
                    Doc #{d.id}: {d.original_filename.slice(0, 24)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('document')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'document' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <File className="w-3 h-3" /> Document Mode
            </button>
            <button
              onClick={() => setMode('general')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'general' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Globe className="w-3 h-3" /> General Legal Info
            </button>
          </div>
        </div>
      </div>

      {/* Mode Banner & Explainability button */}
      <div className="flex items-center justify-between px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <Info className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span>
            {mode === 'document'
              ? 'Answers derived strictly from the active agreement text with verbatim citations.'
              : 'General legal principles under Indian law. Educational overview only, not legal advice.'}
          </span>
        </div>

        <button
          onClick={() => setShowExplainModal(true)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
        >
          <Shield className="w-3 h-3" /> How AI Reached Answer
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mr-2.5 mt-0.5 shadow-sm">
                NS
              </div>
            )}
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-sm shadow-sm'
                  : 'bg-gray-50 border border-gray-200/80 text-gray-800 rounded-tl-sm'
              }`}>
                {msg.isLoading ? (
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(j => (
                        <div key={j} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Scanning document clauses...</span>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>

              {/* Source citation */}
              {msg.role === 'assistant' && !msg.isLoading && (msg.sourceSection || msg.relevantClause) && (
                <div className="mt-2 bg-purple-50/50 border border-purple-100 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-700 font-bold mb-1">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Source Attribution</span>
                    {msg.pageNumber && <span className="text-gray-400 font-normal">· Page {msg.pageNumber}</span>}
                    {msg.confidence && (
                      <span className="ml-auto px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {msg.confidence} confidence
                      </span>
                    )}
                  </div>
                  {msg.sourceSection && (
                    <p className="text-gray-600">
                      <strong className="text-gray-700">Section:</strong> {msg.sourceSection}
                    </p>
                  )}
                  {msg.relevantClause && (
                    <p className="text-gray-700 italic border-l-2 border-purple-300 pl-2 bg-white/70 p-1.5 rounded-r">
                      "{msg.relevantClause}"
                    </p>
                  )}
                </div>
              )}

              {/* Disclaimer */}
              {msg.role === 'assistant' && !msg.isLoading && (
                <p className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.mode === 'document' ? '📄 Sourced from document text' : '🌐 General legal overview'} · Not legal advice
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      <div className="px-4 py-2.5 bg-white rounded-xl border border-gray-100">
        <p className="text-[11px] text-gray-400 mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-600" /> Suggested Inquiries:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {activeQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSuggestedQuestion(q)}
              disabled={loading}
              className="text-xs px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors disabled:opacity-50 font-medium border border-purple-100 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder={mode === 'document' ? 'Ask a specific question about your active document...' : 'Ask a general legal concept under Indian law...'}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-normal disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Explainability Modal */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-purple-700">
                <Shield className="w-5 h-5" />
                <h3 className="font-bold text-base text-gray-900">How AI Formulates Answers</h3>
              </div>
              <button
                onClick={() => setShowExplainModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-1">1. Semantic Retrieval (RAG)</h4>
                <p>
                  Your question is matched against indexed chunks of the uploaded document using vector cosine similarity. Only paragraphs with matching legal context are retrieved.
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">2. Strict Context Grounding</h4>
                <p>
                  The AI is instructed to answer solely using facts stated in the retrieved clauses. If a deadline or figure is not written in the contract, it explicitly states that the document does not contain this information.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-1">3. Direct Verbatim Quotation</h4>
                <p>
                  Every response includes the exact section title and verbatim clause extract so you can verify the statement with your own eyes on the original document.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
