export type Materiale = {
  nome: string;
  descrizione: string;
  formato: string;
  url: string;
  icona?: string;
};

export const materiali: Materiale[] = [
  {
    nome: 'Locandina 70x100',
    descrizione: 'Locandina grande formato per affissioni',
    formato: 'PDF',
    url: 'https://levelup-partyband.github.io/linktree-levelup/assets/resources/LEVELUP%20-%20Locandina%2070x100.pdf',
  },
  {
    nome: 'Locandina A4',
    descrizione: 'Locandina formato A4 per stampa e distribuzione',
    formato: 'PDF',
    url: 'https://levelup-partyband.github.io/linktree-levelup/assets/resources/LEVELUP%20-%20Locandina%20A4.pdf',
  },
  {
    nome: 'Stage Plan 2026',
    descrizione: 'Configurazione palco e layout tecnico',
    formato: 'PDF',
    url: 'https://levelup-partyband.github.io/linktree-levelup/assets/resources/Stage%20Plan%20-%20LEVEL%20UP%202026.pdf',
  },
  {
    nome: 'Logo trasparente',
    descrizione: 'Logo LEVEL UP su sfondo trasparente',
    formato: 'SVG',
    url: 'https://levelup-partyband.github.io/linktree-levelup/assets/img/logo-levelup-clear.svg',
  },
];
