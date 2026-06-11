import fs from 'fs';
const p = 'D:/work/Codex/EagleEye-News/src/popup.js';
let c = fs.readFileSync(p, 'utf8');

function removeBetween(anchorA, anchorB) {
  const i = c.indexOf(anchorA);
  const j = c.indexOf(anchorB, i);
  if (i === -1 || j === -1) return false;
  c = c.slice(0, i + anchorA.length) + c.slice(j + anchorB.length);
  return true;
}

if (removeBetween('title.dataset.article = JSON.stringify({ id: article.id, link: article.link });', '    });')) {
  console.log('removed open residual');
} else {
  console.log('skip open residual');
}

if (removeBetween('bookmarkButton.dataset.articleId = article.id;', '    });')) {
  console.log('removed bookmark residual');
} else {
  console.log('skip bookmark residual');
}

fs.writeFileSync(p, c, 'utf8');
console.log('done');