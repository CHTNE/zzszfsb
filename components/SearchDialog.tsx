"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { initSearch, searchDocs, type SearchItem } from "@/lib/search";
import { encodeDocSlug } from "@/lib/slug";

interface SearchDialogProps {
  searchData: {
    slug: string;
    title: string;
    tags: string[];
    description: string;
    excerpt: string;
    content: string;
  }[];
}

/** 全文搜索弹窗组件 - 支持 Ctrl+K 快捷键打开 */
export default function SearchDialog({ searchData }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 初始化搜索索引
  useEffect(() => {
    initSearch(searchData);
  }, [searchData]);

  // 监听全局快捷键
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setQuery("");
        setResults([]);
        setActiveIndex(0);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 打开弹窗后自动聚焦输入框
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  /** 处理搜索输入 */
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) {
      const r = searchDocs(value);
      setResults(r);
      setActiveIndex(0);
    } else {
      setResults([]);
    }
  }, []);

  /** 选中搜索结果并跳转 */
  const handleSelect = useCallback(
    (slug: string) => {
      setIsOpen(false);
      router.push(encodeDocSlug(slug));
    },
    [router]
  );

  /** 处理键盘导航（上下方向键 + 回车） */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        handleSelect(results[activeIndex].slug);
      }
    },
    [results, activeIndex, handleSelect]
  );

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={() => setIsOpen(false)}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
        {/* 搜索输入框 */}
        <div className="flex items-center px-4 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
          <svg className="w-5 h-5 text-foreground/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索文档... (输入关键词)"
            className="flex-1 px-3 py-4 bg-transparent outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-foreground/40 border rounded" style={{ borderColor: "var(--sidebar-border)" }}>
            ESC
          </kbd>
        </div>

        {/* 搜索结果列表 */}
        <div className="overflow-y-auto flex-1 p-2">
          {query && results.length === 0 && (
            <div className="text-center py-8 text-foreground/50 text-sm">
              没有找到匹配的结果
            </div>
          )}
          {!query && (
            <div className="text-center py-8 text-foreground/50 text-sm">
              输入关键词搜索标题、标签和内容
            </div>
          )}
          {results.map((item, i) => (
            <button
              key={item.slug}
              onClick={() => handleSelect(item.slug)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                i === activeIndex
                  ? "bg-[var(--link-color)]/10"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{item.title}</span>
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {item.excerpt && (
                <p className="text-xs text-foreground/50 line-clamp-2">{item.excerpt}</p>
              )}
            </button>
          ))}
        </div>

        {/* 底部快捷键提示 */}
        <div className="flex items-center gap-4 px-4 py-2 border-t text-xs text-foreground/40" style={{ borderColor: "var(--sidebar-border)" }}>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 border rounded" style={{ borderColor: "var(--sidebar-border)" }}>↑↓</kbd>
            导航
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 border rounded" style={{ borderColor: "var(--sidebar-border)" }}>↵</kbd>
            打开
          </span>
        </div>
      </div>
    </div>
  );
}
