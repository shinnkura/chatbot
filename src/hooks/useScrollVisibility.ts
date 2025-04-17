import { RefObject, useEffect, useRef, useState } from "react";

export const useScrollVisibility = (ref: RefObject<HTMLElement | null>) => {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const prevY = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const y = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      const diff = y - prevY.current;

      // ① 変化が無い／きわめて小さいなら無視
      if (diff === 0) return;

      // ② 先頭 or 末尾で「境界の外向き」へ動いたときは無視（オーバースクロールの防止）
      if (
        (y === 0 && diff < 0) || // 上端でさらに上
        (y === max && diff > 0)
      ) {
        // 下端でさらに下
        prevY.current = y;
        return;
      }

      // ③ 通常判定
      setDirection(diff > 0 ? "down" : "up");
      prevY.current = y;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref]);

  return direction;
};
