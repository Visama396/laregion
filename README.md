# La Región — Newspaper Delivery Route Manager

Web app to manage daily newspaper delivery routes for **La Región** (plus **Atlántico**).

Each deliverer logs in, selects one of their assigned routes (`numero`), and sees the ordered list of stops for the day: address, how many copies of each paper to drop, extras/notes, holiday rules, and Sunday magazines. Users with edit rights can add, edit, reorder, and (un)subscribe stops.

## How it works

- **Routes (`deliveries` table):** one row per stop, keyed by `numero` (route) + `orden` (position in route). Fields per stop: `direccion`, `extra`, per-weekday copy counts (`lunes`…`domingo`), `atlantico`, `revista` (Sunday magazine), `festivo` + `dia_festivo` (`normal` | `entregar` | `no_entregar`), `baja` (unsubscribed).
- **Daily view:** defaults to the current weekday. Totals copies for the selected day, applies holiday overrides from the `holidays` table, and hides `baja` stops unless toggled. Mobile shows cards, desktop shows a full week table.
- **Editing:** add stops (auto-appends `orden`, shifts via `shift_orden` RPC), edit stops, drag-to-reorder (HTML5 DnD on desktop, pointer long-press drag on mobile, persisted via `reorder_delivery` RPC), subscribe/unsubscribe (`baja` flag).
- **i18n:** UI strings in `src/locale/` + `src/utils/translate.ts`. Supported: `es`, `en`, `de`, `ja`, `ko`, `uk`.

## Tech stack

- [Astro](https://astro.build) (static shell + routing) + [React](https://react.dev) (interactive `App`, forms) — `client:load` in `src/pages/index.astro`
- [Supabase](https://supabase.com) (`@supabase/supabase-js`) for Auth + Postgres + RPC
- [Tailwind CSS v4](https://tailwindcss.com) + `shadcn`/`radix-ui` components in `src/components/ui/`
- Deployed with [@astrojs/netlify](https://docs.astro.build/en/guides/deploy/netlify/)

## Project structure

```text
/
├── public/                  # static assets (favicons)
├── src/
│   ├── pages/
│   │   ├── index.astro      # main app entry (<App client:load />)
│   │   └── add.astro        # unused placeholder
│   ├── components/
│   │   ├── App.jsx          # route/day selection, totals, card + table views, DnD reorder
│   │   ├── UserForm.jsx     # login + session restore
│   │   ├── AddDeliveryForm.jsx
│   │   ├── EditDeliveryForm.jsx
│   │   └── ui/              # shadcn button, card, input, select, checkbox, dropdown-menu
│   ├── layouts/Layout.astro
│   ├── lib/utils.ts         # cn() helper
│   ├── utils/
│   │   ├── supabase.ts      # client + queries (getDelivery, insertAddress, updateAddress, reorderDelivery, getHolidays, …)
│   │   └── translate.ts
│   ├── locale/              # en/es/de/ja/ko/uk.json
│   └── styles/global.css
├── astro.config.mjs         # netlify adapter, react, tailwind vite plugin, @ → ./src
└── package.json
```

## Commands

All commands run from the repo root:

| Command | Action |
| :------ | :----- |
| `npm install` | Installs dependencies |
| `npm run dev` | Starts local dev server at `localhost:4321` |
| `npm run build` | Builds production site to `./dist/` |
| `npm run preview` | Previews the build locally before deploying |
| `npm run astro ...` | Runs CLI commands like `astro add`, `astro check` |
