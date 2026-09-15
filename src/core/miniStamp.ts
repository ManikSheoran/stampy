// Generates a crisp miniature stamp SVG for the Logo and Favicon

export type MiniStampFigure = 'sun' | 'star' | 'waves' | 'diamond' | 'flower';

export function renderMiniStampSvg(figure: MiniStampFigure = 'sun', size = 36, primary = '#2563eb', paper = '#fafaf9'): string {
  // Mini stamp: 36x44 aspect ratio
  const w = size;
  const h = Math.round(size * (44 / 36));
  const r = size * 0.08;
  const spacing = size * 0.22;

  // Punch holes along edges
  const holes: string[] = [];
  const minM = r * 2.2;

  const countX = Math.round((w - minM * 2) / spacing);
  const stepX = (w - minM * 2) / countX;
  for (let i = 0; i <= countX; i++) {
    const cx = minM + i * stepX;
    holes.push(`<circle cx="${cx.toFixed(1)}" cy="0" r="${r.toFixed(1)}" fill="black" />`);
    holes.push(`<circle cx="${cx.toFixed(1)}" cy="${h}" r="${r.toFixed(1)}" fill="black" />`);
  }

  const countY = Math.round((h - minM * 2) / spacing);
  const stepY = (h - minM * 2) / countY;
  for (let j = 0; j <= countY; j++) {
    const cy = minM + j * stepY;
    holes.push(`<circle cx="0" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="black" />`);
    holes.push(`<circle cx="${w}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="black" />`);
  }

  const cx = w / 2;
  const cy = h / 2;

  let figureSvg = '';
  switch (figure) {
    case 'sun':
      figureSvg = `
        <circle cx="${cx}" cy="${cy}" r="${w * 0.18}" fill="${primary}" />
        <circle cx="${cx}" cy="${cy}" r="${w * 0.28}" fill="none" stroke="${primary}" stroke-width="1.2" stroke-dasharray="2 2" />
      `;
      break;
    case 'star':
      figureSvg = `
        <polygon points="${cx},${cy - w * 0.26} ${cx + w * 0.08},${cy - w * 0.08} ${cx + w * 0.26},${cy} ${cx + w * 0.08},${cy + w * 0.08} ${cx},${cy + w * 0.26} ${cx - w * 0.08},${cy + w * 0.08} ${cx - w * 0.26},${cy} ${cx - w * 0.08},${cy - w * 0.08}" fill="${primary}" />
      `;
      break;
    case 'waves':
      figureSvg = `
        <path d="M ${cx - w * 0.25} ${cy - 4} Q ${cx - w * 0.12} ${cy - 10} ${cx} ${cy - 4} T ${cx + w * 0.25} ${cy - 4}" fill="none" stroke="${primary}" stroke-width="1.6" stroke-linecap="round" />
        <path d="M ${cx - w * 0.25} ${cy + 4} Q ${cx - w * 0.12} ${cy - 2} ${cx} ${cy + 4} T ${cx + w * 0.25} ${cy + 4}" fill="none" stroke="${primary}" stroke-width="1.6" stroke-linecap="round" />
      `;
      break;
    case 'diamond':
      figureSvg = `
        <polygon points="${cx},${cy - w * 0.22} ${cx + w * 0.2},${cy} ${cx},${cy + w * 0.22} ${cx - w * 0.2},${cy}" fill="none" stroke="${primary}" stroke-width="1.5" />
        <circle cx="${cx}" cy="${cy}" r="${w * 0.08}" fill="${primary}" />
      `;
      break;
    case 'flower':
    default:
      figureSvg = `
        <circle cx="${cx}" cy="${cy}" r="${w * 0.12}" fill="${primary}" />
        <circle cx="${cx}" cy="${cy - w * 0.14}" r="${w * 0.08}" fill="${primary}" opacity="0.6" />
        <circle cx="${cx + w * 0.14}" cy="${cy}" r="${w * 0.08}" fill="${primary}" opacity="0.6" />
        <circle cx="${cx}" cy="${cy + w * 0.14}" r="${w * 0.08}" fill="${primary}" opacity="0.6" />
        <circle cx="${cx - w * 0.14}" cy="${cy}" r="${w * 0.08}" fill="${primary}" opacity="0.6" />
      `;
      break;
  }

  const maskId = `mini-mask-${Math.random().toString(36).slice(2, 7)}`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        <mask id="${maskId}">
          <rect width="${w}" height="${h}" fill="white" />
          ${holes.join('')}
        </mask>
      </defs>
      <g mask="url(#${maskId})">
        <rect width="${w}" height="${h}" fill="${paper}" />
        <rect x="${r * 2.2}" y="${r * 2.2}" width="${w - r * 4.4}" height="${h - r * 4.4}" fill="none" stroke="${primary}" stroke-width="1" />
        ${figureSvg}
      </g>
    </svg>
  `;
}
