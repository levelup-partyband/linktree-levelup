import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logoClear from './assets/img/logo-levelup-clear.svg';
import { useScrollToSection } from './hooks/useScrollToSection';
import { SocialLinksFooter } from './components/SocialLinks';
import StructuredData from './components/StructuredData';

type NavItem =
  | { kind: 'route'; to: string; label: string; end?: boolean }
  | { kind: 'scroll'; id: string; label: string };

const NAV_LINKS: NavItem[] = [
  { kind: 'route',  to: '/', label: 'Home', end: true },
  { kind: 'scroll', id: 'video',    label: 'Video' },
  { kind: 'scroll', id: 'show',     label: 'Show' },
  { kind: 'scroll', id: 'band',     label: 'Band' },
  { kind: 'scroll', id: 'scaletta', label: 'Scaletta' },
  { kind: 'route',  to: '/eventi',    label: 'Eventi' },
  { kind: 'route',  to: '/materiali', label: 'Materiali' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-brand-pink' : 'hover:text-brand-pink transition-colors';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const scrollTo = useScrollToSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const renderLink = (item: NavItem, mobile = false) => {
    if (item.kind === 'route') {
      return (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          onClick={item.to === '/' ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}
          className={mobile ? undefined : navLinkClass}
        >
          {item.label}
        </NavLink>
      );
    }
    return (
      <a key={item.label} onClick={() => scrollTo(item.id)} className="cursor-pointer hover:text-brand-pink transition-colors">
        {item.label}
      </a>
    );
  };

  return (
    <>
      <StructuredData />
      <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'bg-brand-navy-deep/85 backdrop-blur border-b border-white/10' : 'bg-transparent'}`}>
        <div className="container-x flex items-center justify-between h-16">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center">
            <span className="font-display font-black text-2xl tracking-wider text-white">LEVEL UP</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {NAV_LINKS.map(item => renderLink(item))}
            <a onClick={() => scrollTo('contatti')} className="btn-primary !py-2 !px-4 text-sm cursor-pointer">Contattaci</a>
          </nav>
          <button className="md:hidden p-2 text-white" onClick={() => setOpen(!open)} aria-label="menu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        {open && (
          <div className="md:hidden bg-brand-navy-deep/95 border-t border-white/10">
            <div className="container-x py-4 flex flex-col gap-3 text-sm">
              {NAV_LINKS.map(item => renderLink(item, true))}
              <a onClick={() => scrollTo('contatti')} className="btn-primary self-start text-sm !py-2 !px-4 cursor-pointer">Contattaci</a>
            </div>
          </div>
        )}
      </header>

      <main className="pt-16">
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-white/10">
        <div className="container-x py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoClear} alt="Level Up" className="h-10" />
            <div>
              <div className="font-display text-xl tracking-wider">LEVEL UP</div>
              <div className="text-xs text-white/60">Discoteca live anni '90/2000</div>
            </div>
          </div>
          <SocialLinksFooter />
        </div>
        <div className="container-x pb-6 text-xs text-white/40">© {new Date().getFullYear()} LEVEL UP Party Band</div>
      </footer>
    </>
  );
}
