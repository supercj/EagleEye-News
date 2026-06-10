# EagleEye News

鹰眼资讯，一个无服务器、无域名、Chrome/Edge 通用的 Manifest V3 资讯聚合扩展 MVP。

## 功能

- 聚合公开 RSS、API、榜单页面中的热门链接
- 支持按订阅来源筛选、关键词搜索、来源开关、来源标签和推荐源排名展示
- 支持本地收藏、已读状态、刷新时间记录
- 所有数据保存在 `chrome.storage.local`
- 后台每 60 分钟自动刷新，也支持手动刷新

## 本地加载

1. 打开 Chrome 或 Edge 的扩展管理页。
2. 开启开发者模式。
3. 选择“加载已解压的扩展”。
4. 选择本目录：`EagleEye-News`。

Chrome 地址：`chrome://extensions/`

Edge 地址：`edge://extensions/`

## 合规边界

本扩展只聚合公开来源中的标题、链接、来源、时间和短摘要，不复制全文，不绕过登录、反爬、付费墙或访问限制。后续新增来源时优先选择官方 RSS/API。

## 上架准备

- 已准备 128x128、48x48、16x16 图标
- 已补充隐私说明：`PRIVACY.md`
- 已整理上架素材清单：`docs/STORE_LISTING.md`
- 已整理内置来源合规记录：`docs/SOURCE_REVIEW.md`
- 仍需准备 Chrome Web Store / Edge Add-ons 截图
- 如新增 AI 摘要，优先使用用户自己的 API Key 或再增加服务端方案

## 目录

```text
EagleEye-News/
  manifest.json
  PRIVACY.md
  docs/
    STORE_LISTING.md
    SOURCE_REVIEW.md
  src/
    background.js
    sources.js
    parser.js
    storage.js
    popup.html
    popup.js
    popup.css
    options.html
    options.js
    options.css
```
