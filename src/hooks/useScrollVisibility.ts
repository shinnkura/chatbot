import { useState, useEffect, useRef } from "react";

interface UseScrollVisibilityOptions {
  /** スクロールの閾値（ピクセル） */
  threshold?: number;
  /** スクロール方向（上/下） */
  direction?: "up" | "down";
  /** 初期表示状態 */
  initialVisible?: boolean;
}

export function useScrollVisibility({
  threshold = 50,
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
        const isAtBottom = scrollHeight - scrollTop - clientHeight < threshold;
        setIsVisible(isAtBottom);
      } else {
        // 上方向スクロール時の表示制御
        const isScrollingUp = currentScrollY < lastScrollY.current;
        setIsVisible(isScrollingUp);
      }

      lastScrollY.current = currentScrollY;
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [threshold, direction]);

  return [isVisible, ref] as const;
}
