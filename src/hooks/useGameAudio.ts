import { useRef, useCallback, useEffect } from 'react';

/**
 * Manages all in-game audio:
 *  - Car engine sound (loops while moving)
 *  - Checkpoint notification (plays once on reach)
 *  - Background music / road-trip BGM (loops at low volume)
 */
export function useGameAudio() {
  const engineRef  = useRef<HTMLAudioElement | null>(null);
  const bgmRef     = useRef<HTMLAudioElement | null>(null);
  const notifRef   = useRef<HTMLAudioElement | null>(null);
  const isMovingRef = useRef(false);

  // ── Initialise audio elements once ────────────────────────────────────────
  useEffect(() => {
    // Car engine (loops)
    const engine = new Audio('/audio/car-engine.mp3');
    engine.loop = true;
    engine.volume = 0.45;
    engineRef.current = engine;

    // BGM (loops, low volume)
    const bgm = new Audio('/audio/bgm.mp3');
    bgm.loop = true;
    bgm.volume = 0.15;       // lower than other sounds
    bgmRef.current = bgm;

    // Checkpoint notification (one-shot)
    const notif = new Audio('/audio/checkpoint.mp3');
    notif.volume = 0.7;
    notifRef.current = notif;

    return () => {
      engine.pause();
      bgm.pause();
      notif.pause();
      engineRef.current = null;
      bgmRef.current = null;
      notifRef.current = null;
    };
  }, []);

  // ── Start BGM (call once when game starts) ───────────────────────────────
  const startBGM = useCallback(() => {
    const bgm = bgmRef.current;
    if (bgm && bgm.paused) {
      bgm.play().catch(() => {
        // Browser may block autoplay; will resume on next user interaction
      });
    }
  }, []);

  // ── Stop BGM ──────────────────────────────────────────────────────────────
  const stopBGM = useCallback(() => {
    const bgm = bgmRef.current;
    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
    }
  }, []);

  // ── Update engine sound based on movement ─────────────────────────────────
  const updateEngine = useCallback((isMoving: boolean) => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isMoving && !isMovingRef.current) {
      // Started moving → play engine
      engine.play().catch(() => {});
      isMovingRef.current = true;
    } else if (!isMoving && isMovingRef.current) {
      // Stopped moving → pause engine
      engine.pause();
      isMovingRef.current = false;
    }
  }, []);

  // ── Play checkpoint notification ──────────────────────────────────────────
  const playCheckpointSound = useCallback(() => {
    const notif = notifRef.current;
    if (notif) {
      notif.currentTime = 0;
      notif.play().catch(() => {});
    }
  }, []);

  // ── Pause / resume all audio (for game pause) ────────────────────────────
  const pauseAll = useCallback(() => {
    engineRef.current?.pause();
    bgmRef.current?.pause();
  }, []);

  const resumeAll = useCallback(() => {
    bgmRef.current?.play().catch(() => {});
    if (isMovingRef.current) {
      engineRef.current?.play().catch(() => {});
    }
  }, []);

  return {
    startBGM,
    stopBGM,
    updateEngine,
    playCheckpointSound,
    pauseAll,
    resumeAll,
  };
}
