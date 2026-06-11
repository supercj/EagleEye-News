import fs from 'fs';
const p = 'D:/work/Codex/EagleEye-News/src/popup.js';
let c = fs.readFileSync(p, 'utf8');

const openHandler = `    title.addEventListener("click", async (event) => {
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
    });`;

const bookmarkHandler = `    bookmarkButton.addEventListener("click", async () => {
      const response = await sendMessage({ type: "toggleBookmark", id: article.id });
      if (!response.ok) {
        return;
      }
      appState.bookmarks = response.bookmarks;
      renderArticles(false);
    });`;

if (c.includes(openHandler)) {
  c = c.replace(openHandler, '    title.dataset.action = "open";\n    title.dataset.article = JSON.stringify({ id: article.id, link: article.link });');
  console.log('replaced open handler');
} else {
  console.log('skip open handler');
}

if (c.includes(bookmarkHandler)) {
  c = c.replace(bookmarkHandler, '    bookmarkButton.dataset.action = "bookmark";\n    bookmarkButton.dataset.articleId = article.id;');
  console.log('replaced bookmark handler');
} else {
  console.log('skip bookmark handler');
}

fs.writeFileSync(p, c, 'utf8');
console.log('done');