import { computeWBTotals, wbNum, type WBForm, type WBStation, type WBPricedItem } from '../../data/weddingBrief';
import { fmt } from '../../lib/quote';

type Props = {
  form: WBForm;
  set: (key: string, value: WBForm[string]) => void;
};

const priceInput = 'w-28 px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none text-right text-sm';

/** A single priced row: label (or editable), price, "Incluso" toggle, amount. */
function Row({
  label, editable, onLabel, prezzo, incluso, onPrezzo, onIncluso, onRemove,
}: {
  label: string;
  editable?: boolean;
  onLabel?: (v: string) => void;
  prezzo: string;
  incluso: boolean;
  onPrezzo: (v: string) => void;
  onIncluso: (v: boolean) => void;
  onRemove?: () => void;
}) {
  const amount = wbNum(prezzo);
  return (
    <div className="flex items-center gap-2 py-2 border-b border-white/5">
      <div className="flex-1 min-w-0">
        {editable ? (
          <input
            value={label}
            onChange={e => onLabel?.(e.target.value)}
            placeholder="Voce extra (es. Microfono, Proiettore...)"
            className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 focus:border-brand-pink outline-none text-sm"
          />
        ) : (
          <span className="text-sm text-white/85">{label}</span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span className="text-white/50 text-xs">€</span>
        <input type="number" min={0} step="any" value={prezzo} onChange={e => onPrezzo(e.target.value)} placeholder="0" className={priceInput} />
      </div>

      <button
        type="button"
        onClick={() => onIncluso(!incluso)}
        className={`shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
          incluso ? 'bg-brand-pink border-brand-pink text-white' : 'bg-white/5 border-white/20 text-white/60 hover:border-brand-pink/60'
        }`}
        title="Incluso nel pacchetto (non sommato)"
      >
        Incluso
      </button>

      <div className="w-20 text-right shrink-0 text-sm">
        {incluso
          ? <span className="text-white/40 line-through">{fmt(amount)}</span>
          : <span className="text-white font-semibold">{fmt(amount)}</span>}
      </div>

      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label="Rimuovi voce" className="shrink-0 text-white/40 hover:text-brand-pink text-lg leading-none w-5">×</button>
      ) : <span className="w-5 shrink-0" />}
    </div>
  );
}

export default function PriceSummary({ form, set }: Props) {
  const stations = (form.postazioni as WBStation[]) || [];
  const extra = (form.extra as WBPricedItem[]) || [];
  const t = computeWBTotals(form);

  const updateStation = (i: number, patch: Partial<WBStation>) =>
    set('postazioni', stations.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const updateExtra = (i: number, patch: Partial<WBPricedItem>) =>
    set('extra', extra.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const addExtra = () => set('extra', [...extra, { voce: '', prezzo: '', incluso: false }]);
  const removeExtra = (i: number) => set('extra', extra.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      {/* BAND */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-brand-pink/70 mb-1">Band</div>
        <Row
          label="Band — LEVEL UP"
          prezzo={form.bandPrezzo as string}
          incluso={form.bandIncluso as boolean}
          onPrezzo={v => set('bandPrezzo', v)}
          onIncluso={v => set('bandIncluso', v)}
        />
      </div>

      {/* POSTAZIONI */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-brand-pink/70 mb-1">Postazioni</div>
        {stations.length === 0 && <p className="text-xs text-white/40 py-2">Nessuna postazione inserita.</p>}
        {stations.map((st, i) => (
          <Row
            key={i}
            label={`Postazione ${i + 1}${st.momento ? ' — ' + st.momento : ''}`}
            prezzo={st.prezzo}
            incluso={st.incluso}
            onPrezzo={v => updateStation(i, { prezzo: v })}
            onIncluso={v => updateStation(i, { incluso: v })}
          />
        ))}
      </div>

      {/* EXTRA */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] uppercase tracking-widest text-brand-pink/70">Extra (mic, proiettori, FX...)</span>
        </div>
        {extra.map((e, i) => (
          <Row
            key={i}
            label={e.voce}
            editable
            onLabel={v => updateExtra(i, { voce: v })}
            prezzo={e.prezzo}
            incluso={e.incluso}
            onPrezzo={v => updateExtra(i, { prezzo: v })}
            onIncluso={v => updateExtra(i, { incluso: v })}
            onRemove={() => removeExtra(i)}
          />
        ))}
        <button
          type="button"
          onClick={addExtra}
          className="mt-2 w-full px-4 py-2.5 rounded-xl border border-dashed border-white/25 text-white/70 hover:border-brand-pink hover:text-brand-pink transition-colors text-sm font-semibold"
        >
          + Aggiungi extra
        </button>
      </div>

      {/* TOTALS */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>Subtotale</span>
          <span className="font-semibold">{fmt(t.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Sconto</span>
          <div className="flex items-center gap-1 bg-white/5 border border-white/15 rounded-lg px-2 py-1 focus-within:border-brand-pink">
            <span className="text-white/60 text-xs">€</span>
            <input type="number" min={0} step="any" value={form.sconto as string} onChange={e => set('sconto', e.target.value)} placeholder="0" className="w-20 bg-transparent text-right font-semibold text-sm outline-none" />
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink p-4 mt-2">
          <div className="text-[10px] uppercase tracking-widest text-white/80">Totale</div>
          <div className="font-display text-3xl tracking-wider mt-0.5">{fmt(t.total)}</div>
          <div className="text-[10px] text-white/70 mt-1">IVA esclusa</div>
        </div>
      </div>
    </div>
  );
}
