// Pure showcase mock data & generators for client-side portfolio walkthroughs

export function makeSvgLogoDataUri(letter = 'A', bgColor = '#18181B', textColor = '#FFFFFF') {
  const safeLetter = String(letter || 'A').slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="${bgColor}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="56" fill="${textColor}">${safeLetter}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const TONE_IMAGE_MAP = {
  claymorphism_prompt: '/claymorphism_prompt.jpg',
  retro_cel_shaded_prompt: '/retro_cel_shaded_prompt.jpg',
  cyber_organic_prompt: '/cyber_organic_prompt.jpg',
  hand_drawn_prompt: '/hand_drawn_prompt.jpg',
  three_d_prompt: '/three_d_prompt.jpg',
  hyper_realistic_prompt: '/hyper_realistic_prompt.jpg',
};

export const INITIAL_BRANDS = [
  {
    id: 1,
    title: 'Adverra',
    domain: 'adverra.ai',
    description:
      'AI-powered creative marketing studio enabling brand teams to craft consistent visuals, social copy, and audio ads in seconds.',
    slogan: 'One platform. Every asset type. Always on-brand.',
    logos: [
      { type: 'icon', url: '/adverra.jpg' },
      { type: 'logo', url: makeSvgLogoDataUri('AD', '#111111', '#FFFFFF') },
    ],
    colors: [
      { hex: '#3B82F6', name: 'Electric Blue' },
      { hex: '#FFFFFF', name: 'Pure White' },
      { hex: '#8B5CF6', name: 'Violet Pulse' },
      { hex: '#111111', name: 'Obsidian' },
    ],
    socials: [
      { type: 'linkedin', url: 'https://linkedin.com' },
      { type: 'x', url: 'https://x.com' },
      { type: 'instagram', url: 'https://instagram.com' },
    ],
    address: { city: 'San Francisco', state_code: 'CA' },
    backdrops: [],
  },
  {
    id: 2,
    title: 'Lumina Audio',
    domain: 'lumina.audio',
    description:
      'Minimalist spatial audio hardware engineered for studio-grade clarity, active silence, and all-day ergonomic comfort.',
    slogan: 'Pure sound, sculpted in silence.',
    logos: [
      { type: 'icon', url: makeSvgLogoDataUri('LA', '#F59E0B', '#09090B') },
      { type: 'logo', url: makeSvgLogoDataUri('LA', '#18181B', '#F59E0B') },
    ],
    colors: [
      { hex: '#F59E0B', name: 'Amber Gold' },
      { hex: '#18181B', name: 'Matte Carbon' },
      { hex: '#E4E4E7', name: 'Brushed Silver' },
    ],
    socials: [
      { type: 'instagram', url: 'https://instagram.com' },
      { type: 'x', url: 'https://x.com' },
    ],
    address: { city: 'Austin', state_code: 'TX' },
    backdrops: [],
  },
  {
    id: 3,
    title: 'Verve Botanics',
    domain: 'vervebotanics.co',
    description:
      'Clean clinical botanical skincare formulated with cold-pressed actives for daily barrier resilience and natural glow.',
    slogan: 'Earth-born rituals for radiant skin.',
    logos: [
      { type: 'icon', url: makeSvgLogoDataUri('VB', '#10B981', '#022C22') },
      { type: 'logo', url: makeSvgLogoDataUri('VB', '#064E3B', '#ECFDF5') },
    ],
    colors: [
      { hex: '#10B981', name: 'Botanical Emerald' },
      { hex: '#064E3B', name: 'Deep Moss' },
      { hex: '#ECFDF5', name: 'Dew Mist' },
    ],
    socials: [
      { type: 'instagram', url: 'https://instagram.com' },
      { type: 'facebook', url: 'https://facebook.com' },
    ],
    address: { city: 'Portland', state_code: 'OR' },
    backdrops: [],
  },
];

