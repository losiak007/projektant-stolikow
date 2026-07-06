// Self-ewaluacja modelu projektanta stolików
const G = 9.81, RAD = Math.PI / 180;

// ---- STARY najazd: para klotoid o promieniu ze stałej prędkości najazdu ----
function takeoffOld(vApr, th, aMaxG, tRamp) {
  const r = vApr * vApr / (aMaxG * G);
  const s1 = th * r, A2 = s1 * r;
  let x = 0, y = 0;
  const N = 400, ds = s1 / N;
  for (let i = 0; i < N; i++) { const sm = (i + 0.5) * ds, a = sm * sm / (2 * A2); x += Math.cos(a) * ds; y += Math.sin(a) * ds; }
  for (let i = 0; i < N; i++) { const sm = (i + 0.5) * ds, rem = s1 - sm, a = th - rem * rem / (2 * A2); x += Math.cos(a) * ds; y += Math.sin(a) * ds; }
  let v0 = vApr, H = y;
  for (let k = 0; k < 10; k++) { const L = tRamp * v0; H = y + L * Math.sin(th); v0 = Math.sqrt(Math.max(vApr * vApr - 2 * G * H, 0.5)); }
  return { H, v0, tooSlow: vApr * vApr - 2 * G * H < 1.0 };
}

// ---- NOWY najazd: stałe przeciążenie normalne a·g, promień maleje z prędkością ----
function takeoffNew(vApr, th, aMaxG, tRamp) {
  let x = 0, y = 0, ang = 0, v2 = vApr * vApr;
  const ds = 0.01;
  let guard = 0;
  while (ang < th && guard++ < 60000) {
    v2 = Math.max(vApr * vApr - 2 * G * y, 0.4);
    const kappa = aMaxG * G / v2;
    ang = Math.min(ang + kappa * ds, th);
    x += Math.cos(ang) * ds; y += Math.sin(ang) * ds;
  }
  const transH = y;
  let v0 = Math.sqrt(Math.max(vApr * vApr - 2 * G * y, 0.5)), H = y;
  for (let k = 0; k < 10; k++) { const L = tRamp * v0; H = transH + L * Math.sin(th); v0 = Math.sqrt(Math.max(vApr * vApr - 2 * G * H, 0.5)); }
  return { H, v0, tooSlow: vApr * vApr - 2 * G * H < 1.0, rEntry: vApr * vApr / (aMaxG * G), rTop: Math.max(v2, 0.4) / (aMaxG * G) };
}

const f = (x, d = 2) => x.toFixed(d);
const kmh = v => v / 3.6;

console.log("=== KOTWICA 1: Lee Likes Bikes — fizyka lotu (prędkość NA LIPIE 15 mph = 6,7 m/s) ===");
for (const [deg, leeDist, leeUp] of [[35, 14, 2.5], [45, 15, 3.8], [55, 14, 5.0]]) {
  const v = 6.7, th = deg * RAD;
  const dist = v * v * Math.sin(2 * th) / G * 3.28084;
  const up = (v * Math.sin(th)) ** 2 / (2 * G) * 3.28084;
  console.log(` ${deg}°: dystans ${f(dist, 1)} ft (Lee: ${leeDist}), wysokość ${f(up, 1)} ft (Lee: ${leeUp})`);
}

console.log("\n=== KOTWICA 2: przypadek Tomka 40 km/h / 55° ===");
for (const [name, fn] of [["STARY", takeoffOld], ["NOWY ", takeoffNew]]) {
  const t = fn(kmh(40), 55 * RAD, 1.5, 0.25);
  const sweet = t.v0 * t.v0 * Math.sin(2 * 55 * RAD) / G;
  console.log(` ${name}: H=${f(t.H)} m, v_lipa=${f(t.v0 * 3.6, 1)} km/h, lot(sweet)=${f(sweet, 1)} m, tooSlow=${t.tooSlow}`);
}

