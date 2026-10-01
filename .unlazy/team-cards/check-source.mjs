import { readFileSync } from "node:fs";
const s = readFileSync("src/pages/home/Team.jsx", "utf8");
const fails = [];
if (s.includes("aspect-[4/3]")) fails.push("old 4:3 frame still present");
const frame = s.match(/className="relative ([^"]*)overflow-hidden rounded-2xl[^"]*"/);
if (!frame) fails.push("photo frame not found");
else if (!/\b(aspect-square|size-\d+)/.test(frame[0])) fails.push("frame not square: " + frame[0]);
if ((s.match(/founder\.(duo|src)\b/g) || []).length < 2) fails.push("duo/src images missing");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("team-source-ok");
