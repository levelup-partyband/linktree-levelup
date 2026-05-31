import { fmt } from '../../lib/quote';
import type { QuoteCategory, QuoteItem } from '../../data/preventivo';

const ledwallSize: Record<string, string> = {
  l1: '3 × 2',
  l2: '4 × 2',
  l3: '5 × 3',
};

type Props = {
  category: QuoteCategory;
  isSelected: (id: string) => boolean;
  onToggle: (cat: QuoteCategory, item: QuoteItem) => void;
};

export default function LedwallSelector({ category, isSelected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {category.items.map(item => {
        const sel = isSelected(item.id);
        return (
          <div
            key={item.id}
            onClick={() => onToggle(category, item)}
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
  );
}
