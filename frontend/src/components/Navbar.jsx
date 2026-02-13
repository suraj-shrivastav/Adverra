import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Image as ImageIcon, Megaphone, AudioLines, LogOut, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const handleLogout = async () => {
        setIsProfileOpen(false);
        await logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Image', path: '/image', icon: ImageIcon },
        { name: 'Campaign', path: '/campaign', icon: Megaphone },
        { name: 'Audio', path: '/audio', icon: AudioLines },
    ];

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 sm:p-6 pointer-events-none">
                <nav className="pointer-events-auto w-full max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl sm:rounded-[32px] shadow-2xl">

                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex justify-start">
                        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                                <LayoutGrid size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
                            </div>
                            <span className="text-lg sm:text-xl font-black text-white tracking-tighter font-space uppercase">Adverra</span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links - Hidden on mobile, visible on md+ */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-4 lg:px-6 py-2 rounded-xl transition-all group ${isActive
                                        ? 'bg-white text-black font-black shadow-lg shadow-white/10'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <link.icon size={14} className={isActive ? 'text-black' : 'text-gray-600 group-hover:text-white'} />
                                    <span className="text-[11px] font-black uppercase tracking-widest font-space">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: User Info & Auth */}
                    <div className="flex items-center justify-end gap-2 sm:gap-4 lg:gap-6 text-white">
                        {user ? (
                            <>
                                {/* Credits - Simplified on mobile */}
                                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                                    <Zap size={12} className="sm:w-[14px] sm:h-[14px] text-white fill-white/20" />
                                    <span className="text-[10px] sm:text-[11px] font-black font-space uppercase tracking-widest">
                                        <span className="hidden sm:inline">100 Credits</span>
                                        <span className="sm:hidden">100</span>
                                    </span>
                                </div>

                                {/* Profile Trigger */}
                                <div
                                    onClick={() => setIsProfileOpen(true)}
                                    className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all group pointer-events-auto"
                                >
                                    <User size={16} className="sm:w-[18px] sm:h-[18px] text-white group-hover:scale-110 transition-transform" />
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 sm:px-8 py-2 sm:py-2.5 bg-white text-black rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg shadow-white/10 font-space"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </div>

            {/* Mobile Bottom Navigation - Visible only on mobile */}
            {user && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pointer-events-none">
                    <div className="pointer-events-auto bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl p-1">
                        <div className="flex items-center justify-around gap-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex-1 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all ${isActive
                                            ? 'bg-white text-black'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <link.icon size={18} className={isActive ? 'text-black' : 'text-gray-600'} />
                                        <span className="text-[9px] font-black uppercase tracking-widest font-space">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal Overlay */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsProfileOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl sm:rounded-[32px] p-6 sm:p-8 shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative space-y-6 sm:space-y-8">
                            {/* User Header */}
                            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
                                    <User size={32} className="sm:w-10 sm:h-10 text-white/20" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tighter font-space uppercase break-words max-w-full">
                                        {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Member'}
                                    </h3>
                                    <p className="text-gray-500 text-xs sm:text-sm font-medium break-all">{user?.email}</p>
                                </div>
                            </div>

                            {/* Info Stats */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="p-3 sm:p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest font-space">User Role</span>
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest font-space">Professional</span>
                                </div>
                                <div className="p-3 sm:p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest font-space">Credits</span>
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest font-space">100 / ∞</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-3 sm:py-4 bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all font-space group"
                                >
                                    <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                                    Logout of Adverra
                                </button>

                                <button
                                    onClick={() => setIsProfileOpen(false)}
                                    className="w-full py-3 sm:py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors font-space"
                                >
                                    Return to Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;