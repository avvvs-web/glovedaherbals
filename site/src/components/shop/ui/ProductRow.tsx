import Image from "next/image";
import { formatMoney, type ShopProduct } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";
import { AddButton } from "./AddButton";
import { Heart } from "./Heart";

/** One product as a line in a list: photo, name, price, save, add. The Index is built from these. */
export function ProductRow({ product, note }: { product: ShopProduct; note?: string }) {
  const v = product.variants.find((x) => x.available) ?? product.variants[0];
  const img = product.images[0];
  return (
    <li className="gx-row">
      <span className="gx-row__thumb">{img ? <Image src={img.src} alt="" width={128} height={160} sizes="64px" /> : null}</span>
      <span className="gx-row__name">
        <a className="gx-row__link" href={shopUrl(`/products/${product.handle}`)}>
          {product.title}
        </a>
        {note ? <span className="gx-row__note">{note}</span> : null}
      </span>
      <span className="gx-row__price">{product.available ? formatMoney(v.price) : "Sold out"}</span>
      <Heart handle={product.handle} title={product.title} />
      <AddButton variantId={v.id} available={product.available} title={product.title} compact />
    </li>
  );
}
