# echo2045.github.io

Personal portfolio — a night drive through a career. One continuous city scene: scroll or drag to drive past Ghost Interactive's depot, the esports arena, the research lab, and a construction zone. Vite + React, deployed to GitHub Pages on push to `main`.

## Dev

```sh
npm install
npm run dev
```

## Edit the world

All content lives in **`src/content.js`** — one object per stop.
Copy a block, give it an `id` and an `x` position (0–4800 along the line),
and it appears on the route: nav, progress dots, and the `NEXT ▸` display
update themselves. Each stop carries `lines` (the story), `skills` (chips),
`learned` (the takeaway), and optional `links`.

## Design tooling

This repo ships [PRODUCT.md](PRODUCT.md) (product truth) and vendors the
[Impeccable](https://github.com/pbakaus/impeccable) design skill at
`.agents/skills/impeccable/`. In an agent harness that discovers `.agents/skills/`
(Devin, Amp, Codex, …), ask for `/impeccable audit`, `/impeccable polish`,
`/impeccable critique`, etc. The first run downloads a small engine binary.
Want a different look? `/impeccable bolder`, `/impeccable quieter`,
`/impeccable distill` — or describe a new direction and let the skill roll one.
