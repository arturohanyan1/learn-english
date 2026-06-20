# Learn English

A vocabulary learning app (Oxford 5000) built with **React + Vite + TypeScript** and plain CSS.

> Status: project scaffolded. No features, screens, or styling implemented yet.

## Tech stack

- React 19
- Vite 6 (build tool + dev server)
- TypeScript
- Plain CSS (no UI library, no router yet)

## Project structure

```
learn-english/
├─ data/
│  └─ words.json         # full raw Oxford 5000 source (reference; NOT deployed)
├─ public/
│  └─ words/             # word data served as static files
│     ├─ index.json      #   [{ level, count }] manifest
│     ├─ all.json        #   every word, slim: { id, word, level }
│     └─ A1.json … C1.json
├─ src/
│  ├─ components/         # UI components (empty for now)
│  ├─ data/              # reserved for typed/derived data later
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ index.css
│  └─ vite-env.d.ts
├─ index.html
├─ vite.config.ts
├─ tsconfig*.json
└─ package.json
```

## Data

Word data is served as static files from `public/words/`, split by CEFR level. The full raw Oxford 5000 source (5,948 entries) is kept at `data/words.json` for reference but is not deployed.

| File | Words |
|---|---|
| `A1.json` | 1076 |
| `A2.json` | 990 |
| `B1.json` | 902 |
| `B2.json` | 1571 |
| `C1.json` | 1404 |
| `all.json` | 5948 — slim `{ id, word, level }` for every word (~36 KB gzip) |
| `index.json` | manifest: `[{ "level": "A1", "count": 1076 }, …]` |

> 5 words have no CEFR level (`accounting`, `angrily`, `cleaning`, `feeding`, `major`): they appear in `all.json` with an empty `level`, but not in any per-level file.

Fetch only the level you need at runtime — each is ~150–235 KB gzipped, and nothing lands in the JS bundle:

```ts
// available levels + counts (tiny)
const levels = await (await fetch('/words/index.json')).json()
// words for one level
const a1 = await (await fetch('/words/A1.json')).json()
// every word, slim ({ id, word, level }) — for search / full list
const all = await (await fetch('/words/all.json')).json()
```

Each entry has the shape:

```jsonc
{
  "id": 0,
  "value": {
    "word": "abandon",
    "type": "verb",          // part of speech
    "level": "B2",           // CEFR level (A1–C1)
    "phonetics": { "us": "/əˈbændən/", "uk": "/əˈbændən/" },
    "us": { "mp3": "...", "ogg": "..." },  // pronunciation audio
    "uk": { "mp3": "...", "ogg": "..." },
    "href": "https://www.oxfordlearnersdictionaries.com/...",
    "examples": ["...", "..."]
  }
}
```

## Getting started

Install dependencies and start the dev server:

```bash
yarn install
yarn dev
```

Then open the printed local URL (default: http://localhost:5173).

Other scripts:

```bash
yarn build     # type-check + build static site into dist/
yarn preview   # preview the production build locally
```

## Deploy to Firebase Hosting

One-time setup (if you don't have the CLI):

```bash
yarn global add firebase-tools   # or: npm install -g firebase-tools
firebase login
```

Initialize Hosting in this project:

```bash
firebase init hosting
```

When prompted, answer:

- **Public directory:** `dist`
- **Configure as a single-page app (rewrite all urls to /index.html)?** `Yes`
- **Set up automatic builds and deploys with GitHub?** `No` (unless you want it)
- **Overwrite dist/index.html?** `No`

Build and deploy:

```bash
yarn build
firebase deploy
```

This uploads the contents of `dist/` to Firebase Hosting.
