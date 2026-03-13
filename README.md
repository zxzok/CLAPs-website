# CLAP-S Paper Website

Interactive paper website for **Optimized Control of Duplex Networks**.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- KaTeX

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` or the next available port shown by Next.js.

## Build

```bash
npm run build
```

## Content scope

This website explains the paper in the setting studied by the manuscript:

- aligned-node duplex networks
- uncoupled layers
- fixed minimal driver budgets derived from maximum matchings

It does **not** recast the problem as dominating set, FVS, deep learning, reinforcement learning, or a general AI optimization method.

## Included assets

- Production website source under `src/`
- English-only website copy
- Paper PDFs under `public/paper/`
- Result CSVs used by the explorer under `data/results/`
- Chinese design/content brief under `docs/paper-website-spec.md`
