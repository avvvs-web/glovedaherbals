import { Icon } from "@/components/shop/ui/Icon";
import { activeConcerns } from "@/lib/shop/concerns";
import type { ShopProduct } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

/** Shop by concern: each concern with the number of products whose own description speaks to it. */
export function ConcernLinks({ products }: { products: ShopProduct[] }) {
  const live = activeConcerns(products);
  if (!live.length) return null;
  const areas = [...new Set(live.map((c) => c.area))];
  return (
    <div className="gx-concerns">
      {areas.map((area) => (
        <div key={area} className="gx-concerns__group">
          <h3 className="gx-label">{area}</h3>
          <ul className="gx-concerns__list" role="list">
            {live
              .filter((c) => c.area === area)
              .map((c) => (
                <li key={c.slug}>
                  <a className="gx-concern" href={shopUrl(`/concerns/${c.slug}`)}>
                    <span className="gx-concern__name">{c.name}</span>
                    <span className="gx-concern__count">
                      {c.count} {c.count === 1 ? "product" : "products"}
                    </span>
                    <Icon name="arrow" size={18} />
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
