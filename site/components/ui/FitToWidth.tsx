"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lays its child out at `width` and zooms it down to fit a narrower parent, so a drawn window shows whole and
 * smaller instead of cropped (the same approach as the Forge tour on phones). At or above `width` it does nothing.
 */
export function FitToWidth({ width, children }: { width: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const fit = () => {
      const cs = getComputedStyle(el);
      setScale(Math.min(1, (el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / width));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref} style={scale < 1 ? { width, zoom: scale } : undefined}>
      {children}
    </div>
  );
}
