export function artworkSVG(art, large=false) {
  const w = large ? 600 : 400, h = large ? 800 : 500;
  const cat = art.category;
  if (cat === 'charcoal') return charcoalSVG(art, w, h);
  if (cat === 'oil-painting') return oilSVG(art, w, h);
  if (cat === 'pencil-sketch') return pencilSVG(art, w, h);
  if (cat === 'acrylic-painting') return acrylicSVG(art, w, h);
  if (cat === 'acrylic-fiber-portrait') return fiberSVG(art, w, h);
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#2a2a2a"/></svg>`;
}

function charcoalSVG(art, w, h) {
  const seed = art.id.charCodeAt(art.id.length-1);
  const cx = w/2, cy = h*0.38;
  const tx = seed % 2 === 0 ? '#7a6050' : '#8a7060';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#181614"/>
    <defs>
      <radialGradient id="cg${seed}" cx="50%" cy="38%" r="50%">
        <stop offset="0%" stop-color="${tx}" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="#080806" stop-opacity="1"/>
      </radialGradient>
      <filter id="cf${seed}"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="n"/><feBlend in="SourceGraphic" in2="n" mode="multiply"/></filter>
    </defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${w*0.28}" ry="${h*0.24}" fill="url(#cg${seed})" filter="url(#cf${seed})"/>
    <ellipse cx="${cx-w*0.07}" cy="${cy-h*0.02}" rx="${w*0.04}" ry="${h*0.025}" fill="#0d0b09" opacity="0.8"/>
    <ellipse cx="${cx+w*0.07}" cy="${cy-h*0.02}" rx="${w*0.04}" ry="${h*0.025}" fill="#0d0b09" opacity="0.8"/>
    <path d="M${cx-w*0.05} ${cy+h*0.055} Q${cx} ${cy+h*0.075} ${cx+w*0.05} ${cy+h*0.055}" stroke="#6a3a2a" stroke-width="${w*0.006}" fill="none" stroke-linecap="round"/>
    <ellipse cx="${cx}" cy="${cy-h*0.14}" rx="${w*0.3}" ry="${h*0.12}" fill="#100e0c" opacity="0.9"/>
    <path d="M${cx-w*0.28} ${cy+h*0.22} Q${cx-w*0.2} ${cy+h*0.18} ${cx} ${cy+h*0.2} Q${cx+w*0.2} ${cy+h*0.18} ${cx+w*0.28} ${cy+h*0.22} L${cx+w*0.35} ${h} L${cx-w*0.35} ${h} Z" fill="#1c1610" opacity="0.9"/>
    <ellipse cx="${cx-w*0.07}" cy="${cy-h*0.05}" rx="${w*0.014}" ry="${h*0.013}" fill="white" opacity="0.35"/>
    <text x="${cx}" y="${h-h*0.04}" text-anchor="middle" fill="#c9a84c" font-family="Cormorant Garamond" font-size="${w*0.035}" font-style="italic" opacity="0.65">${art.title}</text>
  </svg>`;
}

function oilSVG(art, w, h) {
  const seed = art.id.charCodeAt(art.id.length-1);
  const warm = seed % 3 === 0;
  const sky1 = warm ? '#e8762a' : '#2a4a8a', sky2 = warm ? '#f0a855' : '#4a6ab0', sky3 = warm ? '#c94830' : '#1a3060';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="og${seed}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${sky1}"/>
        <stop offset="50%" stop-color="${sky2}"/>
        <stop offset="100%" stop-color="${sky3}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#og${seed})"/>
    <circle cx="${w*0.5}" cy="${h*0.3}" r="${w*0.11}" fill="${warm?'#ffd060':'#ffeebb'}" opacity="0.85"/>
    <ellipse cx="${w*0.25}" cy="${h*0.22}" rx="${w*0.18}" ry="${h*0.065}" fill="${warm?'#f8c87a':'#c8d8f0'}" opacity="0.45"/>
    <ellipse cx="${w*0.78}" cy="${h*0.18}" rx="${w*0.2}" ry="${h*0.055}" fill="${warm?'#f4b860':'#b8ccee'}" opacity="0.4"/>
    <rect x="0" y="${h*0.62}" width="${w}" height="${h*0.38}" fill="${warm?'#3a2010':'#0a1428'}"/>
    <path d="M0 ${h*0.65} Q${w*0.25} ${h*0.6} ${w*0.5} ${h*0.64} Q${w*0.75} ${h*0.68} ${w} ${h*0.62}" stroke="${warm?'#e88040':'#6090d0'}" stroke-width="${h*0.005}" fill="none" opacity="0.55"/>
    <path d="M0 ${h*0.62} L${w*0.2} ${h*0.52} L${w*0.42} ${h*0.6} L${w*0.65} ${h*0.48} L${w*0.88} ${h*0.56} L${w} ${h*0.48} L${w} ${h*0.62} Z" fill="${warm?'#3a2010':'#0a1428'}" opacity="0.9"/>
    <ellipse cx="${w*0.5}" cy="${h*0.7}" rx="${w*0.07}" ry="${h*0.12}" fill="${warm?'#ffd060':'#ffeebb'}" opacity="0.2"/>
    <text x="${w*0.5}" y="${h*0.96}" text-anchor="middle" fill="${warm?'#ffd060':'#b8d8ff'}" font-family="Cormorant Garamond" font-size="${w*0.035}" font-style="italic" opacity="0.7">${art.title}</text>
  </svg>`;
}

function pencilSVG(art, w, h) {
  const seed = art.id.charCodeAt(art.id.length-1);
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#f0ece2"/>
    <defs>
      <filter id="pf${seed}"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="n"/><feColorMatrix type="saturate" values="0" in="n" result="g"/><feBlend in="SourceGraphic" in2="g" mode="multiply" result="b"/><feComposite in="b" in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <g filter="url(#pf${seed})">
      <ellipse cx="${w*0.5}" cy="${h*0.38}" rx="${w*0.25}" ry="${h*0.22}" fill="#1a1614" opacity="0.75"/>
      <ellipse cx="${w*0.5-w*0.06}" cy="${h*0.34}" rx="${w*0.035}" ry="${h*0.025}" fill="#0d0b09" opacity="0.85"/>
      <ellipse cx="${w*0.5+w*0.06}" cy="${h*0.34}" rx="${w*0.035}" ry="${h*0.025}" fill="#0d0b09" opacity="0.85"/>
      <path d="M${w*0.44} ${h*0.42} Q${w*0.5} ${h*0.45} ${w*0.56} ${h*0.42}" stroke="#2a1a10" stroke-width="${w*0.007}" fill="none"/>
      <ellipse cx="${w*0.5}" cy="${h*0.18}" rx="${w*0.26}" ry="${h*0.1}" fill="#1a1614" opacity="0.7"/>
      <path d="M${w*0.25} ${h*0.6} Q${w*0.35} ${h*0.55} ${w*0.5} ${h*0.57} Q${w*0.65} ${h*0.55} ${w*0.75} ${h*0.6} L${w*0.78} ${h} L${w*0.22} ${h} Z" fill="#2a2018" opacity="0.65"/>
      <line x1="${w*0.2}" y1="${h*0.62}" x2="${w*0.4}" y2="${h*0.85}" stroke="#4a3820" stroke-width="0.8" opacity="0.4"/>
      <line x1="${w*0.3}" y1="${h*0.6}" x2="${w*0.45}" y2="${h*0.82}" stroke="#4a3820" stroke-width="0.7" opacity="0.35"/>
      <line x1="${w*0.55}" y1="${h*0.6}" x2="${w*0.65}" y2="${h*0.84}" stroke="#4a3820" stroke-width="0.7" opacity="0.35"/>
    </g>
    <text x="${w*0.5}" y="${h*0.96}" text-anchor="middle" fill="#5a4a30" font-family="Cormorant Garamond" font-size="${w*0.035}" font-style="italic" opacity="0.7">${art.title}</text>
  </svg>`;
}

function acrylicSVG(art, w, h) {
  const seed = art.id.charCodeAt(art.id.length-1);
  const palettes = [
    ['#1a0a28','#6a0a50','#c80888','#f040c0','#40f0a0'],
    ['#0a1020','#0a3060','#2880e0','#40d0f8','#f8e040'],
    ['#100808','#6a1008','#d83018','#f86028','#f8d060'],
  ];
  const p = palettes[seed % palettes.length];
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="${p[0]}"/>
    <defs>
      <radialGradient id="acg${seed}" cx="${30+seed*7}%" cy="${40+seed*5}%" r="60%">
        <stop offset="0%" stop-color="${p[2]}" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="${p[0]}" stop-opacity="0.2"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#acg${seed})"/>
    <circle cx="${w*0.3}" cy="${h*0.25}" r="${w*0.18}" fill="${p[3]}" opacity="0.35"/>
    <circle cx="${w*0.7}" cy="${h*0.6}" r="${w*0.22}" fill="${p[1]}" opacity="0.45"/>
    <ellipse cx="${w*0.5}" cy="${h*0.45}" rx="${w*0.35}" ry="${h*0.28}" fill="${p[2]}" opacity="0.2"/>
    <path d="M${w*0.1} ${h*0.3} Q${w*0.3} ${h*0.2} ${w*0.6} ${h*0.35}" stroke="${p[3]}" stroke-width="${h*0.025}" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M${w*0.3} ${h*0.55} Q${w*0.55} ${h*0.4} ${w*0.85} ${h*0.5}" stroke="${p[4]}" stroke-width="${h*0.018}" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M${w*0.15} ${h*0.65} Q${w*0.4} ${h*0.55} ${w*0.7} ${h*0.7}" stroke="${p[2]}" stroke-width="${h*0.015}" fill="none" stroke-linecap="round" opacity="0.55"/>
    <path d="M${w*0.4} ${h*0.15} Q${w*0.65} ${h*0.25} ${w*0.9} ${h*0.18}" stroke="${p[4]}" stroke-width="${h*0.02}" fill="none" stroke-linecap="round" opacity="0.45"/>
    <text x="${w*0.5}" y="${h*0.96}" text-anchor="middle" fill="${p[4]}" font-family="Cormorant Garamond" font-size="${w*0.035}" font-style="italic" opacity="0.75">${art.title}</text>
  </svg>`;
}

function fiberSVG(art, w, h) {
  const seed = art.id.charCodeAt(art.id.length-1);
  const bg = seed%3===0?'#180a04':seed%3===1?'#0a1020':'#0c0a18';
  const accent = seed%3===0?'#c9a84c':seed%3===1?'#4a90e0':'#c060c0';
  const sareeCol = seed%3===0?'#8a1a0a':seed%3===1?'#1a3a8a':'#601080';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="${bg}"/>
    <defs>
      <radialGradient id="fg${seed}" cx="50%" cy="38%" r="48%">
        <stop offset="0%" stop-color="#c08060" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="${bg}" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <ellipse cx="${w*0.5}" cy="${h*0.3}" rx="${w*0.22}" ry="${h*0.26}" fill="url(#fg${seed})"/>
    <ellipse cx="${w*0.5}" cy="${h*0.18}" rx="${w*0.24}" ry="${h*0.12}" fill="${bg}" opacity="0.9"/>
    <ellipse cx="${w*0.43}" cy="${h*0.28}" rx="${w*0.04}" ry="${h*0.025}" fill="#1a0e08" opacity="0.8"/>
    <ellipse cx="${w*0.57}" cy="${h*0.28}" rx="${w*0.04}" ry="${h*0.025}" fill="#1a0e08" opacity="0.8"/>
    <path d="M${w*0.46} ${h*0.34} Q${w*0.5} ${h*0.37} ${w*0.54} ${h*0.34}" stroke="#6a2818" stroke-width="${w*0.006}" fill="none"/>
    <circle cx="${w*0.5}" cy="${h*0.22}" r="${w*0.012}" fill="${accent}"/>
    <path d="M${w*0.15} ${h*0.55} Q${w*0.32} ${h*0.5} ${w*0.5} ${h*0.52} Q${w*0.68} ${h*0.5} ${w*0.85} ${h*0.55} L${w*0.88} ${h} L${w*0.12} ${h} Z" fill="${sareeCol}" opacity="0.9"/>
    ${Array.from({length:9},(_,i)=>{
      const fx = w*(0.18+i*0.08);
      return `<line x1="${fx}" y1="${h*0.58}" x2="${fx+w*0.01}" y2="${h}" stroke="${accent}" stroke-width="0.7" opacity="0.35"/>`;
    }).join('')}
    ${Array.from({length:9},(_,i)=>{
      const fx = w*(0.22+i*0.07);
      return `<line x1="${fx}" y1="${h*0.56}" x2="${fx-w*0.01}" y2="${h}" stroke="${sareeCol==='#8a1a0a'?'#d04020':sareeCol==='#1a3a8a'?'#6090d0':'#a050c0'}" stroke-width="0.6" opacity="0.4"/>`;
    }).join('')}
    <text x="${w*0.5}" y="${h*0.97}" text-anchor="middle" fill="${accent}" font-family="Cormorant Garamond" font-size="${w*0.033}" font-style="italic" opacity="0.7">${art.title}</text>
  </svg>`;
}
