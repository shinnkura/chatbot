import { RefObject, useEffect, useState, useSyncExternalStore } from "react";

// カスタムストア：ウィンドウ高さ
const getWindowHeight = () => window.innerHeight;
const subscribeHeightChange = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};
const useWindowHeight = () => useSyncExternalStore(subscribeHeightChange, getWindowHeight);

const useScrollVisibility = (ref: RefObject<HTMLElement | null>) => {
  const windowHeight = useWindowHeight();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const [refHeight, setRefHeight] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const updateMetrics = () => {
      if (ref.current) {
        const { top, height } = ref.current.getBoundingClientRect();
        setPrevScrollPosition(scrollPosition);
        setScrollPosition(top);
        setRefHeight(height);

        // スクロール方向の判定
        if (top < prevScrollPosition) {
          setScrollDirection("up");
          console.log("scrollDirection: ", scrollDirection);
        } else if (top > prevScrollPosition) {
          setScrollDirection("down");
          console.log("scrollDirection: ", scrollDirection);
        }
      }
    };

    updateMetrics();
    window.addEventListener("scroll", updateMetrics);
    window.addEventListener("resize", updateMetrics);

    return () => {
      window.removeEventListener("scroll", updateMetrics);
      window.removeEventListener("resize", updateMetrics);
    };
  }, [ref, scrollPosition, prevScrollPosition, scrollDirection]);

  const rate = refHeight > 0 ? ((windowHeight - scrollPosition) / refHeight) * 100 : 0;
  console.log("ref: ", ref);
  return { scrollDirection, windowHeight, scrollPosition, refHeight, rate };
};

export default useScrollVisibility;
