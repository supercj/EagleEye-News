import fs from 'fs';
const p = 'D:/work/Codex/EagleEye-News/src/popup.js';
let c = fs.readFileSync(p, 'utf8');
const importLine = 'import { sendMessage, formatRelativeTime, formatDateTime, tagLabel, getDomain } from "./utils.js";';
const occurrences = [];
let idx = c.indexOf(importLine);
while (idx !== -1) {
  occurrences.push(idx);
  idx = c.indexOf(importLine, idx + 1);
}
if (occurrences.length > 1) {
  const second = occurrences[1];
  const after = c.slice(second + importLine.length).replace(/^[\r\n]+/, '');
  c = c.slice(0, second) + after;
  fs.writeFileSync(p, c, 'utf8');
  console.log('removed duplicate import');
} else {
  console.log('no duplicate import');
}