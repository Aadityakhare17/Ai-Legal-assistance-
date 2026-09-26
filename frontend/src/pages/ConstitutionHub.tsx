import React, { useState, useEffect } from 'react';
import {
  Scale, Shield, BookOpen, Heart, AlertTriangle, FileCheck, Users,
  Search, ArrowRight, CheckCircle2, Phone, ExternalLink, HelpCircle,
  Sparkles, Download, Info, Award, ChevronDown, ChevronUp, Send, Loader2
} from 'lucide-react';
import { constitutionApi } from '../services/api';
import toast from 'react-hot-toast';

type Tab = 'education' | 'health' | 'rights' | 'remedies' | 'legal-aid' | 'scenarios';

export default function ConstitutionHub() {
  const [activeTab, setActiveTab] = useState<Tab>('education');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQueryResult, setAiQueryResult] = useState<any>(null);
  const [searchingAi, setSearchingAi] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});

  const [rightsData, setRightsData] = useState<any[]>([]);
  const [educationData, setEducationData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [writsData, setWritsData] = useState<any[]>([]);
  const [legalAidData, setLegalAidData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [r, e, h, w, l] = await Promise.all([
        constitutionApi.getRights(),
        constitutionApi.getEducationRights(),
        constitutionApi.getHealthRights(),
        constitutionApi.getRemedies(),
        constitutionApi.getLegalAid(),
      ]);
      setRightsData(r);
      setEducationData(e);
      setHealthData(h);
      setWritsData(w);
      setLegalAidData(l);
    } catch {
      toast.error('Failed to load Constitution data');
    } finally {
      setLoading(false);
    }
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchingAi(true);
    setAiQueryResult(null);
    try {
      const res = await constitutionApi.askConstitution(searchQuery);
      setAiQueryResult(res);
    } catch {
      toast.error('Could not query Constitution knowledge base');
    } finally {
      setSearchingAi(false);
    }
  };

  const toggleArticle = (key: string) => {
    setExpandedArticles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scenarios = [
    {
      q: "Can a private hospital refuse emergency treatment if I don't pay cash in advance?",
      verdict: "STRICTLY ILLEGAL",
      verdictColor: "bg-red-100 text-red-800 border-red-200",
      answer: "No. The Supreme Court in the landmark Parmanand Katara (1989) case ruled that preserving human life is paramount. Every private and government hospital has a legal duty to provide immediate emergency life-saving treatment without waiting for police paperwork or advance financial deposits.",
      action: "Call 112 immediately. Inform hospital administration that refusing emergency care constitutes criminal medical negligence and contempt of the Supreme Court.",
      law: "Article 21 & Parmanand Katara v. Union of India (1989)"
    },
    {
      q: "Can a reputed private school deny admission under the RTE 25% Free Quota?",
      verdict: "CONSTITUTIONAL VIOLATION",
      verdictColor: "bg-red-100 text-red-800 border-red-200",
      answer: "No. Section 12(1)(c) of the Right to Education (RTE) Act 2009 makes it mandatory for all private unaided non-minority schools to reserve 25% of entry-level seats for EWS and disadvantaged children. The Supreme Court (in 2012 and 2026) affirmed that schools cannot turn away allotted children.",
      action: "File an instant complaint to your Block Education Officer (BEO) or lodge an online complaint on the NCPCR e-BaalNidan portal.",
      law: "Article 21A & RTE Act 2009 Section 12(1)(c)"
    },
    {
      q: "Can a police officer detain me for questioning overnight without an arrest memo?",
      verdict: "UNLAWFUL DETENTION",
      verdictColor: "bg-red-100 text-red-800 border-red-200",
      answer: "No. Under Article 22 and Supreme Court's D.K. Basu guidelines, police cannot secretly detain anyone. They must prepare an arrest memo with a witness signature, inform your family within 8-12 hours, allow a lawyer, and produce you before a Magistrate within 24 hours.",
      action: "Contact DLSA Legal Aid (15100) or approach High Court with a Writ of Habeas Corpus.",
      law: "Article 22 & D.K. Basu v. State of West Bengal (1997)"
    },
    {
      q: "Can a company seize all inventions or code made on my personal laptop on weekends?",
      verdict: "POTENTIALLY UNENFORCEABLE",
      verdictColor: "bg-amber-100 text-amber-800 border-amber-200",
      answer: "Overly broad IP clauses that claim personal weekend inventions made without company resources or trade secrets are subject to strict scrutiny under Section 27 of the Indian Contract Act.",
      action: "Demand a written carve-out schedule listing your pre-existing open source and personal projects before signing.",
      law: "Article 19(1)(g) & Indian Contract Act, 1872 Section 27"
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading Constitutional Knowledge Base...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in print:p-0">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden print:bg-white print:text-black print:p-2 print:shadow-none">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-8 pointer-events-none">
          <Scale className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <span>🇮🇳 Samvidhan Setu · संविधान सेतु</span>
            <span>·</span>
            <span>Constitution of India</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Know Your Fundamental Rights. <br className="hidden sm:inline" />
            <span className="text-blue-300">Free Education, Medical Rights & Citizen Protections</span>
          </h1>

          <p className="text-sm md:text-base text-blue-100/90 leading-relaxed font-normal">
            The Indian Constitution guarantees that no child is denied schooling, no accident victim is turned away from a hospital for lack of money, and every citizen is protected against arbitrariness.
          </p>

          {/* Quick Helplines */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm flex items-center gap-1.5 border border-white/10">
              <Phone className="w-3.5 h-3.5 text-red-400" /> Police/Emergency: <strong>112</strong>
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm flex items-center gap-1.5 border border-white/10">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Ambulance: <strong>108</strong>
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm flex items-center gap-1.5 border border-white/10">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Childline (RTE): <strong>1098</strong>
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm flex items-center gap-1.5 border border-white/10">
              <Phone className="w-3.5 h-3.5 text-blue-400" /> Free Legal Aid (NALSA): <strong>15100</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Instant Constitutional AI Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm print:hidden">
        <form onSubmit={handleAiSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask any constitutional right (e.g., 'Can a private hospital refuse emergency care?', '25% RTE quota in private schools', 'Police arrest rights')..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={searchingAi || !searchQuery.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            {searchingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Ask Constitution AI</span>
          </button>
        </form>

        {/* AI Result Card */}
        {aiQueryResult && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-sm space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" /> {aiQueryResult.article}
              </span>
              {aiQueryResult.landmark_case && (
                <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                  🏛️ {aiQueryResult.landmark_case}
                </span>
              )}
            </div>
            <p className="text-gray-800 leading-relaxed font-normal">{aiQueryResult.answer}</p>
            {aiQueryResult.action_step && (
              <p className="text-xs text-blue-900 bg-white p-2 rounded-lg border border-blue-100 font-medium">
                👉 <strong>Action to Take:</strong> {aiQueryResult.action_step}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide print:hidden">
        {[
          { key: 'education', label: '🎓 Free Education (Article 21A & RTE)', icon: BookOpen },
          { key: 'health', label: '🏥 Free Healthcare & Emergency Care', icon: Heart },
          { key: 'rights', label: '⚖️ Fundamental Rights (Art 14-32)', icon: Scale },
          { key: 'remedies', label: '🛡️ Constitutional Writs (Art 32/226)', icon: FileCheck },
          { key: 'legal-aid', label: '🤝 Free Legal Aid (Article 39A)', icon: Users },
          { key: 'scenarios', label: '🚨 Citizen Scenario Checker', icon: AlertTriangle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as Tab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === key
                ? 'bg-white text-blue-700 shadow-sm border border-gray-200/60'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: FREE EDUCATION RIGHTS (ARTICLE 21A & RTE) */}
      {activeTab === 'education' && educationData && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-700">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-900">{educationData.headline}</h2>
            </div>
            <p className="text-xs font-semibold text-blue-600">{educationData.constitutional_foundation}</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              {educationData.core_guarantee}
            </p>
          </div>

          {/* Institutional Breakdown Cards (Private, Govt, Semi-Govt, Higher Ed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationData.institutional_breakdown?.map((item: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-blue-200 transition-all space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                    idx === 1 ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                    'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    {item.sector}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mt-2">{item.rule}</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">What Is 100% Free:</p>
                  <ul className="space-y-1.5">
                    {item.what_is_free?.map((f: string, i: number) => (
                      <li key={i} className="text-xs text-gray-700 font-medium flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
                  <p><strong>Who Qualifies:</strong> <span className="text-gray-600">{item.who_qualifies}</span></p>
                  <p><strong>Legal Weight:</strong> <span className="text-gray-600">{item.legal_teeth}</span></p>
                  <p className="text-blue-700 pt-1"><strong>How to Apply:</strong> {item.how_to_apply}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grievance Action Plan */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-amber-950 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              What to Do If a School Refuses Free Admission:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {educationData.what_to_do_if_denied?.map((step: string, i: number) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-amber-100 font-medium text-amber-900 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FREE HEALTHCARE & EMERGENCY MEDICAL RIGHTS (ARTICLE 21) */}
      {activeTab === 'health' && healthData && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-red-600">
              <Heart className="w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-900">{healthData.headline}</h2>
            </div>
            <p className="text-xs font-semibold text-red-600">{healthData.constitutional_foundation}</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-red-50/40 p-4 rounded-xl border border-red-100">
              {healthData.core_guarantee}
            </p>
          </div>

          {/* Key Legal Mandates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthData.key_legal_mandates?.map((mandate: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider px-2 py-0.5 bg-red-50 rounded border border-red-100">
                    {mandate.legal_basis}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mt-2">{mandate.title}</h3>
                </div>

                <p className="text-xs text-gray-700 font-medium leading-relaxed bg-gray-50 p-3 rounded-xl">
                  {mandate.the_rule}
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Citizen Protections:</p>
                  <ul className="space-y-1.5">
                    {mandate.critical_protections?.map((prot: string, i: number) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{prot}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-red-50/50 rounded-xl text-xs text-red-950 font-medium border border-red-100">
                  👉 <strong>Citizen Action:</strong> {mandate.citizen_action}
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Violations Protocol */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-red-950 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Immediate Steps If a Hospital Denies Emergency Care:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {healthData.what_to_do_if_hospital_violates?.map((step: string, i: number) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-red-100 font-medium text-red-900 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FUNDAMENTAL RIGHTS EXPLORER (ARTICLES 14–32) */}
      {activeTab === 'rights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Part III of the Constitution: Fundamental Rights</h2>
            <p className="text-xs text-gray-500 mt-1">
              Articles 12 to 35 constitute the Magna Carta of India. They protect every resident against arbitrary state action and guarantee human dignity.
            </p>
          </div>

          <div className="space-y-4">
            {rightsData.map((cluster: any) => (
              <div key={cluster.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 uppercase tracking-wider">
                      {cluster.badge}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{cluster.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 max-w-md">{cluster.summary}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {cluster.clauses?.map((item: any, i: number) => {
                    const key = `${cluster.id}-${i}`;
                    const isExpanded = expandedArticles[key];
                    return (
                      <div key={i} className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-2">
                        <div
                          onClick={() => toggleArticle(key)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="text-xs font-bold text-blue-700">{item.article}:</span>
                            <span className="text-xs font-bold text-gray-800 ml-1.5">{item.title}</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        <p className="text-xs text-gray-700 font-medium">{item.plain_meaning}</p>

                        {isExpanded && (
                          <div className="pt-3 border-t border-gray-200/60 space-y-2 text-xs animate-fade-in">
                            <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                              <p className="text-[10px] uppercase font-bold text-gray-400">Verbatim Constitutional Text</p>
                              <p className="text-gray-600 italic mt-0.5">"{item.text}"</p>
                            </div>
                            <p><strong>🏛️ Landmark Ruling:</strong> <span className="text-gray-700">{item.landmark_case}</span></p>
                            <p className="text-blue-900 bg-blue-50 p-2 rounded-lg font-medium">
                              🎯 <strong>What This Means for You:</strong> {item.citizen_takeaway}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONSTITUTIONAL WRITS (ARTICLES 32 & 226) */}
      {activeTab === 'remedies' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-2">
            <h2 className="text-xl font-bold text-gray-900">The 5 Constitutional Writs (Articles 32 & 226)</h2>
            <p className="text-xs text-gray-500">
              Dr. B.R. Ambedkar called Article 32 the "Heart and Soul of the Constitution". When any Fundamental Right is violated, citizens can directly approach the High Courts or the Supreme Court for immediate writ relief.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {writsData.map((w: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded uppercase">
                    Writ Jurisdiction
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mt-1">{w.writ}</h3>
                  <p className="text-xs text-gray-400 italic">{w.literal_meaning}</p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p><strong>Purpose:</strong> <span className="text-gray-700">{w.purpose}</span></p>
                  <p><strong>When Invoked:</strong> <span className="text-gray-600">{w.when_used}</span></p>
                  <div className="p-2.5 bg-rose-50/60 rounded-xl text-rose-950 font-medium border border-rose-100">
                    ⚖️ <strong>Court's Action:</strong> {w.court_action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FREE LEGAL AID (ARTICLE 39A & NALSA) */}
      {activeTab === 'legal-aid' && legalAidData && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-900">{legalAidData.headline}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed bg-indigo-50/40 p-4 rounded-xl border border-indigo-100">
              {legalAidData.core_mandate}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Who is Entitled */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-indigo-900">
                Who Gets a 100% Free Government Advocate:
              </h3>
              <ul className="space-y-2">
                {legalAidData.who_is_entitled_to_free_lawyer?.map((item: string, i: number) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services & How to Access */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-emerald-900">
                  Services Provided at Zero Cost:
                </h3>
                <ul className="space-y-2">
                  {legalAidData.services_provided_free?.map((item: string, i: number) => (
                    <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-900 text-white rounded-2xl p-6 space-y-2">
                <h4 className="font-bold text-sm">How to Apply for Free Legal Aid:</h4>
                {legalAidData.how_to_access?.map((step: string, i: number) => (
                  <p key={i} className="text-xs text-indigo-100 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">→</span> {step}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CITIZEN SCENARIOS ("CAN THEY DO THIS?") */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Real-World Citizen Rights Scenarios</h2>
            <p className="text-xs text-gray-500 mt-1">
              Common illegal practices by hospitals, schools, police, and landlords — and the exact constitutional defense available to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3 hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-900 text-sm">"{s.q}"</h3>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${s.verdictColor}`}>
                    {s.verdict}
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">{s.answer}</p>

                <div className="bg-blue-50/70 p-3 rounded-xl text-xs text-blue-950 font-medium space-y-1">
                  <p>👉 <strong>Immediate Action:</strong> {s.action}</p>
                  <p className="text-[11px] text-gray-500"><strong>Governing Law:</strong> {s.law}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
        <strong>Constitutional Empowerment Notice:</strong> This knowledge hub is created to demystify the Indian Constitution and Supreme Court legal doctrines for every citizen.
        While fully grounded in statutes, individual legal disputes should be addressed through appropriate judicial remedies or qualified legal advocates.
      </div>
    </div>
  );
}
