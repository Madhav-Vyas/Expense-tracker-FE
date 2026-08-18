import { create } from "zustand";

const THEME_STORAGE_KEY = "hisab_theme";

// Helper to determine and apply initial theme
const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    syncDOMTheme(storedTheme);
    return storedTheme;
  }
  // Default to dark
  syncDOMTheme("dark");
  return "dark";
};

// Sync .dark class to root <html> tag for Tailwind CSS
const syncDOMTheme = (theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  }
};

export const useAppStore = create((set) => ({
  // Connection Status state
  backendStatus: {
    connected: false,
    checkedAt: null,
    details: null,
  },

  // Theme state initialized from localStorage
  theme: getInitialTheme(),

  // Action to update backend connection status
  setBackendStatus: (status) => set({ backendStatus: status }),

  // Action to toggle theme
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        syncDOMTheme(nextTheme);
      }
      return { theme: nextTheme };
    }),

  // Action to set theme explicitly
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      syncDOMTheme(theme);
    }
    set({ theme });
  },
}));
