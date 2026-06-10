export const DEFAULT_REFRESH_MINUTES = 60;

export const SOURCES = [
  {
    id: "zhihu-hot",
    name: "知乎热榜",
    category: "general",
    type: "rss",
    url: "https://rsshub.app/zhihu/hotlist",
    homepage: "https://www.zhihu.com/hot",
    limit: 20
  },
  {
    id: "weibo-hot",
    name: "微博热搜",
    category: "general",
    type: "rss",
    url: "https://rsshub.app/weibo/search/hot",
    homepage: "https://s.weibo.com/top/summary",
    limit: 20
  },
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
    name: "36氪快讯",
    category: "finance",
    type: "rss",
    url: "https://rsshub.app/36kr/newsflashes",
    homepage: "https://www.36kr.com/newsflashes/catalog/2",
    limit: 20
  },
  {
    id: "v2ex-hot",
    name: "V2EX 热门",
    category: "dev",
    type: "rss",
    url: "https://rsshub.app/v2ex/topics/hot",
    homepage: "https://www.v2ex.com/?tab=hot",
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
  }
];

export const DEFAULT_ENABLED_SOURCE_IDS = [
  "zhihu-hot",
  "weibo-hot",
  "ithome",
  "sspai",
  "infoq-cn",
  "ifanr",
  "kr36-flash",
  "v2ex-hot",
  "github-trending"
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
    enabledSourceIds: DEFAULT_ENABLED_SOURCE_IDS,
    refreshMinutes: DEFAULT_REFRESH_MINUTES,
    viewMode: "latest",
    activeCategory: "all",
    keyword: "",
    hideRead: false
  };
}
