import { getDefaultSettings } from "./sources.js";

export const STORAGE_KEYS = {
  articles: "articles",
  settings: "settings",
  bookmarks: "bookmarks",
  readIds: "readIds",
  lastRefreshAt: "lastRefreshAt",
  sourceStatus: "sourceStatus"
};

export async function getStoredState() {
  const defaults = {
    [STORAGE_KEYS.articles]: [],
    [STORAGE_KEYS.settings]: getDefaultSettings(),
    [STORAGE_KEYS.bookmarks]: {},
    [STORAGE_KEYS.readIds]: {},
    [STORAGE_KEYS.lastRefreshAt]: null,
    [STORAGE_KEYS.sourceStatus]: {}
  };
  const state = await chrome.storage.local.get(defaults);
  return {
    articles: state[STORAGE_KEYS.articles],
    settings: { ...getDefaultSettings(), ...state[STORAGE_KEYS.settings] },
    bookmarks: state[STORAGE_KEYS.bookmarks],
    readIds: state[STORAGE_KEYS.readIds],
    lastRefreshAt: state[STORAGE_KEYS.lastRefreshAt],
    sourceStatus: state[STORAGE_KEYS.sourceStatus]
  };
}

export async function saveArticles(articles, sourceStatus) {
  await chrome.storage.local.set({
    [STORAGE_KEYS.articles]: articles,
    [STORAGE_KEYS.sourceStatus]: sourceStatus,
    [STORAGE_KEYS.lastRefreshAt]: Date.now()
  });
}

export async function saveSettings(settings) {
  await chrome.storage.local.set({ [STORAGE_KEYS.settings]: settings });
}

export async function toggleMapItem(key, id) {
  const state = await chrome.storage.local.get({ [key]: {} });
  const map = state[key] || {};
  if (map[id]) {
    delete map[id];
  } else {
    map[id] = Date.now();
  }
  await chrome.storage.local.set({ [key]: map });
  return map;
}

export async function markRead(id) {
  const state = await chrome.storage.local.get({ [STORAGE_KEYS.readIds]: {} });
  const readIds = state[STORAGE_KEYS.readIds] || {};
  readIds[id] = Date.now();
  await chrome.storage.local.set({ [STORAGE_KEYS.readIds]: readIds });
  return readIds;
}
