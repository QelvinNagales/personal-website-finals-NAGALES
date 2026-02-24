export interface InputState {
  forward: number;  // -1 (reverse) to 1 (full throttle)
  steering: number; // -1 (left) to 1 (right)
}

// ── Road layout ──────────────────────────────────────────────────────────────
export interface RoadWaypoint {
  x: number;
  z: number;
}

// ── Checkpoint ───────────────────────────────────────────────────────────────
export interface CheckpointContent {
  heading: string;
  paragraphs: string[];
  items?: string[];
  cta?: {
    label: string;
    action: string;
  };
}

export interface Checkpoint {
  id: string;
  position: number;      // Z position in world space
  x: number;             // X position in world space
  gateRotation?: number; // Y-axis rotation of the gate marker (radians)
  title: string;
  subtitle: string;
  content: CheckpointContent;
  icon: string;
  reached: boolean;
}

// ── Game state ────────────────────────────────────────────────────────────────
export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  gameCompleted: boolean;
  currentCheckpoint: Checkpoint | null;
  checkpointsReached: string[];
  playerPosition: { x: number; z: number };
  autoMode: boolean;
}

// ── Device / orientation ──────────────────────────────────────────────────────
export type Orientation = 'portrait' | 'landscape';

export interface DeviceInfo {
  isMobile: boolean;
  isTouch: boolean;
  orientation: Orientation;
}
