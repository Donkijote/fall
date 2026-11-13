import { useRef, useState, type ReactNode } from "react";

import { ActionButton } from "@/components";
import type { Card } from "@/domain/entities/Card";
import type { GameMode } from "@/domain/entities/GameState";
import { createMatchState } from "@/domain/services/matchSetup";
import { getCountingGroups } from "@/domain/services/scoring";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { localPlayerId } from "../../../application/localMatch";
import { MatchSeatCards, MatchTableCards } from "../board/MatchBoardCards";
import { MatchScoreboard } from "../board/MatchScoreboard";
import { MatchSeatMarker } from "../board/MatchSeatMarker";
import { CaptureCount } from "../overlays/CaptureCount";
import { LeaveMatchDialog } from "../overlays/LeaveMatchDialog";
import { MatchResult } from "../overlays/MatchResult";
import { OpeningDeal } from "../overlays/OpeningDeal";
import { TavernOverlayAction } from "../overlays/TavernOverlayAction";
import { WaitingSign } from "../overlays/WaitingSign";

const sideName = (side: string) => ({ "1": "You", "2": "Mara", "3": "Rowan" })[side] ?? side;
const cards: Card[] = [
  { suit: "coins", rank: 1 },
  { suit: "swords", rank: 3 },
  { suit: "cups", rank: 5 },
];

function sampleMatch(mode: GameMode) {
  const state = createMatchState(localPlayerId, mode);
  return { ...state, scores: { ...state.scores, values: { "1": 24, "2": 18, "3": 12 } } };
}

function PositionedPreview({ children, tall = false }: { children: ReactNode; tall?: boolean }) {
  return (
    <div className={`[container-type:size] relative isolate ${tall ? "h-[32rem]" : "h-72"}`}>
      {children}
    </div>
  );
}

const noop = () => {};

function LeavePreview() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <ActionButton ref={trigger} tone="outline" onClick={() => setOpen(true)}>
        Open leave dialog
      </ActionButton>
      <LeaveMatchDialog
        open={open}
        setOpen={setOpen}
        leaveButton={trigger}
        leave={() => setOpen(false)}
      />
    </>
  );
}

function ResultPreview() {
  const [winner, setWinner] = useState("1");
  const [open, setOpen] = useState(false);
  const victory = useRef<HTMLButtonElement>(null);
  const defeat = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  function close() {
    setOpen(false);
    (winner === "1" ? victory : defeat).current?.focus();
  }
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <ActionButton
          ref={victory}
          tone="outline"
          onClick={() => {
            setWinner("1");
            setOpen(true);
          }}
        >
          Victory
        </ActionButton>
        <ActionButton
          ref={defeat}
          tone="outline"
          onClick={() => {
            setWinner("2");
            setOpen(true);
          }}
        >
          Defeat
        </ActionButton>
      </div>
      {open && (
        <PositionedPreview tall>
          <MatchResult
            state={{ ...sampleMatch("1vs1"), phase: "gameOver", winner }}
            sideName={sideName}
            reducedMotion={reducedMotion}
            returning={false}
            close={close}
          />
        </PositionedPreview>
      )}
    </div>
  );
}

function OpeningDealPreview() {
  return (
    <PositionedPreview tall>
      <OpeningDeal deal={noop} />
    </PositionedPreview>
  );
}

function SeatsPreview() {
  const reducedMotion = useReducedMotion();
  return (
    <PositionedPreview>
      <ul aria-label="Example table seats">
        <MatchSeatMarker
          position="top"
          player={{ name: "Mara" }}
          scoreSide="2"
          active
          dealer
          reducedMotion={reducedMotion}
        />
        <MatchSeatMarker
          position="right"
          active={false}
          dealer={false}
          reducedMotion={reducedMotion}
        />
      </ul>
    </PositionedPreview>
  );
}

function HandPreview({ canPlay }: { canPlay: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <PositionedPreview>
      <div className="absolute top-1/2 left-2/3">
        <MatchSeatCards
          hand={cards}
          collected={1}
          deck={12}
          player={canPlay ? localPlayerId : "bot-1"}
          local={canPlay}
          align="right"
          canPlay={canPlay}
          reducedMotion={reducedMotion}
          play={noop}
        />
      </div>
    </PositionedPreview>
  );
}

