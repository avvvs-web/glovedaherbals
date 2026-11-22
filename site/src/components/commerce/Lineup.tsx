import Image from "next/image";
import { lineup } from "@/lib/catalogue";
import { shopUrl } from "@/lib/site";
import { formatPrice, getCommerce } from "@/lib/shopify";

/** The seven products from the film. Price and stock appear only when Shopify answers. */
export async function Lineup() {
  const commerce = await getCommerce(lineup.map((p) => p.handle));
  return (
    <ul className="lineup" role="list">
      {lineup.map((p) => {
        const c = commerce?.get(p.handle);
        return (
          <li key={p.handle} className="gl-product-card">
            <div className="gl-product-card__media">
              <Image src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 30vw, 45vw" />
            </div>
            <div className="gl-product-card__body">
              <h3 className="gl-product-card__title">
                <a className="gl-product-card__link" href={shopUrl(`/products/${p.handle}`)}>
                  {p.title}
                </a>
              </h3>
              {c ? (
                <p className="gl-product-card__price">
                  {c.availableForSale ? formatPrice(c.price) : `${formatPrice(c.price)}, sold out`}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
