import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resvg } from '@resvg/resvg-js';
import { renderStampSvg } from '../src/core/stampRenderer.js';
import { DEFAULT_PALETTE, PALETTES } from '../src/core/themes.js';
import { STAMP_PRESETS } from '../src/core/presets.js';
import type { MotifType, BorderStyle } from '../src/core/types.js';

// Helper for deterministic hash from string to seed random aesthetic choices
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow cross-origin access from any letter post site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const query = req.query || {};

    const fromParam = typeof query.from === 'string' ? query.from.trim() : '';
    const toParam = typeof query.to === 'string' ? query.to.trim() : '';
    const codeParam = typeof query.code === 'string' ? query.code.trim() : '';

    // VALIDATION: Required fields are `to` and either `from` or `code`
    if (!toParam || (!fromParam && !codeParam)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({
        error: 'Missing required parameters',
        message: "A stamp requires sender and destination locations. Please provide 'from' (or 'code') and 'to'.",
        required: {
          from: 'Sender city or name (e.g. "Delhi", "New York")',
          to: 'Destination city or name (e.g. "Paris", "Tokyo")',
        },
        example: '/api/stamp?from=Delhi&to=Paris',
        optional: {
          theme: 'vintage-navy | terracotta | botanic-sage | obsidian | burgundy | nordic-slate | sepia-archive | cyber-noir',
          motif: 'waves | concentric | sunburst | bauhaus | topography | crest | compass | halftone',
          denom: 'Stamp price/value, e.g. "25¢", "50¢", "₹5", "¥80"',
          border: 'classic-double | single | dashed | ornate | minimal',
          postmark: '1 (with ink stamp) or 0 (clean)',
          format: 'png (default) | svg',
          width: 'Width in pixels (default 300)',
        },
      });
    }

    // Deterministic hash seed based on route so unsupplied fields are procedurally generated
    const seed = hashString(`${fromParam}_${toParam}_${codeParam}`);
    const paletteKeys = Object.keys(PALETTES);
    const motifsList: MotifType[] = ['waves', 'concentric', 'sunburst', 'bauhaus', 'topography', 'crest', 'compass', 'halftone'];
    const borderList: BorderStyle[] = ['classic-double', 'ornate', 'dashed', 'single'];
    const denomsList = ['25¢', '50¢', '₹5', '¥80', '£1', '15¢', '№ 07'];

    // Start with base preset
    const config = { ...STAMP_PRESETS[0].config };

    // Set required / route fields
    config.fromLocation = fromParam || codeParam;
    config.toLocation = toParam;

    // Code: if not specified, extract 2-letter initials from fromLocation
    if (codeParam) {
      config.code = codeParam.slice(0, 3).toUpperCase();
    } else if (fromParam) {
      const parts = fromParam.split(/\s+/);
      if (parts.length >= 2) {
        config.code = (parts[0][0] + parts[1][0]).toUpperCase();
      } else {
        config.code = fromParam.slice(0, 2).toUpperCase();
      }
    }

    // Theme: use requested or pick procedural seed
    const themeId = typeof query.theme === 'string' ? query.theme : paletteKeys[seed % paletteKeys.length];
    // `custom` palettes are local UI state and are not registered in the
    // server palette catalog. Always keep the renderer supplied with a valid
    // palette rather than allowing an unknown theme to cause a 500.
    config.palette = PALETTES[themeId] || DEFAULT_PALETTE;

    // Motif: use requested or pick procedural seed
    const reqMotif = query.motif as MotifType;
    if (reqMotif && motifsList.includes(reqMotif)) {
      config.motif = reqMotif;
    } else {
      config.motif = motifsList[(seed >> 2) % motifsList.length];
    }

    // Border: use requested or pick procedural seed
    const reqBorder = query.border as BorderStyle;
    if (reqBorder && borderList.includes(reqBorder)) {
      config.borderStyle = reqBorder;
    } else {
      config.borderStyle = borderList[(seed >> 4) % borderList.length];
    }

    // Denomination: use requested or pick procedural seed
    if (typeof query.denom === 'string' && query.denom.trim()) {
      config.denomination = query.denom.trim().slice(0, 8);
    } else {
      config.denomination = denomsList[(seed >> 3) % denomsList.length];
    }

    // Titles & Subtitles
    if (typeof query.sub === 'string') {
      config.headerSub = query.sub.trim().slice(0, 28);
    }
    if (typeof query.title === 'string') {
      config.title = query.title.trim().slice(0, 24);
    }
    if (typeof query.year === 'string') {
      config.year = query.year.trim().slice(0, 10);
    }

    // Postmark
    if (query.postmark !== undefined) {
      config.postmark.enabled = query.postmark === '1' || query.postmark === 'true';
    }
    config.postmark.city = typeof query.city === 'string' && query.city.trim() 
      ? query.city.trim().slice(0, 24)
      : `${(fromParam || config.code).toUpperCase()} G.P.O.`;

    if (typeof query.date === 'string') {
      config.postmark.date = query.date.trim().slice(0, 18);
    }

    // Texture
    if (query.texture !== undefined) {
      config.texture = query.texture === '1' || query.texture === 'true';
    }

    // Desired output width & format
    const widthParam = typeof query.width === 'string' ? parseInt(query.width, 10) : 300;
    const width = Math.min(Math.max(isNaN(widthParam) ? 300 : widthParam, 100), 1200);
    const height = Math.round(width * (4 / 3));

    // Render SVG
    const svgString = renderStampSvg(config, { width, height });

    // Format handling: SVG or PNG
    const format = typeof query.format === 'string' ? query.format.toLowerCase() : 'png';

    // Aggressive caching
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');

    if (format === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      return res.status(200).send(svgString);
    }

    // Render to crisp PNG using @resvg/resvg-js
    const resvg = new Resvg(svgString, {
      fitTo: {
        mode: 'width',
        value: width,
      },
      font: {
        loadSystemFonts: true,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(pngBuffer);
  } catch (error) {
    console.error('Error generating stamp:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: 'Failed to render stamp image',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
