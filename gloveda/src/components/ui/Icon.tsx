/**
 * The shop's icon set: thin single-weight lines, drawn to sit beside Marcellus and the film's gold keyline.
 * Icons are decorative by default; the control that holds one carries the label.
 */
const paths = {
  search: "M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Zm4.7-1.8L20 20",
  account: "M12 12.2a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8ZM4.5 20c.9-3.3 3.9-5.2 7.5-5.2s6.600 1.900 7.500 5.200",
  bag: "M5.500 8.500h13l-.9 11h-11.200l-.9-11ZM9 8.500V7a3 3 0 0 1 6 0v1.500",
  heart: "M12 19.500s-7-4.300-7-9.300A3.700 3.700 0 0 1 12 8a3.700 3.700 0 0 1 7 2.200c0 5-7 9.300-7 9.300Z",
  close: "M6 6l12 12M18 6 6 18",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  plus: "M12 5.500v13M5.500 12h13",
  minus: "M5.500 12h13",
  check: "M5.500 12.500l4.200 4.200L18.500 7.500",
  chevron: "M7 10l5 5 5-5",
  menu: "M4.500 8.500h15M4.500 15.500h15",
  orders: "M6 4.500h12v15l-3-1.800-3 1.800-3-1.800-3 1.800v-15ZM9 9h6M9 12.500h6",
} as const;
export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
