import React, { useMemo, useState } from 'react';
import type { StampConfig } from '../core/types';
import { renderStampSvg } from '../core/stampRenderer';
import { 
  MagnifyingGlassPlus, 
  MagnifyingGlassMinus, 
  ArrowCounterClockwise, 
  DownloadSimple, 
  Check, 
  Sparkle,
  GridFour
} from '@phosphor-icons/react';
import { downloadStampPng, copyStampToClipboard } from '../utils/exportImage';

interface StampCanvasProps {
  config: StampConfig;
  onOpenApiModal: () => void;
}

export const StampCanvas: React.FC<StampCanvasProps> = ({ config, onOpenApiModal }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [stageBg, setStageBg] = useState<'envelope' | 'mat' | 'paper' | 'grid'>('envelope');

  // Render SVG string with main-canvas scoped ID prefix
  const svgString = useMemo(() => {
    return renderStampSvg(config, { width: 300, height: 400, idPrefix: 'main-canvas' });
  }, [config]);

  const handleCopy = async () => {
    const ok = await copyStampToClipboard(config);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const stageBgStyles = {
    envelope: 'bg-[#dcd7ca]',
    mat: 'bg-[#141414]',
    paper: 'bg-[#ffffff]',
    grid: 'checkerboard',
  };

  return (
    <div className="relative flex flex-col h-[560px] sm:h-[600px] lg:h-[640px] rounded-3xl editorial-card overflow-hidden">
      {/* Top Stage Toolbar */}
      <div className="canvas-toolbar flex items-center justify-between px-5 py-3.5 border-b border-[#dcd7ca] bg-[#ffffff]">
        <div className="canvas-toolbar-controls flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#141414]">
            <GridFour size={15} weight="bold" className="text-[#141414]" />
            <span>Canvas</span>
          </div>
        </div>

        {/* Canvas Backdrop & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#ffffff] p-1 rounded-full text-xs">
            <button
              onClick={() => setStageBg('envelope')}
              title="Warm Neutral Paper"
              className={`px-3 py-1 rounded-full transition-all cursor-pointer text-xs ${
                stageBg === 'envelope' ? 'bg-[#ffffff] text-[#141414] font-semibold shadow-xs' : 'text-[#141414] hover:text-[#141414]'
              }`}
            >
              Warm
            </button>
            <button
              onClick={() => setStageBg('mat')}
              title="Dark Cutting Mat"
              className={`px-3 py-1 rounded-full transition-all cursor-pointer text-xs ${
                stageBg === 'mat' ? 'bg-[#ffffff] text-[#141414] font-semibold shadow-xs' : 'text-[#141414] hover:text-[#141414]'
              }`}
            >
              Mat
            </button>
            <button
              onClick={() => setStageBg('paper')}
              title="Clean White Paper"
              className={`px-3 py-1 rounded-full transition-all cursor-pointer text-xs ${
                stageBg === 'paper' ? 'bg-[#ffffff] text-[#141414] font-semibold shadow-xs' : 'text-[#141414] hover:text-[#141414]'
              }`}
            >
              Paper
            </button>
            <button
              onClick={() => setStageBg('grid')}
              title="Transparency Checkerboard"
              className={`px-3 py-1 rounded-full transition-all cursor-pointer text-xs ${
                stageBg === 'grid' ? 'bg-[#ffffff] text-[#141414] font-semibold shadow-xs' : 'text-[#141414] hover:text-[#141414]'
              }`}
            >
              Grid
            </button>
          </div>

          <div className="h-4 w-px bg-[#dcd7ca] mx-0.5" />

          <div className="flex items-center bg-[#ffffff] p-0.5 rounded-full">
            <button
              onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.1).toFixed(1))))}
              className="p-1.5 rounded-full text-[#141414] hover:text-[#141414] hover:bg-[#ffffff] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <MagnifyingGlassMinus size={14} weight="bold" />
            </button>
            <span className="text-[11px] font-medium text-[#141414] w-9 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(1))))}
              className="p-1.5 rounded-full text-[#141414] hover:text-[#141414] hover:bg-[#ffffff] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <MagnifyingGlassPlus size={14} weight="bold" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 rounded-full text-[#141414] hover:text-[#141414] hover:bg-[#ffffff] transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <ArrowCounterClockwise size={13} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        className={`relative flex-1 flex flex-col items-center justify-center p-8 overflow-auto transition-colors duration-200 select-none ${stageBgStyles[stageBg]}`}
      >
        {/* Click-to-copy Toast Pill */}
        {copied && (
          <div className="absolute top-4 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141414] text-[#ffffff] text-xs font-medium shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
            <Check size={14} weight="bold" className="text-emerald-400" />
            <span>Copied PNG to clipboard!</span>
          </div>
        )}

        <div
          className="transition-transform duration-150 ease-out stamp-shadow cursor-pointer active:scale-[0.98]"
          style={{ transform: `scale(${zoom})` }}
          onClick={handleCopy}
          title="Click stamp to copy PNG image"
        >
          {/* Render the clean SVG */}
          <div
            dangerouslySetInnerHTML={{ __html: svgString }}
            className="block"
          />
        </div>

        <p className="text-[11px] text-[#141414] mt-4 select-none font-medium">
          Click stamp to copy PNG
        </p>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-5 py-3.5 border-t border-[#dcd7ca] bg-[#ffffff] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadStampPng(config, 3)}
            className="btn-primary"
          >
            <DownloadSimple size={15} weight="bold" />
            <span>Download PNG</span>
          </button>
        </div>

        <button
          onClick={onOpenApiModal}
          className="btn-secondary text-xs"
        >
          <Sparkle size={14} weight="fill" className="text-[#141414]" />
          <span>GET API Snippet &rarr;</span>
        </button>
      </div>
    </div>
  );
};
