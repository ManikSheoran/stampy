import React, { useState } from 'react';
import type { StampConfig, MotifType, BorderStyle } from '../core/types';
import { PALETTES } from '../core/themes';
import { 
  Palette, 
  Shapes, 
  Scissors, 
  Stamp as StampIcon, 
  ArrowCounterClockwise,
  AirplaneTakeoff,
  MapPin
} from '@phosphor-icons/react';
import { MotifBlock, BorderBlock, PaletteBlock } from './VisualBlocks';

interface ControlsPanelProps {
  config: StampConfig;
  onChange: (updated: StampConfig) => void;
  onReset: () => void;
}

const MOTIFS: { id: MotifType; label: string; desc: string }[] = [
  { id: 'waves', label: 'Guilloche Waves', desc: 'Harmonic banknote & airmail sine waves' },
  { id: 'concentric', label: 'Concentric Rings', desc: 'Target circles with alternating dashes' },
  { id: 'sunburst', label: 'Solar Sunburst', desc: 'Radiating geometric rays & horizon' },
  { id: 'bauhaus', label: 'Bauhaus Modern', desc: 'Minimalist semicircles & geometric blocks' },
  { id: 'topography', label: 'Topography', desc: 'Organic cartographic elevation curves' },
  { id: 'crest', label: 'Heraldic Crest', desc: 'Diamond starburst & classic postal seal' },
  { id: 'compass', label: 'Airmail Compass', desc: 'Navigational 8-point nautical star' },
  { id: 'halftone', label: 'Halftone Dot Matrix', desc: 'Engraved stipple dot distribution' },
];

const BORDER_STYLES: { id: BorderStyle; label: string }[] = [
  { id: 'classic-double', label: 'Classic Double' },
  { id: 'ornate', label: 'Ornate Brackets' },
  { id: 'dashed', label: 'Postal Dashes' },
  { id: 'single', label: 'Crisp Single' },
  { id: 'minimal', label: 'Hairline' },
];

type TabType = 'route' | 'palette' | 'motif' | 'borders' | 'postmark';

