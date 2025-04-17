import { RefObject, useEffect, useRef, useState } from "react";

interface Options {
  threshold?: number;
}

export function useScrollVisibility(targetRef: RefObject<HTMLElement | null>, { threshold = 5 }: Options = {}) {
  const [dir, setDir] = useState<"up" | "down" | null>(null);
  const prevY = useRef(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const update = () => {
      const y = el.scrollTop;
      const diff = y - prevY.current;
      if (Math.abs(diff) < threshold) return; // 微小変化を除外
      setDir(diff > 0 ? "down" : "up");
      prevY.current = y;
    };

    // Safari 対策：touchmove / wheel でも毎フレーム更新
    const onScroll = () => requestAnimationFrame(update);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchmove", onScroll, { passive: true }); // 慣性スクロール
    el.addEventListener("wheel", onScroll, { passive: true }); // ホイール操作

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchmove", onScroll);
      el.removeEventListener("wheel", onScroll);
    };
  }, [targetRef, threshold]);

  return dir;
}
