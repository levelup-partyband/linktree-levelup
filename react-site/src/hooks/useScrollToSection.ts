export function useScrollToSection() {
  return (id: string) => {
    window.location.hash = '#/';
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
  };
}
