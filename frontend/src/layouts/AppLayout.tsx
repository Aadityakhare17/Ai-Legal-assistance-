import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  MessageSquare,
  FileOutput,
  Settings,
  LogOut,
  Scale,
  Menu,
  X,
  Bell,
  ChevronDown,
  BookOpen,
  Landmark,
} from 'lucide-react';

// ─── Nav item type ─────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  end?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/app', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
  { label: 'Citizen Rights Hub', to: '/app/constitution', icon: <Landmark className="w-4 h-4 text-amber-600" /> },
  { label: 'Demo Analysis', to: '/app/document/1', icon: <FileText className="w-4 h-4" /> },
  { label: 'Ask Document', to: '/app/document/1/ask', icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'Compare Contracts', to: '/app/compare', icon: <GitCompare className="w-4 h-4" /> },
  { label: 'Lawyer Brief', to: '/app/brief/1', icon: <FileOutput className="w-4 h-4" /> },
  { label: 'Settings', to: '/app/settings', icon: <Settings className="w-4 h-4" /> },
];

// ─── Page title helper ─────────────────────────────────────────────────────────

const getPageTitle = (pathname: string): string => {
  if (pathname === '/app' || pathname === '/app/') return 'Dashboard';
  if (pathname.startsWith('/app/constitution')) return 'Citizen Rights & Constitution Hub';
  if (pathname.includes('/ask')) return 'Ask Your Document';
  if (pathname.startsWith('/app/document')) return 'Document Analysis';
  if (pathname.startsWith('/app/compare')) return 'Compare Contracts';
  if (pathname.startsWith('/app/brief')) return 'Lawyer Brief';
  if (pathname.startsWith('/app/settings')) return 'Settings & Privacy';
  return 'NyayaSetu';
};

// ─── Avatar initials helper ────────────────────────────────────────────────────

const getInitials = (name: string = ''): string => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─── Sidebar content ───────────────────────────────────────────────────────────

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user) as { full_name?: string; fullName?: string; name?: string; email?: string } | null;

  const displayName = user?.full_name || user?.fullName || user?.name || 'User';
  const displayEmail = user?.email || '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-none">NyayaSetu</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">Legal Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Navigation</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{getInitials(displayName)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── App Layout ────────────────────────────────────────────────────────────────

const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((s) => s.user) as { fullName?: string; name?: string } | null;

  const pageTitle = getPageTitle(location.pathname);
  const displayName = user?.fullName || user?.name || 'User';
  const initials = getInitials(displayName);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Desktop Sidebar ──────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-30">
        <Sidebar />
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="fixed left-0 top-0 h-screen w-72 z-50 bg-white border-r border-gray-200 flex flex-col md:hidden shadow-2xl">
            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 md:ml-64 min-h-screen">
        {/* ── Top Header ───────────────────────────────────────────────────── */}
        <header className="fixed top-0 right-0 left-0 md:left-64 z-20 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">{pageTitle}</h1>
              <p className="text-xs text-gray-400 leading-none hidden sm:block">NyayaSetu Workspace</p>
            </div>
          </div>

          {/* Right: language, bell, avatar */}
          <div className="flex items-center gap-3">
            {/* Language badge */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              EN
            </span>

            {/* Notification bell */}
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition hidden sm:block" />
            </div>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pt-16 pb-8 bg-gray-50 min-h-screen">
          <Outlet />
        </main>

        {/* ── Bottom Disclaimer Bar ────────────────────────────────────────── */}
        <div className="fixed bottom-0 right-0 left-0 md:left-64 z-20 bg-amber-50 border-t border-amber-100 py-1 px-4 flex items-center justify-center gap-2">
          <BookOpen className="w-3 h-3 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">
            NyayaSetu provides general legal information only. It does not replace professional legal advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
