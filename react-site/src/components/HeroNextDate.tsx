import { useNavigate } from 'react-router-dom';
import { eventi2025, eventi2026, parseItalianDate, upcoming } from '../data/events';

const GIORNI = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
const MESI = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '');

/** Live pill in the hero showing the next upcoming gig with a countdown. */
export default function HeroNextDate() {
  const navigate = useNavigate();
  const next = upcoming([...eventi2026, ...eventi2025])[0];
  if (!next) return null;

  const d = parseItalianDate(next.data);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  const when = `${GIORNI[d.getDay()]} ${String(d.getDate()).padStart(2, '0')} ${MESI[d.getMonth()]}`;
  const countdown = days <= 0 ? 'oggi' : days === 1 ? 'domani' : `tra ${days} giorni`;

  return (
    <button
      onClick={() => navigate('/eventi')}
      className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-brand-pink/40 hover:border-brand-pink hover:bg-brand-pink/10 transition-all text-sm"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-pink" />
      </span>
      <span className="text-white/70">Prossima data</span>
      <span className="font-semibold text-white">{when}</span>
      <span className="hidden sm:inline text-white/60 truncate max-w-[160px]">· {stripHtml(next.nome)}</span>
      <span className="text-brand-pink font-semibold whitespace-nowrap">· {countdown}</span>
      <span className="text-brand-pink group-hover:translate-x-0.5 transition-transform">→</span>
    </button>
  );
}
