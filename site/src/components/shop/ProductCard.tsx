import { QuickView } from "@/components/shop/QuickView";
import { AddButton } from "@/components/shop/ui/AddButton";
import { Heart } from "@/components/shop/ui/Heart";
import { Plate } from "@/components/shop/ui/Plate";
import { formatMoney, type ShopProduct } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

/**
 * A product in a grid: the plate (with quick view and the heart), then the name, with the price and a
 * round add button on one line beneath. `named` gives the photo its page-transition name; leave it off
 * when the same product can appear twice on a page.
 */
export function ProductCard({ product, priority = false, named = true }: { product: ShopProduct; priority?: boolean; named?: boolean }) {
  const v = product.variants.find((x) => x.available) ?? product.variants[0];
  return (
    <li className="gx-card">
      <div className="gx-card__media">
        <Plate images={product.images} priority={priority} transitionName={named ? `product-${product.handle}` : undefined} />
        <div className="gx-card__actions">
          <Heart handle={product.handle} title={product.title} />
        </div>
        <QuickView
          product={{
            title: product.title,
            href: shopUrl(`/products/${product.handle}`),
            priceText: formatMoney(v.price),
            available: product.available,
            variantId: v.id,
            images: product.images,
            summary: product.description[0],
          }}
        />
      </div>
      <h3 className="gx-card__name">
        <a className="gx-card__link" href={shopUrl(`/products/${product.handle}`)}>
          {product.title}
        </a>
      </h3>
      <div className="gx-card__foot">
        <p className="gx-card__price">{product.available ? formatMoney(v.price) : "Sold out"}</p>
        <AddButton variantId={v.id} available={product.available} title={product.title} compact />
      </div>
    </li>
  );
}

export function ProductGrid({ products, named = true }: { products: ShopProduct[]; named?: boolean }) {
  return (
    <ul className="gx-tiles" role="list">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} named={named} />
      ))}
    </ul>
  );
}

/** Shown when the store cannot be reached: the page says so plainly instead of showing an empty shop. */
export function StoreDown() {
  return (
    <div className="gl-notice gl-notice--error" role="alert">
      <p>We couldn&rsquo;t load the shop just now. Please refresh in a moment.</p>
    </div>
  );
}
