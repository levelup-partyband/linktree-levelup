// Schema-driven wedding briefing form. A single definition drives BOTH the
// on-screen form (WeddingBrief.tsx) and the generated PDF (weddingBriefPdf.ts),
// so adding or removing a question only means editing this file.

export type WBFieldType =
  | 'text' | 'textarea' | 'date' | 'time' | 'number' | 'tel' | 'email'
  | 'select' | 'checkbox' | 'multi';

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

export type WBForm = Record<string, string | string[] | boolean>;

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
    title: 'Programma della giornata',
    hint: 'Indica gli orari indicativi: aiutano a costruire la scaletta e le pause.',
    fields: [
      { key: 'oraArrivoBand', label: 'Arrivo / soundcheck band', type: 'time' },
      { key: 'oraCerimonia', label: 'Cerimonia', type: 'time' },
      { key: 'oraAperitivo', label: 'Aperitivo', type: 'time' },
      { key: 'oraCena', label: 'Cena', type: 'time' },
      { key: 'oraIngressoSposi', label: 'Ingresso sposi', type: 'time' },
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
];

/** Whether a field should be shown given the current form state (showIf rule). */
export function isWBFieldVisible(field: WBField, form: WBForm): boolean {
  if (!field.showIf) return true;
  return form[field.showIf.key] === field.showIf.equals;
}

/** Build an empty form with the right default per field type. */
export function emptyWBForm(): WBForm {
  const f: WBForm = {};
  WB_SECTIONS.forEach(s => s.fields.forEach(fl => {
    f[fl.key] = fl.type === 'multi' ? [] : fl.type === 'checkbox' ? false : '';
  }));
  return f;
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
