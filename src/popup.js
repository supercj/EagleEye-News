import { CATEGORIES } from "./sources.js";

let appState = null;
let sources = [];

const elements = {
  refreshMeta: document.querySelector("#refreshMeta"),
  refreshButton: document.querySelector("#refreshButton"),
  optionsButton: document.querySelector("#optionsButton"),
  openOptionsButton: document.querySelector("#openOptionsButton"),
  openImportButton: document.querySelector("#openImportButton"),
  onboardingPanel: document.querySelector("#onboardingPanel"),
  latestViewButton: document.querySelector("#latestViewButton"),
  bookmarksViewButton: document.querySelector("#bookmarksViewButton"),
  categoryTabs: document.querySelector("#categoryTabs"),
  keywordInput: document.querySelector("#keywordInput"),
  hideReadInput: document.querySelector("#hideReadInput"),
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

function categoryLabel(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)?.label || categoryId;
}

function getVisibleArticles() {
  const { articles, settings, readIds } = appState;
  const keyword = (settings.keyword || "").trim().toLowerCase();

  return articles.filter((article) => {
    if (settings.viewMode === "bookmarks" && !appState.bookmarks[article.id]) {
      return false;
    }
    if (settings.activeCategory !== "all" && article.category !== settings.activeCategory) {
      return false;
    }
    if (settings.hideRead && readIds[article.id]) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [article.title, article.summary, article.sourceName]
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

function renderTabs() {
  elements.categoryTabs.innerHTML = "";
  CATEGORIES.forEach((category) => {
    const button = document.createElement("button");
    button.className = `tab ${appState.settings.activeCategory === category.id ? "active" : ""}`;
    button.textContent = category.label;
    button.addEventListener("click", () => saveSettingsPatch({ activeCategory: category.id }));
    elements.categoryTabs.append(button);
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
    const card = document.createElement("article");
    card.className = `article-card ${isRead ? "read" : ""}`;

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
    summary.textContent = article.summary || "无摘要";

    const meta = document.createElement("div");
    meta.className = "article-meta";
    const info = document.createElement("span");
    info.textContent = `${article.sourceName} · ${categoryLabel(article.category)} · ${formatRelativeTime(article.publishedAt)}`;

    const actions = document.createElement("div");
    actions.className = "article-actions";

    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = `text-button ${isBookmarked ? "active" : ""}`;
    bookmarkButton.textContent = isBookmarked ? "已藏" : "收藏";
    bookmarkButton.addEventListener("click", async () => {
      const response = await sendMessage({ type: "toggleBookmark", id: article.id });
      if (!response.ok) {
        return;
      }
      appState.bookmarks = response.bookmarks;
      renderArticles();
    });

    actions.append(bookmarkButton);
    meta.append(info, actions);
    card.append(title, summary, meta);
    elements.articleList.append(card);
  });
}

function render() {
  elements.refreshMeta.textContent = `上次刷新：${formatRelativeTime(appState.lastRefreshAt)}`;
  elements.latestViewButton.classList.toggle("active", appState.settings.viewMode !== "bookmarks");
  elements.bookmarksViewButton.classList.toggle("active", appState.settings.viewMode === "bookmarks");
  elements.keywordInput.value = appState.settings.keyword || "";
  elements.hideReadInput.checked = Boolean(appState.settings.hideRead);
  elements.onboardingPanel.hidden = Boolean(appState.settings.onboardingComplete);
  renderTabs();
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
elements.optionsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());
elements.openOptionsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());
elements.openImportButton.addEventListener("click", () => chrome.runtime.openOptionsPage());
elements.latestViewButton.addEventListener("click", () => saveSettingsPatch({ viewMode: "latest" }));
elements.bookmarksViewButton.addEventListener("click", () => saveSettingsPatch({ viewMode: "bookmarks" }));
elements.keywordInput.addEventListener("input", (event) => {
  saveSettingsPatch({ keyword: event.target.value });
});
elements.hideReadInput.addEventListener("change", (event) => {
  saveSettingsPatch({ hideRead: event.target.checked });
});

init();
