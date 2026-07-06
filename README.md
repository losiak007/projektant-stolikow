# Leśne Ścieżki — projektant stolików 🌲🚵

Interaktywne narzędzie do projektowania stolików (tabletopów) na trasach rowerowych.
Ustawiasz **prędkość najazdu**, **kąt wybicia** i **miękkość lądowania (EFH)**, a narzędzie
liczy pełną geometrię skoczni i parametry lotu — tak, żeby dało się świadomie projektować
łagodne, family-friendly stoliki i przekazać wymiary prosto koparce.

**Live:** https://stoliki.pages.dev

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
- **Zeskok o stałym EFH**: powierzchnia całkowana numerycznie z równania (11) pracy
  Levy/Hubbard/McNeil/Swedberg 2015 — każdy rider od 65 % do 100 % prędkości projektowej
  ląduje z tym samym, zadanym EFH (equivalent fall height). Limit twardy: EFH ≤ 1,5 m
  (Minetti — granica amortyzacji nóg; norma USTPC).
- **Lot**: rzut ukośny bez oporu powietrza i bez "popu" (McNeil 2012: dla skoków < 12 m
  błąd ≤ 10 %). Rysowany wachlarz 4 trajektorii (65/80/90/100 %).
- **Build file**: tabela tyczenia co 0,5 m + kubatura — koncept wprost z Levy 2015 §3.

## Źródła

- [Trailism — Jump Design](https://trailism.com/jump-design/) — **wzorzec**: klotoidy, r = v²/14,7, rampa 0,25 s, EFH ≤ 4,9 ft
- Levy D., Hubbard M., McNeil J.A., Swedberg A., *A design rationale for safer terrain park jumps that limit equivalent fall height*, Sports Engineering 18 (2015), [DOI 10.1007/s12283-015-0182-6](https://doi.org/10.1007/s12283-015-0182-6)
- Hubbard M., *Safer Ski Jump Landing Surface Design Limits Normal Impact Velocity*, ASTM STP 1510 (2009)
- Swedberg A., *Safer Ski Jumps: Design of Landing Surfaces and Clothoidal In-Run Transitions*, praca magisterska NPS (2010)
- Petrone N., Cognolato M., McNeil J.A., Hubbard M., *Designing, Building, Measuring and Testing a Constant Equivalent Fall Height Terrain Park Jump* (2017)
- [MTB Trail Building — kalkulator skoczni](https://mtbtrailbuilding.com/calculators/jump-design)
- [IMBA Canada — Building a Dirt Jump / Freeride Park](https://imbacanada.com/building-a-dirt-jump-or-freeride-park/)
- [Lee Likes Bikes — Formulas for building jumps](https://www.leelikesbikes.com/formulas-for-building-jumps.html)
- [mtbr — dirt jumps specs](https://www.mtbr.com/threads/dirt-jumps-specs.599573/) — realne wymiary lip wg poziomu

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
