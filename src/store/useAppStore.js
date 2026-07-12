import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Connection Status state
  backendStatus: {
    connected: false,
    checkedAt: null,
    details: null,
  },
  
  // Theme state
  theme: 'dark',
  
  // Action to update backend connection status
  setBackendStatus: (status) => set({ backendStatus: status }),
  
  // Action to toggle theme
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark' 
  })),

  // Action to set theme
  setTheme: (theme) => set({ theme }),
}));
