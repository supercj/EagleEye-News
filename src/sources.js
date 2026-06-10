export const DEFAULT_REFRESH_MINUTES = 60;

export const BUILTIN_SOURCES = [
  {
    id: "ifanr",
    name: "爱范儿",
    category: "tech",
    type: "rss",
    url: "https://www.ifanr.com/feed",
    homepage: "https://www.ifanr.com/",
    limit: 20
  },
  {
    id: "ithome",
    name: "IT之家",
    category: "tech",
    type: "rss",
    url: "https://www.ithome.com/rss/",
    homepage: "https://www.ithome.com/",
    limit: 20
  },
  {
    id: "sspai",
    name: "少数派",
    category: "tech",
    type: "rss",
    url: "https://sspai.com/feed",
    homepage: "https://sspai.com/",
    limit: 20
  },
  {
    id: "infoq-cn",
    name: "InfoQ 中文",
    category: "tech",
    type: "rss",
    url: "https://www.infoq.cn/feed",
    homepage: "https://www.infoq.cn/",
    limit: 20
  },
  {
    id: "solidot",
    name: "Solidot",
    category: "tech",
    type: "rss",
    url: "https://www.solidot.org/index.rss",
    homepage: "https://www.solidot.org/",
    limit: 20
  },
  {
    id: "kr36-flash",
    name: "CNBC Finance",
    category: "finance",
    type: "rss",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    homepage: "https://www.cnbc.com/finance/",
    limit: 20
  },
  {
    id: "v2ex-hot",
    name: "V2EX 热门",
    category: "dev",
    type: "rss",
    url: "https://www.v2ex.com/feed/tab/hot.xml",
    homepage: "https://www.v2ex.com/?tab=hot",
    limit: 20
  },
  {
    id: "linux-do-latest",
    name: "Linux.do 最新",
    category: "dev",
    type: "rss",
    url: "https://linux.do/latest.rss",
    homepage: "https://linux.do/latest",
    limit: 20
  },
  {
    id: "github-trending",
    name: "GitHub Trending",
    category: "dev",
    type: "githubTrending",
    url: "https://github.com/trending?since=daily",
    homepage: "https://github.com/trending",
    limit: 20
  },
  {
    id: "hackernews",
    name: "Hacker News",
    category: "dev",
    type: "hackernews",
    homepage: "https://news.ycombinator.com/",
    limit: 20
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    category: "tech",
    type: "rss",
    url: "https://www.producthunt.com/feed",
    homepage: "https://www.producthunt.com/",
    limit: 20
  }
];

export const DEFAULT_ENABLED_SOURCE_IDS = [];

export const CATEGORIES = [
  { id: "all", label: "全部" },
  { id: "general", label: "综合" },
  { id: "tech", label: "科技" },
  { id: "dev", label: "开发者" },
  { id: "finance", label: "财经" }
];

export function getBuiltinSources() {
  return [...BUILTIN_SOURCES];
}

export function getAllSources(customSources = []) {
  return [...BUILTIN_SOURCES, ...customSources];
}

export function stableSourceId(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i += 1) {
    hash = (hash * 31 + url.charCodeAt(i)) >>> 0;
  }
  return `custom-${hash.toString(36)}`;
}

export function normalizeCustomSource(source) {
  return {
    id: source.id || stableSourceId(source.url),
    name: source.name || source.url,
    category: source.category || "general",
    type: source.type || "rss",
    url: source.url,
    homepage: source.homepage || source.url,
    limit: source.limit || 20,
    isCustom: true
  };
}

export function getDefaultSettings() {
  return {
    enabledSourceIds: DEFAULT_ENABLED_SOURCE_IDS,
    refreshMinutes: DEFAULT_REFRESH_MINUTES,
    viewMode: "latest",
    activeCategory: "all",
    keyword: "",
    hideRead: false,
    onboardingComplete: false
  };
}
