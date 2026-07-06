# Projektant stolików — kontekst dla Claude Code

Ten plik ładuje się automatycznie, gdy otworzysz Claude Code w tym repo.
Pełna historia decyzji: [`docs/design-notes.md`](docs/design-notes.md).

## O projekcie
Tomek (stowarzyszenie "Leśne Ścieżki") buduje stoliki (tabletopy), gapy i trasy rowerowe.
Cel narzędzia: projektować łagodne, "family friendly" skocznie MTB i dawać wymiary koparce.
Rozmowa po polsku, luźnym tonem. Jeden plik: **`public/index.html`** (vanilla JS + SVG, bez builda).

## Jak uruchomić
- Podgląd lokalny: `npx http-server public -p 8642`
- Walidacja modelu: `node tools/selfeval.js` (kotwice do Lee, mtbr, Cutlaps, tabeli Trailism)
- Deploy: `npx wrangler pages deploy` (Cloudflare Pages, projekt `stoliki`, konto tomek@byss.pl)
- Na nowej maszynie zaloguj CLI: `gh auth login` oraz `npx wrangler login`
- Live: **https://stoliki.pages.dev** — to JEDYNY adres (decyzja: bez custom domeny/byss.pl)

## Zasady, których trzymamy się przy zmianach
1. **Źródła: TYLKO rowerowe** — Trailism (spec główny), Lee Likes Bikes, IMBA, mtbr, Cutlaps,
   mtbtrailbuilding, kalkulator Desmos Trailism. **NIE używać narciarskich PDF-ów** (Levy/Hubbard/
   McNeil) do geometrii — ich wzory zakładają stałą prędkość na przejściu (najazd zjeżdża w dół);
   dla roweru wjeżdżającego z płaskiego to zawyżało najazd ~2×.
2. **Najazd** = przejście o stałym przeciążeniu `κ = a·g/v²` z `v² = v_apr² − 2gy` (promień maleje,
   gdy rower zwalnia pod górę → progresywna lipa). Potem prosta rampa 0,25 s × prędkość na lipie.
3. **Fizyka lotu** = rzut ukośny bez oporu (opór ~1–2 % przy prędkościach MTB — potwierdzone).
   Zgodna z empirią Lee co do 0,1 ft i z tabelą Trailism co do 0,01 ft. NIE ruszać.
4. **Rysunek profilu** = łańcuch segmentów o ciągłych stycznych (G1), helpery `arcPts`/`fillet`/
   `fitFilletR`. NIE wracać do ręcznego sklejania beziera (dawało schodki ±3–13 cm na knucklu).
   Samotest ciągłości: `window.__dbg.world.pts` w konsoli — skoki kąta < 4°.
5. **Design wizualny** (kolory/typografia) — świadomie odłożony na osobną iterację, po ustabilizowaniu
   funkcji. Tomek to potwierdził kilka razy.
6. Przy większych zmianach: tryb planowania + agent-naukowiec do przeglądu; potem weryfikacja
   zrzutami w preview i `node tools/selfeval.js`. Tomek nie znosi "skakania z kwiatka na kwiatek".

## Backlog "zaawansowany" (za zgodą Tomka — zmienia fizykę/UI)
lądowanie constant-EFH (BASE-Bf) · boost/squash już zrobione · prędkość między hopkami w linii ·
więcej wariantów (step-up/down, hip/berm).
