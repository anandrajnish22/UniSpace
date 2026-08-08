import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'COMPANY' | 'ORGANIZER' | 'MODERATOR' | 'ADMIN';
  profileImage?: string;
  university?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('unispace_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
