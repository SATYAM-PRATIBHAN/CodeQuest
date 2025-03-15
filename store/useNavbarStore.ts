import { create } from "zustand";

type NavbarState = {
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
};

export const useNavbarStore = create<NavbarState>((set) => ({
  menuOpen: false,
  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),
}));

