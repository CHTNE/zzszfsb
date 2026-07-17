/** 将中文 slug 各段进行 URL 编码，确保浏览器和 Next.js 路由正确匹配 */
export function encodeDocSlug(slug: string) {
  return "/docs/" + slug.split("/").map(encodeURIComponent).join("/");
}
