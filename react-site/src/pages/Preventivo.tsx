import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ServiceModal from '../components/ServiceModal';
import StepHeader from '../components/preventivo/StepHeader';
import ServiceSelector from '../components/preventivo/ServiceSelector';
import LedwallSelector from '../components/preventivo/LedwallSelector';
import ExtraSelector from '../components/preventivo/ExtraSelector';
import QuoteSummary from '../components/preventivo/QuoteSummary';
import QuoteFormModal from '../components/preventivo/QuoteFormModal';
import { useQuoteCalculator } from '../hooks/useQuoteCalculator';
import { buildQuoteRows, buildWhatsAppText, fmt, type EventForm } from '../lib/quote';
import { generateQuotePdf } from '../lib/preventivoPdf';
import { pub } from '../lib/publicUrl';
import logoUrl from '../assets/img/logo-levelup-clear.svg';
import type { QuoteItem } from '../data/preventivo';

const WHATSAPP_NUMBER = '393204823399';

export default function Preventivo() {
  const q = useQuoteCalculator();
  const [showModal, setShowModal] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState<QuoteItem | null>(null);

  const todayISO = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<EventForm>({ name: '', location: '', dateStart: todayISO, dateEnd: todayISO, email: '' });

  const logoDataRef = useRef<string | null>(null);
  const fontDataRef = useRef<{ regular: string; bold: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Pre-load logo into a data URL for the PDF header
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 300;
      canvas.height = img.height || 260;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      logoDataRef.current = canvas.toDataURL('image/png');
    };
    img.src = logoUrl;

    // Pre-load brand fonts for the PDF (base64)
    const loadFont = (url: string): Promise<string> =>
      fetch(url)
        .then(r => r.arrayBuffer())
        .then(buf => {
          let bin = '';
          new Uint8Array(buf).forEach(b => { bin += String.fromCharCode(b); });
          return btoa(bin);
        });

    Promise.all([
      loadFont(pub('fonts/CocomatPro-Regular.ttf')),
      loadFont(pub('fonts/CocomatPro-Bold.ttf')),
    ]).then(([regular, bold]) => {
      fontDataRef.current = { regular, bold };
    }).catch(() => {});
  }, []);

  const handleGeneratePdf = () => {
    generateQuotePdf({
      selection: q.selection,
      bandPrice: q.bandPrice,
      subtotal: q.subtotal,
      total: q.total,
      discount: q.discount,
      form,
      fonts: fontDataRef.current,
      logo: logoDataRef.current,
    });
    setShowModal(false);
  };

  const handleSendWhatsApp = () => {
    const rows = buildQuoteRows(q.selection, q.bandPrice);
    const text = buildWhatsAppText(form, rows, { subtotal: q.subtotal, total: q.total, discount: q.discount });
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setShowModal(false);
  };

  return (
    <div className="container-x py-12 pb-32 lg:pb-12">
      <SectionHeading kicker="Online" title="Calcola il tuo preventivo" sub="Seleziona service, ledwall ed extra: il totale si aggiorna in tempo reale. Poi invialo su WhatsApp o scaricalo in PDF." />

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
                  <span className="font-display text-lg text-brand-pink">{q.bandPrice}</span>
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
            <ServiceSelector
              category={q.serviceCategory}
              isSelected={q.isSelected}
              onToggle={q.toggleUnique}
              onDetails={setSelectedServiceItem}
            />
          </section>

          {/* STEP 03 - LEDWALL */}
          <section>
            <StepHeader num="03" title="Ledwall" subtitle="Scelta unica · opzionale" />
            <LedwallSelector category={q.ledwallCategory} isSelected={q.isSelected} onToggle={q.toggleUnique} />
          </section>

          {/* STEP 04 - EXTRA */}
          <section>
            <StepHeader num="04" title="Extra & FX" subtitle="Aggiungi più elementi" />
            <ExtraSelector category={q.extraCategory} selection={q.selection} onChangeQty={q.changeQty} />
          </section>
        </div>

        {/* ===== SIDEBAR SUMMARY ===== */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <QuoteSummary
              bandPrice={q.bandPrice}
              selectedItems={q.selectedItems}
              subtotal={q.subtotal}
              discount={q.discount}
              setDiscount={q.setDiscount}
              total={q.total}
              onContinue={() => setShowModal(true)}
            />
          </div>
        </aside>
      </div>

      {/* MOBILE STICKY FOOTER */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-navy-deep/95 backdrop-blur border-t border-white/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/50">Totale</div>
            <div className="font-display text-2xl text-brand-pink">{fmt(q.total)}</div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary !py-2.5 !px-5 text-sm">RICHIEDI PREVENTIVO</button>
        </div>
      </div>

      {/* SERVICE MODAL */}
      <ServiceModal
        item={selectedServiceItem}
        onClose={() => setSelectedServiceItem(null)}
        onSelect={(item) => q.toggleUnique(q.serviceCategory, item)}
        isSelected={q.isSelected(selectedServiceItem?.id || '')}
      />

      {/* QUOTE FORM MODAL */}
      {showModal && (
        <QuoteFormModal
          form={form}
          setForm={setForm}
          onClose={() => setShowModal(false)}
          onGeneratePdf={handleGeneratePdf}
          onSendWhatsApp={handleSendWhatsApp}
        />
      )}
    </div>
  );
}
