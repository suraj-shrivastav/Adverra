import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pause, Play, Sparkles, X } from 'lucide-react';
import { useWalkthrough } from '../context/WalkthroughContext';
import { MODE_LABELS, WALKTHROUGH_MODES } from '../libs/walkthroughSteps.js';

const WalkthroughBar = () => {
  const {
    isActive,
    mode,
    stepIndex,
    totalSteps,
    currentStep,
    isFirstOverall,
    isLastOverall,
    isPlaying,
    stopWalkthrough,
    goToMode,
    nextStep,
    prevStep,
    togglePlay,
  } = useWalkthrough();

  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  if (!isActive) return null;

  return (
    <aside
      aria-label="Interactive Walkthrough Controller"
      data-testid="walkthrough-bar"
      className="fixed top-20 sm:top-24 left-3 sm:left-6 z-[140] w-[calc(100vw-1.5rem)] max-w-[356px] bg-[#232327]/95 border border-zinc-300/45 ring-1 ring-white/15 rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.75)] backdrop-blur-2xl text-zinc-100 font-outfit"
    >
      {/* Fixed Top-Left Header Bar with Dropdown Toggle */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((open) => !open)}
          className="flex items-center gap-2 min-w-0 text-left group"
          aria-expanded={isDropdownOpen}
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
            {isPlaying && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#f4f4f0] opacity-75 animate-ping" />
            )}
            <Sparkles size={13} className="text-[#f4f4f0] relative shrink-0" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#f4f4f0] whitespace-nowrap">
            Walkthrough
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-700/80 border border-zinc-500/40 text-[10px] font-semibold text-zinc-200 tabular-nums whitespace-nowrap">
            {MODE_LABELS[mode]} · {stepIndex + 1}/{totalSteps}
          </span>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            aria-label={isPlaying ? 'Pause Walkthrough' : 'Auto Play Walkthrough'}
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-[#f4f4f0] text-zinc-950 hover:bg-white transition-all"
            title={isPlaying ? 'Pause Auto Play' : 'Resume Auto Play'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="fill-current" />}
          </button>

          <button
            type="button"
            aria-label={isDropdownOpen ? 'Collapse Walkthrough' : 'Expand Walkthrough'}
            onClick={() => setIsDropdownOpen((open) => !open)}
            className="p-1.5 rounded-lg bg-zinc-700/70 hover:bg-zinc-600/80 border border-zinc-500/40 text-zinc-200 hover:text-white transition-all"
          >
            {isDropdownOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <button
            type="button"
            aria-label="Close Walkthrough"
            onClick={stopWalkthrough}
            className="p-1.5 rounded-lg bg-zinc-700/70 hover:bg-zinc-600/80 border border-zinc-500/40 text-zinc-200 hover:text-white transition-all"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Collapsible Dropdown Content */}
      {isDropdownOpen && (
        <div className="px-3.5 pb-3.5 pt-2.5 border-t border-zinc-400/20 space-y-3">
          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-zinc-900/70 p-1 rounded-xl border border-zinc-500/30">
            {WALKTHROUGH_MODES.map((m) => {
              const active = m === mode;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => goToMode(m)}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    active
                      ? 'bg-[#f4f4f0] text-zinc-950 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                  }`}
                >
                  {MODE_LABELS[m]}
                </button>
              );
            })}
          </div>

          {/* Step Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              <span>{MODE_LABELS[mode]} Studio</span>
              <span>{isPlaying ? 'Auto-Playing' : isLastOverall ? 'Completed' : 'Paused'}</span>
            </div>
            <h3 className="text-sm font-bold text-[#f4f4f0] leading-snug">
              {currentStep?.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {currentStep?.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }, (_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx <= stepIndex ? 'bg-[#f4f4f0]' : 'bg-zinc-600/60'
                }`}
              />
            ))}
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-400/20">
            <button
              type="button"
              onClick={prevStep}
              disabled={isFirstOverall}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-700/60 hover:bg-zinc-600/80 border border-zinc-400/30 text-xs font-semibold text-zinc-100 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
              Prev
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f4f4f0] text-zinc-950 hover:bg-white text-xs font-bold transition-all shadow-sm"
            >
              {isPlaying ? (
                <>
                  <Pause size={13} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={13} className="fill-current" />
                  {isLastOverall ? 'Replay' : 'Auto Play'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={isLastOverall ? stopWalkthrough : nextStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-700/60 hover:bg-zinc-600/80 border border-zinc-400/30 text-xs font-semibold text-zinc-100 transition-all"
            >
              {isLastOverall ? 'Finish' : 'Next'}
              {!isLastOverall && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default WalkthroughBar;
