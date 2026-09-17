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
const ROUTES = [['Delhi', 'Paris', 'DL'], ['Tokyo', 'Kyoto', 'TY'], ['New York', 'London', 'NY'], ['Cairo', 'Rome', 'CA'], ['Oslo', 'Bergen', 'OS'], ['Geneva', 'Zurich', 'GE'], ['San Francisco', 'Tokyo', 'SF'], ['Madrid', 'Lisbon', 'MD']] as const;
const MOTIFS: MotifType[] = ['waves', 'concentric', 'sunburst', 'bauhaus', 'topography', 'crest', 'compass', 'halftone'];
const BORDERS: BorderStyle[] = ['classic-double', 'ornate', 'dashed', 'single', 'minimal'];
const VALUES = ['10', '15', '25', '42', '50', '80'];
const PALETTE_KEYS = Object.keys(PALETTES);
const defaultLocks: Locks = { route: false, code: false, value: false, palette: false, motif: false, frame: false };

function pick<T>(items: readonly T[], current?: T): T {
  const choices = current === undefined ? items : items.filter((item) => item !== current);
  return choices[Math.floor(Math.random() * choices.length)] ?? items[0];
}
function stripCurrency(value: string) { return value.replace(/[^0-9]/g, '').slice(0, 6); }

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
  useEffect(() => { window.history.replaceState(null, '', `${window.location.pathname}?${encodeStampToQuery(config)}`); }, [config]);
  const svg = useMemo(() => renderStampSvg(config, { width: 300, height: 400, idPrefix: 'studio-canvas' }), [config]);
  const update = (patch: Partial<StampConfig>) => setConfig((current) => ({ ...current, ...patch }));
  const toggleLock = (key: LockKeyName) => setLocks((current) => ({ ...current, [key]: !current[key] }));
  const findAnother = () => {
    setIsFinding(true); window.setTimeout(() => setIsFinding(false), 420);
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
  const copy = async () => { if (await copyStampToClipboard(config)) { setCopied(true); window.setTimeout(() => setCopied(false), 1800); } };

  return <div className="stampy-app">
    <header className="site-header"><a className="wordmark" href="/" aria-label="Stampy home">stampy<span>.</span></a><nav className="site-nav"><a href="#studio">studio</a><a href="#inputs">inputs</a><button className="nav-cta" onClick={() => setIsApiModalOpen(true)}>API <ArrowUpRight size={14} /></button></nav><div className="header-meta"><span>GENERATIVE POSTAGE</span><span className="header-dot" /><span>01 / 01</span></div></header>
    <main className="studio-main">
      <section className="intro-block"><p className="eyebrow">A SMALL MACHINE FOR BIG JOURNEYS</p><h1>Find a stamp<br /><em>worth keeping.</em></h1><p className="intro-copy">A generative postage stamp for the places you’ve been, the places you’re going, and everywhere in between.</p></section>
      <section className="canvas-layout" id="studio">
        <div className="canvas-column"><div className={`stamp-stage ${isFinding ? 'is-finding' : ''}`}>
          <span className="stage-index">01 / STAMP</span><div className="stage-mark stage-mark-tl" /><div className="stage-mark stage-mark-br" />
          <div className="stamp-art stamp-shadow" dangerouslySetInnerHTML={{ __html: svg }} onClick={copy} title="Copy stamp" />
          {(['route', 'palette', 'motif', 'frame'] as LockKeyName[]).map((key) => <button key={key} className={`floating-lock floating-lock-${key} ${locks[key] ? 'is-locked' : ''}`} onClick={() => toggleLock(key)}>{locks[key] ? <LockKey size={14} weight="fill" /> : <LockKeyOpen size={14} />}<span>{key === 'palette' ? 'colour' : key}</span></button>)}
          <p className="copy-hint">{copied ? <><Check size={12} /> copied to clipboard</> : 'click stamp to copy'}</p>
        </div><div className="canvas-actions"><button onClick={() => downloadStampPng(config, 3)}><DownloadSimple size={16} /> download png</button><button onClick={() => downloadStampSvg(config)}><ArrowUpRight size={16} /> svg</button><button onClick={() => setIsApiModalOpen(true)}><Sparkle size={16} /> api</button></div></div>
        <aside className="controls-column" id="inputs"><div className="control-intro"><span>MAKE IT YOURS</span><span>INPUT / 04</span></div>
          <label className="field-label">From <span>origin</span><input value={config.fromLocation} onChange={(event) => update({ fromLocation: event.target.value })} placeholder="Delhi" /></label>
          <label className="field-label">To <span>destination</span><input value={config.toLocation} onChange={(event) => update({ toLocation: event.target.value })} placeholder="Paris" /></label>
          <div className="field-row"><label className="field-label">Code <span>monogram</span><input value={config.code} maxLength={4} onChange={(event) => update({ code: event.target.value.toUpperCase().replace(/[^A-Z]/g, '') })} placeholder="DL" /></label><label className="field-label">Value <span>digits only</span><input inputMode="numeric" value={config.denomination.replace(/[^0-9]/g, '')} onChange={(event) => update({ denomination: stripCurrency(event.target.value) })} placeholder="25" /></label></div>
          <div className="lock-list"><button onClick={() => toggleLock('code')} className={locks.code ? 'is-locked' : ''}><span>{locks.code ? 'locked' : 'lock'} code</span>{locks.code ? <LockKey size={14} weight="fill" /> : <LockKeyOpen size={14} />}</button><button onClick={() => toggleLock('value')} className={locks.value ? 'is-locked' : ''}><span>{locks.value ? 'locked' : 'lock'} value</span>{locks.value ? <LockKey size={14} weight="fill" /> : <LockKeyOpen size={14} />}</button></div>
          <button className="find-button" onClick={findAnother}><Shuffle size={18} weight="bold" /><span>find another</span><small>↗</small></button><p className="control-note">Lock anything you want to keep. Find another will change the rest.</p>
        </aside>
      </section>
      <footer className="studio-footer"><span>STAMPY / 2026</span><span>MADE FOR THE IN-BETWEEN</span><a href="https://x.com/mashrndev" target="_blank" rel="noreferrer">BY MANIK <ArrowUpRight size={12} /></a></footer>
    </main>
    <ApiSnippetModal config={config} isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
  </div>;
};
export default App;
