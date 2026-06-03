// Schema-driven wedding briefing form. A single definition drives BOTH the
// on-screen form (WeddingBrief.tsx) and the generated PDF (weddingBriefPdf.ts),
// so adding or removing a question only means editing this file.

export type WBFieldType =
  | 'text' | 'textarea' | 'date' | 'time' | 'number' | 'tel' | 'email'
  | 'select' | 'checkbox' | 'multi' | 'stations' | 'summary';

/** A single audio/light setup point during the event (price set in the summary). */
export type WBStation = { momento: string; strumentazione: string; note: string; prezzo: string; incluso: boolean };

/** A generic priced line (extra: mic, proiettori, ecc.). */
export type WBPricedItem = { voce: string; prezzo: string; incluso: boolean };

export type WBField = {
  key: string;
  label: string;
  type: WBFieldType;
  options?: string[];     // for select / multi
  placeholder?: string;
  full?: boolean;         // span full width in the form grid
  showIf?: { key: string; equals: string | boolean }; // conditional visibility
};

export type WBSection = { title: string; hint?: string; fields: WBField[] };

export type WBForm = Record<string, string | string[] | boolean | WBStation[] | WBPricedItem[]>;

export const WB_SECTIONS: WBSection[] = [
  {
    title: 'Gli sposi',
    fields: [
      { key: 'sposo1', label: 'Sposo / Sposa 1', type: 'text', placeholder: 'Nome e cognome' },
      { key: 'sposo2', label: 'Sposo / Sposa 2', type: 'text', placeholder: 'Nome e cognome' },
      { key: 'telefono', label: 'Telefono referente', type: 'tel' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'dataMatrimonio', label: 'Data del matrimonio', type: 'date' },
      { key: 'weddingPlanner', label: 'Wedding planner (nome + contatto)', type: 'text', full: true },
    ],
  },
  {
    title: 'Location & logistica',
    fields: [
      { key: 'luogoCerimonia', label: 'Luogo cerimonia', type: 'text' },
      { key: 'luogoRicevimento', label: 'Location ricevimento', type: 'text' },
      { key: 'indirizzoRicevimento', label: 'Indirizzo ricevimento', type: 'text', full: true },
      { key: 'ambiente', label: 'Ambiente palco', type: 'select', options: ['Interno', 'Esterno', 'Misto interno/esterno'] },
      { key: 'pianoB', label: 'Piano B in caso di maltempo', type: 'text', full: true },
      { key: 'corrente', label: 'Corrente disponibile (quadro / kW)', type: 'text' },
      { key: 'spazioPalco', label: 'Spazio per palco e band', type: 'text' },
      { key: 'limitiAcustici', label: 'Limiti acustici / orario stop musica', type: 'text' },
      { key: 'nInvitati', label: 'Numero invitati (circa)', type: 'number' },
      { key: 'etaOspiti', label: "Fascia d'età prevalente ospiti", type: 'text' },
    ],
  },
  {
    title: 'Postazioni & strumentazione',
    hint: 'Aggiungi una postazione per ogni punto del matrimonio (aperitivo, taglio torta, festa principale...) con la strumentazione necessaria.',
    fields: [
      { key: 'postazioni', label: 'Postazioni', type: 'stations', full: true },
    ],
  },
  {
    title: 'Programma della giornata',
    hint: 'Indica gli orari indicativi: aiutano a costruire la scaletta e le pause.',
    fields: [
      { key: 'oraArrivoBand', label: 'Arrivo / soundcheck band', type: 'time' },
      { key: 'oraCerimonia', label: 'Cerimonia', type: 'time' },
      { key: 'oraAperitivo', label: 'Aperitivo', type: 'time' },
      { key: 'oraCena', label: 'Cena', type: 'time' },
      { key: 'oraArrivoSposi', label: 'Arrivo sposi', type: 'time' },
      { key: 'oraIngressoSposi', label: 'Ingresso sposi (entrata in sala)', type: 'time' },
      { key: 'oraPrimoBallo', label: 'Primo ballo', type: 'time' },
      { key: 'oraTaglioTorta', label: 'Taglio torta', type: 'time' },
      { key: 'oraAperturaBalli', label: 'Apertura balli', type: 'time' },
      { key: 'oraFine', label: 'Fine servizio', type: 'time' },
    ],
  },
  {
    title: 'Momenti musicali',
    hint: 'Per ogni momento indica il brano desiderato (artista + titolo).',
    fields: [
      { key: 'musicaCerimonia', label: 'La band cura anche la musica della cerimonia', type: 'checkbox', full: true },
      { key: 'cerimoniaIngresso', label: 'Cerimonia — ingresso sposa', type: 'text', full: true, showIf: { key: 'musicaCerimonia', equals: true } },
      { key: 'cerimoniaFedi', label: 'Cerimonia — scambio fedi / promesse', type: 'text', full: true, showIf: { key: 'musicaCerimonia', equals: true } },
      { key: 'cerimoniaUscita', label: 'Cerimonia — uscita sposi', type: 'text', full: true, showIf: { key: 'musicaCerimonia', equals: true } },
      { key: 'ingressoRicevimento', label: 'Ingresso sposi al ricevimento', type: 'text', full: true },
      { key: 'primoBallo', label: 'Primo ballo degli sposi', type: 'text', full: true },
      { key: 'balloGenitori', label: 'Ballo con i genitori', type: 'text', full: true },
      { key: 'taglioTorta', label: 'Taglio della torta', type: 'text', full: true },
      { key: 'lancioBouquet', label: 'Lancio bouquet / giarrettiera', type: 'text', full: true },
      { key: 'aperturaBalli', label: 'Apertura balli (prima canzone)', type: 'text', full: true },
    ],
  },
  {
    title: 'Gusti musicali',
    fields: [
      { key: 'generi', label: 'Generi graditi', type: 'multi', full: true,
        options: ["Anni '80", "Anni '90", 'Anni 2000', 'Italiana', 'Pop internazionale', 'Dance / EDM', 'Latino / Reggaeton', 'Rock', 'Revival / Disco', 'Lenti / Romantiche', 'Hit di oggi'] },
      { key: 'linguaBrani', label: 'Lingua dei brani', type: 'select', options: ['Mix bilanciato', 'Prevalentemente italiana', 'Prevalentemente internazionale'] },
      { key: 'richiesteOspiti', label: 'Richieste dagli ospiti durante la serata', type: 'select', options: ['Sì, ben accette', 'No', 'Da concordare'] },
      { key: 'mustPlay', label: 'Canzoni assolutamente da suonare (must-play)', type: 'textarea', full: true },
      { key: 'doNotPlay', label: 'Canzoni / generi da NON suonare', type: 'textarea', full: true },
      { key: 'atmosfera', label: 'Atmosfera desiderata (es. festa scatenata, elegante, intima...)', type: 'textarea', full: true },
    ],
  },
  {
    title: 'Tecnica & collaborazioni',
    fields: [
      { key: 'djSet', label: 'DJ set in alternanza alla band', type: 'checkbox' },
      { key: 'microfonoDiscorsi', label: 'Microfono per discorsi / brindisi', type: 'checkbox' },
      { key: 'altriFornitori', label: 'Foto / video / altri fornitori (referenti)', type: 'text', full: true },
      { key: 'sorprese', label: 'Sorprese o dediche da preparare', type: 'textarea', full: true },
      { key: 'note', label: 'Note libere', type: 'textarea', full: true },
    ],
  },
  {
    title: 'Riepilogo & prezzi',
    hint: 'Assegna un prezzo alle voci. Marca "Incluso" ciò che è compreso nel pacchetto: viene mostrato come valore omaggio (barrato) e non sommato.',
    fields: [
      { key: 'riepilogo', label: 'Riepilogo', type: 'summary', full: true },
    ],
  },
];

