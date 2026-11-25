import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WALKTHROUGH_MODES,
  WALKTHROUGH_STEPS,
  getStepInfo,
  getNextStepState,
  getPrevStepState,
  getRouteForMode,
} from './walkthroughSteps.js';

test('walkthrough covers image, campaign, and audio modes with non-empty steps', () => {
  assert.deepEqual(WALKTHROUGH_MODES, ['image', 'campaign', 'audio']);
  for (const mode of WALKTHROUGH_MODES) {
    assert.ok(Array.isArray(WALKTHROUGH_STEPS[mode]));
    assert.ok(WALKTHROUGH_STEPS[mode].length >= 4);
  }
});

test('getNextStepState advances cleanly across steps and mode boundaries', () => {
  assert.deepEqual(getNextStepState('image', 0), { mode: 'image', stepIndex: 1 });
  const lastImageIdx = WALKTHROUGH_STEPS.image.length - 1;
  assert.deepEqual(getNextStepState('image', lastImageIdx), { mode: 'campaign', stepIndex: 0 });
  const lastCampaignIdx = WALKTHROUGH_STEPS.campaign.length - 1;
  assert.deepEqual(getNextStepState('campaign', lastCampaignIdx), { mode: 'audio', stepIndex: 0 });
  const lastAudioIdx = WALKTHROUGH_STEPS.audio.length - 1;
  assert.equal(getNextStepState('audio', lastAudioIdx), null);
});

test('getPrevStepState rewinds cleanly across steps and mode boundaries', () => {
  assert.equal(getPrevStepState('image', 0), null);
  assert.deepEqual(getPrevStepState('campaign', 0), {
    mode: 'image',
    stepIndex: WALKTHROUGH_STEPS.image.length - 1,
  });
  assert.deepEqual(getPrevStepState('audio', 0), {
    mode: 'campaign',
    stepIndex: WALKTHROUGH_STEPS.campaign.length - 1,
  });
  assert.deepEqual(getPrevStepState('audio', 2), { mode: 'audio', stepIndex: 1 });
});

test('getStepInfo clamps bounds and maps routes', () => {
  const info = getStepInfo('campaign', 99);
  assert.equal(info.stepIndex, WALKTHROUGH_STEPS.campaign.length - 1);
  assert.equal(getRouteForMode('image'), '/image');
  assert.equal(getRouteForMode('campaign'), '/campaign');
  assert.equal(getRouteForMode('audio'), '/audio');
});
