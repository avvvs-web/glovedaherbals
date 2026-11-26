import type { Metadata } from "next";
import { ArticleList, JournalDown } from "@/components/blog/ArticleList";
import { BLOGS, getArticles } from "@/lib/blog";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on Ayurvedic skin and hair care from Gloveda Herbals: herbs, rituals and how to use our products.",
  alternates: { canonical: shopUrl("/blogs") },
};

/** The Journal: every article from the store's blogs, newest first. */
export default async function JournalPage() {
  const articles = await getArticles();
  const used = BLOGS.filter((b) => articles?.some((a) => a.blog === b.handle));
  return (
    <section className="gl-section shop-page journal" aria-labelledby="journal-title">
      <div className="gl-container gl-container--narrow">
        <header className="journal__head">
          <p className="gx-label">Journal</p>
          <h1 id="journal-title" className="gx-display">
            Notes on Ayurvedic care.
          </h1>
          <p className="gx-lead">Herbs, rituals and how to use what we make, from Gloveda Herbals.</p>
          {used.length > 1 ? (
            <nav aria-label="Journal topics" className="journal__topics">
              {used.map((b) => (
                <a key={b.handle} className="gl-chip" href={shopUrl(`/blogs/${b.handle}`)}>
                  {b.title}
                </a>
              ))}
            </nav>
          ) : null}
        </header>
        {articles === null ? <JournalDown /> : articles.length ? <ArticleList articles={articles} /> : <p className="gl-body">New articles will appear here soon.</p>}
      </div>
    </section>
  );
}
