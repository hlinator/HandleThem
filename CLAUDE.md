@AGENTS.md

# HandleThem – kontext pro AI agenty

Webová aplikace pro florbalisty: denní lekce (rozcvička, cvik s hokejkou, neurovizuální minihra) poskládané do stezky ve tvaru hřiště. Portfolio projekt, zatím frontend s demo daty.

## Pravidla produktu (neporušovat)
- Neměříme techniku ani herní výkon. Žádná kamera. XP jen za dokončení a pravidelnost (`src/lib/progress/xp.ts`).
- Texty nesmí slibovat lepší výkon v zápase, reakční čas „na hřišti“ apod. Tvrdíme jen to, co aplikace měří.
- Série je týdenní a vynechaný týden jde doplnit (`docs/specs/postup.md`).
- Parta ukazuje jen počet tréninků, nikdy výsledky.
- Žádná vymyšlená čísla o uživatelích, žádné recenze.

## Design
- Barvy jen přes tokeny v `src/app/globals.css` (`bg`, `surface`, `line`, `fg`, `muted`, `accent`…). Tmavý režim je výchozí.
- Písmo: Archivo Variable. Nadpisy a čísla `font-wide` / `font-wider`, text normální šířka. Žádné jiné fonty.
- Ikony: lucide-react, žádné emoji. Hry se odlišují tvarem (`GameIcon`), ne barvou.
- Animace reagují na akci uživatele. Vždy počítat s `prefers-reduced-motion`.
- Mobile-first, každá stránka musí projít `e2e/responsive.spec.ts` (bez přetékání na 360 px).

## Struktura
- `src/lib/` čistá logika (testovaná ve Vitestu): `progress/` XP, ranky, série; `path/` stezka; `games/meta.ts`.
- `src/lib/demo/store.tsx` demo data v localStorage. Rozhraní `useDemo()` později nahradí Supabase.
- `src/components/games/` minihry. Jádro (`StimulusEngine`, `TrackingGame`) je převzaté z původního prototypu, časování neměnit bez testu v prohlížeči.
- `src/components/rink/Rink.tsx` hřiště se stezkou, sdílené landingem i aplikací.

## Než něco odevzdáš
`npm run check` (typecheck + lint + unit testy), pak `npm run build && npm run e2e`.
Komentáře v kódu krátce a česky, jen značky a nečekané chytáky.
