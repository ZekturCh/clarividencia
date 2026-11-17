"use strict";
const $ = (id) => document.getElementById(id),
  NS = "http://www.w3.org/2000/svg";
const booths = [
  {
    id: "P5",
    name: "Credicorp",
    x: 270,
    y: 175,
    w: 180,
    h: 84,
    goal: true,
    color: "#f65be0",
    icon: 4,
  },
  {
    id: "P1",
    name: "Wonderful",
    x: 165,
    y: 343,
    w: 125,
    h: 130,
    goal: true,
    color: "#5ef4ff",
    icon: 0,
  },
  {
    id: "P2",
    name: "Indra",
    x: 165,
    y: 522,
    w: 125,
    h: 130,
    goal: true,
    color: "#b59cff",
    icon: 1,
  },
  {
    id: "P3",
    name: "IBM",
    x: 430,
    y: 343,
    w: 125,
    h: 130,
    goal: true,
    color: "#63acff",
    icon: 2,
  },
  {
    id: "P4",
    name: "NTT DATA",
    x: 430,
    y: 522,
    w: 125,
    h: 130,
    goal: true,
    color: "#ff83cf",
    icon: 3,
  },
  ...["Stand 1", "Strike", "Netskope", "Databricks", "Asper", "Amazon"].map(
    (name, i) => ({
      id: "S" + (i + 1),
      name,
      x: 48,
      y: 160 + i * 88,
      w: 76,
      h: 56,
      goal: i === 0,
      color: "#62efc7",
      icon: 5,
    }),
  ),
  ...["Stand 7", "Orca", "Stand 9", "TCS", "Deloitte", "Microsoft"].map(
    (name, i) => ({
      id: "S" + (i + 7),
      name,
      x: 596,
      y: 160 + i * 88,
      w: 76,
      h: 56,
      goal: i === 0,
      color: "#ffb96c",
      icon: 6,
    }),
  ),
  {
    id: "DS",
    name: "Data Stream",
    x: 323,
    y: 449,
    w: 74,
    h: 65,
    color: "#90aaff",
    type: "activity",
  },
];
const goals = ["P1", "P2", "P3", "P4", "P5", "S1", "S7"].map((id) =>
  booths.find((b) => b.id === id),
);
const progress =
  window.CrediaCircuitSource ||
  window.createCircuitProgress(goals.map((b) => b.id));
const live = progress.mode === "local";
const names = [
  "Alex Torres",
  "Andrea Vega",
  "Lucía Reyes",
  "Diego Silva",
  "Sofía Ramos",
  "Gabriel Cruz",
];
const randomName = () => names[Math.floor(Math.random() * names.length)];
let name = live
  ? "Byte"
  : names.includes(progress.name)
    ? progress.name
    : randomName();
const { visited, checkedIn } = progress;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let selected = null,
  zoom = 1,
  pos = { x: 360, y: 844 },
  moving = 0,
  traveling = false;
function node(tag, attrs = {}, parent, txt) {
  const el = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "style") el.style.cssText = v;
    else el.setAttribute(k, v);
  });
  if (txt !== undefined) el.textContent = txt;
  if (parent) parent.appendChild(el);
  return el;
}
const floor = $("floor"),
  buildings = $("buildings");
function rect(p, x, y, w, h, fill, stroke, extra = {}) {
  return node(
    "rect",
    { x, y, width: w, height: h, fill, stroke: stroke || "none", ...extra },
    p,
  );
}
function path(p, d, fill, stroke, extra = {}) {
  return node("path", { d, fill, stroke: stroke || "none", ...extra }, p);
}
function label(p, x, y, t, size = 11, fill = "#e7f8ff") {
  return node(
    "text",
    {
      x,
      y,
      "text-anchor": "middle",
      "font-size": size,
      "font-weight": "bold",
      fill,
    },
    p,
    t,
  );
}
for (let i = 0; i < 15; i++) {
  let y = 70 + i * 53;
  for (let x of [5, 686]) {
    rect(floor, x, y, 29, 18, "#283951", "#a6c4d5");
    rect(floor, x, y, 29, 4, "#c8e5ed");
    rect(floor, x, y + 13, 29, 5, "#101c32");
  }
}
for (let i = 0; i < 11; i++) {
  let x = 57 + i * 57;
  for (let y of [6, 865]) {
    rect(floor, x, y, 23, 29, "#35445e", "#a6c4d5");
    rect(floor, x, y, 6, 29, "#a6c6d7");
  }
}
const shape = "M48 30H672L690 48V848L672 866H48L30 848V48Z";
path(
  floor,
  "M48 45H672L690 63V863L672 882H48L30 863V63Z",
  "#10182e",
  "#293954",
  { "stroke-width": 3 },
);
path(floor, shape, "url(#substrate)", "url(#rim)", { "stroke-width": 5 });
path(floor, shape, "url(#grid)", "none");
path(floor, "M53 45H667L676 55V840L666 851H54L44 841V55Z", "none", "#435e81", {
  "stroke-width": 2,
});
for (let y of [141, 286, 315, 488, 682, 730, 838]) {
  path(
    floor,
    "M43 " + y + "H146L158 " + (y + 12) + "H562L574 " + y + "H677",
    "none",
    "#245b73",
    { "stroke-width": 3 },
  );
  path(
    floor,
    "M43 " + y + "H146L158 " + (y + 12) + "H562L574 " + y + "H677",
    "none",
    "#50eaff",
    { class: "signal", "stroke-width": 1.5, opacity: 0.58 },
  );
}
for (let x of [143, 311, 409, 577]) {
  path(
    floor,
    "M" + x + " 137V690L" + (x + 10) + " 700V744",
    "none",
    "#2d4f76",
    { "stroke-width": 2 },
  );
  path(
    floor,
    "M" + x + " 137V690L" + (x + 10) + " 700V744",
    "none",
    "#f457de",
    { class: "signal", "stroke-width": 1, opacity: 0.55 },
  );
}
for (let y of [301, 475, 700])
  for (let x of [143, 360, 577]) {
    rect(floor, x - 4, y - 4, 8, 8, "#182d48", "#4ccade");
    rect(floor, x - 1, y - 1, 2, 2, "#a6faff");
  }
