import { useMemo } from 'react';
import { ROAD_SPLINE_POINTS, ROAD_WIDTH } from '@/data/checkpoints';
import type { RoadWaypoint } from '@/types/game';

function computeSegments(waypoints: RoadWaypoint[]) {
  return waypoints.slice(0, -1).map((p0, i) => {
    const p1 = waypoints[i + 1];
    const dx = p1.x - p0.x;
    const dz = p1.z - p0.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    // Rotation: atan2(dx, dz) aligns box Z-axis with segment direction
    const angle = Math.atan2(dx, dz);
    const cx = (p0.x + p1.x) / 2;
    const cz = (p0.z + p1.z) / 2;
    return { cx, cz, length, angle };
  });
}

export function Road() {
  const segments = useMemo(() => computeSegments(ROAD_SPLINE_POINTS), []);

  return (
    <group>
      {segments.map((seg, i) => (
        <group key={i} position={[seg.cx, 0, seg.cz]} rotation={[0, seg.angle, 0]}>
          {/* ── Asphalt surface ───────────────────────────── */}
          <mesh position={[0, 0.01, 0]} receiveShadow>
            <boxGeometry args={[ROAD_WIDTH, 0.02, seg.length + 0.5]} />
            <meshStandardMaterial color="#2d2d32" roughness={0.9} />
          </mesh>

          {/* ── Road shoulders (shortened 8u from ends to avoid corner protrusion) */}
          <mesh position={[-(ROAD_WIDTH / 2) - 1.2, 0.005, 0]}>
            <boxGeometry args={[2.4, 0.015, Math.max(1, seg.length - 8)]} />
            <meshStandardMaterial color="#505055" />
          </mesh>
          <mesh position={[(ROAD_WIDTH / 2) + 1.2, 0.005, 0]}>
            <boxGeometry args={[2.4, 0.015, Math.max(1, seg.length - 8)]} />
            <meshStandardMaterial color="#505055" />
          </mesh>

          {/* ── White edge lines (shortened so they don’t cross at corners) */}
          <mesh position={[-(ROAD_WIDTH / 2) + 0.2, 0.022, 0]}>
            <boxGeometry args={[0.3, 0.005, Math.max(1, seg.length - 8)]} />
            <meshStandardMaterial color="#eeeeee" />
          </mesh>
          <mesh position={[(ROAD_WIDTH / 2) - 0.2, 0.022, 0]}>
            <boxGeometry args={[0.3, 0.005, Math.max(1, seg.length - 8)]} />
            <meshStandardMaterial color="#eeeeee" />
          </mesh>

          {/* ── Dashed centre line ───────────────────────── */}
          {Array.from({ length: Math.floor(seg.length / 8) }, (_, j) => (
            <mesh
              key={j}
              position={[0, 0.025, -seg.length / 2 + j * 8 + 4]}
            >
              <boxGeometry args={[0.2, 0.005, 4.5]} />
              <meshStandardMaterial color="#f5c842" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Start line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROAD_SPLINE_POINTS[0].x, 0.03, ROAD_SPLINE_POINTS[0].z - 2]}>
        <planeGeometry args={[ROAD_WIDTH, 1.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Finish line (chequered) at the last spline point */}
      {[-3.5, -1.75, 0, 1.75, 3.5].map((x, i) => (
        <mesh
          key={i}
          position={[
            x + ROAD_SPLINE_POINTS[ROAD_SPLINE_POINTS.length - 1].x,
            0.03,
            ROAD_SPLINE_POINTS[ROAD_SPLINE_POINTS.length - 1].z + 5,
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2, 1.5]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#ffffff' : '#111111'} />
        </mesh>
      ))}
    </group>
  );
}

