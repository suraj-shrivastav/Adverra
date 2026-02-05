import { supabase } from "../config/supabase.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email, and password are required",
            });
        }

        const { data, error } = await supabase.auth.signUp({
            name,
            email,
            password,
        });

        if (error) throw error;

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error signing up:", error.message);
        return res.status(500).json({
            error: "Failed to sign up",
            details: error.message,
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required",
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error logging in:", error.message);
        return res.status(500).json({
            error: "Failed to log in",
            details: error.message,
        });
    }
}

export const checkAuth = async (req, res) => {
    try {
        console.log("Auth Check Hit");
        const { data, error } = await supabase.auth.session();
        console.log(data);
        if (error) throw error;

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error checking auth:", error.message);
        return res.status(500).json({
            error: "Failed to check auth",
            details: error.message,
        });
    }
}