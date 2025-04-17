import { RefObject, useEffect, useState } from "react";

export const useElementScroll = (ref: RefObject<HTMLElement | null>) => {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [prevY, setPrevY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const y = el.scrollTop;
      setDirection(y > prevY ? "down" : y < prevY ? "up" : null);
      setPrevY(y);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref]);

  console.log("direction: ", direction);

  return direction;
};
