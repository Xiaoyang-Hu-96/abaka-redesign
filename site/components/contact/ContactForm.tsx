"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { contact } from "@/lib/content";

const f = contact.form;
/* v4 text field: hover darkens the border, focus is an ink border with a 3px halo, error is an accent border */
const field =
  "w-full border bg-surface-page px-3.5 text-body leading-ui transition-[border-color,box-shadow] duration-(--duration-fast) ease-out " +
  "focus-visible:border-border-strong focus-visible:shadow-[0_0_0_3px_var(--color-focus-halo)]";
const ok = "border-grey-300 hover:border-border-hover";
const bad = "border-accent";
const label = "text-sm font-medium leading-ui";

/**
 * The brief form. No backend: on submit it checks name, a full work email and the message, then confirms inline.
 * Nothing is sent. Arriving from a catalog Request link (?dataset=…) fills the Dataset field and marks it;
 * ?need=… (the Custom data tab) picks that need.
 */
export function ContactForm() {
  const id = useId();
  const [needs, setNeeds] = useState<string[]>([f.needs[0]]);
  const [dataset, setDataset] = useState("");
  const [fromCatalog, setFromCatalog] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const d = q.get("dataset"), need = q.get("need");
    if (d) { setDataset(d); setFromCatalog(true); }
    // ?need=… (the Custom data tab) picks that need instead of the default; the dataset stays empty
    if (need && f.needs.includes(need)) setNeeds([need]);
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = {
      name: !String(data.get("name") ?? "").trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") ?? "")),
      message: !String(data.get("message") ?? "").trim(),
    };
    setErrors(next);
    if (!Object.values(next).some(Boolean)) setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="flex flex-col items-start gap-3">
        <p className="text-h3 font-title text-text-heading leading-h3 tracking-snug">{f.done.title}</p>
        <p className="max-w-[460px] text-lead leading-lead text-text-secondary">{f.done.body}</p>
        <button type="button" onClick={() => setDone(false)} className="pt-2 text-sm font-medium transition-colors duration-(--duration-fast) ease-out hover:text-accent">
          {f.done.again}
        </button>
      </div>
    );
  }

  const err = (k: string, msg: string) =>
    errors[k] && (
      <p id={`${id}-${k}-err`} className="flex items-center gap-1.5 text-label text-text-primary">
        <span aria-hidden className="size-1.5 bg-accent" />
        {msg}
      </p>
    );
  const described = (k: string) => (errors[k] ? `${id}-${k}-err` : undefined);

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <label className="flex flex-1 flex-col gap-2">
          <span className={label}>{f.name}</span>
          <input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={described("name")} className={`${field} h-11 ${errors.name ? bad : ok}`} />
          {err("name", f.errors.name)}
        </label>
        <label className="flex flex-1 flex-col gap-2">
          <span className={label}>{f.email}</span>
          <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={described("email")} className={`${field} h-11 ${errors.email ? bad : ok}`} />
          {err("email", f.errors.email)}
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className={label}>{f.company}</span>
        <input name="company" autoComplete="organization" className={`${field} h-11 ${ok}`} />
      </label>
      <fieldset className="flex flex-col gap-2.5">
        <legend className={`${label} pb-2.5`}>{f.need}</legend>
        <div className="flex flex-wrap gap-2">
          {f.needs.map((n) => {
            const on = needs.includes(n);
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => setNeeds(on ? needs.filter((x) => x !== n) : [...needs, n])}
                className={`border px-3 py-2 text-sm leading-ui transition-colors duration-(--duration-fast) ease-out ${
                  on ? "border-ink bg-surface-inverse text-text-inverse" : "border-grey-300 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2">
        <span className={label}>{f.dataset}</span>
        <span className="relative">
          <input
            name="dataset"
            value={dataset}
            placeholder={f.datasetPlaceholder}
            onChange={(e) => { setDataset(e.target.value); setFromCatalog(false); }}
            className={`${field} h-11 placeholder:text-text-muted ${fromCatalog ? "pr-32" : ""} ${ok}`}
          />
          {fromCatalog && (
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-mono-sm uppercase leading-mono-sm text-text-tertiary">{f.fromCatalog}</span>
          )}
        </span>
      </label>
      <label className="flex flex-col gap-2">
        <span className={label}>{f.message}</span>
        <textarea name="message" rows={4} aria-invalid={!!errors.message} aria-describedby={described("message")} className={`${field} h-[120px] resize-none py-3 ${errors.message ? bad : ok}`} />
        {err("message", f.errors.message)}
      </label>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-surface-inverse px-[22px] py-3 text-sm font-medium leading-ui text-text-inverse transition-[background-color,translate] duration-(--duration-fast) ease-out active:translate-y-px active:bg-ink-pressed"
        >
          {f.submit}
        </button>
      </div>
    </form>
  );
}
