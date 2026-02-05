import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Signup = () => {
    const navigate = useNavigate();
    const signup = useAuthStore((s) => s.signup);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signup({ name, email, password });
            navigate("/");
        } catch (err) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
        min-h-screen w-full
        bg-black text-white
        flex items-center justify-center
        px-6
      "
        >
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
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white/90">
                        Create an account
                    </h1>

                    <p className="mt-2 text-sm sm:text-base text-white/55">
                        Start creating with MarketIt
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="block mb-2 text-sm text-white/65">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
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
                        <label className="block mb-2 text-sm text-white/65">
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
                        <label className="block mb-2 text-sm text-white/65">
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
              mt-2
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
                        {loading ? "Creating account…" : "Sign up"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-sm sm:text-base text-white/45 text-center">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-white/80 hover:text-white underline underline-offset-4"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
