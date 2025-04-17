import { RefObject, useLayoutEffect, useRef, useState } from "react";

export function useScrollVisibility(targetRef: RefObject<HTMLElement | null>, threshold = 5) {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const prevY = useRef(0);
  const rafId = useRef<number>(0);

  useLayoutEffect(() => {
    const el = targetRef.current;
    if (!el) return; // まだマウントしていない

    const update = () => {
      const y = el.scrollTop;
      const diff = y - prevY.current;
      if (Math.abs(diff) >= threshold) {
        setDirection(diff > 0 ? "down" : "up");
        prevY.current = y;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchmove", onScroll, { passive: true });
    el.addEventListener("wheel", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchmove", onScroll);
      el.removeEventListener("wheel", onScroll);
    };
  }, [targetRef.current, threshold]);

  console.log("rafId: ", rafId);
  console.log("direction: ", direction);

  return direction;
}
