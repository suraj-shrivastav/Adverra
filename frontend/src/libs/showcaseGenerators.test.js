import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_BRANDS,
  INITIAL_ASSETS,
  INITIAL_CAMPAIGNS,
  SHOWCASE_OUTPUT_GALLERY,
  WALKTHROUGH_PRESETS,
  createBrandFromDomain,
  selectMockAssetImage,
  buildMockCampaign,
  buildMockAudioScript,
  createSynthesizedWavBytes,
  buildInitialAudios,
} from './showcaseGenerators.js';

test('initial seed data and walkthrough presets are populated for all 3 modes', () => {
  assert.ok(INITIAL_BRANDS.length >= 3);
  assert.ok(INITIAL_ASSETS.length >= 5);
  assert.ok(INITIAL_CAMPAIGNS.length >= 4);
  assert.ok(SHOWCASE_OUTPUT_GALLERY.length >= 5);
  assert.ok(WALKTHROUGH_PRESETS.image.outputImage.startsWith('/showcase/'));
  assert.ok(WALKTHROUGH_PRESETS.campaign.outputCampaign.actualCampaign.length > 20);
  assert.ok(WALKTHROUGH_PRESETS.audio.outputAudio.publicUrl.endsWith('.wav'));
  assert.equal(WALKTHROUGH_PRESETS.audio.outputAudio.compareVariants.length, 2);
  assert.notEqual(
    WALKTHROUGH_PRESETS.audio.outputAudio.compareVariants[0].publicUrl,
    WALKTHROUGH_PRESETS.audio.outputAudio.compareVariants[1].publicUrl
  );
  assert.ok(buildInitialAudios().every((a) => a.publicUrl.endsWith('.wav')));
});

test('createBrandFromDomain normalizes URLs and generates complete brand object', () => {
  const brand = createBrandFromDomain('https://www.stripe.com/payments', 99);
  assert.equal(brand.id, 99);
  assert.equal(brand.domain, 'stripe.com');
  assert.equal(brand.title, 'Stripe');
  assert.ok(brand.colors.length >= 3);
  assert.ok(brand.logos.length >= 1);
  assert.ok(brand.slogan.includes('Stripe'));
});

test('selectMockAssetImage maps toneId to upgraded artwork or cycles gallery', () => {
  assert.equal(selectMockAssetImage('three_d_prompt'), '/showcase/ad_lumina_3d_1795624904892.jpg');
  assert.equal(selectMockAssetImage('claymorphism_prompt'), '/showcase/ad_sneaker_clay_1795624906489.jpg');
  const fallback = selectMockAssetImage(null, 1);
  assert.ok(fallback.startsWith('/showcase/'));
});

test('buildMockCampaign produces tailored copy, hashtags, and posting time', () => {
  const campaign = buildMockCampaign({
    prompt: {
      product: 'Spark Pro',
      targetAudience: 'Designers',
      tone: 'Playful',
      content: 'Announce v2 launch with faster rendering',
    },
    campaignData: {
      title: 'Lumina',
      domain: 'lumina.audio',
      platforms: ['LinkedIn', 'Instagram'],
    },
  });
  assert.ok(campaign.title.includes('Lumina'));
  assert.ok(campaign.actualCampaign.includes('Spark Pro'));
  assert.equal(campaign.targetAudience, 'Designers');
  assert.equal(campaign.bestTimeToPost, '8:30 AM EST');
  assert.ok(campaign.hashtags.includes('#Lumina'));
});

test('buildMockAudioScript handles Single Speaker and Multi Speaker modes', () => {
  const single = buildMockAudioScript({
    productName: 'Atlas',
    productCategory: 'AI tool',
    primaryBenefit: 'cut ad spend waste',
    speakerMode: 'Single Speaker',
    speakerName: 'Elena',
    targetAudienceRole: 'Founders',
    primaryPainPoint: 'rising CAC',
  });
  assert.equal(single.mode, 'Single Speaker');
  assert.equal(single.script_lines.length, 1);
  assert.equal(single.script_lines[0].speaker, 'Elena');
  assert.ok(single.script_lines[0].text.includes('Atlas'));

  const multi = buildMockAudioScript({
    productName: 'Atlas',
    speakerMode: 'Multi Speaker',
    speaker1Name: 'Sam',
    speaker2Name: 'Maya',
  });
  assert.equal(multi.mode, 'Multi Speaker');
  assert.equal(multi.script_lines.length, 4);
  assert.equal(multi.script_lines[0].speaker, 'Sam');
  assert.equal(multi.script_lines[1].speaker, 'Maya');
});

test('createSynthesizedWavBytes produces a valid RIFF WAVE header and payload', () => {
  const bytes = createSynthesizedWavBytes(1, 220);
  const header = String.fromCharCode(...bytes.slice(0, 4));
  const wave = String.fromCharCode(...bytes.slice(8, 12));
  assert.equal(header, 'RIFF');
  assert.equal(wave, 'WAVE');
  assert.ok(bytes.length > 44);
});
