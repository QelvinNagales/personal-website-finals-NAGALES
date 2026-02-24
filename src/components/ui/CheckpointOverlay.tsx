import type { Checkpoint } from '@/types/game';
import { X, ChevronRight } from 'lucide-react';

interface CheckpointOverlayProps {
  checkpoint: Checkpoint;
  onContinue: () => void;
  totalCheckpoints: number;
  currentIndex: number;
}

export function CheckpointOverlay({
  checkpoint,
  onContinue,
  totalCheckpoints,
  currentIndex,
}: CheckpointOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onContinue}
      />

      {/* Content card */}
      <div className="overlay-enter relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl border border-border">
        {/* ── Header band ───────────────────────────────────────────────── */}
        <div className="bg-primary/10 px-6 pt-6 pb-4 rounded-t-2xl border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{checkpoint.icon}</span>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Checkpoint {currentIndex}/{totalCheckpoints}
                </p>
                <h2 className="text-2xl font-extrabold text-foreground leading-tight">
                  {checkpoint.title}
                </h2>
                <p className="text-sm text-muted-foreground">{checkpoint.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onContinue}
              className="p-2 rounded-full hover:bg-muted transition-colors shrink-0 ml-2"
              aria-label="Continue journey"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-4">
          <h3 className="text-xl font-bold text-foreground">{checkpoint.content.heading}</h3>

          <div className="space-y-2">
            {checkpoint.content.paragraphs.map((p, i) => (
              <p key={i} className="text-foreground/80 leading-relaxed text-sm">
                {p}
              </p>
            ))}
          </div>

          {checkpoint.content.items && (
            <ul className="space-y-2 mt-2">
              {checkpoint.content.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/90 bg-muted/60 rounded-lg px-3 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onContinue}
            className="game-button-primary flex-1 flex items-center justify-center gap-2"
          >
            {currentIndex < totalCheckpoints ? 'Continue Driving' : '🏁 Finish Line!'}
            <ChevronRight className="w-5 h-5" />
          </button>

          {checkpoint.content.cta && (
            checkpoint.content.cta.action.startsWith('http') ? (
              <a
                href={checkpoint.content.cta.action}
                target="_blank"
                rel="noopener noreferrer"
                className="game-button-secondary flex-1 text-center"
              >
                {checkpoint.content.cta.label}
              </a>
            ) : (
              <button className="game-button-secondary flex-1">
                {checkpoint.content.cta.label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

