import type { ReactNode } from "react";
import { SiteNav, type NavPanel, type SearchItem } from "@/components/layout/SiteNav";
import { activeConcerns } from "@/lib/shop/concerns";
import { formatMoney, getCollectionProducts, getCollections, getProducts } from "@/lib/shop/data";
import { collections, EXPERIENCE_URL, shopUrl } from "@/lib/site";

/**
 * The navigation capsule and its menu. Every destination is a real one on the store. Range photos,
 * product names and prices, and the concerns (found in the store's own product descriptions) all come
 * from the live catalogue.
 */
export async function SiteHeader({ actions }: { actions?: ReactNode }) {
  const [products, cols, ...ranges] = await Promise.all([getProducts(), getCollections(), ...collections.map((c) => getCollectionProducts(c.path.split("/").pop() as string))]);
  const byConcern = activeConcerns(products ?? []).length > 0;
  const rangeOf = new Map<number, string>();
  ranges.forEach((list, i) => list?.forEach((p) => rangeOf.set(p.id, collections[i].name)));

  // One short menu, and every line of it but two leads into the store.
  const concern = { name: "By concern", href: shopUrl("/concerns") };
  const sets = { name: "Sets and gifting", href: shopUrl("/collections/gloveda-combo") };
  const story = { name: "Our story", href: "/#our-story" };
  const help = { name: "Help", href: shopUrl("/help") };
  const wishlist = shopUrl("/account?tab=saved");
  const panel: NavPanel = {
    id: "shop",
    label: "Shop",
    tiles: collections.map((c, i) => {
      const handle = c.path.split("/").pop() as string;
      return {
        name: c.name,
        href: shopUrl(c.path),
        image: cols?.find((x) => x.handle === handle)?.image ?? ranges[i]?.[0]?.images[0]?.src,
        note: ranges[i] ? `${ranges[i]?.length} products` : undefined,
      };
    }),
    groups: [
      {
        title: "Shop",
        links: [
          ...(byConcern ? [concern] : []),
          { name: "Best sellers", href: shopUrl("/collections/best-sellers") },
          sets,
          { name: "Rituals", href: shopUrl("/rituals") },
          { name: "All products", href: shopUrl("/collections/all") },
        ],
      },
      {
        title: "Gloveda",
        links: [story, { name: "Gloveda Experience", href: EXPERIENCE_URL }, help, { name: "Track your order", href: shopUrl("/track") }, { name: "Wishlist", href: wishlist }, { name: "Sign in", href: shopUrl("/account") }],
      },
    ],
  };
  const search: SearchItem[] = (products ?? []).map((p) => ({
    title: p.title,
    href: shopUrl(`/products/${p.handle}`),
    price: p.price,
    priceText: p.available ? formatMoney(p.price) : "Sold out",
    image: p.images[0]?.src,
    range: rangeOf.get(p.id) ?? "Sets",
    text: p.description.join(" ").toLowerCase().slice(0, 900),
  }));

  const shop = { name: "Shop", href: shopUrl("/") };
  return (
    <>
      <header className="theme-wine site-header">
        <nav aria-label="Main">
          <SiteNav
            panel={panel}
            links={[...(byConcern ? [concern] : []), sets, story]}
            search={search}
            searchAction={shopUrl("/search")}
            shortcuts={[...collections.map((c) => ({ name: c.name, href: shopUrl(c.path) })), ...(byConcern ? [concern] : [])]}
            accountHref={shopUrl("/account")}
            wishlistHref={wishlist}
            help={help}
            shopAll={shop}
            actions={actions}
          />
        </nav>
      </header>
      {/* On the story site the capsule steps back while the film plays; the way to the store stays. */}
      {actions ? null : (
        <a className="theme-wine gl-btn gl-btn--sm shop-pill" href={shop.href}>
          {shop.name}
        </a>
      )}
    </>
  );
}
