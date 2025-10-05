import fs from "fs";
import path from "path";
import process from "process";

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function colorScore(score) {
  if (score >= 0.9) return colors.green + (score * 100).toFixed(0) + "%" + colors.reset;
  if (score >= 0.7) return colors.yellow + (score * 100).toFixed(0) + "%" + colors.reset;
  return colors.red + (score * 100).toFixed(0) + "%" + colors.reset;
}

function bar(score, length = 20) {
  const full = Math.round(score * length);
  const empty = length - full;
  const fullBar = "█".repeat(full);
  const emptyBar = "░".repeat(empty);
  let color = colors.green;
  if (score < 0.9) color = colors.yellow;
  if (score < 0.7) color = colors.red;
  return color + fullBar + colors.reset + emptyBar;
}

const METRICS = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
];

function findReports(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? findReports(res) : res.endsWith(".html") ? [res] : [];
    });
}

function extractMetrics(html) {
  const metrics = {};
  for (const id of METRICS) {
    const regex = new RegExp(`"${id}".*?"numericValue":(\\d+\\.?\\d*)`, "s");
    const match = html.match(regex);
    metrics[id] = match ? parseFloat(match[1]) : null;
  }
  return metrics;
}

function avg(values) {
  const nums = values.filter((v) => typeof v === "number");
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
}

function formatMetric(id, value) {
  if (value === null) return "—";
  if (id === "cumulative-layout-shift") return value.toFixed(3);
  return `${(value / 1000).toFixed(2)} s`;
}

const manifestPath = path.resolve("reports/lhci/manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error(colors.red + "manifest.json not found" + colors.reset);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const groupedManifest = {};
for (const entry of manifest) {
  const url = entry.url;
  const summary = entry.summary || {};
  if (!groupedManifest[url]) groupedManifest[url] = [];
  groupedManifest[url].push(summary);
}

const folder = "./reports";
const files = findReports(folder);
const results = [];
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const data = extractMetrics(html);
  const urlMatch = html.match(/"finalUrl":"([^"]+)"/);
  const url = urlMatch ? urlMatch[1] : path.basename(file);
  results.push({ url, ...data });
}
const groupedHtml = {};
for (const r of results) {
  if (!groupedHtml[r.url]) groupedHtml[r.url] = [];
  groupedHtml[r.url].push(r);
}

const banner = `
▗▄▄▖▗▄▄▄▖▗▄▄▄▖▗▖    ▗▄▄▖
▐▌ ▐▌ █  ▐▌   ▐▌   ▐▌   
▐▛▀▘  █  ▐▛▀▀▘▐▌    ▝▀▚▖
▐▌  ▗▄█▄▖▐▙▄▄▖▐▙▄▄▖▗▄▄▞▘
▗▄▄▖ ▗▄▄▄▖▗▄▄▖ ▗▄▄▄▖ ▗▄▖ ▗▄▄▖ ▗▖  ▗▖ ▗▄▖ ▗▖  ▗▖ ▗▄▄▖▗▄▄▄▖
▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌▐▛▚▞▜▌▐▌ ▐▌▐▛▚▖▐▌▐▌   ▐▌   
▐▛▀▘ ▐▛▀▀▘▐▛▀▚▖▐▛▀▀▘▐▌ ▐▌▐▛▀▚▖▐▌  ▐▌▐▛▀▜▌▐▌ ▝▜▌▐▌   ▐▛▀▀▘
▐▌   ▐▙▄▄▖▐▌ ▐▌▐▌   ▝▚▄▞▘▐▌ ▐▌▐▌  ▐▌▐▌ ▐▌▐▌  ▐▌▝▚▄▄▖▐▙▄▄▖
`;
console.log(colors.cyan + banner + colors.reset);
console.log(colors.bold + "\nLighthouse Combined Report\n" + colors.reset);
console.log("=".repeat(100));

for (const [url, runs] of Object.entries(groupedManifest)) {
  console.log("\n" + colors.bold + url + colors.reset);
  console.log("-".repeat(url.length));

  const metrics = [...new Set(runs.flatMap(r => Object.keys(r)))];
  for (const metric of metrics) {
    const values = runs.map(r => r[metric]).filter(v => typeof v === "number");
    if (values.length === 0) continue;
    const avgVal = avg(values);
    const avgBar = bar(avgVal, 30);
    console.log(`  ${metric.padEnd(18)} ${avgBar}  ${colorScore(avgVal)} ${colors.bold}(avg)${colors.reset}`);
  }

  if (groupedHtml[url]) {
    console.log("\n" + colors.cyan + "  Detailed Metrics:" + colors.reset);
    for (const metric of METRICS) {
      const vals = groupedHtml[url].map(r => r[metric]);
      const mean = avg(vals);
      const formattedMean = formatMetric(metric, mean);
      console.log(`    ${metric.padEnd(28)} avg: ${formattedMean}  runs: ${vals.map(v => formatMetric(metric, v)).join(", ")}`);
    }
  }

  console.log("=".repeat(100));
}

console.log(colors.cyan + "\nCombined manifest + HTML metrics processed successfully.\n" + colors.reset);
