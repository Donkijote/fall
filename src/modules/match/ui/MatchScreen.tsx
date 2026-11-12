import gsap from "gsap";
import { useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useNavigationType,
  useParams,
  useSearchParams,
} from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import { TavernBackdrop } from "@/components/surfaces/TavernBackdrop";
import type { GameMode } from "@/domain/entities/GameState";
import type { User } from "@/domain/entities/User";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";
import { LOCAL_MATCH_ID, TAVERN_PICKER_PATH } from "@/routes/Routes";

import { useGSAP } from "@gsap/react";

import { TavernMatch, TavernMatchArtworkPreload } from "./components/layout/TavernMatch";

const tableZoomStart = 0.96;

const titles: Record<GameMode, string> = {
  "1vs1": "Duel",
  "1vs2": "Free-for-All",
  "2vs2": "Team Match",
};

export function MatchScreen() {
  const { matchId } = useParams();
  const [params] = useSearchParams();
  const requestedMode = params.get("mode");
  const mode = requestedMode === "1vs2" || requestedMode === "2vs2" ? requestedMode : "1vs1";
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const fromTavern = navigationType === "PUSH" && location.state?.fromTavern === true;
  const reducedMotion = useReducedMotion();
  const screen = useRef<HTMLElement>(null);
  const [player] = useState(() => StorageService.get<User>(StorageKeys.FALL_USER));
  const [returning, setReturning] = useState(false);

  useGSAP(
    () => {
      if (!screen.current) return;
      screen.current
        .querySelector<HTMLElement>("[data-tavern-cancel]")
        ?.focus({ preventScroll: true });
      if (reducedMotion) return;
      const arrival = gsap.timeline();
      if (fromTavern) {
        arrival.fromTo(
          "[data-match-artwork]",
          { scale: tableZoomStart },
          { scale: 1, duration: 0.36, ease: "power2.out" },
          0,
        );
        arrival.fromTo(
          "[data-match-travel-backdrop]",
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.36, ease: "power1.inOut" },
          0,
        );
      } else {
        arrival.from("[data-tavern-match]", { opacity: 0, duration: 0.35 }, 0);
      }
    },
    { scope: screen, dependencies: [mode, reducedMotion, fromTavern], revertOnUpdate: true },
  );

  const { contextSafe } = useGSAP({ scope: screen });
  const close = contextSafe(() => {
    if (returning) return;
    setReturning(true);
    const finish = () =>
      navigate(TAVERN_PICKER_PATH, { replace: true, state: { returnFocusMode: mode } });
    if (reducedMotion || !screen.current) {
      finish();
      return;
    }
    gsap
      .timeline({
        onComplete: finish,
        defaults: { duration: 0.3, ease: "sine.inOut", overwrite: "auto" },
      })
      .to("[data-match-artwork]", { scale: tableZoomStart }, 0)
      .to("[data-match-travel-backdrop]", { autoAlpha: 1 }, 0);
  });

  if (matchId !== LOCAL_MATCH_ID) return <Navigate to={TAVERN_PICKER_PATH} replace />;

  return (
    <main
      ref={screen}
      aria-label={titles[mode]}
      className="relative h-dvh overflow-clip bg-artwork-shadow"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <TavernMatchArtworkPreload />
      <TavernMatch
        key={mode}
        mode={mode}
        title={titles[mode]}
        player={{
          name: player?.name || player?.username || "Traveller",
          avatarUrl: player?.avatar,
        }}
        returning={returning}
        reducedMotion={reducedMotion}
        cancel={close}
      />
      {!reducedMotion && (
        <div
          data-match-travel-backdrop=""
          aria-hidden="true"
          className="pointer-events-none invisible absolute inset-0 z-20"
        >
          <TavernBackdrop />
        </div>
      )}
    </main>
  );
}
