import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ===== 类型定义 =====

/** 文档 Frontmatter 元数据结构 */
export interface DocFrontmatter {
  title?: string;
  order?: number;
  pin?: boolean;
  tags?: string[];
  description?: string;
}

/** 单个文档文件的数据结构 */
export interface DocFile {
  title: string;
  slug: string;
  filePath: string;
  relativePath: string;
  order: number;
  pin: boolean;
  tags: string[];
  description: string;
  content: string;
  rawContent: string;
  excerpt: string;
  headings: { level: number; text: string; id: string }[];
}

/** 文档分类节点 */
export interface DocCategory {
  name: string;
  path: string;
  depth: number;
  files: DocFile[];
  children: DocCategory[];
  totalCount: number;
}

/** 完整的文档树结构 */
export interface DocsTree {
  categories: DocCategory[];
  allFiles: DocFile[];
  allTags: string[];
}

// ===== 常量 =====

/** 文档根目录路径 */
const DOCS_DIR = path.join(process.cwd(), "docs");

// ===== 工具函数 =====

/** 从 Markdown 内容中提取标题列表 */
function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // 生成 URL 友好的锚点 ID（支持中文）
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ level, text, id });
  }
  return headings;
}

/** 提取文档内容摘要（去除 Markdown 语法符号） */
function getExcerpt(content: string, maxLen = 200): string {
  const clean = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^#+\s+.+$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[*_`~\[\]]/g, "")
    .trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) + "..." : clean;
}

/** 解析单个 Markdown 文件，提取 frontmatter 和内容 */
function parseDocFile(filePath: string, docsDir: string): DocFile {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as DocFrontmatter;

  const relativePath = path.relative(docsDir, filePath).replace(/\\/g, "/");
  const withoutExt = relativePath.replace(/\.md$/, "");
  const fileName = path.basename(withoutExt);
  const slug = withoutExt;

  const title = fm.title || fileName;
  const order = fm.order ?? 999;
  const pin = fm.pin ?? false;
  const tags = fm.tags ?? [];
  const description = fm.description ?? "";
  const headings = extractHeadings(content);
  const excerpt = fm.description || getExcerpt(content);

  return {
    title,
    slug,
    filePath,
    relativePath,
    order,
    pin,
    tags,
    description,
    content,
    rawContent: raw,
    excerpt,
    headings,
  };
}

/** 对文件列表排序：置顶优先，再按 order 升序，最后按标题排序 */
function sortFiles(files: DocFile[]): DocFile[] {
  return [...files].sort((a, b) => {
    if (a.pin && !b.pin) return -1;
    if (!a.pin && b.pin) return 1;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title, "zh-CN");
  });
}

/** 构建单个目录对应的分类节点（一个目录 = 一个分类） */
function buildCategory(dirPath: string, docsDir: string, depth: number): DocCategory | null {
  if (!fs.existsSync(dirPath)) return null;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files: DocFile[] = [];
  const children: DocCategory[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const child = buildCategory(fullPath, docsDir, depth + 1);
      if (child) children.push(child);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(parseDocFile(fullPath, docsDir));
    }
  }

  // 空目录不生成分类
  if (files.length === 0 && children.length === 0) return null;

  const relPath = path.relative(docsDir, dirPath).replace(/\\/g, "/");
  return {
    name: path.basename(dirPath),
    path: relPath,
    depth,
    files: sortFiles(files),
    children,
    totalCount: files.length + children.reduce((sum, c) => sum + c.totalCount, 0),
  };
}

/** 递归构建文档分类树 */
function buildCategoryTree(dirPath: string, docsDir: string, depth = 0): DocCategory[] {
  if (!fs.existsSync(dirPath)) return [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const categories: DocCategory[] = [];
  const rootFiles: DocFile[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const cat = buildCategory(fullPath, docsDir, depth + 1);
      if (cat) categories.push(cat);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      rootFiles.push(parseDocFile(fullPath, docsDir));
    }
  }

  // 根目录下的散落文件归入"文档"虚拟分类
  if (rootFiles.length > 0) {
    categories.unshift({
      name: "文档",
      path: "",
      depth,
      files: sortFiles(rootFiles),
      children: [],
      totalCount: rootFiles.length,
    });
  }

  return categories;
}

// ===== 主要导出 API =====

/** 获取完整的文档树结构（扫描 docs/ 目录） */
export function getDocsTree(): DocsTree {
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  const categories = buildCategoryTree(DOCS_DIR, DOCS_DIR);
  const allFiles = getAllFiles(DOCS_DIR);
  const allTags = [...new Set(allFiles.flatMap((f) => f.tags))].sort();

  return { categories, allFiles, allTags };
}

/** 递归获取目录下所有文档文件 */
function getAllFiles(dir: string): DocFile[] {
  if (!fs.existsSync(dir)) return [];
  const files: DocFile[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(parseDocFile(fullPath, DOCS_DIR));
    }
  }
  return files;
}

/** 根据 URL slug 获取单个文档（自动解码 URL 编码的中文路径） */
export function getDocBySlug(slug: string[]): DocFile | null {
  const decodedSlug = slug.map((s) => decodeURIComponent(s));
  const slugPath = decodedSlug.join("/");
  const filePath = path.join(DOCS_DIR, slugPath + ".md");
  if (!fs.existsSync(filePath)) return null;
  return parseDocFile(filePath, DOCS_DIR);
}

/** 获取所有文档的 URL slug（用于静态生成） */
export function getAllSlugs(): string[][] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  const slugs: string[][] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const rel = path.relative(DOCS_DIR, fullPath).replace(/\\/g, "/");
        slugs.push(rel.replace(/\.md$/, "").split("/"));
      }
    }
  }
  walk(DOCS_DIR);
  return slugs;
}

/** 获取当前文档的上一篇和下一篇（自动解码 URL 编码的中文路径） */
export function getAdjacentDocs(slug: string[]): { prev: DocFile | null; next: DocFile | null } {
  const tree = getDocsTree();
  const flatFiles = sortFiles(tree.allFiles);
  const decodedSlug = slug.map((s) => decodeURIComponent(s));
  const currentSlug = decodedSlug.join("/");
  const idx = flatFiles.findIndex((f) => f.slug === currentSlug);

  return {
    prev: idx > 0 ? flatFiles[idx - 1] : null,
    next: idx < flatFiles.length - 1 ? flatFiles[idx + 1] : null,
  };
}

/** 获取搜索索引数据（截取前 2000 字符用于搜索） */
export function getSearchIndex() {
  const tree = getDocsTree();
  return tree.allFiles.map((f) => ({
    slug: f.slug,
    title: f.title,
    tags: f.tags,
    description: f.description,
    excerpt: f.excerpt,
    content: f.content.slice(0, 2000),
  }));
}
