import type { StampConfig } from './types.js';
import { generateMotifSvg } from './motifs.js';

export interface RenderOptions {
  width?: number;
  height?: number;
  transparentPerforations?: boolean;
  idPrefix?: string;
}

export function getCurrentPostalDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function renderStampSvg(config: StampConfig, options: RenderOptions = {}): string {
  const W = options.width || 300;
  const H = options.height || 400;
  const idPrefix = options.idPrefix || 'stamp-main';
  const maskId = `${idPrefix}-perf-mask`;
  const clipId = `${idPrefix}-motif-clip`;
  const textureId = `${idPrefix}-paper-texture`;
  
  const {
    fromLocation,
    toLocation,
    code,
    codePlacement,
    denomination,
    headerSub,
    title,
    year,
    palette,
    motif,
    motifScale,
    motifComplexity,
    borderStyle,
    perforationRadius,
    perforationSpacing,
    postmark,
    texture,
  } = config;

  // Symmetrical Perforation Teeth:
  // All 4 corners remain solid, sharp right-angle stamp points.
  // Punch holes are distributed with exact mirror symmetry along all edges.
  const perfHoles: string[] = [];
  const r = Math.max(4, Math.min(perforationRadius, 9));
  const targetSpacing = Math.max(12, Math.min(perforationSpacing, 28));

  // Corner protection margin: ensures holes never cut into the 4 corners
  const cornerPadding = r * 2.2;

  // Horizontal edges (Top & Bottom)
  const availableW = W - cornerPadding * 2;
  const countX = Math.max(4, Math.round(availableW / targetSpacing));
  const stepX = availableW / countX;
  const startX = cornerPadding;

  for (let i = 0; i <= countX; i++) {
    const cx = (startX + i * stepX).toFixed(2);
    perfHoles.push(`<circle cx="${cx}" cy="0" r="${r}" fill="black" />`);
    perfHoles.push(`<circle cx="${cx}" cy="${H}" r="${r}" fill="black" />`);
  }

  // Vertical edges (Left & Right)
  const availableH = H - cornerPadding * 2;
  const countY = Math.max(6, Math.round(availableH / targetSpacing));
  const stepY = availableH / countY;
  const startY = cornerPadding;

  for (let j = 0; j <= countY; j++) {
    const cy = (startY + j * stepY).toFixed(2);
    perfHoles.push(`<circle cx="0" cy="${cy}" r="${r}" fill="black" />`);
    perfHoles.push(`<circle cx="${W}" cy="${cy}" r="${r}" fill="black" />`);
  }

  // Inset inner border coordinates
  const inset = r + 9;
  const innerW = W - inset * 2;
  const innerH = H - inset * 2;

  // Inner decorative border styles
  let innerBorderSvg = '';
  switch (borderStyle) {
    case 'classic-double':
      innerBorderSvg = `
        <rect x="${inset}" y="${inset}" width="${innerW}" height="${innerH}" fill="none" stroke="${palette.border}" stroke-width="2" />
        <rect x="${inset + 3.5}" y="${inset + 3.5}" width="${innerW - 7}" height="${innerH - 7}" fill="none" stroke="${palette.border}" stroke-width="0.9" opacity="0.8" />
      `;
      break;
    case 'dashed':
      innerBorderSvg = `
        <rect x="${inset}" y="${inset}" width="${innerW}" height="${innerH}" fill="none" stroke="${palette.border}" stroke-width="1.8" stroke-dasharray="4 3" />
      `;
      break;
    case 'ornate':
      innerBorderSvg = `
        <rect x="${inset}" y="${inset}" width="${innerW}" height="${innerH}" fill="none" stroke="${palette.border}" stroke-width="1.6" />
        <!-- Corner brackets -->
        <path d="M ${inset + 2} ${inset + 14} L ${inset + 2} ${inset + 2} L ${inset + 14} ${inset + 2}" fill="none" stroke="${palette.primary}" stroke-width="2.5" />
        <path d="M ${W - inset - 2} ${inset + 14} L ${W - inset - 2} ${inset + 2} L ${W - inset - 14} ${inset + 2}" fill="none" stroke="${palette.primary}" stroke-width="2.5" />
        <path d="M ${inset + 2} ${H - inset - 14} L ${inset + 2} ${H - inset - 2} L ${inset + 14} ${H - inset - 2}" fill="none" stroke="${palette.primary}" stroke-width="2.5" />
        <path d="M ${W - inset - 2} ${H - inset - 14} L ${W - inset - 2} ${H - inset - 2} L ${W - inset - 14} ${H - inset - 2}" fill="none" stroke="${palette.primary}" stroke-width="2.5" />
      `;
      break;
    case 'minimal':
      innerBorderSvg = `
        <rect x="${inset}" y="${inset}" width="${innerW}" height="${innerH}" fill="none" stroke="${palette.border}" stroke-width="0.75" opacity="0.6" />
      `;
      break;
    case 'single':
    default:
      innerBorderSvg = `
        <rect x="${inset}" y="${inset}" width="${innerW}" height="${innerH}" fill="none" stroke="${palette.border}" stroke-width="1.8" />
      `;
      break;
  }

  // ==========================================
  // METICULOUS VERTICAL SPACING & HIERARCHY
  // ==========================================
  // Upper Section: Inset to SepY1 (~58px)
  //   y = inset + 16: Top Micro-label / Route line
  //   y = inset + 45: 2-Letter City Code & Denomination
  //   y = sepY1: Upper Separator Rule
  const sepY1 = inset + 58;
  
  // Lower Section: SepY2 to (H - inset) (~54px)
  //   y = sepY2: Lower Separator Rule
  //   y = sepY2 + 25: Main Postal Title
  //   y = sepY2 + 42: Serial / Footer Label
  const sepY2 = H - inset - 54;

  // Focal Motif Area: generous breathing room between sepY1 and sepY2
  const motifCenterX = W / 2;
  const motifCenterY = (sepY1 + sepY2) / 2;
  const rawMotifSvg = generateMotifSvg(motif, {
    cx: motifCenterX,
    cy: motifCenterY,
    width: innerW,
    height: sepY2 - sepY1,
    primary: palette.primary,
    secondary: palette.secondary,
    scale: motifScale,
    complexity: motifComplexity,
  });
  const motifSvg = rawMotifSvg.replace(/url\(#motif-clip\)/g, `url(#${clipId})`);

  // Display code: if code not provided, derive from fromLocation
  const displayCode = (code || (fromLocation ? fromLocation.slice(0, 2).toUpperCase() : 'DL')).slice(0, 3);
  // Auto-scale code font size if 3 letters
  const codeFontSize = displayCode.length >= 3 ? 22 : 27;

  // Code & Denomination Positions (Row 2 of Upper Zone)
  const paddingX = inset + 12;
  const row2Y = inset + 45;

  let codeX = paddingX;
  let codeY = row2Y;
  let denomX = W - paddingX;
  let denomY = row2Y;
  let codeAnchor = 'start';
  let denomAnchor = 'end';

  if (codePlacement === 'top-right') {
    codeX = W - paddingX;
    codeAnchor = 'end';
    denomX = paddingX;
    denomAnchor = 'start';
  } else if (codePlacement === 'bottom-left') {
    codeX = paddingX;
    codeY = H - inset - 18;
    codeAnchor = 'start';
  } else if (codePlacement === 'bottom-right') {
    codeX = W - paddingX;
    codeY = H - inset - 18;
    codeAnchor = 'end';
  }

  // Row 1: Header Route / Service Text
  let routeText = headerSub || 'AIR MAIL';
  if (fromLocation && toLocation) {
    const fInit = fromLocation.length <= 4 ? fromLocation.toUpperCase() : fromLocation.slice(0, 3).toUpperCase();
    const tInit = toLocation.length <= 4 ? toLocation.toUpperCase() : toLocation.slice(0, 3).toUpperCase();
    routeText = `${fInit} ➔ ${tInit}`;
  } else if (fromLocation) {
    routeText = fromLocation.toUpperCase();
  }

  // Scale route font size dynamically based on length so it never overflows
  const routeFontSize = routeText.length > 20 ? 6.5 : routeText.length > 14 ? 7.5 : 8;

  // Postmark cancellation mark
  let postmarkSvg = '';
  if (postmark && postmark.enabled) {
    const pmX = W * 0.72;
    const pmY = H * 0.28;
    const pmRot = postmark.rotation ?? -18;
    const pmOp = postmark.opacity ?? 0.68;
    const pmCity = (postmark.city || fromLocation || 'DELHI').toUpperCase();
    const pmDate = (postmark.date && postmark.date.trim())
      ? postmark.date.trim().toUpperCase()
      : getCurrentPostalDate();

    postmarkSvg = `
      <g id="postmark-seal" transform="rotate(${pmRot} ${pmX} ${pmY})" opacity="${pmOp}">
        <!-- Concentric cancellation ring -->
        <circle cx="${pmX}" cy="${pmY}" r="38" fill="none" stroke="${palette.postmark}" stroke-width="1.8" stroke-dasharray="80 2 2 2" />
        <circle cx="${pmX}" cy="${pmY}" r="34" fill="none" stroke="${palette.postmark}" stroke-width="1" />
        <circle cx="${pmX}" cy="${pmY}" r="22" fill="none" stroke="${palette.postmark}" stroke-width="0.8" />
        
        <!-- Postmark City & Date text along centered lines -->
        <text x="${pmX}" y="${pmY - 8}" text-anchor="middle" font-family="'DejaVu Sans Mono'" font-size="7" font-weight="700" letter-spacing="1.2" fill="${palette.postmark}">${pmCity}</text>
        <text x="${pmX}" y="${pmY + 5}" text-anchor="middle" font-family="'DejaVu Sans Mono'" font-size="6.5" font-weight="600" letter-spacing="0.8" fill="${palette.postmark}">${pmDate}</text>
        <text x="${pmX}" y="${pmY + 14}" text-anchor="middle" font-family="'DejaVu Sans Mono'" font-size="5.5" letter-spacing="0.5" fill="${palette.postmark}">POSTAL SERVICE</text>
        
        ${postmark.wavyBars ? `
          <!-- Killer wavy bars (contained within stamp boundary) -->
          <g transform="translate(${pmX + 38}, ${pmY - 18})" stroke="${palette.postmark}" stroke-width="1.6" fill="none">
            <path d="M 4 -10 Q 14 -17 24 -10 T 40 -10" />
            <path d="M 4 -2  Q 14 -9  24 -2  T 40 -2" />
            <path d="M 4 6   Q 14 -1  24 6   T 40 6" />
            <path d="M 4 14  Q 14 7   24 14  T 40 14" />
            <path d="M 4 22  Q 14 15  24 22  T 40 22" />
          </g>
        ` : ''}
      </g>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="hidden" style="overflow: hidden; display: block; width: 100%; height: auto;">
  <defs>
    <!-- Symmetrical Stamp Perforation Mask: Corners protected -->
    <mask id="${maskId}">
      <rect x="0" y="0" width="${W}" height="${H}" fill="white" />
      ${perfHoles.join('\n      ')}
    </mask>

    <!-- Clip path for central motif zone -->
    <clipPath id="${clipId}">
      <rect x="${inset + 4}" y="${sepY1 + 4}" width="${innerW - 8}" height="${sepY2 - sepY1 - 8}" />
    </clipPath>

    ${texture ? `
    <!-- Subtle tactile paper grain filter -->
    <filter id="${textureId}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.045 0" result="coloredNoise"/>
      <feComposite in="SourceGraphic" in2="coloredNoise" operator="over" />
    </filter>
    ` : ''}
  </defs>

  <!-- Base Stamp Paper with Symmetrical Semicircular Perforations -->
  <g mask="url(#${maskId})" ${texture ? `filter="url(#${textureId})"` : ''}>
    <rect x="0" y="0" width="${W}" height="${H}" fill="${palette.paper}" />
    
    <!-- Fine inner tint or margin background -->
    <rect x="${inset}" y="${inset}" width="${innerW}" height="${innerH}" fill="${palette.paper}" opacity="0.95" />

    <!-- Inner decorative border -->
    ${innerBorderSvg}

    <!-- UPPER ZONE: Header, Monogram Code & Denomination -->
    <g id="header-elements">
      <!-- Row 1: Centered Micro Route / Service Header -->
      <text 
        x="${W / 2}" 
        y="${inset + 17}" 
        text-anchor="middle" 
        font-family="'DejaVu Sans Mono'"
        font-size="${routeFontSize}" 
        font-weight="700" 
        letter-spacing="2" 
        fill="${palette.secondary}"
      >${routeText}</text>

      <!-- Row 2: 2-Letter City Monogram Code -->
      <text 
        x="${codeX}" 
        y="${codeY}" 
        text-anchor="${codeAnchor}" 
        font-family="'DejaVu Serif'"
        font-size="${codeFontSize}" 
        font-weight="900" 
        letter-spacing="1" 
        fill="${palette.primary}"
      >${displayCode}</text>

      <!-- Row 2: Denomination Badge -->
      <text 
        x="${denomX}" 
        y="${denomY}" 
        text-anchor="${denomAnchor}" 
        font-family="'DejaVu Sans Mono'"
        font-size="18" 
        font-weight="700" 
        letter-spacing="0.5" 
        fill="${palette.primary}"
      >${denomination}</text>

      <!-- Upper Separator Rule -->
      <line 
        x1="${inset + 8}" 
        y1="${sepY1}" 
        x2="${W - inset - 8}" 
        y2="${sepY1}" 
        stroke="${palette.border}" 
        stroke-width="1.2" 
        stroke-dasharray="3 2" 
      />
    </g>

    <!-- MIDDLE ZONE: Procedural Motif (Waves, Concentric, Sunburst, etc.) -->
    ${motifSvg}

    <!-- LOWER ZONE: Title, Subtitle, Serial / Year -->
    <g id="footer-elements">
      <!-- Lower Separator Rule -->
      <line 
        x1="${inset + 8}" 
        y1="${sepY2}" 
        x2="${W - inset - 8}" 
        y2="${sepY2}" 
        stroke="${palette.border}" 
        stroke-width="1.2" 
        stroke-dasharray="3 2" 
      />

      <!-- Main Postal Title -->
      <text 
        x="${W / 2}" 
        y="${sepY2 + 25}" 
        text-anchor="middle" 
        font-family="'DejaVu Serif'"
        font-size="13" 
        font-weight="700" 
        letter-spacing="4" 
        fill="${palette.primary}"
      >${title.toUpperCase()}</text>

      <!-- Serial / Year Footer Label -->
      <text 
        x="${W / 2}" 
        y="${sepY2 + 42}" 
        text-anchor="middle" 
        font-family="'DejaVu Sans Mono'"
        font-size="7" 
        letter-spacing="1.5" 
        fill="${palette.secondary}"
      >№ ${year || '2026'} • OFFICIAL POST</text>
    </g>

    <!-- Postmark Ink Overlay (Wavy bars, cancellation date ring) -->
    ${postmarkSvg}
  </g>
</svg>
`;
}
