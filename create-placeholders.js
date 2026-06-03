const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const bandDir = 'react-site/public/assets/img/band';
const liveDir = 'react-site/public/assets/img/live';

if (!fs.existsSync(bandDir)) fs.mkdirSync(bandDir, { recursive: true });
if (!fs.existsSync(liveDir)) fs.mkdirSync(liveDir, { recursive: true });

// Band members
const members = [
  { initials: 'AG', name: 'andrea-giardina' },
  { initials: 'SG', name: 'sergio-grandoni' },
  { initials: 'ADB', name: 'andrea-de-blasi' },
  { initials: 'PP', name: 'paulina-pieprzka' },
  { initials: 'GM', name: 'giorgio-massi' },
  { initials: 'SP', name: 'stefano-proietti' }
];

// SVG placeholder for band members
members.forEach((member) => {
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${member.name}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#5d25e0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ec1289;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#grad-${member.name})"/>
    <text x="150" y="120" font-size="48" font-weight="bold" fill="white" text-anchor="middle">${member.initials}</text>
    <text x="150" y="180" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle">${member.name.replace(/-/g, ' ')}</text>
  </svg>`;

  fs.writeFileSync(path.join(bandDir, `${member.name}.svg`), svg);
  console.log(`✓ Created ${bandDir}/${member.name}.svg`);
});

// SVG placeholder for live photos
const liveColors = [
  ['#5d25e0', '#ec1289'],
  ['#ec1289', '#ff6b6b'],
  ['#00d4ff', '#0099ff'],
  ['#00ff88', '#00ccff'],
  ['#ff00ff', '#ff0099'],
  ['#ffaa00', '#ff6600'],
  ['#00ccff', '#0066ff'],
  ['#ff0066', '#cc0099']
];

liveColors.forEach((colors, i) => {
  const num = i + 1;
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-live-${num}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#grad-live-${num})"/>
    <text x="150" y="150" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${num}</text>
  </svg>`;

  fs.writeFileSync(path.join(liveDir, `live-${String(num).padStart(2, '0')}.svg`), svg);
  console.log(`✓ Created ${liveDir}/live-${String(num).padStart(2, '0')}.svg`);
});

console.log('\n✅ Placeholder structure created!');
