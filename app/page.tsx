import Link from "next/link";
import { getDocsTree, getSearchIndex } from "@/lib/docs";
import { encodeDocSlug } from "@/lib/slug";
import SearchDialog from "@/components/SearchDialog";
import TagBadge from "@/components/TagBadge";
import WikiLayout from "@/components/WikiLayout";
import Toolbar from "@/components/Toolbar";

export default function HomePage() {
  const tree = getDocsTree();
  const searchIndex = getSearchIndex();
  const pinnedFiles = tree.allFiles.filter((f) => f.pin);

  return (
    <>
      <WikiLayout
        categories={tree.categories}
        headerContent={<h1 key="site-title" className="text-lg font-semibold">枣庄三中封神榜</h1>}
      >
        <div>
          <SearchDialog searchData={searchIndex} />
          <Toolbar />

        {/* 主要内容区域 */}
        <main className="flex-1 px-6 py-10 max-w-5xl mx-auto w-full">
          {/* 首屏介绍区域 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">枣庄三中封神榜 Wiki</h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              博君一笑，切勿在意。若有雷同，纯属故意。
            </p>
          </div>

          {/* 置顶文章 */}
          {pinnedFiles.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                置顶文章
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {pinnedFiles.map((file) => (
                  <Link key={file.slug} href={encodeDocSlug(file.slug)} className="group p-5 rounded-xl border hover:shadow-md transition-all" style={{ borderColor: "var(--sidebar-border)" }}>
                    <h3 className="font-semibold mb-2 group-hover:text-[var(--link-color)] transition-colors">{file.title}</h3>
                    {file.excerpt && <p className="text-sm text-foreground/60 line-clamp-2">{file.excerpt}</p>}
                    {file.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-3">
                        {file.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 分类网格 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">全部分类</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tree.categories.map((cat) => (
                <div key={cat.path || "root"} className="p-5 rounded-xl border transition-all hover:shadow-md" style={{ borderColor: "var(--sidebar-border)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <span className="text-xs text-foreground/40 ml-auto">{cat.totalCount} 篇</span>
                  </div>
                  <ul className="space-y-1">
                    {cat.files.slice(0, 5).map((file) => (
                      <li key={file.slug}>
                        <Link href={encodeDocSlug(file.slug)} className="text-sm text-foreground/60 hover:text-[var(--link-color)] transition-colors flex items-center gap-1.5">
                          {file.pin && <svg className="w-3 h-3 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                          <span className="truncate">{file.title}</span>
                        </Link>
                      </li>
                    ))}
                    {cat.totalCount > 5 && <li className="text-xs text-foreground/40 pt-1">还有 {cat.totalCount - 5} 篇...</li>}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 标签云 */}
          {tree.allTags.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">标签</h2>
              <div className="flex flex-wrap gap-2">
                {tree.allTags.map((tag) => <TagBadge key={tag} tag={tag} />)}
              </div>
            </section>
          )}

          {/* 空状态提示 */}
          {tree.allFiles.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-foreground/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">还没有文档</h3>
              <p className="text-foreground/50">
                在 <code className="text-sm px-2 py-0.5 rounded" style={{ background: "var(--code-bg)" }}>docs/</code> 目录下创建你的第一个 Markdown 文件
              </p>
            </div>
          )}
        </main>
        </div>
      </WikiLayout>
    </>
  );
}
