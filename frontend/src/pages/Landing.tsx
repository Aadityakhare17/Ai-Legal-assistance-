import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  FileText,
  AlertTriangle,
  Clock,
  Scale,
  ChevronRight,
  CheckCircle,
  Upload,
  Zap,
  Eye,
  Lock,
  Users,
  ArrowRight,
  Menu,
  X,
  Landmark,
  Heart,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { authApi } from '../services/api';
import { useAuthStore } from '../store';

// ─── Auth Modal ────────────────────────────────────────────────────────────────

type AuthTab = 'login' | 'register';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleSuccess = (token: string, user: unknown) => {
    login(token, user as any);
    navigate('/app');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(loginEmail, loginPassword);
      handleSuccess(res.access_token, res.user);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register({ full_name: regName, email: regEmail, password: regPassword });
      handleSuccess(res.access_token, res.user);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await authApi.demoLogin();
      handleSuccess(res.access_token, res.user);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">NyayaSetu</span>
          </div>
          <p className="text-sm text-gray-500">AI-powered legal document analysis</p>
        </div>

        {/* Tabs */}
        <div className="flex mx-8 border border-gray-200 rounded-lg p-1 mb-6">
          {(['login', 'register'] as AuthTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <div className="px-8 pb-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition text-sm"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition text-sm"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="mt-4 w-full py-2.5 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-60 text-blue-700 font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {loading ? 'Loading demo…' : 'Try Demo (No signup needed)'}
          </button>

          <p className="mt-4 text-xs text-gray-400 text-center">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleInstantDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await authApi.demoLogin();
      login(res.access_token, res.user);
      navigate('/app');
    } catch (err: any) {
      console.error('Demo login error:', err);
      // Fallback: create demo session locally if network fails
      login('demo_token_' + Date.now(), {
        id: 1,
        email: 'demo@nyayasetu.ai',
        full_name: 'Demo User',
        preferred_language: 'en',
        jurisdiction_country: 'India',
      });
      navigate('/app');
    } finally {
      setDemoLoading(false);
    }
  };

  // ── Features data ────────────────────────────────────────────────────────────
  const features = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-100',
      title: 'Document Intelligence',
      desc: 'Auto-detects document type and extracts key terms, parties, dates and financial commitments.',
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      bg: 'bg-red-100',
      title: 'Risk Detection',
      desc: 'Flags clauses that deserve attention — with plain-language explanations of what they mean.',
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-100',
      title: 'Legal Timeline',
      desc: 'Creates a visual timeline of all important dates, deadlines and renewal windows.',
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-100',
      title: 'Ask Your Document',
      desc: 'Ask questions in plain English and get answers cited directly from your document.',
    },
    {
      icon: <Scale className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-100',
      title: 'Contract Comparison',
      desc: 'Upload two contracts and see a clause-by-clause change impact analysis.',
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-100',
      title: 'Lawyer Brief',
      desc: 'Generate a professional brief to maximize the value of your lawyer consultation.',
    },
    {
      icon: <Landmark className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-100',
      title: 'Constitution & Fundamental Rights',
      desc: 'Plain-language guide to Part III (Articles 12-35). Learn your protections against arbitrary arrest and unlawful state action.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-100',
      title: 'Free Education Guarantee (Article 21A)',
      desc: 'Clear rules on 25% free quota in private schools under RTE Act Sec 12(1)(c), plus zero-fee government school entitlements.',
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-100',
      title: 'Emergency Medical Rights (Article 21)',
      desc: 'Supreme Court Parmanand Katara ruling: Immediate emergency care in any hospital without advance cash deposits or police delays.',
    },
  ];

  // ── Steps data ───────────────────────────────────────────────────────────────
  const steps = [
    { num: '1', icon: <Upload className="w-5 h-5" />, title: 'Upload', desc: 'Upload PDF, DOCX or plain text — any legal document you need to understand.' },
    { num: '2', icon: <Zap className="w-5 h-5" />, title: 'Analyze', desc: 'AI extracts and structures all key information including parties, dates and obligations.' },
    { num: '3', icon: <Eye className="w-5 h-5" />, title: 'Explore', desc: 'Navigate timeline, obligations, risks and clauses through an intuitive interface.' },
    { num: '4', icon: <FileText className="w-5 h-5" />, title: 'Prepare', desc: 'Generate insightful questions and a professional brief for your legal consultation.' },
  ];

  // ── Legal Lenses ─────────────────────────────────────────────────────────────
  const lenses = [
    { emoji: '💰', label: 'Money' },
    { emoji: '⏰', label: 'Deadlines' },
    { emoji: '⚠️', label: 'Risk' },
    { emoji: '🔐', label: 'Privacy' },
    { emoji: '💡', label: 'Rights' },
    { emoji: '📋', label: 'Obligations' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ─────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Scale className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">NyayaSetu</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Legal Lens', 'Privacy'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={openModal}
              className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition"
            >
              Sign In
            </button>
            <button
              onClick={handleInstantDemo}
              disabled={demoLoading}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {demoLoading ? 'Starting Demo…' : 'Try Demo Free'}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 space-y-2">
            {['Features', 'How It Works', 'Legal Lens', 'Privacy'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="block py-2 text-sm text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={openModal} className="py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg">
                Sign In
              </button>
              <button
                onClick={handleInstantDemo}
                disabled={demoLoading}
                className="py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2"
              >
                {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {demoLoading ? 'Starting Demo…' : 'Try Demo Free'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" /> AI-Powered Legal Intelligence
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Legal documents shouldn't require a{' '}
              <span className="text-blue-600">law degree</span> to understand.
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              NyayaSetu uses advanced AI to transform complex legal documents into clear summaries,
              risk flags and timelines — so you walk into every legal situation fully informed.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={openModal}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-200"
              >
                <Upload className="w-4 h-4" />
                Analyze a Document
              </button>
              <button
                onClick={handleInstantDemo}
                disabled={demoLoading}
                className="flex items-center gap-2 px-6 py-3 border-2 border-blue-300 hover:border-blue-500 text-blue-700 font-semibold rounded-xl transition bg-white"
              >
                {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {demoLoading ? 'Starting Demo…' : 'Try Demo Free'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Lock className="w-4 h-4 text-blue-500" />, label: '256-bit encrypted' },
                { icon: <Zap className="w-4 h-4 text-purple-500" />, label: 'AI-powered analysis' },
                { icon: <Shield className="w-4 h-4 text-green-500" />, label: 'Privacy-first' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-white/70 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
                  {icon}
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: mock analysis card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              {/* Document header */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Rental Agreement.pdf</p>
                  <p className="text-xs text-gray-400">Analyzed just now · 12 pages</p>
                </div>
                <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Done</span>
              </div>

              {/* Result rows */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Summary Generated</p>
                    <p className="text-xs text-gray-500">Plain-language overview ready</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">3 Risk Flags</p>
                    <p className="text-xs text-gray-500">Clauses that need your attention</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">4 Key Dates</p>
                    <p className="text-xs text-gray-500">Deadlines & renewal windows</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <Zap className="w-5 h-5 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">6 Suggested Questions</p>
                    <p className="text-xs text-gray-500">Ready for your lawyer</p>
                  </div>
                </div>
              </div>

              <button
                onClick={openModal}
                className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition"
              >
                View Full Analysis <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ──────────────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '4', label: 'Document Types', sub: 'Rental, Employment, NDA & more' },
            { value: '20+', label: 'Analysis Points', sub: 'Extracted per document' },
            { value: '6', label: 'Legal Lenses', sub: 'Money, Deadlines, Risk & more' },
            { value: 'Zero', label: 'Legal Advice', sub: 'We inform, not advise', warn: true },
          ].map(({ value, label, sub, warn }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className={`text-3xl font-extrabold ${warn ? 'text-amber-600' : 'text-blue-600'}`}>{value}</span>
                {warn && <AlertTriangle className="w-5 h-5 text-amber-500 mb-1" />}
              </div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Features</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Everything you need to understand a legal document
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
              From quick summaries to deep clause analysis — NyayaSetu has you covered.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, bg, title, desc }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition bg-white"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  {icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Process</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              From upload to lawyer-ready brief in minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold text-lg shrink-0">
                      {step.num}
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                {/* Arrow connector */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-blue-400 bg-white rounded-full shadow" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEGAL LENS SHOWCASE ─────────────────────────────────────────────────── */}
      <section id="legal-lens" className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-blue-200 uppercase tracking-widest">Legal Lens</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Explore What Matters to You
            </h2>
            <p className="mt-3 text-blue-100 max-w-xl mx-auto">
              Filter your document through six targeted lenses — each surfacing a different dimension of your agreement.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <p className="text-sm font-semibold text-gray-500 mb-5 text-center uppercase tracking-wider">Select a lens to explore</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
              {lenses.map(({ emoji, label }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition group"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">{label}</span>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-5 text-center">
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                Each lens filters your document analysis to highlight only the clauses, dates and obligations
                relevant to that topic — so you can focus on exactly what you care about most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ───────────────────────────────────────────────────────── */}
      <section id="privacy" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Trust & Safety</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Built with responsibility at its core
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="w-7 h-7 text-blue-600" />,
                bg: 'bg-blue-100',
                title: 'Privacy-First',
                desc: 'Your documents are encrypted in transit and at rest. We never train on your data and you can delete at any time.',
              },
              {
                icon: <Shield className="w-7 h-7 text-green-600" />,
                bg: 'bg-green-100',
                title: 'AI Guardrails',
                desc: 'NyayaSetu never claims to be a lawyer. Every response is framed as informational and you are always directed to seek qualified legal advice for decisions.',
              },
              {
                icon: <Eye className="w-7 h-7 text-purple-600" />,
                bg: 'bg-purple-100',
                title: 'Source-Cited Answers',
                desc: 'Every AI answer cites the exact section of your document it was drawn from — so you can verify every claim.',
              },
            ].map(({ icon, bg, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to understand your legal documents?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of users who no longer feel lost in legalese. No subscription required.
          </p>
          <button
            onClick={handleInstantDemo}
            disabled={demoLoading}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition shadow-xl text-lg disabled:opacity-75"
          >
            {demoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {demoLoading ? 'Starting Demo…' : 'Try Demo Free'}
            {!demoLoading && <ArrowRight className="w-5 h-5" />}
          </button>
          <p className="mt-4 text-xs text-blue-200">No credit card · No signup required for demo</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold text-white">NyayaSetu</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                Bridging the gap between complex legal language and everyday understanding.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
              {['Features', 'How It Works', 'Privacy Policy', 'Terms of Service', 'Contact'].map((l) => (
                <a key={l} href="#" className="hover:text-white transition">{l}</a>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-xs text-gray-500 leading-relaxed max-w-3xl mb-4">
              <span className="font-semibold text-gray-400">Legal Disclaimer: </span>
              NyayaSetu provides general legal information only. It does not replace advice from a qualified legal
              professional. Nothing on this platform constitutes legal advice, and no attorney-client relationship
              is formed by your use of this service. Always consult a licensed lawyer for decisions that affect
              your legal rights.
            </p>
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} NyayaSetu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL ──────────────────────────────────────────────────────────── */}
      {showModal && <AuthModal onClose={closeModal} />}
    </div>
  );
};

export default Landing;
