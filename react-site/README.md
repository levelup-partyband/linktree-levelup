# LEVEL UP — React Site

Sito vetrina della band **LEVEL UP** in React + Vite + Tailwind.
Progetto **parallelo** al sito linktree esistente in root (che resta intatto e pubblicato su GitHub Pages).

## Stack
- Vite 5 + React 18 + TypeScript
- Tailwind CSS 3
- React Router (HashRouter — compatibile con GitHub Pages senza configurazione server)
- jsPDF (generazione preventivo)

## Avvio

```powershell
cd react-site
npm install
npm run dev
```

Apre http://localhost:5173

## Build di produzione

```powershell
npm run build
npm run preview
```

L'output sta in `react-site/dist/`.

## Struttura

```
react-site/
├── public/              # asset statici (favicon)
├── src/
│   ├── assets/img/      # logo, sfondi
│   ├── components/      # componenti riutilizzabili
│   ├── data/            # band, setlist, eventi, preventivo, service
│   ├── pages/           # Home, Eventi, Preventivo
│   ├── App.tsx          # layout (header + footer)
│   ├── main.tsx         # entry + router
│   └── index.css        # Tailwind + custom layer
└── index.html
```

## Sezioni Home
Hero · Chi siamo · Lo show · Su misura · La band · Scaletta 2025 · Service · Gallery · Prossime date · Contatti

## Note
- Le foto della band/live sono placeholder (gradient). Aggiungi foto reali in `src/assets/img/live/` e referenziale nelle pagine.
- I dati eventi sono in `src/data/events.ts` — stessa struttura del vecchio `scripts/events-list.js`.
- Il preventivo gira tutto client-side, scarica PDF via jsPDF (no più html2canvas/screenshot — testo nativo, più leggero).

## Deploy su GitHub Pages (opzionale)
Se in futuro vuoi pubblicare anche questo:
1. Pubblica `dist/` su una branch dedicata (es. `react-site-pages`) o sotto `/docs`.
2. Lascia il sito attuale in root invariato.
3. `base: './'` in `vite.config.ts` è già impostato per path relativi.
