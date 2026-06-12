# 🦅 EagleEye News

> 鹰眼资讯 — 开源、无服务器、数据完全本地的浏览器资讯聚合扩展

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![Edge Add-ons](https://img.shields.io/badge/Edge-Add--ons-blue?logo=microsoft-edge)](https://microsoftedge.microsoft.com/addons)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)

EagleEye News 是一款 Chrome / Edge 通用的 **Manifest V3** 资讯聚合扩展。无需注册账号、不依赖自建服务器，所有数据保存在浏览器本地。内置 36+ 公开资讯源，同时支持导入自定义订阅，让你在一个弹窗里掌握全网热点。

---

## ✨ 功能特性

- **多源聚合** — 内置涵盖综合新闻、中文热门、科技、开发者、AI、财经六大分类的 36+ 资讯源
- **自定义订阅** — 支持导入 OPML 文件、RSS / Atom / JSON Feed 地址，也支持逐行粘贴
- **按标签筛选** — 来源按标签分组，支持一键「选择本类 / 取消本类」
- **关键词搜索** — 实时搜索标题、来源、摘要和域名
- **收藏 & 已读** — 本地记录收藏和已读状态，支持「隐藏已读」过滤
- **自动刷新** — 后台定时抓取，支持 1 分钟到 4 小时的刷新间隔
- **快捷键** — `Ctrl+Shift+E`（Mac: `Cmd+Shift+E`）一键打开
- **深色模式** — 跟随系统主题自动切换
- **零数据上传** — 所有数据仅存储在 `chrome.storage.local`，卸载即清除

---

## 📸 界面预览

| 弹窗首页 | 设置页 |
|:---:|:---:|
| 热点列表、来源筛选、搜索 | 来源管理、导入订阅、刷新设置 |

> 截图待补充，欢迎 PR！

---

## 🚀 快速开始

### 方式一：Chrome Web Store / Edge Add-ons（推荐）

> 上架后通过商店安装，自动更新。

### 方式二：本地加载（开发者）

1. 下载或克隆本仓库
2. 打开浏览器扩展管理页：
   - Chrome：`chrome://extensions/`
   - Edge：`edge://extensions/`
3. 开启「开发者模式」
4. 点击「加载已解压的扩展」，选择 `EagleEye-News` 目录

---

## 📂 项目结构

```
EagleEye-News/
├── manifest.json            # 扩展清单（Manifest V3）
├── PRIVACY.md               # 隐私说明
├── LICENSE                  # MIT 开源协议
├── assets/
│   └── icons/               # 扩展图标（16/32/48/128/1024）
├── docs/
│   ├── STORE_LISTING.md     # 上架素材与描述文案
│   └── SOURCE_REVIEW.md     # 内置来源合规记录
└── src/
    ├── background.js        # Service Worker（后台定时刷新）
    ├── sources.js           # 内置资讯源定义
    ├── parser.js            # RSS / Atom / JSON Feed / HTML 解析
    ├── storage.js           # chrome.storage.local 封装
    ├── utils.js             # 通用工具函数
    ├── subscription-import.js # OPML / 订阅链接导入
    ├── popup.html/js/css    # 弹窗页面
    └── options.html/js/css  # 设置页面
```

---

## 🛡️ 合规说明

- 只聚合公开来源中的 **标题、链接、来源、发布时间和短摘要**
- 不复制全文，不绕过登录、反爬、付费墙或访问限制
- 不采集、上传或出售任何个人信息
- 不接入分析、广告、追踪或第三方 AI 服务
- 新增来源时优先选择官方 RSS / API

详见 [PRIVACY.md](PRIVACY.md) 和 [SOURCE_REVIEW.md](docs/SOURCE_REVIEW.md)。

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交改动：`git commit -m "feat: 描述"`
4. 推送分支：`git push origin feature/your-feature`
5. 创建 Pull Request

### 新增资讯源

提交新来源时请确保：
- 来源为公开可访问的 RSS / Atom / JSON Feed / 公开 API
- 不违反目标网站的使用条款
- 在 `docs/SOURCE_REVIEW.md` 中补充合规记录

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

## 💬 联系方式

- GitHub Issues：[提交反馈](https://github.com/supercj/EagleEye-News/issues)
