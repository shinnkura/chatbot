import { RefObject, useEffect, useRef, useState } from "react";

export const useScrollVisibility = (ref: RefObject<HTMLElement | null>) => {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const prevY = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const y = el.scrollTop;
      const prev = prevY.current;

      if (y > prev) setDirection("down");
      else if (y < prev) setDirection("up");

      prevY.current = y; // 常に最新値を保持
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref.current]);
  console.log("direction: ", direction);

  return direction;
};
