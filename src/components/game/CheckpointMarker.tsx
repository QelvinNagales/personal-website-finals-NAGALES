import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Checkpoint } from '@/types/game';

interface CheckpointMarkerProps {
  checkpoint: Checkpoint;
  reached: boolean;
}

export function CheckpointMarker({ checkpoint, reached }: CheckpointMarkerProps) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glowRef.current && !reached) {
      const pulse = Math.sin(clock.elapsedTime * 2.5) * 0.18 + 0.82;
      glowRef.current.scale.setScalar(pulse);
    }
    if (glowRef.current && reached) {
      glowRef.current.scale.setScalar(1);
    }
  });

  const gateColor = reached ? '#4ade80' : '#f5c842';
  const glowColor = reached ? '#22c55e' : '#fbbf24';

  // Place the gate at the checkpoint world position, rotated to face across the road
  return (
    <group
      position={[checkpoint.x, 0, checkpoint.position]}
      rotation={[0, checkpoint.gateRotation ?? 0, 0]}
    >
      {/* ── Gate posts ─────────────────────────────────────────────────── */}
      <mesh position={[-6, 3, 0]} castShadow>
        <boxGeometry args={[0.55, 6, 0.55]} />
        <meshStandardMaterial color={gateColor} emissive={gateColor} emissiveIntensity={reached ? 0.3 : 0.6} />
      </mesh>
      <mesh position={[6, 3, 0]} castShadow>
        <boxGeometry args={[0.55, 6, 0.55]} />
        <meshStandardMaterial color={gateColor} emissive={gateColor} emissiveIntensity={reached ? 0.3 : 0.6} />
      </mesh>

      {/* ── Gate top beam ──────────────────────────────────────────────── */}
      <mesh position={[0, 6.1, 0]} castShadow>
        <boxGeometry args={[12.5, 0.55, 0.55]} />
        <meshStandardMaterial color={gateColor} emissive={gateColor} emissiveIntensity={reached ? 0.2 : 0.5} />
      </mesh>

      {/* ── Checkpoint title ───────────────────────────────────────────── */}
      <Text
        position={[0, 7.7, 0]}
        fontSize={1.3}
        color={gateColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#000000"
      >
        {checkpoint.title}
      </Text>

      {/* ── Subtitle ───────────────────────────────────────────────────── */}
      <Text
        position={[0, 6.7, 0.12]}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {checkpoint.subtitle}
      </Text>

      {/* ── Icon above gate ────────────────────────────────────────────── */}
      <Text
        position={[0, 9, 0]}
        fontSize={2.2}
        anchorX="center"
        anchorY="middle"
      >
        {checkpoint.icon}
      </Text>

      {/* ── Glowing ground ring ────────────────────────────────────────── */}
      <mesh
        ref={glowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.08, 0]}
      >
        <ringGeometry args={[4.5, 6, 40]} />
        <meshBasicMaterial color={glowColor} transparent opacity={reached ? 0.25 : 0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Reached indicator ──────────────────────────────────────────── */}
      {reached && (
        <Text
          position={[0, 5, 0.4]}
          fontSize={0.7}
          color="#4ade80"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000"
        >
          ✓ Reached
        </Text>
      )}
    </group>
  );
}
