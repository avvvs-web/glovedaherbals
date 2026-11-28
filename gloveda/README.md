# gloveda.co

The parent site of the Gloveda family: the scroll-scrubbed film, the brand story, and a way into each house:
Gloveda Herbals (the shop, `herbals.gloveda.co`, codebase `../site`), Gloveda Experience
(`experience.gloveda.co`) and Gloveda Revive (`revive.gloveda.co`).

- `npm install`, then `npm run dev -- -p 3001` (the shop's local server uses 3000).
- Point shop links at the local shop with `NEXT_PUBLIC_SHOP_ORIGIN=http://localhost:3000/shop` in `.env.local`.
- The film frames are in `public/seq/film` (`lg` 1920px, `sm` 1280px). `src/styles/gloveda-ds.css` is the
  client's design system, included verbatim: do not edit it.
- Vercel: its own project, Root Directory `gloveda`, domains `gloveda.co` and `www.gloveda.co`.
