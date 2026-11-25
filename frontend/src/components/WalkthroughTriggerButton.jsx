import { Play } from 'lucide-react';
import { useWalkthrough } from '../context/WalkthroughContext';

const WalkthroughTriggerButton = ({
  startMode = 'image',
  variant = 'toolbar',
  label = 'Walkthrough',
}) => {
  const { isActive, startWalkthrough } = useWalkthrough();

  const variantClasses = {
    hero: 'rounded-2xl px-8 py-4 text-base font-semibold gap-2.5 w-full sm:w-auto',
    pill: 'rounded-full px-4 sm:px-5 py-3 text-sm font-bold gap-2',
    toolbar: 'rounded-2xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold gap-2',
  }[variant];

  const labelClasses = variant === 'toolbar' ? 'hidden sm:inline' : '';
  const isHeroGlow = variant === 'hero' && !isActive;

  return (
    <button
      type="button"
      onClick={() => startWalkthrough(startMode, true)}
      className={`group relative inline-flex items-center justify-center border bg-zinc-800/85 text-zinc-100 hover:bg-zinc-700/90 hover:border-white/85 transition-all backdrop-blur-md active:scale-95 font-outfit ${
        isHeroGlow
          ? 'animate-border-glow border-[#f4f4f0]/75'
          : 'border-zinc-300/45 shadow-[0_0_20px_rgba(244,244,245,0.14)] hover:shadow-[0_0_28px_rgba(244,244,245,0.28)]'
      } ${variantClasses}`}
    >
      {isHeroGlow && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[2px] rounded-[inherit] border border-[#f4f4f0]/60 blur-[3px] animate-pulse"
        />
      )}
      <Play size={variant === 'hero' ? 16 : 14} className="fill-current shrink-0 relative" />
      <span className={`relative ${labelClasses}`}>{label}</span>
    </button>
  );
};

export default WalkthroughTriggerButton;
