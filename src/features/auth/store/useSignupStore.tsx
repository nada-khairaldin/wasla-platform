import { create } from "zustand";
import { SignupFormData } from "../schemas/authSchema";
import { createJSONStorage, persist } from "zustand/middleware";

interface SignupState {
  formData: Partial<SignupFormData>;

  actions: {
    setStepData: (data: Partial<SignupFormData>) => void;
    resetSignup: () => void;
  };
}
export const useSignupStore = create<SignupState>()(
  persist(
    (set) => ({
      formData: {},
      actions: {
        setStepData: (data) =>
          set((state) => ({
            formData: { ...state.formData, ...data },
          })),
        resetSignup: () => set({ formData: {} }),
      },
    }),
    {
      name: "wasla-signup-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: state.formData,
      }), // to not store actions which is not necessary for storing
    },
  ),
);

export const useSignupActions = () => useSignupStore((state) => state.actions);
