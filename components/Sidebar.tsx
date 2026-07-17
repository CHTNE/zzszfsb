"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { DocCategory } from "@/lib/docs";
import { encodeDocSlug } from "@/lib/slug";

interface SidebarProps {
  categories: DocCategory[];
  isOpen: boolean;
  onClose: () => void;
}

/** 分类树节点组件 */
function CategoryNode({
  category,
  currentPath,
  defaultOpen,
}: {
  category: DocCategory;
  currentPath: string;
  defaultOpen?: boolean;
}) {
  const hasChildren = category.children.length > 0;
  const hasFiles = category.files.length > 0;
  const isCurrentInCategory =
    category.path && currentPath.startsWith("/docs/" + category.path);
  const [open, setOpen] = useState(defaultOpen || isCurrentInCategory);

  if (!hasFiles && !hasChildren) return null;

  return (
    <div className="mb-1">
      {/* 分类标题（可折叠） */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center w-full px-3 py-1.5 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
      >
        <svg
          className={`w-3 h-3 mr-1 transition-transform ${open ? "rotate-90" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
        <span className="flex-1 text-left">{category.name}</span>
        <span className="text-xs text-foreground/40 ml-1">{category.totalCount}</span>
      </button>

      {/* 分类下的文件列表 */}
      {open && (
        <div className="ml-3 border-l border-foreground/10 pl-2">
          {category.files.map((file) => (
            <Link
              key={file.slug}
              href={encodeDocSlug(file.slug)}
              className={`sidebar-item ${
                currentPath === encodeDocSlug(file.slug) ? "active" : ""
              }`}
            >
              {file.pin && (
                <svg className="w-3 h-3 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              <span className="truncate">{file.title}</span>
            </Link>
          ))}
          {/* 子分类递归渲染 */}
          {category.children.map((child) => (
            <CategoryNode
              key={child.path}
              category={child}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** 侧边栏导航组件 - 展示文档分类树 */
export default function Sidebar({ categories, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 overflow-y-auto
          border-r transition-transform duration-250
          lg:sticky lg:top-0 lg:z-0 lg:translate-x-0 lg:h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: "var(--sidebar-bg)",
          borderColor: "var(--sidebar-border)",
        }}
      >
        {/* 侧边栏标题区域 */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 border-b"
          style={{ background: "var(--sidebar-bg)", borderColor: "var(--sidebar-border)" }}
        >
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            枣庄三中封神榜
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
            aria-label="关闭侧边栏"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 分类树导航 */}
        <nav className="px-2 py-3">
          {categories.map((cat) => (
            <CategoryNode
              key={cat.path || "root"}
              category={cat}
              currentPath={pathname}
              defaultOpen
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
