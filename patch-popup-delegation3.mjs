import fs from 'fs';
const p = 'D:/work/Codex/EagleEye-News/src/popup.js';
let c = fs.readFileSync(p, 'utf8');

const openStart = c.indexOf('title.addEventListener("click", async (event) => {');
const openEnd = c.indexOf('});', openStart);
if (openStart !== -1 && openEnd !== -1) {
  const openHandler = c.slice(openStart, openEnd + 3);
  c = c.replace(openHandler, 'title.dataset.action = "open";\n    title.dataset.article = JSON.stringify({ id: article.id, link: article.link });');
  console.log('replaced open handler');
} else {
  console.log('skip open handler');
}

const bmStart = c.indexOf('bookmarkButton.addEventListener("click", async () => {');
const bmEnd = c.indexOf('});', bmStart);
if (bmStart !== -1 && bmEnd !== -1) {
  const bmHandler = c.slice(bmStart, bmEnd + 3);
  c = c.replace(bmHandler, 'bookmarkButton.dataset.action = "bookmark";\n    bookmarkButton.dataset.articleId = article.id;');
  console.log('replaced bookmark handler');
} else {
  console.log('skip bookmark handler');
}

fs.writeFileSync(p, c, 'utf8');
console.log('done');