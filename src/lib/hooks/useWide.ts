"use client";

import { useEffect, useState } from "react";

/** true od šířky lg (1024 px), kdy se hřiště otočí na šířku */
export function useWide(query = "(min-width: 1024px)") {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return wide;
}
