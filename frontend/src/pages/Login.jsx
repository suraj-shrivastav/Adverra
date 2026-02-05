import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login({ email, password });
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-white flex items-center justify-center px-6">
            <div
                className="
          w-full max-w-md
          rounded-2xl
          border border-white/15
          backdrop-blur-xl
          p-6 sm:p-8
        "
            >
                {/* Header */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-white/90 text-center">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm sm:text-base text-white/55 text-center">
                    Log in to your MarketIt account
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="block text-sm text-white/65 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="
                w-full rounded-lg
                border border-white/15
                bg-transparent
                px-4 py-3 sm:py-3.5
                text-white
                placeholder-white/30
                focus:outline-none focus:border-white/40
              "
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/65 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="
                w-full rounded-lg
                border border-white/15
                bg-transparent
                px-4 py-3 sm:py-3.5
                text-white
                placeholder-white/30
                focus:outline-none focus:border-white/40
              "
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full rounded-xl
              bg-white
              py-3.5
              text-base sm:text-lg
              font-medium
              text-black
              hover:bg-gray-200
              transition
              disabled:opacity-60
            "
                    >
                        {loading ? "Logging in…" : "Log in"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-sm sm:text-base text-white/45 text-center">
                    Don’t have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-white/80 hover:text-white underline underline-offset-4"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
