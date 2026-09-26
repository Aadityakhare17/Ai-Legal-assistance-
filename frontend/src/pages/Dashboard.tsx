import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, AlertTriangle, Clock, MessageSquare, Upload, ChevronRight, Loader2, Trash2, Eye, RefreshCw } from 'lucide-react';
import { documentsApi } from '../services/api';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

interface Document {
  id: number;
  original_filename: string;
  file_type: string;
  file_size: number;
  page_count: number;
  status: string;
  is_demo: boolean;
  created_at: string;
}

interface Stats {
  total_documents: number;
  documents_analyzed: number;
  items_to_review: number;
  upcoming_deadlines: number;
  questions_prepared: number;
}

const statusColors: Record<string, string> = {
  analyzed: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  uploaded: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

const fileTypeColors: Record<string, string> = {
  pdf: 'bg-red-50 text-red-600',
  docx: 'bg-blue-50 text-blue-600',
  doc: 'bg-blue-50 text-blue-600',
  txt: 'bg-gray-50 text-gray-600',
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function UploadZone({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');

  const steps = ['Uploading', 'Extracting Text', 'Understanding Structure', 'Identifying Clauses', 'Analyzing Terms', 'Generating Insights'];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i]);
        setProgress(Math.round(((i + 1) / steps.length) * 80));
        await new Promise(r => setTimeout(r, 400));
      }
      await documentsApi.uploadDocument(file, (p) => setProgress(80 + Math.round(p * 0.2)));
      setProgress(100);
      setProcessingStep('Analysis Complete!');
      toast.success('Document uploaded and queued for analysis!');
      await new Promise(r => setTimeout(r, 800));
      onUploadSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
      setProcessingStep('');
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
      {uploading ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <p className="font-semibold text-gray-800 mb-1">{processingStep}...</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">{progress}% complete</p>
        </div>
      ) : (
        <div {...getRootProps()} className="p-8 text-center cursor-pointer">
          <input {...getInputProps()} />
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragActive ? 'bg-blue-100' : 'bg-gray-50'}`}>
            <Upload className={`w-7 h-7 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          <p className="font-semibold text-gray-700 mb-1">
            {isDragActive ? 'Drop your document here' : 'Upload a Legal Document'}
          </p>
          <p className="text-sm text-gray-400 mb-3">PDF, DOCX, or TXT · Max 20MB</p>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Browse Files
          </button>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [docsData, statsData] = await Promise.all([
        documentsApi.listDocuments(),
        documentsApi.getStats(),
      ]);
      setDocuments(docsData);
      setStats(statsData);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this document? This cannot be undone.')) return;
    try {
      await documentsApi.deleteDocument(id);
      toast.success('Document deleted');
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Cannot delete demo documents');
    }
  };

  const statCards = [
    { label: 'My Documents', value: stats?.total_documents ?? '—', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Analyzed', value: stats?.documents_analyzed ?? '—', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Items to Review', value: stats?.items_to_review ?? '—', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Upcoming Deadlines', value: stats?.upcoming_deadlines ?? '—', icon: Clock, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Questions Prepared', value: stats?.questions_prepared ?? '—', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your legal documents.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload zone */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Upload Document</h2>
          <UploadZone onUploadSuccess={fetchData} />
          <p className="text-xs text-gray-400 mt-2 text-center">AI analysis starts automatically after upload</p>
        </div>

        {/* Documents list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Documents</h2>
            <button onClick={fetchData} className="text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48 bg-white rounded-xl border border-gray-100">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl border border-dashed border-gray-200 text-center px-4">
              <FileText className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">No documents yet</p>
              <p className="text-sm text-gray-400">Upload a legal document to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/app/document/${doc.id}`)}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`px-2 py-1 rounded-md text-xs font-semibold uppercase ${fileTypeColors[doc.file_type] || 'bg-gray-50 text-gray-600'}`}>
                        {doc.file_type}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate text-sm">{doc.original_filename}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[doc.status] || 'bg-gray-100 text-gray-500'}`}>
                            {doc.status === 'analyzed' ? '✓ Analyzed' : doc.status === 'processing' ? '⟳ Processing' : doc.status}
                          </span>
                          {doc.is_demo && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">Demo</span>
                          )}
                          <span className="text-xs text-gray-400">{doc.page_count} pages</span>
                          <span className="text-xs text-gray-400">{formatBytes(doc.file_size)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/app/document/${doc.id}`); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Analysis"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/app/document/${doc.id}/ask`); }}
                        className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                        title="Ask Document"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {!doc.is_demo && (
                        <button
                          onClick={(e) => handleDelete(doc.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-1">Try the Demo Analysis</h3>
        <p className="text-blue-100 text-sm mb-4">Explore a pre-analyzed fictional rental agreement to see all features in action.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/app/document/1')}
            className="px-4 py-2 bg-white text-blue-600 font-medium text-sm rounded-lg hover:bg-blue-50 transition-colors"
          >
            View Demo Analysis
          </button>
          <button
            onClick={() => navigate('/app/document/1/ask')}
            className="px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-400 transition-colors"
          >
            Ask Demo Document
          </button>
          <button
            onClick={() => navigate('/app/compare')}
            className="px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-400 transition-colors"
          >
            Compare Contracts
          </button>
        </div>
      </div>
    </div>
  );
}
