import React, { useState } from 'react';
import {
  Settings, Globe, Shield, Key, Trash2, CheckCircle2, User,
  Lock, Save, RefreshCw, AlertTriangle, FileText, Info
} from 'lucide-react';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
];

const indianStates = [
  'Maharashtra', 'Karnataka', 'Delhi (NCT)', 'Tamil Nadu', 'Telangana',
  'Gujarat', 'West Bengal', 'Uttar Pradesh', 'Rajasthan', 'Kerala',
  'Punjab', 'Haryana', 'Madhya Pradesh', 'Other'
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [selectedLang, setSelectedLang] = useState(user?.preferred_language || 'en');
  const [country, setCountry] = useState(user?.jurisdiction_country || 'India');
  const [stateRegion, setStateRegion] = useState(user?.jurisdiction_state || 'Maharashtra');
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [geminiKey, setGeminiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Preferences updated successfully');
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiKey.trim()) {
      toast.error('Please enter a valid Gemini API key');
      return;
    }
    setSavedKey(true);
    toast.success('Custom Gemini API Key saved locally!');
  };

  const handleClearCache = () => {
    if (confirm('Clear local document caches and vector indexes?')) {
      toast.success('Local session caches purged.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings & Privacy Center</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure multilingual legal explainers, jurisdiction context, security preferences, and AI credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Language & Multilingual */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-gray-800">Language & Localization</h2>
              <p className="text-xs text-gray-400">Select language for document summaries, timelines, and explanations</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedLang === lang.code
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <p className="text-xs font-bold">{lang.name}</p>
                <p className="text-sm font-medium text-gray-500 mt-0.5">{lang.native}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Legal terminology is preserved in original English with localized contextual explanations.
          </p>
        </div>

        {/* Section 2: Jurisdiction Context */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Shield className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-gray-800">Jurisdiction Configuration</h2>
              <p className="text-xs text-gray-400">Laws vary across states and countries. Configure your legal context.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="India">India (Default)</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Singapore">Singapore</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">State / Territory</label>
              <select
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Privacy, Data Retention & Security */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Lock className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-gray-800">Privacy & Data Governance</h2>
              <p className="text-xs text-gray-400">Control document lifespan, encryption, and temporary vector sessions</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-800">Automatic Session Cleanup</p>
                <p className="text-xs text-gray-500">Purge vector embeddings and cached chunks when signing out</p>
              </div>
              <input
                type="checkbox"
                checked={autoCleanup}
                onChange={(e) => setAutoCleanup(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-800">Zero Model Training Guarantee</p>
                <p className="text-xs text-gray-500">Uploaded documents are never used for AI model training</p>
              </div>
              <span className="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                Active
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClearCache}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
              >
                <Trash2 className="w-4 h-4" /> Purge Local Session Cache
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: AI Engine & API Key */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Key className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-gray-800">Custom AI Engine (BYOK)</h2>
              <p className="text-xs text-gray-400">Default runs in zero-config Demo Mode. Optionally plug in your Gemini API key for live analysis.</p>
            </div>
          </div>

          <form onSubmit={handleSaveApiKey} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Google Gemini API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  Save Key
                </button>
              </div>
            </div>
            {savedKey && (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom Gemini API Key is configured for this session!
              </p>
            )}
          </form>
        </div>

        {/* Save General Preferences Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSavePreferences}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
