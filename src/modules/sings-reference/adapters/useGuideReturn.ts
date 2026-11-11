import { useLocation } from "react-router";

import { RULES_PATH } from "@/routes/Routes";

export function useGuideReturn() {
  const { state } = useLocation();
  const target = state?.rulesReturnTo;
  if (
    typeof target !== "string" ||
    (target !== RULES_PATH && !target.startsWith(`${RULES_PATH}?`))
  ) {
    return null;
  }
  return {
    to: target,
    state: {
      rulebookPositionKey:
        typeof state.rulesPositionKey === "string" ? state.rulesPositionKey : undefined,
    },
  };
}
