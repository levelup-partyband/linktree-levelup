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

// Masonry layout (CSS columns): each photo keeps its natural aspect ratio,
// portraits stay tall and landscapes stay wide, flowing into balanced columns.
export default function GalleryBento() {
  return (
    <div className="columns-2 lg:columns-3 gap-3 [column-fill:_balance]">
      {IMGS.map((src, i) => (
        <div key={src} className="mb-3 break-inside-avoid card overflow-hidden group">
          <img
            src={src}
            alt={`Level Up live ${i + 1}`}
            className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
