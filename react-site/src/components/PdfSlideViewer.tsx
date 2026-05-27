import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore - vite asset import
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

type Props = { url: string; downloadUrl?: string };

export default function PdfSlideViewer({ url, downloadUrl }: Props) {
  const [pdf, setPdf] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [renderedPage, setRenderedPage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);

  // Load PDF document
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    pdfjsLib.getDocument(url).promise.then(doc => {
      if (cancelled) return;
      setPdf(doc);
      setNumPages(doc.numPages);
      setPageNum(1);
    }).catch(err => {
      console.error('PDF load error', err);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [url]);

  // Render current page
  const renderPage = useCallback(async (page: number) => {
    if (!pdf) return;
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch {}
    }
    setLoading(true);
    const pageObj = await pdf.getPage(page);
    const viewport = pageObj.getViewport({ scale: 1 });

    // Render off-screen at 2x for crispness
    const scale = Math.min(2, (1600 / viewport.width));
    const finalViewport = pageObj.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = finalViewport.width;
    canvas.height = finalViewport.height;
    const ctx = canvas.getContext('2d')!;

    const task = pageObj.render({ canvasContext: ctx, viewport: finalViewport });
    renderTaskRef.current = task;
    try {
      await task.promise;
      setRenderedPage(canvas.toDataURL('image/png'));
      setLoading(false);
    } catch (e: any) {
      if (e?.name !== 'RenderingCancelledException') {
        console.error(e);
        setLoading(false);
      }
    }
  }, [pdf]);

  useEffect(() => { if (pdf) renderPage(pageNum); }, [pdf, pageNum, renderPage]);

  const next = useCallback(() => setPageNum(p => Math.min(numPages, p + 1)), [numPages]);
  const prev = useCallback(() => setPageNum(p => Math.max(1, p - 1)), []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape' && fullscreen) setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, fullscreen]);

  // Body scroll lock when fullscreen
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [fullscreen]);

  const slide = (
    <div
      className={`relative ${fullscreen
        ? 'fixed inset-0 z-[100] bg-brand-navy-deep/95 backdrop-blur-md flex flex-col p-4 sm:p-8'
        : 'rounded-2xl overflow-hidden border border-white/10 bg-black/40'}
      `}
      ref={containerRef}
    >
      {/* TOOLBAR */}
      <div className={`flex items-center justify-between gap-3 ${fullscreen ? 'mb-4' : 'px-4 py-3 border-b border-white/10 bg-brand-navy/60'}`}>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/70">Pagina</span>
          <span className="font-display text-brand-pink text-lg tracking-wider">
            {pageNum}<span className="text-white/40">/{numPages || '–'}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFullscreen(f => !f)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={fullscreen ? 'Esci da fullscreen' : 'Fullscreen'}
            title={fullscreen ? 'Esci (ESC)' : 'Fullscreen'}
          >
            {fullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 9H4M9 9V4M9 9l-5-5M15 9h5M15 9V4M15 9l5-5M9 15H4M9 15v5M9 15l-5 5M15 15h5M15 15v5M15 15l5 5" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
            )}
          </button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Scarica PDF"
              title="Scarica PDF"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* SLIDE */}
      <div className={`relative ${fullscreen ? 'flex-1 flex items-center justify-center min-h-0' : ''}`}>
        <div className={`${fullscreen ? 'max-h-full max-w-full' : 'aspect-video bg-black/50'} relative w-full flex items-center justify-center`}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-brand-pink border-t-transparent animate-spin" />
            </div>
          )}
          {renderedPage && (
            <img
              src={renderedPage}
              alt={`Slide ${pageNum}`}
              onClick={next}
              className={`${fullscreen ? 'max-h-[calc(100vh-9rem)] max-w-full object-contain' : 'w-full h-full object-contain'} cursor-pointer select-none transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}
              draggable={false}
            />
          )}

          {/* PREV */}
          {pageNum > 1 && (
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-navy-deep/70 hover:bg-brand-pink border border-white/15 hover:border-brand-pink flex items-center justify-center transition-all shadow-lg backdrop-blur"
              aria-label="Pagina precedente"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
          )}
          {/* NEXT */}
          {pageNum < numPages && (
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-navy-deep/70 hover:bg-brand-pink border border-white/15 hover:border-brand-pink flex items-center justify-center transition-all shadow-lg backdrop-blur"
              aria-label="Pagina successiva"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          )}
        </div>

        {/* THUMBNAILS / PROGRESS DOTS */}
        {numPages > 1 && (
          <div className={`${fullscreen ? 'mt-4' : 'px-4 py-3 border-t border-white/10 bg-brand-navy/40'}`}>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {Array.from({ length: numPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPageNum(i + 1)}
                  className={`h-1.5 rounded-full transition-all ${
                    i + 1 === pageNum ? 'w-8 bg-brand-pink' : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Vai alla pagina ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return slide;
}
