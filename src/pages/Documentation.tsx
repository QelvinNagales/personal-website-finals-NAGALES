import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, ExternalLink, Bot, Wrench, BookOpen, Layers, Code2, Server, Database, Palette, Globe, Cpu, Music2, Gamepad2, FileCode } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

// ── Data ─────────────────────────────────────────────────────────────────────

const FRONTEND_STACK = [
  { name: 'React 18', desc: 'Component-based UI library for building interactive interfaces', icon: <Code2 className="w-5 h-5" /> },
  { name: 'TypeScript', desc: 'Typed superset of JavaScript for safer, scalable code', icon: <FileCode className="w-5 h-5" /> },
  { name: 'Vite', desc: 'Lightning-fast build tool and dev server with HMR', icon: <Cpu className="w-5 h-5" /> },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid UI development', icon: <Palette className="w-5 h-5" /> },
  { name: 'Three.js + R3F', desc: 'React Three Fiber — declarative 3D rendering in React', icon: <Gamepad2 className="w-5 h-5" /> },
  { name: 'shadcn/ui + Radix', desc: 'Accessible, composable UI primitives and components', icon: <Layers className="w-5 h-5" /> },
  { name: 'React Router v6', desc: 'Client-side routing for seamless SPA navigation', icon: <Globe className="w-5 h-5" /> },
  { name: 'TanStack React Query', desc: 'Data fetching, caching, and server state management', icon: <Database className="w-5 h-5" /> },
  { name: 'Lucide React', desc: 'Beautiful, consistent icon set used across all pages', icon: <Code2 className="w-5 h-5" /> },
];

const BACKEND_STACK = [
  { name: 'NestJS', desc: 'Progressive Node.js framework for the REST API backend', icon: <Server className="w-5 h-5" /> },
  { name: 'Supabase', desc: 'Open-source Firebase alternative — database, auth, storage', icon: <Database className="w-5 h-5" /> },
  { name: 'PostgreSQL', desc: 'Underlying relational database via Supabase', icon: <Database className="w-5 h-5" /> },
  { name: 'Spotify Web API', desc: 'Fetches currently-playing track data for the player widget', icon: <Music2 className="w-5 h-5" /> },
];

const DEVTOOLS = [
  { name: 'Vercel', desc: 'Frontend & backend deployment with zero-config CI/CD' },
  { name: 'Bun', desc: 'Fast JavaScript runtime & package manager used alongside npm' },
  { name: 'ESLint', desc: 'Linting and code quality enforcement' },
  { name: 'Vitest', desc: 'Unit testing framework powered by Vite' },
  { name: 'PostCSS + Autoprefixer', desc: 'CSS processing pipeline for Tailwind' },
  { name: 'Git + GitHub', desc: 'Version control and collaborative development' },
];

const AI_MODELS = [
  {
    name: 'GitHub Copilot (GPT-4 / Claude)',
    purpose: 'In-editor AI pair programmer — auto-completions, inline suggestions, and chat-based coding assistance throughout the entire project.',
    prompts: [
      'Generate a 3D driving game scene using React Three Fiber with vehicle controls, checkpoints, and a follow camera.',
      'Create a Profile page with dark/light theme toggle, guestbook with Supabase, image gallery carousel, and Spotify integration.',
      'Build a NestJS backend with Supabase for guestbook CRUD and Spotify now-playing endpoints.',
      'Design a fake-404 landing page that transitions into the 3D game on click.',
    ],
  },
  {
    name: 'Claude (Anthropic)',
    purpose: 'Used for complex reasoning — designing the overall architecture, debugging Three.js rendering issues, and structuring the checkpoint/game-state system.',
    prompts: [
      'Help me architect a driving portfolio where each road checkpoint reveals a section (About, Skills, Projects, etc.).',
      'Debug why checkpoint popups fire continuously — implement a visited-set pattern with useRef.',
      'Refactor the Spotify player to support track/album embeds with metadata extraction via oEmbed.',
    ],
  },
  {
    name: 'ChatGPT (OpenAI)',
    purpose: 'Quick iterations — generating component boilerplate, Tailwind class combinations, and writing copy/data arrays.',
    prompts: [
      'Generate a responsive card grid for projects with gradient overlays and hover effects using Tailwind.',
      'Write TypeScript types for a game state machine with checkpoints, pause, and auto-drive modes.',
      'Create a mobile joystick component for touch-based vehicle steering.',
    ],
  },
];

