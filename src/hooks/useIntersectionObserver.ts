import { useEffect, useRef, useState, RefObject } from "react";

export const useIntersectionObserver = <T extends HTMLElement>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] => {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options?.threshold, options?.root, options?.rootMargin]);

  return [ref, isIntersecting];
};
