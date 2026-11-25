import axios from "axios";
import { supabase, AUTH_ENABLED } from "./supabaseClient";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "/api";

if (import.meta.env.VITE_BACKEND_URL) {
    console.log("Base URL is: ", API_BASE_URL)
}

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach Supabase JWT only when auth is enabled
api.interceptors.request.use(async (config) => {
    if (AUTH_ENABLED && supabase) {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Global error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message;
        console.error("API Error:", message);
        return Promise.reject(error);
    }
);
