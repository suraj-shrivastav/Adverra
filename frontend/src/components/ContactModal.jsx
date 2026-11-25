import { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';

const PROFILE_LINKS = [
  {
    label: 'LinkedIn',
    sublabel: 'linkedin.com/in/suraj-shrivastav',
    href: 'https://www.linkedin.com/in/suraj-shrivastav',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    sublabel: 'github.com/suraj-shrivastav',
    href: 'https://github.com/suraj-shrivastav',
    icon: Github,
  },
  {
    label: 'Portfolio',
    sublabel: 'newportfolio-nine-bice.vercel.app',
    href: 'https://newportfolio-nine-bice.vercel.app/',
    icon: Globe,
  },
];

const CORE_SKILLS = [
  'Python & FastAPI',
  'React & Node.js',
  'Gemini & AWS Bedrock',
  'RAG & Vector Search',
  'LiveKit & Deepgram',
  'PostgreSQL · Redis · Supabase',
];

const ContactModal = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const email = 'surajshrivastav07@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Copy email failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 font-outfit">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[88vh] bg-[#141416] border border-zinc-400/25 rounded-3xl shadow-[0_32px_120px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#f4f4f0] text-zinc-950 flex items-center justify-center font-black text-base shrink-0">
              SS
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase truncate">
                Suraj Shrivastav
              </h2>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 truncate">
                <span>AI Full Stack Developer · NeuralArc.ai</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close Contact Modal"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-all shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 sm:p-8 space-y-6">
          {/* Developer Summary */}
          <div className="rounded-2xl bg-black/45 border border-white/10 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                <Sparkles size={12} className="text-[#f4f4f0]" />
                About & Experience
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                <MapPin size={12} />
                Pune, India · Open to Opportunities
              </span>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed">
              AI Full Stack Developer and 2026 B.E. Computer Engineering graduate (CGPA 8.03/10), building multi-model LLM inference backends, RAG retrieval systems, and real-time voice workflows at <span className="text-white font-semibold">NeuralArc.ai</span> (formerly Full Stack Intern at Zymo).
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {CORE_SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-white/10 text-[11px] text-zinc-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Links */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Connect
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PROFILE_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl bg-zinc-900/75 hover:bg-zinc-800/90 border border-white/10 hover:border-white/30 p-4 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-black/50 border border-white/10 text-[#f4f4f0]">
                      <item.icon size={16} />
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-zinc-500 group-hover:text-white transition-colors"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {item.sublabel}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Email + Source Repo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-black/45 border border-white/10 p-4 flex items-center justify-between gap-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 min-w-0 group"
              >
                <div className="p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-[#f4f4f0] shrink-0">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Direct Email
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                    {email}
                  </div>
                </div>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-[11px] font-semibold text-zinc-200 flex items-center gap-1.5 shrink-0 transition-all"
              >
                {copiedEmail ? (
                  <>
                    <Check size={12} className="text-[#f4f4f0]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <a
              href="https://github.com/suraj-shrivastav/Adverra"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-black/45 border border-white/10 hover:border-white/30 p-4 flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-[#f4f4f0] shrink-0">
                  <Github size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Project Source
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                    suraj-shrivastav/Adverra
                  </div>
                </div>
              </div>
              <ExternalLink
                size={14}
                className="text-zinc-500 group-hover:text-white shrink-0 transition-colors"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
