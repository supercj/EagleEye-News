import { SOURCE_TAGS } from "./sources.js";

export function sendMessage(message) {
  return chrome.runtime.sendMessage(message);
}

export function formatRelativeTime(timestamp) {
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

export function formatDateTime(timestamp) {
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

export function tagLabel(tagId) {
  return SOURCE_TAGS.find((tag) => tag.id === tagId)?.label || tagId || "综合";
}

export function getDomain(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}