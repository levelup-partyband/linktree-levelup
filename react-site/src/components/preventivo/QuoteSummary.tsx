import { fmt } from '../../lib/quote';
import type { Selection } from '../../hooks/useQuoteCalculator';

type Props = {
  bandPrice: number;
  selectedItems: Selection[string][];
  subtotal: number;
  discount: number;
  setDiscount: (n: number) => void;
  total: number;
  onContinue: () => void;
};

export default function QuoteSummary({ bandPrice, selectedItems, subtotal, discount, setDiscount, total, onContinue }: Props) {
  return (
    <div className="card p-5 bg-gradient-to-br from-brand-navy-deep/80 to-brand-purple/10">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-xl text-brand-pink tracking-widest">RIEPILOGO</div>
        <div className="text-[10px] uppercase tracking-widest text-white/40">{selectedItems.length + 1} voci</div>
      </div>

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

      <div className="border-t border-white/10 pt-3 flex justify-between text-sm text-white/70">
        <span>Subtotale</span>
        <span className="font-semibold">{fmt(subtotal)}</span>
      </div>

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

      <div className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink p-4 mb-4">
        <div className="text-[10px] uppercase tracking-widest text-white/80">Totale stimato</div>
        <div className="font-display text-3xl tracking-wider mt-0.5">{fmt(total)}</div>
        <div className="text-[10px] text-white/70 mt-1">IVA esclusa</div>
      </div>

      <button onClick={onContinue} className="btn-primary w-full justify-center text-sm !py-3">RICHIEDI PREVENTIVO</button>
    </div>
  );
}
