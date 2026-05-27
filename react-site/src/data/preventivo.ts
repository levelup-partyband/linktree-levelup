export type QuoteItem = { id: string; name: string; cost: number; hasQuantity: boolean; shortName?: string; description?: string; image?: string };
export type QuoteCategory = { name: string; isUnique: boolean; items: QuoteItem[] };

export const bandCost = { name: 'Band', cost: 1000 };

export const quoteCategories: QuoteCategory[] = [
  {
    name: 'SERVICE',
    isUnique: true,
    items: [
      {
        id: 's4',
        shortName: 'Situazione 1',
        name: 'Impianto audio line array verticale (A2) + Luci regolari (L2) + Americana retro e totem frontali (S3)',
        cost: 700,
        hasQuantity: false,
        image: '/assets/img/service/stage-config-01.png'
      },
      {
        id: 's3',
        shortName: 'Situazione 2',
        name: 'Impianto audio line array verticale (A2) + Luci regolari (L2) + Americana frontale ed elevatori posteriori (S2)',
        cost: 850,
        hasQuantity: false,
        image: '/assets/img/service/stage-config-02.png'
      },
      {
        id: 's2',
        shortName: 'Situazione 3',
        name: 'Impianto audio line array verticale (A2) + Luci regolari (L2) + Torre frontale ed elevatori posteriori (S2)',
        cost: 1100,
        hasQuantity: false,
        image: '/assets/img/service/stage-config-03.png'
      },
      {
        id: 's1',
        shortName: 'Situazione 4',
        name: 'Impianto audio line array appeso (A1) + Luci plus (L1) + Struttura a 4 torri (S1)',
        cost: 2000,
        hasQuantity: false,
        image: '/assets/img/service/stage-config-04.png'
      },
    ],
  },
  {
    name: 'LEDWALL',
    isUnique: true,
    items: [
      { id: 'l1', name: 'Ledwall 3x2', cost: 300, hasQuantity: false },
      { id: 'l2', name: 'Ledwall 4x2', cost: 400, hasQuantity: false },
      { id: 'l3', name: 'Ledwall 5x3', cost: 500, hasQuantity: false },
    ],
  },
  {
    name: 'EXTRA',
    isUnique: false,
    items: [
      { id: 'e1', name: 'Ballerine', cost: 100, hasQuantity: true },
      { id: 'e2', name: 'FX – Sparcular', cost: 50, hasQuantity: true },
      { id: 'e3', name: 'FX – Nebbia', cost: 50, hasQuantity: true },
      { id: 'e4', name: 'FX – Geyser', cost: 50, hasQuantity: true },
    ],
  },
];
