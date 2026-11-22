/**
 * The seven products in the film, in line-up order (left to right at f510).
 * Names, handles and image URLs come from the brand's Shopify catalogue (content/hero/sources.md, P1-P7).
 * Nothing commercial lives here: price and stock come only from Shopify (lib/shopify.ts).
 */
export type CatalogueProduct = {
  handle: string;
  title: string;
  image: { src: string; width: number; height: number; alt: string };
};

const cdn = "https://cdn.shopify.com/s/files/1/0804/4308/0946/files";

export const lineup: CatalogueProduct[] = [
  { handle: "gloveda-face-mask", title: "Gloveda Face Mask", image: { src: `${cdn}/Face_Mask.webp?v=1770101341`, width: 1080, height: 1080, alt: "Gloveda Face Mask jar" } },
  { handle: "gloveda-face-wash", title: "Gloveda Face Wash", image: { src: `${cdn}/Face_wash.webp?v=1770100117`, width: 1080, height: 1080, alt: "Gloveda Face Wash pump bottle" } },
  { handle: "gloveda-kumkumadi-thailam", title: "Gloveda Kumkumadi Thailam", image: { src: `${cdn}/Kumkumadi_thailam.webp?v=1770101469`, width: 1080, height: 1080, alt: "Gloveda Kumkumadi Thailam dropper bottle" } },
  { handle: "gloveda-shampoo", title: "Gloveda Pure Nature Shampoo", image: { src: `${cdn}/Pure_Nature_Shampoo.webp?v=1770099453`, width: 1080, height: 1080, alt: "Gloveda Pure Nature Shampoo pump bottle" } },
  { handle: "gloveda-massage-oil", title: "Gloveda Massage Oil", image: { src: `${cdn}/Massage_oil_1.webp?v=1770101413`, width: 1080, height: 1080, alt: "Gloveda Massage Oil dropper bottle" } },
  { handle: "gloveda-conditioner", title: "Gloveda Conditioner", image: { src: `${cdn}/Conditioner.webp?v=1770097528`, width: 1080, height: 1080, alt: "Gloveda Conditioner pump bottle" } },
  { handle: "gloveda-face-pack", title: "Gloveda Face Pack", image: { src: `${cdn}/Gloveda_Face_Pack.webp?v=1770100783`, width: 1080, height: 1080, alt: "Gloveda Face Pack jar" } },
];
