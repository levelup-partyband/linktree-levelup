import { Event, parseItalianDate } from '../data/events';

interface EventCardProps {
  e: Event;
  past?: boolean;
  compact?: boolean;
}

export default function EventCard({ e, past = false, compact = false }: EventCardProps) {
  const d = parseItalianDate(e.data);
  const dd = String(d.getDate()).padStart(2, '0');
  const mese = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'][d.getMonth()];
  const giorno = ['DOM','LUN','MAR','MER','GIO','VEN','SAB'][d.getDay()];

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('LEVEL UP - ' + e.nome.replace(/<[^>]*>/g, ''))}&dates=${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${dd}/${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${dd}&location=${encodeURIComponent(e.luogo)}`;

  return (
    <div className={`card p-5 flex gap-4 items-start ${past ? 'opacity-60' : ''}`}>
      {/* DATE BADGE */}
      <div className="text-center shrink-0 w-20 py-3 rounded-xl bg-brand-pink/15 border border-brand-pink/30">
        <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{giorno}</div>
        <div className="font-display font-black text-4xl text-brand-pink leading-none">{dd}</div>
        <div className="text-[10px] uppercase tracking-widest text-white/70 mt-1">{mese}</div>
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div className="font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: e.nome }} />
        <div className="text-sm text-white/60 mt-1">{e.luogo}</div>

        {!compact && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {e.indirizzoLink && (
              <a href={e.indirizzoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/15 hover:border-brand-pink hover:text-brand-pink transition-colors">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Mappa
              </a>
            )}
            {e.link && (() => {
              const isIG = e.link.includes('instagram.com');
              const isFB = e.link.includes('facebook.com') || e.link.includes('fb.com');
              const label = isIG ? 'Instagram' : isFB ? 'Facebook' : 'Link';
              const icon = isIG
                ? <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2C5.61 4 4 5.61 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8c1.99 0 3.6-1.61 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10A5 5 0 0112 7zm0 2a3 3 0 100 6 3 3 0 000-6z"/>
                : <path d="M12 2.04c-5.51 0-9.96 4.45-9.96 9.96s4.45 9.96 9.96 9.96 9.96-4.45 9.96-9.96S17.51 2.04 12 2.04zm2 14.45h-4v-2h4v2zm0-4h-4V6.5h4v6z"/>;
              return (
                <a href={e.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/15 hover:border-brand-pink hover:text-brand-pink transition-colors">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">{icon}</svg>
                  {label}
                </a>
              );
            })()}
            {!past && (
              <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/15 hover:border-brand-pink hover:text-brand-pink transition-colors">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
                Aggiungi al calendario
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
