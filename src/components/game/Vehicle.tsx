import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InputState } from '@/types/game';
import { ROAD_SPLINE_POINTS, ROAD_WIDTH } from '@/data/checkpoints';

// Interpolate road centre X at a given world Z using the dense spline points
function roadCenterXatZ(z: number): number {
  const wps = ROAD_SPLINE_POINTS;
  for (let i = 0; i < wps.length - 1; i++) {
    const z0 = wps[i].z, z1 = wps[i + 1].z;
    const minZ = Math.min(z0, z1), maxZ = Math.max(z0, z1);
    if (z >= minZ && z <= maxZ) {
      const t = (z - z0) / (z1 - z0 || 0.0001);
      return wps[i].x + t * (wps[i + 1].x - wps[i].x);
    }
  }
  if (z > wps[0].z) return wps[0].x;
  return wps[wps.length - 1].x;
}

interface VehicleProps {
  input: InputState;
  isPaused: boolean;
  autoMode: boolean;
  onPositionUpdate: (x: number, z: number, heading: number) => void;
  onCheckpointHit: (x: number, z: number) => void;
}

export function Vehicle({ input, isPaused, autoMode, onPositionUpdate, onCheckpointHit }: VehicleProps) {
  const vehicleRef   = useRef<THREE.Group>(null);
  const bodyRef      = useRef<THREE.Mesh>(null);
  const velocity     = useRef(0);
  const posRef       = useRef({ x: 0, z: 5 });
  const headingRef   = useRef(0);          // car heading in radians
  const steerAngle   = useRef(0);          // actual front-wheel steer angle (radians)
  const wheelSpin    = useRef(0);
  const accelRamp    = useRef(0);          // 0’1 ramp — builds up as W is held

  // ── Physics constants ──────────────────────────────────────────────────────
  const MAX_SPEED       = 0.38;   // reduced — feels less frantic
  const MAX_REVERSE     = 0.20;
  const THROTTLE_ACCEL  = 0.055;  // base accel (multiplied by ramp)
  const ENGINE_BRAKE    = 0.020;
  const ROLL_RESISTANCE = 0.005;
  const BRAKE_FORCE     = 0.15;
  const WHEEL_BASE      = 2.3;
  const MAX_STEER_ANGLE = 0.48;

  useFrame((_, delta) => {
    if (!vehicleRef.current || isPaused) return;

    const dt = Math.min(delta, 0.1);
    const throttle = autoMode ? 0.75 : input.forward;
    
    // ── Auto-steering logic ──────────────────────────────────────────────────
    let steerCmd = input.steering;
    if (autoMode) {
      // Look ahead distance scales with speed
      const lookAhead = 15 + Math.abs(velocity.current) * 20;
      const targetZ = posRef.current.z - lookAhead;
      const targetX = roadCenterXatZ(targetZ);
      
      // Target angle: direction from car to look-ahead point
      const dx = targetX - posRef.current.x;
      const dz = targetZ - posRef.current.z;
      const targetAngle = Math.atan2(dx, -dz); // angle to target point
      
      // Current heading error
      let headingError = targetAngle - headingRef.current;
      
      // Normalize to [-PI, PI]
      while (headingError > Math.PI) headingError -= 2 * Math.PI;
      while (headingError < -Math.PI) headingError += 2 * Math.PI;
      
      // Also add correction for lateral offset from road center
      const currentRoadCenterX = roadCenterXatZ(posRef.current.z);
      const lateralOffset = posRef.current.x - currentRoadCenterX;
      const lateralCorrection = -lateralOffset * 0.08; // gentle pull to center
      
      // Combine heading error and lateral correction
      const totalCorrection = headingError * 2.5 + lateralCorrection;
      
      // Clamp to [-1, 1] for steerCmd
      steerCmd = Math.max(-1, Math.min(1, totalCorrection));
    }

    // ── Throttle / braking ───────────────────────────────────────────────────
    if (throttle > 0) {
      // Ramp up — starts slow, builds to full acceleration after ~1.5 s
      accelRamp.current = Math.min(accelRamp.current + dt * 0.7, 1.0);
      const effectiveAccel = THROTTLE_ACCEL * (0.25 + 0.75 * accelRamp.current);
      velocity.current = Math.min(velocity.current + effectiveAccel * throttle * dt * 60, MAX_SPEED);
    } else if (throttle < 0) {
      accelRamp.current = 0;  // reset ramp on brake/reverse
      if (velocity.current > 0.05) {
        velocity.current = Math.max(velocity.current - BRAKE_FORCE * dt * 60, 0);
      } else {
        velocity.current = Math.max(velocity.current + throttle * THROTTLE_ACCEL * dt * 60, -MAX_REVERSE);
      }
    } else {
      // Let ramp fall back quickly when W is released
      accelRamp.current = Math.max(accelRamp.current - dt * 2.0, 0);
      const drag = velocity.current > 0
        ? ENGINE_BRAKE + ROLL_RESISTANCE
        : velocity.current < 0 ? -(ENGINE_BRAKE + ROLL_RESISTANCE) : 0;
      velocity.current -= drag * dt * 60;
      if (Math.abs(velocity.current) < 0.001) velocity.current = 0;
    }

    // ── Bicycle / Ackermann steering ─────────────────────────────────────────
    // Steer angle lerps smoothly to target — 0.09 gives gradual, natural turn-in
    const speedRatio  = Math.abs(velocity.current) / MAX_SPEED;
    const targetSteer = steerCmd * MAX_STEER_ANGLE * (1 - speedRatio * 0.30);
    steerAngle.current += (targetSteer - steerAngle.current) * 0.09;

    if (Math.abs(velocity.current) > 0.001) {
      const h = headingRef.current;
      // Anchor on rear axle
      const rearX = posRef.current.x - Math.sin(h) * WHEEL_BASE / 2;
      const rearZ = posRef.current.z + Math.cos(h) * WHEEL_BASE / 2;
      // Advance rear axle
      const dist  = velocity.current * dt * 60;
      const newRearX = rearX + Math.sin(h) * dist;
      const newRearZ = rearZ - Math.cos(h) * dist;
      // Rotate heading: Δh = dist * tan(steer) / wheelBase
      headingRef.current += dist * Math.tan(steerAngle.current) / WHEEL_BASE;
      // Rebuild car center from updated rear axle
      const nh = headingRef.current;
      posRef.current.x = newRearX + Math.sin(nh) * WHEEL_BASE / 2;
      posRef.current.z = newRearZ - Math.cos(nh) * WHEEL_BASE / 2;
    }

    // ── Road boundary clamping (soft wall) ──────────────────────────────
    const roadCX  = roadCenterXatZ(posRef.current.z);
    const halfRoad = ROAD_WIDTH / 2 + 0.5;        // tiny overflow buffer
    const offX = posRef.current.x - roadCX;
    if (Math.abs(offX) > halfRoad) {
      posRef.current.x = roadCX + Math.sign(offX) * halfRoad;
      velocity.current *= 0.6;                     // bounce off the kerb
    }
    // ── Loop teleport: when car passes the finish line, snap back to start ───────
    const finishZ = ROAD_SPLINE_POINTS[ROAD_SPLINE_POINTS.length - 1].z - 5;
    if (posRef.current.z < finishZ) {
      posRef.current.x = ROAD_SPLINE_POINTS[0].x;
      posRef.current.z = ROAD_SPLINE_POINTS[0].z - 2;
      headingRef.current = 0; // facing north (negative Z)
      velocity.current *= 0.5; // gentle speed carry-over
    }

    // ── Apply transforms ───────────────────────────────────────────────────────
    vehicleRef.current.position.set(posRef.current.x, 0.3, posRef.current.z);
    // Negate: Three.js +Y rotation is CCW (left), but physics heading increases for right turns
    vehicleRef.current.rotation.y = -headingRef.current;

    // Soft body roll on turns (cosmetic)
    if (bodyRef.current) {
      const targetRoll = -steerAngle.current * velocity.current * 0.35;
      bodyRef.current.rotation.z += (targetRoll - bodyRef.current.rotation.z) * 0.12;
    }

    // steerAngle.current is now the real steering angle — reuse for visual wheel rotation
    // Rolling wheel spin
    wheelSpin.current += velocity.current * 12 * dt * 60;

    // ── Callbacks ─────────────────────────────────────────────────────────────
    onPositionUpdate(posRef.current.x, posRef.current.z, headingRef.current);
    if (Math.abs(velocity.current) > 0.005) {
      onCheckpointHit(posRef.current.x, posRef.current.z);
    }
  });

  // Shared materials (defined once, referenced below)
  const bodyColor    = '#58BC6B';   // deep red — a classic GTA feel
  const cabinColor   = '#58BC6B';
  const glassColor   = '#aed6f1';
  const wheelColor   = '#1a1a1a';
  const rimColor     = '#b7bec9';
  const lightYellow  = '#ffffaa';
  const lightRed     = '#ff4444';

  // Wheel positions [x, y, z, isFront]
  // Front of car faces negative-Z (front bumper at z=-1.9, headlights at z=-1.87)
  // So z=-1.15 = FRONT wheels, z=+1.15 = REAR wheels
  const wheels: [number, number, number, boolean][] = [
    [-0.92, -0.18, -1.15, true],   // front-left
    [ 0.92, -0.18, -1.15, true],   // front-right
    [-0.92, -0.18,  1.15, false],  // rear-left
    [ 0.92, -0.18,  1.15, false],  // rear-right
  ];

  return (
    <group ref={vehicleRef} position={[0, 0.3, 5]}>
      {/* Scale wrapper — makes car visually larger without affecting physics */}
      <group scale={[2.1, 2.1, 2.1]} position={[0, 0.32, 0]}>
      {/* ── Main body ────────────────────────────────────────────────────── */}
      <mesh ref={bodyRef} castShadow>
        <boxGeometry args={[1.85, 0.55, 3.7]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Body kit — front bumper lip */}
      <mesh position={[0, -0.2, -1.9]} castShadow>
        <boxGeometry args={[1.7, 0.15, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Body kit — rear spoiler */}
      <mesh position={[0, 0.36, 1.82]} castShadow>
        <boxGeometry args={[1.7, 0.12, 0.12]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* ── Cabin ─────────────────────────────────────────────────────────── */}
      <mesh position={[0, 0.52, 0.15]} castShadow>
        <boxGeometry args={[1.55, 0.52, 1.9]} />
        <meshStandardMaterial color={cabinColor} roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.50, -0.72]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[1.42, 0.42, 0.08]} />
        <meshStandardMaterial color={glassColor} transparent opacity={0.65} roughness={0.05} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.50, 1.02]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[1.42, 0.42, 0.08]} />
        <meshStandardMaterial color={glassColor} transparent opacity={0.65} roughness={0.05} />
      </mesh>

      {/* ── Side windows ──────────────────────────────────────────────────── */}
      {[-0.78, 0.78].map((x, i) => (
        <mesh key={i} position={[x, 0.52, 0.15]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.6, 0.38, 0.05]} />
          <meshStandardMaterial color={glassColor} transparent opacity={0.6} roughness={0.05} />
        </mesh>
      ))}

      {/* ── Headlights ────────────────────────────────────────────────────── */}
      {[-0.62, 0.62].map((x, i) => (
        <mesh key={i} position={[x, 0.05, -1.87]}>
          <boxGeometry args={[0.32, 0.18, 0.06]} />
          <meshStandardMaterial color={lightYellow} emissive={lightYellow} emissiveIntensity={1.2} />
        </mesh>
      ))}

      {/* ── Tail lights ───────────────────────────────────────────────────── */}
      {[-0.62, 0.62].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 1.87]}>
          <boxGeometry args={[0.32, 0.18, 0.06]} />
          <meshStandardMaterial color={lightRed} emissive={lightRed} emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* ── Wheels ────────────────────────────────────────────────────────── */}
      {wheels.map(([wx, wy, wz, isFront], i) => (
        <group
          key={i}
          position={[wx, wy, wz]}
          rotation={[0, isFront ? -steerAngle.current : 0, 0]}
        >
          {/* Tyre */}
          <mesh rotation={[wheelSpin.current, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.37, 0.37, 0.28, 18]} />
            <meshStandardMaterial color={wheelColor} roughness={0.95} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[wheelSpin.current, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.29, 8]} />
            <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      ))}
      </group>{/* end scale wrapper */}
    </group>
  );
}

