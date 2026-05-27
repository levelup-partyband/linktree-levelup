import { useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import EventCard from '../components/EventCard';
import { eventi2024, eventi2025, eventi2026, parseItalianDate, upcoming } from '../data/events';

export default function Eventi() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const futuri = upcoming([...eventi2026, ...eventi2025]);
  const passati2025 = eventi2025.filter(e => parseItalianDate(e.data) < new Date()).sort((a,b) => parseItalianDate(b.data).getTime() - parseItalianDate(a.data).getTime());
  const passati2024 = [...eventi2024].sort((a,b) => parseItalianDate(b.data).getTime() - parseItalianDate(a.data).getTime());

  return (
    <div className="container-x py-16">
      <SectionHeading kicker="Date" title="Eventi" sub="Tutti i live LEVEL UP — prossimi, recenti, archivio." />

      <div className="mb-12">
        <h3 className="font-display text-2xl text-brand-pink mb-4 tracking-widest">PROSSIMI EVENTI</h3>
        {futuri.length === 0 ? (
          <p className="text-white/60">Nessun evento futuro programmato al momento.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {futuri.map(e => <EventCard key={e.nome + e.data} e={e} />)}
          </div>
        )}
      </div>

      {passati2025.length > 0 && (
        <div className="mb-12">
          <h3 className="font-display text-2xl text-white/70 mb-4 tracking-widest">ARCHIVIO 2025</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {passati2025.map(e => <EventCard key={e.nome + e.data} e={e} past />)}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-display text-2xl text-white/70 mb-4 tracking-widest">ARCHIVIO 2024</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {passati2024.map(e => <EventCard key={e.nome + e.data} e={e} past />)}
        </div>
      </div>
    </div>
  );
}
