/** Five stars filled to a rating out of five. Decorative: the number beside it carries the meaning. */
const STAR = "M12 3.6l2.5 5.3 5.7.7-4.200 3.900 1.100 5.700L12 16.400 6.900 19.200 8 13.500 3.800 9.600l5.700-.7L12 3.600Z";
export function Stars({ value, size = 18 }: { value: number; size?: number }) {
  const row = (fill: boolean) => (
    <span className="gx-stars__row">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.1} strokeLinejoin="round" aria-hidden="true">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
  return (
    <span className="gx-stars" aria-hidden="true">
      {row(false)}
      <span className="gx-stars__fill" style={{ width: `${Math.max(0, Math.min(5, value)) * 20}%` }}>
        {row(true)}
      </span>
    </span>
  );
}
