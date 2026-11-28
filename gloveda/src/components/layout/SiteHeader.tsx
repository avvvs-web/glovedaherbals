import { SiteNav, type NavGroup } from "@/components/layout/SiteNav";
import { collections, EXPERIENCE_URL, reviveUrl, shopUrl } from "@/lib/site";

/** The parent site's header: a way into each Gloveda house, the story, and the shop. */
export function SiteHeader() {
  const houses = [
    { name: "Herbals", href: shopUrl("/") },
    { name: "Experience", href: EXPERIENCE_URL },
    { name: "Revive", href: reviveUrl("/") },
  ];
  const groups: NavGroup[] = [
    {
      title: "The Gloveda family",
      links: [
        { name: "Gloveda Herbals", href: shopUrl("/") },
        { name: "Gloveda Experience", href: EXPERIENCE_URL },
        { name: "Gloveda Revive", href: reviveUrl("/") },
        { name: "Our story", href: "/#our-story" },
      ],
    },
    {
      title: "Gloveda Herbals",
      links: [...collections.map((c) => ({ name: c.name, href: shopUrl(c.path) })), { name: "All products", href: shopUrl("/collections/all") }],
    },
    {
      title: "Gloveda Revive",
      links: [
        { name: "Find a clinic", href: reviveUrl("/clinics") },
        { name: "Treatments", href: reviveUrl("/treatments") },
        { name: "Partner with Revive", href: reviveUrl("/#partner") },
      ],
    },
  ];
  const shop = { name: "Shop", href: shopUrl("/") };
  return (
    <>
      <header className="theme-wine site-header">
        <nav aria-label="Main">
          <SiteNav links={houses} groups={groups} story={{ name: "Our story", href: "/#our-story" }} shop={shop} />
        </nav>
      </header>
      {/* The capsule steps back while the film plays; the way to the shop stays. */}
      <a className="theme-wine gl-btn gl-btn--sm shop-pill" href={shop.href}>
        {shop.name}
      </a>
    </>
  );
}