export const INITIAL_ASSETS = [
  {
    id: 101,
    img_url: '/hyper_realistic_prompt.jpg',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 102,
    img_url: '/three_d_prompt.jpg',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 103,
    img_url: '/cyber_organic_prompt.jpg',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 104,
    img_url: '/claymorphism_prompt.jpg',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const INITIAL_CAMPAIGNS = [
  {
    id: 201,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    campaign: {
      title: 'Lumina Studio Headphones — Silence Launch',
      actualCampaign:
        'Noise shouldn’t dictate your focus.\n\nMeet Lumina One: spatial acoustics, 48-hour battery life, and adaptive silence tuned to the way you work and unwind.\n\nExperience studio clarity anywhere. Reserve your pair today.',
      targetAudience: 'Remote creatives, audio engineers, and deep-work professionals (24-42)',
      hashtags: ['#LuminaAudio', '#SpatialSound', '#DeepFocus', '#MinimalTech', '#StudioClarity'],
      bestTimeToPost: '9:30 AM EST',
    },
  },
  {
    id: 202,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    campaign: {
      title: 'Adverra Multi-Modal Brand Hub Showcase',
      actualCampaign:
        'Your brand voice shouldn’t reset with every channel.\n\nGenerate platform-ready visuals, scroll-stopping social copy, and studio audio ads from a single brand kit—all aligned to your palette, tone, and audience.\n\nTry the unified creative workflow now.',
      targetAudience: 'Growth marketers, brand managers, and startup founders',
      hashtags: ['#Adverra', '#BrandIntelligence', '#AIMarketing', '#CreativeOps', '#ContentAtScale'],
      bestTimeToPost: '11:00 AM EST',
    },
  },
  {
    id: 203,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    campaign: {
      title: 'Verve Botanics — Morning Barrier Serum',
      actualCampaign:
        'Three drops before coffee. Calm, hydrated skin until midnight.\n\nCold-pressed sea buckthorn meets clinical ceramides in our lightweight Morning Barrier Serum—zero synthetic fragrance, 100% daily resilience.\n\nShop the clean ritual.',
      targetAudience: 'Ingredient-conscious skincare buyers seeking minimalist routines',
      hashtags: ['#VerveBotanics', '#CleanSkincare', '#BarrierCare', '#BotanicalGlow'],
      bestTimeToPost: '7:00 PM EST',
    },
  },
];

export function createBrandFromDomain(domainInput, nextId = Date.now()) {
  const cleaned = String(domainInput || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0];

  const domain = cleaned || 'newbrand.io';
  const slug = domain.split('.')[0] || 'Brand';
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);

  const palettes = [
    [
      { hex: '#6366F1', name: 'Indigo Spark' },
      { hex: '#0F172A', name: 'Midnight Slate' },
      { hex: '#F8FAFC', name: 'Cloud White' },
    ],
    [
      { hex: '#EC4899', name: 'Vivid Rose' },
      { hex: '#18181B', name: 'Charcoal' },
      { hex: '#FAFAFA', name: 'Chalk' },
    ],
    [
      { hex: '#14B8A6', name: 'Teal Pulse' },
      { hex: '#042F2E', name: 'Deep Pine' },
      { hex: '#CCFBF1', name: 'Mint Mist' },
    ],
  ];

  const palette = palettes[Math.abs(title.charCodeAt(0)) % palettes.length];
  const logoUri = makeSvgLogoDataUri(title.slice(0, 2), palette[0].hex, '#FFFFFF');

  return {
    id: nextId,
    title,
    domain,
    description: `${title} delivers modern digital-first experiences and high-trust products tailored for today's connected audiences.`,
    slogan: `${title} — Built for what comes next.`,
    logos: [
      { type: 'icon', url: logoUri },
      { type: 'logo', url: makeSvgLogoDataUri(title.slice(0, 1), '#111111', palette[0].hex) },
    ],
    colors: palette,
    socials: [
      { type: 'linkedin', url: 'https://linkedin.com' },
      { type: 'instagram', url: 'https://instagram.com' },
      { type: 'x', url: 'https://x.com' },
    ],
    address: { city: 'New York', state_code: 'NY' },
    backdrops: [],
  };
}

export function selectMockAssetImage(toneId, fallbackIndex = 0) {
  if (toneId && TONE_IMAGE_MAP[toneId]) {
    return TONE_IMAGE_MAP[toneId];
  }
  const allImages = Object.values(TONE_IMAGE_MAP);
  return allImages[Math.abs(fallbackIndex) % allImages.length];
}

export function buildMockCampaign({ prompt = {}, campaignData = {} }) {
  const brandName = campaignData.title || 'Your Brand';
  const product = (prompt.product || '').trim() || `${brandName} Flagship`;
  const audience = (prompt.targetAudience || '').trim() || 'Modern creators & decision makers';
  const tone = (prompt.tone || '').trim() || 'Confident & Direct';
  const goal = (prompt.content || '').trim();
  const platforms = Array.isArray(campaignData.platforms) && campaignData.platforms.length > 0
    ? campaignData.platforms
    : ['Instagram'];

  const primaryPlatform = platforms[0];
  const timeByPlatform = {
    Instagram: '6:30 PM EST',
    Twitter: '9:00 AM EST',
    LinkedIn: '8:30 AM EST',
    Facebook: '1:00 PM EST',
    Pinterest: '8:00 PM EST',
    Web: '10:00 AM EST',
  };

  const hookLine =
    tone.toLowerCase().includes('playful')
      ? `Stop scrolling—${product} just changed the game.`
      : `Built for teams who refuse to settle for ordinary: meet ${product}.`;

  const valueLine = goal
    ? `${goal.charAt(0).toUpperCase() + goal.slice(1)}${goal.endsWith('.') ? '' : '.'}`
    : `${brandName} brings precision, speed, and unmistakable brand craft together in one seamless experience.`;

  const ctaLine =
    primaryPlatform === 'LinkedIn'
      ? `Explore how ${brandName} empowers ${audience.toLowerCase()} — see the full story at ${campaignData.domain || 'our hub'}.`
      : `Tap the link to experience ${product} today.`;

  const actualCampaign = `${hookLine}\n\n${valueLine}\n\n${ctaLine}`;

  const cleanTag = (str) =>
    '#' + String(str || '').replace(/[^a-zA-Z0-9]/g, '');

  const rawTags = [
    cleanTag(brandName),
    cleanTag(product.split(' ')[0]),
    ...platforms.slice(0, 2).map((p) => cleanTag(`${p}Marketing`)),
    '#BrandLaunch',
  ].filter((t) => t.length > 1);

  return {
    title: `${brandName} — ${product} (${platforms.join(' / ')})`,
    actualCampaign,
    targetAudience: audience,
    hashtags: [...new Set(rawTags)],
    bestTimeToPost: timeByPlatform[primaryPlatform] || '10:00 AM EST',
  };
}

export function buildMockAudioScript(formValues = {}) {
  const productName = (formValues.productName || '').trim() || 'Adverra Studio';
  const productCategory = (formValues.productCategory || '').trim() || 'AI marketing platform';
  const primaryBenefit = (formValues.primaryBenefit || '').trim() || 'launch on-brand campaigns in seconds';
  const secondaryBenefit = (formValues.secondaryBenefit || '').trim();
  const proofPoint = (formValues.proofPoint || '').trim();
  const mode = formValues.speakerMode === 'Multi Speaker' ? 'Multi Speaker' : 'Single Speaker';
  const audienceRole = (formValues.targetAudienceRole || '').trim() || 'founders';
  const painPoint = (formValues.primaryPainPoint || '').trim() || 'slow creative turnarounds';

  const energy = Number(formValues.energy ?? 65);
  const formality = Number(formValues.formality ?? 50);
  const deliveryAdjective =
    energy >= 70 ? 'energetic and persuasive' : formality >= 70 ? 'polished and authoritative' : 'warm and confident';

  const filename = productName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24) || 'Adverra_Ad';

  if (mode === 'Multi Speaker') {
    const s1 = formValues.speaker1Name || 'Speaker1';
    const s2 = formValues.speaker2Name || 'Speaker2';
    const script_lines = [
      {
        speaker: s1,
        text: `Still losing hours every week to ${painPoint.toLowerCase()}?`,
      },
      {
        speaker: s2,
        text: `Not anymore. We switched to ${productName}—the ${productCategory} built to ${primaryBenefit.toLowerCase()}.`,
      },
      {
        speaker: s1,
        text: secondaryBenefit
          ? `Wait, it really helps you ${secondaryBenefit.toLowerCase()}?`
          : `Really? Even for busy ${audienceRole.toLowerCase()}?`,
      },
      {
        speaker: s2,
        text: proofPoint
          ? `Yes—${proofPoint}. Try ${productName} today.`
          : `Every single time. Try ${productName} today.`,
      },
    ];

    const direction_line = `Make ${s1} sound curious and conversational, and ${s2} sound ${deliveryAdjective}:`;
    return {
      filename,
      direction_line,
      mode: 'Multi Speaker',
      script_lines,
      ready_for_audio_model: `${direction_line}\n${script_lines.map((l) => `${l.speaker}: ${l.text}`).join('\n')}`,
    };
  }

  const speakerLabel = formValues.speakerName || 'Speaker';
  const singleText = [
    `Tired of ${painPoint.toLowerCase()} slowing down your team?`,
    `${productName} is the ${productCategory} built for ${audienceRole.toLowerCase()} who want to ${primaryBenefit.toLowerCase()}.`,
    secondaryBenefit ? `${secondaryBenefit}.` : '',
    proofPoint ? `${proofPoint}.` : '',
    `Discover ${productName} today.`,
  ]
    .filter(Boolean)
    .join(' ');

  const direction_line = `Say in a ${deliveryAdjective} voice:`;
  return {
    filename,
    direction_line,
    mode: 'Single Speaker',
    script_lines: [{ speaker: speakerLabel, text: singleText }],
    ready_for_audio_model: `${direction_line}\n${singleText}`,
  };
}

