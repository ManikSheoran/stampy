import React, { useState, useEffect } from 'react';
import type { StampConfig } from './core/types';
import { STAMP_PRESETS } from './core/presets';
import { decodeQueryToStamp, encodeStampToQuery } from './utils/urlState';
import { Header } from './components/Header';
import { StampCanvas } from './components/StampCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { PresetSelector } from './components/PresetSelector';
import { ApiSnippetModal } from './components/ApiSnippetModal';

export const App: React.FC = () => {
  // Initialize state from URL search params if present, else default preset
  const [config, setConfig] = useState<StampConfig>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      return decodeQueryToStamp(window.location.search);
    }
    return { ...STAMP_PRESETS[0].config };
  });

  const [activePresetId, setActivePresetId] = useState<string | undefined>('delhi-airmail');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Sync state to URL without reloading page
  useEffect(() => {
    const q = encodeStampToQuery(config);
    const newUrl = `${window.location.pathname}?${q}`;
    window.history.replaceState(null, '', newUrl);
  }, [config]);

  const handleSelectPreset = (newConfig: StampConfig, presetId: string) => {
    setConfig({ ...newConfig });
    setActivePresetId(presetId);
  };

  const handleConfigChange = (updated: StampConfig) => {
    setConfig(updated);
    setActivePresetId(undefined); // Custom modification
  };

  const handleReset = () => {
    setConfig({ ...STAMP_PRESETS[0].config });
    setActivePresetId('delhi-airmail');
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col text-[#212529]">
      {/* Studio Header */}
      <Header
        config={config}
        onChangeConfig={handleConfigChange}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
        {/* Curated Philatelic Presets Bar */}
        <PresetSelector
          currentPresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Split Studio Layout - Outer grid flows naturally, inner divs have fixed heights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Stamp Live Canvas Stage */}
          <div className="lg:col-span-6 xl:col-span-5 w-full">
            <StampCanvas
              config={config}
              onOpenApiModal={() => setIsApiModalOpen(true)}
            />
          </div>

          {/* Right: Customization Controls Panel */}
          <div className="lg:col-span-6 xl:col-span-7 w-full">
            <ControlsPanel
              config={config}
              onChange={handleConfigChange}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-[#fa812f] bg-[#fef3e2]/60 px-6 py-4 text-center text-xs text-[#212529]">
        Stampy — Postage stamp generator &amp; dynamic GET image API.
      </footer>

      {/* API Integration Snippet Modal */}
      <ApiSnippetModal
        config={config}
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
    </div>
  );
};

export default App;
