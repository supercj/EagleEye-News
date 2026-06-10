export const DEFAULT_REFRESH_MINUTES = 60;

export const SOURCES = [
  {
    id: "hackernews",
    name: "Hacker News",
    category: "dev",
    type: "hackernews",
    homepage: "https://news.ycombinator.com/",
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
    id: "solidot",
    name: "Solidot",
    category: "tech",
    type: "rss",
    url: "https://www.solidot.org/index.rss",
    homepage: "https://www.solidot.org/",
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
    id: "sspai",
    name: "少数派",
    category: "tech",
    type: "rss",
    url: "https://sspai.com/feed",
    homepage: "https://sspai.com/",
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
    id: "producthunt",
    name: "Product Hunt",
    category: "tech",
    type: "rss",
    url: "https://www.producthunt.com/feed",
    homepage: "https://www.producthunt.com/",
    limit: 20
  },
  {
    id: "cnbc-finance",
    name: "CNBC Finance",
    category: "finance",
    type: "rss",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    homepage: "https://www.cnbc.com/finance/",
    limit: 20
  },
  {
    id: "zhihu-hot",
    name: "知乎热榜",
    category: "general",
    type: "rss",
    url: "https://rsshub.app/zhihu/hotlist",
    homepage: "https://www.zhihu.com/hot",
    limit: 20
  }
];

export const CATEGORIES = [
  { id: "all", label: "全部" },
  { id: "general", label: "综合" },
  { id: "tech", label: "科技" },
  { id: "dev", label: "开发者" },
  { id: "finance", label: "财经" }
];

export function getDefaultSettings() {
  return {
    enabledSourceIds: SOURCES.map((source) => source.id),
    refreshMinutes: DEFAULT_REFRESH_MINUTES,
    viewMode: "latest",
    activeCategory: "all",
    keyword: "",
    hideRead: false
  };
}
