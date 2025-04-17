/* hooks/useScrollDirection.ts */
import { RefObject, useLayoutEffect, useRef, useState } from "react";

export function useScrollVisibility(
  targetRef: RefObject<HTMLElement | null>,
  threshold = 5 // px または delta 単位
) {
  const [dir, setDir] = useState<"up" | "down" | null>(null);
  const touchPrevY = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    /* -------- wheel -------- */
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < threshold) return;
      setDir(e.deltaY > 0 ? "down" : "up");
    };

    /* -------- touch -------- */
    const onTouchStart = (e: TouchEvent) => {
      touchPrevY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const prev = touchPrevY.current;
      const now = e.touches[0].clientY;
      if (prev == null) return;
      const diff = now - prev; // 上へスワイプ = diff < 0
      if (Math.abs(diff) < threshold) return;
      setDir(diff < 0 ? "down" : "up");
      touchPrevY.current = now;
    };

    /* -------- 監視登録 -------- */
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [targetRef.current, threshold]);

  return dir;
}
