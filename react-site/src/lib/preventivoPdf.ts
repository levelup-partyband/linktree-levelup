import jsPDF from 'jspdf';
import { buildQuoteRows, fmt, type EventForm } from './quote';
import type { Selection } from '../hooks/useQuoteCalculator';

type GenerateArgs = {
  selection: Selection;
  bandPrice: number;
  subtotal: number;
  total: number;
  discount: number;
  form: EventForm;
  fonts: { regular: string; bold: string } | null;
  logo: string | null;
};

/** Render and download the branded A4 quote PDF. Falls back to Helvetica if brand TTF fails. */
export function generateQuotePdf({ selection, bandPrice, subtotal, total, discount, form, fonts, logo }: GenerateArgs) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const PAGE_W = 210;
  const PAGE_H = 297;
  const left = 18;
  const right = PAGE_W - left;

  const BF = 'CocomatPro';
  let useBrand = false;
  if (fonts) {
    try {
      doc.addFileToVFS('CocomatPro-Regular.ttf', fonts.regular);
      doc.addFont('CocomatPro-Regular.ttf', BF, 'normal');
      doc.addFileToVFS('CocomatPro-Bold.ttf', fonts.bold);
      doc.addFont('CocomatPro-Bold.ttf', BF, 'bold');
      useBrand = true;
    } catch {
      // TTF missing unicode cmap — fall back to helvetica
    }
  }
  const FONT = useBrand ? BF : 'helvetica';

  const PINK: [number, number, number] = [236, 18, 137];
  const NAVY: [number, number, number] = [13, 10, 42];
  const TEXT_DARK: [number, number, number] = [40, 40, 50];
  const TEXT_MUTED: [number, number, number] = [120, 120, 130];

  // ===== HEADER BAND =====
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, 38, 'F');
  doc.setFillColor(...PINK);
  doc.rect(0, 38, PAGE_W, 1.2, 'F');

  if (logo) {
    try { doc.addImage(logo, 'PNG', left, 8, 22, 22); } catch { /* ignore */ }
  }

  doc.setFont(FONT, 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('LEVEL UP', left + 26, 19);
  doc.setFont(FONT, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Discoteca live anni '90 / 2000", left + 26, 25);
  doc.setTextColor(...PINK);
  doc.setFontSize(7);
  doc.text('levelup.partyband  ·  +39 320 482 3399', left + 26, 30);

  doc.setFont(FONT, 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('PREVENTIVO', right, 19, { align: 'right' });
  doc.setFont(FONT, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...PINK);
  doc.text(new Date().toLocaleDateString('it-IT').toUpperCase(), right, 25, { align: 'right' });

  let y = 50;

  // ===== EVENT INFO BOX =====
  if (form.name || form.location || form.dateStart || form.email) {
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(left, y, right - left, 26, 2, 2, 'F');
    const boxY = y + 6;
    doc.setTextColor(...TEXT_MUTED);
    doc.setFontSize(7);
    doc.setFont(FONT, 'bold');
    doc.text('EVENTO', left + 4, boxY);

    doc.setFont(FONT, 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...NAVY);
    if (form.name) doc.text(form.name, left + 4, boxY + 6);

    doc.setFont(FONT, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_DARK);
    let infoLine = '';
    if (form.location) infoLine += form.location;
    if (form.dateStart) {
      const ds = new Date(form.dateStart).toLocaleDateString('it-IT');
      const isRange = form.dateEnd && form.dateEnd > form.dateStart;
      const de = isRange ? new Date(form.dateEnd).toLocaleDateString('it-IT') : '';
      if (infoLine) infoLine += '  ·  ';
      infoLine += isRange ? `dal ${ds} al ${de}` : ds;
    }
    if (infoLine) doc.text(infoLine, left + 4, boxY + 13);

    if (form.email) {
      doc.setTextColor(...TEXT_MUTED);
      doc.text(form.email, right - 4, boxY + 13, { align: 'right' });
    }
    y += 32;
  }

  // ===== TABLE HEADER =====
  doc.setFillColor(...PINK);
  doc.roundedRect(left, y, right - left, 7, 1, 1, 'F');
  doc.setFont(FONT, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIZIONE', left + 3, y + 5);
  doc.text('QTÀ', 140, y + 5, { align: 'center' });
  doc.text('IMPORTO', right - 3, y + 5, { align: 'right' });
  y += 11;

  // ===== ROWS =====
  doc.setFont(FONT, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);

  const rows = buildQuoteRows(selection, bandPrice);

  let alt = false;
  rows.forEach(r => {
    const subSplit = r.sub ? doc.splitTextToSize(r.sub, 110) : [];
    const rowH = Math.max(7, 7 + subSplit.length * 3.5);

    if (alt) {
      doc.setFillColor(248, 248, 252);
      doc.rect(left, y - 4, right - left, rowH, 'F');
    }
    alt = !alt;

    doc.setTextColor(...PINK);
    doc.setFontSize(6);
    doc.setFont(FONT, 'bold');
    if (r.cat) doc.text(r.cat, left + 3, y - 1);

    doc.setFont(FONT, 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...NAVY);
    doc.text(r.name, left + 3, y + 2.5);

    if (subSplit.length > 0) {
      doc.setFont(FONT, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...TEXT_MUTED);
      doc.text(subSplit, left + 3, y + 6);
    }

    doc.setFont(FONT, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXT_DARK);
    doc.text(r.hasQty ? `${r.qty}×` : '1', 140, y + 2.5, { align: 'center' });

    if (r.hasQty && r.qty > 1) {
      doc.setFontSize(7);
      doc.setTextColor(...TEXT_MUTED);
      doc.text(`(${fmt(r.unit)} cad.)`, 140, y + 6, { align: 'center' });
    }

    doc.setFont(FONT, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(fmt(r.total), right - 3, y + 2.5, { align: 'right' });

    y += rowH;
  });

  // Separator
  y += 2;
  doc.setDrawColor(...PINK);
  doc.setLineWidth(0.4);
  doc.line(left, y, right, y);
  y += 6;

  // ===== TOTALS =====
  if (discount > 0) {
    doc.setFont(FONT, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_MUTED);
    doc.text('SUBTOTALE', left, y);
    doc.text(fmt(subtotal), right, y, { align: 'right' });
    y += 5;

    doc.setTextColor(34, 197, 94);
    doc.text('SCONTO', left, y);
    doc.text(`- ${fmt(discount)}`, right, y, { align: 'right' });
    y += 7;
  }

  doc.setFillColor(...PINK);
  doc.roundedRect(left, y, right - left, 14, 2, 2, 'F');
  doc.setFont(FONT, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTALE', left + 4, y + 9);
  doc.setFontSize(16);
  doc.text(fmt(total), right - 4, y + 9.5, { align: 'right' });
  y += 18;

  // ===== FOOTER =====
  const footY = PAGE_H - 22;
  doc.setDrawColor(220, 220, 230);
  doc.setLineWidth(0.3);
  doc.line(left, footY, right, footY);

  doc.setFont(FONT, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('I prezzi sono da considerarsi IVA esclusa. In caso di richiesta di fattura sono esclusi eventuali oneri amministrativi e fiscali.', left, footY + 5);

  doc.setFont(FONT, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...PINK);
  doc.text('LEVEL UP', left, footY + 12);
  doc.setFont(FONT, 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text('  ·  Party Band  ·  levelup.partyband@gmail.com  ·  +39 320 482 3399', left + 13, footY + 12);

  doc.setTextColor(...TEXT_MUTED);
  doc.setFontSize(7);
  doc.text('Pagina 1 di 1', right, footY + 12, { align: 'right' });

  const safeName = form.name.replace(/[^\w-]+/g, '-') || 'evento';
  const todayStamp = new Date().toISOString().slice(0, 10);
  doc.save(`preventivo-${todayStamp}-${safeName}.pdf`);
}
