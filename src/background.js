import { getAllSources, getDefaultSettings, normalizeCustomSource, stableSourceId } from "./sources.js";
import { STORAGE_KEYS, getStoredState, markRead, saveArticles, saveCustomSources, saveSettings, toggleMapItem } from "./storage.js";
import { dedupeArticles, makeArticleId, parseFeedMetadata, parseGithubTrending, parseJsonFeed, parseRss } from "./parser.js";

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/rss+xml, application/atom+xml, text/xml, text/html, application/json;q=0.9, */*;q=0.8"
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
}

async function fetchHackerNews(source) {
  const topResponse = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  if (!topResponse.ok) {
    throw new Error(`HTTP ${topResponse.status}`);
  }

  const storyIds = (await topResponse.json()).slice(0, source.limit || 20);
  const stories = await Promise.all(storyIds.map(async (storyId) => {
    const itemResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    if (!itemResponse.ok) {
      return null;
    }

    const item = await itemResponse.json();
    const link = item.url || `https://news.ycombinator.com/item?id=${item.id}`;
    return {
      id: makeArticleId(source.id, link, item.title),
      title: item.title,
      link,
      summary: `${item.score || 0} points · ${item.descendants || 0} comments`,
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      publishedAt: item.time ? item.time * 1000 : Date.now(),
      fetchedAt: Date.now()
    };
  }));
  return stories.filter(Boolean);
}

async function fetchSource(source) {
  if (source.type === "hackernews") {
    return fetchHackerNews(source);
  }

  const text = await fetchText(source.url);
  if (source.type === "githubTrending") {
    return parseGithubTrending(text, source);
  }
  if (source.type === "jsonfeed") {
    return parseJsonFeed(text, source);
  }
  return parseRss(text, source);
}

async function refreshAllSources() {
  const state = await getStoredState();
  const settings = state.settings || getDefaultSettings();
  const enabled = new Set(settings.enabledSourceIds || []);
  const sources = getAllSources(state.customSources);
  const activeSources = enabled.size ? sources.filter((source) => enabled.has(source.id)) : [];
  const sourceStatus = {};

  const resultSets = await Promise.allSettled(
    activeSources.map(async (source) => {
      const articles = await fetchSource(source);
      sourceStatus[source.id] = {
        ok: true,
        count: articles.length,
        checkedAt: Date.now()
      };
      return articles;
    })
  );

  const articles = [];
  resultSets.forEach((result, index) => {
    const source = activeSources[index];
    if (result.status === "fulfilled") {
      articles.push(...result.value);
      return;
    }
    sourceStatus[source.id] = {
      ok: false,
      error: result.reason?.message || "Fetch failed",
      checkedAt: Date.now()
    };
  });

  const deduped = dedupeArticles(articles).slice(0, 200);
  await saveArticles(deduped, sourceStatus);
  return getStoredState();
}

async function configureAlarm() {
  const { settings } = await getStoredState();
  await chrome.alarms.clear("refreshFeeds");
  chrome.alarms.create("refreshFeeds", {
    periodInMinutes: Math.max(15, Number(settings.refreshMinutes) || 60)
  });
}

async function importCustomSources(importItems, defaultCategory) {
  const state = await getStoredState();
  const existingByUrl = new Map((state.customSources || []).map((item) => [item.url, item]));
  const imported = [];

  for (const item of importItems) {
    const url = item.url;
    const text = await fetchText(url);
    const metadata = parseFeedMetadata(text);
    const type = metadata.type === "jsonfeed" ? "jsonfeed" : "rss";
    const source = normalizeCustomSource({
      id: stableSourceId(url),
      url,
      name: item.name || metadata.title || url,
      homepage: item.homepage || metadata.homepage || url,
      type,
      category: item.category || defaultCategory || "general"
    });
    existingByUrl.set(url, source);
    imported.push(source);
  }

  const customSources = [...existingByUrl.values()];
  await saveCustomSources(customSources);

  const settings = { ...state.settings, onboardingComplete: true };
  const enabled = new Set(settings.enabledSourceIds || []);
  imported.forEach((source) => enabled.add(source.id));
  settings.enabledSourceIds = [...enabled];
  await saveSettings(settings);

  return getStoredState();
}

async function ensureInitialSetup() {
  const state = await chrome.storage.local.get({ [STORAGE_KEYS.settings]: null });
  if (!state[STORAGE_KEYS.settings]) {
    await saveSettings(getDefaultSettings());
  }
  await configureAlarm();
}

chrome.runtime.onInstalled.addListener(async (details) => {
  await ensureInitialSetup();
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage().catch(() => {});
  }
  refreshAllSources().catch(console.error);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refreshFeeds") {
    refreshAllSources().catch(console.error);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    if (message.type === "getState") {
      const state = await getStoredState();
      sendResponse({ ok: true, state, sources: getAllSources(state.customSources) });
      return;
    }

    if (message.type === "refresh") {
      const state = await refreshAllSources();
      sendResponse({ ok: true, state, sources: getAllSources(state.customSources) });
      return;
    }

    if (message.type === "saveSettings") {
      await saveSettings(message.settings);
      await configureAlarm();
      const state = await getStoredState();
      sendResponse({ ok: true, state, sources: getAllSources(state.customSources) });
      return;
    }

    if (message.type === "toggleBookmark") {
      const bookmarks = await toggleMapItem(STORAGE_KEYS.bookmarks, message.id);
      sendResponse({ ok: true, bookmarks });
      return;
    }

    if (message.type === "markRead") {
      const readIds = await markRead(message.id);
      sendResponse({ ok: true, readIds });
      return;
    }

    if (message.type === "openArticle") {
      const readIds = await markRead(message.article.id);
      await chrome.tabs.create({ url: message.article.link, active: true });
      sendResponse({ ok: true, readIds });
      return;
    }

    if (message.type === "importCustomSources") {
      const state = await importCustomSources(message.items || [], message.defaultCategory || "general");
      sendResponse({ ok: true, state, sources: getAllSources(state.customSources) });
      return;
    }

    sendResponse({ ok: false, error: "Unknown message" });
  })().catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});