for (let x of [311, 360, 409])
  for (let y of [328, 409, 589, 662]) {
    rect(floor, x - 5, y - 5, 10, 10, "#111a30", "#6582a0");
    rect(floor, x - 3, y - 4, 6, 2, "#b3d4e5");
  }
label(floor, 360, 90, "CIRCUITO DIGITAL", 13, "#6c849e");
label(floor, 360, 866, "ACCESO", 10, "#72eaff");
function build(b) {
  const { x, y, w, h } = b,
    g = node(
      "g",
      {
        class: "booth",
        tabindex: 0,
        role: "button",
        "aria-label": b.name + " " + b.id,
        "data-id": b.id,
      },
      buildings,
    );
  let d = b.id.startsWith("P") ? 22 : 13;
  const palette = b.id.startsWith("P")
    ? [
        b.color,
        ["#246075", "#534683", "#315b87", "#713763", "#6f356d"][
          Number(b.id.slice(1)) - 1
        ] || "#246075",
      ]
    : b.id.startsWith("S")
      ? [
          ["#a68dff", "#5cc8ff", "#69e6bc", "#ffac7e", "#7eb4ff", "#db9aff"][
            (Number(b.id.slice(1)) - 1) % 6
          ],
          ["#403963", "#28516e", "#285b59", "#68463e", "#344e7e", "#583b6a"][
            (Number(b.id.slice(1)) - 1) % 6
          ],
        ]
      : b.type === "activity"
        ? ["#ff65e5", "#633b71"]
        : ["#7ab8ee", "#324d68"];
  const c = b.goal ? b.color : palette[0];
  const mix = (a, b, t) =>
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.round(
          parseInt(a.slice(i, i + 2), 16) * (1 - t) +
            parseInt(b.slice(i, i + 2), 16) * t,
        )
          .toString(16)
          .padStart(2, "0"),
      )
      .join("");
  g.style.setProperty("--zone", c);
  g.style.setProperty("--idleRoof", mix("#202b3b", c, 0.27));
  g.style.setProperty("--idleEdge", mix("#536174", c, 0.38));
  g.style.setProperty("--idleSign", mix("#111b2b", c, 0.12));
  g.style.setProperty("--idleDoor", mix("#233247", c, 0.22));
  g.style.setProperty("--roof", mix(palette[1], c, 0.37));
  const xx = x + 6,
    yy = y + 8,
    ww = w - 12,
    hh = h - 15;
  rect(g, x - 9, y - 10, w + 18, h + 24, c, "none", {
    class: "energySpill",
    rx: 8,
    filter: "url(#glow)",
    "pointer-events": "none",
  });
  rect(g, x + 3, y + 8, w, h, "#020a19", "none", { opacity: 0.55 });
  path(
    g,
    "M" + xx + " " + yy + "H" + (xx + ww) + "V" + (yy + hh) + "H" + xx + "Z",
    "#152743",
    "#375575",
    { "stroke-width": 2 },
  );
  rect(g, xx, yy + hh - d, ww, d, "#243b59", "#5b7292");
  rect(g, xx + ww - 7, yy + 6, 7, hh - 6, "#102038");
  path(
    g,
    "M" +
      (xx - 3) +
      " " +
      (yy + 5) +
      "L" +
      (xx + 9) +
      " " +
      (yy - 7) +
      "H" +
      (xx + ww - 8) +
      "L" +
      (xx + ww + 3) +
      " " +
      (yy + 5) +
      "V" +
      (yy + hh - d - 3) +
      "H" +
      (xx - 3) +
      "Z",
    "#243953",
    c,
    { "stroke-width": 2, class: "roof" },
  );
  path(
    g,
    "M" +
      (xx + 8) +
      " " +
      (yy + 3) +
      "H" +
      (xx + ww - 9) +
      "V" +
      (yy + hh - d - 12) +
      "H" +
      (xx + 8) +
      "Z",
    "none",
    c,
    { "stroke-width": 1, opacity: 0.42 },
  );
  rect(g, xx + 8, yy + hh - d - 2, ww - 16, 3, c, "none", {
    class: "idleAccent",
    opacity: 0.9,
  });
  path(
    g,
    "M" +
      (xx + 7) +
      " " +
      (yy + 1) +
      "H" +
      (xx + ww - 8) +
      "V" +
      (yy + hh - d - 6) +
      "H" +
      (xx + 7) +
      "Z",
    "none",
    c,
    {
      class: "roofEdge",
      "stroke-width": 2,
      style: "animation-delay:" + -(x % 7) / 3 + "s",
      opacity: 0.8,
      "pointer-events": "none",
    },
  );
  for (let k = 0; k < (b.id.startsWith("P") ? 4 : 2); k++) {
    let lx = xx + 10 + k * ((ww - 20) / (b.id.startsWith("P") ? 4 : 2));
    rect(g, lx, yy + 8, 6, 3, c, "none", {
      class: "lamp",
      style: "animation-delay:" + -k * 0.4 + "s",
      "pointer-events": "none",
    });
    if (b.id.startsWith("P"))
      rect(g, lx, yy + 14, 10, 5, "#b9efff", c, {
        class: "windowGlow",
        style: "animation-delay:" + -k * 0.6 + "s",
        "pointer-events": "none",
      });
  }
  let doorW = Math.min(20, ww * 0.3);
  rect(
    g,
    xx + ww / 2 - doorW / 2,
    yy + hh - d + 3,
    doorW,
    d - 3,
    "#367da0",
    "#08192d",
    { class: "door" },
  );
  for (let wx of [xx + 5, xx + ww - 14])
    rect(g, wx, yy + hh - d + 4, 9, Math.max(4, d - 8), "#8bdafa", "#102034", {
      class: "windowGlow",
      style: "animation-delay:" + -(wx % 5) / 2 + "s",
    });
  const signY = yy + Math.max(8, (hh - d) / 2 - 9);
  rect(g, x + 4, signY, w - 8, b.id.startsWith("P") ? 33 : 20, "#0b162b", c, {
    class: "sign",
    rx: 2,
  });
  let fs = b.id.startsWith("P")
    ? 13
    : Math.min(10, ((w - 12) / Math.max(1, b.name.length)) * 1.55);
  label(g, x + w / 2, signY + (b.id.startsWith("P") ? 14 : 13), b.name, fs);
  if (b.id.startsWith("P"))
    label(g, x + w / 2, signY + 26, b.id, 10, "#98c9e7");
  if (b.goal) {
    rect(g, x + w - 13, y - 3, 11, 11, c, "#f9eaff", {
      rx: 2,
      class: "goalMarker",
    });
    const ch = node("g", { class: "check" }, g);
    rect(ch, x + w - 23, y - 7, 20, 20, "#11636e", "#6bffff", { rx: 3 });
    path(ch, "M" + (x + w - 19) + " " + (y + 3) + "l4 4 8 -9", "none", "#fff", {
      "stroke-width": 2.5,
      "stroke-linecap": "square",
    });
  }
  if (b.goal || (live && b.id !== "DS")) {
    const rail =
      "M" +
      (x + 3) +
      " " +
      (y + 2) +
      "H" +
      (x + w - 3) +
      "V" +
      (y + h - 4) +
      "H" +
      (x + 3) +
      "Z";
    path(g, rail, "none", c, {
      class: "ledRail",
      "stroke-width": 2,
      "pointer-events": "none",
    });
    path(g, rail, "none", "#fff", {
      class: "ledRunner",
      "stroke-width": 3,
      "stroke-dasharray": "6 14",
      "stroke-linecap": "square",
      "pointer-events": "none",
    });
    for (let i = 0; i < 6; i++) {
      let lx = x + 10 + (i * (w - 20)) / 5;
      rect(g, lx - 2, y + h - 7, 4, 4, c, "none", {
        class: "ledPixel",
        style: "animation-delay:" + -i * 0.22 + "s",
        "pointer-events": "none",
      });
    }
    const tag = label(g, x + w / 2, y - 10, "● ENERGIZADO", 9, "#b9ffff");
    tag.setAttribute("class", "powerLabel");
  }
  rect(g, x - 3, y - 6, w + 6, h + 15, "transparent", "transparent", {
    class: "outline",
    rx: 3,
  });
  g.addEventListener("click", () => select(b, true));
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(b, true);
    }
  });
}

