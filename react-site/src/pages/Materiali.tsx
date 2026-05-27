import { useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import PdfSlideViewer from '../components/PdfSlideViewer';
import { materiali } from '../data/materiali';
import { SocialLinksPills } from '../components/SocialLinks';
import { CONTACTS } from '../lib/contacts';

const iconaPerFormato: Record<string, string> = {
  PDF: '📄',
  SVG: '🎨',
};

const pdfPresentazione = 'https://levelup-partyband.github.io/linktree-levelup/assets/resources/LEVEL%20UP%20-%20Presentazione%202k25.pdf';

export default function Materiali() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-x py-16">
      <SectionHeading
        kicker="Resources"
        title="Materiali per organizzatori"
        sub="Sfoglia la presentazione e scarica locandine, stage plan e logo."
      />

      {/* PRESENTAZIONE PDF SFOGLIABILE */}
      <div className="mb-16">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-brand-pink mb-2">Sfoglia online</div>
            <h2 className="h-display text-3xl sm:text-4xl tracking-wider">PRESENTAZIONE PDF</h2>
            <p className="text-white/70 text-sm mt-1 max-w-xl">
              Naviga con le frecce, la tastiera (← →) o clicca sulla slide per avanzare.
            </p>
          </div>
        </div>
        <PdfSlideViewer url={pdfPresentazione} downloadUrl={pdfPresentazione} />
      </div>

      {/* ALTRI MATERIALI */}
      <div className="mb-12">
        <h2 className="font-display text-2xl text-white mb-6 tracking-widest">DOWNLOAD MATERIALI</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {materiali.map(m => (
            <a
              key={m.nome}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 hover:border-brand-pink/60 hover:shadow-glow transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{iconaPerFormato[m.formato] || '📦'}</div>
                <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-brand-pink/15 text-brand-pink font-semibold">
                  {m.formato}
                </span>
              </div>
              <h3 className="font-display text-lg text-white mb-2 group-hover:text-brand-pink transition-colors">{m.nome}</h3>
              <p className="text-sm text-white/70">{m.descrizione}</p>
              <div className="mt-4 flex items-center gap-2 text-brand-pink text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Scarica <span>↓</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="card p-8 bg-gradient-to-r from-brand-pink/20 to-brand-purple/30">
        <h3 className="font-display text-2xl mb-3">Hai bisogno di altri file?</h3>
        <p className="text-white/80 mb-5">
          Se cerchi materiali specifici (foto in alta risoluzione, branding assets, altro), contattaci direttamente.
        </p>
        <SocialLinksPills waUrl={CONTACTS.whatsappMateriali} />
      </div>
    </div>
  );
}