export const matchGallery = {
  title: "Tavern match",
  folder: "match",
  entries: [
    {
      name: "WaitingSign",
      source: "src/modules/match/ui/components/overlays/WaitingSign.tsx",
      variants: "Filled and open seats",
      usage: "Tavern match · waiting for players",
      Preview: () => (
        <WaitingSign title="Tavern" filled={2} total={4} returning={false} cancel={noop} />
      ),
    },
    {
      name: "OpeningDeal",
      source: "src/modules/match/ui/components/overlays/OpeningDeal.tsx",
      variants: "Hands or table first, ascending or descending layout",
      usage: "Tavern match · dealer’s opening choice",
      Preview: OpeningDealPreview,
    },
    {
      name: "CaptureCount",
      source: "src/modules/match/ui/components/overlays/CaptureCount.tsx",
      variants: "Three sides at the start of the capture count",
      usage: "Tavern match · between rounds",
      Preview: () => (
        <PositionedPreview>
          <CaptureCount groups={getCountingGroups(sampleMatch("1vs2"))} sideName={sideName} />
        </PositionedPreview>
      ),
    },
    {
      name: "MatchResult",
      source: "src/modules/match/ui/components/overlays/MatchResult.tsx",
      variants: "Victory and defeat artwork, final standings",
      usage: "Tavern match · end of match",
      Preview: ResultPreview,
    },
    {
      name: "LeaveMatchDialog",
      source: "src/modules/match/ui/components/overlays/LeaveMatchDialog.tsx",
      variants: "Parchment confirmation, keep playing and leave actions",
      usage: "Tavern match · leave control",
      Preview: LeavePreview,
    },
    {
      name: "TavernOverlayAction",
      source: "src/modules/match/ui/components/overlays/TavernOverlayAction.tsx",
      variants: "Primary and outline",
      usage: "Tavern match · waiting, opening deal and leave overlays",
      Preview: () => (
        <div className="flex flex-wrap gap-2">
          <TavernOverlayAction>Deal cards</TavernOverlayAction>
          <TavernOverlayAction tone="outline">Cancel</TavernOverlayAction>
        </div>
      ),
    },
    {
      name: "MatchScoreboard",
      source: "src/modules/match/ui/components/board/MatchScoreboard.tsx",
      variants: "Two players, three players and teams",
      usage: "Tavern match · board header",
      Preview: () => (
        <div className="grid justify-items-start gap-3">
          {(["1vs1", "1vs2", "2vs2"] as const).map((mode) => (
            <MatchScoreboard key={mode} state={sampleMatch(mode)} sideName={sideName} />
          ))}
        </div>
      ),
    },
    {
      name: "MatchSeatMarker",
      source: "src/modules/match/ui/components/board/MatchSeatMarker.tsx",
      variants: "Open, occupied, active and dealer",
      usage: "Tavern match · waiting and active board",
      Preview: SeatsPreview,
    },
    {
      name: "MatchTableCards",
      source: "src/modules/match/ui/components/board/MatchBoardCards.tsx",
      variants: "Face-up table layout",
      usage: "Tavern match · active board",
      Preview: () => (
        <PositionedPreview>
          <MatchTableCards cards={cards} />
        </PositionedPreview>
      ),
    },
    {
      name: "MatchSeatCards",
      source: "src/modules/match/ui/components/board/MatchBoardCards.tsx",
      variants: "Opponent’s face-down hand, deck and collected pile",
      usage: "Tavern match · seated player",
      Preview: () => <HandPreview canPlay={false} />,
    },
    {
      name: "MatchHandCard",
      source: "src/modules/match/ui/components/board/MatchHandCard.tsx",
      variants: "Playable hand cards with pointer and keyboard focus states",
      usage: "Tavern match · local player’s hand",
      Preview: () => <HandPreview canPlay />,
    },
  ],
};
