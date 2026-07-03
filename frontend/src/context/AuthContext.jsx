import { useState, useEffect, createContext, useContext } from "react";
import { supabase, AUTH_ENABLED } from "../libs/supabaseClient";

const AuthContext = createContext({});

const MOCK_USER = {
    id: "local-dev-user",
    email: "dev@adverra.local",
    user_metadata: { name: "Dev User" },
};

const MOCK_SESSION = { access_token: "no-auth" };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(AUTH_ENABLED ? null : MOCK_USER);
    const [session, setSession] = useState(AUTH_ENABLED ? null : MOCK_SESSION);
    const [loading, setLoading] = useState(AUTH_ENABLED);

    useEffect(() => {
        if (!AUTH_ENABLED) return;

        const setData = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) throw error;

            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        setData();

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signUp = async (data) => {
        if (!AUTH_ENABLED) return { data: { user: MOCK_USER }, error: null };
        const { data: authData, error: authError } =
            await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });
        return { data: authData, error: authError };
    };

    const signIn = async (data) => {
        if (!AUTH_ENABLED) return { data: { user: MOCK_USER, session: MOCK_SESSION }, error: null };
        const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword(data);
        return { data: authData, error: authError };
    };

    const logout = async () => {
        if (!AUTH_ENABLED) return;
        return await supabase.auth.signOut();
    };

    const value = {
        signIn,
        logout,
        signUp,
        user,
        session,
        authEnabled: AUTH_ENABLED,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
