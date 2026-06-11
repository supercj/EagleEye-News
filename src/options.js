import { SOURCE_TAGS, BUILTIN_SOURCES } from "./sources.js";
import { sendMessage, tagLabel } from "./utils.js";
import { sendMessage, tagLabel } from "./utils.js";
import { parseSubscriptionInput } from "./subscription-import.js";

let appState = null;
let sources = [];

const sourceList = document.querySelector("#sourceList");
const refreshSelect = document.querySelector("#refreshSelect");
const saveButton = document.querySelector("#saveButton");
const saveMeta = document.querySelector("#saveMeta");
const importInput = document.querySelector("#importInput");
const importTag = document.querySelector("#importTag");
const importFile = document.querySelector("#importFile");
const importButton = document.querySelector("#importButton");
const importMeta = document.querySelector("#importMeta");
const selectRecommended = document.querySelector("#selectRecommended");
const hideReadInput = document.querySelector("#hideReadInput");





function sourceIsBuiltIn(sourceId) {
  return BUILTIN_SOURCES.some((item) => item.id === sourceId);
}

function sortSources(sourceItems) {
  return [...sourceItems].sort((a, b) => {
    const rankA = Number(a.rank) || 999;
    const rankB = Number(b.rank) || 999;
    return rankA - rankB || a.name.localeCompare(b.name);
  });
}

function renderSourceItem(source, enabled) {
  const item = document.createElement("label");
  item.className = "source-item";

  const rank = document.createElement("span");
  rank.className = "source-rank";
  rank.textContent = source.rank ? String(source.rank).padStart(2, "0") : "--";

  const body = document.createElement("div");
  const name = document.createElement("div");
  name.className = "source-name";
  name.textContent = source.name;

  if (!sourceIsBuiltIn(source.id)) {
    const customTag = document.createElement("span");
    customTag.className = "source-category";
    customTag.textContent = "自定义";
    name.append(customTag);
  }

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

  item.append(rank, body, checkbox);
  return item;
}

function getGroupCheckboxes(group) {
  return [...group.querySelectorAll("input[type='checkbox']")];
}

function updateGroupActionButton(group, button) {
  const checkboxes = getGroupCheckboxes(group);
  const allChecked = checkboxes.length > 0 && checkboxes.every((checkbox) => checkbox.checked);
  button.textContent = allChecked ? "取消本类" : "选择本类";
}

function renderSources() {
  const enabled = new Set(appState.settings.enabledSourceIds || []);
  sourceList.innerHTML = "";

  SOURCE_TAGS.forEach((tag) => {
    const groupedSources = sortSources(sources.filter((source) => (source.tag) === tag.id));
    if (!groupedSources.length) {
      return;
    }

    const group = document.createElement("details");
    group.className = "source-group";
    group.open = false;

    const summary = document.createElement("summary");
    summary.className = "source-group-title";

    const title = document.createElement("span");
    title.textContent = `${tag.label} · ${groupedSources.length}`;

    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className = "source-group-action";

    const groupList = document.createElement("div");
    groupList.className = "source-group-list";
    groupedSources.forEach((source) => {
      groupList.append(renderSourceItem(source, enabled));
    });

    updateGroupActionButton(groupList, actionButton);
    groupList.addEventListener("change", () => {
      updateGroupActionButton(groupList, actionButton);
    });
    actionButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const checkboxes = getGroupCheckboxes(groupList);
      const shouldCheck = !checkboxes.every((checkbox) => checkbox.checked);
      checkboxes.forEach((checkbox) => {
        checkbox.checked = shouldCheck;
      });
      updateGroupActionButton(groupList, actionButton);
    });

    summary.append(title, actionButton);
    group.append(summary, groupList);
    sourceList.append(group);
  });
}

function collectSettings() {
  const enabledSourceIds = [...sourceList.querySelectorAll("input[type='checkbox']:checked")].map((input) => input.value);
  const activeSourceId = enabledSourceIds.includes(appState.settings.activeSourceId)
    ? appState.settings.activeSourceId
    : "all";
  return {
    ...appState.settings,
    enabledSourceIds,
    activeSourceId,
    hideRead: hideReadInput.checked,
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
  hideReadInput.checked = Boolean(appState.settings.hideRead);
  renderSources();
}

selectRecommended.addEventListener("click", () => {
  const recommended = new Set(BUILTIN_SOURCES.map((source) => source.id));
  sourceList.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = recommended.has(input.value);
  });
  sourceList.querySelectorAll(".source-group").forEach((group) => {
    const button = group.querySelector(".source-group-action");
    if (button) {
      updateGroupActionButton(group, button);
    }
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
    items: items.map((item) => ({ ...item, tag: importTag.value }))
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
