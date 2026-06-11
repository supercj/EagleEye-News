import { SOURCE_TAGS } from "./sources.js";

let appState = null;
let sources = [];
let searchOpen = false;

let keywordTimer = null;

const elements = {
  refreshMeta: document.querySelector("#refreshMeta"),
  searchButton: document.querySelector("#searchButton"),
  refreshButton: document.querySelector("#refreshButton"),
  optionsButton: document.querySelector("#optionsButton"),
  openOptionsButton: document.querySelector("#openOptionsButton"),
  openImportButton: document.querySelector("#openImportButton"),
  onboardingPanel: document.querySelector("#onboardingPanel"),
  latestViewButton: document.querySelector("#latestViewButton"),
  bookmarksViewButton: document.querySelector("#bookmarksViewButton"),
  sourceTabs: document.querySelector("#sourceTabs"),
  searchOverlay: document.querySelector("#searchOverlay"),
  keywordInput: document.querySelector("#keywordInput"),
  statusPanel: document.querySelector("#statusPanel"),
  articleList: document.querySelector("#articleList"),
  emptyState: document.querySelector("#emptyState")
};

function sendMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return "尚未刷新";
  }
  const diff = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) {
    return `${minutes} 分钟前`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} 小时前`;
  }
  return new Date(timestamp).toLocaleDateString("zh-CN");
}

function formatDateTime(timestamp) {
  if (!timestamp) {
    return "";
  }
  return new Date(timestamp).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function tagLabel(tagId) {
  return SOURCE_TAGS.find((tag) => tag.id === tagId)?.label || tagId || "综合";
}

function getSource(sourceId) {
  return sources.find((source) => source.id === sourceId);
}

function getArticleTag(article) {
  const source = getSource(article.sourceId);
  return article.tag || article.category || source?.tag || source?.category || "general";
}

function getDomain(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getSourceFilters() {
  const enabled = new Set(appState.settings.enabledSourceIds || []);
  const sourceIdsWithArticles = new Set((appState.articles || []).map((article) => article.sourceId));
  return sources
    .filter((source) => enabled.has(source.id) || sourceIdsWithArticles.has(source.id))
    .sort((a, b) => {
      const tagA = SOURCE_TAGS.findIndex((tag) => tag.id === (a.tag || a.category));
      const tagB = SOURCE_TAGS.findIndex((tag) => tag.id === (b.tag || b.category));
      const rankA = Number(a.rank) || 999;
      const rankB = Number(b.rank) || 999;
      return tagA - tagB || rankA - rankB || a.name.localeCompare(b.name);
    });
}

function getVisibleArticles() {
  const { articles, settings, readIds } = appState;
  const keyword = (settings.keyword || "").trim().toLowerCase();
  const activeSourceId = settings.activeSourceId || "all";

  return articles.filter((article) => {
    if (settings.viewMode === "bookmarks" && !appState.bookmarks[article.id]) {
      return false;
    }
    if (activeSourceId !== "all" && article.sourceId !== activeSourceId) {
      return false;
    }
    if (settings.hideRead && readIds[article.id]) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [article.title, article.summary, article.sourceName, tagLabel(getArticleTag(article)), getDomain(article.link)]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword));
  });
}

async function saveSettingsPatch(patch) {
  const settings = { ...appState.settings, ...patch, onboardingComplete: true };
  const response = await sendMessage({ type: "saveSettings", settings });
  if (!response.ok) {
    return;
  }
  appState = response.state;
  sources = response.sources;
  render();
}

function renderSourceTabs() {
  const activeSourceId = appState.settings.activeSourceId || "all";
  elements.sourceTabs.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.className = `source-tab ${activeSourceId === "all" ? "active" : ""}`;
  allButton.type = "button";
  allButton.textContent = "全部";
  allButton.addEventListener("click", () => saveSettingsPatch({ activeSourceId: "all" }));
  elements.sourceTabs.append(allButton);

  getSourceFilters().forEach((source) => {
    const button = document.createElement("button");
    button.className = `source-tab ${activeSourceId === source.id ? "active" : ""}`;
    button.type = "button";
    button.textContent = source.name;
    button.title = `${source.name} · ${tagLabel(source.tag || source.category)}`;
    button.addEventListener("click", () => saveSettingsPatch({ activeSourceId: source.id }));
    elements.sourceTabs.append(button);
  });

  centerActiveSourceTab();
}

function centerActiveSourceTab() {
  requestAnimationFrame(() => {
    const activeTab = elements.sourceTabs.querySelector(".source-tab.active");
    activeTab?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  });
}

function renderStatus() {
  const failures = Object.entries(appState.sourceStatus || {})
    .filter(([, status]) => !status.ok)
    .map(([sourceId, status]) => {
      const source = sources.find((item) => item.id === sourceId);
      return `${source?.name || sourceId}: ${status.error}`;
    });
  elements.statusPanel.hidden = failures.length === 0;
  elements.statusPanel.textContent = failures.length ? failures.join("；") : "";
}

function renderArticles() {
  const visibleArticles = getVisibleArticles();
  elements.articleList.innerHTML = "";
  elements.emptyState.hidden = visibleArticles.length > 0;

  visibleArticles.forEach((article) => {
    const isBookmarked = Boolean(appState.bookmarks[article.id]);
    const isRead = Boolean(appState.readIds[article.id]);
    const articleTag = getArticleTag(article);
    const domain = getDomain(article.link);
    const card = document.createElement("article");
    card.className = `article-card ${isRead ? "read" : ""}`;

    const sourceRow = document.createElement("div");
    sourceRow.className = "article-source-row";

    const sourceName = document.createElement("span");
    sourceName.className = "source-badge";
    sourceName.textContent = article.sourceName || getSource(article.sourceId)?.name || "未知来源";

    const tag = document.createElement("span");
    tag.className = "tag-badge";
    tag.textContent = tagLabel(articleTag);

    const time = document.createElement("span");
    time.className = "article-time";
    time.textContent = formatRelativeTime(article.publishedAt);
    time.title = formatDateTime(article.publishedAt);

    sourceRow.append(sourceName, tag, time);

    const title = document.createElement("a");
    title.className = "article-title";
    title.href = article.link;
    title.target = "_blank";
    title.rel = "noreferrer";
    title.textContent = article.title;
    title.addEventListener("click", async (event) => {
      event.preventDefault();
      const response = await sendMessage({ type: "openArticle", article: { id: article.id, link: article.link } });
      if (!response.ok) {
        return;
      }
      appState.readIds = response.readIds;
      renderArticles();
    });

    const summary = document.createElement("p");
    summary.className = "article-summary";
    summary.textContent = article.summary || "暂无摘要";

    const meta = document.createElement("div");
    meta.className = "article-meta";

    const detail = document.createElement("span");
    detail.className = "article-detail";
    detail.textContent = [
      domain,
      article.fetchedAt ? `抓取 ${formatRelativeTime(article.fetchedAt)}` : ""
    ].filter(Boolean).join(" · ");

    const actions = document.createElement("div");
    actions.className = "article-actions";

    const readState = document.createElement("span");
    readState.className = `read-state ${isRead ? "read" : ""}`;
    readState.textContent = isRead ? "已读" : "未读";

    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = `text-button ${isBookmarked ? "active" : ""}`;
    bookmarkButton.textContent = isBookmarked ? "已收藏" : "收藏";
    bookmarkButton.addEventListener("click", async () => {
      const response = await sendMessage({ type: "toggleBookmark", id: article.id });
      if (!response.ok) {
        return;
      }
      appState.bookmarks = response.bookmarks;
      renderArticles();
    });

    actions.append(readState, bookmarkButton);
    meta.append(detail, actions);
    card.append(sourceRow, title, summary, meta);
    elements.articleList.append(card);
  });
}

function render() {
  elements.refreshMeta.textContent = `上次刷新：${formatRelativeTime(appState.lastRefreshAt)}`;
  elements.latestViewButton.classList.toggle("active", appState.settings.viewMode !== "bookmarks");
  elements.bookmarksViewButton.classList.toggle("active", appState.settings.viewMode === "bookmarks");
  elements.keywordInput.value = appState.settings.keyword || "";
  elements.searchOverlay.hidden = !searchOpen;
  elements.searchButton.classList.toggle("active", searchOpen || Boolean((appState.settings.keyword || "").trim()));
  elements.onboardingPanel.hidden = Boolean(appState.settings.onboardingComplete);
  renderSourceTabs();
  renderStatus();
  renderArticles();
}

async function refresh() {
  elements.refreshButton.disabled = true;
  elements.refreshButton.textContent = "刷新中";
  const response = await sendMessage({ type: "refresh" });
  elements.refreshButton.disabled = false;
  elements.refreshButton.textContent = "刷新";
  if (response.ok) {
    appState = response.state;
    sources = response.sources;
    render();
    return;
  }
  elements.statusPanel.hidden = false;
  elements.statusPanel.textContent = response.error || "刷新失败";
}

async function init() {
  const response = await sendMessage({ type: "getState" });
  if (!response.ok) {
    return;
  }
  appState = response.state;
  sources = response.sources;
  render();
}

elements.refreshButton.addEventListener("click", refresh);
elements.searchButton.addEventListener("click", () => {
  searchOpen = elements.searchOverlay.hidden;
  render();
  if (searchOpen) {
    elements.keywordInput.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!searchOpen) {
    return;
  }
  if (elements.searchOverlay.contains(event.target) || elements.searchButton.contains(event.target)) {
    return;
  }
  searchOpen = false;
  render();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !searchOpen) {
    return;
  }
  searchOpen = false;
  render();
  elements.searchButton.focus();
});
elements.optionsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());
elements.openOptionsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());
elements.openImportButton.addEventListener("click", () => chrome.runtime.openOptionsPage());
elements.latestViewButton.addEventListener("click", () => saveSettingsPatch({ viewMode: "latest" }));
elements.bookmarksViewButton.addEventListener("click", () => saveSettingsPatch({ viewMode: "bookmarks" }));
elements.sourceTabs.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
    return;
  }
  event.preventDefault();
  elements.sourceTabs.scrollLeft += event.deltaY;
}, { passive: false });
elements.keywordInput.addEventListener("input", (event) => {
  clearTimeout(keywordTimer);
  keywordTimer = setTimeout(() => saveSettingsPatch({ keyword: event.target.value }), 300);
});

init();
