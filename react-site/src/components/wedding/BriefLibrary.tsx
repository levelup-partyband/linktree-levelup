import { useEffect, useRef, useState } from 'react';
import {
  listBriefs, deleteBrief, setArchived, exportBrief, importBriefFile, type SavedBrief,
} from '../../lib/briefStorage';

type Props = {
  onClose: () => void;
  onOpen: (b: SavedBrief) => void;
  currentId: string | null;
};

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function BriefLibrary({ onClose, onOpen, currentId }: Props) {
  const [items, setItems] = useState<SavedBrief[]>(() => listBriefs());
  const [showArchived, setShowArchived] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const refresh = () => setItems(listBriefs());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const active = items.filter(b => !b.archived);
  const archived = items.filter(b => b.archived);

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try { await importBriefFile(file); refresh(); }
    catch { alert('File non valido.'); }
  };

  const Item = ({ b }: { b: SavedBrief }) => (
    <div className={`flex items-center gap-2 p-3 rounded-xl border ${b.id === currentId ? 'border-brand-pink/60 bg-brand-pink/5' : 'border-white/10 bg-white/5'}`}>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white truncate">{b.name || 'Senza nome'}</div>
        <div className="text-[11px] text-white/45">{fmtDate(b.savedAt)}{b.id === currentId ? ' · in modifica' : ''}</div>
      </div>
      <button onClick={() => onOpen(b)} className="px-3 py-1.5 rounded-full bg-brand-pink text-white text-xs font-semibold shrink-0">Apri</button>
      <button onClick={() => { setArchived(b.id, !b.archived); refresh(); }} title={b.archived ? 'Ripristina' : 'Archivia'} className="px-2 py-1.5 rounded-full border border-white/20 text-white/60 hover:text-white text-xs shrink-0">
        {b.archived ? '⤺' : '🗄'}
      </button>
      <button onClick={() => exportBrief(b)} title="Esporta JSON" className="px-2 py-1.5 rounded-full border border-white/20 text-white/60 hover:text-white text-xs shrink-0">⤓</button>
      <button onClick={() => { if (confirm(`Eliminare "${b.name}"?`)) { deleteBrief(b.id); refresh(); } }} title="Elimina" className="px-2 py-1.5 rounded-full border border-white/20 text-white/60 hover:text-brand-pink text-xs shrink-0">🗑</button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Libreria brief" className="card max-w-lg w-full p-6 bg-brand-navy max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl">Libreria brief</h3>
          <button onClick={onClose} aria-label="Chiudi" className="text-white/60 hover:text-brand-pink text-2xl leading-none">×</button>
        </div>

        {active.length === 0 && (
          <p className="text-sm text-white/50 mb-4">Nessun brief salvato. Compila il brief e premi “Salva”.</p>
        )}

        <div className="space-y-2">
          {active.map(b => <Item key={b.id} b={b} />)}
        </div>

        {archived.length > 0 && (
          <div className="mt-4">
            <button onClick={() => setShowArchived(s => !s)} className="text-xs text-white/50 hover:text-white">
              {showArchived ? '▾' : '▸'} Archiviati ({archived.length})
            </button>
            {showArchived && <div className="space-y-2 mt-2 opacity-70">{archived.map(b => <Item key={b.id} b={b} />)}</div>}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={e => handleImport(e.target.files?.[0])} />
          <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm justify-center">Importa JSON</button>
          <span className="text-[11px] text-white/40">I brief sono salvati in questo browser. Esporta in JSON per backup o per usarli su un altro dispositivo.</span>
        </div>
      </div>
    </div>
  );
}
