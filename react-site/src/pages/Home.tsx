import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useScrollToSection } from '../hooks/useScrollToSection';
import SectionHeading from '../components/SectionHeading';
import EventCard from '../components/EventCard';
import { band } from '../data/band';
import { setlist } from '../data/setlist';
import { serviceConfigs } from '../data/service';
import { upcoming, eventi2026 } from '../data/events';
import logoClear from '../assets/img/logo-levelup-clear.svg';
import GalleryBento from '../components/GalleryBento';
import { SocialLinksCards } from '../components/SocialLinks';
import { CONTACTS } from '../lib/contacts';
import { pub } from '../lib/publicUrl';
import HeroNextDate from '../components/HeroNextDate';

export default function Home() {
  const scrollTo = useScrollToSection();
  const navigate = useNavigate();
  const logoClicks = useRef(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prossimi = upcoming(eventi2026).slice(0, 6);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const data = { title: 'LEVEL UP — Party Band', text: 'La discoteca live anni \'90/2000 🎶', url: 'https://levelup-partyband.github.io/linktree-levelup/' };
    if (navigator.share) {
      await navigator.share(data);
    } else {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHeroLogoClick = () => {
    logoClicks.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);
    if (logoClicks.current >= 10) {
      logoClicks.current = 0;
      navigate('/preventivo');
    } else {
      logoTimer.current = setTimeout(() => {
        logoClicks.current = 0;
      }, 5000);
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-grid">
        <div className="blob w-72 h-72 -top-10 -right-10 animate-pulseGlow" style={{ animationDelay: '0s' }} />
        <div className="blob w-40 h-40 top-40 left-10 opacity-70 animate-floatyDeep" style={{ animationDelay: '1.3s' }} />
        <div className="blob w-60 h-60 -bottom-20 right-40 opacity-60 animate-wobble" style={{ animationDelay: '2.7s' }} />

        <div className="container-x py-16 md:py-24 relative">
          <div className="text-center flex flex-col items-center">
            <div className="text-xs uppercase tracking-[0.4em] text-brand-pink mb-6">levelup.partyband</div>

            {/* LOGO — il brand mark ufficiale */}
            <div className="relative w-full max-w-md">
              <img
                src={logoClear}
                alt="LEVEL UP — Party Band"
                className="relative w-full cursor-pointer select-none"
                onClick={handleHeroLogoClick}
                draggable={false}
              />
            </div>

            <p className="mt-8 max-w-2xl mx-auto text-white/75 text-base md:text-lg">
              Non una semplice cover band: <strong className="text-white">una discoteca live</strong> che fa rivivere
              l'energia dei club anni '90 e 2000 con medley no-stop in stile DJ set e la potenza di una vera band.
            </p>

            <div className="mt-8 flex justify-center">
              <HeroNextDate />
            </div>

            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <a onClick={() => scrollTo('show')} className="btn-primary cursor-pointer">Scopri lo show</a>
              <a onClick={() => scrollTo('contatti')} className="btn-ghost cursor-pointer">Richiedi disponibilità →</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROSSIMI EVENTI */}
      <section className="container-x py-20 relative">
        <div className="blob w-48 h-48 top-10 -right-8 opacity-30 pointer-events-none animate-drift2" style={{ animationDelay: '0.8s' }} />
        <SectionHeading kicker="Date" title="Prossime date" />
        <div className="grid sm:grid-cols-2 gap-4">
          {prossimi.map(e => <EventCard key={e.nome + e.data} e={e} />)}
        </div>
        <div className="mt-6">
          <Link to="/eventi" className="btn-ghost">Tutti gli eventi</Link>
        </div>
      </section>

      {/* VIDEO PROMO */}
      <section id="video" className="container-x py-20 relative">
        <div className="blob w-64 h-64 -top-10 -left-16 opacity-35 pointer-events-none animate-floatyAlt" style={{ animationDelay: '3.2s' }} />
        <div className="blob w-32 h-32 bottom-10 right-0 opacity-25 pointer-events-none animate-wobble" style={{ animationDelay: '1.5s' }} />
        <SectionHeading kicker="Watch" title="Video promo" sub="Guarda LEVEL UP in azione: l'energia di un live anni '90/2000." />
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/20 via-transparent to-brand-purple/20 pointer-events-none z-10" />
          <div className="aspect-video bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/xkx06gYhgnM?rel=0"
              title="LEVEL UP — Video promo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href={CONTACTS.instagramProfile} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Tutti i video su Instagram →
          </a>
        </div>
      </section>

      {/* CHI SIAMO */}
      <section id="chisiamo" className="container-x py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] card overflow-hidden group">
            <img src={pub('assets/img/live/princpale.webp')} alt="Level Up live" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy-deep/80 via-brand-purple/30 to-transparent" />
            <div className="blob w-32 h-32 -bottom-6 -left-6 opacity-60 animate-floaty" style={{ animationDelay: '2.1s' }} />
          </div>
          <div>
            <SectionHeading kicker="Chi siamo" title="Una vera discoteca live" />
            <div className="space-y-4 text-white/80">
              <p>
                LEVEL UP non è una semplice cover band, ma una <strong>discoteca dal vivo</strong> che fa rivivere
                l'energia e i meravigliosi ricordi dei club anni '90 e 2000, con medley no-stop in stile DJ set e
                tutta la potenza di una vera band live.
              </p>
              <p className="text-brand-pink font-semibold">LEVEL UP – La discoteca live anni '90/2000.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LO SHOW */}
      <section id="show" className="container-x py-20 relative">
        <div className="blob w-80 h-80 -top-10 right-0 opacity-40 pointer-events-none animate-drift2" style={{ animationDelay: '0.4s' }} />
        <div className="blob w-44 h-44 bottom-0 left-20 opacity-30 pointer-events-none animate-floatyDeep" style={{ animationDelay: '4.1s' }} />
        <div className="blob w-24 h-24 top-1/2 left-1/2 opacity-20 pointer-events-none animate-pulseGlow" style={{ animationDelay: '1.9s' }} />
        <SectionHeading kicker="Lo show" title="Uno spettacolo di musica e luci" sub="Un'esperienza in cui il live incontra la pista da ballo: energia, medley no-stop e repertorio anni '90/2000." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: 'Medley no-stop', d: 'In stile DJ set, senza pause.' },
            { t: 'Visual & luci', d: 'Proiezioni, luci sincronizzate, ballerine.' },
            { t: 'Repertorio enorme', d: "Da Corona e Gigi D'Agostino a Beyoncé, Avicii, Lady Gaga, 883 e Jovanotti." },
            { t: 'Pubblico coinvolto', d: 'Canto, ballo, partecipazione.' },
          ].map(x => (
            <div key={x.t} className="card p-6 hover:border-brand-pink/60 transition-colors">
              <div className="font-display text-2xl text-brand-pink mb-2">{x.t}</div>
              <p className="text-white/70 text-sm">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SU MISURA */}
      <section className="container-x py-20 relative">
        <div className="blob w-60 h-60 top-5 -right-12 opacity-35 pointer-events-none animate-wobble" style={{ animationDelay: '3.6s' }} />
        <div className="blob w-36 h-36 -bottom-8 left-10 opacity-25 pointer-events-none animate-floatyAlt" style={{ animationDelay: '0.6s' }} />
        <SectionHeading kicker="Su misura" title="Uno show su misura" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-7">
            <div className="font-display text-brand-pink text-xl mb-3">BAND</div>
            <p className="text-white/75 text-sm leading-relaxed">
              Formazione live a 6 elementi: groove di batteria e basso, riff di chitarra, synth e tastiere con i suoni originali,
              più due voci coinvolgenti. Due ore di vero live.
            </p>
          </div>
          <div className="card p-7">
            <div className="font-display text-brand-pink text-xl mb-3">SERVICE MODULARE</div>
            <p className="text-white/75 text-sm leading-relaxed">
              Dal service base alle strutture più imponenti: audio, luci, palco e scenografie personalizzabili.
              Ogni livello aggiunge spettacolarità.
            </p>
          </div>
          <div className="card p-7">
            <div className="font-display text-brand-pink text-xl mb-3">EXTRA & FX</div>
            <ul className="text-white/75 text-sm space-y-1.5">
              <li>• LED wall in diverse dimensioni</li>
              <li>• Macchine del fumo, geyser, sparkular</li>
              <li>• Effetti luce dinamici e immersivi</li>
              <li>• Ballerini per un impatto extra</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BAND */}
      <section id="band" className="container-x py-20 relative">
        <div className="blob w-96 h-96 -top-20 -right-10 opacity-40 pointer-events-none animate-floatyDeep" style={{ animationDelay: '2.4s' }} />
        <div className="blob w-56 h-56 bottom-10 left-0 opacity-30 pointer-events-none animate-drift2" style={{ animationDelay: '5.0s' }} />
        <div className="blob w-28 h-28 top-1/3 right-1/3 opacity-20 pointer-events-none animate-pulseGlow" style={{ animationDelay: '1.1s' }} />
        <SectionHeading kicker="La band" title="Sei elementi, un'unica festa" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {band.map(m => (
            <div key={m.name} className="card p-4 text-center hover:border-brand-pink/60 transition-colors group">
              <div className="aspect-[3/4] mb-3 rounded-xl overflow-hidden">
                <img
                  src={pub(m.photo.src)}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: m.photo.pos }}
                  loading="lazy"
                />
              </div>
              <div className="font-display font-black text-brand-pink text-sm tracking-widest leading-tight">{m.name.toUpperCase()}</div>
              <div className="text-xs text-white/60 mt-1">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SCALETTA */}
      <section id="scaletta" className="container-x py-20 relative">
        <div className="blob w-96 h-96 top-20 -left-20 opacity-35 pointer-events-none animate-wobble" style={{ animationDelay: '0.2s' }} />
        <div className="blob w-60 h-60 bottom-0 right-10 opacity-35 pointer-events-none animate-floatyAlt" style={{ animationDelay: '3.9s' }} />
        <div className="blob w-32 h-32 top-0 right-1/4 opacity-20 pointer-events-none animate-drift2" style={{ animationDelay: '2.0s' }} />
        <SectionHeading kicker="Setlist" title={`La scaletta ${new Date().getFullYear()}`} sub="10 blocchi, ~2 ore di pura energia anni '90/2000." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {setlist.map(m => (
            <div key={m.title} className="card p-5">
              <div className="font-display text-brand-pink text-lg mb-3 tracking-wide">{m.title}</div>
              <ul className="text-sm text-white/75 space-y-1">
                {m.tracks.map(t => <li key={t}>• {t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE */}
      <section id="service" className="container-x py-20 relative">
        <div className="blob w-72 h-72 -top-16 -left-20 opacity-45 pointer-events-none animate-floaty" style={{ animationDelay: '1.7s' }} />
        <div className="blob w-48 h-48 bottom-10 right-0 opacity-35 pointer-events-none animate-pulseGlow" style={{ animationDelay: '4.5s' }} />
        <div className="blob w-24 h-24 top-1/2 right-1/4 opacity-20 pointer-events-none animate-wobble" style={{ animationDelay: '0.9s' }} />
        <SectionHeading kicker="Service" title="Configurazioni palco" sub="Quattro allestimenti, dal più essenziale al più imponente: scegli quanto far salire l'asticella." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceConfigs.map(c => (
            <div key={c.code} className="card overflow-hidden">
              <div className="relative aspect-square bg-gradient-to-br from-brand-navy-deep to-brand-navy overflow-hidden">
                <img
                  src={pub(`assets/img/service/${c.image}`)}
                  alt={c.code}
                  className="absolute inset-0 w-full h-full object-cover invert"
                  style={{ objectPosition: '50% 55%' }}
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="font-display text-brand-pink text-xl mb-3 tracking-widest">{c.code}</div>
                <ul className="text-sm text-white/75 space-y-1.5">
                  {c.rows.map(r => <li key={r}>• {r}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="container-x py-20 relative">
        <div className="blob w-72 h-72 top-0 right-10 opacity-40 pointer-events-none animate-drift2" style={{ animationDelay: '3.3s' }} />
        <div className="blob w-40 h-40 bottom-20 left-0 opacity-35 pointer-events-none animate-floatyDeep" style={{ animationDelay: '1.4s' }} />
        <div className="blob w-28 h-28 bottom-0 right-1/3 opacity-20 pointer-events-none animate-floatyAlt" style={{ animationDelay: '5.5s' }} />
        <SectionHeading kicker="Live" title="Sul palco" sub="Adrenalina, luci, divertimento puro." />
        <GalleryBento />
      </section>

      {/* CONTATTI */}
      <section id="contatti" className="container-x py-20">
        <div className="card p-8 md:p-12 relative overflow-hidden">
          <div className="blob w-60 h-60 -top-10 -right-10 opacity-50 animate-wobble" style={{ animationDelay: '2.6s' }} />
          <div className="relative">
            <SectionHeading kicker="Contattaci" title="Scrivici direttamente" />
            <p className="text-white/75 max-w-2xl mb-8">
              Clicca sul canale che preferisci: ti rispondiamo subito.
            </p>

            <SocialLinksCards />

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-brand-pink hover:text-brand-pink transition-all text-sm font-semibold"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    Link copiato!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                    Condividi
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
