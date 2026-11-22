import type { Metadata } from "next";
import { ConcernLinks } from "@/components/shop/ConcernLinks";
import { StoreDown } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop by concern",
  description: "Find Gloveda Herbals products by what you want to care for: dryness, oily skin, marks, hair fall, dandruff and more.",
  alternates: { canonical: shopUrl("/concerns") },
};

export default async function ConcernsPage() {
  const products = await getProducts();
  return (
    <section className="gl-section shop-page" aria-labelledby="concerns-title">
      <div className="gl-container">
        <header className="gx-head">
          <p className="gx-label">Shop by concern</p>
          <h1 id="concerns-title" className="gx-display">
            Start with what you want to care for.
          </h1>
          <p className="gx-lead">Each list shows the products whose own description speaks to that concern, in Gloveda Herbals&rsquo; words.</p>
        </header>
        {products ? <ConcernLinks products={products} /> : <StoreDown />}
      </div>
    </section>
  );
}
