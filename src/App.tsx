import React, { useEffect, useMemo, useState } from 'react';
import type { StampConfig, BorderStyle, MotifType } from './core/types';
import { STAMP_PRESETS } from './core/presets';
import { PALETTES } from './core/themes';
import { renderStampSvg } from './core/stampRenderer';
import { encodeStampToQuery, decodeQueryToStamp } from './utils/urlState';
import { copyStampToClipboard, downloadStampPng, downloadStampSvg } from './utils/exportImage';
import { ApiSnippetModal } from './components/ApiSnippetModal';
import { ArrowUpRight, Check, DownloadSimple, LockKey, LockKeyOpen, Shuffle, Sparkle } from '@phosphor-icons/react';

type LockKeyName = 'route' | 'code' | 'value' | 'palette' | 'motif' | 'frame';
type Locks = Record<LockKeyName, boolean>;
const ROUTES = [
  ['Delhi', 'Paris', 'DL'],
  ['Tokyo', 'Kyoto', 'TY'],
  ['New York', 'London', 'NY'],
  ['Cairo', 'Rome', 'CA'],
  ['Oslo', 'Bergen', 'OS'],
  ['Geneva', 'Zurich', 'GE'],
  ['San Francisco', 'Tokyo', 'SF'],
  ['Madrid', 'Lisbon', 'MD'],
] as const;
const MOTIFS: MotifType[] = ['waves', 'concentric', 'sunburst', 'bauhaus', 'topography', 'crest', 'compass', 'halftone'];
const BORDERS: BorderStyle[] = ['classic-double', 'ornate', 'dashed', 'single', 'minimal'];
const VALUES = ['10', '15', '25', '42', '50', '80'];
const PALETTE_KEYS = Object.keys(PALETTES);
const defaultLocks: Locks = { route: false, code: false, value: false, palette: false, motif: false, frame: false };

function pick<T>(items: readonly T[], current?: T): T {
  const choices = current === undefined ? items : items.filter((item) => item !== current);
  return choices[Math.floor(Math.random() * choices.length)] ?? items[0];
}

function stripCurrency(value: string) {
  return value.replace(/[^0-9]/g, '').slice(0, 6);
}