// Decorative chip hardware, behind buildings and non-interactive.
const ambience = node("g", { "pointer-events": "none" }, floor);
for (let i = 0; i < 15; i++) {
  for (let x of [19, 700]) {
    const y = 79 + i * 53;
    rect(ambience, x - 4, y - 3, 8, 6, i % 2 ? "#ff64e8" : "#72faff", "none", {
      class: "glowBreath",
      style: "animation-delay:" + -i * 0.19 + "s",
    });
  }
}
for (let i = 0; i < 11; i++) {
  for (let y of [20, 879]) {
    rect(
      ambience,
      65 + i * 57,
      y - 4,
      7,
      8,
      i % 2 ? "#ff64e8" : "#72faff",
      "none",
      { class: "lamp", style: "animation-delay:" + -i * 0.25 + "s" },
    );
  }
}
for (let i = 0; i < 2; i++) {
  let x = i ? 680 : 40;
  path(ambience, "M" + x + " 56V837", "none", i ? "#ff64e8" : "#72faff", {
    "stroke-width": 2,
    class: "lightChase",
    opacity: 0.9,
    style: "animation-delay:" + -i * 0.7 + "s",
  });
}
for (let y of [300, 487, 703, 737])
  for (let x of [145, 310, 410, 575]) {
    node(
      "circle",
      {
        cx: x,
        cy: y,
        r: 5,
        fill: "#081e31",
        stroke: "#59e6ff",
        "stroke-width": 1,
      },
      ambience,
    );
    node(
      "circle",
      {
        cx: x,
        cy: y,
        r: 2.6,
        fill: (x + y) % 2 ? "#ff80eb" : "#9effff",
        class: "glowBreath",
        style: "animation-delay:" + -((x + y) % 8) * 0.3 + "s",
      },
      ambience,
    );
  }
