import { create } from "zustand";
import { supabase } from "../../lib/supabase";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

interface AuthState {
  user: any;
  setUser: (user: any) => void;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  checkAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ user: null });
    }
  },
}));

// Auth state değişikliklerini dinle
supabase.auth.onAuthStateChange(
  (event: AuthChangeEvent, session: Session | null) => {
    if (session?.user) {
      useAuthStore.getState().setUser(session.user);
    } else {
      useAuthStore.getState().setUser(null);
    }
  }
);
