import type { Metadata } from "next";
import { ProductGrid, StoreDown } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: PageProps<"/shop/search">) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.trim().slice(0, 80) : "";
  const products = await getProducts();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = products && words.length ? products.filter((p) => words.every((w) => `${p.title} ${p.tags.join(" ")}`.toLowerCase().includes(w))) : [];

  return (
    <section className="gl-section shop-page" aria-labelledby="search-title">
      <div className="gl-container">
        <h1 id="search-title" className="gl-h1 shop-page__title">
          Search
        </h1>
        <form className="shop-search" action={shopUrl("/search")} role="search">
          <div className="gl-field">
            <label className="gl-label" htmlFor="q">
              Search products
            </label>
            <div className="gl-inline-field">
              <input className="gl-input" id="q" name="q" type="search" defaultValue={q} autoComplete="off" />
              <button className="gl-btn" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
        {!products ? (
          <StoreDown />
        ) : q ? (
          <>
            <p className="gl-small shop-search__count" role="status">
              {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
            </p>
            {results.length ? <ProductGrid products={results} /> : <p className="gl-body">No products match that. Try a product name, such as shampoo or face wash.</p>}
          </>
        ) : null}
      </div>
    </section>
  );
}
