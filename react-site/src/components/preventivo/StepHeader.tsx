export default function StepHeader({ num, title, subtitle }: { num: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="font-display text-3xl text-brand-pink/50 leading-none">{num}</div>
      <div className="flex items-baseline gap-3 flex-1">
        <h3 className="font-display text-xl text-white tracking-widest">{title}</h3>
        {subtitle && <span className="text-[10px] uppercase tracking-widest text-white/40">{subtitle}</span>}
      </div>
    </div>
  );
}
