export type MotifType = 
  | 'waves' 
  | 'concentric' 
  | 'sunburst' 
  | 'bauhaus' 
  | 'topography' 
  | 'crest' 
  | 'halftone'
  | 'compass';

export type BorderStyle = 'classic-double' | 'single' | 'dashed' | 'ornate' | 'minimal';

export interface StampPalette {
  name: string;
  id: string;
  paper: string;       // Stamp background paper color
  primary: string;     // Main ink color
  secondary: string;   // Secondary / accent ink
  border: string;      // Frame border color
  postmark: string;    // Rubber stamp ink color
}

export interface PostmarkConfig {
  enabled: boolean;
  city: string;
  date: string;
  rotation: number;     // Degrees, e.g. -18
  wavyBars: boolean;
  opacity: number;
}

export interface StampConfig {
  // Routing & Letter Origin (Required in API)
  fromLocation: string;    // e.g. "Delhi", "New York"
  toLocation: string;      // e.g. "Paris", "Tokyo"
  code: string;            // 2-3 characters (e.g. "DL", "NY")
  codePlacement: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  // Denomination & Labels
  denomination: string;    // e.g. "25¢", "₹5", "50", "POST"
  headerSub: string;       // e.g. "AIR MAIL"
  title: string;           // e.g. "POSTAGE"
  year: string;            // e.g. "2026"

  // Visuals & Styling
  palette: StampPalette;
  motif: MotifType;
  motifScale: number;      // 0.6 - 1.4
  motifComplexity: number; // 1 - 5
  borderStyle: BorderStyle;
  
  // Perforations
  perforationRadius: number; // e.g. 6.5
  perforationSpacing: number; // e.g. 18

  // Postmark Ink Stamp
  postmark: PostmarkConfig;

  // Effects
  texture: boolean;        // SVG grain/noise filter
}

export interface StampPreset {
  id: string;
  name: string;
  description: string;
  config: StampConfig;
}
