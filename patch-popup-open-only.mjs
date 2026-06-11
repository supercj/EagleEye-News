import fs from 'fs';
const p = 'D:/work/Codex/EagleEye-News/src/popup.js';
let c = fs.readFileSync(p, 'utf8');

const candidates = [
  `    title.addEventListener("click", async (event) => {
      event.preventDefault();
      const response = await sendMessage({ type: "openArticle", article: { id: article.id, link: article.link } });
      if (!response.ok) return;
      appState.readIds = response.readIds;
      renderArticles(appState.settings?.hideRead ? true : false);
    });`,
  `    title.addEventListener("click", async (event) => {
      event.preventDefault();
      const response = await sendMessage({ type: "openArticle", article: { id: article.id, link: article.link } });
      if (!response.ok) {
        return;
      }
      appState.readIds = response.readIds;
      renderArticles(appState.settings?.hideRead ? true : false);
    });`,
  `    title.addEventListener("click", async (event) => {
      event.preventDefault();
      const response = await sendMessage({ type: "openArticle", article: { id: article.id, link: article.link } });
      if (!response.ok) {
        return;
      }
      appState.readIds = response.readIds;
      if (appState.settings?.hideRead) {
        renderArticles(true);
      } else {
        renderArticles(false);
      }
    });`
];

for (const [idx, candidate] of candidates.entries()) {
  if (c.includes(candidate)) {
    c = c.replace(candidate, '    title.dataset.action = "open";\n    title.dataset.article = JSON.stringify({ id: article.id, link: article.link });');
    fs.writeFileSync(p, c, 'utf8');
    console.log('replaced', idx);
    process.exit(0);
  }
}
console.log('no candidate matched');
console.log(c.slice(c.indexOf('title.addEventListener("click"'), c.indexOf('title.addEventListener("click"') + 420));