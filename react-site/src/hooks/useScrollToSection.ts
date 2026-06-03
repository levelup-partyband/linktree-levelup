import { useNavigate, useLocation } from 'react-router-dom';

/** Scroll to a section id on the home page, navigating home first if needed. */
export function useScrollToSection() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (id: string) => {
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (pathname !== '/') {
      navigate('/');
      setTimeout(scroll, 100);
    } else {
      scroll();
    }
  };
}
