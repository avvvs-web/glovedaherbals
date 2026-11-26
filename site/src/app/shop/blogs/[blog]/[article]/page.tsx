import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalDown } from "@/components/blog/ArticleList";
import { ProductRow } from "@/components/shop/ui/ProductRow";
import { formatDate, getArticle, getArticles, mentionedProducts } from "@/lib/blog";
import { getProducts } from "@/lib/shop/data";
import { BRAND, shopUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/shop/blogs/[blog]/[article]">): Promise<Metadata> {
  const { blog, article } = await params;
  const a = await getArticle(blog, article);
  if (!a) return { title: "Journal" };
  const url = shopUrl(`/blogs/${a.blog}/${a.handle}`);
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: url },
    openGraph: { type: "article", title: a.title, description: a.excerpt, url, publishedTime: a.published, modifiedTime: a.updated },
  };
}

/** One article: the store's own text, then the Gloveda products it names, with live prices. */
export default async function ArticlePage({ params }: PageProps<"/shop/blogs/[blog]/[article]">) {
  const { blog, article } = await params;
  const a = await getArticle(blog, article);
  if (a === undefined) notFound();
  if (a === null)
    return (
      <section className="gl-section shop-page">
        <div className="gl-container gl-container--narrow">
          <JournalDown />
        </div>
      </section>
    );
  const [products, all] = await Promise.all([getProducts(), getArticles()]);
  const named = mentionedProducts(a, products ?? []);
  const more = (all ?? []).filter((x) => !(x.blog === a.blog && x.handle === a.handle)).slice(0, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    datePublished: a.published,
    dateModified: a.updated,
    author: { "@type": "Organization", name: BRAND },
    publisher: { "@type": "Organization", name: BRAND },
    mainEntityOfPage: shopUrl(`/blogs/${a.blog}/${a.handle}`),
  };

  return (
    <article className="gl-section shop-page journal" aria-labelledby="article-title">
      <div className="gl-container gl-container--narrow">
        <nav aria-label="Breadcrumb" className="gx-pdp__crumbs journal__crumbs">
          <a href={shopUrl("/blogs")}>Journal</a>
          <span aria-hidden="true">/</span>
          <a href={shopUrl(`/blogs/${a.blog}`)}>{a.blogTitle}</a>
        </nav>
        <h1 id="article-title" className="gx-display journal__h1">
          {a.title}
        </h1>
        <p className="journal__meta">
          <span>{a.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={a.published}>{formatDate(a.published)}</time>
          <span aria-hidden="true">·</span>
          <span>{a.minutes} min read</span>
        </p>
        <hr className="gl-rule gl-rule--ornament journal__rule" />
        {/* The store's own article HTML, cleaned to a short list of tags in lib/blog.ts. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: a.html }} />

        {named.length ? (
          <section className="journal__products" aria-labelledby="named-title">
            <h2 id="named-title" className="gx-label">
              In this article
            </h2>
            <ul className="gx-list" role="list">
              {named.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </ul>
          </section>
        ) : null}

        {more.length ? (
          <section className="journal__more" aria-labelledby="more-title">
            <h2 id="more-title" className="gx-label">
              More from the Journal
            </h2>
            <ul className="journal__moreList" role="list">
              {more.map((m) => (
                <li key={`${m.blog}/${m.handle}`}>
                  <a className="journal__link" href={shopUrl(`/blogs/${m.blog}/${m.handle}`)}>
                    {m.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  );
}
