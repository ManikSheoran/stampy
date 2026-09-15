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
        className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#e8e5de] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e5de] bg-[#ffffff]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#f1efe9] text-[#18181b]">
              <Globe size={18} weight="bold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#18181b]">
                Dynamic GET Image API
              </h3>
              <p className="text-xs text-[#71717a]">
                Serverless route returning high-resolution PNG &amp; SVG stamps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#71717a] hover:text-[#18181b] hover:bg-[#f1efe9] transition-colors cursor-pointer"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#18181b] scrollbar-thin">
          {/* Required Fields Explainer */}
          <div className="p-4 rounded-2xl bg-[#faf9f6] border border-[#e8e5df] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#18181b]">
              <PaperPlaneTilt size={16} weight="fill" />
              <span>Query Parameters &amp; Fallbacks</span>
            </div>
            <p className="text-xs text-[#52525b] leading-relaxed">
              <strong className="text-[#18181b]">Required:</strong> <code className="px-1.5 py-0.5 rounded bg-[#f1efe9] font-mono text-[11px] text-[#18181b]">to</code> and either <code className="px-1.5 py-0.5 rounded bg-[#f1efe9] font-mono text-[11px] text-[#18181b]">from</code> or <code className="px-1.5 py-0.5 rounded bg-[#f1efe9] font-mono text-[11px] text-[#18181b]">code</code>.
              <br />
              <strong className="text-[#18181b]">Procedural Generation:</strong> If you omit palette, motif, or frame, the API automatically generates harmonious values seeded deterministically by the route!
            </p>
            {/* Minimal URL */}
            <div className="pt-2 border-t border-[#e8e5df] flex items-center justify-between text-xs font-mono">
              <span className="text-[#71717a]">Minimal Call:</span>
              <code className="text-[#18181b] bg-white px-2 py-0.5 rounded-md border border-[#e8e5df] truncate max-w-sm">
                {minimalApiUrl}
              </code>
            </div>
          </div>

          {/* Full Live GET URL Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#71717a]">
                Live Dynamic GET Endpoint
              </label>
              <div className="flex items-center gap-3">
                <a
                  href={svgApiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#71717a] hover:text-[#18181b]"
                >
                  <span>SVG Format</span>
                  <ArrowSquareOut size={11} />
                </a>
                <a
                  href={pngApiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0f766e] font-semibold hover:underline"
                >
                  <span>Open PNG</span>
                  <ArrowSquareOut size={11} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf9f6] border border-[#e8e5df] font-mono text-xs">
              <span className="text-[#0f766e] font-bold select-none text-[11px] px-2 py-0.5 rounded-full bg-[#f0fdfa] border border-[#99f6e4]">GET</span>
              <input
                type="text"
                readOnly
                value={pngApiUrl}
                className="flex-1 bg-transparent text-xs text-[#18181b] outline-none select-all truncate font-mono"
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
              <span className="text-xs font-medium text-[#71717a]">
                Embed Code Snippets
              </span>
              <div className="flex bg-[#f1efe9] p-1 rounded-full text-xs">
                {(['html', 'markdown', 'fetch', 'curl'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSnippetTab(tab)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer text-xs ${
                      activeSnippetTab === tab ? 'bg-white text-[#0f766e] font-semibold shadow-xs' : 'text-[#71717a] hover:text-[#0f766e]'
                    }`}
                  >
                    {tab === 'html' ? 'HTML' : tab === 'markdown' ? 'Markdown' : tab === 'fetch' ? 'JavaScript' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl bg-[#18181b] border border-[#27272a] p-4 font-mono text-xs overflow-x-auto shadow-inner text-[#f4f4f5]">
              <button
                onClick={() => copyToClipboard(snippets[activeSnippetTab], 'code')}
                className="absolute top-3 right-3 btn-secondary text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
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
              <pre className="leading-relaxed pr-16 text-[#e4e4e7]">{snippets[activeSnippetTab]}</pre>
            </div>
          </div>

          {/* Parameters Reference */}
          <div className="pt-2 border-t border-[#e8e5df]">
            <h4 className="text-xs font-medium text-[#71717a] mb-2.5">
              Parameter Reference
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e8e5df]">
                <span className="text-[#18181b] font-semibold">from</span>: Origin (e.g. Delhi, NY)
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e8e5df]">
                <span className="text-[#18181b] font-semibold">to</span>: Destination (e.g. Paris, Tokyo)
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e8e5df]">
                <span className="text-[#71717a] font-semibold">code</span>: 2-letter monogram
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e8e5df]">
                <span className="text-[#71717a] font-semibold">theme</span>: Palette name
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e8e5df]">
                <span className="text-[#71717a] font-semibold">motif</span>: Artwork motif style
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e8e5df]">
                <span className="text-[#71717a] font-semibold">format</span>: png | svg
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#e8e5de] bg-[#ffffff] flex items-center justify-end">
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
