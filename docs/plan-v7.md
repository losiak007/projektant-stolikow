# Projektant stolików v7 — zestaw narzędzi wg rysunków Trailism + Desmos

## Kontekst

Tomek wkleił komplet rysunków z Trailism i link do ich kalkulatora Desmos. Analiza:
fizyka lotu narzędzia zgadza się z tabelą z rysunku 1 **co do centymetra** (kolumny no-drag:
20 mph/20° → 17,19 ft; 16 mph/45° → 17,12 ft; wysokości też). Desmos = trajektoria
z oporem powietrza (zamknięte wzory, masy 10,6+80,6 kg, Av=0,4/Cv=0,9, Ah=0,5/Ch=1,05)
+ parabola bez oporu — ich wniosek: opór prawie nic nie zmienia. Z rysunków wynikają
rzeczy, których NIE mamy, oraz prośba Tomka: osobne "tule" — od projektowania samego
wybicia, przez cały stolik, po symulację "przy jakiej prędkości jak daleko się leci".

## Nowe ustalenia z rysunków (do wdrożenia albo udokumentowania)

1. **Boost/squash** (rys. 1+2): rider potrafi dodać ~+3 mph (pompowanie/wybicie) albo
   scaśnąć −5 mph. W ich tabeli to dosłownie ±Δv na lipie (zweryfikowane ręcznie).
2. **Szablon pomiarowy** (rys. 3): promień istniejącego przejścia z cięciwy i strzałki:
   R = h/2 + c²/(8h) (łata 50″ albo pomiar base-to-lip). Z R → maks. prędkość przy 1,5 g.
3. **Konwencja prędkości**: Trailism wymiaruje promień prędkością NA LIPIE ("v0, ramp lip");
   my — prędkością najazdu (większy promień = bezpieczniej). Udokumentować, nie zmieniać.
4. Tabela "Ramp heights for circular transitions" z rys. 3 to liniowa reguła kciuka
   (h = R·θ/90°) — świadomie pomijamy, nasza integracja jest dokładniejsza (README).
5. Wykres G vs promień/prędkość (rys. 4) — mamy jako wzory; pokryje go tool pomiarowy.

## Plan implementacji (public/index.html — nadal jeden plik)

### A. Zakładki narzędzi (tab bar nad całością)
`[🟫 Projekt skoczni] [📐 Wybicie (kicker)] [🎯 Symulator lotu] [📏 Pomiar szablonem]`
- Przełącznik pokazuje/ukrywa sekcje (`data-tool`), stan niezależny per narzędzie,
  styl jak istniejące pigułki presetów. Projekt skoczni = obecny widok bez zmian.

### B. Tool „Wybicie (kicker)” — projektowanie samego wybicia
- Wejścia: prędkość (przełącznik: najazd na płaskim / na lipie), kąt, limit g (suwak).
- Wyjścia: promień wjazd→lipa, długość przejścia, rampa 0,25 s, wysokość H, długość
  podstawy — czyli kolumny z tabeli Trailism (rys. 1) + porównanie „gdyby czysty łuk”.
- Mini-rysunek samego wybicia: REUSE buildTakeoff + makeScene (profil ucięty na lipie).

### C. Tool „Symulator lotu” — szybkie „ile polecę”
- Wejścia: prędkość NA LIPIE, kąt, wysokość lipy nad lądowaniem (0 = równy poziom).
- Wyjścia: dystans, wysokość, czas + **boost +3 mph / squash −5 mph** (rys. 1/2).
- Wykres trajektorii (makeScene bez bryły, sama siatka) z 3 parabolami (normal/boost/squash)
  + opcjonalny toggle „pokaż wpływ oporu powietrza”: zamknięte wzory z Desmos
  (kh=½·1,225·0,5·1,05, m=91,2 kg — stałe jak u nich) rysują 4. krzywą; podpis
  z różnicą w % (edukacyjnie: „opór ≈ −2 %”). To domyka backlog „drag jako nakładka”.
- REUSE: formuły lotu już są; drag = ~20 linii (x(t), y(t) z arctan/arccosh — wzory
  zapisane w scratchpad/desmos-state.json).

### D. Tool „Pomiar szablonem” — dla istniejących hopek w terenie
- Wejścia: długość cięciwy c (domyślnie 127 cm = 50″), strzałka ugięcia h (cm),
  opcjonalnie prędkość ridera.
- Wyjścia: promień R = h/2 + c²/8h, maks. prędkość dla 1,5 g (√(1,5·g·R)) i dla 2 g,
  przeciążenie przy zadanej prędkości + klasyfikacja wg Cutlaps (BMX/dirt/full-sus).
- Mini-diagram łuku z cięciwą (SVG, statyczny szkic z wymiarami) — jak na rys. 3.

### E. Boost/squash w GŁÓWNYM widoku symulacji skoczni
- Do wachlarza trajektorii dochodzą 2 krzywe: boost (+3 mph na lipie, zielona przerywana)
  i squash (−5 mph, czerwona przerywana) z punktami przyziemienia; legenda w stopce.
- Wyniki: wiersz „lot z boostem / ze squashem” (zakres, w jakim realnie lądują riderzy —
  wprost z rys. 1: „Rider input modified air range”).
- Ostrzeżenie gdy boost przelatuje za koniec zeskoku (overshoot na płaskie).

### F. Walidacja (tools/selfeval.js) — kotwice z tabeli rys. 1
- Lot no-drag: 20 mph/20° → 17,19 ft; 16/45 → 17,12 ft; wysokości 1,56/4,28 ft;
  r_min: 12 mph → 6,42 ft, 20 mph → 17,84 ft; eq 0,25 s: 5,87 ft przy 16 mph.
- Boost/squash: 20/20 boosted → 22,73 ft, squashed → 9,67 ft.
- Drag (wzory Desmos): dystans krótszy o ~1–3 % przy 40 km/h — zgodnie z analizą Tomka.

### G. README + karta źródeł
- Sekcja „Narzędzia” (4 zakładki); Desmos w źródłach; zdania: konwencja prędkości
  (lipa vs najazd), pominięta liniowa tabela z rys. 3, boost/squash wg Trailism.

## Czego nie ruszamy
Fizyka i geometria G1 projektu skoczni (świeżo zwalidowane), presety, koparka, deploy.
Design wizualny — nadal osobna iteracja.

## Weryfikacja
1. `node tools/selfeval.js` — wszystkie kotwice (Lee, mtbr, Cutlaps, tabela Trailism) zielone.
2. Preview: każda zakładka — zrzut; kicker 20 mph/20° vs tabela (r 17,8 ft, eq 7,3 ft);
   symulator 16/45 → 17,1 ft; szablon c=50″, h=2,38″ → R=11,04 ft (przykład z rys. 3!);
   główny widok: boost/squash lądują na zeskoku, ostrzeżenie przy overshoot.
3. Test ciągłości profilu bez regresji (window.__dbg). Konsola czysta.
4. Commit + push + `npx wrangler pages deploy` + test na stoliki.pages.dev.
