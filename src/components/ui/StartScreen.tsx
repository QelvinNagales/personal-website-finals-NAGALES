import { Play, SkipForward, Gamepad2, Zap, MapPin, User, Briefcase, BookOpen, ArrowRight, Sparkles, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface StartScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

const CHECKPOINTS = [
  { icon: User, label: 'About Me', color: 'from-blue-500 to-cyan-500' },
  { icon: Briefcase, label: 'Experience', color: 'from-purple-500 to-pink-500' },
  { icon: BookOpen, label: 'Skills', color: 'from-amber-500 to-orange-500' },
  { icon: MapPin, label: 'Contact', color: 'from-emerald-500 to-teal-500' },
];

export function StartScreen({ onStart, onSkip }: StartScreenProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`fixed inset-0 z-50 flex flex-col overflow-hidden page-fade-in ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-white'
    }`}>
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950' 
            : 'bg-gradient-to-br from-white via-gray-50 to-emerald-50'
        }`} />
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
          theme === 'dark'
            ? 'from-emerald-900/20 via-transparent to-transparent'
            : 'from-emerald-100/50 via-transparent to-transparent'
        }`} />
        {/* Animated grid */}
        <div 
          className={`absolute inset-0 ${theme === 'dark' ? 'opacity-10' : 'opacity-5'}`}
          style={{
            backgroundImage: `linear-gradient(${theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        {/* Floating orbs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-500/5'
        }`} style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation header */}
      <header className={`relative z-20 flex items-center justify-between px-6 py-4 border-b ${
        theme === 'dark' ? 'border-white/5' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-lg">Q</span>
          </div>
          <span className={`font-bold tracking-tight ${
            theme === 'dark' ? 'text-white/90' : 'text-gray-900'
          }`}>Qelvin's Journey</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-white/10 text-white/60 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={onSkip}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
              theme === 'dark'
                ? 'text-white/60 hover:text-white hover:bg-white/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Skip to Portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-2xl w-full">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 ${
            theme === 'dark'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Interactive 3D Experience
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'from-white via-white to-white/70'
                : 'from-gray-900 via-gray-800 to-gray-600'
            }`}>
              Qelvin's
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              Journey
            </span>
          </h1>

          <p className={`text-lg md:text-xl mb-4 max-w-md mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
          }`}>
            Embark on an interactive drive through my portfolio
          </p>

          {/* Checkpoint preview */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {CHECKPOINTS.map((cp, i) => (
              <div 
                key={cp.label}
                className="group relative flex flex-col items-center"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${cp.color} rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 hover:-translate-y-1`}>
                  <cp.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className={`absolute -bottom-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                  theme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                }`}>
                  {cp.label}
                </span>
                {i < CHECKPOINTS.length - 1 && (
                  <div className={`absolute left-full top-1/2 -translate-y-1/2 w-2 h-0.5 ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={onStart}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative inline-flex items-center justify-center gap-3 
                         bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500
                         text-white font-bold text-lg
                         px-10 py-4 rounded-2xl
                         transition-all duration-300 ease-out
                         shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]
                         hover:-translate-y-1"
            >
              <Play className={`w-5 h-5 transition-transform ${isHovered ? 'scale-110' : ''}`} fill="currentColor" />
              Start Journey
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={onSkip}
              className={`inline-flex items-center gap-2 px-6 py-4 rounded-2xl transition-all ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <SkipForward className="w-5 h-5" />
              View Profile
            </button>
          </div>

          {/* Controls info */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-white/5 border-white/5'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-emerald-100'
              }`}>
                <Gamepad2 className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div className="text-left">
                <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Controls</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>WASD / Arrows</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-white/5 border-white/5'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-amber-100'
              }`}>
                <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <div className="text-left">
                <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Auto-Drive</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>Sit back & relax</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 py-4 border-t ${
        theme === 'dark' ? 'border-white/5' : 'border-gray-200'
      }`}>
        <div className={`flex items-center justify-center gap-6 text-xs ${
          theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
        }`}>
          <span>Built with React</span>
          <span className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'}`} />
          <span>Three.js</span>
          <span className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'}`} />
          <span>Supabase</span>
        </div>
      </footer>
    </div>
  );
}

