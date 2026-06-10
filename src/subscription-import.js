function normalizeUrl(value) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function extractUrls(text) {
  const matches = text.match(/https?:\/\/[^\s<>"'`]+/g) || [];
  return [...new Set(matches.map(normalizeUrl).filter(Boolean))];
}

function parsePlainText(text) {
  return text
    .split(/[\r\n,;]+/)
    .map((line) => line.trim())
    .flatMap((line) => {
      const url = normalizeUrl(line);
      return url ? [url] : extractUrls(line);
    });
}

function parseOpml(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const outlineNodes = [...doc.querySelectorAll("outline[xmlUrl], outline[htmlUrl]")];
  return outlineNodes.map((node) => {
    const url = normalizeUrl(node.getAttribute("xmlUrl") || node.getAttribute("htmlUrl") || "");
    return url
      ? {
          url,
          name: node.getAttribute("text") || node.getAttribute("title") || "",
          homepage: normalizeUrl(node.getAttribute("htmlUrl") || "") || ""
        }
      : null;
  }).filter(Boolean);
}

function parseJson(text) {
  const data = JSON.parse(text);
  if (Array.isArray(data)) {
    return data.flatMap((item) => {
      if (typeof item === "string") {
        const url = normalizeUrl(item);
        return url ? [{ url }] : [];
      }
      if (item && typeof item === "object") {
        const url = normalizeUrl(item.url || item.feedUrl || item.subscriptionUrl || "");
        return url ? [{
          url,
          name: item.name || item.title || "",
          homepage: normalizeUrl(item.homepage || item.homePageUrl || item.siteUrl || "") || ""
        }] : [];
      }
      return [];
    });
  }

  if (data && typeof data === "object") {
    const feeds = Array.isArray(data.feeds) ? data.feeds : [];
    return feeds.flatMap((item) => {
      const url = normalizeUrl(item.url || item.feedUrl || item.subscriptionUrl || "");
      return url ? [{
        url,
        name: item.name || item.title || "",
        homepage: normalizeUrl(item.homepage || item.homePageUrl || item.siteUrl || "") || ""
      }] : [];
    });
  }

  return [];
}

export function parseSubscriptionInput(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("<")) {
    try {
      const opmlFeeds = parseOpml(trimmed);
      if (opmlFeeds.length) {
        return opmlFeeds;
      }
    } catch {
      // Fall through to plain-text parsing.
    }
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const jsonFeeds = parseJson(trimmed);
      if (jsonFeeds.length) {
        return jsonFeeds;
      }
    } catch {
      // Fall through to plain-text parsing.
    }
  }

  return parsePlainText(trimmed).map((url) => ({ url }));
}
