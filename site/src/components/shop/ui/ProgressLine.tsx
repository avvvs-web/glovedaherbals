/** A thin gold line that fills toward a goal (for example, free shipping). The words carry the meaning. */
export function ProgressLine({ value, children }: { value: number; children: React.ReactNode }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="gx-progress">
      <p className="gx-progress__text">{children}</p>
      <div className="gx-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
        <span style={{ transform: `scaleX(${v})` }} />
      </div>
    </div>
  );
}
