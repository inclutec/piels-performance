import fs from "fs";
import path from "path";

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

const grouped = {};
for (const r of results) {
  if (!grouped[r.url]) grouped[r.url] = [];
  grouped[r.url].push(r);
}

console.log("\nLighthouse Metrics Summary");
console.log("=".repeat(100));
for (const [url, runs] of Object.entries(grouped)) {
  console.log(`\n${url}`);
  console.log("-".repeat(url.length));

  for (const metric of METRICS) {
    const vals = runs.map((r) => r[metric]);
    const mean = avg(vals);
    const formattedMean = formatMetric(metric, mean);
    console.log(
      `  ${metric.padEnd(28)} avg: ${formattedMean}  runs: ${vals
        .map((v) => formatMetric(metric, v))
        .join(", ")}`
    );
  }
}

console.log("\n" + "=".repeat(100));
console.log(`Processed ${files.length} reports from ${folder}\n`);
