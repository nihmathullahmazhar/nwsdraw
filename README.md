# NWS Draw

A free, no-sign-in visual workspace — draw, diagram, wireframe, design and present on an
infinite canvas. Part of the [NWS](https://nihmathullah.com) product family.

**Draw · Diagram · Present**

## Features

- **Five workspaces** on one canvas: Whiteboard, Diagrams, Wireframes, Design (fixed artboards
  with social/print presets) and Presentations (slide decks with a full-screen presenter view).
- **Infinite canvas** with pan/zoom, dots/lines/isometric grids, a minimap and fit-to-screen.
- **Full tooling**: shapes, connectors, freehand pen, sticky notes, text, layers panel,
  alignment & distribution, grouping, a command palette (⌘K) and keyboard shortcuts.
- **Templates & asset library** for flowcharts, mind maps, wireframe kits and more.
- **Local-first**: every project auto-saves to your browser's IndexedDB. Nothing is uploaded,
  no account exists.
- **Export anything**: PNG, JPG, vector SVG, PDF — or a re-editable `.nwsdraw` project file
  you can import back later.
- **Light & dark** themes.

## Stack

React 19 · Vite 6 · Tailwind CSS 4 · TypeScript · lucide-react · motion · idb-keyval

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run lint       # typecheck
npm run build      # production build to dist/
```

## Privacy

NWS Draw runs entirely in the browser. Drawings are stored in IndexedDB on your device and
never leave it; exports are generated locally. See the Privacy Policy inside the app.

---

Built by [NWS Digital Services](https://nihmathullah.com).
