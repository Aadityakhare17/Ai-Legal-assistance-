import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AnalysisView from './pages/AnalysisView';
import AskDocument from './pages/AskDocument';
import CompareDocuments from './pages/CompareDocuments';
import LawyerBriefPage from './pages/LawyerBriefPage';
import SettingsPage from './pages/SettingsPage';
import ConstitutionHub from './pages/ConstitutionHub';
import AppLayout from './layouts/AppLayout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
          error: { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="documents" element={<Dashboard />} />
          <Route path="document/:id" element={<AnalysisView />} />
          <Route path="document/:id/ask" element={<AskDocument />} />
          <Route path="ask" element={<Navigate to="/app/document/1/ask" replace />} />
          <Route path="compare" element={<CompareDocuments />} />
          <Route path="brief" element={<Navigate to="/app/brief/1" replace />} />
          <Route path="brief/:id" element={<LawyerBriefPage />} />
          <Route path="constitution" element={<ConstitutionHub />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
