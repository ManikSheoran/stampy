import type { MotifType } from './types';

interface MotifContext {
  cx: number;
  cy: number;
  width: number;
  height: number;
  primary: string;
  secondary: string;
  scale: number;
  complexity: number;
}

export function generateMotifSvg(type: MotifType, ctx: MotifContext): string {
  const { cx, cy, width, height, primary, secondary, scale, complexity } = ctx;
  const radius = Math.min(width, height) * 0.36 * scale;

  switch (type) {
    case 'waves': {
      // Guilloche harmonic waves
      const lines: string[] = [];
      const count = 7 + complexity * 3;
      const stepY = (radius * 1.5) / count;
      const startY = cy - (radius * 0.75);

      for (let i = 0; i <= count; i++) {
        const y = startY + i * stepY;
        const amp = 6 + Math.sin(i * 0.8) * 5;
        const freq = 0.045 + (i % 2) * 0.015;
        const color = i % 2 === 0 ? primary : secondary;
        const opacity = 0.75 + (i % 3) * 0.08;

        let d = `M ${cx - radius} ${y}`;
        for (let x = cx - radius; x <= cx + radius; x += 6) {
          const waveY = y + Math.sin((x - cx) * freq) * amp;
          d += ` L ${x.toFixed(1)} ${waveY.toFixed(1)}`;
        }

        lines.push(
          `<path d="${d}" fill="none" stroke="${color}" stroke-width="${i % 3 === 0 ? '1.8' : '1.1'}" opacity="${opacity}" stroke-linecap="round" />`
        );
      }
      return `<g id="motif-waves" clip-path="url(#motif-clip)">${lines.join('\n')}</g>`;
    }

    case 'concentric': {
      // Concentric circles with alternating dashed and solid rings
      const rings: string[] = [];
      const count = 5 + complexity * 2;
      const maxR = radius;

      for (let i = 1; i <= count; i++) {
        const r = (maxR / count) * i;
        const isDashed = i % 2 === 1 && i > 2;
        const color = i % 2 === 0 ? primary : secondary;
        const strokeWidth = i === count ? '2' : i === 1 ? '3' : '1.2';
        const dashAttr = isDashed ? 'stroke-dasharray="3 4"' : '';

        rings.push(
          `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" ${dashAttr} opacity="0.85" />`
        );
      }
      // Center solid pip
      rings.push(`<circle cx="${cx}" cy="${cy}" r="4" fill="${primary}" />`);
      return `<g id="motif-concentric">${rings.join('\n')}</g>`;
    }

    case 'sunburst': {
      // Geometric sun with radiating rays and horizontal horizon lines
      const rays: string[] = [];
      const rayCount = 12 + complexity * 4;
      const innerR = radius * 0.28;
      const outerR = radius * 0.95;

      for (let i = 0; i < rayCount; i++) {
        const angle = (Math.PI * 2 * i) / rayCount;
        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * outerR;
        const y2 = cy + Math.sin(angle) * outerR;
        const color = i % 2 === 0 ? primary : secondary;

        rays.push(
          `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="1.6" stroke-linecap="round" opacity="0.8" />`
        );
      }

      // Sun core
      rays.push(`<circle cx="${cx}" cy="${cy}" r="${(innerR * 0.85).toFixed(1)}" fill="none" stroke="${primary}" stroke-width="2.5" />`);
      rays.push(`<circle cx="${cx}" cy="${cy}" r="${(innerR * 0.5).toFixed(1)}" fill="${primary}" opacity="0.9" />`);
      rays.push(`<circle cx="${cx}" cy="${cy}" r="${(outerR).toFixed(1)}" fill="none" stroke="${secondary}" stroke-width="1" stroke-dasharray="2 3" opacity="0.6" />`);

      return `<g id="motif-sunburst">${rays.join('\n')}</g>`;
    }

    case 'bauhaus': {
      // Bauhaus modernism: intersecting semi-circles, bold geometry, and grids
      const w = radius * 1.5;
      const h = radius * 1.3;
      return `
        <g id="motif-bauhaus">
          <!-- Background geometric blocks -->
          <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" fill="none" stroke="${secondary}" stroke-width="1" opacity="0.4" />
          <path d="M ${cx - w / 2} ${cy + h / 2} A ${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${cy + h / 2} Z" fill="${secondary}" opacity="0.25" />
          <circle cx="${cx}" cy="${cy - h * 0.15}" r="${radius * 0.45}" fill="${primary}" opacity="0.85" />
          <circle cx="${cx}" cy="${cy - h * 0.15}" r="${radius * 0.6}" fill="none" stroke="${primary}" stroke-width="2" />
          <line x1="${cx - w / 2}" y1="${cy - h * 0.15}" x2="${cx + w / 2}" y2="${cy - h * 0.15}" stroke="${primary}" stroke-width="1.5" stroke-dasharray="4 3" />
          <line x1="${cx}" y1="${cy - h / 2}" x2="${cx}" y2="${cy + h / 2}" stroke="${secondary}" stroke-width="1.2" />
          <circle cx="${cx - w * 0.28}" cy="${cy + h * 0.25}" r="${radius * 0.18}" fill="none" stroke="${primary}" stroke-width="2" />
          <circle cx="${cx + w * 0.28}" cy="${cy + h * 0.25}" r="${radius * 0.18}" fill="${secondary}" opacity="0.6" />
        </g>
      `;
    }

    case 'topography': {
      // Organic topographical contour elevation rings
      const contours: string[] = [];
      const rings = 6 + complexity * 2;
      for (let i = 1; i <= rings; i++) {
        const r = (radius / rings) * i;
        const color = i % 2 === 0 ? primary : secondary;
        const opacity = 0.5 + (i / rings) * 0.45;
        // Perturb circle points to create natural contour line
        const pts: string[] = [];
        const segments = 16;
        for (let j = 0; j <= segments; j++) {
          const theta = (Math.PI * 2 * j) / segments;
          // harmonic noise
          const offset = Math.sin(theta * 3 + i) * 6 + Math.cos(theta * 2) * 4;
          const px = cx + Math.cos(theta) * (r + offset);
          const py = cy + Math.sin(theta) * (r * 0.85 + offset);
          pts.push(`${j === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
        }
        pts.push('Z');
        contours.push(
          `<path d="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="${i === rings ? '1.8' : '1.1'}" opacity="${opacity}" />`
        );
      }
      return `<g id="motif-topography">${contours.join('\n')}</g>`;
    }

    case 'crest': {
      // Classic heraldic diamond star / postal crest
      const dW = radius * 0.95;
      const dH = radius * 1.15;
      return `
        <g id="motif-crest">
          <!-- Diamond outer frame -->
          <polygon points="${cx},${cy - dH} ${cx + dW},${cy} ${cx},${cy + dH} ${cx - dW},${cy}" fill="none" stroke="${primary}" stroke-width="2" />
          <polygon points="${cx},${cy - dH + 6} ${cx + dW - 6},${cy} ${cx},${cy + dH - 6} ${cx - dW + 6},${cy}" fill="none" stroke="${secondary}" stroke-width="1" stroke-dasharray="3 2" />
          
          <!-- Cross rays -->
          <line x1="${cx - dW * 0.8}" y1="${cy}" x2="${cx + dW * 0.8}" y2="${cy}" stroke="${primary}" stroke-width="1.2" />
          <line x1="${cx}" y1="${cy - dH * 0.8}" x2="${cx}" y2="${cy + dH * 0.8}" stroke="${primary}" stroke-width="1.2" />

          <!-- Center starburst -->
          <circle cx="${cx}" cy="${cy}" r="${radius * 0.32}" fill="none" stroke="${primary}" stroke-width="2" />
          <circle cx="${cx}" cy="${cy}" r="${radius * 0.2}" fill="${secondary}" opacity="0.3" />
          <polygon points="${cx},${cy - radius * 0.25} ${cx + radius * 0.08},${cy} ${cx},${cy + radius * 0.25} ${cx - radius * 0.08},${cy}" fill="${primary}" />
          <polygon points="${cx - radius * 0.25},${cy} ${cx},${cy - radius * 0.08} ${cx + radius * 0.25},${cy} ${cx},${cy + radius * 0.08}" fill="${primary}" />
        </g>
      `;
    }

    case 'compass': {
      // Air mail / maritime 8-point navigational compass star
      const starR = radius * 0.85;
      const innerR = starR * 0.3;
      return `
        <g id="motif-compass">
          <circle cx="${cx}" cy="${cy}" r="${starR}" fill="none" stroke="${secondary}" stroke-width="1" stroke-dasharray="2 3" opacity="0.7" />
          <circle cx="${cx}" cy="${cy}" r="${starR * 0.6}" fill="none" stroke="${primary}" stroke-width="1" />
          
          <!-- North, East, South, West pointers -->
          <polygon points="${cx},${cy} ${cx - 4},${cy - innerR} ${cx},${cy - starR} ${cx + 4},${cy - innerR}" fill="${primary}" />
          <polygon points="${cx},${cy} ${cx + innerR},${cy - 4} ${cx + starR},${cy} ${cx + innerR},${cy + 4}" fill="${primary}" />
          <polygon points="${cx},${cy} ${cx - 4},${cy + innerR} ${cx},${cy + starR} ${cx + 4},${cy + innerR}" fill="${primary}" />
          <polygon points="${cx},${cy} ${cx - innerR},${cy - 4} ${cx - starR},${cy} ${cx - innerR},${cy + 4}" fill="${primary}" />

          <!-- Diagonal smaller points -->
          <circle cx="${cx}" cy="${cy}" r="3" fill="${primary}" />
        </g>
      `;
    }

    case 'halftone': {
      // Halftone dot matrix pattern
      const dots: string[] = [];
      const cols = 9 + complexity * 2;
      const rows = 9 + complexity * 2;
      const stepX = (radius * 1.7) / cols;
      const stepY = (radius * 1.7) / rows;
      const startX = cx - (radius * 0.85);
      const startY = cy - (radius * 0.85);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * stepX;
          const y = startY + r * stepY;
          const dist = Math.hypot(x - cx, y - cy);
          if (dist <= radius) {
            const dotSize = Math.max(0.8, (1 - dist / radius) * 3.8);
            const color = (r + c) % 2 === 0 ? primary : secondary;
            dots.push(
              `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotSize.toFixed(1)}" fill="${color}" opacity="0.85" />`
            );
          }
        }
      }
      return `<g id="motif-halftone">${dots.join('\n')}</g>`;
    }

    default:
      return '';
  }
}
