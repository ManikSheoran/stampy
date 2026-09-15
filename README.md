# 💌 Stampy — Aesthetic Postage Stamp Studio & GET API

> An interactive web studio and serverless GET API to generate bespoke, vintage, and modernist postage stamps for mail letter post sites, notebooks, and digital correspondence.

Built with **Vite + React + TypeScript + Tailwind CSS** and powered by **@resvg/resvg-js** for instantaneous serverless PNG rendering.

---

## 🌟 Highlights

- **Authentic Stamp Geometry**: Vertical 3:4 aspect ratio with realistic scalloped semicircle edge perforations and transparent cutouts.
- **Modular Visual Anatomy**:
  - **Upper Zone**: 2-letter customizable city typography (e.g. `DL`, `NY`, `TY`, `LD`) + denomination badge (`25¢`, `¥80`, `₹5`) and clean route micro-label.
  - **Focal Motifs**: Procedural guilloche waves, concentric echoing rings, geometric solar sunbursts, bauhaus compositions, cartographic topography curves, heraldic crests, and navigational airmail compasses.
  - **Decorative Borders**: Classic double line, ornate corner brackets, postal stitch dashes, single border, minimal hairline.
  - **Authentic Ink Postmark**: Realistic rubber-stamped circular date cancellation seal with wavy killer bars and rotation angle.
  - **Tactile Paper Grain**: Optional procedural SVG noise texture for physical print finish.
- **Authentic Philatelic Palettes**: Prussian Blue, Carmine Red, Sage Veronese, Penny Black, Burnt Sienna, Tyrian Violet, Nordic Slate, Sepia Bistre.
- **Zero-Backend Serverless GET API**:
  - Direct HTTP GET endpoint returning binary PNG bytes or vector SVG.
  - Aggressive HTTP caching headers (`Cache-Control: public, max-age=31536000, immutable`).

---

## 🚀 Quick Start

### 1. Run Locally
```bash
# Install dependencies
npm install

# Start studio in light mode
npm run dev
```

### 2. Build for Production
```bash
npm run build
```

---

## 📬 GET API Documentation (`/api/stamp`)

Embed dynamic stamps directly into your mail letter post site with a simple `<img>` tag:

```html
<!-- Minimal call with required fields -->
<img 
  src="https://your-domain.com/api/stamp?from=Delhi&to=Paris" 
  alt="Letter Stamp" 
  width="150" 
  height="200" 
/>
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | string | **Yes** (or `code`) | — | Sender city/origin (e.g. `Delhi`, `New York`) |
| `to` | string | **Yes** | — | Destination city (e.g. `Paris`, `Tokyo`) |
| `code` | string | Optional | Auto from `from` | 2-3 letter monogram code |
| `theme` | string | Optional | Procedural | `prussian-blue`, `carmine-rose`, `veronese-green`, `penny-black`, `burnt-sienna`, `tyrian-violet`, `nordic-slate`, `sepia-bistre` |
| `motif` | string | Optional | Procedural | `waves`, `concentric`, `sunburst`, `bauhaus`, `topography`, `crest`, `compass`, `halftone` |
| `denom` | string | Optional | Procedural | Value badge (e.g. `25¢`, `50¢`, `₹5`, `№ 07`) |
| `title` | string | Optional | `POSTAGE` | Main lower banner text |
| `year` | string | Optional | `2026` | Year or serial number |
| `border` | string | Optional | Procedural | `classic-double`, `ornate`, `dashed`, `single`, `minimal` |
| `postmark`| `1` \| `0` | Optional | `1` | Enable/disable rubber ink postmark |
| `format` | `png` \| `svg` | Optional | `png` | Desired output format |
| `width` | number | Optional | `300` | Output width in pixels (height scales to 4:3) |

> **Smart Procedural Fallbacks**: When only `from` and `to` are passed, the API deterministically seeds and generates unique, harmonious choices for theme, motif, denomination, and border based on the letter's route.
