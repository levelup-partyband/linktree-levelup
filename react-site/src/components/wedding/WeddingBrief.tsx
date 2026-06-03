import { useEffect, useState } from 'react';
import { WB_SECTIONS, emptyWBForm, isWBFieldVisible, type WBField, type WBForm, type WBStation } from '../../data/weddingBrief';
import { generateWeddingBriefPdf } from '../../lib/weddingBriefPdf';
import type { PdfFonts } from '../../hooks/usePdfAssets';

type Props = {
  fontDataRef: React.MutableRefObject<PdfFonts>;
  logoDataRef: React.MutableRefObject<string | null>;
};

const inputClass = 'mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none text-sm';

export default function WeddingBrief({ fontDataRef, logoDataRef }: Props) {
  const [form, setForm] = useState<WBForm>(() => emptyWBForm());
  const [confirmReset, setConfirmReset] = useState(false);
  const set = (key: string, value: WBForm[string]) => setForm(f => ({ ...f, [key]: value }));

  const handlePdf = () =>
    generateWeddingBriefPdf(form, { fonts: fontDataRef.current, logo: logoDataRef.current });

  useEffect(() => {
    if (!confirmReset) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmReset(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmReset]);

  const renderField = (field: WBField) => {
    const v = form[field.key];

    if (field.type === 'stations') {
      const stations = (v as WBStation[]) || [];
      const update = (i: number, patch: Partial<WBStation>) =>
        set(field.key, stations.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
      const remove = (i: number) => set(field.key, stations.filter((_, idx) => idx !== i));
      const add = () => set(field.key, [...stations, { momento: '', strumentazione: '', note: '' }]);
      return (
        <div className="space-y-3">
          {stations.map((st, i) => (
            <div key={i} className="rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-widest text-brand-pink">POSTAZIONE {i + 1}</span>
                <button type="button" onClick={() => remove(i)} aria-label="Rimuovi postazione" className="text-white/40 hover:text-brand-pink text-xl leading-none">×</button>
              </div>
              <input
                value={st.momento}
                onChange={e => update(i, { momento: e.target.value })}
                placeholder="Momento (es. Aperitivo, Taglio torta, Festa principale)"
                className={inputClass}
              />
              <textarea
                rows={2}
                value={st.strumentazione}
                onChange={e => update(i, { strumentazione: e.target.value })}
                placeholder="Strumentazione (es. 1 cassa, mixer, musica, ciabatta corrente, punto luce)"
                className={`${inputClass} resize-y`}
              />
              <input
                value={st.note}
                onChange={e => update(i, { note: e.target.value })}
                placeholder="Note (es. serve un punto luce? presa vicina?)"
                className={inputClass}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={add}
            className="w-full px-4 py-3 rounded-xl border border-dashed border-white/25 text-white/70 hover:border-brand-pink hover:text-brand-pink transition-colors text-sm font-semibold"
          >
            + Aggiungi postazione
          </button>
        </div>
      );
    }

    if (field.type === 'checkbox') {
      const on = v === true;
      return (
        <button
          type="button"
          onClick={() => set(field.key, !on)}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all text-left text-sm ${
            on ? 'border-brand-pink bg-brand-pink/10' : 'border-white/15 bg-white/5 hover:border-brand-pink/50'
          }`}
        >
          <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${on ? 'bg-brand-pink border-brand-pink' : 'border-white/30'}`}>
            {on && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
          </span>
          <span className="text-white/80">{field.label}</span>
        </button>
      );
    }

    if (field.type === 'multi') {
      const arr = (v as string[]) || [];
      return (
        <div>
          <span className="text-white/70 text-sm">{field.label}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {field.options!.map(opt => {
              const on = arr.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set(field.key, on ? arr.filter(o => o !== opt) : [...arr, opt])}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    on ? 'bg-brand-pink border-brand-pink text-white' : 'bg-white/5 border-white/20 text-white/70 hover:border-brand-pink/60'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <label className="block">
          <span className="text-white/70 text-sm">{field.label}</span>
          <select value={v as string} onChange={e => set(field.key, e.target.value)} className={inputClass}>
            <option value="">—</option>
            {field.options!.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>
      );
    }

    if (field.type === 'textarea') {
      return (
        <label className="block">
          <span className="text-white/70 text-sm">{field.label}</span>
          <textarea
            rows={3}
            value={v as string}
            onChange={e => set(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`${inputClass} resize-y`}
          />
        </label>
      );
    }

    return (
      <label className="block">
        <span className="text-white/70 text-sm">{field.label}</span>
        <input
          type={field.type}
          value={v as string}
          onChange={e => set(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      </label>
    );
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="card p-4 bg-brand-purple/10 border-brand-pink/30 text-sm text-white/70">
        Brief interno per il sopralluogo con gli sposi. Compila ciò che serve — i campi vuoti restano come promemoria nel PDF — poi genera il documento da portare al meeting.
      </div>

      {WB_SECTIONS.map((section, si) => (
        <section key={section.title} className="card p-5 sm:p-6">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display text-2xl text-brand-pink/50 leading-none">{String(si + 1).padStart(2, '0')}</span>
            <h3 className="font-display text-xl text-white tracking-wide">{section.title}</h3>
          </div>
          {section.hint && <p className="text-xs text-white/45 -mt-2 mb-4">{section.hint}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            {section.fields.filter(field => isWBFieldVisible(field, form)).map(field => (
              <div key={field.key} className={field.full || field.type === 'textarea' || field.type === 'multi' ? 'sm:col-span-2' : ''}>
                {renderField(field)}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end sticky bottom-0 bg-brand-navy-deep/90 backdrop-blur py-4 -mx-1 px-1 rounded-t-xl">
        <button onClick={() => setConfirmReset(true)} className="btn-ghost justify-center text-sm">Svuota</button>
        <button onClick={handlePdf} className="btn-primary justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
          Genera PDF Brief
        </button>
      </div>

      {/* RESET CONFIRM DIALOG */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmReset(false)}>
          <div role="dialog" aria-modal="true" aria-label="Conferma svuota brief" className="card max-w-sm w-full p-6 bg-brand-navy text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-pink/15 border border-brand-pink/40 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-brand-pink"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
            </div>
            <h3 className="font-display text-xl mb-1">Svuotare il brief?</h3>
            <p className="text-sm text-white/60 mb-5">Tutti i campi compilati verranno azzerati. L'azione non è reversibile.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmReset(false)} className="btn-ghost flex-1 justify-center text-sm">Annulla</button>
              <button
                onClick={() => { setForm(emptyWBForm()); setConfirmReset(false); }}
                className="btn-primary flex-1 justify-center text-sm"
              >
                Svuota tutto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
