import { create } from "zustand";

interface AuthState {
  user: { id: string; email: string } | null;
  loading: boolean;
  error: string;
  setUser: (user: { id: string; email: string } | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: "",
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
