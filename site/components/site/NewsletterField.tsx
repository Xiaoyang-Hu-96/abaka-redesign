"use client";

import { useState } from "react";
import { newsletter } from "@/lib/content";

/**
 * Newsletter field. States from interaction states v3: hover darkens the border, focus is an ink
 * border with a 3px halo, error is an accent border with a message tied to the input.
 * The prototype validates only; it does not send anything.
 */
export function NewsletterField() {
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const value = new FormData(e.currentTarget).get("email")?.toString() ?? "";
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setError(!ok);
        setDone(ok);
      }}
      className="flex flex-col gap-1.5"
    >
      <label htmlFor="newsletter-email" className="sr-only">{newsletter.label}</label>
      <div
        className={`flex h-11 items-center border bg-surface-raised transition-[border-color,box-shadow] duration-(--duration-fast) focus-within:border-border-strong focus-within:shadow-[0_0_0_3px_var(--color-focus-halo)] ${
          error ? "border-accent" : "border-border-default hover:border-border-hover"
        }`}
      >
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={newsletter.placeholder}
          aria-invalid={error}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm placeholder:text-text-tertiary focus-visible:shadow-none"
        />
        <button type="submit" className="px-3 text-sm font-medium transition-colors duration-(--duration-fast) ease-out hover:text-accent">
          {newsletter.submit}
        </button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="flex items-center gap-1.5 text-label text-text-primary">
          <span aria-hidden className="size-1.5 bg-accent" />
          {newsletter.error}
        </p>
      )}
      {done && <p role="status" className="text-label text-text-tertiary">{newsletter.done}</p>}
    </form>
  );
}
