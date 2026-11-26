import { formatDate, type Article } from "@/lib/blog";
import { shopUrl } from "@/lib/site";

/** The Journal's list: each article as a line with its blog, date, title, opening and reading time. */
export function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <ol className="journal__list" role="list">
      {articles.map((a) => (
        <li key={`${a.blog}/${a.handle}`} className="journal__item">
          <p className="journal__meta">
            <span>{a.blogTitle}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={a.published}>{formatDate(a.published)}</time>
            <span aria-hidden="true">·</span>
            <span>{a.minutes} min read</span>
          </p>
          <h2 className="journal__title">
            <a className="journal__link" href={shopUrl(`/blogs/${a.blog}/${a.handle}`)}>
              {a.title}
            </a>
          </h2>
          <p className="journal__excerpt">{a.excerpt}</p>
        </li>
      ))}
    </ol>
  );
}

/** Shown when Shopify's blog feeds cannot be reached. */
export function JournalDown() {
  return (
    <p className="gl-notice" role="status">
      The Journal could not be loaded just now. Please try again in a moment.
    </p>
  );
}
