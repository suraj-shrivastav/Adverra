import { createContext, useContext } from "react";

const AuthContext = createContext({});

const SHOWCASE_USER = {
    id: "showcase-user",
    email: "showcase@adverra.ai",
    user_metadata: { name: "Adverra Showcase" },
};

const SHOWCASE_SESSION = { access_token: "showcase-mode" };

export const AuthProvider = ({ children }) => {
    const signUp = async () => ({
        data: { user: SHOWCASE_USER, session: SHOWCASE_SESSION },
        error: null,
    });

    const signIn = async () => ({
        data: { user: SHOWCASE_USER, session: SHOWCASE_SESSION },
        error: null,
    });

    const logout = async () => ({ error: null });

    const value = {
        signIn,
        logout,
        signUp,
        user: SHOWCASE_USER,
        session: SHOWCASE_SESSION,
        authEnabled: false,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
