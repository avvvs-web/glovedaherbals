"use client";

import { useMemo, useState } from "react";
import { Field } from "./Field";
import { ProgressLine } from "./ProgressLine";
import { RollingNumber } from "./RollingNumber";
import { Stepper } from "./Stepper";
import { Tabs } from "./Tabs";

/** The interactive pieces of the style sheet. The price is a real one from the catalogue, passed in. */
export function KitDemo({ name, price, currency, ranges }: { name: string; price: number; currency: string; ranges: string[] }) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(ranges[0]);
  const money = useMemo(() => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }), [currency]);
  // The goal here is only to show the line moving; the real threshold comes from the store once confirmed.
  const goal = price * 3;
  const total = price * qty;

  return (
    <div className="gx-grid">
      <div className="gx-col-6 gx-kit__panel">
        <p className="gx-label">Tabs: the pill slides to your choice</p>
        <Tabs label="Range" items={ranges.map((r) => ({ id: r, label: r }))} value={tab} onChange={setTab} />
        <p className="gx-label">Quantity and a total that rolls</p>
        <div className="gx-kit__row">
          <Stepper label={`Quantity of ${name}`} value={qty} onChange={setQty} max={6} />
          <span>{name}</span>
        </div>
        <p className="gx-total">
          <span>Total</span>
          <RollingNumber text={money.format(total)} />
        </p>
        <ProgressLine value={total / goal}>{total >= goal ? "The line is full." : `${money.format(goal - total)} to go (example goal).`}</ProgressLine>
      </div>
      <div className="gx-col-6 gx-kit__panel">
        <p className="gx-label">Fields: the label rises; problems appear in words when you leave</p>
        <Field label="Email" name="email" type="email" autoComplete="email" required validate={(v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "That email address does not look complete.")} />
        <Field label="Gift note" name="note" />
      </div>
    </div>
  );
}
