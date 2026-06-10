export const DEFAULT_REFRESH_MINUTES = 60;

export const BUILTIN_SOURCES = [
  {
    id: "abc-news",
    name: "ABC News",
    tag: "general",
    rank: 1,
    type: "rss",
    url: "https://abcnews.go.com/abcnews/topstories",
    homepage: "https://abcnews.go.com/",
    limit: 20
  },
  {
    id: "cbs-news",
    name: "CBS News",
    tag: "general",
    rank: 2,
    type: "rss",
    url: "https://www.cbsnews.com/latest/rss/main",
    homepage: "https://www.cbsnews.com/",
    limit: 20
  },
  {
    id: "sky-news",
    name: "Sky News",
    tag: "general",
    rank: 3,
    type: "rss",
    url: "https://feeds.skynews.com/feeds/rss/home.xml",
    homepage: "https://news.sky.com/",
    limit: 20
  },
  {
    id: "npr-news",
    name: "NPR News",
    tag: "general",
    rank: 4,
    type: "rss",
    url: "https://feeds.npr.org/1001/rss.xml",
    homepage: "https://www.npr.org/sections/news/",
    limit: 20
  },
  {
    id: "36kr",
    name: "36氪",
    tag: "china",
    rank: 1,
    type: "rss",
    url: "https://36kr.com/feed",
    homepage: "https://36kr.com/",
    limit: 20
  },
  {
    id: "sina-news",
    name: "新浪新闻",
    tag: "china",
    rank: 2,
    type: "rss",
    url: "https://rss.sina.com.cn/news/marquee/ddt.xml",
    homepage: "https://news.sina.com.cn/",
    limit: 20
  },
  {
    id: "people-politics",
    name: "人民网时政",
    tag: "china",
    rank: 3,
    type: "rss",
    url: "http://www.people.com.cn/rss/politics.xml",
    homepage: "http://politics.people.com.cn/",
    limit: 20
  },
  {
    id: "tmtpost",
    name: "钛媒体",
    tag: "china",
    rank: 4,
    type: "rss",
    url: "https://www.tmtpost.com/rss.xml",
    homepage: "https://www.tmtpost.com/",
    limit: 20
  },
  {
    id: "leiphone",
    name: "雷峰网",
    tag: "china",
    rank: 5,
    type: "rss",
    url: "https://www.leiphone.com/feed",
    homepage: "https://www.leiphone.com/",
    limit: 20
  },
  {
    id: "oschina-news",
    name: "OSCHINA",
    tag: "china",
    rank: 6,
    type: "rss",
    url: "https://www.oschina.net/news/rss",
    homepage: "https://www.oschina.net/news",
    limit: 20
  },
  {
    id: "cnblogs-news",
    name: "博客园新闻",
    tag: "china",
    rank: 7,
    type: "rss",
    url: "https://feed.cnblogs.com/news/rss",
    homepage: "https://news.cnblogs.com/",
    limit: 20
  },
  {
    id: "ifanr",
    name: "爱范儿",
    tag: "tech",
    rank: 6,
    type: "rss",
    url: "https://www.ifanr.com/feed",
    homepage: "https://www.ifanr.com/",
    limit: 20
  },
  {
    id: "ithome",
    name: "IT之家",
    tag: "tech",
    rank: 7,
    type: "rss",
    url: "https://www.ithome.com/rss/",
    homepage: "https://www.ithome.com/",
    limit: 20
  },
  {
    id: "sspai",
    name: "少数派",
    tag: "tech",
    rank: 8,
    type: "rss",
    url: "https://sspai.com/feed",
    homepage: "https://sspai.com/",
    limit: 20
  },
  {
    id: "infoq-cn",
    name: "InfoQ 中文",
    tag: "tech",
    rank: 9,
    type: "rss",
    url: "https://www.infoq.cn/feed",
    homepage: "https://www.infoq.cn/",
    limit: 20
  },
  {
    id: "solidot",
    name: "Solidot",
    tag: "tech",
    rank: 10,
    type: "rss",
    url: "https://www.solidot.org/index.rss",
    homepage: "https://www.solidot.org/",
    limit: 20
  },
  {
    id: "the-verge",
    name: "The Verge",
    tag: "tech",
    rank: 1,
    type: "rss",
    url: "https://www.theverge.com/rss/index.xml",
    homepage: "https://www.theverge.com/",
    limit: 20
  },
  {
    id: "techcrunch",
    name: "TechCrunch",
    tag: "tech",
    rank: 2,
    type: "rss",
    url: "https://techcrunch.com/feed/",
    homepage: "https://techcrunch.com/",
    limit: 20
  },
  {
    id: "ars-technica",
    name: "Ars Technica",
    tag: "tech",
    rank: 3,
    type: "rss",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    homepage: "https://arstechnica.com/",
    limit: 20
  },
  {
    id: "wired",
    name: "WIRED",
    tag: "tech",
    rank: 4,
    type: "rss",
    url: "https://www.wired.com/feed/rss",
    homepage: "https://www.wired.com/",
    limit: 20
  },
  {
    id: "zdnet",
    name: "ZDNET",
    tag: "tech",
    rank: 5,
    type: "rss",
    url: "https://www.zdnet.com/news/rss.xml",
    homepage: "https://www.zdnet.com/",
    limit: 20
  },
  {
    id: "cnbc-finance",
    name: "CNBC Finance",
    tag: "finance",
    rank: 1,
    type: "rss",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    homepage: "https://www.cnbc.com/finance/",
    limit: 20
  },
  {
    id: "nasdaq-markets",
    name: "Nasdaq Markets",
    tag: "finance",
    rank: 2,
    type: "rss",
    url: "https://www.nasdaq.com/feed/rssoutbound?category=Markets",
    homepage: "https://www.nasdaq.com/market-activity",
    limit: 20
  },
  {
    id: "marketwatch",
    name: "MarketWatch",
    tag: "finance",
    rank: 3,
    type: "rss",
    url: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
    homepage: "https://www.marketwatch.com/",
    limit: 20
  },
  {
    id: "seeking-alpha",
    name: "Seeking Alpha",
    tag: "finance",
    rank: 4,
    type: "rss",
    url: "https://seekingalpha.com/feed.xml",
    homepage: "https://seekingalpha.com/",
    limit: 20
  },
  {
    id: "v2ex-hot",
    name: "V2EX 热门",
    tag: "dev",
    rank: 5,
    type: "rss",
    url: "https://www.v2ex.com/feed/tab/hot.xml",
    homepage: "https://www.v2ex.com/?tab=hot",
    limit: 20
  },
  {
    id: "linux-do-latest",
    name: "Linux.do 最新",
    tag: "dev",
    rank: 6,
    type: "rss",
    url: "https://linux.do/latest.rss",
    homepage: "https://linux.do/latest",
    limit: 20
  },
  {
    id: "github-trending",
    name: "GitHub Trending",
    tag: "dev",
    rank: 1,
    type: "githubTrending",
    url: "https://github.com/trending?since=daily",
    homepage: "https://github.com/trending",
    limit: 20
  },
  {
    id: "hackernews",
    name: "Hacker News",
    tag: "dev",
    rank: 2,
    type: "hackernews",
    homepage: "https://news.ycombinator.com/",
    limit: 20
  },
  {
    id: "github-blog",
    name: "GitHub Blog",
    tag: "dev",
    rank: 3,
    type: "rss",
    url: "https://github.blog/feed/",
    homepage: "https://github.blog/",
    limit: 20
  },
  {
    id: "stackoverflow-blog",
    name: "Stack Overflow Blog",
    tag: "dev",
    rank: 4,
    type: "rss",
    url: "https://stackoverflow.blog/feed/",
    homepage: "https://stackoverflow.blog/",
    limit: 20
  },
  {
    id: "juejin",
    name: "掘金",
    tag: "dev",
    rank: 7,
    type: "rss",
    url: "https://juejin.cn/rss",
    homepage: "https://juejin.cn/",
    limit: 20
  },
  {
    id: "hellogithub",
    name: "HelloGitHub",
    tag: "dev",
    rank: 8,
    type: "rss",
    url: "https://hellogithub.com/rss",
    homepage: "https://hellogithub.com/",
    limit: 20
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    tag: "tech",
    rank: 11,
    type: "rss",
    url: "https://www.producthunt.com/feed",
    homepage: "https://www.producthunt.com/",
    limit: 20
  },
  {
    id: "readhub",
    name: "Readhub",
    tag: "tech",
    rank: 12,
    type: "rss",
    url: "https://readhub.cn/rss",
    homepage: "https://readhub.cn/",
    limit: 20
  },
  {
    id: "qbitai",
    name: "量子位",
    tag: "ai",
    rank: 1,
    type: "rss",
    url: "https://www.qbitai.com/feed",
    homepage: "https://www.qbitai.com/",
    limit: 20
  }
];

export const DEFAULT_ENABLED_SOURCE_IDS = [];

export const SOURCE_TAGS = [
  { id: "general", label: "综合" },
  { id: "china", label: "中文热门" },
  { id: "tech", label: "科技" },
  { id: "dev", label: "开发者" },
  { id: "ai", label: "AI" },
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
    tag: source.tag || source.category || "general",
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
    activeSourceId: "all",
    keyword: "",
    hideRead: false,
    onboardingComplete: false
  };
}
