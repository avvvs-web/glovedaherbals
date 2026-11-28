import { COMPANY, FREE_SHIPPING_FROM, policies } from "@/content/policies";
import { getArticles } from "@/lib/blog";
import { abs } from "@/lib/seo";
import { activeConcerns } from "@/lib/shop/concerns";
import { formatMoney, getCollectionProducts, getProducts } from "@/lib/shop/data";
import { describe } from "@/lib/shop/describe";
import { BRAND, collections, shopUrl } from "@/lib/site";

export const revalidate = 3600;

/**
 * /llms.txt: a plain summary of the brand and its pages for AI assistants and answer engines (the
 * llms.txt convention). Every fact is either an approved brand statement or read live from Shopify:
 * product names, their own taglines, prices and stock. Nothing is added or reworded.
 */
export async function GET() {
  const [products, articles, ...ranges] = await Promise.all([getProducts(), getArticles(), ...collections.map((c) => getCollectionProducts(c.path.split("/").pop() as string))]);
  const all = products ?? [];
  const rangeOf = new Map<number, string>();
  ranges.forEach((list, i) => list?.forEach((p) => rangeOf.set(p.id, collections[i].name)));
  const line = (p: (typeof all)[number]) => {
    const tagline = describe(p.description).lede;
    const price = p.available ? formatMoney(p.price) : "sold out";
    return `- [${p.title}](${abs(shopUrl(`/products/${p.handle}`))}): ${rangeOf.get(p.id) ?? "Set"}, ${price}${tagline ? `. ${tagline}` : ""}`;
  };
  const singles = all.filter((p) => rangeOf.has(p.id));
  const sets = all.filter((p) => !rangeOf.has(p.id));

  const body = `# ${BRAND}

> ${BRAND} makes Ayurvedic skincare and hair care: face, hair and body care formulated by Ayurvedic doctors and made in small batches, in house. It is the skincare brand of ${COMPANY.name}, an Ayurvedic institution in Kozhikode, Kerala, India, established in 1921. The shop sells in India, in Indian rupees, with checkout run by Shopify.

Key facts:
- Brand: ${BRAND} (also written "Gloveda").
- Parent institution: ${COMPANY.name}, established in 1921, ${COMPANY.registeredOffice}.
- Ranges: Face Care, Hair Care, Body Care, and sets for gifting.
- Shipping: free on orders above ₹${FREE_SHIPPING_FROM} within India.
- Customer care: ${COMPANY.email}, ${COMPANY.phone}.
- Prices and stock below are read from the live shop and may change; the product page is the source of truth.

## Shop

- [Shop home](${abs(shopUrl("/"))})
- [All products](${abs(shopUrl("/collections/all"))})
${collections.map((c) => `- [${c.name}](${abs(shopUrl(c.path))})`).join("\n")}
- [Shop by concern](${abs(shopUrl("/concerns"))}): products grouped by what their own descriptions say they care for.
- [Rituals](${abs(shopUrl("/rituals"))}): ready-made routines, or build your own.

## Products

${singles.map(line).join("\n")}

## Sets and gifting

${sets.map(line).join("\n")}

## Shop by concern

${activeConcerns(all)
  .map((c) => `- [${c.name}](${abs(shopUrl(`/concerns/${c.slug}`))}): ${c.count} ${c.count === 1 ? "product" : "products"}`)
  .join("\n")}

## Journal

${(articles ?? []).map((a) => `- [${a.title}](${abs(shopUrl(`/blogs/${a.blog}/${a.handle}`))})`).join("\n") || "- No articles yet."}

## Help and policies

- [Help centre](${abs(shopUrl("/help"))}): orders, payment, delivery, returns and contact.
- [Track your order](${abs(shopUrl("/track"))})
${policies.map((p) => `- [${p.title}](${abs(shopUrl(`/policies/${p.handle}`))}): ${p.summary}`).join("\n")}

## Optional

- [Our story](${abs("/#our-story")}): the Vaidyars of ${COMPANY.name}, from 1921.
- [Sitemap](${abs("/sitemap.xml")})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