// Generates a valid 16-bit mono PCM WAV file in memory (warm harmonic synth chord)
export function createSynthesizedWavBytes(durationSeconds = 4.5, baseFreq = 220) {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
  view.setUint16(32, numChannels * (bitsPerSample / 8), true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = t / durationSeconds;
    const fadeIn = Math.min(1, t / 0.25);
    const fadeOut = Math.min(1, (durationSeconds - t) / 0.5);
    const envelope = fadeIn * fadeOut * 0.28;

    // Gentle major9 chord shimmer with subtle pulse
    const pulse = 0.75 + 0.25 * Math.sin(2 * Math.PI * 1.5 * t);
    const wave =
      0.5 * Math.sin(2 * Math.PI * baseFreq * t) +
      0.3 * Math.sin(2 * Math.PI * (baseFreq * 1.25) * t) +
      0.2 * Math.sin(2 * Math.PI * (baseFreq * 1.5) * t) +
      0.15 * Math.sin(2 * Math.PI * (baseFreq * 2.25) * t * (1 + 0.002 * progress));

    const sample = Math.max(-1, Math.min(1, wave * envelope * pulse));
    view.setInt16(44 + i * 2, Math.floor(sample * 32767), true);
  }

  return new Uint8Array(buffer);
}

export function createWavBlobUrl(durationSeconds = 4.5, baseFreq = 220) {
  const bytes = createSynthesizedWavBytes(durationSeconds, baseFreq);
  const blob = new Blob([bytes], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

export function buildInitialAudios() {
  return [
    {
      id: 301,
      filename: 'Lumina_One_Spot',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      publicUrl: typeof URL !== 'undefined' && URL.createObjectURL ? createWavBlobUrl(5, 220) : '',
      script: {
        direction_line: 'Say in a warm and confident voice:',
        mode: 'Single Speaker',
        script_lines: [
          {
            speaker: 'Narrator',
            text: 'Tired of noisy open offices breaking your flow? Lumina One is the spatial audio headset built for creators who want studio-grade focus anywhere. Forty-eight hours of battery, zero distractions. Hear what matters.',
          },
        ],
      },
      context: { productName: 'Lumina One', speakerMode: 'Single Speaker' },
    },
    {
      id: 302,
      filename: 'Adverra_Dialogue',
      created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
      publicUrl: typeof URL !== 'undefined' && URL.createObjectURL ? createWavBlobUrl(5.5, 261.63) : '',
      script: {
        direction_line: 'Make Alex sound curious and Jordan sound energetic and persuasive:',
        mode: 'Multi Speaker',
        script_lines: [
          {
            speaker: 'Alex',
            text: 'How did your team ship three full campaign launches in one afternoon?',
          },
          {
            speaker: 'Jordan',
            text: 'We moved our whole brand kit into Adverra.',
          },
          {
            speaker: 'Alex',
            text: 'Wait—images, social copy, and voiceovers all from one workspace?',
          },
          {
            speaker: 'Jordan',
            text: 'Every asset, completely on-brand. Try Adverra today.',
          },
        ],
      },
      context: { productName: 'Adverra', speakerMode: 'Multi Speaker' },
    },
  ];
}
