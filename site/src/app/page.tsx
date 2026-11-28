import { redirect } from "next/navigation";
import { shopUrl } from "@/lib/site";

/**
 * This codebase is the shop, Gloveda Herbals (herbals.gloveda.co). The film and the parent site,
 * gloveda.co, are their own project (gloveda/ in this repository). On the shop's address the proxy serves
 * "/" from the shop's home, so this page is only reached on other addresses (a preview, or locally).
 */
export default function Home() {
  redirect(shopUrl("/"));
}
