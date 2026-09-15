import React, { useState } from 'react';
import type { StampConfig } from '../core/types';
import { encodeStampToQuery } from '../utils/urlState';
import { 
  X, 
  Copy, 
  Check, 
  ArrowSquareOut, 
  PaperPlaneTilt,
  Globe
} from '@phosphor-icons/react';

interface ApiSnippetModalProps {
  config: StampConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSnippetModal: React.FC<ApiSnippetModalProps> = ({ config, isOpen, onClose }) => {
  const [activeSnippetTab, setActiveSnippetTab] = useState<'html' | 'markdown' | 'fetch' | 'curl'>('html');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const queryString = encodeStampToQuery(config);
  const origin = typeof window !== 'undefined' && window.location.origin.includes('http')
    ? window.location.origin
    : 'https://stampy-app.com';

  const pngApiUrl = `${origin}/api/stamp?${queryString}&format=png`;
  const svgApiUrl = `${origin}/api/stamp?${queryString}&format=svg`;
  const minimalApiUrl = `${origin}/api/stamp?from=${encodeURIComponent(config.fromLocation || 'Delhi')}&to=${encodeURIComponent(config.toLocation || 'Paris')}`;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const snippets = {
    html: `<!-- Embed directly in your Mail Letter Post site -->
<img 
  src="${pngApiUrl}" 
  alt="Letter Stamp from ${config.fromLocation || 'Delhi'} to ${config.toLocation || 'Paris'}" 
  width="150" 
  height="200" 
  loading="lazy" 
/>`,
    markdown: `<!-- In markdown letter or note -->
![Postal Stamp](${pngApiUrl})`,
    fetch: `// Load dynamic letter stamp image blob
async function getLetterStamp(from, to) {
  const res = await fetch(\`${origin}/api/stamp?from=\${from}&to=\${to}\`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}`,
    curl: `# Fetch stamp PNG via curl
curl -o "letter-stamp.png" "${pngApiUrl}"`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#fef3e2] border border-[#fa812f] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#fa812f] bg-[#fef3e2]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#fef3e2] text-[#212529]">
              <Globe size={18} weight="bold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#212529]">
                Dynamic GET Image API
              </h3>
              <p className="text-xs text-[#212529]">
                Serverless route returning high-resolution PNG &amp; SVG stamps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#212529] hover:text-[#212529] hover:bg-[#fef3e2] transition-colors cursor-pointer"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#212529] scrollbar-thin">
          {/* Required Fields Explainer */}
          <div className="p-4 rounded-2xl bg-[#fef3e2] border border-[#fa812f] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#212529]">
              <PaperPlaneTilt size={16} weight="fill" />
              <span>Query Parameters &amp; Fallbacks</span>
            </div>
            <p className="text-xs text-[#212529] leading-relaxed">
              <strong className="text-[#212529]">Required:</strong> <code className="px-1.5 py-0.5 rounded bg-[#fef3e2] font-mono text-[11px] text-[#212529]">to</code> and either <code className="px-1.5 py-0.5 rounded bg-[#fef3e2] font-mono text-[11px] text-[#212529]">from</code> or <code className="px-1.5 py-0.5 rounded bg-[#fef3e2] font-mono text-[11px] text-[#212529]">code</code>.
              <br />
              <strong className="text-[#212529]">Procedural Generation:</strong> If you omit palette, motif, or frame, the API automatically generates harmonious values seeded deterministically by the route!
            </p>
            {/* Minimal URL */}
            <div className="pt-2 border-t border-[#fa812f] flex items-center justify-between text-xs font-mono">
              <span className="text-[#212529]">Minimal Call:</span>
              <code className="text-[#212529] bg-[#fef3e2] px-2 py-0.5 rounded-md border border-[#fa812f] truncate max-w-sm">
                {minimalApiUrl}
              </code>
            </div>
          </div>

          {/* Full Live GET URL Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#212529]">
                Live Dynamic GET Endpoint
              </label>
              <div className="flex items-center gap-3">
                <a
                  href={svgApiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#212529] hover:text-[#212529]"
                >
                  <span>SVG Format</span>
                  <ArrowSquareOut size={11} />
                </a>
                <a
                  href={pngApiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#fa4032] font-semibold hover:underline"
                >
                  <span>Open PNG</span>
                  <ArrowSquareOut size={11} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#fef3e2] border border-[#fa812f] font-mono text-xs">
              <span className="text-[#fa4032] font-bold select-none text-[11px] px-2 py-0.5 rounded-full bg-[#fef3e2] border border-[#fa812f]">GET</span>
              <input
                type="text"
                readOnly
                value={pngApiUrl}
                className="flex-1 bg-transparent text-xs text-[#212529] outline-none select-all truncate font-mono"
              />
              <button
                onClick={() => copyToClipboard(pngApiUrl, 'url')}
                className="btn-secondary text-xs px-2.5 py-1"
                title="Copy URL"
              >
                {copiedKey === 'url' ? <Check size={14} weight="bold" className="text-emerald-600" /> : <Copy size={14} weight="bold" />}
              </button>
            </div>
          </div>

          {/* Code Snippets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#212529]">
                Embed Code Snippets
              </span>
              <div className="flex bg-[#fef3e2] p-1 rounded-full text-xs">
                {(['html', 'markdown', 'fetch', 'curl'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSnippetTab(tab)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer text-xs ${
                      activeSnippetTab === tab ? 'bg-[#fef3e2] text-[#fa4032] font-semibold shadow-xs' : 'text-[#212529] hover:text-[#fa4032]'
                    }`}
                  >
                    {tab === 'html' ? 'HTML' : tab === 'markdown' ? 'Markdown' : tab === 'fetch' ? 'JavaScript' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl bg-[#212529] border border-[#212529] p-4 font-mono text-xs overflow-x-auto shadow-inner text-[#fef3e2]">
              <button
                onClick={() => copyToClipboard(snippets[activeSnippetTab], 'code')}
                className="absolute top-3 right-3 btn-secondary text-xs px-2.5 py-1 bg-[#fef3e2]/10 hover:bg-[#fef3e2]/20 text-[#fef3e2] border-[#fef3e2]/20"
              >
                {copiedKey === 'code' ? (
                  <>
                    <Check size={12} weight="bold" className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} weight="bold" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <pre className="leading-relaxed pr-16 text-[#fa812f]">{snippets[activeSnippetTab]}</pre>
            </div>
          </div>

          {/* Parameters Reference */}
          <div className="pt-2 border-t border-[#fa812f]">
            <h4 className="text-xs font-medium text-[#212529] mb-2.5">
              Parameter Reference
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#fef3e2] border border-[#fa812f]">
                <span className="text-[#212529] font-semibold">from</span>: Origin (e.g. Delhi, NY)
              </div>
              <div className="p-2.5 rounded-xl bg-[#fef3e2] border border-[#fa812f]">
                <span className="text-[#212529] font-semibold">to</span>: Destination (e.g. Paris, Tokyo)
              </div>
              <div className="p-2.5 rounded-xl bg-[#fef3e2] border border-[#fa812f]">
                <span className="text-[#212529] font-semibold">code</span>: 2-letter monogram
              </div>
              <div className="p-2.5 rounded-xl bg-[#fef3e2] border border-[#fa812f]">
                <span className="text-[#212529] font-semibold">theme</span>: Palette name
              </div>
              <div className="p-2.5 rounded-xl bg-[#fef3e2] border border-[#fa812f]">
                <span className="text-[#212529] font-semibold">motif</span>: Artwork motif style
              </div>
              <div className="p-2.5 rounded-xl bg-[#fef3e2] border border-[#fa812f]">
                <span className="text-[#212529] font-semibold">format</span>: png | svg
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#fa812f] bg-[#fef3e2] flex items-center justify-end">
          <button
            onClick={onClose}
            className="btn-primary text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
