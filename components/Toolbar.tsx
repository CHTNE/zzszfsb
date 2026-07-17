"use client";

import ThemeToggle from "./ThemeToggle";

/** 顶部工具栏组件 - 包含搜索按钮和主题切换 */
export default function Toolbar() {
  return (
    <div
      className="sticky top-[57px] z-20 flex items-center justify-end px-6 py-2 border-b"
      style={{ borderColor: "var(--sidebar-border)", background: "var(--background)" }}
    >
      <div className="flex items-center gap-2">
        {/* 搜索触发按钮 */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          style={{ borderColor: "var(--sidebar-border)" }}
          onClick={() =>
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))
          }
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">搜索文档</span>
          <kbd className="hidden sm:inline text-xs text-foreground/40">Ctrl+K</kbd>
        </button>
        {/* 主题切换按钮 */}
        <ThemeToggle />
      </div>
    </div>
  );
}
