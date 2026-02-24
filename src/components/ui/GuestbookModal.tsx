import { useState, useEffect } from 'react';
import { Star, Send, Loader2, ChevronRight, Users } from 'lucide-react';
import { fetchGuestbook, insertGuestbook } from '@/lib/supabase';
import type { GuestbookEntry } from '@/lib/supabase';

interface GuestbookModalProps {
  onDone: () => void;
}

export function GuestbookModal({ onDone }: GuestbookModalProps) {
  const [rating, setRating]       = useState(0);
  const [hoveredRating, setHover] = useState(0);
  const [name, setName]           = useState('');
  const [comment, setComment]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [entries, setEntries]     = useState<GuestbookEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Load existing guestbook entries
  useEffect(() => {
    setLoadingEntries(true);
    fetchGuestbook().then(data => {
      setEntries(data);
      setLoadingEntries(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !name.trim() || !comment.trim()) return;

    setSubmitting(true);
    const newEntry = await insertGuestbook({
      name: name.trim(),
      comment: comment.trim(),
      rating,
    });
    setSubmitting(false);

    if (newEntry) {
      setSubmitted(true);
      // Optimistically prepend the new entry
      setEntries(prev => [newEntry, ...prev]);
    }
  };

  const ratingLabels = ['', 'Needs work', 'OK driver', 'Decent ride', 'Great driver!', 'Top driver! 🏆'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="overlay-enter relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-card shadow-2xl border border-border">

        {/* ── Trophy header ──────────────────────────────────────────────── */}
        <div className="text-center pt-8 pb-4 px-6">
          <div className="text-6xl mb-3 animate-bounce">🏁</div>
          <h2 className="text-3xl font-extrabold text-foreground">Journey Complete!</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            You've driven through Qelvin's full story. How was the ride?
          </p>
        </div>

        {/* ── Rate the Driver form ────────────────────────────────────────── */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="px-6 pb-4 space-y-5">
            {/* Grab-style star rating */}
            <div className="bg-muted/50 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold text-foreground mb-1">Rate the Driver</p>
              <p className="text-xs text-muted-foreground mb-4">
                How would you rate Qelvin's portfolio journey?
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-3 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-all duration-150 focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-100 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400 scale-110'
                          : 'text-muted-foreground/30 scale-100'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating label */}
              <p className={`text-sm font-bold transition-all duration-200 h-5 ${(hoveredRating || rating) > 0 ? 'text-primary' : 'text-transparent'}`}>
                {ratingLabels[hoveredRating || rating]}
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Your Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Maria Santos"
                maxLength={50}
                required
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Leave a comment <span className="text-destructive">*</span>
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="How was the journey? What did you think of Qelvin's portfolio?"
                maxLength={300}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{comment.length}/300</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || rating === 0 || !name.trim() || !comment.trim()}
              className="game-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
              ) : (
                <><Send className="w-5 h-5" /> Submit Rating</>
              )}
            </button>
          </form>
        ) : (
          /* ── Thank you state ─────────────────────────────────────────── */
          <div className="px-6 pb-4 text-center space-y-4">
            <div className="text-5xl">🙏</div>
            <h3 className="text-xl font-bold text-foreground">Thanks, {name}!</h3>
            <p className="text-sm text-muted-foreground">
              Your rating has been saved. Qelvin appreciates the feedback!
            </p>
            <div className="flex gap-1 justify-center">
              {Array.from({ length: rating }, (_, i) => (
                <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        )}

        {/* ── Recent ratings ────────────────────────────────────────────── */}
        {(submitted || !submitting) && (
          <div className="px-6 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-bold text-foreground">Recent Riders</h4>
            </div>

            {loadingEntries ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : entries.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3">
                No ratings yet — be the first!
              </p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {entries.slice(0, 8).map(entry => (
                  <div
                    key={entry.id}
                    className="bg-muted/50 rounded-xl px-3 py-2 flex gap-3"
                  >
                    {/* Avatar initials */}
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {entry.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">{entry.name}</span>
                        <div className="flex gap-0.5 shrink-0">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${i < entry.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 break-words">{entry.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── View Profile button ────────────────────────────────────────── */}
        <div className="px-6 pb-8">
          <button
            onClick={onDone}
            className="game-button-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent"
          >
            View Full Profile
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
