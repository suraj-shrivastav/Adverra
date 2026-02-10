import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
            <div
                className="
          group
          relative
          flex items-center justify-between
          min-w-[360px] sm:min-w-[440px] md:min-w-[600px]
          hover:min-w-[800px]
          rounded-full
          border border-white/20 hover:border-white/40
          px-6 sm:px-8 hover:px-12
          py-6 sm:py-10
          transition-all duration-500 ease-out
          bg-transparent
        "
            >
                {/* LEFT — Brand */}
                <Link
                    to="/"
                    className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-white/90 hover:text-white transition"
                >
                    MarketIt
                </Link>

                {/* RIGHT — Links */}
                <div className="flex items-center gap-4 sm:gap-8 text-sm sm:text-base md:text-lg text-white/65">
                    <Link
                        to="/assets"
                        className="hover:text-white transition-colors duration-200"
                    >
                        Assets
                    </Link>

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="
                                flex items-center gap-2
                                rounded-full
                                bg-white/10
                                border border-white/20
                                px-4 sm:px-6
                                py-1.5 sm:py-2
                                text-sm sm:text-base
                                text-white
                                font-medium
                                transition
                                hover:bg-white/20
                                hover:border-white/40
                            "
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hover:text-white transition-colors duration-200"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="
                                    rounded-full
                                    bg-white
                                    px-4 sm:px-6
                                    py-1.5 sm:py-2
                                    text-sm sm:text-base md:text-lg
                                    text-black
                                    font-semibold
                                    transition
                                    hover:bg-gray-200
                                "
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
