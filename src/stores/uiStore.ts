import { create } from 'zustand';
import type { UiState } from '../types';

export const useUiStore = create<UiState>((set) => ({
  theme: 'dark',
  modalOpen: null,
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  openModal: (id) => set({ modalOpen: id }),
  closeModal: () => set({ modalOpen: null }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
