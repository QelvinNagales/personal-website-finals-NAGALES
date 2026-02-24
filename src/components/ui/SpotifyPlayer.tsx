import { useState, useEffect, useCallback } from 'react';
import {
  SkipBack,
  SkipForward,
  ExternalLink,
  Music2,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface SpotifyMeta {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  spotifyUrl: string;
  duration: number;
  type: 'track' | 'album';
}

interface SpotifyPlayerProps {
  /** Array of Spotify embed URLs (track or album) */
  trackIds: string[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Turn an embed URL → a clean embed src with theme=0 for dark mode */
const toEmbedSrc = (url: string): string => {
  // Already an embed url
  if (url.includes('/embed/')) {
    const base = url.split('?')[0];
    return `${base}?utm_source=generator&theme=0`;
  }
  // open.spotify.com/track/... → embed
  const match = url.match(/open\.spotify\.com\/(track|album)\/([a-zA-Z0-9]+)/);
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
  }
  return url;
};

/** Extract type + ID from a Spotify URL */
const parseSpotifyUrl = (
  url: string,
): { type: 'track' | 'album'; id: string } | null => {
  const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
  if (trackMatch) return { type: 'track', id: trackMatch[1] };
  const albumMatch = url.match(/album\/([a-zA-Z0-9]+)/);
  if (albumMatch) return { type: 'album', id: albumMatch[1] };
  return null;
};

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000';

// ── Component ────────────────────────────────────────────────────────────────

export function SpotifyPlayer({
  trackIds,
  currentIndex,
  onPrevious,
  onNext,
}: SpotifyPlayerProps) {
  const [meta, setMeta] = useState<SpotifyMeta[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  const currentUrl = trackIds[currentIndex];
  const currentMeta = meta[currentIndex] ?? null;
  const embedSrc = toEmbedSrc(currentUrl);

  // ── Fetch metadata from backend (enrichment only — playback is via iframe)
  const fetchMeta = useCallback(async () => {
    try {
      setMetaLoading(true);
      const urls = trackIds.join(',');
      const res = await fetch(`${API_BASE}/spotify/resolve?urls=${encodeURIComponent(urls)}`);
      if (res.ok) {
        setMeta(await res.json());
      }
    } catch {
      // Metadata is optional — iframe still works
    } finally {
      setMetaLoading(false);
    }
  }, [trackIds]);

  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  // ── Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrevious, onNext]);

  return (
    <div className="relative h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black overflow-hidden flex flex-col">
      {/* ── Blurred album art backdrop ── */}
      {currentMeta?.albumArt && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-125 pointer-events-none"
          style={{ backgroundImage: `url(${currentMeta.albumArt})` }}
        />
      )}

      {/* ── Top bar: metadata ── */}
      <div className="relative z-10 flex items-center gap-4 p-4 pb-2">
        {/* Album art thumbnail */}
        {currentMeta?.albumArt ? (
          <img
            src={currentMeta.albumArt}
            alt={currentMeta.album}
            className="w-14 h-14 rounded-lg shadow-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <Music2 className="w-6 h-6 text-white/40" />
          </div>
        )}

        {/* Track info */}
        <div className="min-w-0 flex-1">
          {metaLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-36 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            </div>
          ) : currentMeta ? (
            <>
              <h3 className="text-white font-semibold text-base truncate">
                {currentMeta.name}
              </h3>
              <p className="text-white/60 text-sm truncate">{currentMeta.artist}</p>
            </>
          ) : (
            <h3 className="text-white/60 text-sm">Song {currentIndex + 1}</h3>
          )}
        </div>

        {/* Open in Spotify */}
        {currentMeta?.spotifyUrl && (
          <a
            href={currentMeta.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-medium transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Spotify
          </a>
        )}
      </div>

      {/* ── Spotify Embed (iframe — full playback, no auth needed) ── */}
      <div className="relative z-10 flex-1 px-4 pb-2">
        <iframe
          key={embedSrc}
          src={embedSrc}
          className="w-full h-full rounded-xl"
          style={{ borderRadius: '12px', minHeight: '152px' }}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      {/* ── Navigation controls ── */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <button
          onClick={onPrevious}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous track"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <span className="text-white/40 text-sm font-mono">
          {currentIndex + 1} / {trackIds.length}
        </span>

        <button
          onClick={onNext}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next track"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
