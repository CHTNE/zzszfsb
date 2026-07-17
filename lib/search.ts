"use client";

import FlexSearch from "flexsearch";

/** 搜索结果项数据结构 */
export interface SearchItem {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  excerpt: string;
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let searchIndex: any = null;
let searchData: SearchItem[] = [];

/** 初始化 FlexSearch 搜索索引 */
export function initSearch(data: SearchItem[]) {
  searchData = data;
  searchIndex = new FlexSearch.Document({
    document: {
      id: "slug",
      index: ["title", "tags", "description", "content"],
      store: true,
    },
    tokenize: "forward",
    cache: 100,
  });

  for (const item of data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchIndex.add(item as any);
  }
}

/** 执行全文搜索，返回匹配的文档列表 */
export function searchDocs(query: string, limit = 20): SearchItem[] {
  if (!searchIndex || !query.trim()) return [];

  const results = searchIndex.search(query, {
    limit,
    enrich: true,
  });

  const seen = new Set<string>();
  const items: SearchItem[] = [];

  if (Array.isArray(results)) {
    for (const result of results) {
      if (result && Array.isArray(result.result)) {
        for (const match of result.result) {
          const item = match?.doc || match;
          if (item && item.slug && !seen.has(item.slug)) {
            seen.add(item.slug);
            items.push(item as SearchItem);
          }
        }
      }
    }
  }

  return items;
}

/** 根据标签筛选文档 */
export function searchByTag(tag: string): SearchItem[] {
  return searchData.filter((item) => item.tags.includes(tag));
}
