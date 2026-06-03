const fs = require('fs');
const path = require('path');

const serviceDir = 'react-site/public/assets/img/service';

if (!fs.existsSync(serviceDir)) fs.mkdirSync(serviceDir, { recursive: true });

// Service configurations
const configs = [
  { num: '01', color1: '#5d25e0', color2: '#ec1289' },
  { num: '02', color1: '#ec1289', color2: '#ff6b6b' },
  { num: '03', color1: '#00d4ff', color2: '#0099ff' },
  { num: '04', color1: '#ffaa00', color2: '#ff6600' }
];

configs.forEach((config) => {
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-config-${config.num}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${config.color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${config.color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#grad-config-${config.num})"/>
    <text x="150" y="120" font-size="36" font-weight="bold" fill="white" text-anchor="middle">CONFIG.</text>
    <text x="150" y="160" font-size="48" font-weight="bold" fill="white" text-anchor="middle">${config.num}</text>
  </svg>`;

  fs.writeFileSync(path.join(serviceDir, `config-${config.num}.svg`), svg);
  console.log(`✓ Created ${serviceDir}/config-${config.num}.svg`);
});

console.log('\n✅ Service configuration placeholders created!');
