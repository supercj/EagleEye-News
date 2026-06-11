import fs from 'fs';
const p = 'D:/work/Codex/EagleEye-News/src/popup.js';
let c = fs.readFileSync(p, 'utf8');
const importLine = 'import { sendMessage, formatRelativeTime, formatDateTime, tagLabel, getDomain } from "./utils.js";';
const idx = c.indexOf(importLine);
if (idx !== -1) {
  const next = c.indexOf(importLine, idx + importLine.length);
  if (next !== -1) {
    const end = next + importLine.length;
    while (end < c.length && (c[end] === '\n' || c[end] === '\r')) {
      c = c.slice(0, end) + c.slice(end + 1);
    }
    fs.writeFileSync(p, c, 'utf8');
    console.log('fixed duplicate import');
  } else {
    console.log('no duplicate import');
  }
} else {
  console.log('import not found');
}