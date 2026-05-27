export type ServiceConfig = { code: string; image: string; rows: string[] };

export const serviceConfigs: ServiceConfig[] = [
  { code: 'CONFIG.01', image: 'stage-config-01.png', rows: ['Audio line array verticale (A2)', 'Luci regolari (L2)', 'Americana retro + totem frontali (S3)'] },
  { code: 'CONFIG.02', image: 'stage-config-02.png', rows: ['Audio line array verticale (A2)', 'Luci regolari (L2)', 'Americana frontale + elevatori posteriori (S2)'] },
  { code: 'CONFIG.03', image: 'stage-config-03.png', rows: ['Audio line array verticale (A2)', 'Luci regolari (L2)', 'Torre frontale + elevatori posteriori (S2)'] },
  { code: 'CONFIG.04', image: 'stage-config-04.png', rows: ['Audio line array appeso (A1)', 'Luci Plus (L1)', 'Struttura a 4 torri (S1)'] },
];
