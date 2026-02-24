import { useMemo, Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { ROAD_WAYPOINTS, ROAD_SPLINE_POINTS, ROAD_WIDTH } from "@/data/checkpoints";
import type { RoadWaypoint } from "@/types/game";

function roadXatZ(z: number, waypoints: RoadWaypoint[]): number {
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = waypoints[i], p1 = waypoints[i + 1];
    if (z <= p0.z && z >= p1.z) {
      const t = (z - p0.z) / (p1.z - p0.z);
      return p0.x + t * (p1.x - p0.x);
    }
  }
  return waypoints[waypoints.length - 1].x;
}

function StreetLamp({ position, flip = false }: { position: [number, number, number]; flip?: boolean }) {
  const dir = flip ? -1 : 1;
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Vertical pole */}
      <mesh position={[0, 3.7, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 7, 8]} />
        <meshStandardMaterial color="#5a6a7a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Horizontal arm extending over road */}
      <mesh position={[dir * 1.2, 7.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 6]} />
        <meshStandardMaterial color="#5a6a7a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Lamp fixture */}
      <mesh position={[dir * 2.3, 6.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.35]} />
        <meshStandardMaterial color="#3a4550" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Light bulb (glowing) */}
      <mesh position={[dir * 2.3, 6.65, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.28]} />
        <meshStandardMaterial color="#fff8dc" emissive="#fff8dc" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Building({
  position, width, depth, height, color,
}: {
  position: [number, number, number]; width: number; depth: number; height: number; color: string;
}) {
  const cols = Math.max(2, Math.floor(width / 2.8));
  const rows = Math.max(2, Math.floor(height / 3.8));
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0.1} />
      </mesh>
      <mesh position={[0, height + 0.18, 0]}>
        <boxGeometry args={[width + 0.2, 0.36, depth + 0.2]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.9} />
      </mesh>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const wx = -width / 2 + (c + 0.5) * (width / cols) + 0.1;
          const wy = (r + 0.5) * (height / rows) + 0.3;
          const lit = (r * cols + c + Math.floor(Math.abs(position[0]))) % 3 !== 0;
          return (
            <mesh key={`${r}-${c}`} position={[wx, wy, depth / 2 + 0.01]}>
              <boxGeometry args={[width / cols - 0.55, height / rows - 0.9, 0.06]} />
              <meshStandardMaterial
                color={lit ? "#d4e8ff" : "#c8cdd2"}
                emissive={lit ? "#b8d4f0" : "#000"}
                emissiveIntensity={lit ? 0.1 : 0}
                roughness={0.2}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

function ParkedCar({ position, rotation = 0, color }: { position: [number, number, number]; rotation?: number; color: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.7, 0.48, 3.4]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.78, 0.1]} castShadow>
        <boxGeometry args={[1.45, 0.4, 1.75]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.4} />
      </mesh>
      {([-0.85, 0.85] as number[]).flatMap((wx) =>
        ([-1.1, 1.1] as number[]).map((wz, j) => (
          <mesh key={`${wx}-${j}`} position={[wx, 0.18, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.22, 10]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ── Billboard image display component ───────────────────────────────────────
function BillboardImage({ imageUrl }: { imageUrl: string }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
        setError(false);
      },
      undefined,
      () => {
        console.warn(`Failed to load billboard image: ${imageUrl}`);
        setError(true);
      }
    );
  }, [imageUrl]);

  // Show placeholder if loading or error
  if (!texture || error) {
    return (
      <mesh position={[0, 7, 0.16]}>
        <planeGeometry args={[6.4, 4]} />
        <meshStandardMaterial color={error ? "#fecaca" : "#e2e8f0"} roughness={0.3} />
      </mesh>
    );
  }
  
  return (
    <mesh position={[0, 7, 0.16]}>
      <planeGeometry args={[6.4, 4]} />
      <meshStandardMaterial map={texture} roughness={0.3} toneMapped={false} />
    </mesh>
  );
}

// ── Billboard for showcasing images ─────────────────────────────────────────
function Billboard({ 
  position, 
  rotation = 0, 
  imageUrl, 
  label 
}: { 
  position: [number, number, number]; 
  rotation?: number; 
  imageUrl?: string;
  label?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main pole */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 6, 8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Billboard frame */}
      <mesh position={[0, 7, 0]} castShadow>
        <boxGeometry args={[7, 4.5, 0.3]} />
        <meshStandardMaterial color="#2d3748" roughness={0.8} />
      </mesh>
      {/* Billboard display area (front - faces the road) */}
      {imageUrl ? (
        <Suspense fallback={
          <mesh position={[0, 7, 0.16]}>
            <planeGeometry args={[6.4, 4]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
        }>
          <BillboardImage imageUrl={imageUrl} />
        </Suspense>
      ) : (
        <mesh position={[0, 7, 0.16]}>
          <planeGeometry args={[6.4, 4]} />
          <meshStandardMaterial color="#f7fafc" roughness={0.2} />
        </mesh>
      )}
      {/* Billboard display area (back) */}
      <mesh position={[0, 7, -0.16]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6.4, 4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      {/* Top accent bar */}
      <mesh position={[0, 9.4, 0]}>
        <boxGeometry args={[7.3, 0.25, 0.4]} />
        <meshStandardMaterial color="#ed8936" emissive="#ed8936" emissiveIntensity={0.4} />
      </mesh>
      {/* Bottom accent bar */}
      <mesh position={[0, 4.6, 0]}>
        <boxGeometry args={[7.3, 0.2, 0.35]} />
        <meshStandardMaterial color="#3182ce" />
      </mesh>
    </group>
  );
}

export function Environment() {
  const HALF_ROAD = ROAD_WIDTH / 2;

  const lamps = useMemo(() => {
    const items: { pos: [number, number, number]; flip: boolean }[] = [];
    for (let z = 5; z > -660; z -= 32) {
      const cx = roadXatZ(z, ROAD_SPLINE_POINTS);
      items.push({ pos: [cx - HALF_ROAD - 2, 0, z], flip: false });
      items.push({ pos: [cx + HALF_ROAD + 2, 0, z], flip: true });
    }
    return items;
  }, []);

  // ── Billboards for showcasing images ────────────────────────────────────────
  const billboards = useMemo(() => {
    const items: { pos: [number, number, number]; rot: number; label: string; imageUrl: string }[] = [];
    // Place billboards along the road, rotated to face perpendicular to road direction
    // Using local public/billboards folder for images
    const billboardData = [
      { label: "Me - Grad", imageUrl: "/billboards/Grad.png" },
      { label: "Org - JPCS", imageUrl: "/billboards/JPCS.png" },
      { label: "Me - Selfie", imageUrl: "/billboards/Selfie.jpg" },
      { label: "Org - SOAR", imageUrl: "/billboards/SOAR.png" },
      { label: "Friends", imageUrl: "/billboards/friends1.jpg" },
      { label: "Org - SoCIT", imageUrl: "/billboards/SoCIT.png" },
      { label: "Me - Original", imageUrl: "/billboards/Orig.png" },
      { label: "Org - Band", imageUrl: "/billboards/Band.png" },
      { label: "Friends 2", imageUrl: "/billboards/friends2.jpg" },
      { label: "Org - JISSA", imageUrl: "/billboards/JISSA.png" },
      { label: "Me - Kanta", imageUrl: "/billboards/kanta.jpg" },
      { label: "Org - MSC", imageUrl: "/billboards/MSC.png" },
      { label: "Friends 3", imageUrl: "/billboards/friends3.jpg" },
      { label: "Project - APC Band", imageUrl: "/billboards/apc-band.png" },
      { label: "Friends 4", imageUrl: "/billboards/friends4.jpg" },
    ];
    let labelIdx = 0;
    for (let z = -35; z > -470; z -= 42) {
      // Skip diagonal transition zones where billboards look awkward
      if ((z < -250 && z > -360) || (z < -430 && z > -470)) {
        continue;
      }

      const cx = roadXatZ(z, ROAD_WAYPOINTS);
      const side = labelIdx % 2 === 0 ? -1 : 1;

      // Compute road direction angle at this z (wide 10-unit sample for stable angles at curves)
      const dx = roadXatZ(z - 5, ROAD_WAYPOINTS) - roadXatZ(z + 5, ROAD_WAYPOINTS);
      const dz = -10;
      const roadAngle = Math.atan2(dx, dz);

      // Rotate billboard to face the road, tilted ~20° toward driver (coming from +z)
      const tilt = 0.35;  // ~20 degrees toward the approaching driver
      const rot = side === -1
        ? roadAngle + Math.PI / 2 - tilt   // left-side: face road + toward driver
        : roadAngle - Math.PI / 2 + tilt;  // right-side: face road + toward driver

      const data = billboardData[labelIdx % billboardData.length];
      items.push({
        pos: [cx + side * (HALF_ROAD + 4.5), 0, z],
        rot,
        label: data.label,
        imageUrl: data.imageUrl,
      });
      labelIdx++;
    }
    return items;
  }, []);

  // ── Continuous wall barriers along the road (blocks sky on diagonals) ──────
  const wallBarriers = useMemo(() => {
    const pts = ROAD_SPLINE_POINTS;
    const walls: { pos: [number, number, number]; len: number; angle: number; side: number }[] = [];
    // Sample every 3rd spline point for walls
    for (let i = 0; i < pts.length - 3; i += 3) {
      const dx = pts[i + 3].x - pts[i].x;
      const dz = pts[i + 3].z - pts[i].z;
      const len = Math.sqrt(dx * dx + dz * dz) + 1;
      const angle = Math.atan2(dx, -dz);
      const mx = (pts[i].x + pts[i + 3].x) / 2;
      const mz = (pts[i].z + pts[i + 3].z) / 2;
      const nx = -dz / (len - 1), nz = dx / (len - 1);
      const off = HALF_ROAD + 22; // Behind the buildings
      walls.push({ pos: [mx + nx * off, 0, mz + nz * off], len, angle, side: 1 });
      walls.push({ pos: [mx - nx * off, 0, mz - nz * off], len, angle, side: -1 });
    }
    return walls;
  }, []);

  const buildings = useMemo(() => {
    const seed = (n: number) => Math.abs(((n * 1664525 + 1013904223) | 0) / 2147483647);
    const COLORS = ["#b0b8c1","#c5cdd6","#a8b4be","#c0c8d0","#bbc3cc","#d0d8e0","#b8c0c8","#c8d0d8"];
    const items: { pos: [number, number, number]; w: number; d: number; h: number; color: string }[] = [];
    let st = 0;
    for (let z = 20; z > -660; z -= 24) {
      const cx = roadXatZ(z, ROAD_WAYPOINTS);
      const s1 = seed(st++), s2 = seed(st++);
      const lw = 8 + s1 * 12, lh = 14 + s1 * 38, ld = 8 + s2 * 8;
      const rw = 8 + s2 * 12, rh = 14 + s2 * 38, rd = 8 + s1 * 8;
      items.push({ pos: [cx - HALF_ROAD - 8 - lw / 2, 0, z], w: lw, d: ld, h: lh, color: COLORS[Math.floor(s1 * COLORS.length)] });
      items.push({ pos: [cx + HALF_ROAD + 8 + rw / 2, 0, z], w: rw, d: rd, h: rh, color: COLORS[Math.floor(s2 * COLORS.length)] });
    }
    return items;
  }, []);

  const parkedCars = useMemo(() => {
    const seed = (n: number) => Math.abs(((n * 214013 + 2531011) | 0) / 2147483647);
    const CAR_COLORS = ["#c0392b","#2980b9","#27ae60","#f39c12","#8e44ad","#ecf0f1","#1a1a1a","#e67e22"];
    const items: { pos: [number, number, number]; rot: number; color: string }[] = [];
    for (let z = -20; z > -640; z -= 38) {
      const s = Math.abs(seed(z));
      if (s > 0.28) {
        const cx = roadXatZ(z, ROAD_WAYPOINTS);
        const side = s > 0.5 ? 1 : -1;
        items.push({
          pos: [cx + side * (HALF_ROAD + 5.5), 0, z],
          rot: side * Math.PI / 2,
          color: CAR_COLORS[Math.floor(s * CAR_COLORS.length)],
        });
      }
    }
    return items;
  }, []);

  const skylineBlocks = [
    // All pushed past z=-620 (Contact Me checkpoint is at z=-555, road ends z=-595)
    [-130, -640, 28, 85, "#8fa0b0"], [-100, -660, 18, 55, "#9bb0c0"],
    [ -65, -680, 24, 68, "#8a9dae"], [  85, -640, 26, 78, "#8fa0b0"],
    [ 115, -665, 20, 60, "#9bb0c0"], [ 145, -650, 30, 92, "#8799aa"],
    [   5, -700, 38, 95, "#849aab"], [  55, -690, 24, 64, "#8fa0b0"],
    [ -60, -710, 28, 78, "#9bb0c0"], [ -30, -680, 20, 52, "#8a9dae"],
    [  30, -720, 16, 45, "#9098a8"],
  ];

  return (
    <group>
      {/* Wide concrete ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -290]} receiveShadow>
        <planeGeometry args={[550, 720]} />
        <meshStandardMaterial color="#8a8f88" roughness={0.9} />
      </mesh>

      {/* Continuous wall barriers — blocks the sky on diagonal sections */}
      {wallBarriers.map((wall, i) => (
        <mesh key={`wall-${i}`} position={[wall.pos[0], 25, wall.pos[2]]} rotation={[0, wall.angle, 0]}>
          <boxGeometry args={[wall.len, 50, 4]} />
          <meshStandardMaterial color="#95a5b5" roughness={0.85} />
        </mesh>
      ))}

      {/* Street lamps */}
      {lamps.map((l, i) => <StreetLamp key={`l-${i}`} position={l.pos} flip={l.flip} />)}

      {/* Buildings */}
      {buildings.map((b, i) => (
        <Building key={`b-${i}`} position={b.pos} width={b.w} depth={b.d} height={b.h} color={b.color} />
      ))}

      {/* Parked cars on kerb */}
      {parkedCars.map((c, i) => (
        <ParkedCar key={`pc-${i}`} position={c.pos} rotation={c.rot} color={c.color} />
      ))}

      {/* Distant skyline silhouettes */}
      {skylineBlocks.map(([x, z, w, h, c], i) => (
        <mesh key={`sky-${i}`} position={[x as number, (h as number) / 2, z as number]}>
          <boxGeometry args={[w as number, h as number, 5]} />
          <meshStandardMaterial color={c as string} roughness={1} />
        </mesh>
      ))}

      {/* Horizon city-glow strip removed — was rendering as blocking orange wall */}
    </group>
  );
}
