import { useEffect, useRef } from 'react';
import { pub } from '../lib/publicUrl';
import logoUrl from '../assets/img/logo-levelup-clear.svg';

export type PdfFonts = { regular: string; bold: string } | null;

/**
 * Pre-loads the brand logo (as PNG data URL) and the TTF fonts (base64) used by
 * the jsPDF generators. Shared by the quote PDF and the wedding-brief PDF.
 */
export function usePdfAssets() {
  const logoDataRef = useRef<string | null>(null);
  const fontDataRef = useRef<PdfFonts>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 300;
      canvas.height = img.height || 260;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      logoDataRef.current = canvas.toDataURL('image/png');
    };
    img.src = logoUrl;

    const loadFont = (url: string): Promise<string> =>
      fetch(url)
        .then(r => r.arrayBuffer())
        .then(buf => {
          let bin = '';
          new Uint8Array(buf).forEach(b => { bin += String.fromCharCode(b); });
          return btoa(bin);
        });

    Promise.all([
      loadFont(pub('fonts/CocomatPro-Regular.ttf')),
      loadFont(pub('fonts/CocomatPro-Bold.ttf')),
    ])
      .then(([regular, bold]) => { fontDataRef.current = { regular, bold }; })
      .catch(() => {});
  }, []);

  return { logoDataRef, fontDataRef };
}
