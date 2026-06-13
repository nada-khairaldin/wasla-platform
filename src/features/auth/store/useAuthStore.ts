import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  actions: {
    setAuth: (token: string) => void;
    logout: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: Cookies.get("token") ?? null,
  isAuthenticated: !!Cookies.get("token"),

  actions: {
    setAuth: (token) => {
      Cookies.set("token", token, {
        expires: 1 / 96,
        path: "/",
        sameSite: "lax",
      });

      set({ token, isAuthenticated: true });
    },

    logout: () => {
      Cookies.remove("token");
      set({ token: null, isAuthenticated: false });
      window.location.href = "/login";
    },
  },
}));

export const useAuthActions = () => useAuthStore((state) => state.actions);