for (let i = 0; i < 8; i++) {
  let x = 170 + i * 54;
  path(
    ambience,
    "M" + (x - 5) + " 721l5 -5 5 5 -5 5Z",
    "none",
    i % 2 ? "#f76ee8" : "#67efff",
    {
      "stroke-width": 1.4,
      class: "glowBreath",
      style: "animation-delay:" + -i * 0.2 + "s",
    },
  );
}
for (let y of [277, 696])
  for (let x of [190, 228, 492, 530]) {
    rect(ambience, x - 8, y - 5, 16, 10, "#182a45", "#53759c", { rx: 1 });
    rect(ambience, x - 5, y - 2, 10, 4, "#71a8d4", "none", {
      class: "lamp",
      style: "animation-delay:" + (-x % 7) + "s",
    });
  }
booths.forEach(build);
function medal(b) {
  const glyphs = [
    "M25 25H47V47H25ZM30 30H42V42H30Z",
    "M36 20L54 32 36 44 18 32ZM18 43L36 55 54 43",
    "M22 22L50 22 36 52ZM22 22L36 52L50 22",
    "M19 25Q36 12 53 25V46Q36 60 19 46ZM19 25Q36 38 53 25M19 36Q36 49 53 36",
    "M30 16L52 36 30 56 21 47 34 36 21 25Z",
    "M36 30V42M28 24Q16 36 28 48M44 24Q56 36 44 48",
    "M23 23L49 49M49 23L23 49M36 18V54M18 36H54",
  ];
  return (
    '<svg viewBox="0 0 72 72" aria-hidden="true"><path d="M36 3L57 12 69 36 57 60 36 69 15 60 3 36 15 12Z" fill="#17253e" stroke="' +
    b.color +
    '" stroke-width="3"/><path d="M36 10L53 18 61 36 53 54 36 62 19 54 11 36 19 18Z" fill="none" stroke="' +
    b.color +
    '" opacity=".45"/><path d="' +
    glyphs[b.icon] +
    '" stroke="' +
    b.color +
    '" stroke-width="3.8" stroke-linejoin="round" fill="none"/></svg>'
  );
}
const buildingNodes = new Map(
  [...buildings.children].map((el) => [el.dataset.id, el]),
);
const badgeNodes = new Map(
  goals.map((b) => {
    const button = document.createElement("button");
    button.className = "badge";
    button.style.setProperty("--accent", b.color);
    button.innerHTML = medal(b) + "<span>" + b.name + "</span><em></em>";
    button.addEventListener("click", () => select(b, true));
    $("badges").append(button);
    return [b.id, button];
  }),
);
function render() {
  const count = goals.filter((b) => visited.has(b.id)).length;
  $("count").textContent = count;
  $("bar").style.width = (count / goals.length) * 100 + "%";
  $("bar").parentElement.setAttribute("aria-valuenow", count);
  $("win").hidden = count !== goals.length;
  const remaining =
    count === goals.length
      ? "¡Todos los logros desbloqueados!"
      : "Te faltan " + (goals.length - count) + " medallas por conseguir.";
  $("remaining").textContent =
    live && progress.ready
      ? "Stands visitados " +
        progress.visitedStands +
        "/" +
        progress.totalStands +
        " · " +
        remaining
      : live
        ? "Acerca tu pulsera para consultar tu recorrido."
        : !progress.storageAvailable
          ? "El almacenamiento no está disponible. " + remaining
          : remaining;
  for (const [id, button] of badgeNodes) {
    const done = visited.has(id);
    button.classList.toggle("on", done);
    button.querySelector("em").textContent = done ? "ACTIVA" : "PENDIENTE";
  }
  for (const [id, el] of buildingNodes) {
    el.classList.toggle("done", visited.has(id));
    el.classList.toggle("selected", selected?.id === id);
  }
  if (!selected) return;
  const done = visited.has(selected.id);
  $("status").textContent = done
    ? selected.goal
      ? "MEDALLA DESBLOQUEADA"
      : "STAND VISITADO"
    : selected.goal
      ? "MEDALLA PENDIENTE"
      : "PUNTO DEL EVENTO";
  const stand = live
    ? progress.stands.find((item) => item.map_id === selected.id)
    : null;
  $("selectedTitle").textContent =
    (stand?.name || selected.name) + " · " + selected.id;
  $("selectedDesc").textContent = live
    ? done
      ? "Visita confirmada por CREDIA."
      : selected.id === "DS"
        ? "Ubicación de referencia."
        : progress.ready
          ? "Todavía no figura una visita confirmada."
          : "Acerca tu pulsera al lector."
    : !selected.goal
      ? "Ubicación de referencia; no otorga medalla en esta demo."
      : done
        ? "Ya has visitado este stand."
        : checkedIn.has(selected.id)
          ? "Pulsera registrada en la demo. Completa la encuesta."
          : "Registra tu pulsera en este stand para obtener su medalla.";
  $("visit").disabled = traveling;
  $("visit").textContent = traveling
    ? "En camino…"
    : done && selected.goal
      ? "Ver medalla"
      : live || !selected.goal
        ? "Ver información"
        : "Abrir terminal";
}
function position(x, y) {
  pos = { x, y };
  $("avatar").setAttribute("transform", "translate(" + x + " " + y + ")");
}

