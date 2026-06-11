import fs from 'fs';
const p = 'D:/work/Codex/EagleEye-News/src/popup.js';
let c = fs.readFileSync(p, 'utf8');

const openStart = c.indexOf('title.dataset.action = "open";\n    title.dataset.article = JSON.stringify({ id: article.id, link: article.link });');
const removeOpen = `      if (!response.ok) {
        return;
      }
      appState.readIds = response.readIds;
      if (appState.settings?.hideRead) {
        renderArticles(true);
      } else {
        renderArticles(false);
      }
    });`;

const bmStart = c.indexOf('bookmarkButton.dataset.action = "bookmark";\n    bookmarkButton.dataset.articleId = article.id;');
const removeBm = `      if (!response.ok) {
        return;
      }
      appState.bookmarks = response.bookmarks;
      renderArticles(false);
    });`;

if (openStart !== -1 && c.includes(removeOpen, openStart)) {
  c = c.replace(removeOpen, '');
  console.log('removed open residual');
} else {
  console.log('skip open residual');
}

if (bmStart !== -1 && c.includes(removeBm, bmStart)) {
  c = c.replace(removeBm, '');
  console.log('removed bookmark residual');
} else {
  console.log('skip bookmark residual');
}

fs.writeFileSync(p, c, 'utf8');
console.log('done');