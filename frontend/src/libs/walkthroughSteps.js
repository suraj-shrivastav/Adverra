// Pure step definitions and navigation state transitions for Showcase Walkthrough Mode

export const WALKTHROUGH_MODES = ['image', 'campaign', 'audio'];

export const MODE_LABELS = {
  image: 'Image',
  campaign: 'Campaign',
  audio: 'Audio',
};

export const MODE_ROUTES = {
  image: '/image',
  campaign: '/campaign',
  audio: '/audio',
};

export const WALKTHROUGH_STEPS = {
  image: [
    {
      id: 'image-brand',
      title: 'Select Brand Context',
      description: 'Switch workspace context to Lumina Audio to load its palette, slogan, and identity.',
      durationMs: 2200,
    },
    {
      id: 'image-brief',
      title: 'Configure Format & Copy',
      description: 'Set Instagram 4:5 format, Conversion objective, audience profile, and headline.',
      durationMs: 2400,
    },
    {
      id: 'image-style',
      title: 'Choose Visual Direction',
      description: 'Pick Cinematic layout, Bold brand expression, and the 3D visual tone.',
      durationMs: 2200,
    },
    {
      id: 'image-generate',
      title: 'Synthesizing Visual Asset',
      description: 'Simulates combining brand colors, aspect-ratio rules, and 3D style prompts.',
      durationMs: 1400,
    },
    {
      id: 'image-result',
      title: 'Asset Ready',
      description: 'Preview the Lumina One 3D hero ad ready for download or sharing.',
      durationMs: 3200,
    },
  ],
  campaign: [
    {
      id: 'campaign-brand',
      title: 'Target Brand & Channels',
      description: 'Select Verve Botanics and multi-target Instagram and LinkedIn.',
      durationMs: 2200,
    },
    {
      id: 'campaign-brief',
      title: 'Compose Campaign Brief',
      description: 'Fill in Morning Barrier Serum positioning, target audience, and calm tone.',
      durationMs: 2400,
    },
    {
      id: 'campaign-generate',
      title: 'Drafting Social Copy',
      description: 'Simulates channel-aware copywriting, posting window, and hashtag selection.',
      durationMs: 1400,
    },
    {
      id: 'campaign-result',
      title: 'Campaign Ready',
      description: 'Review tailored social copy, audience fit, and hashtags.',
      durationMs: 3200,
    },
  ],
  audio: [
    {
      id: 'audio-product',
      title: 'Product & Audience Brief',
      description: 'Populate Lumina One benefits, proof points, and remote creator pain points.',
      durationMs: 2400,
    },
    {
      id: 'audio-speakers',
      title: 'Tone Sliders & Dialogue',
      description: 'Tune 5-axis voice tone sliders and pair Multi-Speaker hosts Alex & Jordan.',
      durationMs: 2400,
    },
    {
      id: 'audio-generate',
      title: 'Producing Audio Spot',
      description: 'Simulates director-style script formatting and studio audio synthesis.',
      durationMs: 1400,
    },
    {
      id: 'audio-result',
      title: 'Listen to Audio Ad',
      description: 'Read the dialogue script, press Play for the spoken voice ad, or compare Single vs. Multi-Speaker.',
      durationMs: 0,
    },
  ],
};

export function getStepsForMode(mode) {
  return WALKTHROUGH_STEPS[mode] || WALKTHROUGH_STEPS.image;
}

export function getStepInfo(mode, stepIndex) {
  const steps = getStepsForMode(mode);
  const clampedIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
  return {
    step: steps[clampedIndex],
    stepIndex: clampedIndex,
    totalSteps: steps.length,
    isFirstOverall: mode === WALKTHROUGH_MODES[0] && clampedIndex === 0,
    isLastOverall:
      mode === WALKTHROUGH_MODES[WALKTHROUGH_MODES.length - 1] &&
      clampedIndex === steps.length - 1,
  };
}

export function getNextStepState(mode, stepIndex) {
  const steps = getStepsForMode(mode);
  if (stepIndex + 1 < steps.length) {
    return { mode, stepIndex: stepIndex + 1 };
  }
  const modeIdx = WALKTHROUGH_MODES.indexOf(mode);
  if (modeIdx >= 0 && modeIdx + 1 < WALKTHROUGH_MODES.length) {
    return { mode: WALKTHROUGH_MODES[modeIdx + 1], stepIndex: 0 };
  }
  return null;
}

export function getPrevStepState(mode, stepIndex) {
  if (stepIndex > 0) {
    return { mode, stepIndex: stepIndex - 1 };
  }
  const modeIdx = WALKTHROUGH_MODES.indexOf(mode);
  if (modeIdx > 0) {
    const prevMode = WALKTHROUGH_MODES[modeIdx - 1];
    const prevSteps = getStepsForMode(prevMode);
    return { mode: prevMode, stepIndex: prevSteps.length - 1 };
  }
  return null;
}

export function getRouteForMode(mode) {
  return MODE_ROUTES[mode] || '/image';
}
