import { useCallback, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from './Vehicle';
import { Road } from './Road';
import { Environment } from './Environment';
import { CheckpointMarker } from './CheckpointMarker';
import { FollowCamera } from './FollowCamera';
import { Sky } from './Sky';
import { Joystick } from '@/components/ui/Joystick';
import { CheckpointOverlay } from '@/components/ui/CheckpointOverlay';
import { GameHUD } from '@/components/ui/GameHUD';
import { StartScreen } from '@/components/ui/StartScreen';
import { GuestbookModal } from '@/components/ui/GuestbookModal';
import { useOrientation } from '@/hooks/useOrientation';
import { useGameInput } from '@/hooks/useGameInput';
import { useGameState } from '@/hooks/useGameState';
import { useGameAudio } from '@/hooks/useGameAudio';

export function GameScene() {
  const navigate = useNavigate();
  const { isMobile, isTouch, orientation } = useOrientation();
  const { input, updateJoystickInput, resetInput } = useGameInput(true);
  const {
    state,
    checkpoints,
    startGame,
    resumeGame,
    toggleAutoMode,
    reachCheckpoint,
    completeGame,
    updatePlayerPosition,
    getProgress,
  } = useGameState();

  const [playerPos, setPlayerPos] = useState({ x: 0, z: 5, heading: 0 });
  const [showGuestbook, setShowGuestbook] = useState(false);
  const { startBGM, updateEngine, playCheckpointSound, pauseAll, resumeAll } = useGameAudio();

  // ── Checkpoint visit tracking ─────────────────────────────────────────────
  // Using a Set ref so it NEVER resets — once visited, always visited.
  // This is the core fix for the "popup fires continuously" bug.
  const visitedCheckpoints = useRef<Set<string>>(new Set());

  const handlePositionUpdate = useCallback((x: number, z: number, heading: number) => {
    setPlayerPos({ x, z, heading });
    updatePlayerPosition(x, z);
  }, [updatePlayerPosition]);

  // ── Update engine sound based on whether the car is moving ────────────────
  useEffect(() => {
    const isMoving = input.forward !== 0 || input.steering !== 0;
    updateEngine(isMoving && state.isPlaying && !state.isPaused);
  }, [input.forward, input.steering, state.isPlaying, state.isPaused, updateEngine]);

  // ── 2D distance checkpoint detection ─────────────────────────────────────
  const handleCheckpointHit = useCallback((x: number, z: number) => {
    for (const checkpoint of checkpoints) {
      if (visitedCheckpoints.current.has(checkpoint.id)) continue;

      const dx = x - checkpoint.x;
      const dz = z - checkpoint.position;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 14) {  // covers full road width (ROAD_WIDTH = 14)
        // Mark as visited IMMEDIATELY so it can never fire again
        visitedCheckpoints.current.add(checkpoint.id);
        playCheckpointSound();
        reachCheckpoint(checkpoint);
        break;
      }
    }
  }, [checkpoints, reachCheckpoint]);

  // ── Continue after checkpoint modal ──────────────────────────────────────
  const handleContinue = useCallback(() => {
    resumeGame();
    resumeAll();
    // NOTE: Do NOT reset visitedCheckpoints — that was the original bug.
  }, [resumeGame, resumeAll]);

  // ── Detect game completion (all checkpoints visited) ─────────────────────
  useEffect(() => {
    if (
      state.checkpointsReached.length === checkpoints.length &&
      checkpoints.length > 0 &&
      !state.isPaused &&        // wait until the last modal is dismissed
      state.isPlaying
    ) {
      completeGame();
      setShowGuestbook(true);
    }
  }, [state.checkpointsReached.length, state.isPaused, state.isPlaying, checkpoints.length, completeGame]);

  // ── Joystick handlers ────────────────────────────────────────────────────
  const handleJoystickMove = useCallback((x: number, y: number) => {
    updateJoystickInput(x, y);
  }, [updateJoystickInput]);

  const handleJoystickRelease = useCallback(() => {
    resetInput();
  }, [resetInput]);

  // ── Skip → go straight to profile ────────────────────────────────────────
  const handleSkip = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  // ── Guestbook done → go to profile ───────────────────────────────────────
  const handleGuestbookDone = useCallback(() => {
    setShowGuestbook(false);
    navigate('/profile');
  }, [navigate]);

  // ── Pause audio when game pauses ──────────────────────────────────────────
  useEffect(() => {
    if (state.isPaused) {
      pauseAll();
    }
  }, [state.isPaused, pauseAll]);

  // ── Start BGM handler ─────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    startGame();
    startBGM();
  }, [startGame, startBGM]);

  // Show start screen if game hasn't started
  if (!state.isPlaying) {
    return <StartScreen onStart={handleStart} onSkip={handleSkip} />;
  }

  return (
    <div className="fixed inset-0 bg-background">
      {/* ── 3D Canvas ──────────────────────────────────────────────────────── */}
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 1500 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lighting — bright sunny day */}
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[80, 120, 60]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={800}
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={200}
          shadow-camera-bottom={-200}
        />
        {/* Sky-blue top, warm sandy ground bounce */}
        <hemisphereLight args={['#7dd3fc', '#d4c5a0', 0.8]} />

        {/* Sky */}
        <Sky />

        {/* Environment (trees, rocks, grass) */}
        <Environment />

        {/* Winding road */}
        <Road />

        {/* Checkpoint gates */}
        {checkpoints.map(checkpoint => (
          <CheckpointMarker
            key={checkpoint.id}
            checkpoint={checkpoint}
            reached={state.checkpointsReached.includes(checkpoint.id)}
          />
        ))}

        {/* Player vehicle */}
        <Vehicle
          input={input}
          isPaused={state.isPaused}
          autoMode={state.autoMode}
          onPositionUpdate={handlePositionUpdate}
          onCheckpointHit={handleCheckpointHit}
        />

        {/* Follow camera */}
        <FollowCamera
          targetPosition={playerPos}
          orientation={orientation}
          isMobile={isMobile}
        />
      </Canvas>

      {/* ── HUD ────────────────────────────────────────────────────────────── */}
      <GameHUD
        checkpoints={checkpoints}
        reachedIds={state.checkpointsReached}
        autoMode={state.autoMode}
        onToggleAutoMode={toggleAutoMode}
        isMobile={isMobile}
        progress={getProgress()}
        onSkip={handleSkip}
      />

      {/* ── Mobile joystick ─────────────────────────────────────────────────── */}
      {isTouch && !state.isPaused && !state.autoMode && (
        <Joystick
          onMove={handleJoystickMove}
          onRelease={handleJoystickRelease}
          orientation={orientation}
        />
      )}

      {/* ── Checkpoint info overlay ─────────────────────────────────────────── */}
      {state.currentCheckpoint && state.isPaused && !showGuestbook && (
        <CheckpointOverlay
          checkpoint={state.currentCheckpoint}
          onContinue={handleContinue}
          totalCheckpoints={checkpoints.length}
          currentIndex={state.checkpointsReached.length}
        />
      )}

      {/* ── End-game Guestbook (Rate the Driver) ────────────────────────────── */}
      {showGuestbook && (
        <GuestbookModal onDone={handleGuestbookDone} />
      )}
    </div>
  );
}

