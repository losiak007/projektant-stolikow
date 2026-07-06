# Leśne Ścieżki — projektant stolików 🌲🚵

Interaktywne narzędzie do projektowania stolików (tabletopów) na trasach rowerowych.
Ustawiasz **prędkość najazdu** i **kąt wybicia**, a narzędzie liczy pełną geometrię
skoczni i parametry lotu — tak, żeby dało się świadomie projektować łagodne,
family-friendly stoliki.

**Live:** https://stoliki.byss.pl

## Co liczy

- promień najazdu z limitu przeciążeń: `r = v² / (limit × g)` (Trailism: v²/14,7 przy 1,5 g)
- segment stabilizacji 0,25–0,3 s przed lipą (eliminuje „bujanie” przed wybiciem)
- wysokość wybicia, długość stołu, zeskok prowadzony po paraboli lotu
- długość i wysokość lotu, czas lotu, kąt lądowania
- klasyfikację: 🟢 łagodny / 🟡 dystansowy / 🔴 booter

## Źródła

- [Trailism — Jump Design](https://trailism.com/jump-design/) — promień przejścia, segment equilibrium, klotoidy, zeskok po paraboli
- [MTB Trail Building — kalkulator skoczni](https://mtbtrailbuilding.com/calculators/jump-design) — model lotu (prędkość + kąt → dystans, wysokość, czas, kąt lądowania)
- [IMBA Canada — Building a Dirt Jump / Freeride Park](https://imbacanada.com/building-a-dirt-jump-or-freeride-park/) — wymiary dla początkujących
- [Lee Likes Bikes — Formulas for building jumps](https://www.leelikesbikes.com/formulas-for-building-jumps.html) — kąty vs dystans/wysokość

## Rozwój

Całość to jeden statyczny plik: [`public/index.html`](public/index.html) — bez zależności, bez builda.

Podgląd lokalny:

```sh
npx http-server public -p 8642
```

Deploy (Cloudflare Workers + custom domain):

```sh
npx wrangler deploy
```
