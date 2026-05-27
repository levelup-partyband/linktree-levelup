export default function SectionHeading({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="mb-10">
      <span className="accent-line mb-4" />
      {kicker && <div className="text-xs uppercase tracking-[0.3em] text-brand-pink mb-2">{kicker}</div>}
      <h2 className="h-display text-4xl sm:text-5xl md:text-6xl">{title}</h2>
      {sub && <p className="text-white/70 mt-3 max-w-2xl">{sub}</p>}
    </div>
  );
}