const REFERENCES = [
  {
    title: 'Simple Image Popup Animation (YouTube Short)',
    url: 'https://www.youtube.com/shorts/DHXm62M5Wpg',
    desc: 'Inspiration for image gallery popup/modal transitions and smooth animation patterns.',
    emoji: '🎬',
  },
  {
    title: 'Grab Singapore — Official Website',
    url: 'https://www.grab.com/sg/',
    desc: 'Design reference for the green-themed UI, clean layout, and the overall "ride/drive" concept that shaped this portfolio.',
    emoji: '🚗',
  },
  {
    title: 'Three.js Driving Game Tutorial (YouTube)',
    url: 'https://www.youtube.com/watch?v=VwfQOhUKMos&t=1001s',
    desc: 'Core reference for building the 3D driving scene — vehicle physics, road generation, camera follow, and environment setup.',
    emoji: '🎮',
  },
  {
    title: 'Spotify for Developers — Web API Docs',
    url: 'https://developer.spotify.com/',
    desc: 'Official documentation for the Spotify Web API and oEmbed endpoints used in the music player widget.',
    emoji: '🎵',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Documentation() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden page-enter">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Game
          </button>
          <span className="font-extrabold text-foreground tracking-tight">DOCUMENTATION</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
              title="View Profile"
            >
              <span className="hidden sm:inline">Profile</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            Project Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Qelvin's Portfolio
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            An interactive 3D driving portfolio built with React, Three.js, and a full-stack backend.
            Below is a complete breakdown of every technology, AI tool, and reference used to create this project.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* ── Tech Stack: Frontend ──────────────────────────────────────── */}
        <section>
          <SectionHeader icon={<Code2 className="w-5 h-5" />} title="Frontend Stack" color="text-blue-600" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {FRONTEND_STACK.map((tech) => (
              <div key={tech.name} className="group rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">{tech.icon}</div>
                  <h3 className="font-bold text-sm">{tech.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack: Backend ───────────────────────────────────────── */}
        <section>
          <SectionHeader icon={<Server className="w-5 h-5" />} title="Backend & Services" color="text-green-600" />
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {BACKEND_STACK.map((tech) => (
              <div key={tech.name} className="group rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600">{tech.icon}</div>
                  <h3 className="font-bold text-sm">{tech.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dev Tools & Deployment ────────────────────────────────────── */}
        <section>
          <SectionHeader icon={<Wrench className="w-5 h-5" />} title="Dev Tools & Deployment" color="text-amber-600" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {DEVTOOLS.map((tool) => (
              <div key={tool.name} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <h3 className="font-bold text-sm mb-1">{tool.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI Models & Prompts ───────────────────────────────────────── */}
        <section>
          <SectionHeader icon={<Bot className="w-5 h-5" />} title="AI Models & Prompts Used" color="text-purple-600" />
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            AI-assisted development was used extensively throughout this project.
            Below are the models used and example prompts that shaped the codebase.
          </p>
          <div className="space-y-6">
            {AI_MODELS.map((model) => (
              <div key={model.name} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-b border-border">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-600" />
                    {model.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{model.purpose}</p>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Example Prompts</p>
                  {model.prompts.map((prompt, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground/80 leading-relaxed italic">"{prompt}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── References ────────────────────────────────────────────────── */}
        <section>
          <SectionHeader icon={<BookOpen className="w-5 h-5" />} title="References & Inspiration" color="text-rose-600" />
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {REFERENCES.map((ref) => (
              <a
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 block"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{ref.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm flex items-center gap-1.5 group-hover:text-primary transition-colors">
                      {ref.title}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{ref.desc}</p>
                    <p className="text-xs text-primary/70 mt-2 truncate">{ref.url}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Project Architecture ──────────────────────────────────────── */}
        <section>
          <SectionHeader icon={<Layers className="w-5 h-5" />} title="Project Architecture" color="text-cyan-600" />
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-500" /> Frontend Structure
                </h3>
                <pre className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-4 overflow-x-auto leading-relaxed">
{`src/
├── pages/
│   ├── Index.tsx        # Fake-404 landing → 3D game
│   ├── Profile.tsx      # Full profile page
│   ├── Documentation.tsx# This page
│   └── NotFound.tsx     # Actual 404
├── components/
│   ├── game/            # 3D scene components
│   │   ├── GameScene    # Main canvas + game loop
│   │   ├── Vehicle      # Drivable car with physics
│   │   ├── Road         # Procedural road segments
│   │   ├── Environment  # Trees, buildings, scenery
│   │   ├── Sky          # Dynamic sky + lighting
│   │   └── FollowCamera # Chase-cam controller
│   └── ui/              # shadcn/ui + custom widgets
│       ├── CheckpointOverlay
│       ├── GameHUD
│       ├── GuestbookModal
│       ├── Joystick
│       ├── SpotifyPlayer
│       └── StartScreen
├── hooks/               # Custom React hooks
│   ├── useGameState     # State machine
│   ├── useGameInput     # Keyboard + touch
│   ├── useGameAudio     # BGM + SFX
│   ├── useOrientation   # Mobile detection
│   └── useTheme         # Dark/light toggle
├── data/
│   └── checkpoints.ts   # Checkpoint definitions
└── lib/
    ├── supabase.ts      # Client + helpers
    └── utils.ts         # cn() and utilities`}
                </pre>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4 text-green-500" /> Backend Structure
                </h3>
                <pre className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-4 overflow-x-auto leading-relaxed">
{`backend/
├── src/
│   ├── main.ts          # NestJS bootstrap
│   ├── app.module.ts    # Root module
│   ├── guestbook/
│   │   ├── controller   # REST endpoints
│   │   ├── service      # Business logic
│   │   ├── module       # DI wiring
│   │   └── dto          # Validation schemas
│   ├── spotify/
│   │   ├── controller   # /now-playing endpoint
│   │   ├── service      # Spotify API calls
│   │   └── module
│   └── supabase/
│       └── service      # Supabase client wrapper
├── nest-cli.json
├── tsconfig.json
└── vercel.json          # Serverless deployment`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <section>
          <SectionHeader icon={<Gamepad2 className="w-5 h-5" />} title="How It Works" color="text-emerald-600" />
          <div className="mt-6 space-y-4">
            {[
              { step: '1', title: 'Fake 404 Landing', desc: 'The homepage displays a convincing Vercel-style 404 error page. Clicking anywhere reveals the 3D game — a playful surprise for visitors.' },
              { step: '2', title: '3D Driving Game', desc: 'Built with React Three Fiber, the user drives a car along a procedurally-placed road. The vehicle responds to keyboard (WASD/arrows) or mobile joystick input with a smooth follow-camera.' },
              { step: '3', title: 'Checkpoint Discovery', desc: 'As the car passes checkpoint markers along the road, overlay popups reveal portfolio sections — About Me, Skills, Projects, and more. A visited-set pattern prevents repeated triggers.' },
              { step: '4', title: 'Profile Page', desc: 'Accessible from checkpoints or direct navigation (/profile). Features a full bio, skill cards, project showcase, image gallery with themed carousels, guestbook, and a live Spotify player.' },
              { step: '5', title: 'Guestbook', desc: 'Visitors leave star-rated messages via a NestJS REST API backed by Supabase/PostgreSQL. Entries are fetched with TanStack Query and displayed in real time.' },
              { step: '6', title: 'Spotify Integration', desc: 'The Spotify player embeds use the oEmbed API to fetch track metadata and display album art, with prev/next controls for a curated playlist.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <span className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-sm flex items-center justify-center">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer className="border-t border-border pt-8 pb-12 text-center">
          <p className="text-sm text-muted-foreground">
            Built with 💚 by <span className="font-bold text-foreground">Qelvin Nagales</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Journey Drive Portfolio &copy; {new Date().getFullYear()} &mdash; All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-xs px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              ← Back to Game
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              View Profile →
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-muted ${color}`}>{icon}</div>
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
    </div>
  );
}
