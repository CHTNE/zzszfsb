import { notFound } from "next/navigation";
import { getDocBySlug, getAllSlugs, getDocsTree, getAdjacentDocs, getSearchIndex } from "@/lib/docs";
import Breadcrumb from "@/components/Breadcrumb";
import TableOfContents from "@/components/TableOfContents";
import DocPagination from "@/components/DocPagination";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import SearchDialog from "@/components/SearchDialog";
import TagBadge from "@/components/TagBadge";
import WikiLayout from "@/components/WikiLayout";
import Toolbar from "@/components/Toolbar";

interface DocPageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};
  return {
    title: `${doc.title} - 枣庄三中封神榜`,
    description: doc.description || doc.excerpt,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const tree = getDocsTree();
  const { prev, next } = getAdjacentDocs(slug);
  const searchIndex = getSearchIndex();

  return (
    <>
      <WikiLayout
        categories={tree.categories}
        headerContent={<h1 key="site-title" className="text-lg font-semibold">枣庄三中封神榜</h1>}
      >
        <div>
          <SearchDialog searchData={searchIndex} />
          <Toolbar />

        {/* 内容区域 + 文章目录 */}
        <div className="flex flex-1 max-w-7xl mx-auto w-full">
          {/* 文章主体 */}
          <main className="flex-1 min-w-0 px-6 py-10 max-w-3xl">
            <Breadcrumb slug={slug} title={doc.title} />

            {/* 标题和元信息 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-3">
                {doc.pin && (
                  <svg className="w-6 h-6 text-amber-500 inline-block mr-2 -mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
                {doc.title}
              </h1>
              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {doc.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
              {doc.description && (
                <p className="mt-3 text-foreground/60">{doc.description}</p>
              )}
            </div>

            {/* Markdown 正文 */}
            <MarkdownRenderer content={doc.content} />

            {/* 上/下一篇 */}
            <DocPagination prev={prev} next={next} />
          </main>

          {/* 文章目录侧边栏 */}
          <div className="py-10 pr-6">
            <TableOfContents headings={doc.headings} />
          </div>
        </div>
        </div>
      </WikiLayout>
    </>
  );
}
