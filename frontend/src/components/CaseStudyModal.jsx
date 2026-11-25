import { X, Layers, Cpu, Database, Sparkles, ArrowRight, Image, Megaphone, AudioLines, Github, Linkedin, Mail } from 'lucide-react';

const STACK_GROUPS = [
  {
    title: 'Frontend Studio',
    icon: Layers,
    items: ['React 19 & Vite 6', 'Tailwind CSS 4', 'Zustand State', 'GSAP Motion'],
  },
  {
    title: 'Backend & Orchestration',
    icon: Cpu,
    items: ['Node.js & Express', 'REST Pipeline', 'Retry & Backoff', 'Platform Rule Engines'],
  },
  {
    title: 'AI Models & Storage',
    icon: Database,
    items: ['Gemini 3 Pro Image', 'Gemini 2.5 / 3 Flash', 'Gemini Flash TTS', 'Supabase & Cloudinary'],
  },
];

const PIPELINE_MODULES = [
  {
    icon: Image,
    title: 'Visual Asset Engine',
    summary:
      'Ingests extracted brand colors, logos, and reference imagery, maps visual tone instructions, and enforces social aspect-ratio rules before 4K generation.',
  },
  {
    icon: Megaphone,
    title: 'Campaign Copy Engine',
    summary:
      'Injects platform-specific hook, formatting, and character rules alongside brand persona context to output structured copy, hashtags, and posting windows.',
  },
  {
    icon: AudioLines,
    title: 'Voice & Audio Ad Engine',
    summary:
      'Converts product brief and 5-axis tone sliders into structured 15–20s single or multi-speaker scripts, then synthesizes PCM audio with director voice styling.',
  },
];

const CaseStudyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 font-outfit">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[88vh] bg-[#141416] border border-zinc-400/25 rounded-3xl shadow-[0_32px_120px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/15 flex items-center justify-center">
              <Sparkles size={18} className="text-[#f4f4f0]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                Adverra · Architecture & Case Study
              </h2>
              <p className="text-xs text-zinc-400">
                Multi-Modal AI Marketing Platform Showcase
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close Architecture Sheet"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 sm:p-8 space-y-6">
          {/* Overview */}
          <div className="rounded-2xl bg-black/40 border border-white/10 p-5 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Project Brief
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed">
              Adverra is a full-stack multi-modal creative studio built to solve brand inconsistency across marketing channels. Given only a company domain, the system extracts brand identity kits (logos, color palettes, tone, and slogans) and feeds that context into specialized image, social campaign, and voice-ad generation pipelines.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed pt-1">
              In this public portfolio showcase mode, live external LLM, Cloudinary, and Supabase dependencies are simulated client-side with realistic pre-rendered outputs, synthetic audio spots, and interactive walkthrough flows so reviewers can explore the complete workflow immediately.
            </p>
          </div>

          {/* End-to-End Architecture Flow */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Request & Generation Flow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { step: '01 · Context', label: 'Domain Brand Kit Extraction' },
                { step: '02 · Rules', label: 'Platform & Tone Prompt Builder' },
                { step: '03 · Inference', label: 'Gemini Image / Copy / TTS' },
                { step: '04 · Delivery', label: 'Cloudinary & Supabase Persist' },
              ].map((node, idx) => (
                <div
                  key={node.step}
                  className="relative rounded-2xl bg-zinc-900/70 border border-white/10 p-4 flex flex-col justify-between gap-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {node.step}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#f4f4f0] leading-snug">
                    {node.label}
                  </span>
                  {idx < 3 && (
                    <ArrowRight
                      size={14}
                      className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 z-10 bg-[#141416] rounded-full"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Core Stack
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STACK_GROUPS.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f4f4f0]">
                    <group.icon size={15} className="text-zinc-300" />
                    <span>{group.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-white/10 text-xs text-zinc-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Studio Modules */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Engineering Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PIPELINE_MODULES.map((mod) => (
                <div
                  key={mod.title}
                  className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <mod.icon size={16} className="text-zinc-300" />
                    <span>{mod.title}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {mod.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Author / Contact Bar */}
          <div className="rounded-2xl bg-zinc-900/70 border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Built by Suraj Shrivastav
              </div>
              <div className="text-xs text-zinc-400">
                AI Full Stack Developer · NeuralArc.ai
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://www.linkedin.com/in/suraj-shrivastav"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-zinc-200 hover:text-white transition-all"
              >
                <Linkedin size={13} />
                LinkedIn
              </a>
              <a
                href="https://github.com/suraj-shrivastav"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-zinc-200 hover:text-white transition-all"
              >
                <Github size={13} />
                GitHub
              </a>
              <a
                href="mailto:surajshrivastav07@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f4f4f0] hover:bg-white text-xs font-bold text-zinc-950 transition-all"
              >
                <Mail size={13} />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyModal;
