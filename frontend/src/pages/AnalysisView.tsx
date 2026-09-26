import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Info, Eye, Calendar, DollarSign, Shield,
  Clock, FileText, Users, MessageSquare, ChevronDown, ChevronUp, Loader2,
  Scale, List, ArrowRight, BookOpen, Bookmark, Download, Zap
} from 'lucide-react';
import { documentsApi } from '../services/api';
import toast from 'react-hot-toast';

interface Analysis {
  document_type: string;
  document_type_confidence: number;
  summary: string;
  parties: any[];
  important_dates: any[];
  financial_terms: any[];
  obligations: any[];
  rights: any[];
  risk_flags: any[];
  unusual_clauses: any[];
  missing_information: any[];
  questions_to_ask: any[];
  action_checklist: any[];
  clauses: any[];
  timeline_events: any[];
  before_you_sign: any;
  legal_lens: any;
}

const severityConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  risk: { label: 'Potential Risk', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
  review: { label: 'Review Recommended', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Eye },
  attention: { label: 'Attention Needed', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Info },
  informational: { label: 'Informational', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: Info },
};

const lensConfig = [
  { key: 'money', label: '💰 Money', desc: 'Payments, fees, penalties' },
  { key: 'deadlines', label: '⏰ Deadlines', desc: 'Dates, renewals, notices' },
  { key: 'risk', label: '⚠️ Risk', desc: 'Liabilities, penalties, termination' },
  { key: 'privacy', label: '🔐 Privacy', desc: 'Data, confidentiality' },
  { key: 'rights', label: '💡 Rights', desc: 'Permissions, entitlements' },
  { key: 'obligations', label: '📋 Obligations', desc: 'Responsibilities' },
];