// Collision model: the avatar's center cannot enter any expanded booth footprint.
// The same continuous collision test is shared by keyboard, touch and pathfinding.
const obstacles = booths.map((b) => ({
  l: b.x - 14,
  r: b.x + b.w + 14,
  t: b.y - 14,
  b: b.y + b.h + 14,
}));
function free(x, y) {
  return (
    x >= 46 &&
    x <= 674 &&
    y >= 51 &&
    y <= 851 &&
    !obstacles.some((o) => x > o.l && x < o.r && y > o.t && y < o.b)
  );
}
function clearLine(a, b) {
  let n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2));
  for (let i = 0; i <= n; i++) {
    let t = i / n;
    if (!free(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
  }
  return true;
}
const step = 6,
  ox = 46,
  oy = 51,
  cols = 105,
  rows = 134,
  N = cols * rows;
const pts = Array.from({ length: N }, (_, i) => ({
  x: ox + (i % cols) * step,
  y: oy + Math.floor(i / cols) * step,
}));
const walk = Uint8Array.from(pts, (p) => (free(p.x, p.y) ? 1 : 0));
const edges = Uint8Array.from(pts, (point, i) => {
  if (!walk[i]) return 0;
  let mask = 0;
  if (i % cols && walk[i - 1] && clearLine(point, pts[i - 1])) mask |= 1;
  if (i % cols < cols - 1 && walk[i + 1] && clearLine(point, pts[i + 1]))
    mask |= 2;
  if (i >= cols && walk[i - cols] && clearLine(point, pts[i - cols])) mask |= 4;
  if (i + cols < N && walk[i + cols] && clearLine(point, pts[i + cols]))
    mask |= 8;
  return mask;
});
function nearest(p, from) {
  let best = -1,
    bd = Infinity;
  for (let i = 0; i < N; i++) {
    if (!walk[i]) continue;
    let q = pts[i],
      d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
    if (d < bd && (!from || clearLine(from, q))) {
      bd = d;
      best = i;
    }
  }
  return best;
}
function routeTo(start, goal) {
  if (clearLine(start, goal)) return [start, goal];
  let s = nearest(start, start),
    e = nearest(goal, free(goal.x, goal.y) ? goal : null);
  if (s < 0 || e < 0) return null;
  let seen = new Int32Array(N);
  seen.fill(-1);
  seen[s] = s;
  let q = new Int32Array(N),
    head = 0,
    tail = 0;
  q[tail++] = s;
  const offsets = [-1, 1, -cols, cols];
  while (head < tail) {
    let i = q[head++];
    if (i === e) break;
    for (let k = 0; k < offsets.length; k++) {
      if (!(edges[i] & (1 << k))) continue;
      const j = i + offsets[k];
      if (seen[j] >= 0) continue;
      seen[j] = i;
      q[tail++] = j;
    }
  }
  if (seen[e] < 0) return null;
  let out = [];
  for (let i = e; ; i = seen[i]) {
    out.push(pts[i]);
    if (i === s) break;
  }
  out.reverse();
  out.unshift(start);
  if (free(goal.x, goal.y) && clearLine(out[out.length - 1], goal))
    out.push(goal);
  let smooth = [out[0]],
    i = 0;
  while (i < out.length - 1) {
    let j = out.length - 1;
    while (j > i + 1 && !clearLine(out[i], out[j])) j--;
    smooth.push(out[j]);
    i = j;
  }
  return smooth;
}
function target(b) {
  let p =
    b.x < 130
      ? { x: b.x + b.w + 18, y: b.y + b.h / 2 + 12 }
      : b.x > 580
        ? { x: b.x - 18, y: b.y + b.h / 2 + 12 }
        : { x: b.x + b.w / 2, y: b.y + b.h + 18 };
  if (free(p.x, p.y)) return p;
  let i = nearest(p, null);
  return i < 0 ? p : pts[i];
}
function marker(p) {
  $("destination").setAttribute("visibility", p ? "visible" : "hidden");
  if (p)
    $("destination").setAttribute(
      "transform",
      "translate(" + p.x + " " + p.y + ")",
    );
}
function stopTravel() {
  ++moving;
  traveling = false;
  marker(null);
}
function navigate(goal, onArrival) {
  resetControls();
  stopTravel();
  let route = routeTo({ ...pos }, goal);
  if (!route) {
    render();
    return;
  }
  if (reducedMotion.matches) {
    const end = route.at(-1);
    position(end.x, end.y);
    render();
    onArrival?.();
    return;
  }
  let token = moving;
  traveling = true;
  marker(route[route.length - 1]);
  render();
  let i = 1,
    last = 0;
  function finish() {
    traveling = false;
    marker(null);
    render();
    if (onArrival) onArrival();
  }
  function frame(now) {
    if (token !== moving) return;
    if (!last) last = now;
    let distance = Math.min(50, now - last) * 0.21;
    last = now;
    while (i < route.length) {
      let p = route[i],
        d = Math.hypot(p.x - pos.x, p.y - pos.y);
      if (d <= distance + 0.0001) {
        position(p.x, p.y);
        distance -= d;
        i++;
        continue;
      }
      if (distance > 0)
        position(
          pos.x + ((p.x - pos.x) * distance) / d,
          pos.y + ((p.y - pos.y) * distance) / d,
        );
      break;
    }
    if (i >= route.length) finish();
    else requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function select(b, animate) {
  selected = b;
  if (animate) {
    navigate(target(b), () => {
      if (selected === b) openTerminal(b);
    });
  } else render();
}
const dmap = {
    ArrowUp: "up",
    w: "up",
    ArrowDown: "down",
    s: "down",
    ArrowLeft: "left",
    a: "left",
    ArrowRight: "right",
    d: "right",
  },
  vectors = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] },
  held = new Set(),
  pointers = new Map();
function activeDirs() {
  return new Set([...held, ...pointers.values()]);
}
function startManual() {
  if (traveling) {
    stopTravel();
    render();
  }
  marker(null);
  scheduleManual();
}
function resetControls() {
  held.clear();
  pointers.clear();
  document
    .querySelectorAll(".dpad button")
    .forEach((b) => b.classList.remove("active"));
}
window.addEventListener("keydown", (e) => {
  if (
    $("standDialog").open ||
    $("award").open ||
    /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)
  )
    return;
  let d = dmap[e.key] || dmap[e.key.toLowerCase()];
  if (!d || e.ctrlKey || e.altKey || e.metaKey) return;
  e.preventDefault();
  held.add(d);
  if (!e.repeat) startManual();
});
window.addEventListener("keyup", (e) => {
  let d = dmap[e.key] || dmap[e.key.toLowerCase()];
  if (d) held.delete(d);
});
window.addEventListener("blur", resetControls);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resetControls();
    stopTravel();
    render();
  }
});
document.querySelectorAll(".dpad button").forEach((el) => {
  const up = (e) => {
    pointers.delete(e.pointerId);
    el.classList.remove("active");
  };
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el.setPointerCapture?.(e.pointerId);
    pointers.set(e.pointerId, el.dataset.dir);
    el.classList.add("active");
    startManual();
  });
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
  el.addEventListener("lostpointercapture", up);
});
let manualRequest = 0,
  manualTime = 0;
