import { useEffect } from "react";

export function useScrollReveal(containerRef) {
  useEffect(() => {
    const root = containerRef?.current;
    if (!root) return undefined;

    const elements = Array.from(root.querySelectorAll(".reveal"));
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);
}
