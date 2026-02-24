import { useState, useEffect, useCallback, useRef } from 'react';
import type { InputState } from '@/types/game';

export function useGameInput(enabled: boolean = true) {
  const [input, setInput] = useState<InputState>({ forward: 0, steering: 0 });
  const keysPressed = useRef<Set<string>>(new Set());
  const joystickInput = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Keyboard input handler
  useEffect(() => {
    if (!enabled) return;

    // Check if the user is typing in a form element — if so, skip game input
    const isTyping = () => {
      const el = document.activeElement;
      return el instanceof HTMLInputElement ||
             el instanceof HTMLTextAreaElement ||
             el instanceof HTMLSelectElement;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTyping()) return;           // ← let the form receive the key
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
        updateInputFromKeys();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isTyping()) return;
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
      updateInputFromKeys();
    };

    const updateInputFromKeys = () => {
      const keys = keysPressed.current;
      let forward = 0;
      let steering = 0;

      if (keys.has('w') || keys.has('arrowup')) forward = 1;
      if (keys.has('s') || keys.has('arrowdown')) forward = -0.5;
      if (keys.has('a') || keys.has('arrowleft')) steering = -1;
      if (keys.has('d') || keys.has('arrowright')) steering = 1;

      setInput({ forward, steering });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled]);

  // Joystick input handler (called from Joystick component)
  const updateJoystickInput = useCallback((x: number, y: number) => {
    joystickInput.current = { x, y };

    // y axis: up = -1 (forward), down = +1 (reverse/brake)
    // We allow full -1..1 range for forward/reverse
    const forward  = -y;          // negative y on screen = push joystick up = go forward
    const steering = x;

    setInput({ forward, steering });
  }, []);

  const resetInput = useCallback(() => {
    setInput({ forward: 0, steering: 0 });
    joystickInput.current = { x: 0, y: 0 };
  }, []);

  return { input, updateJoystickInput, resetInput };
}
