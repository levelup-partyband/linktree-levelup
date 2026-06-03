import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ServiceModal from '../components/ServiceModal';
import StepHeader from '../components/preventivo/StepHeader';
import ServiceSelector from '../components/preventivo/ServiceSelector';
import LedwallSelector from '../components/preventivo/LedwallSelector';
import ExtraSelector from '../components/preventivo/ExtraSelector';
import QuoteSummary from '../components/preventivo/QuoteSummary';
import QuoteFormModal from '../components/preventivo/QuoteFormModal';
import WeddingBrief from '../components/wedding/WeddingBrief';
import { useQuoteCalculator } from '../hooks/useQuoteCalculator';
import { usePdfAssets } from '../hooks/usePdfAssets';
import { buildQuoteRows, buildWhatsAppText, fmt, type EventForm } from '../lib/quote';
import { generateQuotePdf } from '../lib/preventivoPdf';
import type { QuoteItem } from '../data/preventivo';

const WHATSAPP_NUMBER = '393204823399';

type Tab = 'preventivo' | 'brief';

export default function Preventivo() {
  const q = useQuoteCalculator();
  const { logoDataRef, fontDataRef } = usePdfAssets();
  const [tab, setTab] = useState<Tab>('preventivo');
  const [showModal, setShowModal] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState<QuoteItem | null>(null);

  const todayISO = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<EventForm>({ name: '', location: '', dateStart: todayISO, dateEnd: todayISO, email: '' });

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
      <SectionHeading
        kicker="Riservato"
        title={tab === 'preventivo' ? 'Calcola il tuo preventivo' : 'Brief matrimonio'}
        sub={tab === 'preventivo'
          ? 'Seleziona service, ledwall ed extra: il totale si aggiorna in tempo reale. Poi invialo su WhatsApp o scaricalo in PDF.'
          : 'Raccogli tutte le info durante il meeting con gli sposi e genera il documento PDF da archiviare.'}
      />

      {/* TAB SWITCHER */}
      <div className="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 p-1">
        <button
          onClick={() => setTab('preventivo')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${tab === 'preventivo' ? 'bg-brand-pink text-white' : 'text-white/70 hover:text-white'}`}
        >Preventivo</button>
        <button
          onClick={() => setTab('brief')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${tab === 'brief' ? 'bg-brand-pink text-white' : 'text-white/70 hover:text-white'}`}
        >Brief Sposi</button>
      </div>

      {tab === 'brief' && <WeddingBrief fontDataRef={fontDataRef} logoDataRef={logoDataRef} />}

      {tab === 'preventivo' && (
      <>
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
      </>
      )}
    </div>
  );
}
