# 001: Kde budou tréninková videa

**Stav:** rozhodnuto pro MVP, k revizi před spuštěním.

## Kontext
Videa jsou největší položka provozních nákladů. Rešerše porovnala poskytovatele při 90 minutách sledování na aktivního hráče měsíčně:

| Poskytovatel | 1 000 hráčů | 10 000 hráčů |
|---|---|---|
| Cloudflare Stream | ~95 USD | ~905 USD |
| Mux (720p) | ~73 USD | ~721 USD |
| Bunny Stream (Volume) | ~7 USD | ~68 USD |

## Rozhodnutí
- **Pro portfolio a betu:** krátká MP4 videa (720p, cca 2 Mb/s) v Cloudflare R2, přehrávaná přes obyčejný `<video>`. R2 nemá poplatky za přenos a do malého objemu je zdarma.
- **Pro ostrý provoz:** Bunny Stream kvůli adaptivnímu streamování a ceně.
- Video nikdy neukládat do Supabase Storage (egress by vyšel řádově dráž).

## Důsledek v kódu
Přehrávač bude brát jen URL videa. Přechod z R2 na Bunny se tak týká jednoho místa, ne obrazovek.
