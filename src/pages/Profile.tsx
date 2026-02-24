import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Github, Linkedin, Twitter, Mail, ExternalLink,
  Code2, Server, Database, Palette, Loader2,
  Star, Send, Users, ArrowLeft,
  Instagram, Moon, Sun, ChevronLeft, ChevronRight, X, BookOpen,
} from 'lucide-react';
import { fetchGuestbook, insertGuestbook, getStorageUrl } from '@/lib/supabase';
import type { GuestbookEntry } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { SpotifyPlayer } from '@/components/ui/SpotifyPlayer';

// ── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = [
  { category: 'Frontend', icon: <Code2 className="w-5 h-5" />, color: 'bg-blue-500/10 text-blue-600', items: ['React', 'Vue.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Next.js'] },
  { category: 'Backend', icon: <Server className="w-5 h-5" />, color: 'bg-green-500/10 text-green-600', items: ['Node.js', 'NestJS', 'Flask', 'REST APIs', 'Python', 'Express'] },
  { category: 'Database', icon: <Database className="w-5 h-5" />, color: 'bg-purple-500/10 text-purple-600', items: ['Supabase', 'PostgreSQL', 'MySQL', 'Redis', 'Prisma'] },
  { category: 'Design & Tools', icon: <Palette className="w-5 h-5" />, color: 'bg-emerald-500/10 text-emerald-600', items: ['Figma', 'Git', 'Docker', 'Vercel', 'Render', 'Linux'] },
];

const PROJECTS = [
  {
    title: 'SOAR SHIRT MERCHANDISE',
    description: 'A custom merchandise store for the SOAR OFFICERS.',
    tags: ['React', 'Three.js', 'Supabase', 'TypeScript'],
    emoji: '👕',
    color: 'from-blue-500 to-cyan-900',
    href: 'https://soar-shirt-shop.vercel.app/',
    image: 'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/PROJECTS/SOAR-SHIRT.png', // Upload to billboard bucket
  },
  {
    title: 'APC BAND TICKETING WEBSITE',
    description: 'Ticketing platform for APC BAND events, featuring dynamic seat selection and Stripe integration for payments.',
    tags: ['React', 'TypeScript', 'Supabase', 'Email.js', 'Gcash'],
    emoji: '🛒',
    color: 'from-yellow-500 to-gold-600',
    href: 'https://apcband.vercel.app/',
    image: 'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/PROJECTS/APC%20BAND.png', // Upload to billboard bucket
  },
  {
    title: 'Horn-In',
    description: 'Interactive LinkedIn / PBL Grouper for APC student.',
    tags: ['React', 'Flutter', 'Dart', 'Supabase', 'Beautiful UI/UX'],
    emoji: '📊',
    color: 'from-emerald-500 to-green-600',
    href: 'https://github.com/QelvinNagales/MOBPROGFINALS',
    image: 'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/PROJECTS/HORN%20-%20IN.jpg', // Upload to billboard bucket
  },
  {
    title: 'City Library Archives',
    description: 'A digital archive for the city library, allowing users to browse and search through historical documents and media.',
    tags: ['React Native', 'Supabase', 'Expo', 'Maps'],
    emoji: '📚',
    color: 'from-pink-500 to-rose-600',
    href: 'https://city-archive.vercel.app/',
    image: 'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/PROJECTS/City-archives.png', // Upload to billboard bucket
  },
  {
    title: 'digitalscrapbook',
    description: 'A digital scrapbook for personal memories and experiences.',
    tags: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    emoji: '🧐',
    color: 'from-purple-500 to-indigo-600',
    href: 'https://digitalscrapbook.vercel.app/',
    image: 'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/PROJECTS/digitalscrapbook.png', // Upload to billboard bucket
  },
];

const HOBBIES = [
  { emoji: '💵', label: 'Shopping', desc: 'Buying Things That I don\'t need' },
  { emoji: '📷', label: 'Photography / Documenting', desc: 'Feeling the moment' },
  { emoji: '🎮', label: 'Gaming', desc: 'FPS, MOBA, Open-world RPGs' },
  { emoji: '🏋️', label: 'Fitness', desc: 'Running when life is running me down' },
  { emoji: '📚', label: 'Reading', desc: 'Tech, psychology, self-help, & design books' },
  { emoji: '🎵', label: 'Music', desc: 'R&B, Pop, and Indie Rock' },
];

