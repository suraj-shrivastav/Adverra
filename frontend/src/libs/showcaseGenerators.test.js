import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_BRANDS,
  INITIAL_ASSETS,
  INITIAL_CAMPAIGNS,
  createBrandFromDomain,
  selectMockAssetImage,
  buildMockCampaign,
  buildMockAudioScript,
  createSynthesizedWavBytes,
} from './showcaseGenerators.js';

test('initial seed data is populated for showcase walkthroughs', () => {
  assert.ok(INITIAL_BRANDS.length >= 3);
  assert.ok(INITIAL_ASSETS.length >= 4);
  assert.ok(INITIAL_CAMPAIGNS.length >= 3);
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

test('selectMockAssetImage maps toneId to local artwork or cycles fallback', () => {
  assert.equal(selectMockAssetImage('claymorphism_prompt'), '/claymorphism_prompt.jpg');
  assert.equal(selectMockAssetImage('three_d_prompt'), '/three_d_prompt.jpg');
  const fallback = selectMockAssetImage(null, 2);
  assert.ok(fallback.endsWith('.jpg'));
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
