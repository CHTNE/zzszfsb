"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import type { DocCategory } from "@/lib/docs";

interface WikiLayoutProps {
  categories: DocCategory[];
  children: React.ReactNode;
  headerContent: React.ReactNode;
}

/** Wiki 页面整体布局组件 - 管理侧边栏状态和页面框架 */
export default function WikiLayout({ categories, children, headerContent }: WikiLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏（桌面端常驻，移动端抽屉式） */}
      <Sidebar categories={categories} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航栏 - 包含移动端菜单按钮 */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b backdrop-blur-sm"
          style={{ borderColor: "var(--sidebar-border)", background: "color-mix(in srgb, var(--background) 85%, transparent)" }}
        >
          <div className="flex items-center gap-3">
            {/* 移动端侧边栏切换按钮 */}
            <button
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="切换侧边栏"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {headerContent}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
