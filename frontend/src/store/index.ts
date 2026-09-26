import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  full_name: string;
  preferred_language: string;
  jurisdiction_country: string;
  jurisdiction_state?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('nyayasetu_token', token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('nyayasetu_token');
        localStorage.removeItem('nyayasetu_user');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'nyayasetu_auth',
    }
  )
);

interface DocumentState {
  selectedDocumentId: number | null;
  selectedLens: 'money' | 'deadlines' | 'risk' | 'privacy' | 'rights' | 'obligations' | null;
  simplificationLevel: 'standard' | 'simple' | 'very_simple';
  setSelectedDocument: (id: number | null) => void;
  setSelectedLens: (lens: DocumentState['selectedLens']) => void;
  setSimplificationLevel: (level: DocumentState['simplificationLevel']) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  selectedDocumentId: null,
  selectedLens: null,
  simplificationLevel: 'simple',
  setSelectedDocument: (id) => set({ selectedDocumentId: id }),
  setSelectedLens: (lens) => set({ selectedLens: lens }),
  setSimplificationLevel: (level) => set({ simplificationLevel: level }),
}));
