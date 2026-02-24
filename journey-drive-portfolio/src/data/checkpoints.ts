import type { Checkpoint, RoadWaypoint } from '@/types/game';

// ─── Winding road waypoints (control points for the spline) ─────────────────
export const ROAD_WAYPOINTS: RoadWaypoint[] = [
  { x: 0,   z:  10 },   // 0 – Start line
  { x: 0,   z: -100 },  // 1 – End of first straight
  { x: -30, z: -180 },  // 2 – After first left-diagonal
  { x: -30, z: -270 },  // 3 – End of left straight
  { x:  25, z: -355 },  // 4 – After right-diagonal cross
  { x:  25, z: -440 },  // 5 – End of right straight
  { x: -15, z: -520 },  // 6 – After second left-diagonal
  { x: -15, z: -595 },  // 7 – Finish line
];

// ─── Catmull-Rom spline ──────────────────────────────────────────────────────
// Interpolates between each pair of waypoints using the two neighbour points as
// tangent handles, producing a smooth curved path with no sharp corners.
function catmullRomPoint(
  p0: RoadWaypoint, p1: RoadWaypoint,
  p2: RoadWaypoint, p3: RoadWaypoint,
  t: number
): RoadWaypoint {
  const t2 = t * t, t3 = t2 * t;
  return {
    x: 0.5 * (
      2 * p1.x
      + (-p0.x + p2.x) * t
      + (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2
      + (-p0.x + 3*p1.x - 3*p2.x + p3.x) * t3
    ),
    z: 0.5 * (
      2 * p1.z
      + (-p0.z + p2.z) * t
      + (2*p0.z - 5*p1.z + 4*p2.z - p3.z) * t2
      + (-p0.z + 3*p1.z - 3*p2.z + p3.z) * t3
    ),
  };
}

const SPLINE_STEPS = 20;  // sub-points per waypoint segment – higher = smoother

export const ROAD_SPLINE_POINTS: RoadWaypoint[] = (() => {
  const pts: RoadWaypoint[] = [];
  const wps = ROAD_WAYPOINTS;
  for (let i = 0; i < wps.length - 1; i++) {
    const p0 = wps[Math.max(0, i - 1)];
    const p1 = wps[i];
    const p2 = wps[i + 1];
    const p3 = wps[Math.min(wps.length - 1, i + 2)];
    for (let s = 0; s < SPLINE_STEPS; s++) {
      pts.push(catmullRomPoint(p0, p1, p2, p3, s / SPLINE_STEPS));
    }
  }
  pts.push(wps[wps.length - 1]);  // include the final point
  return pts;
})();

/** Interpolates road-center X at any world Z using the pre-computed spline points */
export function getRoadCenterXatZ(z: number): number {
  const pts = ROAD_SPLINE_POINTS;
  if (z >= pts[0].z) return pts[0].x;
  if (z <= pts[pts.length - 1].z) return pts[pts.length - 1].x;
  for (let i = 0; i < pts.length - 1; i++) {
    if (z <= pts[i].z && z >= pts[i + 1].z) {
      const t = (pts[i].z - z) / (pts[i].z - pts[i + 1].z);
      return pts[i].x + t * (pts[i + 1].x - pts[i].x);
    }
  }
  return 0;
}

export const CHECKPOINTS: Checkpoint[] = [
  // ── 1. Who Am I ─────────────────────────────────────────────────────────────
  {
    id: 'whoami',
    position: -55,
    x: getRoadCenterXatZ(-55),
    gateRotation: 0,
    title: 'Who Am I',
    subtitle: 'Mile 1 — The Starting Point',
    icon: '👋',
    reached: false,
    content: {
      heading: "Hello, I'm Qelvin — an aspiring software developer and soon to be billionaire on a journey to build things that matter.",
      paragraphs: [
        "I'm an Information Technology student with a burning passion for building things that matter. From crafting seamless UI experiences to architecting backend systems, I live and breathe code.",
        "When I'm not coding, I'm probably sleeping or gaming because coding drives me crazy which is why I'm always looking for new food in Grab, making that my inspiration for this project.",
      ],
      items: [
        "🎓  BS Information Technology, 2nd Year",
        "📍  Based in the Philippines",
        "💡  'Gusto ko pagkatao mo!'",
        "🚀  Future Billionaire",
      ],
    },
  },

  // ── 2. Skills & Talents ──────────────────────────────────────────────────────
  {
    id: 'skills',
    position: -180,
    x: getRoadCenterXatZ(-180),
    gateRotation: -0.18,  // slight angle for the curved section
    title: 'Skills & Talents',
    subtitle: 'Mile 2 — My Toolkit',
    icon: '🛠️',
    reached: false,
    content: {
      heading: "What I Bring to the Table",
      paragraphs: [
        "Years of building, breaking, and rebuilding have sharpened a diverse skill set spanning the entire web stack.",
      ],
      items: [
        "⚡  Frontend: React, Vue.js, TypeScript, Three.js",
        "🛡️  Backend: Node.js, NestJS, Flask, REST APIs",
        "🗄️  Database: Supabase, PostgreSQL, MySQL",
        "🎨  Design: Figma, Tailwind CSS, UX Principles",
        "🚀  DevOps: Vercel, Render, Git, Docker basics",
        "🤖  AI: Prompt engineering, Vibe coding",
        "🤗  Others: I can sing, Sleep, Play Games",
      ],
    },
  },

  // ── 3. Projects ──────────────────────────────────────────────────────────────
  {
    id: 'projects',
    position: -325,
    x: 8,  // manually centered on road at this diagonal section
    gateRotation: -0.32,   // aligned with road curve
    title: 'Projects',
    subtitle: "Mile 3 — What I've Built",
    icon: '🚀',
    reached: false,
    content: {
      heading: "Things I've Shipped",
      paragraphs: [
        "Each project is a chapter in my story — built with purpose, shipped with pride.",
      ],
      items: [
        "🎮  This Website",
        "🎶  APC BAND Ticketing Website",
        "👕  SOAR Shirt Website",
        "📱  Horn-In: LinkedIn for APC Rams",
        "👨‍💻  Personal Portfolio v1 (predecessor to this one)",
      ],
      cta: { label: "See All Projects", action: "https://github.com/QelvinNagales" },
    },
  },

  // ── 4. Contact Me ─────────────────────────────────────────────────────────────
  {
    id: 'contact',
    position: -480,
    x: 5,  // manually centered on road at this section
    gateRotation: 0.46,   // aligned with left-diagonal road section
    title: 'Contact Me',
    subtitle: "Mile 4 — Journey's End... or the Beginning?",
    icon: '📬',
    reached: false,
    content: {
      heading: "Let's Build Something Together",
      paragraphs: [
        "You've driven through my whole story. Now let's start a new one together!",
        "Whether you want to collaborate, hire, or just say hi — I'm always online.",
      ],
      items: [
        "📧  qdnagales@student.apc.edu.ph",
        "💼  LinkedIn: https://www.linkedin.com/in/qdnagales/",
        "💻  GitHub: https://github.com/QelvinNagales",
        "📷  Instagram: https://www.instagram.com/cupofjosze/s",
      ],
    },
  },
];

export const ROAD_LENGTH = 650;
export const ROAD_WIDTH  = 14;

