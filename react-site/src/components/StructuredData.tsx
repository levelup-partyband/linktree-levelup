import { useEffect } from 'react';
import { eventi2025, eventi2026, upcoming } from '../data/events';

const SITE = 'https://levelup-partyband.github.io/linktree-levelup/';
const IMG = SITE + 'assets/img/live/show-hero.webp';

// dd/mm/yyyy -> yyyy-mm-dd (no Date() to avoid timezone date-shift)
const toISODate = (d: string) => {
  const [dd, mm, yyyy] = d.split('/');
  return `${yyyy}-${mm}-${dd}`;
};

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '');

/**
 * Injects schema.org JSON-LD (MusicGroup + upcoming MusicEvents) so the band
 * and its dates can surface as Google rich results. Renders nothing.
 */
export default function StructuredData() {
  useEffect(() => {
    const band = {
      '@type': 'MusicGroup',
      '@id': SITE + '#band',
      name: 'LEVEL UP',
      genre: ['Dance', 'Pop', 'Anni 90', 'Anni 2000'],
      description: "Discoteca live anni '90/2000: party band con medley no-stop in stile DJ set, luci e show.",
      url: SITE,
      image: IMG,
      sameAs: [
        'https://www.instagram.com/levelup.partyband',
        'https://m.me/levelup.partyband',
      ],
    };

    const events = upcoming([...eventi2026, ...eventi2025]).map(e => ({
      '@type': 'MusicEvent',
      name: `LEVEL UP — ${stripHtml(e.nome)}`,
      startDate: toISODate(e.data),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: e.luogo,
        ...(e.indirizzo ? { address: e.indirizzo } : {}),
      },
      performer: { '@id': SITE + '#band' },
      organizer: { '@id': SITE + '#band' },
      image: IMG,
      url: SITE + 'eventi',
    }));

    const data = { '@context': 'https://schema.org', '@graph': [band, ...events] };

    const ID = 'levelup-jsonld';
    document.getElementById(ID)?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = ID;
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => { document.getElementById(ID)?.remove(); };
  }, []);

  return null;
}
