import { fmt } from '../../lib/quote';
import { pub } from '../../lib/publicUrl';
import type { QuoteCategory, QuoteItem } from '../../data/preventivo';

type Props = {
  category: QuoteCategory;
  isSelected: (id: string) => boolean;
  onToggle: (cat: QuoteCategory, item: QuoteItem) => void;
  onDetails: (item: QuoteItem) => void;
};

export default function ServiceSelector({ category, isSelected, onToggle, onDetails }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {category.items.map(item => {
        const sel = isSelected(item.id);
        return (
          <div
            key={item.id}
            onClick={() => onToggle(category, item)}
            className={`group relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer aspect-square
              ${sel ? 'border-brand-pink shadow-glow' : 'border-white/10 hover:border-brand-pink/60'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-deep to-brand-navy" />
            {item.image && (
              <img
                src={pub(item.image)}
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
                onClick={(e) => { e.stopPropagation(); onDetails(item); }}
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
  );
}
