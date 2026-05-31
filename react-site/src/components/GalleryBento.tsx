import { useState, useEffect } from 'react';
import { pub } from '../lib/publicUrl';

const IMGS = [
  'assets/img/live/live-01.webp',
  'assets/img/live/live-02.webp',
  'assets/img/live/live-03.webp',
  'assets/img/live/live-05.webp',
  'assets/img/live/live-06.jpg',
  'assets/img/live/live-07.webp',
  'assets/img/live/live-08.webp',
  'assets/img/live/imgi_7_width_530.jpg', // tastierista — scatto distinto in verticale
].map(pub);

export default function GalleryBento() {
  const [portrait, setPortrait] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = (src: string): Promise<[string, boolean]> =>
      new Promise(resolve => {
        const img = new Image();
        img.onload  = () => resolve([src, img.naturalHeight > img.naturalWidth * 1.1]);
        img.onerror = () => resolve([src, false]);
        img.src = src;
      });
    Promise.all(IMGS.map(load)).then(entries => setPortrait(Object.fromEntries(entries)));
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[200px] lg:auto-rows-[220px]">
      {IMGS.map((src, i) => {
        const isPortrait = portrait[src] ?? false;
        // First image: always featured 2×2
        const colSpan = i === 0 ? 'col-span-2 lg:col-span-2' : 'col-span-1 lg:col-span-1';
        const rowSpan = (i === 0 || isPortrait) ? 'row-span-2' : 'row-span-1';
        return (
          <div
            key={src}
            className={`${colSpan} ${rowSpan} card overflow-hidden group`}
          >
            <img
              src={src}
              alt={`Live ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}
