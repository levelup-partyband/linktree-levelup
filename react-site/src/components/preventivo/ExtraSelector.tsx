import { fmt } from '../../lib/quote';
import type { QuoteCategory, QuoteItem } from '../../data/preventivo';
import type { Selection } from '../../hooks/useQuoteCalculator';

const extraIcons: Record<string, JSX.Element> = {
  e1: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 14c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"/></svg>,
  e2: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 6h2v2h-2V8zm0 4h2v6h-2v-6z"/></svg>,
  e3: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M6.5 20Q4.22 20 2.61 18.43 1 16.85 1 14.58 1 12.63 2.17 11.1 3.35 9.57 5.25 9.15 5.88 6.85 7.75 5.43 9.63 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 17.38 21.69 18.69 20.38 20 18.5 20H13Q12.18 20 11.59 19.41 11 18.83 11 18V12.85L9.4 14.4 8 13L12 9L16 13L14.6 14.4 13 12.85V18H18.5Q19.55 18 20.27 17.27 21 16.55 21 15.5 21 14.45 20.27 13.73 19.55 13 18.5 13H17V11Q17 8.93 15.54 7.46 14.08 6 12 6 9.93 6 8.46 7.46 7 8.93 7 11H6.5Q5.05 11 4.03 12.03 3 13.05 3 14.5 3 15.95 4.03 16.97 5.05 18 6.5 18H9V20H6.5Z"/></svg>,
  e4: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2L4 7v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V7l-8-5zM9 12l-2-2 1.5-1.5L9 9l3-3 1.5 1.5L9 12z"/></svg>,
};

type Props = {
  category: QuoteCategory;
  selection: Selection;
  onChangeQty: (cat: QuoteCategory, item: QuoteItem, delta: number) => void;
};

export default function ExtraSelector({ category, selection, onChangeQty }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {category.items.map(item => {
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
                onClick={() => onChangeQty(category, item, -1)}
                disabled={qty === 0}
                className="w-8 h-8 rounded-full font-bold bg-white/10 hover:bg-brand-pink hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-colors"
              >−</button>
              <span className="w-8 text-center font-display text-lg">{qty}</span>
              <button
                onClick={() => onChangeQty(category, item, +1)}
                className="w-8 h-8 rounded-full font-bold bg-brand-pink text-white hover:bg-brand-pink-dark transition-colors"
              >+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
