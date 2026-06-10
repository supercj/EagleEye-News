import { CATEGORIES, BUILTIN_SOURCES } from "./sources.js";
import { parseSubscriptionInput } from "./subscription-import.js";

let appState = null;
let sources = [];

const sourceList = document.querySelector("#sourceList");
const refreshSelect = document.querySelector("#refreshSelect");
const saveButton = document.querySelector("#saveButton");
const saveMeta = document.querySelector("#saveMeta");
const importInput = document.querySelector("#importInput");
const importCategory = document.querySelector("#importCategory");
const importFile = document.querySelector("#importFile");
const importButton = document.querySelector("#importButton");
const importMeta = document.querySelector("#importMeta");
const selectRecommended = document.querySelector("#selectRecommended");

function sendMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function categoryLabel(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)?.label || categoryId;
}

function sourceIsBuiltIn(sourceId) {
  return BUILTIN_SOURCES.some((item) => item.id === sourceId);
}

function renderSources() {
  const enabled = new Set(appState.settings.enabledSourceIds || []);
  sourceList.innerHTML = "";

  sources.forEach((source) => {
    const item = document.createElement("label");
    item.className = "source-item";

    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "source-name";
    name.textContent = source.name;

    const category = document.createElement("span");
    category.className = "source-category";
    category.textContent = categoryLabel(source.category);
    name.append(category);

    const home = document.createElement("a");
    home.className = "source-home";
    home.href = source.homepage;
    home.target = "_blank";
    home.rel = "noreferrer";
    home.textContent = source.homepage;

    body.append(name, home);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = source.id;
    checkbox.checked = enabled.has(source.id);

    if (!sourceIsBuiltIn(source.id)) {
      const customTag = document.createElement("span");
      customTag.className = "source-category";
      customTag.textContent = "自定义";
      name.append(customTag);
    }

    item.append(body, checkbox);
    sourceList.append(item);
  });
}

function collectSettings() {
  const enabledSourceIds = [...sourceList.querySelectorAll("input[type='checkbox']:checked")].map((input) => input.value);
  return {
    ...appState.settings,
    enabledSourceIds,
    onboardingComplete: true,
    refreshMinutes: Number(refreshSelect.value)
  };
}

async function applySettings(settings) {
  const response = await sendMessage({ type: "saveSettings", settings });
  if (!response.ok) {
    throw new Error(response.error || "保存失败");
  }
  appState = response.state;
  sources = response.sources;
  renderSources();
}

async function init() {
  const response = await sendMessage({ type: "getState" });
  if (!response.ok) {
    return;
  }
  appState = response.state;
  sources = response.sources;
  refreshSelect.value = String(appState.settings.refreshMinutes || 60);
  renderSources();
}

selectRecommended.addEventListener("click", () => {
  const recommended = new Set(BUILTIN_SOURCES.filter((source) => ["general", "tech", "dev", "finance"].includes(source.category)).map((source) => source.id));
  sourceList.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = recommended.has(input.value);
  });
});

saveButton.addEventListener("click", async () => {
  saveButton.disabled = true;
  try {
    await applySettings(collectSettings());
    saveMeta.textContent = "已保存";
    setTimeout(() => {
      saveMeta.textContent = "";
    }, 1600);
  } catch (error) {
    saveMeta.textContent = error.message;
  } finally {
    saveButton.disabled = false;
  }
});

async function ensurePermissionForItems(items) {
  const origins = [...new Set(items.map((item) => new URL(item.url).origin + "/*"))];
  if (!origins.length) {
    return true;
  }
  return chrome.permissions.request({ origins });
}

async function importItems(items) {
  if (!items.length) {
    importMeta.textContent = "没有识别到可导入的订阅地址";
    return;
  }
  const granted = await ensurePermissionForItems(items);
  if (!granted) {
    importMeta.textContent = "已取消权限申请";
    return;
  }

  const response = await sendMessage({
    type: "importCustomSources",
    items: items.map((item) => ({ ...item, category: importCategory.value }))
  });
  if (!response.ok) {
    importMeta.textContent = response.error || "导入失败";
    return;
  }

  appState = response.state;
  sources = response.sources;
  renderSources();
  refreshSelect.value = String(appState.settings.refreshMinutes || 60);
  importMeta.textContent = `已导入 ${items.length} 条订阅`;
  importInput.value = "";
  importFile.value = "";
}

importButton.addEventListener("click", async () => {
  try {
    await importItems(parseSubscriptionInput(importInput.value));
  } catch (error) {
    importMeta.textContent = error.message || "导入失败";
  }
});

importFile.addEventListener("change", async () => {
  const file = importFile.files?.[0];
  if (!file) {
    return;
  }
  const text = await file.text();
  importInput.value = text;
  importMeta.textContent = `已载入 ${file.name}`;
});

init();
