import gsap from "gsap";
import type { RefObject } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

export function useArticleMotion(articleRef: RefObject<HTMLElement | null>, chapterId: string) {
  const reducedMotion = useReducedMotion();
  useGSAP(
    () => {
      if (reducedMotion || !articleRef.current) return;
      gsap.fromTo(
        articleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.16, clearProps: "opacity" },
      );
    },
    { scope: articleRef, dependencies: [chapterId, reducedMotion], revertOnUpdate: true },
  );
}
