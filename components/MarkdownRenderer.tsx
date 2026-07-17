"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
  content: string;
}

/** Markdown 内容渲染器 - 支持 GFM、代码高亮、图片、自动锚点 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="wiki-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeRaw]}
        components={{
          // 外部链接在新标签页打开
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              {...props}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          // 图片渲染：支持 Markdown 语法和 HTML <img> 标签
          img: ({ src, alt, ...props }) => (
            <figure className="wiki-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt || ""} loading="lazy" {...props} />
              {alt && <figcaption>{alt}</figcaption>}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
