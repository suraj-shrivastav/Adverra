import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  WALKTHROUGH_MODES,
  getNextStepState,
  getPrevStepState,
  getRouteForMode,
  getStepInfo,
} from '../libs/walkthroughSteps.js';

const WalkthroughContext = createContext(null);

export const WalkthroughProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('image');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoStartHandled = useRef(false);

  const navigateIfNeeded = useCallback(
    (targetMode) => {
      const targetRoute = getRouteForMode(targetMode);
      if (location.pathname !== targetRoute) {
        navigate(targetRoute);
      }
    },
    [location.pathname, navigate]
  );

  const startWalkthrough = useCallback(
    (startMode = 'image', autoPlay = true) => {
      const safeMode = WALKTHROUGH_MODES.includes(startMode) ? startMode : 'image';
      setMode(safeMode);
      setStepIndex(0);
      setIsActive(true);
      setIsPlaying(autoPlay);
      navigateIfNeeded(safeMode);
    },
    [navigateIfNeeded]
  );

  const stopWalkthrough = useCallback(() => {
    setIsPlaying(false);
    setIsActive(false);
  }, []);

  const goToMode = useCallback(
    (targetMode) => {
      const safeMode = WALKTHROUGH_MODES.includes(targetMode) ? targetMode : 'image';
      setMode(safeMode);
      setStepIndex(0);
      setIsActive(true);
      setIsPlaying(true);
      navigateIfNeeded(safeMode);
    },
    [navigateIfNeeded]
  );

  const nextStep = useCallback(() => {
    const next = getNextStepState(mode, stepIndex);
    if (!next) {
      setIsPlaying(false);
      return false;
    }
    setMode(next.mode);
    setStepIndex(next.stepIndex);
    if (next.mode !== mode) {
      navigateIfNeeded(next.mode);
    }
    return true;
  }, [mode, stepIndex, navigateIfNeeded]);

  const prevStep = useCallback(() => {
    const prev = getPrevStepState(mode, stepIndex);
    if (!prev) return false;
    setIsPlaying(false);
    setMode(prev.mode);
    setStepIndex(prev.stepIndex);
    if (prev.mode !== mode) {
      navigateIfNeeded(prev.mode);
    }
    return true;
  }, [mode, stepIndex, navigateIfNeeded]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev) {
        const info = getStepInfo(mode, stepIndex);
        if (info.isLastOverall) {
          setMode('image');
          setStepIndex(0);
          navigateIfNeeded('image');
        }
      }
      return !prev;
    });
  }, [mode, stepIndex, navigateIfNeeded]);

  // Support ?walkthrough=1 on initial load for quick demo links and testability
  useEffect(() => {
    if (autoStartHandled.current) return;
    const params = new URLSearchParams(location.search);
    if (params.get('walkthrough') === '1') {
      autoStartHandled.current = true;
      const requestedMode = params.get('mode');
      startWalkthrough(
        WALKTHROUGH_MODES.includes(requestedMode) ? requestedMode : 'image',
        true
      );
    }
  }, [location.search, startWalkthrough]);

  // Auto-advance timer while playing
  useEffect(() => {
    if (!isActive || !isPlaying) return undefined;

    const { step, isLastOverall } = getStepInfo(mode, stepIndex);
    if (isLastOverall || !step.durationMs) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const next = getNextStepState(mode, stepIndex);
      if (!next) {
        setIsPlaying(false);
        return;
      }
      setMode(next.mode);
      setStepIndex(next.stepIndex);
      if (next.mode !== mode) {
        navigateIfNeeded(next.mode);
      }
    }, step.durationMs);

    return () => window.clearTimeout(timer);
  }, [isActive, isPlaying, mode, stepIndex, navigateIfNeeded]);

  const stepInfo = getStepInfo(mode, stepIndex);

  return (
    <WalkthroughContext.Provider
      value={{
        isActive,
        mode,
        stepIndex: stepInfo.stepIndex,
        totalSteps: stepInfo.totalSteps,
        currentStep: stepInfo.step,
        isFirstOverall: stepInfo.isFirstOverall,
        isLastOverall: stepInfo.isLastOverall,
        isPlaying,
        startWalkthrough,
        stopWalkthrough,
        goToMode,
        nextStep,
        prevStep,
        togglePlay,
      }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWalkthrough = () => {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) {
    throw new Error('useWalkthrough must be used within WalkthroughProvider');
  }
  return ctx;
};
