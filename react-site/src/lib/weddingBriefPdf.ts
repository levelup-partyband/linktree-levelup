import jsPDF from 'jspdf';
import { WB_SECTIONS, formatWBValue, isWBFieldVisible, computeWBTotals, wbNum, type WBForm, type WBStation, type WBPricedItem } from '../data/weddingBrief';
import { fmt } from './quote';

type Assets = { fonts: { regular: string; bold: string } | null; logo: string | null };

const PINK: [number, number, number] = [236, 18, 137];
const NAVY: [number, number, number] = [13, 10, 42];
const DARK: [number, number, number] = [40, 40, 50];
const MUTED: [number, number, number] = [120, 120, 130];

/** Render and download the multi-page wedding briefing PDF. */
export function generateWeddingBriefPdf(form: WBForm, { fonts, logo }: Assets) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const PAGE_W = 210, PAGE_H = 297;
  const left = 18, right = PAGE_W - left;
  const contentW = right - left;
  const BOTTOM = PAGE_H - 16;

  const BF = 'CocomatPro';
  let useBrand = false;
  if (fonts) {
    try {
      doc.addFileToVFS('CocomatPro-Regular.ttf', fonts.regular);
      doc.addFont('CocomatPro-Regular.ttf', BF, 'normal');
      doc.addFileToVFS('CocomatPro-Bold.ttf', fonts.bold);
      doc.addFont('CocomatPro-Bold.ttf', BF, 'bold');
      useBrand = true;
    } catch { /* fall back to helvetica */ }
  }
  const FONT = useBrand ? BF : 'helvetica';

  let y = 0;

  const drawHeader = () => {
    doc.setFillColor(...NAVY); doc.rect(0, 0, PAGE_W, 34, 'F');
    doc.setFillColor(...PINK); doc.rect(0, 34, PAGE_W, 1.2, 'F');
    if (logo) { try { doc.addImage(logo, 'PNG', left, 7, 20, 20); } catch { /* ignore */ } }
    doc.setFont(FONT, 'bold'); doc.setFontSize(19); doc.setTextColor(255, 255, 255);
    doc.text('BRIEF MATRIMONIO', right, 16, { align: 'right' });
    doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor(...PINK);
    doc.text('LEVEL UP — Party Band', right, 22, { align: 'right' });
    doc.setTextColor(255, 255, 255); doc.setFontSize(7);
    doc.text('levelup.partyband  ·  +39 320 482 3399', right, 27, { align: 'right' });
    y = 44;
  };

  const ensure = (space: number) => {
    if (y + space > BOTTOM) { doc.addPage(); y = 20; }
  };

  drawHeader();

  // ===== Couple + date =====
  const c1 = (form.sposo1 as string) || '';
  const c2 = (form.sposo2 as string) || '';
  const couple = [c1, c2].filter(Boolean).join('   &   ') || 'Sposi';
  doc.setFont(FONT, 'bold'); doc.setFontSize(15); doc.setTextColor(...NAVY);
  doc.text(couple, left, y); y += 6;
  if (form.dataMatrimonio) {
    const dd = new Date(form.dataMatrimonio as string);
    if (!isNaN(+dd)) {
      const txt = dd.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      doc.setFont(FONT, 'normal'); doc.setFontSize(9.5); doc.setTextColor(...MUTED);
      doc.text(txt.charAt(0).toUpperCase() + txt.slice(1), left, y);
    }
  }
  y += 9;

  // ===== Sections =====
  WB_SECTIONS.forEach(section => {
    ensure(18);
    doc.setFillColor(...PINK); doc.roundedRect(left, y, contentW, 7, 1, 1, 'F');
    doc.setFont(FONT, 'bold'); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
    doc.text(section.title.toUpperCase(), left + 3, y + 4.8);
    y += 11;

    section.fields.forEach(field => {
      if (!isWBFieldVisible(field, form)) return;

      // Price summary: band + stations + extra, included items struck-through
      if (field.type === 'summary') {
        const groupLabel = (txt: string) => {
          ensure(7);
          doc.setFont(FONT, 'bold'); doc.setFontSize(7); doc.setTextColor(...PINK);
          doc.text(txt.toUpperCase(), left, y); y += 4.6;
        };
        const priceRow = (name: string, prezzo: string, incluso: boolean) => {
          ensure(6);
          const label = name + (incluso ? '  ·  incluso' : '');
          doc.setFont(FONT, 'normal'); doc.setFontSize(9);
          doc.setTextColor(...(incluso ? MUTED : DARK));
          doc.text(doc.splitTextToSize(label, contentW - 38)[0], left + 2, y);
          const amt = fmt(wbNum(prezzo));
          if (incluso) {
            doc.setTextColor(...MUTED);
            doc.text(amt, right, y, { align: 'right' });
            const w = doc.getTextWidth(amt);
            doc.setDrawColor(...MUTED); doc.setLineWidth(0.3);
            doc.line(right - w, y - 1.3, right, y - 1.3);
          } else {
            doc.setFont(FONT, 'bold'); doc.setTextColor(...NAVY);
            doc.text(amt, right, y, { align: 'right' });
          }
          y += 5.6;
        };

        const stations = (form.postazioni as WBStation[]) || [];
        const extra = (form.extra as WBPricedItem[]) || [];

        groupLabel('Band');
        priceRow('Band — LEVEL UP', form.bandPrezzo as string, form.bandIncluso as boolean);

        if (stations.length) {
          groupLabel('Postazioni');
          stations.forEach((st, i) => priceRow(`Postazione ${i + 1}${st.momento ? ' — ' + st.momento : ''}`, st.prezzo, st.incluso));
        }
        if (extra.length) {
          groupLabel('Extra');
          extra.forEach(e => priceRow(e.voce || 'Extra', e.prezzo, e.incluso));
        }

        const t = computeWBTotals(form);
        y += 1.5;
        doc.setDrawColor(...PINK); doc.setLineWidth(0.4); doc.line(left, y, right, y); y += 6;
        doc.setFont(FONT, 'normal'); doc.setFontSize(9); doc.setTextColor(...MUTED);
        doc.text('Subtotale', left + 2, y); doc.text(fmt(t.subtotal), right, y, { align: 'right' }); y += 5;
        if (t.sconto > 0) {
          doc.setTextColor(34, 197, 94);
          doc.text('Sconto', left + 2, y); doc.text(`- ${fmt(t.sconto)}`, right, y, { align: 'right' }); y += 6;
        }
        ensure(16);
        doc.setFillColor(...PINK); doc.roundedRect(left, y, contentW, 14, 2, 2, 'F');
        doc.setFont(FONT, 'bold'); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
        doc.text('TOTALE', left + 4, y + 9);
        doc.setFontSize(16); doc.text(fmt(t.total), right - 4, y + 9.5, { align: 'right' });
        y += 18;
        return;
      }

      // Repeatable stations: each rendered as a pink sub-title + equipment + note
      if (field.type === 'stations') {
        const stations = (form[field.key] as WBStation[]) || [];
        const sub = (lbl: string, val: string) => {
          const text = (val || '').trim() || '—';
          const lab = lbl + ': ';
          doc.setFont(FONT, 'bold'); doc.setFontSize(8.5);
          const lw = doc.getTextWidth(lab) + 1;
          const lines = doc.splitTextToSize(text, contentW - lw - 4);
          ensure(5);
          doc.setFont(FONT, 'bold'); doc.setTextColor(...DARK); doc.text(lab, left + 4, y);
          doc.setFont(FONT, 'normal'); doc.setTextColor(...MUTED); doc.text(lines[0], left + 4 + lw, y);
          for (let k = 1; k < lines.length; k++) { y += 4.3; ensure(5); doc.text(lines[k], left + 4 + lw, y); }
          y += 4.7;
        };
        stations.forEach((st, i) => {
          ensure(12);
          doc.setFont(FONT, 'bold'); doc.setFontSize(8.5); doc.setTextColor(...PINK);
          doc.text(`Postazione ${i + 1}${st.momento ? ' — ' + st.momento : ''}`, left, y);
          y += 5;
          sub('Strumentazione', st.strumentazione);
          if ((st.note || '').trim()) sub('Note', st.note);
          y += 1.8;
        });
        return;
      }

      const value = formatWBValue(field, form[field.key]);
      const label = field.label + ':';
      const isLong = field.type === 'textarea';

      doc.setFont(FONT, 'bold'); doc.setFontSize(8.5); doc.setTextColor(...DARK);

      if (isLong) {
        ensure(8);
        doc.text(label, left, y); y += 4.6;
        doc.setFont(FONT, 'normal'); doc.setTextColor(...MUTED);
        doc.splitTextToSize(value, contentW).forEach((line: string) => {
          ensure(5); doc.text(line, left, y); y += 4.4;
        });
        y += 2.2;
      } else {
        const labelW = doc.getTextWidth(label) + 2;
        doc.setFont(FONT, 'normal'); doc.setTextColor(...MUTED);
        const vLines = doc.splitTextToSize(value, contentW - labelW);
        ensure(6);
        doc.setFont(FONT, 'bold'); doc.setTextColor(...DARK);
        doc.text(label, left, y);
        doc.setFont(FONT, 'normal'); doc.setTextColor(...MUTED);
        doc.text(vLines[0], left + labelW, y);
        for (let k = 1; k < vLines.length; k++) { y += 4.4; ensure(5); doc.text(vLines[k], left + labelW, y); }
        y += 5.6;
      }
    });
    y += 3.5;
  });

  // ===== Footer on every page =====
  const pages = doc.getNumberOfPages();
  const stamp = new Date().toLocaleDateString('it-IT');
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 230); doc.setLineWidth(0.3);
    doc.line(left, PAGE_H - 12, right, PAGE_H - 12);
    doc.setFont(FONT, 'normal'); doc.setFontSize(7); doc.setTextColor(...MUTED);
    doc.text(`LEVEL UP · Brief matrimonio · ${stamp}`, left, PAGE_H - 7);
    doc.text(`Pagina ${i} di ${pages}`, right, PAGE_H - 7, { align: 'right' });
  }

  const safe = (s: string) => s.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '');
  const fileName = [safe(c1), safe(c2)].filter(Boolean).join('-') || 'sposi';
  doc.save(`brief-matrimonio-${fileName}.pdf`);
}