console.log("\n=== KOTWICA 3: mtbr — realne wysokości lip (przy typowych prędkościach dirt ~25-30 km/h) ===");
console.log(" mtbr: beginner 30°≈3ft(0.9m) · intermediate 45°≈4ft(1.2m) · pro 60°≈6-7ft(1.8-2.1m)");
for (const [vK, deg] of [[25, 30], [25, 45], [28, 60], [30, 45]]) {
  const o = takeoffOld(kmh(vK), deg * RAD, 1.5, 0.25);
  const n = takeoffNew(kmh(vK), deg * RAD, 1.5, 0.25);
  console.log(` ${vK} km/h / ${deg}°: STARY H=${f(o.H)} m${o.tooSlow ? " (tooSlow!)" : ""} | NOWY H=${f(n.H)} m${n.tooSlow ? " (tooSlow!)" : ""}, v_lipa=${f(n.v0 * 3.6, 1)} km/h`);
}

console.log("\n=== KOTWICA 4: Trailism 20 mph / 20° (artykuł: ramp height ~5,7 ft; czysty łuk: 3,6 ft) ===");
{
  const o = takeoffOld(kmh(32.2), 20 * RAD, 1.5, 0.25);
  const n = takeoffNew(kmh(32.2), 20 * RAD, 1.5, 0.25);
  console.log(` STARY H=${f(o.H * 3.28, 1)} ft | NOWY H=${f(n.H * 3.28, 1)} ft`);
}

console.log("\n=== NOWY MODEL: lot rośnie z prędkością? (25°, do przyziemienia sweet-spot) ===");
for (const vK of [15, 20, 25, 30, 35, 40]) {
  const n = takeoffNew(kmh(vK), 25 * RAD, 1.5, 0.25);
  const sweet = n.v0 * n.v0 * Math.sin(50 * RAD) / G;
  console.log(` ${vK} km/h: H=${f(n.H)} m, v_lipa=${f(n.v0 * 3.6, 1)} km/h, lot(sweet)≈${f(sweet, 1)} m${n.tooSlow ? "  ⛔" : ""}`);
}

console.log("\n=== NOWY MODEL: kąty przy 40 km/h ===");
for (const deg of [25, 35, 45, 55, 60]) {
  const n = takeoffNew(kmh(40), deg * RAD, 1.5, 0.25);
  const sweet = n.v0 * n.v0 * Math.sin(2 * deg * RAD) / G;
  console.log(` ${deg}°: H=${f(n.H)} m, v_lipa=${f(n.v0 * 3.6, 1)} km/h, lot(sweet)≈${f(sweet, 1)} m, r ${f(n.rEntry, 1)}→${f(n.rTop, 1)} m${n.tooSlow ? "  ⛔" : ""}`);
}

console.log("\n=== KOTWICA 5: Cutlaps — wysokość SAMEGO przejścia vs gotowe kickery ===");
console.log(" (kicker = łuk bez rampy; nasza wysokość przejścia powinna być w okolicy)");
console.log(" Cutlaps: Mini 0,54 m/28° · Medium 0,70 m/30° · Big 1,20 m/45°");
for (const [vK, deg, cutH] of [[22, 28, 0.54], [24, 30, 0.70], [30, 45, 1.20]]) {
  // wysokość przejścia = H minus wkład rampy
  const n = takeoffNew(kmh(vK), deg * RAD, 1.3, 0.25);
  const rampH = 0.25 * n.v0 * Math.sin(deg * RAD);
  console.log(` ${vK} km/h/${deg}°: przejście ≈ ${f(n.H - rampH)} m (Cutlaps: ${f(cutH)} m), pełne H=${f(n.H)} m`);
}
console.log("\n=== KOTWICA 6: Cutlaps — promienie wjazdowe wg typu roweru ===");
console.log(" BMX 2,4–3,0 · dirt 3,0–4,0 · full-sus 4,0–6,1 m");
for (const vK of [20, 27, 33]) {
  const r = kmh(vK) ** 2 / (1.5 * G);
  console.log(` ${vK} km/h przy 1,5 g: r wjazdowe = ${f(r, 1)} m`);
}
console.log("\n[TEST CIĄGŁOŚCI PROFILU] rysunek: w przeglądarce, konsola:");
console.log("  window.__dbg.world.pts — max skok kąta między segmentami >4 cm ma być < 4°");
console.log("  (sprawdzone 2026-07: presety 0,4–1,5°, degeneraty ≤ 4,7°, x monotoniczne)");
