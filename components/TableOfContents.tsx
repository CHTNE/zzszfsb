"use client";

import { useEffect, useState } from "react";

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

/** 文章内目录（TOC）组件 - 支持滚动高亮 */
export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // 使用 IntersectionObserver 监听标题元素，实现滚动高亮
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <div className="hidden xl:block sticky top-20 w-56 flex-shrink-0 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <h4 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3 px-2">
        目录
      </h4>
      <nav>
        {headings.map((h, i) => (
          <a
            key={i}
            href={`#${h.id}`}
            className={`toc-link ${activeId === h.id ? "active" : ""}`}
            style={{ paddingLeft: `${(h.level - minLevel) * 12 + 8}px` }}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(h.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#${h.id}`);
              }
            }}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
