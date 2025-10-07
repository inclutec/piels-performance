import fs from "fs";
import path from "path";
import process from "process";

// colores
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

/**
 * lee manifest, verifica si no existe 
 */
const manifestPath = path.resolve("reports/lhci/manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error(colors.red + "manifest.json not found" + manifestPath + colors.reset);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));


/**
 * group de todos los urls
 */
const grouped = {};
for (const entry of manifest) {
  const url = entry.url;
  const summary = entry.summary || {};
  if (!grouped[url]) grouped[url] = [];
  grouped[url].push(summary);
}

// comienzo
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
console.log("\n" + colors.cyan + colors.bold + "Lighthouse Result Report" + colors.reset);
console.log("=".repeat(90));


/**
 * Resultados
 */
for (const [url, runs] of Object.entries(grouped)) {
  console.log("\n" + colors.bold + url + colors.reset);
  console.log("-".repeat(url.length));
  
  const metrics = [...new Set(runs.flatMap(r => Object.keys(r)))];

  for (const metric of metrics) {
    const values = runs.map(r => r[metric]).filter(v => typeof v === "number");

    if (values.length === 0) continue;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    // promedio
    const avgBar = bar(avg, 30);
    console.log(`  ${metric.padEnd(16)} ${avgBar}  ${colorScore(avg)}  ${colors.bold}(avg)${colors.reset}`);

    // todas
    values.forEach((v, i) => {
      const runBar = bar(v, 30);
      console.log(`    Run ${String(i + 1).padEnd(2)} → ${runBar}  ${colorScore(v)}`);
    });

    console.log(); 
  }

  console.log("=".repeat(90));
}

