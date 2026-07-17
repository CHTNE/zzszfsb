"use client";

import Link from "next/link";
import type { DocFile } from "@/lib/docs";
import { encodeDocSlug } from "@/lib/slug";

interface DocPaginationProps {
  prev: DocFile | null;
  next: DocFile | null;
}

/** 上/下一篇翻页导航组件 */
export default function DocPagination({ prev, next }: DocPaginationProps) {
  return (
    <div className="flex items-stretch gap-4 mt-12 pt-8 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
      {prev ? (
        <Link
          href={encodeDocSlug(prev.slug)}
          className="flex-1 group p-4 rounded-lg border hover:border-transparent hover:shadow-md transition-all"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <span className="text-xs text-foreground/50 flex items-center gap-1 mb-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            上一篇
          </span>
          <span className="text-sm font-medium group-hover:text-[var(--link-color)] transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={encodeDocSlug(next.slug)}
          className="flex-1 group p-4 rounded-lg border hover:border-transparent hover:shadow-md transition-all text-right"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <span className="text-xs text-foreground/50 flex items-center justify-end gap-1 mb-1">
            下一篇
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span className="text-sm font-medium group-hover:text-[var(--link-color)] transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
