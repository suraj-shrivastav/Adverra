import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Image as ImageIcon, MessageSquare, AudioLines, LogOut, User, Zap } from 'lucide-react';
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
        { name: 'Campaign', path: '/campaign', icon: MessageSquare },
        { name: 'Audio', path: '/audio', icon: AudioLines },
    ];

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
                <nav className="pointer-events-auto w-full max-w-7xl flex items-center justify-between px-8 py-3 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl">

                    {/* Left: Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                                <LayoutGrid size={18} className="text-white" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter font-space uppercase">Hub</span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all group ${isActive
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
                    <div className="flex-1 flex items-center justify-end gap-6 text-white">
                        {user ? (
                            <>
                                {/* Credits */}
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                                    <Zap size={14} className="text-yellow-500 fill-yellow-500/20" />
                                    <span className="text-[11px] font-black font-space uppercase tracking-widest">100 Credits</span>
                                </div>

                                {/* Profile Trigger */}
                                <div
                                    onClick={() => setIsProfileOpen(true)}
                                    className="w-9 h-9 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all group pointer-events-auto"
                                >
                                    <User size={18} className="text-white group-hover:scale-110 transition-transform" />
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-8 py-2.5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg shadow-white/10 font-space"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </div>

            {/* Profile Modal Overlay */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsProfileOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative space-y-8">
                            {/* User Header */}
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
                                    <User size={40} className="text-white/20" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-white tracking-tighter font-space uppercase">
                                        {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Member'}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium">{user?.email}</p>
                                </div>
                            </div>

                            {/* Info Stats */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest font-space">User Role</span>
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest font-space">Professional</span>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest font-space">Credits</span>
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest font-space">100 / ∞</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/[0.03] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-all font-space group"
                                >
                                    <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                                    Logout of Hub
                                </button>

                                <button
                                    onClick={() => setIsProfileOpen(false)}
                                    className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors font-space"
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
