import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, Download } from 'lucide-react';

const BAR_HEIGHTS = [
  28, 46, 72, 55, 88, 64, 42, 78, 92, 58, 36, 70, 84, 50, 34, 68,
  90, 62, 48, 80, 56, 38, 74, 86, 60, 44, 76, 52, 66, 40, 58, 32,
];

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const mins = Math.floor(sec / 60);
  const rem = Math.floor(sec % 60);
  return `${mins}:${rem.toString().padStart(2, '0')}`;
}

const AudioWaveformPlayer = ({
  src,
  filename = 'audio-spot',
  title,
  modeLabel,
  variants = [],
  activeVariantId,
  onSelectVariant,
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
      el.load();
    }
  }, [src]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Audio play failed:', err);
      }
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  const handleSeek = (ratio) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const nextTime = Math.max(0, Math.min(duration, ratio * duration));
    el.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename || 'audio'}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const progressRatio = useMemo(() => {
    if (!duration) return 0;
    return Math.max(0, Math.min(1, currentTime / duration));
  }, [currentTime, duration]);

  return (
    <div className="w-full space-y-5 font-outfit">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      {/* Voice Mode Comparison Switcher */}
      {variants.length > 1 && onSelectVariant && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Compare Voice Formats
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {variants.map((variant) => {
              const selected = variant.id === activeVariantId;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onSelectVariant(variant)}
                  className={`px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-[#f4f4f0] text-zinc-950 border-white shadow-sm'
                      : 'bg-black/50 text-zinc-300 border-white/10 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold truncate">
                    {variant.label}
                  </div>
                  <div
                    className={`text-[10px] uppercase tracking-wider ${
                      selected ? 'text-zinc-600' : 'text-zinc-500'
                    }`}
                  >
                    {variant.sublabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Waveform Surface */}
      <div className="rounded-2xl bg-zinc-900/70 border border-white/15 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {title || filename}
            </div>
            {modeLabel && (
              <div className="text-[10px] uppercase tracking-wider text-zinc-400">
                {modeLabel}
              </div>
            )}
          </div>
          <span className="text-xs font-semibold text-zinc-300 tabular-nums shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Clickable Waveform Bars */}
        <div
          className="h-16 flex items-center gap-1 cursor-pointer select-none"
          role="slider"
          aria-label="Audio playback progress"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          tabIndex={0}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            handleSeek(ratio);
          }}
        >
          {BAR_HEIGHTS.map((heightPct, idx) => {
            const barRatio = (idx + 0.5) / BAR_HEIGHTS.length;
            const active = barRatio <= progressRatio;
            return (
              <div
                key={idx}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  active
                    ? 'bg-[#f4f4f0]'
                    : isPlaying
                    ? 'bg-zinc-600/80'
                    : 'bg-zinc-700/70 hover:bg-zinc-500/80'
                }`}
                style={{ height: `${heightPct}%` }}
              />
            );
          })}
        </div>

        {/* Transport Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#f4f4f0] hover:bg-white text-zinc-950 text-xs font-bold transition-all active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause size={14} />
                Pause Ad
              </>
            ) : (
              <>
                <Play size={14} className="fill-current" />
                Play Voice Ad
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 transition-all"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all active:scale-95"
          >
            <Download size={14} />
            Download WAV
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioWaveformPlayer;
