import { CATEGORIES } from "./sources.js";

let appState = null;
let sources = [];

const sourceList = document.querySelector("#sourceList");
const refreshSelect = document.querySelector("#refreshSelect");
const saveButton = document.querySelector("#saveButton");
const saveMeta = document.querySelector("#saveMeta");

function sendMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function categoryLabel(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)?.label || categoryId;
}

function renderSources() {
  const enabled = new Set(appState.settings.enabledSourceIds);
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

    item.append(body, checkbox);
    sourceList.append(item);
  });
}

function collectSettings() {
  const enabledSourceIds = [...sourceList.querySelectorAll("input[type='checkbox']:checked")]
    .map((input) => input.value);
  return {
    ...appState.settings,
    enabledSourceIds,
    refreshMinutes: Number(refreshSelect.value)
  };
}

async function init() {
  const response = await sendMessage({ type: "getState" });
  if (response.ok) {
    appState = response.state;
    sources = response.sources;
    refreshSelect.value = String(appState.settings.refreshMinutes || 60);
    renderSources();
  }
}

saveButton.addEventListener("click", async () => {
  saveButton.disabled = true;
  const response = await sendMessage({ type: "saveSettings", settings: collectSettings() });
  saveButton.disabled = false;
  if (response.ok) {
    appState = response.state;
    saveMeta.textContent = "已保存";
    setTimeout(() => {
      saveMeta.textContent = "";
    }, 1600);
  } else {
    saveMeta.textContent = response.error || "保存失败";
  }
});

init();
