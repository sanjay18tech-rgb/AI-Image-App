import { create } from "zustand";

type User = {
  id: string;
  email: string;
  createdAt: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setAuth: (data: { user: User; token: string }) => void;
  signOut: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  setAuth: (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },
  signOut: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
  hydrate: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ token, user, hydrated: true });
      } catch {
        // If parsing fails, clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ hydrated: true });
      }
    } else {
      set({ hydrated: true });
    }
  },
}));

