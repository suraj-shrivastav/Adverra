import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signUp, session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate("/");
        }
    }, [session, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        const { error } = await signUp({ name, email, password });
        if (error) {
            alert(error.message);
        } else {
            alert("Check your email for confirmation!");
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 font-outfit">
            <div className="w-full max-w-md rounded-[40px] border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-white tracking-tighter font-outfit mb-3">
                        Join Adverra
                    </h1>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">
                        Initialize your brand's creative workspace.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] pl-1">
                            UserName
                        </label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-800 focus:border-white/20 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] pl-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-800 focus:border-white/20 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] pl-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-800 focus:border-white/20 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Primary CTA */}
                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-white text-black py-4 text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_8px_32px_rgba(255,255,255,0.1)] active:scale-[0.98] font-outfit mt-4"
                    >
                        Signup
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    Already part of Adverra?{" "}
                    <Link
                        to="/login"
                        className="text-white hover:text-gray-300 font-black tracking-tight transition-colors"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
