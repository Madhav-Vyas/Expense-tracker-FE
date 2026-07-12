import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
      isAuthenticated: () => !!get().token,

      signup: () => {},
      login: () => {},
      logout: () => set({ token: null }),
    }),
    {
      name: "auth-storage", // required name configuration for persist middleware
    }
  )
);

export default useAuthStore;
