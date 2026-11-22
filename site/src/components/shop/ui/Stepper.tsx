"use client";

import { Icon } from "./Icon";
import { RollingNumber } from "./RollingNumber";

/** Quantity: minus, a rolling number, plus. */
export function Stepper({ value, onChange, label, min = 1, max = 20 }: { value: number; onChange: (n: number) => void; label: string; min?: number; max?: number }) {
  return (
    <div className="gx-stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="One fewer">
        <Icon name="minus" size={16} />
      </button>
      <RollingNumber text={String(value)} className="gx-stepper__value" />
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="One more">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
