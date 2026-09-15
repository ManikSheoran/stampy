import React, { useState } from 'react';
import type { StampConfig, MotifType, BorderStyle } from '../core/types';
import { PALETTES } from '../core/themes';
import { 
  Shuffle, 
  DownloadSimple, 
  Code, 
  ShareNetwork,
  Check,
  FileCode
} from '@phosphor-icons/react';
import { downloadStampPng, downloadStampSvg } from '../utils/exportImage';
import { renderMiniStampSvg, type MiniStampFigure } from '../core/miniStamp';

interface HeaderProps {
  config: StampConfig;
  onChangeConfig: (newConfig: StampConfig) => void;
  onOpenApiModal: () => void;
}

const RANDOM_ROUTES = [
  { from: 'Delhi', to: 'Paris', code: 'DL' },
  { from: 'Tokyo', to: 'Kyoto', code: 'TY' },
  { from: 'New York', to: 'London', code: 'NY' },
  { from: 'Cairo', to: 'Rome', code: 'CA' },
  { from: 'Oslo', to: 'Bergen', code: 'OS' },
  { from: 'Geneva', to: 'Zurich', code: 'GE' },
  { from: 'San Francisco', to: 'Tokyo', code: 'SF' },
  { from: 'Madrid', to: 'Lisbon', code: 'MD' },
];

const MOTIFS: MotifType[] = ['waves', 'concentric', 'sunburst', 'bauhaus', 'topography', 'crest', 'compass', 'halftone'];
const BORDERS: BorderStyle[] = ['classic-double', 'ornate', 'dashed', 'single', 'minimal'];
const DENOMS = ['25¢', '50¢', '₹5', '¥80', '£1', '10', '№ 07', '15¢'];
const FIGURES: MiniStampFigure[] = ['sun', 'star', 'waves', 'diamond', 'flower'];

export const Header: React.FC<HeaderProps> = ({ config, onChangeConfig, onOpenApiModal }) => {
  const [shareCopied, setShareCopied] = useState(false);
  const [logoFigure, setLogoFigure] = useState<MiniStampFigure>('sun');

  const handleRandomize = () => {
    const paletteKeys = Object.keys(PALETTES);
    const randomPalette = PALETTES[paletteKeys[Math.floor(Math.random() * paletteKeys.length)]];
    const randomRoute = RANDOM_ROUTES[Math.floor(Math.random() * RANDOM_ROUTES.length)];
    const randomMotif = MOTIFS[Math.floor(Math.random() * MOTIFS.length)];
    const randomBorder = BORDERS[Math.floor(Math.random() * BORDERS.length)];
    const randomDenom = DENOMS[Math.floor(Math.random() * DENOMS.length)];

    // Cycle random logo figure
    const nextFigure = FIGURES[Math.floor(Math.random() * FIGURES.length)];
    setLogoFigure(nextFigure);

    onChangeConfig({
      ...config,
      fromLocation: randomRoute.from,
      toLocation: randomRoute.to,
      code: randomRoute.code,
      denomination: randomDenom,
      motif: randomMotif,
      palette: randomPalette,
      borderStyle: randomBorder,
      postmark: {
        ...config.postmark,
        city: `${randomRoute.from.toUpperCase()} G.P.O.`,
        rotation: -25 + Math.floor(Math.random() * 50),
      },
    });
  };

  const handleShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <header className="border-b border-[#fa812f] bg-[#fef3e2]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand with interactive Mini Stamp Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              const next = FIGURES[(FIGURES.indexOf(logoFigure) + 1) % FIGURES.length];
              setLogoFigure(next);
            }}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-shrink-0 drop-shadow-xs"
            title="Click to cycle logo figure"
            dangerouslySetInnerHTML={{
              __html: renderMiniStampSvg(logoFigure, 32, config.palette.primary, config.palette.paper)
            }}
          />

          <div>
            <h1 className="text-base font-bold text-[#212529] tracking-tight font-serif">
              Stampy
            </h1>
            <p className="text-[11px] text-[#212529]">
              Postal generator &amp; dynamic image API
            </p>
          </div>
        </div>

        {/* Minimalist Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Shuffle Button */}
          <button
            onClick={handleRandomize}
            className="btn-secondary text-xs"
            title="Generate Random Harmonious Stamp"
          >
            <Shuffle size={14} weight="bold" />
            <span>Shuffle</span>
          </button>

          {/* Share Link */}
          <button
            onClick={handleShareUrl}
            className="btn-secondary text-xs"
            title="Copy shareable link"
          >
            {shareCopied ? (
              <>
                <Check size={14} weight="bold" className="text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <ShareNetwork size={14} weight="bold" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* API Modal Button */}
          <button
            onClick={onOpenApiModal}
            className="btn-secondary text-xs"
          >
            <Code size={14} weight="bold" />
            <span className="hidden sm:inline">GET API</span>
          </button>

          {/* Download SVG */}
          <button
            onClick={() => downloadStampSvg(config)}
            className="hidden sm:inline-flex btn-secondary text-xs"
            title="Download SVG vector"
          >
            <FileCode size={14} weight="bold" />
            <span>SVG</span>
          </button>

          {/* Download PNG (Primary Button) */}
          <button
            onClick={() => downloadStampPng(config, 3)}
            className="btn-primary text-xs"
          >
            <DownloadSimple size={14} weight="bold" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>
    </header>
  );
};
