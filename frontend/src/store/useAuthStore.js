import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = import.meta.env.VITE_API_URL;
// console.log(API_URL);

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthLoading: false,

            login: async (payload) => {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error("Login failed");

                const data = await res.json();
                set({ user: data.user, token: data.token });
            },

            signup: async (payload) => {
                const res = await fetch(`${API_URL}/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error("Signup failed");

                const data = await res.json();
                set({ user: data.user, token: data.token });
            },

            logout: () => set({ user: null, token: null }),

            checkAuth: async () => {
                const token = get().token;
                if (!token) return;

                set({ isAuthLoading: true });
                console.log("Auth Check Hit");

                try {
                    const res = await fetch(`${API_URL}/auth/check`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(res);

                    if (!res.ok) throw new Error();

                    const data = await res.json();
                    set({ user: data.user });
                } catch {
                    set({ user: null, token: null });
                } finally {
                    set({ isAuthLoading: false });
                }
            },
        }),
        {
            name: "auth-storage", // key in localStorage
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
        }
    )
);