function scheduleManual() {
  if (!manualRequest) {
    manualTime = performance.now();
    manualRequest = requestAnimationFrame(manualFrame);
  }
}
function manualFrame(now) {
  manualRequest = 0;
  const dt = Math.min(40, now - manualTime);
  manualTime = now;
  const dirs = activeDirs();
  if (!dirs.size || $("standDialog").open || $("award").open) return;
  let dx = 0,
    dy = 0;
  for (const dir of dirs) {
    dx += vectors[dir][0];
    dy += vectors[dir][1];
  }
  const length = Math.hypot(dx, dy);
  if (length) {
    const x = pos.x + (dx / length) * dt * 0.19;
    const y = pos.y + (dy / length) * dt * 0.19;
    if (clearLine(pos, { x, y: pos.y })) position(x, pos.y);
    if (clearLine(pos, { x: pos.x, y })) position(pos.x, y);
  }
  manualRequest = requestAnimationFrame(manualFrame);
}
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    document.body.classList.toggle("map-offscreen", !entry.isIntersecting);
  }).observe($("viewport"));
}
const board = $("board");
const viewport = $("viewport");
let gesture;
viewport.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  gesture = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    left: viewport.scrollLeft,
    top: viewport.scrollTop,
    mouse: event.pointerType === "mouse",
    moved: false,
  };
});
viewport.addEventListener("pointermove", (event) => {
  if (
    !gesture ||
    event.pointerId !== gesture.id ||
    (gesture.mouse && !event.buttons)
  )
    return;
  const dx = event.clientX - gesture.x;
  const dy = event.clientY - gesture.y;
  if (Math.hypot(dx, dy) > 10) gesture.moved = true;
  if (gesture.moved && gesture.mouse) {
    if (!viewport.hasPointerCapture(event.pointerId))
      viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("panning");
    viewport.scrollLeft = gesture.left - dx;
    viewport.scrollTop = gesture.top - dy;
  }
});
for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
  viewport.addEventListener(type, () => viewport.classList.remove("panning"));
}
viewport.addEventListener(
  "click",
  (event) => {
    if (!event.detail || !gesture?.moved) return;
    event.stopPropagation();
    event.preventDefault();
  },
  true,
);
board.addEventListener("click", (event) => {
  if (event.target.closest(".booth")) return;
  const transform = board.getScreenCTM();
  if (!transform) return;
  const point = board.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const goal = point.matrixTransform(transform.inverse());
  if (!free(goal.x, goal.y)) return;
  selected = null;
  $("status").textContent = "EXPLORACIÓN LIBRE";
  $("selectedTitle").textContent = "En los pasillos del chip";
  $("selectedDesc").textContent =
    "Selecciona un stand o una medalla para abrir su terminal.";
  $("visit").disabled = true;
  navigate(goal);
});
function closeDialog(d) {
  if (typeof d.close === "function") d.close();
  else d.removeAttribute("open");
}
function showDialog(d) {
  resetControls();
  if (typeof d.showModal === "function") {
    if (!d.open) d.showModal();
  } else d.setAttribute("open", "");
}
let newestPower = null;
function grant(b) {
  newestPower = b.id;
  render();
  closeDialog($("standDialog"));
  $("awardIcon").innerHTML = medal(b);
  $("awardTitle").textContent =
    visited.size === 7 ? "¡Circuito completado!" : "¡Medalla desbloqueada!";
  $("awardText").textContent = b.name + " · " + visited.size + " de 7 medallas";
  showDialog($("award"));
}
function openTerminal(b) {
  selected = b;
  render();
  $("terminalTitle").textContent = $("selectedTitle").textContent;
  let body = $("terminalBody");
  if (live) {
    const paragraph = document.createElement("p");
    paragraph.textContent = $("selectedDesc").textContent;
    body.replaceChildren(paragraph);
  } else if (!b.goal) {
    body.innerHTML =
      "<p>Este espacio forma parte del evento. No otorga medalla en este circuito de demostración.</p>";
  } else if (visited.has(b.id)) {
    body.innerHTML =
      '<div class="medal-preview">' +
      medal(b) +
      '</div><div class="modal-tag">MEDALLA DESBLOQUEADA</div><p>Ya completaste esta estación. ¡Continúa explorando!</p>';
  } else if (!checkedIn.has(b.id)) {
    body.innerHTML =
      '<div class="modal-tag pending">PULSERA PENDIENTE</div><p>Para desbloquear la medalla debes haber registrado tu pulsera NFC en este stand.</p><p>Explora la experiencia; te sugerimos permanecer unos 3 minutos. No se mide el tiempo.</p><button id="fakeScan" class="primary">Simular registro de pulsera</button><p class="control-note">Simulación local. No se conecta a ningún lector NFC.</p>';
    $("fakeScan").onclick = () => {
      if (progress.validateVisit(b.id, name)) openTerminal(b);
    };
  } else {
    body.innerHTML =
      '<div class="modal-tag">✓ PULSERA REGISTRADA · DEMO</div><p>Completa esta encuesta de satisfacción para conseguir tu medalla.</p><form id="survey"><fieldset><legend>¿Cómo calificarías la experiencia?</legend><div class="ratings">' +
      [1, 2, 3, 4, 5]
        .map(
          (n) =>
            '<label><input type="radio" name="rating" value="' +
            n +
            '" required><span>' +
            n +
            " ★</span></label>",
        )
        .join("") +
      '</div><div class="control-note">1: poco satisfactoria · 5: excelente</div></fieldset><fieldset><legend>¿Te gustaría conocer más sobre esta propuesta?</legend><div class="choices">' +
      ["Sí", "Tal vez", "No por ahora"]
        .map(
          (t) =>
            '<label><input type="radio" name="interest" value="' +
            t +
            '" required><span>' +
            t +
            "</span></label>",
        )
        .join("") +
      '</div></fieldset><button class="primary" type="submit">Obtener mi medalla</button><p class="control-note">Respuestas de demostración, guardadas solo en este navegador.</p></form>';
    $("survey").onsubmit = (e) => {
      e.preventDefault();
      if (!checkedIn.has(b.id) || visited.has(b.id)) return;
      let data = new FormData(e.currentTarget);
      if (
        progress.submitSurvey(
          b.id,
          {
            rating: Number(data.get("rating")),
            interest: data.get("interest"),
          },
          name,
        )
      )
        grant(b);
    };
  }
  showDialog($("standDialog"));
}
$("closeTerminal").onclick = () => closeDialog($("standDialog"));
$("visit").addEventListener("click", () => {
  if (!selected || traveling) return;
  let b = selected,
    t = target(b);
  if (Math.hypot(pos.x - t.x, pos.y - t.y) < 10) openTerminal(b);
  else navigate(t, () => openTerminal(b));
});
function playPower() {
  if (!newestPower) return;
  const el = buildings.querySelector('[data-id="' + newestPower + '"]');
  newestPower = null;
  if (!el) return;
  el.classList.remove("justPowered");
  void el.getBoundingClientRect();
  el.classList.add("justPowered");
  setTimeout(() => el.classList.remove("justPowered"), 1800);
}
$("award").addEventListener("close", playPower);
$("closeAward").onclick = () => {
  if (typeof $("award").close === "function") $("award").close();
  else {
    $("award").removeAttribute("open");
    playPower();
  }
};
$("reset").onclick = () => {
  stopTravel();
  resetControls();
  newestPower = null;
  buildings
    .querySelectorAll(".justPowered")
    .forEach((el) => el.classList.remove("justPowered"));
  selected = null;
  name = live ? "Byte" : randomName();
  progress.reset(name);
  $("avatarName").textContent = name;
  position(360, 844);
  $("status").textContent = "SELECCIONA UN STAND";
  $("selectedTitle").textContent = "Explora el microchip";
  $("selectedDesc").textContent =
    "Toca cualquier edificio para ver su información.";
  $("visit").textContent = "Abrir terminal";
  $("visit").disabled = true;
  render();
};
function setZoom(z) {
  zoom = Math.max(1, Math.min(2.5, z));
  $("board").style.width = zoom * 100 + "%";
  $("fit").textContent = zoom.toFixed(1) + "×";
  $("minus").disabled = zoom === 1;
  $("plus").disabled = zoom === 2.5;
}
$("minus").onclick = () => setZoom(zoom - 0.25);
$("plus").onclick = () => setZoom(zoom + 0.25);
$("fit").onclick = () => setZoom(1);
$("avatarName").textContent = name;
position(360, 844);
setZoom(1);
if (live) {
  $("mode-label").textContent = "TÓTEM NFC";
  $("mode-footer").textContent =
    "Visitas confirmadas por el servidor local de CREDIA.";
  $("reset").textContent = "Terminar consulta";
  $("kiosk-status").hidden = false;
  progress.start(() => {
    closeDialog($("standDialog"));
    const pending = $("pending-stands");
    pending.hidden = !progress.ready;
    pending.open = false;
    $("pending-list").replaceChildren();
    for (const stand of progress.stands.filter((item) => !item.visited)) {
      const item = document.createElement("li");
      const booth = booths.find((b) => b.id === stand.map_id);
      if (booth) {
        const button = document.createElement("button");
        button.textContent = stand.name;
        button.addEventListener("click", () => select(booth, true));
        item.append(button);
      } else item.textContent = stand.name;
      $("pending-list").append(item);
    }
    if (progress.ready && !$("pending-list").children.length) {
      const item = document.createElement("li");
      item.textContent = "Visitaste todos los stands.";
      $("pending-list").append(item);
    }
    render();
  });
} else progress.persist(name);
render();
