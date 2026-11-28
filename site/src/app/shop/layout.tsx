import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BottomBar } from "@/components/shop/BottomBar";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";
import { CartButton, CartProvider, type CartVariant } from "@/components/shop/Cart";
import { formatMoney, getProducts } from "@/lib/shop/data";
import { SHOP_ORIGIN, shopUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Shop Gloveda Herbals | Ayurvedic Skincare & Hair Care", template: "%s | Gloveda Herbals" },
};

export default async function ShopLayout({ children }: LayoutProps<"/shop">) {
  const products = (await getProducts()) ?? [];
  // The cart only stores variant ids; names, prices and stock always come from the live catalogue.
  const variants: CartVariant[] = products.flatMap((p) =>
    p.variants.map((v) => ({
      id: v.id,
      title: p.variants.length > 1 ? `${p.title}, ${v.title}` : p.title,
      handle: p.handle,
      price: v.price,
      priceText: formatMoney(v.price),
      available: v.available,
      image: p.images[0]?.src,
    })),
  );
  return (
    <CartProvider variants={variants} checkoutBase={`${SHOP_ORIGIN}/checkout`} shopOrigin={SHOP_ORIGIN} currency={process.env.SHOPIFY_CURRENCY ?? "INR"}>
      <a className="gl-btn gl-btn--sm skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader actions={<CartButton />} />
      <main id="main" className="shop">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppButton />
      <BottomBar shopHref={shopUrl("/collections/all")} searchHref={shopUrl("/search")} accountHref={shopUrl("/account")} />
    </CartProvider>
  );
}
