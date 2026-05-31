import type { Selection } from '../hooks/useQuoteCalculator';

export type EventForm = {
  name: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  email: string;
};

export type QuoteRow = {
  name: string;
  sub?: string;
  qty: number;
  total: number;
  unit: number;
  hasQty: boolean;
  cat?: string;
};

export const fmt = (n: number) => `€ ${n.toFixed(2).replace('.', ',')}`;

/** Flatten band base + selection into ordered rows used by PDF and WhatsApp text. */
export function buildQuoteRows(selection: Selection, bandPrice: number): QuoteRow[] {
  return [
    { name: 'Band – 6 elementi', sub: 'Costo base', qty: 1, total: bandPrice, unit: bandPrice, hasQty: false, cat: 'BASE' },
    ...Object.values(selection).map(s => ({
      name: s.item.shortName || s.item.name,
      sub: s.item.shortName ? s.item.name : undefined,
      qty: s.qty,
      total: s.item.cost * s.qty,
      unit: s.item.cost,
      hasQty: s.item.hasQuantity,
      cat: s.category,
    })),
  ];
}

function formatEventDate(form: EventForm): string {
  if (!form.dateStart) return '';
  const ds = new Date(form.dateStart).toLocaleDateString('it-IT');
  const isRange = form.dateEnd && form.dateEnd > form.dateStart;
  if (isRange) return `dal ${ds} al ${new Date(form.dateEnd).toLocaleDateString('it-IT')}`;
  return ds;
}

/**
 * Build a plain-text quote message for WhatsApp. Event fields are optional —
 * only the lines that have data are included.
 */
export function buildWhatsAppText(
  form: EventForm,
  rows: QuoteRow[],
  totals: { subtotal: number; total: number; discount: number },
): string {
  const lines: string[] = ['Ciao LEVEL UP! 🎶 Vorrei un preventivo per la mia serata.', ''];

  if (form.name)     lines.push(`📅 Evento: ${form.name}`);
  if (form.location) lines.push(`📍 Luogo: ${form.location}`);
  const when = formatEventDate(form);
  if (when)          lines.push(`🗓 Data: ${when}`);
  if (form.email)    lines.push(`✉️ Email: ${form.email}`);
  if (lines.length > 2) lines.push('');

  lines.push('— CONFIGURAZIONE —');
  rows.forEach(r => {
    const qty = r.hasQty && r.qty > 1 ? ` ×${r.qty}` : '';
    const cat = r.cat && r.cat !== 'BASE' ? ` (${r.cat})` : '';
    lines.push(`• ${r.name}${qty}${cat}: ${fmt(r.total)}`);
  });
  lines.push('');

  if (totals.discount > 0) {
    lines.push(`Subtotale: ${fmt(totals.subtotal)}`);
    lines.push(`Sconto: - ${fmt(totals.discount)}`);
  }
  lines.push(`💰 Totale stimato: ${fmt(totals.total)} (IVA escl.)`);

  return lines.join('\n');
}
