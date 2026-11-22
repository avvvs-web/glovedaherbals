import Image from "next/image";
import type { ShopImage } from "@/lib/shop/data";

/**
 * The one way a product photo is shown in the shop: a 4:5 sand plate, cropped the same way everywhere.
 * With a pointer, the second photo fades in on hover or focus within the card.
 */
export function Plate({ images, sizes = "(min-width: 64rem) 22vw, 45vw", priority = false, transitionName }: { images: ShopImage[]; sizes?: string; priority?: boolean; transitionName?: string }) {
  const [first, second] = images;
  return (
    <div className="gx-plate" style={transitionName ? { viewTransitionName: transitionName } : undefined}>
      {first ? <Image src={first.src} alt="" width={first.width} height={first.height} sizes={sizes} priority={priority} /> : null}
      {second ? <Image className="gx-plate__alt" src={second.src} alt="" width={second.width} height={second.height} sizes={sizes} loading="lazy" /> : null}
    </div>
  );
}