function RiskFlag({ flag }: { flag: any }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = severityConfig[flag.severity] || severityConfig.attention;
  const Icon = cfg.icon;
  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.color}`} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-800 text-sm">{flag.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
                {cfg.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {expanded && (
        <div className="mt-4 pl-8 space-y-3">
          {flag.clause_text && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-1">Original Clause</p>
              <p className="text-sm text-gray-700 italic">"{flag.clause_text}"</p>
            </div>
          )}
          {flag.why_it_matters && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Why It Matters</p>
              <p className="text-sm text-gray-600">{flag.why_it_matters}</p>
            </div>
          )}
          {flag.things_to_check?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Things to Check</p>
              <ul className="space-y-1">
                {flag.things_to_check.map((t: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">→</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
            ⚠️ This is general information, not legal advice. Professional review may be appropriate.
          </p>
        </div>
      )}
    </div>
  );
}

function ClauseCard({ clause, simplificationLevel }: { clause: any; simplificationLevel: string }) {
  const [expanded, setExpanded] = useState(false);
  const confidenceColors: Record<string, string> = {
    high: 'text-green-600 bg-green-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-red-600 bg-red-50',
  };
  const explanation = simplificationLevel === 'very_simple'
    ? clause.very_simple_explanation
    : simplificationLevel === 'simple'
    ? clause.simple_explanation
    : clause.original_text;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h4 className="font-semibold text-gray-800 text-sm">{clause.title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${confidenceColors[clause.confidence] || confidenceColors.medium}`}>
              {clause.confidence} confidence
            </span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full capitalize">{clause.category}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-400 mb-1">Original Clause Text</p>
            <p className="text-sm text-gray-700 italic">"{clause.original_text}"</p>
          </div>
          {simplificationLevel !== 'standard' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">Standard Explanation</p>
              <p className="text-sm text-gray-600">{clause.simple_explanation}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">Why It Matters</p>
              <p className="text-gray-600">{clause.why_it_matters}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">Affected Party</p>
              <p className="text-gray-600">{clause.affected_party}</p>
            </div>
          </div>
          {clause.things_to_check?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">Things to Check</p>
              {clause.things_to_check.map((t: string, i: number) => (
                <p key={i} className="text-sm text-gray-600 flex items-start gap-2 mt-1">
                  <span className="text-blue-400">→</span> {t}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LegalLensView({ lensData, activeLens }: { lensData: any; activeLens: string }) {
  const data = lensData?.[activeLens] || [];
  if (!data.length) return <p className="text-sm text-gray-400 py-4 text-center">No items found for this lens.</p>;
  return (
    <div className="space-y-3">
      {data.map((item: any, i: number) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
          <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.detail || item.description || ''}</p>
          {item.date && <p className="text-xs text-blue-600 mt-1 font-medium">📅 {item.date}</p>}
          {item.amount && <p className="text-xs text-green-600 mt-1 font-medium">💰 {item.amount}</p>}
          {item.clause_ref && <p className="text-xs text-gray-400 mt-1">{item.clause_ref}</p>}
          {item.severity && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-2 inline-block ${
              item.severity === 'risk' ? 'bg-red-50 text-red-600' :
              item.severity === 'review' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
            }`}>{item.severity}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function BeforeYouSignPanel({ data }: { data: any }) {
  if (!data) return null;
  const sections = [
    { key: 'five_things_to_understand', label: '5 Things To Understand', icon: '💡', color: 'blue' },
    { key: 'important_commitments', label: 'Important Commitments', icon: '📌', color: 'amber' },
    { key: 'dates_to_remember', label: 'Dates To Remember', icon: '📅', color: 'red' },
    { key: 'clauses_to_review', label: 'Clauses To Review', icon: '🔍', color: 'purple' },
    { key: 'questions_to_ask', label: 'Questions To Ask', icon: '❓', color: 'green' },
    { key: 'information_to_clarify', label: 'Information To Clarify', icon: '🗒️', color: 'gray' },
  ];
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">📋 Review Complete</p>
        <p className="text-sm text-amber-700">Here are the areas you may want to understand before signing. This is general information, not legal advice.</p>
      </div>
      {sections.map(({ key, label, icon }) => {
        const items: string[] = data[key] || [];
        if (!items.length) return null;
        return (
          <div key={key} className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">{icon} {label}</h4>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-gray-300 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

type Tab = 'overview' | 'clauses' | 'obligations' | 'timeline' | 'lens' | 'before-sign';

export default function AnalysisView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeLens, setActiveLens] = useState('money');
  const [simplificationLevel, setSimplificationLevel] = useState<'standard' | 'simple' | 'very_simple'>('simple');
  const [obligationStatuses, setObligationStatuses] = useState<Record<number, string>>({});

  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [showExplainModal, setShowExplainModal] = useState(false);

  useEffect(() => {
    documentsApi.listDocuments().then(setAllDocs).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    documentsApi.getAnalysis(Number(id))
      .then(setAnalysis)
      .catch(() => toast.error('Could not load analysis'))
      .finally(() => setLoading(false));
  }, [id]);

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: FileText },
    { key: 'clauses', label: 'Clauses', icon: BookOpen },
    { key: 'obligations', label: 'Obligations', icon: List },
    { key: 'timeline', label: 'Timeline', icon: Clock },
    { key: 'lens', label: 'Legal Lens', icon: Eye },
    { key: 'before-sign', label: 'Before You Sign', icon: Bookmark },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-gray-500">Loading analysis...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 p-6">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <p className="text-gray-600 font-medium">Analysis not available</p>
        <p className="text-sm text-gray-400">The document may still be processing. Please wait a moment.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Refresh</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto print:p-0">
      {/* Document Switcher & Action Top Bar */}
      <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex-wrap gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Document:</span>
          <select
            value={id || '1'}
            onChange={(e) => navigate(`/app/document/${e.target.value}`)}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {allDocs.map((d) => (
              <option key={d.id} value={d.id}>
                #{d.id}: {d.original_filename} {d.is_demo ? '(Demo)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExplainModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>How AI Reached This</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4 print:mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full">{analysis.document_type}</span>
            <span className="text-xs text-gray-400">{Math.round(analysis.document_type_confidence * 100)}% confidence</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Legal Health Check</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">{analysis.summary}</p>
        </div>
        <div className="flex gap-2 flex-wrap print:hidden">
          <button
            onClick={() => navigate(`/app/document/${id}/ask`)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Ask Document
          </button>
          <button
            onClick={() => navigate(`/app/brief/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" /> Lawyer Brief
          </button>
        </div>
      </div>

      {/* Explainability Modal */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Shield className="w-5 h-5" />
                <h3 className="font-bold text-base text-gray-900">Explainable AI: Methodology & Guardrails</h3>
              </div>
              <button
                onClick={() => setShowExplainModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> 1. Structured Clause Extraction
                </h4>
                <p>
                  NyayaSetu ingests the raw document text and breaks it into semantic chunks using natural paragraph and section boundaries. Each chunk is parsed to identify contractual commitments, parties, monetary figures, and dates.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span> 2. Risk Detection & Severity Categorization
                </h4>
                <p>
                  Clauses containing asymmetric notice periods, universal IP assignments, uncapped penalties, or lock-in deposit forfeitures are tagged with severity tiers (<em>Potential Risk</em>, <em>Review Recommended</em>, <em>Attention Needed</em>). The system explains <strong>why</strong> it matters rather than declaring anything illegal.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 3. Strict Source Attribution (Zero Fabrication)
                </h4>
                <p>
                  Every insight is tied to verbatim excerpts from the document. The AI operates under strict instructions to cite original clauses and state when information (like condition inventories) is absent from the text.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Risk summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Risk Flags', value: analysis.risk_flags?.length || 0, color: 'red', icon: AlertTriangle },
          { label: 'Key Clauses', value: analysis.clauses?.length || 0, color: 'blue', icon: FileText },
          { label: 'Obligations', value: analysis.obligations?.length || 0, color: 'amber', icon: List },
          { label: 'Questions', value: analysis.questions_to_ask?.length || 0, color: 'purple', icon: MessageSquare },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
            <p className={`text-xs text-${color}-600 font-medium mt-0.5`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Language simplifier */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-gray-500 font-medium">Reading Level:</span>
        {(['standard', 'simple', 'very_simple'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setSimplificationLevel(l)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              simplificationLevel === l
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {l === 'standard' ? 'Legal' : l === 'simple' ? 'Simple' : 'Very Simple'}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === key ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Parties */}
          {analysis.parties?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Parties Involved</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {analysis.parties.map((p, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{p.role}</p>
                    <p className="font-medium text-gray-800 mt-0.5">{p.name}</p>
                    {p.description && <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Flags */}
          {analysis.risk_flags?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Risk & Review Flags
              </h3>
              <div className="space-y-3">
                {analysis.risk_flags.map((f, i) => <RiskFlag key={i} flag={f} />)}
              </div>
            </div>
          )}

          {/* Financial Terms */}
          {analysis.financial_terms?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Financial Terms</h3>
              <div className="space-y-2">
                {analysis.financial_terms.map((f, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-700 text-sm">{f.label}</p>
                      {f.description && <p className="text-xs text-gray-400 mt-0.5">{f.description}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-sm">{f.amount}</p>
                      {f.frequency && <p className="text-xs text-gray-400">{f.frequency}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Info */}
          {analysis.missing_information?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> Missing / Unclear Information</h3>
              {analysis.missing_information.map((m, i) => (
                <div key={i} className="py-2 border-b border-gray-50 last:border-0">
                  <p className="font-medium text-sm text-gray-700">{m.item}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.why_important}</p>
                </div>
              ))}
            </div>
          )}

          {/* Questions to Ask */}
          {analysis.questions_to_ask?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> Questions to Ask a Lawyer</h3>
              <div className="space-y-2">
                {analysis.questions_to_ask.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${
                      q.priority === 'high' ? 'bg-red-50 text-red-600' :
                      q.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'
                    }`}>{q.priority}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{q.question}</p>
                      {q.context && <p className="text-xs text-gray-400 mt-0.5">{q.context}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Checklist */}
          {analysis.action_checklist?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Action Checklist</h3>
              <div className="space-y-2">
                {analysis.action_checklist.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                      a.priority === 'high' ? 'border-red-400' : 'border-gray-300'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'clauses' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">Showing explanations in <strong>{simplificationLevel.replace('_', ' ')}</strong> mode. Use the Reading Level selector above to change.</p>
          {analysis.clauses?.map((c, i) => (
            <ClauseCard key={i} clause={c} simplificationLevel={simplificationLevel} />
          ))}
        </div>
      )}

      {activeTab === 'obligations' && (
        <div className="space-y-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Obligation</th>
                  <th className="px-4 py-3 text-left">Party</th>
                  <th className="px-4 py-3 text-left">Deadline</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {analysis.obligations?.map((o, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-medium">{o.obligation}</td>
                    <td className="px-4 py-3 text-gray-500">{o.party}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{o.deadline || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={obligationStatuses[i] || o.status || 'pending'}
                        onChange={(e) => setObligationStatuses(prev => ({ ...prev, [i]: e.target.value }))}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${
                          (obligationStatuses[i] || o.status) === 'completed' ? 'bg-green-100 text-green-700' :
                          (obligationStatuses[i] || o.status) === 'needs_review' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="needs_review">Needs Review</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-blue-100" />
          <div className="space-y-4">
            {analysis.timeline_events?.map((event, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className={`w-12 h-12 rounded-full border-4 flex-shrink-0 flex items-center justify-center text-sm font-bold z-10 ${
                  event.is_deadline ? 'border-red-400 bg-red-50 text-red-600' :
                  event.type === 'start' ? 'border-green-400 bg-green-50 text-green-600' :
                  event.type === 'payment' ? 'border-amber-400 bg-amber-50 text-amber-600' :
                  'border-blue-300 bg-blue-50 text-blue-600'
                }`}>
                  {event.type === 'start' ? '▶' : event.type === 'payment' ? '₹' : event.is_deadline ? '!' : i + 1}
                </div>
                <div className={`flex-1 bg-white rounded-xl border p-4 ${event.is_deadline ? 'border-red-200' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{event.event}</p>
                      <p className="text-xs text-blue-600 font-medium mt-0.5">{event.date}</p>
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    </div>
                    {event.is_deadline && (
                      <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded-full font-medium">Deadline</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'lens' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {lensConfig.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveLens(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeLens === key ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <LegalLensView lensData={analysis.legal_lens} activeLens={activeLens} />
        </div>
      )}

      {activeTab === 'before-sign' && <BeforeYouSignPanel data={analysis.before_you_sign} />}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          <strong>AI-generated analysis</strong> · This is general information, not legal advice.
          Every insight is based on the document text provided.
          Please consult a qualified legal professional for advice specific to your situation.
        </p>
      </div>
    </div>
  );
}
