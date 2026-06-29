import { create } from "zustand";
import Cookies from "js-cookie";
import { PendingReviewContract } from "../types";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  pendingReviewContracts: PendingReviewContract[];
  actions: {
    setAuth: (token: string, pendingReviewContracts?: PendingReviewContract[]) => void;
    setPendingReviewContracts: (
      contracts:
        | PendingReviewContract[]
        | ((prev: PendingReviewContract[]) => PendingReviewContract[])
    ) => void;
    logout: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: Cookies.get("token") ?? null,
  isAuthenticated: !!Cookies.get("token"),
  pendingReviewContracts: [],

  actions: {
    setAuth: (token, pendingReviewContracts) => {
      Cookies.set("token", token, {
        expires: 1 / 96,
        path: "/",
        sameSite: "lax",
      });

      set((state) => ({
        token,
        isAuthenticated: true,
        pendingReviewContracts: pendingReviewContracts ?? state.pendingReviewContracts,
      }));
    },

    setPendingReviewContracts: (contracts) => {
      set((state) => {
        const next = typeof contracts === "function" ? contracts(state.pendingReviewContracts) : contracts;
        return { pendingReviewContracts: next };
      });
    },

    logout: () => {
      Cookies.remove("token");
      set({ token: null, isAuthenticated: false, pendingReviewContracts: [] });
      window.location.href = "/login";
    },
  },
}));

export const useAuthActions = () => useAuthStore((state) => state.actions);
