import React, { useState } from 'react';
import type { StampConfig } from '../core/types';
import { encodeStampToQuery } from '../utils/urlState';
import { ArrowSquareOut, Check, Copy, Globe, X } from '@phosphor-icons/react';

interface ApiSnippetModalProps { config: StampConfig; isOpen: boolean; onClose: () => void; }

export const ApiSnippetModal: React.FC<ApiSnippetModalProps> = ({ config, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'markdown' | 'fetch' | 'curl'>('html');
  const [copied, setCopied] = useState<string | null>(null);
  if (!isOpen) return null;

  const query = encodeStampToQuery(config);
  const origin = typeof window !== 'undefined' && window.location.origin.includes('http') ? window.location.origin : 'https://stampy-app.com';
  const pngUrl = `${origin}/api/stamp?${query}&format=png`;
  const svgUrl = `${origin}/api/stamp?${query}&format=svg`;
  const minimalUrl = `${origin}/api/stamp?from=${encodeURIComponent(config.fromLocation || 'Delhi')}&to=${encodeURIComponent(config.toLocation || 'Paris')}`;
  const snippets = {
    html: `<img\n  src="${pngUrl}"\n  alt="Stamp from ${config.fromLocation || 'Delhi'} to ${config.toLocation || 'Paris'}"\n  width="150"\n  height="200"\n/>`,
    markdown: `![Postal Stamp](${pngUrl})`,
    fetch: `const response = await fetch(\n  \`${origin}/api/stamp?from=\${from}&to=\${to}\`\n);\nconst image = await response.blob();`,
    curl: `curl -o stamp.png \\\n  "${pngUrl}"`,
  };
  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); window.setTimeout(() => setCopied(null), 1800); } catch { /* clipboard unavailable */ }
  };
  const copiedIcon = (key: string) => copied === key ? <Check size={15} weight="bold" /> : <Copy size={15} />;

  return <div className="api-redesign-overlay" onClick={onClose}>
    <section className="api-redesign-modal" onClick={(event) => event.stopPropagation()}>
      <header className="api-redesign-header">
        <div className="api-redesign-kicker"><span className="api-orb"><Globe size={15} weight="bold" /></span><span>STAMPY / DEVELOPER TOOL</span></div>
        <button className="api-close" onClick={onClose} aria-label="Close API modal"><X size={18} /></button>
        <h2>Put a stamp<br /><em>anywhere.</em></h2>
        <p>One dynamic endpoint for PNG and SVG postage stamps, ready to embed in your site, notes, or project.</p>
      </header>

      <div className="api-redesign-body">
        <div className="api-endpoint-block">
          <div className="api-section-label"><span>LIVE ENDPOINT</span><div><a href={svgUrl} target="_blank" rel="noreferrer">SVG <ArrowSquareOut size={12} /></a><a href={pngUrl} target="_blank" rel="noreferrer">PNG <ArrowSquareOut size={12} /></a></div></div>
          <div className="api-url-row"><span className="api-method">GET</span><input readOnly value={pngUrl} aria-label="API endpoint" /><button onClick={() => copy(pngUrl, 'url')} aria-label="Copy API endpoint">{copiedIcon('url')}</button></div>
          <div className="api-minimal-row"><span>MINIMAL CALL</span><code>{minimalUrl}</code></div>
        </div>

        <div className="api-snippet-block">
          <div className="api-section-label"><span>EMBED CODE</span><div className="api-tabs">{(['html', 'markdown', 'fetch', 'curl'] as const).map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab === 'fetch' ? 'JS' : tab === 'markdown' ? 'MD' : tab.toUpperCase()}</button>)}</div></div>
          <div className="api-code-panel"><button className="api-copy-code" onClick={() => copy(snippets[activeTab], 'code')}>{copiedIcon('code')}<span>{copied === 'code' ? 'COPIED' : 'COPY'}</span></button><pre>{snippets[activeTab]}</pre></div>
        </div>

        <div className="api-params"><div className="api-section-label"><span>AVAILABLE PARAMETERS</span><span>OPTIONAL VALUES ARE GENERATED</span></div><div className="api-param-grid"><span><b>from</b> origin</span><span><b>to</b> destination</span><span><b>code</b> monogram</span><span><b>theme</b> colour palette</span><span><b>motif</b> artwork style</span><span><b>format</b> png / svg</span></div></div>
      </div>
      <footer className="api-redesign-footer"><span>GET STARTED WITH A MINIMAL CALL</span><button onClick={onClose}>BACK TO STAMP <ArrowSquareOut size={14} /></button></footer>
    </section>
  </div>;
};
