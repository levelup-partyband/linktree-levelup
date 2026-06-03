import { useEffect, useRef } from 'react';
import type { EventForm } from '../../lib/quote';

type Props = {
  form: EventForm;
  setForm: (f: EventForm) => void;
  onClose: () => void;
  onGeneratePdf: () => void;
  onSendWhatsApp: () => void;
};

const inputClass = 'mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none';

export default function QuoteFormModal({ form, setForm, onClose, onGeneratePdf, onSendWhatsApp }: Props) {
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Dati evento" className="card max-w-md w-full p-6 bg-brand-navy" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-2xl">Dati evento</h3>
          <button onClick={onClose} aria-label="Chiudi" className="text-white/60 hover:text-brand-pink text-2xl leading-none">×</button>
        </div>
        <p className="text-xs text-white/50 mb-4">Compila i dati e scegli come inviarci la richiesta.</p>

        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="text-white/70">Nome evento</span>
            <input ref={firstFieldRef} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Es. Sagra di..." />
          </label>
          <label className="block">
            <span className="text-white/70">Luogo</span>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-white/70">Data inizio</span>
              <input type="date" value={form.dateStart} onChange={e => setForm({ ...form, dateStart: e.target.value, dateEnd: e.target.value })} className={inputClass} />
            </label>
            <label className="block">
              <span className="text-white/70">Data fine</span>
              <input type="date" min={form.dateStart} value={form.dateEnd} onChange={e => setForm({ ...form, dateEnd: e.target.value })} className={inputClass} />
            </label>
          </div>
          <label className="block">
            <span className="text-white/70">Email referente</span>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onSendWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold bg-[#25D366] hover:bg-[#1fb955] text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
              WhatsApp
            </button>
            <button
              type="button"
              onClick={onGeneratePdf}
              className="btn-ghost justify-center !py-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              Scarica PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
