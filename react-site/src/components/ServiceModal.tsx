import { QuoteItem } from '../data/preventivo';

interface ServiceModalProps {
  item: QuoteItem | null;
  onClose: () => void;
  onSelect: (item: QuoteItem) => void;
  isSelected: boolean;
}

const fmt = (n: number) => `€ ${n.toFixed(2).replace('.', ',')}`;

export default function ServiceModal({ item, onClose, onSelect, isSelected }: ServiceModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="card max-w-2xl w-full bg-brand-navy" onClick={e => e.stopPropagation()}>
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-brand-navy-deep to-brand-navy">
          <img src={item.image} alt={item.shortName} className="w-full aspect-video object-cover invert" style={{ objectPosition: '50% 55%' }} />
          <button onClick={onClose} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white text-xl leading-none flex items-center justify-center">×</button>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-brand-pink mb-1">Configurazione</div>
              <h3 className="font-display text-2xl tracking-wide">{item.shortName}</h3>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Prezzo</div>
              <div className="font-display text-2xl text-brand-pink">{fmt(item.cost)}</div>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-6">{item.name}</p>
          <button
            onClick={() => { onSelect(item); onClose(); }}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isSelected
                ? 'bg-white/10 border border-brand-pink text-brand-pink'
                : 'btn-primary'
            }`}
          >
            {isSelected ? '✓ Selezionato' : 'Seleziona questa configurazione'}
          </button>
        </div>
      </div>
    </div>
  );
}
