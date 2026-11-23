"use strict";

const SVG = "http://www.w3.org/2000/svg";
const nodes = [
  { id: 0, x: 80, y: 88 }, { id: 1, x: 230, y: 88 }, { id: 2, x: 380, y: 88 },
  { id: 3, x: 80, y: 204 }, { id: 4, x: 230, y: 204 }, { id: 5, x: 380, y: 204 },
];
const edges = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]];
const PENALTY = 2;
let chosen = new Set([1, 3, 5]);

const $ = id => document.getElementById(id);
function make(tag, attributes, parent) {
  const element = document.createElementNS(SVG, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  if (parent) parent.append(element);
  return element;
}

const cables = edges.map(([a, b]) => make("line", { x1: nodes[a].x, y1: nodes[a].y, x2: nodes[b].x, y2: nodes[b].y }, $("edgesLayer")));

const stations = nodes.map(({ id, x, y }) => {
  const g = make("g", { class: "station", tabindex: "0", role: "button" }, $("nodesLayer"));
  make("rect", { class: "hit", x: x - 52, y: y - 62, width: 104, height: 112, rx: 14 }, g);
  make("use", { href: "#station-art", x: x - 48, y: y - 62, width: 96, height: 96 }, g);
  make("circle", { class: "pill", cx: x, cy: y + 35, r: 11 }, g);
  make("text", { class: "num", x, y: y + 39.5, "text-anchor": "middle" }, g).textContent = id;
  const sensor = make("g", { class: "sensor" }, g);
  make("path", { d: `M${x} ${y - 26}v-18`, stroke: "#154c37", "stroke-width": 3, "stroke-linecap": "round" }, sensor);
  make("circle", { cx: x, cy: y - 56, r: 14, fill: "#2fe6c8", stroke: "#154c37", "stroke-width": 2.5 }, sensor);
  make("use", { href: "#bolt", x: x - 8.5, y: y - 64.5, width: 17, height: 17, color: "#154c37" }, sensor);
  const toggle = () => { chosen.has(id) ? chosen.delete(id) : chosen.add(id); render(); };
  g.addEventListener("click", toggle);
  g.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); }
  });
  return g;
});

const presets = [...document.querySelectorAll("[data-preset]")];
const key = list => [...list].sort((a, b) => a - b).join(",");
for (const button of presets) button.addEventListener("click", () => {
  chosen = new Set(button.dataset.preset ? button.dataset.preset.split(",").map(Number) : []);
  render();
});

// Arabic counting: one, two, 3 to 10.
const blindLines = n => n === 1 ? "خط واحد غير مراقَب" : n === 2 ? "خطان غير مراقَبين" : `${n} خطوط غير مراقَبة`;

function render() {
  let blind = 0;
  edges.forEach(([a, b], i) => {
    const watched = chosen.has(a) || chosen.has(b);
    if (!watched) blind++;
    cables[i].setAttribute("class", watched ? "cable ok" : "cable bad");
  });
  stations.forEach((g, id) => {
    const on = chosen.has(id);
    g.classList.toggle("on", on);
    g.setAttribute("aria-pressed", on);
    g.setAttribute("aria-label", `محطة ${id}، ${on ? "عليها حساس" : "بدون حساس"}`);
  });

  const sensors = chosen.size, cost = sensors + PENALTY * blind;
  $("kpiSensors").textContent = `${sensors} / 6`;
  $("kpiUncovered").textContent = `${blind} / 7`;
  $("kpiCost").textContent = cost.toFixed(1);
  $("kpiBitstring").textContent = `(${nodes.map(({ id }) => chosen.has(id) ? 1 : 0).join(",")})`;
  for (const button of presets) button.setAttribute("aria-pressed", button.dataset.preset === key(chosen));

  const box = $("statusBox");
  box.className = blind ? "status bad" : "status ok";
  box.textContent = blind
    ? `⚠️ يوجد ${blindLines(blind)} (بالبرتقالي المتقطع)، ويضيف كل خط منها عقوبة ${PENALTY} على التكلفة.`
    : sensors === 3
      ? "🎉 غطاء رأسي مثالي: كل الخطوط السبعة مراقَبة بـ 3 حساسات فقط، والتكلفة (3.0) هي الأقل الممكنة."
      : "✅ جميع الخطوط السبعة مراقَبة، لكن يمكن تقليل العدد إلى 3 حساسات فقط (بتكلفة 3.0).";
}

render();
