import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType, useSearchParams } from "react-router";

import { chapters } from "../application/rulebookContent";

const readingPositions = new Map<string, number>();

// Browser/router adapter: application content never imports React or history APIs.
export function useRulebookRoute() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [params] = useSearchParams();
  const chapter = chapters.find((entry) => entry.id === params.get("chapter")) ?? chapters[0];
  const mainRef = useRef<HTMLElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const main = mainRef.current;
    const article = articleRef.current;
    if (!main || !article) return;
    const ruleId = params.get("rule");
    const ruleTarget = ruleId ? document.getElementById(`rule-${ruleId}`) : null;
    const target =
      ruleTarget && article.contains(ruleTarget)
        ? ruleTarget
        : article.querySelector<HTMLElement>("h2");
    const restoreKey =
      typeof location.state?.rulebookPositionKey === "string"
        ? location.state.rulebookPositionKey
        : navigationType === "POP"
          ? location.key
          : undefined;
    const restored = restoreKey ? readingPositions.get(restoreKey) : undefined;
    main.scrollTop = restored ?? 0;
    if (restored === undefined && ruleId)
      target?.scrollIntoView?.({ block: "start", behavior: "instant" });
    target?.focus({ preventScroll: true });
    return () => {
      readingPositions.set(location.key, main.scrollTop);
    };
  }, [location.key, location.state, chapter.id, navigationType, params]);
  return {
    chapter,
    chapterIndex: chapters.indexOf(chapter),
    mainRef,
    articleRef,
    savePosition: (top: number) => readingPositions.set(location.key, top),
    singsReturnState: {
      rulesReturnTo: `${location.pathname}${location.search}`,
      rulesPositionKey: location.key,
    },
  };
}
