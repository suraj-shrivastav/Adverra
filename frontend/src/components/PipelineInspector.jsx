import { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Sparkles } from 'lucide-react';

const PipelineInspector = ({
  title = 'Pipeline & Engineered Prompt',
  model = 'Gemini',
  steps = [],
  promptPreview = '',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-zinc-400/25 bg-zinc-900/75 overflow-hidden font-outfit">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Cpu size={14} className="text-zinc-300 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-100 truncate">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-white/10 text-[10px] font-semibold text-zinc-300">
            {model}
          </span>
          {isOpen ? (
            <ChevronUp size={15} className="text-zinc-400" />
          ) : (
            <ChevronDown size={15} className="text-zinc-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-3">
          {steps.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {steps.map((step, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-[11px] text-zinc-300"
                >
                  <Sparkles size={10} className="text-zinc-400" />
                  {step}
                </span>
              ))}
            </div>
          )}

          {promptPreview && (
            <div className="rounded-xl bg-black/60 border border-white/10 p-3 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Engineered Prompt Context
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {promptPreview}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PipelineInspector;
