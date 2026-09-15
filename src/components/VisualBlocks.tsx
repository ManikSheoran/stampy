import React, { useMemo } from 'react';
import type { StampConfig, MotifType, BorderStyle, StampPalette } from '../core/types';
import { renderStampSvg } from '../core/stampRenderer';

// ============================================================================
// 1. MOTIF PREVIEW BLOCK (Renders real stamp with this motif)
// ============================================================================
interface MotifBlockProps {
  id: MotifType;
  label: string;
  desc: string;
  config: StampConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export const MotifBlock: React.FC<MotifBlockProps> = ({
  id,
  label,
  config,
  isSelected,
  onSelect,
}) => {
  const miniSvg = useMemo(() => {
    return renderStampSvg(
      { ...config, motif: id },
      { width: 300, height: 400, idPrefix: `m-prev-${id}` }
    );
  }, [config, id]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col items-center p-3 rounded-2xl transition-all duration-150 cursor-pointer active:scale-[0.97] ${
        isSelected
          ? 'bg-white border-2 border-[#2563eb] shadow-sm ring-2 ring-[#2563eb]/20'
          : 'bg-[#faf9f6] border border-[#e8e5df] hover:bg-white hover:border-[#93c5fd]'
      }`}
    >
      {/* Real Miniature Stamp Preview */}
      <div className="stamp-thumb-wrap w-[70px] h-[93px] my-1 transition-transform duration-200 group-hover:scale-105">
        <div 
          className="w-full h-full drop-shadow-xs"
          dangerouslySetInnerHTML={{ __html: miniSvg }} 
        />
      </div>

      {/* Typography */}
      <span className={`text-xs font-semibold mt-1.5 leading-tight transition-colors ${
        isSelected ? 'text-[#2563eb]' : 'text-[#18181b] group-hover:text-[#2563eb]'
      }`}>
        {label}
      </span>
      <span className="text-[11px] text-[#71717a] capitalize mt-0.5">
        {id}
      </span>
    </button>
  );
};

// ============================================================================
// 2. BORDER PREVIEW BLOCK (Renders real stamp with this border style)
// ============================================================================
interface BorderBlockProps {
  id: BorderStyle;
  label: string;
  config: StampConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export const BorderBlock: React.FC<BorderBlockProps> = ({
  id,
  label,
  config,
  isSelected,
  onSelect,
}) => {
  const miniSvg = useMemo(() => {
    return renderStampSvg(
      { ...config, borderStyle: id },
      { width: 300, height: 400, idPrefix: `b-prev-${id}` }
    );
  }, [config, id]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col items-center p-3 rounded-2xl transition-all duration-150 cursor-pointer active:scale-[0.97] ${
        isSelected
          ? 'bg-white border-2 border-[#2563eb] shadow-sm ring-2 ring-[#2563eb]/20'
          : 'bg-[#faf9f6] border border-[#e8e5df] hover:bg-white hover:border-[#93c5fd]'
      }`}
    >
      {/* Real Miniature Stamp Preview with Border */}
      <div className="stamp-thumb-wrap w-[70px] h-[93px] my-1 transition-transform duration-200 group-hover:scale-105">
        <div 
          className="w-full h-full drop-shadow-xs"
          dangerouslySetInnerHTML={{ __html: miniSvg }} 
        />
      </div>

      <span className={`text-xs font-semibold mt-1.5 leading-tight transition-colors ${
        isSelected ? 'text-[#2563eb]' : 'text-[#18181b] group-hover:text-[#2563eb]'
      }`}>
        {label}
      </span>
      <span className="text-[11px] text-[#71717a] capitalize mt-0.5">
        {id}
      </span>
    </button>
  );
};

// ============================================================================
// 3. PALETTE PREVIEW BLOCK (Renders real stamp with this ink recipe)
// ============================================================================
interface PaletteBlockProps {
  palette: StampPalette;
  config: StampConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export const PaletteBlock: React.FC<PaletteBlockProps> = ({
  palette,
  config,
  isSelected,
  onSelect,
}) => {
  const miniSvg = useMemo(() => {
    return renderStampSvg(
      { ...config, palette },
      { width: 300, height: 400, idPrefix: `p-prev-${palette.id}` }
    );
  }, [config, palette]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col items-center p-3 rounded-2xl transition-all duration-150 cursor-pointer active:scale-[0.97] ${
        isSelected
          ? 'bg-white border-2 border-[#2563eb] shadow-sm ring-2 ring-[#2563eb]/20'
          : 'bg-[#faf9f6] border border-[#e8e5df] hover:bg-white hover:border-[#93c5fd]'
      }`}
    >
      {/* Real Miniature Stamp Preview with Palette */}
      <div className="stamp-thumb-wrap w-[70px] h-[93px] my-1 transition-transform duration-200 group-hover:scale-105">
        <div 
          className="w-full h-full drop-shadow-xs"
          dangerouslySetInnerHTML={{ __html: miniSvg }} 
        />
      </div>

      <span className={`text-xs font-semibold mt-1.5 truncate max-w-full transition-colors ${
        isSelected ? 'text-[#2563eb]' : 'text-[#18181b] group-hover:text-[#2563eb]'
      }`}>
        {palette.name}
      </span>
      <div className="flex items-center gap-1.5 mt-1">
        <div 
          className="w-3 h-3 rounded-full border border-black/10 shadow-2xs" 
          style={{ backgroundColor: palette.primary }} 
          title="Primary Color"
        />
        <div 
          className="w-3 h-3 rounded-full border border-black/10 shadow-2xs" 
          style={{ backgroundColor: palette.secondary }} 
          title="Secondary Color"
        />
      </div>
    </button>
  );
};
