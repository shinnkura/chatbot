import { useState, useEffect, useRef } from "react";

interface UseScrollVisibilityOptions {
  threshold?: number; // スクロールの閾値（ピクセル）
  direction?: "up" | "down"; // スクロール方向（上/下）
  initialVisible?: boolean; // 初期表示状態
}

export function useScrollVisibility({
  threshold = 0.1,
  direction = "down",
  initialVisible = true,
}: UseScrollVisibilityOptions = {}) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const currentScrollY = window.scrollY;

      if (direction === "down") {
        // 下方向スクロール時の表示制御
        setIsVisible(scrollHeight - scrollTop - clientHeight < threshold);
      } else {
        // 上方向スクロール時の表示制御
        setIsVisible(currentScrollY < lastScrollY.current);
      }

      lastScrollY.current = currentScrollY;
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [threshold, direction]);

  return [isVisible, ref] as const;
}
