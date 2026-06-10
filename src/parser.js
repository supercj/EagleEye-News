function decodeHtml(value = "") {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    .trim();
}

function stripTags(value = "") {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }
  return "";
}

function normalizeDate(value) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Date.now() : timestamp;
}

export function makeArticleId(sourceId, link, title) {
  return `${sourceId}:${link || title}`.toLowerCase().replace(/\s+/g, "-");
}

export function parseRss(xmlText, source) {
  const chunks = xmlText.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/g) || [];
  return chunks.slice(0, source.limit || 20).map((chunk) => {
    const title = firstMatch(chunk, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
    const link = firstMatch(chunk, [
      /<link[^>]*href=["']([^"']+)["'][^>]*>/i,
      /<link[^>]*>([\s\S]*?)<\/link>/i,
      /<guid[^>]*>(https?:\/\/[\s\S]*?)<\/guid>/i
    ]);
    const published = firstMatch(chunk, [
      /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i,
      /<published[^>]*>([\s\S]*?)<\/published>/i,
      /<updated[^>]*>([\s\S]*?)<\/updated>/i
    ]);
    const summary = stripTags(firstMatch(chunk, [
      /<description[^>]*>([\s\S]*?)<\/description>/i,
      /<summary[^>]*>([\s\S]*?)<\/summary>/i,
      /<content[^>]*>([\s\S]*?)<\/content>/i
    ])).slice(0, 140);

    return {
      id: makeArticleId(source.id, link, title),
      title,
      link,
      summary,
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      publishedAt: normalizeDate(published),
      fetchedAt: Date.now()
    };
  }).filter((item) => item.title && item.link);
}

export function parseGithubTrending(htmlText, source) {
  const repoBlocks = htmlText.match(/<article[\s\S]*?<\/article>/g) || [];
  return repoBlocks.slice(0, source.limit || 20).map((block) => {
    const repoPath = firstMatch(block, [/<h2[\s\S]*?<a[^>]*href="([^"]+)"[\s\S]*?<\/a>/i]);
    const title = stripTags(firstMatch(block, [/<h2[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i]))
      .replace(/\s*\/\s*/g, " / ");
    const summary = stripTags(firstMatch(block, [/<p[^>]*>([\s\S]*?)<\/p>/i])).slice(0, 140);
    const link = repoPath ? `https://github.com${repoPath}` : "";
    return {
      id: makeArticleId(source.id, link, title),
      title,
      link,
      summary,
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      publishedAt: Date.now(),
      fetchedAt: Date.now()
    };
  }).filter((item) => item.title && item.link);
}

export function dedupeArticles(articles) {
  const seen = new Set();
  return articles.filter((article) => {
    const key = article.link || article.id;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  }).sort((a, b) => b.publishedAt - a.publishedAt);
}
