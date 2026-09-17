# Stampy

Stampy is a generative postage stamp studio and HTTP GET API for creating publication-grade philatelic stamps. It provides an interactive web interface to configure, lock, and randomize stamp attributes, alongside an automated API to generate scalable vector SVG and raster PNG assets on demand.

The studio is built with React, Vite, TypeScript, and Tailwind CSS, utilizing @resvg/resvg-js for serverless raster rendering.

## Core Features

- Philatelic Stamp Geometry: Authentic 3:4 vertical aspect ratio with scalloped edge perforations and protected corners.
- Modular Design Architecture:
  - Header: Route indicators (origin to destination), monogram codes, and customizable service designations.
  - Procedural Motifs: Guilloche waves, concentric rings, solar sunbursts, Bauhaus geometric compositions, topographic elevation contours, heraldic crests, navigational compasses, and halftone dot arrays.
  - Frame Styles: Classic double borders, ornate corner brackets, postal stitch dashes, single solid lines, and minimal hairline frames.
  - Cancellation Postmark: Configurable circular postmark cancellation seal complete with city name, date, and killer wavy bars.
  - Paper Texture: Procedural SVG paper grain simulation for a tactile physical finish.
- Curated Color Palettes: Historical postal palettes including Prussian Blue, Carmine Red, Sage Veronese, Penny Black, Burnt Sienna, Tyrian Violet, Nordic Slate, and Sepia Bistre.
- Mobile Layout: Tailored mobile interface featuring a floating action dock, responsive bottom sheet editor, and centered canvas presentation.
- Export Formats: High-resolution PNG export, scalable vector SVG export, and direct clipboard copying.
- Deterministic GET API: Produces reproducible stamps based on route parameters using deterministic string hashing.

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

Clone the repository and install project dependencies:

```bash
git clone https://github.com/ManikSheoran/stampy.git
cd stampy
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

### Production Build

Compile TypeScript and bundle assets:

```bash
npm run build
```

### Code Quality

Run the linter to verify code standards:

```bash
npm run lint
```

## API Reference

Stampy provides a serverless HTTP GET endpoint at `/api/stamp` that returns either binary PNG images or vector SVG markup.

### Example Request

```html
<img
  src="https://your-domain.com/api/stamp?from=Delhi&to=Paris"
  alt="Custom Postage Stamp"
  width="150"
  height="200"
/>
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | string | Yes (or `code`) | None | Origin city or location name. |
| `to` | string | Yes | None | Destination city or location name. |
| `code` | string | No | Derived from `from` | Two- to four-letter monogram code. |
| `theme` | string | No | Deterministic | Palette identifier: `prussian-blue`, `carmine-rose`, `veronese-green`, `penny-black`, `burnt-sienna`, `tyrian-violet`, `nordic-slate`, `sepia-bistre`. |
| `motif` | string | No | Deterministic | Motif identifier: `waves`, `concentric`, `sunburst`, `bauhaus`, `topography`, `crest`, `compass`, `halftone`. |
| `denom` | string | No | Deterministic | Value badge text (for example, `25`, `50`, `No. 07`). |
| `title` | string | No | `POSTAGE` | Primary lower banner text. |
| `year` | string | No | `2026` | Issue year or serial designation. |
| `border` | string | No | Deterministic | Border style: `classic-double`, `ornate`, `dashed`, `single`, `minimal`. |
| `postmark` | `1` \| `0` | No | `1` | Enables (`1`) or disables (`0`) the ink cancellation postmark. |
| `format` | `png` \| `svg` | No | `png` | Response image format. |
| `width` | number | No | `300` | Output width in pixels. Height scales to maintain the 3:4 aspect ratio. |

### Deterministic Routing

When only `from` and `to` are supplied, the generator calculates a stable 32-bit hash of the route. This seeds the theme, motif, frame style, and denomination deterministically, ensuring that identical route requests yield identical stamp designs without requiring a database.

## Architecture

- `src/core/stampRenderer.ts`: Procedural SVG markup generator responsible for perforation geometry, typography layout, borders, and motif drawing.
- `src/core/stampThemes.ts`: Philatelic color definitions and contrast ratios.
- `src/core/stampTypes.ts`: TypeScript interfaces for stamp configuration and render options.
- `src/core/stampUtils.ts`: Route hashing, query string encoding and decoding, and image export utilities.
- `src/components/ApiSnippetModal.tsx`: Interactive modal displaying HTTP GET queries, cURL requests, and HTML embed snippets.
- `src/App.tsx`: Primary application layout, lock state management, and mobile dock controller.
- `api/stamp.ts`: Serverless API route handling image synthesis, caching headers, and binary responses.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the full text.
