import { useMemo, useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import SectionHeading from '../components/SectionHeading';
import ServiceModal from '../components/ServiceModal';
import { bandCost, quoteCategories, QuoteCategory, QuoteItem } from '../data/preventivo';
import logoUrl from '../assets/img/logo-levelup-clear.svg';

type Selection = Record<string, { item: QuoteItem; qty: number; category: string }>;

const fmt = (n: number) => `€ ${n.toFixed(2).replace('.', ',')}`;

const extraIcons: Record<string, JSX.Element> = {
  e1: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 14c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"/></svg>,
  e2: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 6h2v2h-2V8zm0 4h2v6h-2v-6z"/></svg>,
  e3: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M6.5 20Q4.22 20 2.61 18.43 1 16.85 1 14.58 1 12.63 2.17 11.1 3.35 9.57 5.25 9.15 5.88 6.85 7.75 5.43 9.63 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 17.38 21.69 18.69 20.38 20 18.5 20H13Q12.18 20 11.59 19.41 11 18.83 11 18V12.85L9.4 14.4 8 13L12 9L16 13L14.6 14.4 13 12.85V18H18.5Q19.55 18 20.27 17.27 21 16.55 21 15.5 21 14.45 20.27 13.73 19.55 13 18.5 13H17V11Q17 8.93 15.54 7.46 14.08 6 12 6 9.93 6 8.46 7.46 7 8.93 7 11H6.5Q5.05 11 4.03 12.03 3 13.05 3 14.5 3 15.95 4.03 16.97 5.05 18 6.5 18H9V20H6.5Z"/></svg>,
  e4: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2L4 7v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V7l-8-5zM9 12l-2-2 1.5-1.5L9 9l3-3 1.5 1.5L9 12z"/></svg>,
};

const ledwallSize: Record<string, string> = {
  l1: '3 × 2',
  l2: '4 × 2',
  l3: '5 × 3',
};

function StepHeader({ num, title, subtitle }: { num: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="font-display text-3xl text-brand-pink/50 leading-none">{num}</div>
      <div className="flex items-baseline gap-3 flex-1">
        <h3 className="font-display text-xl text-white tracking-widest">{title}</h3>
        {subtitle && <span className="text-[10px] uppercase tracking-widest text-white/40">{subtitle}</span>}
      </div>
    </div>
  );
}

export default function Preventivo() {
  const bandPrice = bandCost.cost;
  const [selection, setSelection] = useState<Selection>({});
  const [discount, setDiscount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const todayISO = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ name: '', location: '', dateStart: todayISO, dateEnd: todayISO, email: '', contactName: '', contactPhone: '', contactEmail: '' });
  const [selectedServiceItem, setSelectedServiceItem] = useState<QuoteItem | null>(null);
  const logoDataRef = useRef<string | null>(null);
  const fontDataRef = useRef<{ regular: string; bold: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Pre-load logo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 300;
      canvas.height = img.height || 260;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      logoDataRef.current = canvas.toDataURL('image/png');
    };
    img.src = logoUrl;

    // Pre-load brand fonts for PDF
    const loadFont = (url: string): Promise<string> =>
      fetch(url)
        .then(r => r.arrayBuffer())
        .then(buf => {
          let bin = '';
          new Uint8Array(buf).forEach(b => { bin += String.fromCharCode(b); });
          return btoa(bin);
        });

    Promise.all([
      loadFont('/fonts/CocomatPro-Regular.ttf'),
      loadFont('/fonts/CocomatPro-Bold.ttf'),
    ]).then(([regular, bold]) => {
      fontDataRef.current = { regular, bold };
    }).catch(() => {});
  }, []);

  const subtotal = useMemo(
    () => bandPrice + Object.values(selection).reduce((s, x) => s + x.item.cost * x.qty, 0),
    [bandPrice, selection]
  );
  const total = Math.max(0, subtotal - discount);

  const serviceCategory = quoteCategories.find(c => c.name === 'SERVICE')!;
  const ledwallCategory = quoteCategories.find(c => c.name === 'LEDWALL')!;
  const extraCategory = quoteCategories.find(c => c.name === 'EXTRA')!;

  const isSelected = (id: string) => selection[id]?.qty > 0;

  const toggleUnique = (cat: QuoteCategory, item: QuoteItem) => {
    setSelection(prev => {
      const next = { ...prev };
      cat.items.forEach(i => { if (next[i.id]) delete next[i.id]; });
      if (!prev[item.id]) next[item.id] = { item, qty: 1, category: cat.name };
      return next;
    });
  };

  const changeQty = (cat: QuoteCategory, item: QuoteItem, delta: number) => {
    setSelection(prev => {
      const next = { ...prev };
      const cur = next[item.id]?.qty || 0;
      const v = Math.max(0, cur + delta);
      if (v === 0) delete next[item.id];
      else next[item.id] = { item, qty: v, category: cat.name };
      return next;
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PAGE_W = 210;
    const PAGE_H = 297;
    const left = 18;
    const right = PAGE_W - left;

    // Register brand font if loaded
    const BF = 'CocomatPro';
    if (fontDataRef.current) {
      doc.addFileToVFS('CocomatPro-Regular.ttf', fontDataRef.current.regular);
      doc.addFont('CocomatPro-Regular.ttf', BF, 'normal');
      doc.addFileToVFS('CocomatPro-Bold.ttf', fontDataRef.current.bold);
      doc.addFont('CocomatPro-Bold.ttf', BF, 'bold');
    }
    const useBrand = !!fontDataRef.current;

    // BRAND COLORS
    const PINK: [number, number, number] = [236, 18, 137];
    const PURPLE: [number, number, number] = [93, 37, 224];
    const NAVY: [number, number, number] = [13, 10, 42];
    const TEXT_DARK: [number, number, number] = [40, 40, 50];
    const TEXT_MUTED: [number, number, number] = [120, 120, 130];

    // ===== HEADER BAND (navy bg) =====
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, PAGE_W, 38, 'F');

    // Pink accent line
    doc.setFillColor(...PINK);
    doc.rect(0, 38, PAGE_W, 1.2, 'F');

    // Logo (if available)
    if (logoDataRef.current) {
      try {
        doc.addImage(logoDataRef.current, 'PNG', left, 8, 22, 22);
      } catch (e) { /* ignore */ }
    }

    // Brand text
    doc.setFont(useBrand ? BF : 'helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('LEVEL UP', left + 26, 19);
    doc.setFont(useBrand ? BF : 'helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("Discoteca live anni '90 / 2000", left + 26, 25);
    doc.setTextColor(...PINK);
    doc.setFontSize(7);
    doc.text('levelup.partyband  ·  +39 320 482 3399', left + 26, 30);

    // PREVENTIVO label - right side
    doc.setFont(useBrand ? BF : 'helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('PREVENTIVO', right, 19, { align: 'right' });
    doc.setFont(useBrand ? BF : 'helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...PINK);
    const today = new Date().toLocaleDateString('it-IT');
    doc.text(today.toUpperCase(), right, 25, { align: 'right' });

    let y = 50;

    // ===== EVENT INFO BOX =====
    if (form.name || form.location || form.dateStart || form.email) {
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(left, y, right - left, 26, 2, 2, 'F');
      const boxY = y + 6;
      doc.setTextColor(...TEXT_MUTED);
      doc.setFontSize(7);
      doc.setFont(useBrand ? BF : 'helvetica', 'bold');
      doc.text('EVENTO', left + 4, boxY);

      doc.setFont(useBrand ? BF : 'helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...NAVY);
      if (form.name) doc.text(form.name, left + 4, boxY + 6);

      doc.setFont(useBrand ? BF : 'helvetica', 'normal');
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
    doc.setFont(useBrand ? BF : 'helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('DESCRIZIONE', left + 3, y + 5);
    doc.text('QTÀ', 140, y + 5, { align: 'center' });
    doc.text('IMPORTO', right - 3, y + 5, { align: 'right' });
    y += 11;

    // ===== ROWS =====
    doc.setFont(useBrand ? BF : 'helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_DARK);

    const rows: { name: string; sub?: string; qty: number; total: number; unit: number; hasQty: boolean; cat?: string }[] = [
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

    let alt = false;
    rows.forEach(r => {
      const subSplit = r.sub ? doc.splitTextToSize(r.sub, 110) : [];
      const rowH = Math.max(7, 7 + subSplit.length * 3.5);

      // Alternating row background
      if (alt) {
        doc.setFillColor(248, 248, 252);
        doc.rect(left, y - 4, right - left, rowH, 'F');
      }
      alt = !alt;

      // Category badge (tiny pink dot + label)
      doc.setTextColor(...PINK);
      doc.setFontSize(6);
      doc.setFont(useBrand ? BF : 'helvetica', 'bold');
      if (r.cat) doc.text(r.cat, left + 3, y - 1);

      // Item name
      doc.setFont(useBrand ? BF : 'helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...NAVY);
      doc.text(r.name, left + 3, y + 2.5);

      // Sub description (smaller, muted)
      if (subSplit.length > 0) {
        doc.setFont(useBrand ? BF : 'helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...TEXT_MUTED);
        doc.text(subSplit, left + 3, y + 6);
      }

      // Qty
      doc.setFont(useBrand ? BF : 'helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...TEXT_DARK);
      doc.text(r.hasQty ? `${r.qty}×` : '1', 140, y + 2.5, { align: 'center' });

      // Unit price (small) if qty > 1
      if (r.hasQty && r.qty > 1) {
        doc.setFontSize(7);
        doc.setTextColor(...TEXT_MUTED);
        doc.text(`(${fmt(r.unit)} cad.)`, 140, y + 6, { align: 'center' });
      }

      // Amount
      doc.setFont(useBrand ? BF : 'helvetica', 'bold');
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
      doc.setFont(useBrand ? BF : 'helvetica', 'normal');
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

    // Total pink box
    doc.setFillColor(...PINK);
    doc.roundedRect(left, y, right - left, 14, 2, 2, 'F');
    doc.setFont(useBrand ? BF : 'helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTALE', left + 4, y + 9);
    doc.setFontSize(16);
    doc.text(fmt(total), right - 4, y + 9.5, { align: 'right' });
    y += 18;

    // ===== NOTE =====
    doc.setFillColor(255, 244, 250);
    doc.setDrawColor(...PINK);
    doc.setLineWidth(0.3);
    doc.roundedRect(left, y, right - left, 16, 2, 2, 'FD');
    doc.setFont(useBrand ? BF : 'helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...PINK);
    doc.text('NOTA', left + 3, y + 5);
    doc.setFont(useBrand ? BF : 'helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEXT_DARK);
    const note = "Il costo della band è indicativo e può variare in base a distanza, durata, periodo dell'anno e necessità specifiche. Contattaci per un preventivo personalizzato e dettagliato.";
    doc.text(doc.splitTextToSize(note, right - left - 6), left + 3, y + 9);
    y += 20;

    // ===== FOOTER =====
    const footY = PAGE_H - 22;
    doc.setDrawColor(220, 220, 230);
    doc.setLineWidth(0.3);
    doc.line(left, footY, right, footY);

    doc.setFont(useBrand ? BF : 'helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...TEXT_MUTED);
    doc.text("I prezzi sono da considerarsi IVA esclusa. In caso di richiesta di fattura sono esclusi eventuali oneri amministrativi e fiscali.", left, footY + 5);

    doc.setFont(useBrand ? BF : 'helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...PINK);
    doc.text('LEVEL UP', left, footY + 12);
    doc.setFont(useBrand ? BF : 'helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    doc.text('  ·  Party Band  ·  levelup.partyband@gmail.com  ·  +39 320 482 3399', left + 13, footY + 12);

    // Page indicator right
    doc.setTextColor(...TEXT_MUTED);
    doc.setFontSize(7);
    doc.text('Pagina 1 di 1', right, footY + 12, { align: 'right' });

    const safeName = form.name.replace(/[^\w-]+/g, '-') || 'evento';
    const todayStamp = new Date().toISOString().slice(0, 10);
    doc.save(`preventivo-${todayStamp}-${safeName}.pdf`);
    setShowModal(false);
  };

  const selectedItems = Object.values(selection);

  return (
    <div className="container-x py-12 pb-32 lg:pb-12">
      <SectionHeading kicker="Online" title="Calcola il tuo preventivo" sub="Seleziona service, ledwall ed extra: il totale si aggiorna in tempo reale. Scarica il PDF finale." />

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
        {/* ===== MAIN CONTENT ===== */}
        <div className="lg:col-span-2 space-y-8">

          {/* STEP 01 - BAND */}
          <section>
            <StepHeader num="01" title="Band" subtitle="Costo base" />
            <div className="card p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-pink/15 border border-brand-pink/40 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-brand-pink"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </div>
                  <div>
                    <div className="font-display text-lg tracking-wide">BAND – 6 elementi</div>
                    <div className="text-xs text-white/50">Costo base fisso</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-brand-pink/10 border border-brand-pink/40 rounded-full px-4 py-2 shrink-0">
                  <span className="text-brand-pink text-sm">€</span>
                  <span className="font-display text-lg text-brand-pink">{bandPrice}</span>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 px-1 text-xs text-white/60 leading-relaxed">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-brand-pink/70 shrink-0 mt-0.5"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                <span>
                  Il costo è indicativo e può variare in base a <strong className="text-white/80">distanza, durata, periodo dell'anno</strong> e necessità specifiche. Contattaci per un preventivo personalizzato.
                </span>
              </div>
            </div>
          </section>

          {/* STEP 02 - SERVICE */}
          <section>
            <StepHeader num="02" title="Service" subtitle="Scelta unica · ⓘ per i dettagli" />
            <div className="grid grid-cols-2 gap-3">
              {serviceCategory.items.map(item => {
                const sel = isSelected(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleUnique(serviceCategory, item)}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer aspect-square
                      ${sel ? 'border-brand-pink shadow-glow' : 'border-white/10 hover:border-brand-pink/60'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-deep to-brand-navy" />
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.shortName}
                        className="absolute inset-0 w-full h-full object-cover invert"
                        style={{ objectPosition: '50% 55%' }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[11px] font-bold backdrop-blur-md
                      ${sel ? 'bg-brand-pink text-white' : 'bg-black/60 text-brand-pink border border-brand-pink/40'}`}>
                      {fmt(item.cost)}
                    </div>

                    {sel && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-brand-pink flex items-center justify-center shadow-glow">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between">
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-white/60">Configurazione</div>
                        <div className="font-display text-sm tracking-wider text-white leading-none">{item.shortName?.toUpperCase()}</div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedServiceItem(item); }}
                        title="Vedi dettagli"
                        className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 03 - LEDWALL */}
          <section>
            <StepHeader num="03" title="Ledwall" subtitle="Scelta unica · opzionale" />
            <div className="grid grid-cols-3 gap-3">
              {ledwallCategory.items.map(item => {
                const sel = isSelected(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleUnique(ledwallCategory, item)}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all cursor-pointer text-center
                      ${sel ? 'border-brand-pink bg-brand-pink/15 shadow-glow' : 'border-white/10 bg-white/5 hover:border-brand-pink/60'}`}
                  >
                    {sel && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-pink flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                    )}
                    <svg viewBox="0 0 24 24" className={`w-7 h-7 mx-auto mb-2 ${sel ? 'fill-brand-pink' : 'fill-white/60'}`}>
                      <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5l-1 1v2h10v-2l-1-1h5c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
                    </svg>
                    <div className="font-display text-xl text-white">{ledwallSize[item.id] || item.name}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/50 mt-0.5">metri</div>
                    <div className={`text-sm font-semibold mt-2 ${sel ? 'text-brand-pink' : 'text-white/70'}`}>{fmt(item.cost)}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 04 - EXTRA */}
          <section>
            <StepHeader num="04" title="Extra & FX" subtitle="Aggiungi più elementi" />
            <div className="grid sm:grid-cols-2 gap-3">
              {extraCategory.items.map(item => {
                const qty = selection[item.id]?.qty || 0;
                const sel = qty > 0;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border-2 p-4 transition-all
                      ${sel ? 'border-brand-pink bg-brand-pink/10' : 'border-white/10 bg-white/5'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0
                        ${sel ? 'bg-brand-pink text-white' : 'bg-white/10 text-brand-pink'}`}>
                        {extraIcons[item.id]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-white/50">{fmt(item.cost)} cad.</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <button
                        onClick={() => changeQty(extraCategory, item, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-full font-bold bg-white/10 hover:bg-brand-pink hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-colors"
                      >−</button>
                      <span className="w-8 text-center font-display text-lg">{qty}</span>
                      <button
                        onClick={() => changeQty(extraCategory, item, +1)}
                        className="w-8 h-8 rounded-full font-bold bg-brand-pink text-white hover:bg-brand-pink-dark transition-colors"
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ===== SIDEBAR SUMMARY ===== */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="card p-5 bg-gradient-to-br from-brand-navy-deep/80 to-brand-purple/10">
              <div className="flex items-center justify-between mb-4">
                <div className="font-display text-xl text-brand-pink tracking-widest">RIEPILOGO</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">{selectedItems.length + 1} voci</div>
              </div>

              {/* Items list */}
              <div className="space-y-2.5 mb-4 max-h-72 overflow-y-auto pr-1">
                <div className="flex justify-between items-baseline text-sm">
                  <div className="flex-1">
                    <div className="text-white">Band</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">Base</div>
                  </div>
                  <div className="font-semibold text-white">{fmt(bandPrice)}</div>
                </div>
                {selectedItems.map(s => (
                  <div key={s.item.id} className="flex justify-between items-baseline text-sm">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-white truncate">{s.item.shortName || s.item.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">
                        {s.category}{s.item.hasQuantity ? ` · ${s.qty}×` : ''}
                      </div>
                    </div>
                    <div className="font-semibold text-white shrink-0">{fmt(s.item.cost * s.qty)}</div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm text-white/70">
                <span>Subtotale</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between mt-2 mb-4">
                <span className="text-sm text-white/70">Sconto</span>
                <div className="flex items-center gap-1 bg-white/5 border border-white/15 rounded-lg px-2 py-1 focus-within:border-brand-pink">
                  <span className="text-white/60 text-xs">€</span>
                  <input
                    type="number"
                    min={0}
                    value={discount || ''}
                    onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0"
                    className="w-16 bg-transparent text-right font-semibold text-sm outline-none"
                  />
                </div>
              </div>

              {/* Total */}
              <div className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink p-4 mb-4">
                <div className="text-[10px] uppercase tracking-widest text-white/80">Totale stimato</div>
                <div className="font-display text-3xl tracking-wider mt-0.5">{fmt(total)}</div>
                <div className="text-[10px] text-white/70 mt-1">IVA esclusa</div>
              </div>

              <button onClick={() => setShowModal(true)} className="btn-primary w-full justify-center text-sm !py-3">GENERA PREVENTIVO PDF</button>
            </div>
          </div>
        </aside>
      </div>

      {/* MOBILE STICKY FOOTER */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-navy-deep/95 backdrop-blur border-t border-white/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/50">Totale</div>
            <div className="font-display text-2xl text-brand-pink">{fmt(total)}</div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary !py-2.5 !px-5 text-sm">GENERA PDF</button>
        </div>
      </div>

      {/* SERVICE MODAL */}
      <ServiceModal
        item={selectedServiceItem}
        onClose={() => setSelectedServiceItem(null)}
        onSelect={(item) => toggleUnique(serviceCategory, item)}
        isSelected={isSelected(selectedServiceItem?.id || '')}
      />

      {/* QUOTE FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="card max-w-md w-full p-6 bg-brand-navy" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl">Dati evento</h3>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-brand-pink text-2xl leading-none">×</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); generatePDF(); }} className="space-y-3 text-sm">
              <label className="block">
                <span className="text-white/70">Nome evento *</span>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none" placeholder="Es. Sagra di..." />
              </label>
              <label className="block">
                <span className="text-white/70">Luogo</span>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-white/70">Data inizio *</span>
                  <input type="date" required value={form.dateStart} onChange={e => setForm({ ...form, dateStart: e.target.value, dateEnd: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none" />
                </label>
                <label className="block">
                  <span className="text-white/70">Data fine</span>
                  <input type="date" min={form.dateStart} value={form.dateEnd} onChange={e => setForm({ ...form, dateEnd: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none" />
                </label>
              </div>
              <label className="block">
                <span className="text-white/70">Email referente</span>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none" />
              </label>
              <button type="submit" className="btn-primary w-full justify-center mt-2">SCARICA PDF</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

