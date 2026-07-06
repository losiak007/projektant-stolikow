# Leśne Ścieżki — projektant stolików 🌲🚵

Interaktywne narzędzie do projektowania stolików (tabletopów) na trasach rowerowych.
Ustawiasz **prędkość najazdu**, **kąt wybicia** i **miękkość lądowania (EFH)**, a narzędzie
liczy pełną geometrię skoczni i parametry lotu — tak, żeby dało się świadomie projektować
łagodne, family-friendly stoliki i przekazać wymiary prosto koparce.

**Live:** https://stoliki.pages.dev

## Funkcje

- **Typ skoczni**: stolik (tabletop) albo gap — gap = ta sama fizyka, ale otwarta dziura
  między lipą a lądowaniem (ostrzeżenia o skróceniu liczone do dna dziury / ściany lądowania).
- **Presety poziomów** (wg mtbtrailbuilding.com/tutorials/tabletop-jump): początkujący
  15–25° / 13–19 km/h, średni 25–35° / 19–29 km/h, zaawansowany 30–45° / 26–40 km/h.
- **Linia skoczni**: sugerowany odstęp do następnej lipy ≈ 2 × gap od knuckla (mtbr).

## Model fizyczny

- **Najazd**: przejście o **stałym przeciążeniu normalnym** `a·g` — krzywizna `κ = a·g/v²`
  rośnie w miarę jak rower zwalnia pod górę, więc promień maleje od `v²/14,7` na wjeździe
  (Trailism, 1,5 g) do wartości najmniejszej pod lipą. To naturalnie daje klotoidalny,
  progresywny kształt lipy. Po przejściu **prosta rampa** 0,25 s × prędkość na lipie
  (Trailism/FIS; USTPC zaleca 0,3 s).
  *Uwaga: wzory z literatury narciarskiej zakładają stałą prędkość na przejściu (tam najazd
  zjeżdża w dół) — dla roweru wjeżdżającego z płaskiego zawyżało to najazd ~2×, co
  poprawiono (patrz `tools/selfeval.js`).*
- **Strata prędkości na podjeździe**: prędkość na lipie `v₀ = √(v² − 2gH)` — H i v₀ liczone
  iteracyjnie (Trailism: "speed loss to gravity").
- **Blat = dystans lotu** przy prędkości projektowej (IMBA/mtbr: gap ≈ lot) — rider projektowy
  przyziemia stycznie tuż za knucklem, wolniejsi lądują płasko na blacie (po to jest stolik).
  Lot liczony z wysokości lipy do poziomu blatu — **lipa wystaje nad stół** (parametr, domyślnie
  0,2 m), co wydłuża lot względem rachunku "na płasko".
- **Korekcja na rozstaw osi** (Trailism): efektywny kąt wybicia = cięciwa ostatniego rozstawu
  osi najazdu — tylne koło opuszcza lipę później; przy rampie ≥ rozstaw poprawka znika.
  (Trailism podaje też korekcję promienia o wb·sinθ — nie stosujemy obu naraz, bo opisują
  ten sam efekt; wybraliśmy wariant cięciwowy jako bardziej fizyczny.)
- **Rysunek profilu** = łańcuch segmentów o ciągłych stycznych (G1), nazwy wg głównej figury
  Trailism: Approach → Transition → Equilibration → Lip (ostra krawędź, wygładzony tylko
  szpic kreski r=6 cm) → Deck → Knuckle (łuk styczny) → Landing (parabola lotu) → Bucket
  (łuk < 3 g kończący się dokładnie na gruncie) → Run-out. Samotest ciągłości:
  `window.__dbg.world.pts` w konsoli (skoki kąta < 4° przy segmentach > 4 cm).
- Przypis Trailism o „5,7 ft przy 20 mph/20°" zakłada dojazd ze spadkiem ~10 % — narzędzie
  zakłada płaski dojazd (stąd niższe H).
- **Zeskok prowadzony po paraboli lotu** (Trailism: "landing mimics and follows the parabolic
  flight path"): zaczyna się kątem lipy przy knucklu, stromieje jak trajektoria, wyokrąglony
  u podstawy (~3 g). **EFH** (equivalent fall height) liczone jako kontrola bezpieczeństwa:
  na zeskoku ≈ 0 (stycznie), najgorszy przypadek = skrócenie płasko na blat, z limitem 1,5 m
  (Trailism: maks. ~4,9 ft).
- **Lot**: rzut ukośny bez oporu powietrza i bez "popu" (McNeil 2012: dla skoków < 12 m
  błąd ≤ 10 %). Rysowany wachlarz 4 trajektorii (65/80/90/100 %).
- **Build file**: tabela tyczenia co 0,5 m + kubatura — koncept wprost z Levy 2015 §3.

## Źródła

- [Trailism — Jump Design](https://trailism.com/jump-design/) — **wzorzec**: klotoidy, r = v²/14,7, rampa 0,25 s, EFH ≤ 4,9 ft
- [MTB Trail Building — kalkulator skoczni](https://mtbtrailbuilding.com/calculators/jump-design)
- [IMBA Canada — Building a Dirt Jump / Freeride Park](https://imbacanada.com/building-a-dirt-jump-or-freeride-park/)
- [Lee Likes Bikes — Formulas for building jumps](https://www.leelikesbikes.com/formulas-for-building-jumps.html)
- [mtbr — dirt jumps specs](https://www.mtbr.com/threads/dirt-jumps-specs.599573/) — realne wymiary lip wg poziomu
- [Cutlaps Trajectory Calculator](https://www.cutlaps.com) — rowerowy kalkulator trajektorii; promienie najazdu: BMX 2,4–3,0 m, dirt 3,0–4,0 m, full-sus 4,0–6,1 m

Metryka EFH (equivalent fall height) używana jako kontrola bezpieczeństwa lądowania — za Trailism
(limit 1,5 m / 4,9 ft). Literatura narciarska (Hubbard/Levy/McNeil) świadomie pominięta jako źródło
geometrii: jej wzory zakładają stałą prędkość na przejściu, co dla roweru wjeżdżającego z płaskiego
zawyżało najazd ~2× (szczegóły: `tools/selfeval.js`).

## Weryfikacja modelu

`node tools/selfeval.js` — porównuje model z kotwicami rzeczywistości:

- **Lee Likes Bikes** (lot przy 15 mph na lipie): 35° → 14 ft / 2,5 ft, 45° → 15 ft / 3,8 ft,
  55° → 14 ft / 5 ft — model trafia co do dziesiątej stopy.
- **mtbr (realne lipy)**: 25 km/h / 30° → H ≈ 1,0 m (mtbr: ~3 ft), 28 km/h / 60° → H ≈ 2,3 m
  (mtbr pro: 6–7 ft).
- 40 km/h / 55° → wjazd możliwy (v na lipie ~24 km/h, lot ~5 m) — stary model z „narciarskim"
  założeniem stałej prędkości dawał tu absurdalne 7 m wysokości i błąd.

## Rozwój

Całość to jeden statyczny plik: [`public/index.html`](public/index.html) — bez zależności, bez builda.

Podgląd lokalny:

```sh
npx http-server public -p 8642
```

Deploy (Cloudflare Pages):

```sh
npx wrangler pages deploy
```
