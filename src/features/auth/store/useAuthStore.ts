import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;

  actions: {
    setAuth: (token: string) => void;
    logout: () => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,

      actions: {
        setAuth: (token) => {
          Cookies.set("token", token, {
            expires: 1 / 96,
            path: "/",
            sameSite: "lax",
          });

          set({
            token,
            isAuthenticated: true,
          });
        },

        logout: () => {
          Cookies.remove("token");

          set({
            token: null,
            isAuthenticated: false,
          });

          window.location.href = "/login";
        },
      },
    }),
    {
      name: "auth-storage",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const useAuthActions = () => useAuthStore((state) => state.actions);
