"use client";

import { useId, useState } from "react";

/**
 * A text field with a label that rises out of the way as you type. Problems are shown inline when you
 * leave the field, in words, never as an alert.
 */
export function Field({ label, name, type = "text", required = false, autoComplete, validate }: { label: string; name: string; type?: string; required?: boolean; autoComplete?: string; validate?: (value: string) => string | null }) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const check = (value: string) => setError(required && !value.trim() ? `Please enter your ${label.toLowerCase()}.` : (validate?.(value) ?? null));
  return (
    <div className="gx-field" data-invalid={!!error}>
      <input id={id} className="gx-field__input" name={name} type={type} placeholder=" " required={required} autoComplete={autoComplete} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} onBlur={(e) => check(e.currentTarget.value)} onChange={(e) => error && check(e.currentTarget.value)} />
      <label htmlFor={id} className="gx-field__label">
        {label}
      </label>
      <p id={`${id}-error`} className="gx-field__error" role={error ? "alert" : undefined}>
        {error}
      </p>
    </div>
  );
}
