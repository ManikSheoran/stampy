import type { StampConfig, MotifType, BorderStyle } from '../core/types';
import { PALETTES } from '../core/themes';
import { STAMP_PRESETS } from '../core/presets';
import { getCurrentPostalDate } from '../core/stampRenderer';

/**
 * Generate API / query URL for the stamp
 */
export function encodeStampToQuery(config: StampConfig): string {
  const params = new URLSearchParams();
  
  if (config.fromLocation) params.set('from', config.fromLocation);
  if (config.toLocation) params.set('to', config.toLocation);
  if (config.code) params.set('code', config.code);
  if (config.denomination) params.set('denom', config.denomination);
  if (config.headerSub) params.set('sub', config.headerSub);
  if (config.title) params.set('title', config.title);
  if (config.year) params.set('year', config.year);
  if (config.motif) params.set('motif', config.motif);
  if (config.palette.id) params.set('theme', config.palette.id);
  if (config.borderStyle) params.set('border', config.borderStyle);
  if (config.postmark.enabled) {
    params.set('postmark', '1');
    if (config.postmark.city) params.set('city', config.postmark.city);
    if (config.postmark.date && config.postmark.date.trim() !== getCurrentPostalDate()) {
      params.set('date', config.postmark.date.trim());
    }
  } else {
    params.set('postmark', '0');
  }

  return params.toString();
}

/**
 * Decode query parameters into StampConfig
 */
export function decodeQueryToStamp(search: string): StampConfig {
  const params = new URLSearchParams(search);
  const base = { ...STAMP_PRESETS[0].config };

  const from = params.get('from');
  if (from) base.fromLocation = from;

  const to = params.get('to');
  if (to) base.toLocation = to;

  const code = params.get('code');
  if (code) {
    base.code = code.slice(0, 4);
  } else if (from) {
    base.code = from.slice(0, 2).toUpperCase();
  }

  const themeId = params.get('theme');
  if (themeId && PALETTES[themeId]) {
    base.palette = PALETTES[themeId];
  }

  const denom = params.get('denom');
  if (denom) base.denomination = denom;

  const sub = params.get('sub');
  if (sub) base.headerSub = sub;

  const title = params.get('title');
  if (title) base.title = title;

  const year = params.get('year');
  if (year) base.year = year;

  const motif = params.get('motif') as MotifType;
  if (motif && ['waves', 'concentric', 'sunburst', 'bauhaus', 'topography', 'crest', 'halftone', 'compass'].includes(motif)) {
    base.motif = motif;
  }

  const border = params.get('border') as BorderStyle;
  if (border && ['classic-double', 'single', 'dashed', 'ornate', 'minimal'].includes(border)) {
    base.borderStyle = border;
  }

  const postmark = params.get('postmark');
  if (postmark !== null) {
    base.postmark.enabled = postmark === '1' || postmark === 'true';
  }

  const city = params.get('city');
  if (city) base.postmark.city = city;

  const date = params.get('date');
  if (date) base.postmark.date = date;

  return base;
}
