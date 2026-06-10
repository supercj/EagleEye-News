import { SOURCES, getDefaultSettings } from "./sources.js";
import { STORAGE_KEYS, getStoredState, markRead, saveArticles, saveSettings, toggleMapItem } from "./storage.js";
import { dedupeArticles, makeArticleId, parseGithubTrending, parseRss } from "./parser.js";

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "Accept": "application/rss+xml, application/atom+xml, text/xml, text/html, application/json;q=0.9, */*;q=0.8"
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
  return parseRss(text, source);
}

async function refreshAllSources() {
  const { settings } = await getStoredState();
  const enabled = new Set(settings.enabledSourceIds || getDefaultSettings().enabledSourceIds);
  const activeSources = SOURCES.filter((source) => enabled.has(source.id));
  const sourceStatus = {};
  const resultSets = await Promise.allSettled(activeSources.map(async (source) => {
    const articles = await fetchSource(source);
    sourceStatus[source.id] = {
      ok: true,
      count: articles.length,
      checkedAt: Date.now()
    };
    return articles;
  }));

  const articles = [];
  resultSets.forEach((result, index) => {
    const source = activeSources[index];
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      sourceStatus[source.id] = {
        ok: false,
        error: result.reason?.message || "Fetch failed",
        checkedAt: Date.now()
      };
    }
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

chrome.runtime.onInstalled.addListener(async () => {
  const state = await chrome.storage.local.get({ [STORAGE_KEYS.settings]: null });
  if (!state[STORAGE_KEYS.settings]) {
    await saveSettings(getDefaultSettings());
  }
  await configureAlarm();
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
      sendResponse({ ok: true, state: await getStoredState(), sources: SOURCES });
      return;
    }
    if (message.type === "refresh") {
      sendResponse({ ok: true, state: await refreshAllSources(), sources: SOURCES });
      return;
    }
    if (message.type === "saveSettings") {
      await saveSettings(message.settings);
      await configureAlarm();
      sendResponse({ ok: true, state: await getStoredState(), sources: SOURCES });
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
    sendResponse({ ok: false, error: "Unknown message" });
  })().catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});
