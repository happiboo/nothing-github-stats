# nothing-github-stats

> GitHub profile stats rebuilt in Nothing's design language — dot-matrix, OLED black, monochrome.

![preview](./preview.png)

## Features

- **Live GitHub API** — real stats, repos, languages
- **Contribution heatmap** — deterministic per-username grid
- **Snake game** — eat your contribution cells, WASD/arrow keys, auto-play mode
- **Language chart** — segmented bar + breakdown
- **Repo cards** — top repos by stars with live links
- **README generator** — copy-paste markdown with pre-styled dark stat cards
- **Nothing design language** — dot-matrix mono, OLED black, glyph LED strip, scanlines, corner brackets

## Stack

| Tool | Role |
|---|---|
| React 18 | UI |
| Framer Motion 11 | Animations |
| Vite 5 | Build |
| GitHub REST API | Data |
| GitHub Actions | Snake SVG + Pages deploy |

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/nothing-github-stats
cd nothing-github-stats
npm install
npm run dev
```

Open `http://localhost:5173`, type any GitHub username, hit `LOAD ↗`.

## Deploy to GitHub Pages

1. Push to `main`
2. Go to **Settings → Pages** → Source: **GitHub Actions**
3. The `deploy.yml` workflow builds and deploys automatically

## Snake on Your Profile README

1. Go to **Settings → Actions → General** → enable **Read and write permissions**
2. Run the `Generate Snake` workflow manually once
3. The snake SVG is pushed to the `output` branch
4. Paste into your `username/username` README:

```md
![Snake](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-contribution-grid-snake-dark.svg)
```

## File Structure

```
nothing-github-stats/
├── src/
│   ├── components/
│   │   ├── GlyphBar.jsx          # Animated Nothing LED strip
│   │   ├── SearchBar.jsx         # Username input
│   │   ├── ProfileHeader.jsx     # Avatar + identity
│   │   ├── StatGrid.jsx          # 9-cell metrics
│   │   ├── ContribHeatmap.jsx    # 52×7 contribution grid
│   │   ├── SnakeGame.jsx         # Playable snake on the grid
│   │   ├── LanguageChart.jsx     # Language bar + list
│   │   ├── RepoGrid.jsx          # Top repos
│   │   ├── ReadmeGenerator.jsx   # Copy-paste README
│   │   └── Tabs.jsx              # Tab navigation
│   ├── hooks/
│   │   └── useGitHub.js          # GitHub API hook
│   ├── lib/
│   │   └── utils.js              # Helpers + README builder
│   ├── styles/
│   │   └── global.css            # Design tokens + base
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── favicon.svg
├── .github/
│   └── workflows/
│       ├── snake.yml             # Generate snake SVG
│       └── deploy.yml            # Deploy to GitHub Pages
├── index.html
├── vite.config.js
└── package.json
```

## Design Language

Inspired by Nothing's product aesthetic:
- **OLED black** `#0a0a0a` base
- **Share Tech Mono + Space Mono** typography
- **Dot-matrix** letterforms and labeling
- **Glyph LED strip** in the header (animated)
- **CRT scanlines** overlay
- **Corner brackets** on avatar
- **1px grid lines** between stat cells
- **Zero gradients, zero colors** — monochrome only

---

<sub><code>// built with nothing · monochrome · precise · minimal</code></sub>
