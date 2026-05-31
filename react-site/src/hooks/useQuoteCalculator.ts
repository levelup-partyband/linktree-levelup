import { useMemo, useState } from 'react';
import { bandCost, quoteCategories, QuoteCategory, QuoteItem } from '../data/preventivo';

export type Selection = Record<string, { item: QuoteItem; qty: number; category: string }>;

/**
 * Owns all quote selection + pricing state for the Preventivo page.
 * Keeps the page component focused on layout while the math lives here.
 */
export function useQuoteCalculator() {
  const bandPrice = bandCost.cost;
  const [selection, setSelection] = useState<Selection>({});
  const [discount, setDiscount] = useState(0);

  const serviceCategory = quoteCategories.find(c => c.name === 'SERVICE')!;
  const ledwallCategory = quoteCategories.find(c => c.name === 'LEDWALL')!;
  const extraCategory   = quoteCategories.find(c => c.name === 'EXTRA')!;

  const subtotal = useMemo(
    () => bandPrice + Object.values(selection).reduce((s, x) => s + x.item.cost * x.qty, 0),
    [bandPrice, selection]
  );
  const total = Math.max(0, subtotal - discount);

  const isSelected = (id: string) => selection[id]?.qty > 0;

  const toggleUnique = (cat: QuoteCategory, item: QuoteItem) => {
    setSelection(prev => {
      const next = { ...prev };
      cat.items.forEach(i => { if (next[i.id]) delete next[i.id]; });
      if (!prev[item.id]) next[item.id] = { item, qty: 1, category: cat.name };
      return next;
    });
  };

  const changeQty = (cat: QuoteCategory, item: QuoteItem, delta: number) => {
    setSelection(prev => {
      const next = { ...prev };
      const cur = next[item.id]?.qty || 0;
      const v = Math.max(0, cur + delta);
      if (v === 0) delete next[item.id];
      else next[item.id] = { item, qty: v, category: cat.name };
      return next;
    });
  };

  return {
    bandPrice,
    selection,
    selectedItems: Object.values(selection),
    discount, setDiscount,
    subtotal, total,
    serviceCategory, ledwallCategory, extraCategory,
    isSelected, toggleUnique, changeQty,
  };
}
