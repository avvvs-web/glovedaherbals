import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleList, JournalDown } from "@/components/blog/ArticleList";
import { BLOGS, blogByHandle, getArticles } from "@/lib/blog";
import { shopUrl } from "@/lib/site";

export const generateStaticParams = () => BLOGS.map((b) => ({ blog: b.handle }));

export async function generateMetadata({ params }: PageProps<"/shop/blogs/[blog]">): Promise<Metadata> {
  const { blog } = await params;
  const b = blogByHandle(blog);
  const description = b ? `${b.title} articles from the Gloveda Herbals Journal: notes on Ayurvedic skin and hair care.` : undefined;
  return { title: b ? `${b.title}: Journal` : "Journal", description, alternates: { canonical: shopUrl(`/blogs/${blog}`) }, ...(b?.handle && description ? { openGraph: { title: `${b.title}: Journal | Gloveda Herbals`, description, url: shopUrl(`/blogs/${blog}`) } } : {}) };
}

/** One of the store's blogs (its old address, /blogs/beauty, keeps working). */
export default async function BlogPage({ params }: PageProps<"/shop/blogs/[blog]">) {
  const { blog } = await params;
  const b = blogByHandle(blog);
  if (!b) notFound();
  const all = await getArticles();
  const articles = all?.filter((a) => a.blog === b.handle) ?? null;
  return (
    <section className="gl-section shop-page journal" aria-labelledby="blog-title">
      <div className="gl-container gl-container--narrow">
        <header className="journal__head">
          <a className="gx-more" href={shopUrl("/blogs")}>
            Journal
          </a>
          <h1 id="blog-title" className="gx-display">
            {b.title}
          </h1>
        </header>
        {articles === null ? (
          <JournalDown />
        ) : articles.length ? (
          <ArticleList articles={articles} />
        ) : (
          <p className="gl-body">
            No articles here yet. <a className="gl-link" href={shopUrl("/blogs")}>Read the rest of the Journal</a>.
          </p>
        )}
      </div>
    </section>
  );
}
