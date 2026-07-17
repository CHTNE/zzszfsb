import Link from "next/link";

interface BreadcrumbProps {
  slug: string[];
  title: string;
}

/** 面包屑导航组件（自动解码 URL 编码的中文路径） */
export default function Breadcrumb({ slug, title }: BreadcrumbProps) {
  const parts = slug.slice(0, -1).map((s) => decodeURIComponent(s));

  return (
    <nav className="flex items-center gap-1.5 text-sm text-foreground/50 mb-6 flex-wrap">
      <Link href="/" className="hover:text-foreground transition-colors" title="返回首页">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
      <span>/</span>
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="hover:text-foreground transition-colors">{part}</span>
          <span>/</span>
        </span>
      ))}
      <span className="text-foreground font-medium">{title}</span>
    </nav>
  );
}