const GALLERY_THEMES = [
  {
    id: 'orgs',
    label: 'Orgs',
    emoji: '🏢',
    color: 'from-blue-500 to-cyan-600',
    images: [
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ORGS/MSC.png',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ORGS/SOAR(WHITE).png',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ORGS/Band.png',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ORGS/JPCS.png',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ORGS/JISSA.png',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ORGS/GG.png',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ORGS/BRIDGE.png',
    ],
  },
  {
    id: 'friends',
    label: 'Friends',
    emoji: '👫',
    color: 'from-yellow-500 to-orange-600',
    images: [
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(1).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(10).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(2).jpg  ',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(3).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(4).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(5).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(6).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(7).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(8).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/FRIENDS/img%20(9).jpg',
    ],
  },
  {
    id: 'Random',
    label: 'Random',
    emoji: '😃',
    color: 'from-emerald-500 to-green-600',
    images: [
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(28).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(1).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(1).mp4',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(2).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(2).mp4',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(3).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(3).mp4',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(4).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(5).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(6).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(7).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(8).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/RANDOM/Random%20(9).jpg',
    ],
  },
  {
    id: 'Me',
    label: 'Me',
    emoji: '👨‍💻',
    color: 'from-purple-500 to-indigo-600',
    images: [
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/pagod.jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/Kalbo.png',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/kanta.jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/kanta2.jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/Selfie.jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/Magazine.png',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/Selfie2.jpg',
    ],
  },
  {
    id: 'songs',
    label: 'Songs',
    emoji: '🎵',
    color: 'from-pink-500 to-rose-600',
    images: [
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/VINYL.svg',
      'https://open.spotify.com/embed/track/08PdFBcXzpkn1cWNgmKqhn?utm_source=generator',
      'https://open.spotify.com/embed/track/0OzQ6q4AErZG5kJGA3wbcN?utm_source=generator',
      'https://open.spotify.com/embed/track/4cBm8rv2B5BJWU2pDaHVbF?utm_source=generator',
      'https://open.spotify.com/embed/track/410fyfFghBsxNu45LiNJ24?utm_source=generator',
      'https://open.spotify.com/embed/track/4FVZYiCvdLIX8NpcY0lzda?utm_source=generator',
      'https://open.spotify.com/embed/track/2LlOeW5rVcvl3QcPNPcDus?utm_source=generator',
      'https://open.spotify.com/embed/track/1CQ2cMfrmFM1YdfmjENKVE?utm_source=generator',
      'https://open.spotify.com/embed/track/3NxWJWftvkstyxvb1pZlFo?utm_source=generator',
      'https://open.spotify.com/embed/track/6U0D8PIh75fnX6T6TWJLxl?utm_source=generator',
    ],
  },
  {
    id: 'her',
    label: 'Her',
    emoji: '❤️',
    color: 'from-red-500 to-pink-600',
    images: [
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(20).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(21).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(22).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(23).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(24).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(25).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(26).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(27).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(29).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(30).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(31).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(32).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(33).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(34).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(35).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(36).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(37).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(38).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(39).jpg',
      'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/HER/her%20(40).jpg',
    ],
  },
];
// ── Component ─────────────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [entries, setEntries]           = useState<GuestbookEntry[]>([]);
  const [loadingEntries, setLoading]    = useState(true);
  const [rating, setRating]             = useState(0);
  const [hovered, setHovered]           = useState(0);
  const [name, setName]                 = useState('');
  const [comment, setComment]           = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<typeof GALLERY_THEMES[0] | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [avatarHovered, setAvatarHovered] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTheme) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedTheme]);

  useEffect(() => {
    fetchGuestbook().then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !name.trim() || !comment.trim()) return;
    setSubmitting(true);
    const entry = await insertGuestbook({ name: name.trim(), comment: comment.trim(), rating });
    setSubmitting(false);
    if (entry) {
      setSubmitted(true);
      setEntries(prev => [entry, ...prev]);
    }
  };

  const avgRating = entries.length
    ? entries.reduce((s, e) => s + e.rating, 0) / entries.length
    : 0;

  return (
    <>
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden page-enter">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Play Again
          </button>
          <span className="font-extrabold text-foreground tracking-tight">QELVINATOR</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/docs')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
              title="View Documentation"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Docs</span>
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
        <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div 
              className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden shadow-2xl border-4 border-primary/20 cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setAvatarHovered(true)}
              onMouseLeave={() => setAvatarHovered(false)}
            >
              <img 
                src={avatarHovered
                  ? 'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/yawn.jpg'
                  : (theme === 'light' 
                    ? 'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/Grad.png'
                    : 'https://xzxfpnwlswyeoqygjuuq.supabase.co/storage/v1/object/public/billboard/ME/Grad-pikit.png')
                } 
                alt="Qelvin"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
              Hi, I'm <span className="text-primary">Qelvin</span> 👋
            </h1>
            <p className="text-lg text-muted-foreground mb-1 font-medium">
              Full-Stack Developer · IT Student · Future Billionaire
            </p>
            <p className="text-muted-foreground text-sm mb-5 max-w-lg">
              I build fast, beautiful, and interactive web experiences. Currently in my 2nd year of IT studies,
              always shipping, always learning.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Github className="w-4 h-4" />, label: 'GitHub',   href: 'https://github.com/QelvinNagales' },
                { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/qdnagales/' },
                { icon: <Instagram className="w-4 h-4" />,  label: 'Instagram',  href: 'https://www.instagram.com/cupofjosze/' },
                { icon: <Mail className="w-4 h-4" />,     label: 'Email',    href: 'mailto:qdnagales@student.apc.edu.ph' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '2nd',   label: 'Year IT Student' },
            { value: '10+',   label: 'Organizations' },
            { value: '5+',    label: 'Repos' },
            { value: entries.length.toString(), label: 'Guestbook Entries' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-20">

        {/* ── Skills ────────────────────────────────────────────────────── */}
        <section id="skills">
          <SectionHeading emoji="🛠️" title="Skills & Technologies" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            {SKILLS.map(skill => (
              <div key={skill.category} className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-lg mb-4 ${skill.color}`}>
                  {skill.icon}
                  {skill.category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map(item => (
                    <span key={item} className="text-xs font-medium bg-muted px-2.5 py-1 rounded-lg text-foreground/80">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Projects ──────────────────────────────────────────────────── */}
        <section id="projects">
          <SectionHeading emoji="🚀" title="Featured Projects" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            {PROJECTS.map(project => (
              <a 
                key={project.title} 
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 group block"
              >
                {/* Project Image */}
                <div className="relative h-40 bg-muted overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Hide image on error and show gradient fallback
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`} />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{project.emoji}</span>
                      <h3 className="font-bold text-foreground">{project.title}</h3>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Hobbies ───────────────────────────────────────────────────── */}
        <section id="hobbies">
          <SectionHeading emoji="🎯" title="Hobbies & Interests" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            {HOBBIES.map(h => (
              <div key={h.label} className="rounded-2xl border border-border bg-card p-4 text-center hover:border-primary/40 transition-colors">
                <div className="text-3xl mb-2">{h.emoji}</div>
                <p className="font-bold text-sm text-foreground">{h.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* ── Gallery ─────────────────────────────────────────────────────── */}
        <section id="gallery">
          <SectionHeading emoji="🖼️" title="Gallery" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            {GALLERY_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setSelectedTheme(theme);
                  setCarouselIndex(0);
                }}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-border bg-card hover:border-primary/40 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Thumbnail image from first photo */}
                <img
                  src={theme.images[0]}
                  alt={theme.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-5xl mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">{theme.emoji}</span>
                  <span className="text-lg font-bold drop-shadow-lg">{theme.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <section id="contact">
          <SectionHeading emoji="📬" title="Contact Me" />
          <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center">
            <p className="text-lg font-bold text-foreground mb-2">Let's build something together 🚀</p>
            <p className="text-sm text-muted-foreground mb-6">
              Open to freelance, collaboration, or full-time opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="mailto:qelvinnagales@gmail.com" className="game-button-primary inline-flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" /> Email Me
              </a>
              <a href="https://www.linkedin.com/in/qdnagales/" target="_blank" rel="noreferrer" className="game-button-secondary inline-flex items-center gap-2 text-sm">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* ── Guestbook ─────────────────────────────────────────────────── */}
        <section id="guestbook">
          <div className="flex items-center justify-between mb-6">
            <SectionHeading emoji="📝" title="Guestbook" inline />
            {entries.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground">{avgRating.toFixed(1)}</span>
                <span>({entries.length})</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Write form */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Send className="w-4 h-4" /> Leave a Message
              </h3>

              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="text-4xl">🙏</div>
                  <p className="font-bold text-foreground">Thanks, {name}!</p>
                  <p className="text-sm text-muted-foreground">Your message has been saved.</p>
                  <div className="flex gap-1 justify-center">
                    {Array.from({ length: rating }, (_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Stars */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}>
                          <Star className={`w-7 h-7 transition-all ${s <= (hovered || rating) ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-muted-foreground/30'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" maxLength={50} required
                      className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Message</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Say something nice..." maxLength={300} required rows={3}
                      className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                  </div>

                  <button type="submit" disabled={submitting || rating === 0 || !name.trim() || !comment.trim()}
                    className="game-button-primary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</> : <><Send className="w-4 h-4" /> Post Message</>}
                  </button>
                </form>
              )}
            </div>

            {/* Entries list */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Recent Messages
              </h3>
              {loadingEntries ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : entries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No messages yet — be the first! 🎉</p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {entries.map(entry => (
                    <div key={entry.id} className="bg-muted/50 rounded-xl p-3 flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                        {entry.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground truncate">{entry.name}</span>
                          <div className="flex gap-0.5 shrink-0">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < entry.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 break-words">{entry.comment}</p>
                        {entry.created_at && (
                          <p className="text-xs text-muted-foreground/50 mt-1">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border mt-12 py-8 text-center text-sm text-muted-foreground">
        <p>Built by Qelvin with React · Three.js · NestJS · Supabase</p>
        <p className="mt-1 text-xs opacity-60">© {new Date().getFullYear()} Qelvin.dev — All rights reserved</p>
      </footer>
    </div>

    {/* Gallery Modal - Fixed fullscreen overlay */}
    {selectedTheme && (
      <div 
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        onClick={() => setSelectedTheme(null)}
      >
        <div 
          className="relative w-full max-w-4xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedTheme(null)}
            className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Theme title */}
          <div className="text-center mb-4">
            <span className="text-3xl mr-2">{selectedTheme.emoji}</span>
            <span className="text-2xl font-bold text-white">{selectedTheme.label}</span>
          </div>

          {/* Carousel */}
          <div className={`relative ${selectedTheme.id === 'songs' ? 'aspect-[4/3]' : 'aspect-video'} bg-black rounded-2xl overflow-hidden`}>
            {selectedTheme.id === 'songs' ? (
              <SpotifyPlayer
                trackIds={selectedTheme.images}
                currentIndex={carouselIndex}
                onPrevious={() => setCarouselIndex((prev) => 
                  prev === 0 ? selectedTheme.images.length - 1 : prev - 1
                )}
                onNext={() => setCarouselIndex((prev) => 
                  prev === selectedTheme.images.length - 1 ? 0 : prev + 1
                )}
              />
            ) : selectedTheme.images[carouselIndex].match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <video
                key={selectedTheme.images[carouselIndex]}
                src={selectedTheme.images[carouselIndex]}
                className="w-full h-full object-contain"
                controls
                autoPlay
                loop
                muted
              />
            ) : (
              <img
                key={selectedTheme.images[carouselIndex]}
                src={selectedTheme.images[carouselIndex]}
                alt={`${selectedTheme.label} ${carouselIndex + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', selectedTheme.images[carouselIndex]);
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a2e/ffffff?text=Image+Not+Found`;
                }}
              />
            )}
            
            {/* Previous button - hidden for songs (SpotifyPlayer has own controls) */}
            {selectedTheme.id !== 'songs' && (
              <button
                onClick={() => setCarouselIndex((prev) => 
                  prev === 0 ? selectedTheme.images.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button - hidden for songs (SpotifyPlayer has own controls) */}
            {selectedTheme.id !== 'songs' && (
              <button
                onClick={() => setCarouselIndex((prev) => 
                  prev === selectedTheme.images.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Dots indicator - hidden for songs */}
          {selectedTheme.id !== 'songs' && (
            <div className="flex justify-center gap-2 mt-4">
              {selectedTheme.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${idx === carouselIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          )}

          {/* Counter */}
          <p className="text-center text-white/60 text-sm mt-2">
            {carouselIndex + 1} / {selectedTheme.images.length}
          </p>
        </div>
      </div>
    )}
    </>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────
function SectionHeading({ emoji, title, inline = false }: { emoji: string; title: string; inline?: boolean }) {
  if (inline) {
    return (
      <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h2>
    );
  }
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-2 mb-1">
        <span>{emoji}</span> {title}
      </h2>
      <div className="h-1 w-14 rounded-full bg-primary mt-2" />
    </div>
  );
}
