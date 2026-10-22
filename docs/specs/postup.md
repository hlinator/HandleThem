# Postup hráče: XP, ranky, série

Tohle je specifikace, podle které vznikla logika v `src/lib/progress`. Testy v `progress.test.ts` ji hlídají.

## XP
- Lekce na stezce: +50 XP.
- Minihra ve volném tréninku: +10 XP.
- Třetí trénink v týdnu: bonus +30 XP (jen jednou za týden).
- Za výkon ve hře se XP nedávají. Rank má ukazovat pravidelnost, ne talent.

## Ranky
Deset ranků z florbalového prostředí, každý má tři stupně (III → II → I), celkem 30 levelů.

| Rank | Od XP |
|---|---|
| Prales | 0 |
| Vesnický přeborník | 300 |
| Okresní přebor | 800 |
| Regionálka | 1 500 |
| Divize | 2 500 |
| Národní liga | 3 800 |
| 1. liga | 5 400 |
| Superliga | 7 200 |
| SSL | 9 400 |
| Reprezentace | 12 000 |

Při třech lekcích týdně je to 180 XP za týden. První povýšení tedy přijde do dvou týdnů (rešerše: v tomhle období se hráč rozhoduje, jestli zůstane) a Reprezentace zhruba po roce a čtvrt.

## Série
- Počítá se po týdnech (pondělí až neděle). Stačí jeden trénink za týden.
- Aktuální týden je „otevřený“. Když v něm ještě nic není, série se nepřeruší.
- Trénink jde zapsat zpětně a doplněný týden sérii znovu spojí.
- Vedle série ukazujeme, kolik dní uběhlo od posledního tréninku. Bez trestu, jen informace.

## Stezka
- Hřiště se třemi lajnami (vedení míčku, kličky, hlava nahoru), každá má 6 uzlů.
- V lajně se postupuje popořadě. Mezi lajnami si hráč vybírá sám.
- Doporučená lajna je ta s nejmenším počtem hotových uzlů, při shodě první v pořadí.
- Když dojdou všechny tři lajny k brance, padne gól a hala je hotová.