/** Whether a field should be shown given the current form state (showIf rule). */
export function isWBFieldVisible(field: WBField, form: WBForm): boolean {
  if (!field.showIf) return true;
  return form[field.showIf.key] === field.showIf.equals;
}

/** Start with a single empty station; the user adds more as needed. */
export function defaultStations(): WBStation[] {
  return [{ momento: '', strumentazione: '', note: '', prezzo: '', incluso: false }];
}

/** Build an empty form with the right default per field type. */
export function emptyWBForm(): WBForm {
  const f: WBForm = {};
  WB_SECTIONS.forEach(s => s.fields.forEach(fl => {
    f[fl.key] =
      fl.type === 'stations' ? defaultStations()
      : fl.type === 'multi' ? []
      : fl.type === 'checkbox' ? false
      : '';
  }));
  // Pricing keys used by the summary (not plain schema fields)
  f.bandPrezzo = '';
  f.bandIncluso = false;
  f.extra = [] as WBPricedItem[];
  f.sconto = '';
  return f;
}

/** Parse a price string ("1.200,50" / "1200.5") into a number, 0 if invalid. */
export const wbNum = (s: unknown): number => {
  const n = parseFloat(String(s ?? '').replace(/\./g, '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
};

export type WBTotals = { band: number; postazioni: number; extra: number; subtotal: number; sconto: number; total: number };

/** Compute the price summary. Items marked "incluso" are not summed. */
export function computeWBTotals(form: WBForm): WBTotals {
  const band = form.bandIncluso ? 0 : wbNum(form.bandPrezzo);
  const postazioni = ((form.postazioni as WBStation[]) || [])
    .reduce((s, st) => s + (st.incluso ? 0 : wbNum(st.prezzo)), 0);
  const extra = ((form.extra as WBPricedItem[]) || [])
    .reduce((s, e) => s + (e.incluso ? 0 : wbNum(e.prezzo)), 0);
  const subtotal = band + postazioni + extra;
  const sconto = wbNum(form.sconto);
  return { band, postazioni, extra, subtotal, sconto, total: Math.max(0, subtotal - sconto) };
}

/** Human-readable value for PDF / display. Empty → "—". */
export function formatWBValue(field: WBField, value: WBForm[string] | undefined): string {
  if (field.type === 'checkbox') return value ? 'Sì' : 'No';
  if (field.type === 'multi') {
    const a = (value as string[]) || [];
    return a.length ? a.join(', ') : '—';
  }
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return '—';
  if (field.type === 'date') {
    const d = new Date(s);
    return isNaN(+d) ? s : d.toLocaleDateString('it-IT');
  }
  return s;
}
