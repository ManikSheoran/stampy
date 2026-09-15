import React, { useMemo } from 'react';
import { STAMP_PRESETS } from '../core/presets';
import type { StampConfig } from '../core/types';
import { renderStampSvg } from '../core/stampRenderer';

interface PresetSelectorProps {
  currentPresetId?: string;
  onSelectPreset: (config: StampConfig, presetId: string) => void;
}

const PresetThumbnail: React.FC<{ config: StampConfig; presetId: string }> = ({ config, presetId }) => {
  const svg = useMemo(() => {
    return renderStampSvg(config, { width: 300, height: 400, idPrefix: `preset-${presetId}` });
  }, [config, presetId]);

  return (
    <div 
      className="stamp-thumb-wrap w-[44px] h-[58px] drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#212529]">
            Featured Presets
          </span>
          <span className="text-[11px] text-[#fa4032] bg-[#fef3e2] px-2.5 py-0.5 rounded-full font-semibold border border-[#fa812f]">
            {STAMP_PRESETS.length} presets
          </span>
        </div>
        <span className="text-[11px] text-[#212529] hidden sm:inline">
          Click any preset to apply
        </span>
      </div>

      {/* Side by side horizontal specimen blocks */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin pt-0.5">
        {STAMP_PRESETS.map((preset) => {
          const isSelected = currentPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.config, preset.id)}
              className={`group flex-shrink-0 flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#fef3e2] border-2 border-[#fa4032] shadow-sm ring-2 ring-[#fa4032]/20'
                  : 'bg-[#fef3e2] border border-[#fa812f] hover:bg-[#fef3e2] hover:border-[#fa812f]'
              }`}
            >
              {/* Real rendered mini stamp */}
              <PresetThumbnail config={preset.config} presetId={preset.id} />

              {/* Information */}
              <div className="flex flex-col pr-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold leading-tight transition-colors ${
                    isSelected ? 'text-[#fa4032]' : 'text-[#212529] group-hover:text-[#fa4032]'
                  }`}>
                    {preset.name}
                  </span>
                </div>
                <span className="text-[11px] text-[#212529] font-medium mt-0.5">
                  {preset.config.fromLocation || preset.config.code} &rarr; {preset.config.toLocation}
                </span>
                <span className="text-[11px] text-[#212529] capitalize mt-0.5">
                  {preset.config.palette.name} &middot; {preset.config.denomination}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