export const ControlsPanel: React.FC<ControlsPanelProps> = ({ config, onChange, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabType>('route');
  const [showCustomColors, setShowCustomColors] = useState(false);

  const update = <K extends keyof StampConfig>(key: K, value: StampConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const updatePostmark = <K extends keyof StampConfig['postmark']>(key: K, value: StampConfig['postmark'][K]) => {
    onChange({
      ...config,
      postmark: {
        ...config.postmark,
        [key]: value,
      },
    });
  };

  const updatePaletteColor = (colorKey: 'paper' | 'primary' | 'secondary' | 'border' | 'postmark', val: string) => {
    onChange({
      ...config,
      palette: {
        ...config.palette,
        id: 'custom',
        name: 'Custom Palette',
        [colorKey]: val,
      },
    });
  };

  return (
    <div className="flex flex-col h-[560px] sm:h-[600px] lg:h-[640px] rounded-3xl editorial-card overflow-hidden">
      {/* Category Navigation Tabs + Reset Button */}
      <div className="flex items-center justify-between border-b border-[#fa812f] bg-[#fef3e2] px-4 py-3 gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 bg-[#fef3e2] p-1 rounded-full">
          <button
            onClick={() => setActiveTab('route')}
            className={`whitespace-nowrap cursor-pointer ${
              activeTab === 'route' ? 'tab-pill-active' : 'tab-pill'
            }`}
          >
            <AirplaneTakeoff size={14} weight={activeTab === 'route' ? 'fill' : 'regular'} />
            <span>Route</span>
          </button>

          <button
            onClick={() => setActiveTab('palette')}
            className={`whitespace-nowrap cursor-pointer ${
              activeTab === 'palette' ? 'tab-pill-active' : 'tab-pill'
            }`}
          >
            <Palette size={14} weight={activeTab === 'palette' ? 'fill' : 'regular'} />
            <span>Colors</span>
          </button>

          <button
            onClick={() => setActiveTab('motif')}
            className={`whitespace-nowrap cursor-pointer ${
              activeTab === 'motif' ? 'tab-pill-active' : 'tab-pill'
            }`}
          >
            <Shapes size={14} weight={activeTab === 'motif' ? 'fill' : 'regular'} />
            <span>Motif</span>
          </button>

          <button
            onClick={() => setActiveTab('borders')}
            className={`whitespace-nowrap cursor-pointer ${
              activeTab === 'borders' ? 'tab-pill-active' : 'tab-pill'
            }`}
          >
            <Scissors size={14} weight={activeTab === 'borders' ? 'fill' : 'regular'} />
            <span>Frame</span>
          </button>

          <button
            onClick={() => setActiveTab('postmark')}
            className={`whitespace-nowrap cursor-pointer ${
              activeTab === 'postmark' ? 'tab-pill-active' : 'tab-pill'
            }`}
          >
            <StampIcon size={14} weight={activeTab === 'postmark' ? 'fill' : 'regular'} />
            <span>Postmark</span>
          </button>
        </div>

        {/* RESET BUTTON */}
        <button
          onClick={onReset}
          className="btn-secondary text-xs px-3 py-1.5 whitespace-nowrap ml-1"
          title="Reset all parameters to default"
        >
          <ArrowCounterClockwise size={13} weight="bold" />
          <span>Reset</span>
        </button>
      </div>

      {/* Tab Contents - Constrained inner scrolling */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-[#212529] scrollbar-thin">
        {/* ===================== TAB 1: ROUTE & TEXT ===================== */}
        {activeTab === 'route' && (
          <div className="space-y-4">
            {/* Required in API banner */}
            <div className="p-3.5 rounded-2xl bg-[#fef3e2] border border-[#fa812f] flex items-start gap-3 text-xs text-[#212529]">
              <MapPin size={16} weight="fill" className="text-[#212529] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-[#212529] block">Postal Route</strong>
                A stamp represents a journey between sender and destination. Specify Origin and Destination below.
              </div>
            </div>

            {/* From & To Location inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                <label className="text-xs font-medium text-[#212529] block mb-1.5">
                  From (Origin) <span className="text-[#212529]">*</span>
                </label>
                <input
                  type="text"
                  value={config.fromLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoCode = val ? val.slice(0, 2).toUpperCase() : config.code;
                    onChange({
                      ...config,
                      fromLocation: val,
                      code: config.code ? config.code : autoCode,
                    });
                  }}
                  placeholder="Delhi"
                  className="w-full minimal-input font-medium"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                <label className="text-xs font-medium text-[#212529] block mb-1.5">
                  To (Destination) <span className="text-[#212529]">*</span>
                </label>
                <input
                  type="text"
                  value={config.toLocation}
                  onChange={(e) => update('toLocation', e.target.value)}
                  placeholder="Paris"
                  className="w-full minimal-input font-medium"
                />
              </div>
            </div>

            {/* City Code (2-3 letters) */}
            <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#212529]">
                  Corner Monogram (2–3 Letters)
                </label>
                <span className="text-[11px] text-[#212529] bg-[#fef3e2] px-2 py-0.5 rounded-full font-medium">
                  Serif
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  maxLength={4}
                  value={config.code}
                  onChange={(e) => update('code', e.target.value.toUpperCase())}
                  placeholder="DL"
                  className="w-24 minimal-input text-lg font-serif font-bold text-center uppercase tracking-widest"
                />
                <div className="flex-1 text-xs text-[#212529]">
                  Postal abbreviation (e.g. DL for Delhi, NY, TY, SF, PA, LD).
                </div>
              </div>

              {/* Placement */}
              <div className="mt-3.5 pt-3 border-t border-[#fa812f] flex items-center justify-between">
                <span className="text-xs text-[#212529] font-medium">Code Placement</span>
                <div className="flex gap-1 bg-[#fef3e2] p-0.5 rounded-full text-xs">
                  <button
                    onClick={() => update('codePlacement', 'top-left')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      config.codePlacement === 'top-left'
                        ? 'bg-[#fa4032] text-[#212529] font-semibold shadow-xs'
                        : 'text-[#212529] hover:text-[#fa4032]'
                    }`}
                  >
                    Top-Left
                  </button>
                  <button
                    onClick={() => update('codePlacement', 'top-right')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      config.codePlacement === 'top-right'
                        ? 'bg-[#fa4032] text-[#212529] font-semibold shadow-xs'
                        : 'text-[#212529] hover:text-[#fa4032]'
                    }`}
                  >
                    Top-Right
                  </button>
                </div>
              </div>
            </div>

            {/* Denomination / Value Badge */}
            <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
              <label className="block text-xs font-medium text-[#212529] mb-1.5">
                Postal Denomination / Value
              </label>
              <input
                type="text"
                maxLength={8}
                value={config.denomination}
                onChange={(e) => update('denomination', e.target.value)}
                placeholder="25¢"
                className="w-full minimal-input font-mono"
              />
              <div className="flex gap-2 mt-3 flex-wrap">
                {['25¢', '50¢', '₹5', '¥80', '£1', '10', '№ 07', '★ POST'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update('denomination', opt)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer active:scale-[0.97] ${
                      config.denomination === opt
                        ? 'bg-[#fa4032] text-[#212529] shadow-xs'
                        : 'bg-[#fef3e2] border border-[#fa812f] text-[#212529] hover:border-[#fa4032] hover:text-[#fa4032]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-header & Title */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                <label className="text-xs font-medium text-[#212529] block mb-1.5">
                  Header Subtitle
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={config.headerSub}
                  onChange={(e) => update('headerSub', e.target.value.toUpperCase())}
                  placeholder="AIR MAIL"
                  className="w-full minimal-input text-xs uppercase font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                <label className="text-xs font-medium text-[#212529] block mb-1.5">
                  Lower Main Title
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={config.title}
                  onChange={(e) => update('title', e.target.value.toUpperCase())}
                  placeholder="POSTAGE"
                  className="w-full minimal-input text-xs font-serif uppercase tracking-wider"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: INKS & PAPER ===================== */}
        {activeTab === 'palette' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-medium text-[#212529]">
                  Color Palettes
                </label>
                <span className="text-[11px] text-[#fa4032] bg-[#fef3e2] px-2.5 py-0.5 rounded-full font-semibold border border-[#fa812f]">
                  {Object.keys(PALETTES).length} formulas
                </span>
              </div>
              
              {/* Visual Side-by-Side Palette Specimen Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.values(PALETTES).map((pal) => (
                  <PaletteBlock
                    key={pal.id}
                    palette={pal}
                    config={config}
                    isSelected={config.palette.id === pal.id}
                    onSelect={() => update('palette', pal)}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Pickers Accordion */}
            <div className="pt-2 border-t border-[#fa812f]">
              <button
                onClick={() => setShowCustomColors(!showCustomColors)}
                className="flex items-center justify-between w-full text-xs font-medium text-[#212529] hover:text-[#fa4032] transition-colors py-1 cursor-pointer"
              >
                <span>Custom Color Inks</span>
                <span className="text-[#fa4032] font-bold">{showCustomColors ? '▲' : '▼'}</span>
              </button>

              {showCustomColors && (
                <div className="grid grid-cols-2 gap-3 mt-3 p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                  <div>
                    <label className="text-xs text-[#212529] block mb-1 font-medium">Paper (Background)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.palette.paper}
                        onChange={(e) => updatePaletteColor('paper', e.target.value)}
                        className="w-7 h-7 rounded-full border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={config.palette.paper}
                        onChange={(e) => updatePaletteColor('paper', e.target.value)}
                        className="w-20 px-2 py-1 minimal-input text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#212529] block mb-1 font-medium">Primary Ink</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.palette.primary}
                        onChange={(e) => updatePaletteColor('primary', e.target.value)}
                        className="w-7 h-7 rounded-full border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={config.palette.primary}
                        onChange={(e) => updatePaletteColor('primary', e.target.value)}
                        className="w-20 px-2 py-1 minimal-input text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#212529] block mb-1 font-medium">Secondary Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.palette.secondary}
                        onChange={(e) => updatePaletteColor('secondary', e.target.value)}
                        className="w-7 h-7 rounded-full border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={config.palette.secondary}
                        onChange={(e) => updatePaletteColor('secondary', e.target.value)}
                        className="w-20 px-2 py-1 minimal-input text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#212529] block mb-1 font-medium">Border Frame</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.palette.border}
                        onChange={(e) => updatePaletteColor('border', e.target.value)}
                        className="w-7 h-7 rounded-full border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={config.palette.border}
                        onChange={(e) => updatePaletteColor('border', e.target.value)}
                        className="w-20 px-2 py-1 minimal-input text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: MOTIF ===================== */}
        {activeTab === 'motif' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-medium text-[#212529]">
                  Motif Artwork
                </label>
                <span className="text-[11px] text-[#fa4032] bg-[#fef3e2] px-2.5 py-0.5 rounded-full font-semibold border border-[#fa812f]">
                  {MOTIFS.length} styles
                </span>
              </div>

              {/* Side-by-side Visual Motif Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {MOTIFS.map((m) => (
                  <MotifBlock
                    key={m.id}
                    id={m.id}
                    label={m.label}
                    desc={m.desc}
                    config={config}
                    isSelected={config.motif === m.id}
                    onSelect={() => update('motif', m.id)}
                  />
                ))}
              </div>
            </div>

            {/* Motif Scale Slider */}
            <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#212529]">Motif Scale</label>
                <span className="text-xs font-semibold text-[#fa4032]">{Math.round(config.motifScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={config.motifScale}
                onChange={(e) => update('motifScale', parseFloat(e.target.value))}
                className="w-full accent-[#fa4032] cursor-pointer"
              />
            </div>

            {/* Motif Density / Complexity Slider */}
            <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#212529]">Line Density &amp; Complexity</label>
                <span className="text-xs font-semibold text-[#fa4032]">{config.motifComplexity}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={config.motifComplexity}
                onChange={(e) => update('motifComplexity', parseInt(e.target.value, 10))}
                className="w-full accent-[#fa4032] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ===================== TAB 4: PERFORATIONS & FRAME ===================== */}
        {activeTab === 'borders' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-medium text-[#212529]">
                  Frame Styles
                </label>
                <span className="text-[11px] text-[#fa4032] bg-[#fef3e2] px-2.5 py-0.5 rounded-full font-semibold border border-[#fa812f]">
                  {BORDER_STYLES.length} styles
                </span>
              </div>

              {/* Side-by-side Visual Border Frame Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {BORDER_STYLES.map((b) => (
                  <BorderBlock
                    key={b.id}
                    id={b.id}
                    label={b.label}
                    config={config}
                    isSelected={config.borderStyle === b.id}
                    onSelect={() => update('borderStyle', b.id)}
                  />
                ))}
              </div>
            </div>

            {/* Perforation Radius */}
            <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#212529]">
                  Perforation Tooth Depth
                </label>
                <span className="text-xs font-semibold text-[#fa4032]">{config.perforationRadius} px</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="8.5"
                step="0.5"
                value={config.perforationRadius}
                onChange={(e) => update('perforationRadius', parseFloat(e.target.value))}
                className="w-full accent-[#fa4032] cursor-pointer"
              />
            </div>

            {/* Perforation Spacing */}
            <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#212529]">
                  Perforation Spacing
                </label>
                <span className="text-xs font-semibold text-[#fa4032]">{config.perforationSpacing} px</span>
              </div>
              <input
                type="range"
                min="14"
                max="24"
                step="1"
                value={config.perforationSpacing}
                onChange={(e) => update('perforationSpacing', parseInt(e.target.value, 10))}
                className="w-full accent-[#fa4032] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ===================== TAB 5: POSTMARK ===================== */}
        {activeTab === 'postmark' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#212529]">Postal Ink Cancellation</span>
                <span className="text-xs text-[#212529]">Rubber-stamped postmark overlay</span>
              </div>
              <input
                type="checkbox"
                checked={config.postmark.enabled}
                onChange={(e) => updatePostmark('enabled', e.target.checked)}
                className="w-4 h-4 rounded accent-[#fa4032] cursor-pointer"
              />
            </div>

            {config.postmark.enabled && (
              <div className="space-y-4 pt-1">
                {/* City */}
                <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                  <label className="block text-xs font-medium text-[#212529] mb-1.5">
                    Post Office / City Seal
                  </label>
                  <input
                    type="text"
                    value={config.postmark.city}
                    onChange={(e) => updatePostmark('city', e.target.value)}
                    placeholder="DELHI G.P.O."
                    className="w-full minimal-input text-xs font-mono"
                  />
                </div>

                {/* Date */}
                <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                  <label className="block text-xs font-medium text-[#212529] mb-1.5">
                    Cancellation Date
                  </label>
                  <input
                    type="text"
                    value={config.postmark.date}
                    onChange={(e) => updatePostmark('date', e.target.value)}
                    placeholder="14 SEP 2026"
                    className="w-full minimal-input text-xs font-mono"
                  />
                </div>

                {/* Stamp Rotation */}
                <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-[#212529]">
                      Stamp Angle
                    </label>
                    <span className="text-xs font-semibold text-[#fa4032]">{config.postmark.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={config.postmark.rotation}
                    onChange={(e) => updatePostmark('rotation', parseInt(e.target.value, 10))}
                    className="w-full accent-[#fa4032] cursor-pointer"
                  />
                </div>

                {/* Wavy Killer Bars */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f]">
                  <span className="text-xs font-semibold text-[#212529]">Wavy Postal Bars</span>
                  <input
                    type="checkbox"
                    checked={config.postmark.wavyBars}
                    onChange={(e) => updatePostmark('wavyBars', e.target.checked)}
                    className="w-4 h-4 rounded accent-[#fa4032] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
