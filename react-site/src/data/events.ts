// ────────────────────────────────────────────────────────────────────────
// Per aggiungere/modificare/rimuovere eventi basta editare il file JSON:
//   src/data/events.json
// Ogni evento: { nome, data (gg/mm/aaaa), luogo, [indirizzo], [indirizzoLink], [link] }
// Questo file espone i dati con tipi + funzioni di utilità; non va toccato
// per le normali modifiche al calendario.
// ────────────────────────────────────────────────────────────────────────
import eventsData from './events.json';

export type Event = {
  nome: string;
  data: string; // dd/mm/yyyy
  luogo: string;
  link?: string;
  indirizzo?: string;
  indirizzoLink?: string;
};

const data = eventsData as Record<string, Event[]>;

export const eventi2026: Event[] = data['2026'] ?? [];
export const eventi2025: Event[] = data['2025'] ?? [];
export const eventi2024: Event[] = data['2024'] ?? [];

export function parseItalianDate(d: string): Date {
  const [dd, mm, yyyy] = d.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export function upcoming(all: Event[]): Event[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return all
    .filter(e => parseItalianDate(e.data) >= now)
    .sort((a, b) => parseItalianDate(a.data).getTime() - parseItalianDate(b.data).getTime());
}
