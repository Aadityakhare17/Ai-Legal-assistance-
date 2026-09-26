import React, { useState, useEffect } from 'react';
import { GitCompare, Scale, AlertCircle, ArrowRight, CheckCircle2, FileText, Info, Loader2, Sparkles, RefreshCw, ChevronDown, HelpCircle } from 'lucide-react';
import { documentsApi } from '../services/api';
import toast from 'react-hot-toast';

interface CompareResult {
  executive_summary: string;
  comparison_table: Array<{
    category: string;
    document_a: string;
    document_b: string;
    difference: string;
    significance?: 'high' | 'medium' | 'low';
  }>;
  change_impacts: Array<{
    title: string;
    original: string;
    new: string;
    what_changed: string;
    who_may_be_affected: string;
    what_to_ask: string;
  }>;
  added_clauses: string[];
  removed_clauses: string[];
  modified_clauses: Array<{
    title: string;
    original: string;
    modified: string;
    impact: string;
  }>;
}

interface DocOption {
  id: number;
  original_filename: string;
  is_demo?: boolean;
}

export default function CompareDocuments() {
  const [documents, setDocuments] = useState<DocOption[]>([]);
  const [docAId, setDocAId] = useState<number>(1);
  const [docBId, setDocBId] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'impact' | 'table' | 'diffs'>('impact');

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const list = await documentsApi.listDocuments();
      setDocuments(list);
      // Auto trigger demo comparison on mount
      runComparison(1, 4);
    } catch {
      toast.error('Failed to load document list');
    }
  };

  const runComparison = async (aId: number, bId: number) => {
    if (aId === bId) {
      toast.error('Please choose two different documents to compare.');
      return;
    }
    setLoading(true);
    try {
      const res = await documentsApi.compareDocuments(aId, bId);
      setResult(res);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Comparison failed. Select Demo documents 1 & 4.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runComparison(docAId, docBId);
  };

  const docAName = documents.find(d => d.id === docAId)?.original_filename || 'Document A';
  const docBName = documents.find(d => d.id === docBId)?.original_filename || 'Document B';

  const categories = result ? Array.from(new Set(result.comparison_table.map(r => r.category))) : [];
  const filteredTable = result
    ? filterCategory === 'all'
      ? result.comparison_table
      : result.comparison_table.filter(r => r.category === filterCategory)
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>AI Contract Comparison Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contract Comparison & Change Impact</h1>
          <p className="text-gray-500 text-sm mt-1">
            Compare two contracts clause-by-clause. Discover hidden modifications, removed obligations, and risk differences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setDocAId(1);
            setDocBId(4);
            runComparison(1, 4);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors border border-purple-200 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Load Preset Demo Comparison (Rental v1 vs v2)</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <form onSubmit={handleCompareSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Doc A */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> Document A (Base / Original)
            </label>
            <div className="relative">
              <select
                value={docAId}
                onChange={(e) => setDocAId(Number(e.target.value))}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer pr-10"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.original_filename} {d.is_demo ? '(Demo)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Compare Icon Button */}
          <div className="md:col-span-2 flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Comparing...</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-4 h-4" />
                  <span>Compare</span>
                </>
              )}
            </button>
          </div>

          {/* Doc B */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Document B (Modified / New Offer)
            </label>
            <div className="relative">
              <select
                value={docBId}
                onChange={(e) => setDocBId(Number(e.target.value))}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer pr-10"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.original_filename} {d.is_demo ? '(Demo)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </form>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
            <GitCompare className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-semibold text-gray-800">Synthesizing Clause Intelligence...</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Extracting clauses, aligning provisions, detecting modifications, and calculating Change Impact.
          </p>
        </div>
      )}

      {/* Results View */}
      {!loading && result && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 translate-x-8 -translate-y-8">
              <Scale className="w-64 h-64 text-white" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2 backdrop-blur-sm border border-blue-400/20">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Executive Comparison Summary</span>
              </div>
              <p className="text-sm md:text-base leading-relaxed text-blue-50 font-normal">
                {result.executive_summary}
              </p>
              <div className="mt-4 pt-4 border-t border-blue-800/60 flex flex-wrap gap-4 text-xs text-blue-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span><strong>Doc A:</strong> {docAName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span><strong>Doc B:</strong> {docBName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                {result.change_impacts?.length || 0}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Key Change Impacts</p>
                <p className="text-sm font-bold text-gray-800">Significant Shifts</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                {result.comparison_table?.length || 0}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Points Compared</p>
                <p className="text-sm font-bold text-gray-800">Clause Alignments</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                {(result.removed_clauses?.length || 0) + (result.added_clauses?.length || 0)}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Structural Diff</p>
                <p className="text-sm font-bold text-gray-800">Additions / Deletions</p>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('impact')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'impact'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Change Impact Analysis (USP)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {result.change_impacts?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'table'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Clause-by-Clause Matrix</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {result.comparison_table?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('diffs')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'diffs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Added & Removed Clauses</span>
            </button>
          </div>

          {/* TAB 1: CHANGE IMPACT */}
          {activeTab === 'impact' && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Why Change Impact matters:</strong> Rather than just showing raw text differences, Change Impact analyzes what the revision practically means for you, who carries the burden, and what strategic questions you should ask before proceeding.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {result.change_impacts?.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-blue-200 transition-all space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        {item.title}
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                        Important Shift
                      </span>
                    </div>

                    {/* Original vs New comparison blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Original (Doc A)
                        </p>
                        <p className="text-xs text-gray-700 font-medium leading-relaxed">
                          {item.original}
                        </p>
                      </div>

                      <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Modified (Doc B)
                        </p>
                        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                          {item.new}
                        </p>
                      </div>
                    </div>

                    {/* Explanatory 3 pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="bg-blue-50/40 rounded-xl p-3 border border-blue-50">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">What Changed?</p>
                        <p className="text-xs text-gray-800 font-normal">{item.what_changed}</p>
                      </div>

                      <div className="bg-purple-50/40 rounded-xl p-3 border border-purple-50">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Who is Affected?</p>
                        <p className="text-xs text-purple-950 font-medium">{item.who_may_be_affected}</p>
                      </div>

                      <div className="bg-amber-50/40 rounded-xl p-3 border border-amber-100">
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> What Should You Ask?
                        </p>
                        <p className="text-xs text-amber-950 font-medium italic">"{item.what_to_ask}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CLAUSE-BY-CLAUSE MATRIX */}
          {activeTab === 'table' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-xs text-gray-400 font-semibold uppercase flex-shrink-0">Filter:</span>
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    filterCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All ({result.comparison_table.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                      filterCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Responsive Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100">
                        <th className="py-3.5 px-4 w-1/5">Category</th>
                        <th className="py-3.5 px-4 w-1/4">Document A ({docAName.slice(0, 20)}...)</th>
                        <th className="py-3.5 px-4 w-1/4">Document B ({docBName.slice(0, 20)}...)</th>
                        <th className="py-3.5 px-4">Difference & Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                          <td className="py-4 px-4 align-top">
                            <span className="font-semibold text-gray-800 text-xs block">{row.category}</span>
                            {row.significance && (
                              <span className={`inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                                row.significance === 'high' ? 'bg-red-50 text-red-700 border border-red-100' :
                                row.significance === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {row.significance} Impact
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 align-top text-xs text-gray-700 bg-gray-50/40 font-medium">
                            {row.document_a}
                          </td>
                          <td className="py-4 px-4 align-top text-xs text-gray-800 bg-emerald-50/30 font-medium">
                            {row.document_b}
                          </td>
                          <td className="py-4 px-4 align-top text-xs text-gray-600 leading-relaxed">
                            {row.difference}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADDED & REMOVED CLAUSES */}
          {activeTab === 'diffs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Removed Clauses */}
              <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-red-700 border-b border-red-50 pb-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-sm">Clauses in Doc A Removed in Doc B</h3>
                </div>
                {result.removed_clauses?.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No clauses completely removed.</p>
                ) : (
                  <ul className="space-y-2">
                    {result.removed_clauses.map((item, i) => (
                      <li key={i} className="text-xs text-red-900 bg-red-50/50 p-2.5 rounded-lg border border-red-100 font-medium flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span> {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Added Clauses */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-50 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm">New Clauses Added in Doc B</h3>
                </div>
                {result.added_clauses?.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No new standalone clauses added.</p>
                ) : (
                  <ul className="space-y-2">
                    {result.added_clauses.map((item, i) => (
                      <li key={i} className="text-xs text-emerald-950 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 font-medium flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">+</span> {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Legal Safety Notice */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              <strong>Objective AI Comparison:</strong> NyayaSetu never labels a contract as definitively "better" or "worse".
              Every highlighted difference may carry different advantages depending on your personal context, leverage, and legal jurisdiction.
              Always review these findings with a qualified lawyer before signing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
