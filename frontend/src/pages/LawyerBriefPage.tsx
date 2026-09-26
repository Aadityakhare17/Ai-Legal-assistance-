import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, Users, Calendar, DollarSign, AlertTriangle, HelpCircle,
  Copy, Download, Printer, Check, ArrowLeft, Loader2, Sparkles, Send, ShieldAlert, BookOpen
} from 'lucide-react';
import { documentsApi } from '../services/api';
import toast from 'react-hot-toast';

interface BriefContent {
  document_type: string;
  parties: string[];
  user_main_concern: string;
  executive_summary: string;
  important_clauses: Array<{
    title: string;
    text: string;
    why_important: string;
  }>;
  potential_issues: Array<{
    issue: string;
    description: string;
    suggested_question: string;
  }>;
  important_dates: string[];
  financial_terms: string[];
  questions_for_lawyer: string[];
  relevant_sections: string[];
  disclaimer: string;
}

export default function LawyerBriefPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [concern, setConcern] = useState('');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<BriefContent | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateBrief();
  }, [id]);

  const generateBrief = async (customConcern?: string) => {
    setLoading(true);
    try {
      const docId = id ? Number(id) : 1;
      const res = await documentsApi.createLawyerBrief(docId, customConcern || concern);
      if (res && res.content) {
        setBrief(res.content);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to generate lawyer brief');
    } finally {
      setLoading(false);
    }
  };

  const handleConcernSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concern.trim()) return;
    generateBrief(concern);
  };

  const handleCopy = () => {
    if (!brief) return;
    const text = `
NYAYASETU — LAWYER CONSULTATION BRIEF
======================================
DOCUMENT TYPE: ${brief.document_type}
PARTIES: ${brief.parties?.join(' vs. ')}
USER'S PRIMARY CONCERN: ${brief.user_main_concern}

EXECUTIVE SUMMARY FOR COUNSEL:
${brief.executive_summary}

FINANCIAL COMMITMENTS:
${brief.financial_terms?.map(f => `• ${f}`).join('\n')}

CRITICAL DATES & DEADLINES:
${brief.important_dates?.map(d => `• ${d}`).join('\n')}

POTENTIAL ISSUES FOR LEGAL COUNSEL TO REVIEW:
${brief.potential_issues?.map(p => `• Issue: ${p.issue}\n  Details: ${p.description}\n  Suggested Inquiry: ${p.suggested_question}`).join('\n\n')}

TARGET QUESTIONS TO ASK THE LAWYER:
${brief.questions_for_lawyer?.map((q, i) => `${i + 1}. ${q}`).join('\n')}

RELEVANT SECTIONS:
${brief.relevant_sections?.join(', ')}

DISCLAIMER:
${brief.disclaimer}
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Brief copied to clipboard in clean Markdown!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!brief) return;
    const text = `# NYAYASETU LAWYER CONSULTATION BRIEF\n\n**Document:** ${brief.document_type}\n**Parties:** ${brief.parties?.join(' & ')}\n**Client Concern:** ${brief.user_main_concern}\n\n## Executive Summary\n${brief.executive_summary}\n\n## Critical Questions for Counsel\n${brief.questions_for_lawyer?.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n## Potential Risks to Check\n${brief.potential_issues?.map(p => `- **${p.issue}:** ${p.description}\n  *Ask:* ${p.suggested_question}`).join('\n')}\n\n---\n*${brief.disclaimer}*`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `Lawyer_Brief_${brief.document_type.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded lawyer brief as Markdown document');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analysis
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!brief || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Brief'}</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={!brief || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={!brief || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md print:bg-white print:text-black print:p-0 print:shadow-none">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2 border border-blue-400/20 print:hidden">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>10-Minute Consultation Maximizer</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Prepare My Lawyer Brief</h1>
          <p className="text-blue-100 text-sm mt-1 print:text-gray-600">
            A structured, professional executive brief designed to make your 15-minute or 30-minute legal consultation 5x more productive.
          </p>
        </div>
      </div>

      {/* User Concern customization input */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm print:hidden space-y-3">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Custom Consultation Focus or Concern (Optional)
        </label>
        <form onSubmit={handleConcernSubmit} className="flex gap-2">
          <input
            type="text"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="e.g., 'I want to know if the 6-month lock-in period is negotiable if my job transfers me'"
            className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
          />
          <button
            type="submit"
            disabled={loading || !concern.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Regenerate Focus</span>
          </button>
        </form>
        <div className="flex flex-wrap gap-1.5 text-xs text-gray-500 items-center">
          <span className="font-semibold text-gray-400">Quick templates:</span>
          {['Early Exit & Penalties', 'Security Deposit Protection', 'Asymmetric Termination', 'Liability Caps'].map((tmpl) => (
            <button
              key={tmpl}
              type="button"
              onClick={() => {
                setConcern(tmpl);
                generateBrief(tmpl);
              }}
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors text-[11px] font-medium"
            >
              {tmpl}
            </button>
          ))}
        </div>
      </div>

      {/* The Printable Brief Sheet */}
      {loading && (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 text-sm">Drafting Lawyer Consultation Brief...</h3>
          <p className="text-xs text-gray-400 mt-1">Extracting high-priority questions and condensing legal facts.</p>
        </div>
      )}

      {!loading && brief && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 print:border-0 print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="border-b border-gray-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-blue-600">
                NyayaSetu AI Document Intelligence
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                Client Consultation Brief: {brief.document_type}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Parties:</strong> {brief.parties?.join(' • ')}
              </p>
            </div>
            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-xl border border-blue-100 text-xs flex-shrink-0">
              <span className="font-semibold block">Client Focus:</span>
              <span className="italic">{brief.user_main_concern}</span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Executive Overview
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {brief.executive_summary}
            </p>
          </div>

          {/* Section 2: Questions for Counsel */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> Target Questions for Legal Counsel
            </h3>
            <div className="space-y-2">
              {brief.questions_for_lawyer?.map((q, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs">
                  <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-purple-950 font-medium leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Potential Issues to Discuss */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Potential Ambiguities & Red Flags
            </h3>
            <div className="space-y-2.5">
              {brief.potential_issues?.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-900">{item.issue}</h4>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Needs Verification
                    </span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-amber-800 font-medium italic pt-1">
                    ↳ <strong>Suggested Ask:</strong> "{item.suggested_question}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Key Facts (Dates & Financials) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Financials */}
            <div className="space-y-2 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" /> Financial Commitments
              </h4>
              <ul className="space-y-1.5">
                {brief.financial_terms?.map((term, i) => (
                  <li key={i} className="text-xs text-emerald-950 font-medium flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dates */}
            <div className="space-y-2 bg-blue-50/30 p-4 rounded-xl border border-blue-100">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-700" /> Timeline & Deadlines
              </h4>
              <ul className="space-y-1.5">
                {brief.important_dates?.map((dt, i) => (
                  <li key={i} className="text-xs text-blue-950 font-medium flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{dt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Relevant Sections */}
          {brief.relevant_sections?.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                Relevant Document Sections Referenced:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {brief.relevant_sections.map((sec, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer Box */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-[11px] leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> {brief.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
