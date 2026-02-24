import type { Checkpoint } from '@/types/game';
import { SkipForward } from 'lucide-react';

interface GameHUDProps {
  checkpoints: Checkpoint[];
  reachedIds: string[];
  autoMode: boolean;
  onToggleAutoMode: () => void;
  isMobile: boolean;
  progress: number;
  onSkip: () => void;
}

export function GameHUD({
  checkpoints,
  reachedIds,
  autoMode,
  onToggleAutoMode,
  isMobile,
  progress,
  onSkip,
}: GameHUDProps) {
  const pct = Math.round(progress * 100);
  const nextCheckpoint = checkpoints.find(cp => !reachedIds.includes(cp.id));

  return (
    <div className="game-overlay pointer-events-none">
      {/* ── Top progress bar ──────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4">
        <div className="hud-element pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-foreground">🗺️ Journey</span>
            <span className="text-sm text-muted-foreground font-mono">
              {reachedIds.length}/{checkpoints.length} checkpoints
            </span>
          </div>

          {/* Progress track */}
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Checkpoint icon strip */}
          <div className="flex justify-between mt-2 px-1">
            {checkpoints.map(cp => (
              <div
                key={cp.id}
                className={`transition-all duration-300 ${
                  reachedIds.includes(cp.id)
                    ? 'text-xl scale-110 drop-shadow-[0_0_6px_#4ade80]'
                    : 'text-base scale-90 opacity-35 grayscale'
                }`}
                title={cp.title}
              >
                {cp.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Next checkpoint badge ──────────────────────────────────────────── */}
      {nextCheckpoint && (
        <div className="absolute top-[7.5rem] left-1/2 -translate-x-1/2">
          <div className="hud-element text-center py-1 px-4">
            <span className="text-xs text-muted-foreground block leading-none mb-0.5">
              Next checkpoint
            </span>
            <span className="text-sm font-bold text-foreground">
              {nextCheckpoint.icon} {nextCheckpoint.title}
            </span>
          </div>
        </div>
      )}

      {/* ── Bottom-right: auto / skip ──────────────────────────────────────── */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
        <button
          onClick={onToggleAutoMode}
          className={`hud-element pointer-events-auto transition-all text-sm font-medium ${
            autoMode ? 'bg-accent/90 text-accent-foreground ring-2 ring-accent' : ''
          }`}
        >
          {autoMode ? '🚗 Auto-Drive ON' : isMobile ? '🕹️ Manual Drive' : '⌨️ WASD Drive'}
        </button>

        <button
          onClick={onSkip}
          className="hud-element pointer-events-auto flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          Skip to Profile
        </button>
      </div>

      {/* ── Bottom-left: controls ──────────────────────────────────────────── */}
      {!isMobile && !autoMode && (
        <div className="absolute bottom-4 left-4">
          <div className="hud-element">
            <p className="text-xs text-muted-foreground mb-1">Controls</p>
            <div className="grid grid-cols-3 gap-0.5 w-fit">
              <div />
              <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs text-center">W</kbd>
              <div />
              <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs text-center">A</kbd>
              <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs text-center">S</kbd>
              <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs text-center">D</kbd>
            </div>
          </div>
        </div>
      )}

      {isMobile && !autoMode && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-xs text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            Drag joystick to drive
          </span>
        </div>
      )}
    </div>
  );
}

