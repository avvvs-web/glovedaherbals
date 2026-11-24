import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/shop/ui/Icon";
import { formatMoney, getCollectionProducts, getCollections } from "@/lib/shop/data";
import { collections, shopUrl } from "@/lib/site";

/**
 * The three ranges as tall doors: Face, Hair and Body Care. Each photo is the one the store itself has
 * set on that collection; counts and "from" prices are live.
 */
export async function RangeDoors() {
  const handles = collections.map((c) => c.path.split("/").pop() as string);
  const [cols, ...ranges] = await Promise.all([getCollections(), ...handles.map((h) => getCollectionProducts(h))]);
  return (
    <ul className="gx-ranges" role="list">
      {collections.map((c, i) => {
        const img = cols?.find((x) => x.handle === handles[i])?.image ?? ranges[i]?.[0]?.images[0]?.src;
        const list = ranges[i];
        const from = list?.length ? Math.min(...list.map((p) => p.price)) : null;
        return (
          <li key={c.name}>
            <Reveal delay={i * 0.08}>
              <a className="gx-range" href={shopUrl(c.path)}>
                <span className="gx-range__media">{img ? <Image src={img} alt="" width={800} height={1067} sizes="(min-width: 48rem) 30vw, 100vw" /> : null}</span>
                <span className="gx-range__row">
                  <span className="gx-range__title">{c.name}</span>
                  <Icon name="arrow" />
                </span>
                {list ? (
                  <span className="gx-range__note">
                    {list.length} products{from !== null ? <span data-price>, from {formatMoney(from)}</span> : null}
                  </span>
                ) : null}
              </a>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
