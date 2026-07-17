# 知识库 Wiki

基于 **Next.js** 构建的现代化知识库站点，只需在 `docs/` 目录下编写 Markdown 文件，即可自动生成 Wiki 页面。

## 功能特性

- **自动扫描** — 新增 `.md` 文件后自动识别并添加到 Wiki
- **文件夹分类** — 通过文件夹结构自动组织文档分类，支持多级嵌套
- **Frontmatter 元数据** — 支持标题、排序、标签、置顶等配置
- **全文搜索** — `Ctrl+K` 快捷键快速搜索文档标题、标签和内容
- **暗色/亮色主题** — 一键切换，支持跟随系统
- **响应式设计** — 完美适配桌面端和移动端
- **文章目录 (TOC)** — 右侧浮动目录，滚动高亮
- **面包屑导航** — 清晰展示当前文档路径
- **翻页导航** — 上一篇/下一篇快速切换
- **代码高亮** — 支持多语言语法高亮

## 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

启动后访问 [http://localhost:3000](http://localhost:3000) 即可查看 Wiki。

## 如何添加文档

### 1. 创建 Markdown 文件

在 `docs/` 目录下创建文件夹（作为分类），然后在文件夹内创建 `.md` 文件：

```
docs/
├── 快速开始/
│   ├── 介绍.md
│   └── 安装.md
├── 指南/
│   ├── 基础用法.md
│   └── 高级技巧.md
└── API/
    └── 接口文档.md
```

### 2. Frontmatter 配置（可选）

在 Markdown 文件头部添加 YAML 元数据：

```yaml
---
title: 自定义标题        # 可选，默认使用文件名
order: 1                # 排序权重，数字越小越靠前，默认 999
pin: true               # 置顶文章，在首页和分类中优先展示
tags: [前端, Vue]        # 标签列表，用于搜索和筛选
description: 简要描述     # 可选，用于搜索索引和列表预览
---
```

### 3. 排序规则

- **置顶文章**：`pin: true` 的文章始终排在最前面
- **自定义排序**：按 `order` 字段升序排列
- **默认排序**：没有 `order` 的文件按标题（中文拼音）排序

## 项目结构

```
├── app/                    # Next.js 页面
│   ├── layout.tsx          # 根布局（主题、字体）
│   ├── page.tsx            # 首页（置顶文章 + 分类概览）
│   ├── globals.css         # 全局样式 + Markdown 样式
│   └── docs/
│       └── [...slug]/
│           └── page.tsx    # 文档详情页（动态路由）
├── components/             # React 组件
│   ├── Sidebar.tsx         # 侧边栏（分类树、折叠）
│   ├── SearchDialog.tsx    # 搜索弹窗（Ctrl+K）
│   ├── TableOfContents.tsx # 文章目录（TOC）
│   ├── ThemeToggle.tsx     # 主题切换
│   ├── Breadcrumb.tsx      # 面包屑导航
│   ├── DocPagination.tsx   # 上/下一篇导航
│   ├── TagBadge.tsx        # 标签徽章
│   ├── MarkdownRenderer.tsx# Markdown 渲染器
│   ├── Toolbar.tsx         # 顶部工具栏
│   └── WikiLayout.tsx      # 页面整体布局
├── lib/                    # 工具函数
│   ├── docs.ts             # 文档扫描、解析、排序核心逻辑
│   └── search.ts           # 全文搜索索引
└── docs/                   # 文档目录（在这里写 Markdown 文件）
```

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js (App Router) | 框架、路由、静态生成 |
| React | UI 组件 |
| TypeScript | 类型安全 |
| Tailwind CSS | 样式系统 |
| react-markdown + remark-gfm | Markdown 渲染 |
| rehype-highlight | 代码语法高亮 |
| gray-matter | Frontmatter 解析 |
| flexsearch | 客户端全文搜索 |
| next-themes | 主题切换 |

## 部署

项目支持静态导出，可部署到任意服务器：

```bash
# 构建静态站点
npm run build

# 输出目录为 .next/，可通过 next start 运行
npm start
```

如需部署到子路径（如 `https://example.com/wiki/`），在 `next.config.ts` 中添加：

```typescript
const nextConfig: NextConfig = {
  basePath: '/wiki',
};
```

## 许可证

MIT
