# HandleThem

Webová aplikace pro florbalisty, kteří chtějí trénovat i doma mezi tréninky v klubu. Každý den jedna krátká lekce: rozcvička, cvik s hokejkou a neurovizuální minihra, kterou hráč hraje s míčkem u hokejky a očima na displeji.

Projekt stavím jako ukázku do portfolia. Zatím jde o frontend s ukázkovými daty uloženými v prohlížeči, napojení na Supabase a Stripe přijde v dalším kroku.

## Co v aplikaci najdete
- **Landing** s hratelnou ukázkou minihry Periferie přímo v úvodu.
- **Dnes:** výběr lajny, kterou hráč ten den posune. Doporučená je předvybraná, takže stačí jedno klepnutí.
- **Stezka:** florbalové hřiště se třemi lajnami. Když dojedou všechny k brance, padne gól.
- **Čtyři minihry:** Reakce, Periferie, Záblesk a Sled.
- **XP a ranky** od Pralesa po Reprezentaci, za pravidelnost, ne za výkon.
- **Týdenní série**, kterou jde doplnit, když týden vypadne kvůli zápasu.

## Technologie
Next.js 16 (App Router, statický export), React 19, TypeScript, Tailwind CSS 4, Motion, Vitest a Playwright.

## Spuštění
```bash
npm install
npm run dev          # vývoj na http://localhost:3000
npm run check        # typy, lint a unit testy
npm run build        # statický export do out/
npm run e2e          # Playwright nad buildem (360/768/1280 px, tmavý i světlý režim)
```

## Jak jsem pracoval s AI
Postup je popsaný na stránce `/case-study` přímo v aplikaci. Pravidla, podle kterých se má AI v projektu řídit, jsou v `CLAUDE.md`, specifikace v `docs/specs` a technická rozhodnutí v `docs/decisions`.
