# 内置来源合规记录

本文档记录 EagleEye News 内置资讯来源的合规审查信息，用于上架前复核。扩展只展示标题、链接、来源、发布时间和短摘要，并保留原文跳转链接。

---

## 合规原则

1. **公开可访问** — 仅使用公开的 RSS / Atom / JSON Feed / 公开 API / 榜单页面
2. **不复制全文** — 只提取标题、摘要和链接，不抓取或展示正文全文
3. **不绕过限制** — 不绕过登录、付费墙、反爬机制或访问限制
4. **保留来源** — 所有内容均附带原文链接，引导用户访问原站

---

## 来源列表

### 综合新闻

| 来源 | 类型 | 地址 | 用途说明 |
| --- | --- | --- | --- |
| ABC News | RSS | `https://abcnews.go.com/abcnews/topstories` | 公开 RSS，聚合标题、摘要和原文链接 |
| CBS News | RSS | `https://www.cbsnews.com/latest/rss/main` | 公开 RSS，聚合标题、摘要和原文链接 |
| Sky News | RSS | `https://feeds.skynews.com/feeds/rss/home.xml` | 公开 RSS，聚合标题、摘要和原文链接 |
| NPR News | RSS | `https://feeds.npr.org/1001/rss.xml` | 公开 RSS，聚合标题、摘要和原文链接 |

### 中文热门

| 来源 | 类型 | 地址 | 用途说明 |
| --- | --- | --- | --- |
| 36氪 | RSS | `https://36kr.com/feed` | 公开 RSS，聚合标题、摘要和原文链接 |
| 新浪新闻 | RSS | `https://rss.sina.com.cn/news/marquee/ddt.xml` | 公开 RSS，聚合标题、摘要和原文链接 |
| 人民网时政 | RSS | `http://www.people.com.cn/rss/politics.xml` | 公开 RSS，聚合标题、摘要和原文链接 |
| 钛媒体 | RSS | `https://www.tmtpost.com/rss.xml` | 公开 RSS，聚合标题、摘要和原文链接 |
| 雷峰网 | RSS | `https://www.leiphone.com/feed` | 公开 RSS，聚合标题、摘要和原文链接 |
| OSCHINA | RSS | `https://www.oschina.net/news/rss` | 公开 RSS，聚合标题、摘要和原文链接 |
| 博客园新闻 | RSS | `https://feed.cnblogs.com/news/rss` | 公开 RSS，聚合标题、摘要和原文链接 |
| B站热榜 | RSS | `https://rsshub.app/bilibili/ranking/0/1/3` | 通过 RSSHub 获取公开排行榜 |
| 吾爱破解 | RSS | `https://rsshub.app/52pojie/forum/65` | 通过 RSSHub 获取公开论坛帖子 |
| 虎扑热帖 | RSS | `https://rsshub.app/hupu/bbs/1` | 通过 RSSHub 获取公开论坛帖子 |

### 科技

| 来源 | 类型 | 地址 | 用途说明 |
| --- | --- | --- | --- |
| The Verge | Atom | `https://www.theverge.com/rss/index.xml` | 公开 Atom，聚合标题、摘要和原文链接 |
| TechCrunch | RSS | `https://techcrunch.com/feed/` | 公开 RSS，聚合标题、摘要和原文链接 |
| Ars Technica | RSS | `https://feeds.arstechnica.com/arstechnica/index` | 公开 RSS，聚合标题、摘要和原文链接 |
| WIRED | RSS | `https://www.wired.com/feed/rss` | 公开 RSS，聚合标题、摘要和原文链接 |
| ZDNET | RSS | `https://www.zdnet.com/news/rss.xml` | 公开 RSS，聚合标题、摘要和原文链接 |
| 爱范儿 | RSS | `https://www.ifanr.com/feed` | 公开 RSS，聚合标题、摘要和原文链接 |
| IT之家 | RSS | `https://www.ithome.com/rss/` | 公开 RSS，聚合标题、摘要和原文链接 |
| 少数派 | RSS | `https://sspai.com/feed` | 公开 RSS，聚合标题、摘要和原文链接 |
| InfoQ 中文 | RSS | `https://www.infoq.cn/feed` | 公开 RSS，聚合标题、摘要和原文链接 |
| Solidot | RSS | `https://www.solidot.org/index.rss` | 公开 RSS，聚合标题、摘要和原文链接 |
| Product Hunt | RSS | `https://www.producthunt.com/feed` | 公开 RSS，聚合标题、摘要和原文链接 |
| Readhub | RSS | `https://readhub.cn/rss` | 公开 RSS，聚合标题、摘要和原文链接 |

### 开发者

| 来源 | 类型 | 地址 | 用途说明 |
| --- | --- | --- | --- |
| GitHub Trending | 榜单页面 | `https://github.com/trending?since=daily` | 解析公开榜单中的仓库标题、链接和描述 |
| Hacker News | 公开 API | `https://hacker-news.firebaseio.com/v0/topstories.json` | 官方公开 API，聚合热门条目 |
| GitHub Blog | RSS | `https://github.blog/feed/` | 公开 RSS，聚合标题、摘要和原文链接 |
| Stack Overflow Blog | RSS | `https://stackoverflow.blog/feed/` | 公开 RSS，聚合标题、摘要和原文链接 |
| V2EX 热门 | RSS | `https://www.v2ex.com/feed/tab/hot.xml` | 公开 RSS，聚合标题、摘要和原文链接 |
| Linux.do 最新 | RSS | `https://linux.do/latest.rss` | 公开 RSS，聚合标题、摘要和原文链接 |
| 掘金 | RSS | `https://juejin.cn/rss` | 公开 RSS，聚合标题、摘要和原文链接 |
| HelloGitHub | RSS | `https://hellogithub.com/rss` | 公开 RSS，聚合标题、摘要和原文链接 |

### AI

| 来源 | 类型 | 地址 | 用途说明 |
| --- | --- | --- | --- |
| 量子位 | RSS | `https://www.qbitai.com/feed` | 公开 RSS，聚合标题、摘要和原文链接 |

### 财经

| 来源 | 类型 | 地址 | 用途说明 |
| --- | --- | --- | --- |
| CNBC Finance | RSS | `https://www.cnbc.com/id/100003114/device/rss/rss.html` | 公开 RSS，聚合标题、摘要和原文链接 |
| Nasdaq Markets | RSS | `https://www.nasdaq.com/feed/rssoutbound?category=Markets` | 公开 RSS，聚合标题、摘要和原文链接 |
| MarketWatch | RSS | `https://feeds.content.dowjones.io/public/rss/mw_topstories` | 公开 RSS，聚合标题、摘要和原文链接 |
| Seeking Alpha | RSS | `https://seekingalpha.com/feed.xml` | 公开 RSS，聚合标题、摘要和原文链接 |

---

## 维护规则

- **新增来源**时优先选择官方 RSS / Atom / JSON Feed / 公开 API
- **不抓取**需要登录、付费、验证码或明确禁止自动访问的内容
- **不保存或展示**全文内容，仅保留标题、摘要和原文链接
- **定期检查**来源可用性，失效、返回错误或条款变化时禁用或替换
- **新增来源**时同步更新本文档
