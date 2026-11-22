[English](README.en.md)

**[在线阅读（中文站）](https://lanbingyue1.github.io/cure-script/zh/)** &nbsp;&nbsp;&nbsp;&nbsp; **[下载 EPUB（离线阅读）](https://github.com/lanbingyue1/cure-script/releases/latest/download/cure-dolly-zh.epub)**

# 简介

本项目是 [Kellenok/cure-script](https://github.com/Kellenok/cure-script) 的**中文版本（分支）**。

原项目把 Cure Dolly 的日语教学视频转录稿转成 Markdown，用 [VitePress](https://vitepress.dev/) 发布成网页版，并用 pandoc 生成 EPUB。转录稿由 Mordraug 和 Nunko 花了大量时间完成，并分享在[这个 Google Docs](https://docs.google.com/document/d/1XpuXerkGU8waJ4DPDNJA4bGeqOvM-csXjTe57iHARHc/) 里；[Kellen（Kellenok）](https://bento.me/kln)把脚本转成 Markdown、调整了格式并发布；离线 EPUB 的阅读支持与生成由 [coffeepebble](https://github.com/coffeepebble) 构建。

本中文版在原项目的基础上新增了完整的中文翻译，并在网站上提供中文入口（`/zh/`）。如果你想看英文原版，请访问 [README.en.md](README.en.md) 或[在线英文站](https://lanbingyue1.github.io/cure-script/)。

<img src="https://i.imgur.com/YOWRijj.png">

## 在线阅读与下载

- **在线（中文）**：<https://lanbingyue1.github.io/cure-script/zh/> —— 从[第 1 课](https://lanbingyue1.github.io/cure-script/zh/1-句子的基本类型.html)开始读。
- **在线（英文）**：<https://lanbingyue1.github.io/cure-script/>，**在线（俄文）**：<https://lanbingyue1.github.io/cure-script/ru/>。
- **离线 EPUB（中文）**：[下载 cure-dolly-zh.epub](https://github.com/lanbingyue1/cure-script/releases/latest/download/cure-dolly-zh.epub)。全部版本见 [releases](https://github.com/lanbingyue1/cure-script/releases/)。

## 相对原版改了什么

相对原项目（英文版），本项目主要做了这些改动：

1. **新增中文翻译**：在 `config/docs/zh/` 下新增 99 课正文，以及 `about`（简介）与 `index`（首页）。`original.md` 保留英文原文，不翻译。
2. **站点接入**：在 `config/.vitepress/config.mts` 中增加 `zh` locale（`lang: zh-CN`）与中文导航；在 `config/.vitepress/sidebar.mts` 中增加 `/zh/` 侧边栏。
3. **中文本地搜索**：覆盖 minisearch 的 `tokenize`，对 CJK 连续串逐字拆分。否则中文整句会被当成单个 token，中文查询会 0 命中；英文 / 俄文仍按空格切分，行为不变。
4. **EPUB 生成**：`epublish` 增加 `-V lang`（`zh` → `zh-CN`）与中文书名 / 描述，并把 `dc:language` 统一为译本语言；`config/stylesheet.css` 增加中文（CJK）字体栈，且只作用于 `html[lang^="zh"]`，不影响英文 / 俄文版。
5. **中文课程文件名**：把课程文件名改为中文（英文标题译为中文，日文部分保留）。

> 原项目本身相对转录稿的改动（下划线改加粗、引号改着色 `highlighted`、注释改专用容器、课程分组、合并段落等）沿用不变，详见[中文版简介](https://lanbingyue1.github.io/cure-script/zh/about)。

## 本地构建

需要先安装 [Node.js](https://nodejs.org/)（构建网站）与 [pandoc](https://pandoc.org/)（生成 EPUB）。

```sh
git clone https://github.com/lanbingyue1/cure-script
cd cure-script

# 构建 / 预览网页版
npm install
npm run docs:dev      # 本地开发预览
npm run docs:build    # 构建静态网站

# 生成 EPUB（英文 / 俄文 / 中文各一份）
chmod 755 epublish
./epublish
```

说明：`epublish` 是一个 shell 脚本，**Windows 用户请在 Git Bash 中运行**；pandoc 也需单独安装（macOS 可用 `brew install pandoc`，Windows 可从 pandoc 官网下载安装包）。EPUB 生成后会输出到仓库根目录，例如中文版为 `cure-dolly-zh.epub`。

## 致谢

- 转录：Mordraug、Nunko（[Google Docs 原始转录](https://docs.google.com/document/d/1XpuXerkGU8waJ4DPDNJA4bGeqOvM-csXjTe57iHARHc/)）
- 原项目与网页版：[Kellen（Kellenok）](https://bento.me/kln)
- 离线 EPUB 支持：[coffeepebble](https://github.com/coffeepebble)
- 中文翻译：本项目贡献者

在所有改动过程中，可能还有别的地方坏了，但应该没有严重的问题。
