import { useRef, useCallback, useEffect } from 'react';
import type { Orientation } from '@/types/game';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  onRelease: () => void;
  orientation: Orientation;
}

export function Joystick({ onMove, onRelease, orientation }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const baseCenter = useRef({ x: 0, y: 0 });

  const size = orientation === 'portrait' ? 100 : 120;
  const knobSize = size * 0.45;
  const maxDistance = (size - knobSize) / 2;

  const getPosition = () => {
    if (orientation === 'portrait') {
      return { left: '50%', transform: 'translateX(-50%)', bottom: '40px' };
    }
    return { left: '40px', bottom: '40px' };
  };

  const updateKnobPosition = useCallback((clientX: number, clientY: number) => {
    if (!knobRef.current) return;

    const deltaX = clientX - baseCenter.current.x;
    const deltaY = clientY - baseCenter.current.y;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDistance = Math.min(distance, maxDistance);
    
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;

    knobRef.current.style.transform = `translate(${x}px, ${y}px)`;

    // Normalize to -1 to 1 range
    const normalizedX = x / maxDistance;
    const normalizedY = y / maxDistance;
    
    onMove(normalizedX, normalizedY);
  }, [maxDistance, onMove]);

  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

    if (baseRef.current) {
      const rect = baseRef.current.getBoundingClientRect();
      baseCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    updateKnobPosition(clientX, clientY);
  }, [updateKnobPosition]);

  const handleMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    updateKnobPosition(clientX, clientY);
  }, [updateKnobPosition]);

  const handleEnd = useCallback(() => {
    isDragging.current = false;
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }
    onRelease();
  }, [onRelease]);

  useEffect(() => {
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [handleMove, handleEnd]);

  const positionStyle = getPosition();

  return (
    <div
      ref={baseRef}
      className="joystick-base fixed z-40 no-select"
      style={{
        width: size,
        height: size,
        ...positionStyle,
      }}
      onTouchStart={handleStart}
      onMouseDown={handleStart}
    >
      <div
        ref={knobRef}
        className="joystick-knob absolute"
        style={{
          width: knobSize,
          height: knobSize,
          top: '50%',
          left: '50%',
          marginTop: -knobSize / 2,
          marginLeft: -knobSize / 2,
          transition: isDragging.current ? 'none' : 'transform 0.15s ease-out',
        }}
      />
      
      {/* Direction indicators */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-xs font-bold">▲</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs font-bold">▼</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-xs font-bold">◀</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-bold">▶</div>
      </div>
    </div>
  );
}