export const App: React.FC = () => {
  const [config, setConfig] = useState<StampConfig>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const decoded = decodeQueryToStamp(window.location.search);
      return { ...decoded, denomination: stripCurrency(decoded.denomination) || '25' };
    }
    return { ...STAMP_PRESETS[0].config, denomination: '25' };
  });
  const [locks, setLocks] = useState<Locks>(defaultLocks);
  const [copied, setCopied] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isFinding, setIsFinding] = useState(false);

  useEffect(() => {
    window.history.replaceState(null, '', `${window.location.pathname}?${encodeStampToQuery(config)}`);
  }, [config]);

  const svg = useMemo(() => renderStampSvg(config, { width: 300, height: 400, idPrefix: 'studio-canvas' }), [config]);

  const update = (patch: Partial<StampConfig>) => setConfig((current) => ({ ...current, ...patch }));
  const toggleLock = (key: LockKeyName) => setLocks((current) => ({ ...current, [key]: !current[key] }));

  const findAnother = () => {
    setIsFinding(true);
    window.setTimeout(() => setIsFinding(false), 420);
    const route = pick(ROUTES, [config.fromLocation, config.toLocation, config.code] as typeof ROUTES[number]);
    const paletteKey = pick(PALETTE_KEYS, config.palette.id);
    update({
      ...(locks.route ? {} : { fromLocation: route[0], toLocation: route[1] }),
      ...(locks.code ? {} : { code: route[2] }),
      ...(locks.value ? {} : { denomination: pick(VALUES, config.denomination) }),
      ...(locks.palette ? {} : { palette: PALETTES[paletteKey] }),
      ...(locks.motif ? {} : { motif: pick(MOTIFS, config.motif) }),
      ...(locks.frame ? {} : { borderStyle: pick(BORDERS, config.borderStyle) }),
      postmark: locks.route ? config.postmark : { ...config.postmark, city: `${route[0].toUpperCase()} G.P.O.` },
    });
  };

  const copy = async () => {
    if (await copyStampToClipboard(config)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="stampy-app">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="wordmark" href="/" aria-label="Stampyyy home">
            stampyyy<span>.</span>
          </a>
          <nav className="site-nav">
            <button
              type="button"
              className="header-action-btn"
              onClick={() => downloadStampPng(config, 3)}
              title="Download high-resolution PNG"
            >
              <DownloadSimple size={14} weight="bold" />
              <span>PNG</span>
            </button>
            <button
              type="button"
              className="header-action-btn"
              onClick={() => downloadStampSvg(config)}
              title="Download scalable SVG"
            >
              <ArrowUpRight size={14} weight="bold" />
              <span>SVG</span>
            </button>
            <button type="button" className="nav-cta" onClick={() => setIsApiModalOpen(true)}>
              <span>API</span>
              <ArrowUpRight size={13} weight="bold" />
            </button>
          </nav>
        </div>
      </header>

      <main className="studio-main">
        <div className="studio-stage-area">
          <section className="intro-block">
            <p className="eyebrow">A SMALL MACHINE FOR BIG JOURNEYS</p>
            <h1>
              Find a stamp<br />
              <em>worth keeping.</em>
            </h1>
            <p className="intro-copy">
              A generative postage stamp for the places you’ve been, the places you’re going, and everywhere in between.
            </p>
          </section>

          <div className="canvas-column" id="studio">
            <div className={`stamp-stage ${isFinding ? 'is-finding' : ''}`}>
              <div className="stamp-stage-inner">
                <div className="stage-flank stage-flank-left">
                  <button
                    type="button"
                    className={`floating-lock floating-lock-route ${locks.route ? 'is-locked' : ''}`}
                    onClick={() => toggleLock('route')}
                    aria-pressed={locks.route}
                    title={`${locks.route ? 'Unlock' : 'Lock'} route`}
                  >
                    {locks.route ? <LockKey size={13} weight="fill" /> : <LockKeyOpen size={13} />}
                    <span>route</span>
                  </button>

                  <button
                    type="button"
                    className={`floating-lock floating-lock-motif ${locks.motif ? 'is-locked' : ''}`}
                    onClick={() => toggleLock('motif')}
                    aria-pressed={locks.motif}
                    title={`${locks.motif ? 'Unlock' : 'Lock'} motif`}
                  >
                    {locks.motif ? <LockKey size={13} weight="fill" /> : <LockKeyOpen size={13} />}
                    <span>motif</span>
                  </button>
                </div>

                <div className="stamp-art-wrapper">
                  <div
                    className="stamp-art stamp-shadow"
                    dangerouslySetInnerHTML={{ __html: svg }}
                    onClick={copy}
                    title="Click stamp to copy to clipboard"
                  />
                  {copied && (
                    <div className="stamp-copied-popup" role="status" aria-live="polite">
                      <Check size={14} weight="bold" />
                      <span>copied to clipboard</span>
                    </div>
                  )}
                </div>

                <div className="stage-flank stage-flank-right">
                  <button
                    type="button"
                    className={`floating-lock floating-lock-palette ${locks.palette ? 'is-locked' : ''}`}
                    onClick={() => toggleLock('palette')}
                    aria-pressed={locks.palette}
                    title={`${locks.palette ? 'Unlock' : 'Lock'} colour palette`}
                  >
                    {locks.palette ? <LockKey size={13} weight="fill" /> : <LockKeyOpen size={13} />}
                    <span>colour</span>
                  </button>

                  <button
                    type="button"
                    className={`floating-lock floating-lock-frame ${locks.frame ? 'is-locked' : ''}`}
                    onClick={() => toggleLock('frame')}
                    aria-pressed={locks.frame}
                    title={`${locks.frame ? 'Unlock' : 'Lock'} frame`}
                  >
                    {locks.frame ? <LockKey size={13} weight="fill" /> : <LockKeyOpen size={13} />}
                    <span>frame</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="canvas-actions">
              <button type="button" onClick={() => downloadStampPng(config, 3)}>
                <DownloadSimple size={15} weight="bold" /> download png
              </button>
              <button type="button" onClick={() => downloadStampSvg(config)}>
                <ArrowUpRight size={15} weight="bold" /> svg
              </button>
              <button type="button" onClick={() => setIsApiModalOpen(true)}>
                <Sparkle size={15} weight="bold" /> api docs
              </button>
            </div>
          </div>

          <div className="studio-stage-spacer" aria-hidden="true" />
        </div>

          <aside className="controls-column" id="inputs">
            <div className="control-intro">
              <span>MAKE IT YOURS</span>
              <span>INPUT / 04</span>
            </div>

            <label className="field-label">
              <div className="field-label-header">
                <span className="field-title">From</span>
                <span className="field-sub">origin</span>
              </div>
              <input
                value={config.fromLocation}
                onChange={(event) => update({ fromLocation: event.target.value })}
                placeholder="Delhi"
              />
            </label>

            <label className="field-label">
              <div className="field-label-header">
                <span className="field-title">To</span>
                <span className="field-sub">destination</span>
              </div>
              <input
                value={config.toLocation}
                onChange={(event) => update({ toLocation: event.target.value })}
                placeholder="Paris"
              />
            </label>

            <div className="field-row">
              <label className="field-label">
                <div className="field-label-header">
                  <span className="field-title">Code</span>
                  <span className="field-sub">monogram</span>
                  <button
                    type="button"
                    className={`field-lock-btn ${locks.code ? 'is-locked' : ''}`}
                    onClick={() => toggleLock('code')}
                    title={locks.code ? 'Unlock code' : 'Lock code'}
                    aria-label={locks.code ? 'Unlock code' : 'Lock code'}
                  >
                    {locks.code ? <LockKey size={12} weight="fill" /> : <LockKeyOpen size={12} />}
                    <span>{locks.code ? 'locked' : 'lock'}</span>
                  </button>
                </div>
                <input
                  value={config.code}
                  maxLength={4}
                  onChange={(event) => update({ code: event.target.value.toUpperCase().replace(/[^A-Z]/g, '') })}
                  placeholder="DL"
                />
              </label>

              <label className="field-label">
                <div className="field-label-header">
                  <span className="field-title">Value</span>
                  <span className="field-sub">digits</span>
                  <button
                    type="button"
                    className={`field-lock-btn ${locks.value ? 'is-locked' : ''}`}
                    onClick={() => toggleLock('value')}
                    title={locks.value ? 'Unlock value' : 'Lock value'}
                    aria-label={locks.value ? 'Unlock value' : 'Lock value'}
                  >
                    {locks.value ? <LockKey size={12} weight="fill" /> : <LockKeyOpen size={12} />}
                    <span>{locks.value ? 'locked' : 'lock'}</span>
                  </button>
                </div>
                <input
                  inputMode="numeric"
                  value={config.denomination.replace(/[^0-9]/g, '')}
                  onChange={(event) => update({ denomination: stripCurrency(event.target.value) })}
                  placeholder="25"
                />
              </label>
            </div>

            <button type="button" className="find-button" onClick={findAnother}>
              <Shuffle size={16} weight="bold" />
              <span>find another</span>
              <small>↗</small>
            </button>

            <p className="control-note">Lock anything you want to keep. Find another will randomize the rest.</p>
          </aside>

        <footer className="studio-footer">
          <span>STAMPYYY / 2026</span>
          <span>MADE FOR THE IN-BETWEEN</span>
          <a href="https://x.com/mashrndev" target="_blank" rel="noreferrer">
            BY MANIK <ArrowUpRight size={12} />
          </a>
        </footer>
      </main>

      <ApiSnippetModal config={config} isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
    </div>
  );
};

export default App;
