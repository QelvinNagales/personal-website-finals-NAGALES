import { useState, useCallback } from 'react';
import type { GameState, Checkpoint } from '@/types/game';
import { CHECKPOINTS } from '@/data/checkpoints';

const initialState: GameState = {
  isPlaying: false,
  isPaused: false,
  gameCompleted: false,
  currentCheckpoint: null,
  checkpointsReached: [],
  playerPosition: { x: 0, z: 0 },
  autoMode: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  const [checkpoints] = useState<Checkpoint[]>(CHECKPOINTS);

  const startGame = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  }, []);

  const pauseGame = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false, currentCheckpoint: null }));
  }, []);

  const toggleAutoMode = useCallback(() => {
    setState(prev => ({ ...prev, autoMode: !prev.autoMode }));
  }, []);

  const reachCheckpoint = useCallback((checkpoint: Checkpoint) => {
    setState(prev => {
      const newReached = prev.checkpointsReached.includes(checkpoint.id)
        ? prev.checkpointsReached
        : [...prev.checkpointsReached, checkpoint.id];

      // All checkpoints hit? Complete the game after this modal is dismissed.
      return {
        ...prev,
        isPaused: true,
        currentCheckpoint: checkpoint,
        checkpointsReached: newReached,
      };
    });
  }, []);

  const completeGame = useCallback(() => {
    setState(prev => ({ ...prev, gameCompleted: true, isPaused: true }));
  }, []);

  const updatePlayerPosition = useCallback((x: number, z: number) => {
    setState(prev => ({ ...prev, playerPosition: { x, z } }));
  }, []);

  const getNextCheckpoint = useCallback((): Checkpoint | undefined => {
    return checkpoints.find(cp => !state.checkpointsReached.includes(cp.id));
  }, [checkpoints, state.checkpointsReached]);

  const getProgress = useCallback(() => {
    return state.checkpointsReached.length / checkpoints.length;
  }, [checkpoints.length, state.checkpointsReached.length]);

  return {
    state,
    checkpoints,
    startGame,
    pauseGame,
    resumeGame,
    toggleAutoMode,
    reachCheckpoint,
    completeGame,
    updatePlayerPosition,
    getNextCheckpoint,
    getProgress,
  };
}
