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

const delegate = `elements.articleList.addEventListener("click", async (event) => {
  const target = event.target;
  if (target.closest("[data-action='open']")) {
    event.preventDefault();
    const dataset = target.closest("[data-article]")?.dataset;
    if (!dataset?.article) return;
    const parsed = JSON.parse(dataset.article);
    const response = await sendMessage({ type: "openArticle", article: parsed });
    if (!response.ok) return;
    appState.readIds = response.readIds;
    if (appState.settings?.hideRead) {
      renderArticles(true);
    } else {
      renderArticles(false);
    }
    return;
  }
  const bookmarkBtn = target.closest("[data-action='bookmark']");
  if (bookmarkBtn) {
    const articleId = bookmarkBtn.dataset.articleId;
    if (!articleId) return;
    const response = await sendMessage({ type: "toggleBookmark", id: articleId });
    if (!response.ok) return;
    appState.bookmarks = response.bookmarks;
    renderArticles(false);
  }
});
`;

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

const anchor = 'elements.optionsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());';
if (c.includes(anchor) && !c.includes('elements.articleList.addEventListener("click", async (event)')) {
  c = c.replace(anchor, delegate + anchor);
  console.log('inserted delegate');
} else {
  console.log('skip delegate');
}

fs.writeFileSync(p, c, 'utf8');
console.log('done');