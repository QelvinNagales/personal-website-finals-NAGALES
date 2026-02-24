import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Orientation } from '@/types/game';

interface FollowCameraProps {
  targetPosition: { x: number; z: number; heading?: number };
  orientation: Orientation;
  isMobile: boolean;
}

export function FollowCamera({ targetPosition, orientation, isMobile }: FollowCameraProps) {
  const { camera } = useThree();
  const smoothPos    = useRef(new THREE.Vector3(0, 9, 19));
  const smoothLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
  const initialized  = useRef(false);

  const getCameraSettings = () => {
    if (isMobile) {
      return orientation === 'portrait'
        ? { height: 12, distance: 18, lookAhead: 8, lerpSpeed: 0.14 }
        : { height: 10, distance: 15, lookAhead: 7, lerpSpeed: 0.14 };
    }
    return { height: 9, distance: 14, lookAhead: 6, lerpSpeed: 0.14 };
  };

  useFrame(() => {
    const { height, distance, lookAhead, lerpSpeed } = getCameraSettings();
    const heading = targetPosition.heading ?? 0;

    // Camera sits BEHIND the vehicle along its heading direction
    const behindX = targetPosition.x - Math.sin(heading) * distance;
    const behindZ = targetPosition.z + Math.cos(heading) * distance;

    const targetCam  = new THREE.Vector3(behindX, height, behindZ);

    // Look-ahead position (slightly in front of the car)
    const aheadX = targetPosition.x + Math.sin(heading) * lookAhead;
    const aheadZ = targetPosition.z - Math.cos(heading) * lookAhead;
    const targetLook = new THREE.Vector3(aheadX, 1.2, aheadZ);

    // On the very first frame, snap immediately so the camera starts on the car
    if (!initialized.current) {
      smoothPos.current.copy(targetCam);
      smoothLookAt.current.copy(targetLook);
      initialized.current = true;
    }

    // Smooth interpolation — faster lerp keeps camera locked to car
    smoothPos.current.lerp(targetCam, lerpSpeed);
    smoothLookAt.current.lerp(targetLook, lerpSpeed);

    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLookAt.current);
  });

  return null;
}

