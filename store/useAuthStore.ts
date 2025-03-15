import { create } from "zustand";

type AuthState = {
  form: { username: string; email: string; password: string };
  loading: boolean;
  setForm: (form: Partial<AuthState["form"]>) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  form: { username: "", email: "", password: "" },
  loading: false,
  setForm: (form) => set((state) => ({ form: { ...state.form, ...form } })),
  setLoading: (loading) => set({ loading }),
}));
