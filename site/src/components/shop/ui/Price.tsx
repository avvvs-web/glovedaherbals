/**
 * A price as text. Every price on the site goes through this (or carries `data-price` itself), so that
 * prices can be hidden for a market whose prices are not set yet: see `src/proxy.ts` and the
 * `html[data-prices="hidden"]` rule. Text with no figure in it ("Sold out") is left as it is.
 */
export function Price({ children }: { children: string }) {
  if (!/\d/.test(children)) return <>{children}</>;
  const sold = children.match(/^(.*), sold out$/);
  if (sold) {
    return (
      <>
        <span data-price>{sold[1]}, </span>sold out
      </>
    );
  }
  return <span data-price>{children}</span>;
}
