import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import type { GameMode } from "@/domain/entities/GameState";
import type {
  GameOverStats,
  GameResult,
} from "@/modules/matchEnd/entities/types";
import { HOME_PATH } from "@/routes/Routes";

export const useMatchEnd = () => {
  const navigate = useNavigate();
  const { phase, players, mainPlayer, scores } = useGameStoreState();
  const { resetGameState, setupGame } = useGameStoreService();

  const isFinished = phase === "gameOver";

  const currentGameMode: GameMode = useMemo(() => {
    if (players.length === 4) {
      return "2vs2";
    }
    if (players.length === 3) {
      return "1vs2";
    }
    return "1vs1";
  }, [players.length]);

  const playerTeam = useMemo(() => {
    const player = players.find(({ id }) => id === mainPlayer)!;
    return player.team;
  }, [players, mainPlayer]);

  const gameResult: GameResult | null = useMemo(() => {
    if (!isFinished) return null;
    const points = scores.values[playerTeam];
    if (points >= 24) {
      return "win";
    }
    return "lose";
  }, [playerTeam, scores, isFinished]);

  const stats: GameOverStats = useMemo(() => {
    return {
      teamScore: Object.values(scores.values).join(" - "),
    };
  }, [scores]);

  const onExit: () => void = useCallback(() => {
    navigate(HOME_PATH);
    resetGameState();
  }, [navigate, resetGameState]);

  const onReplay: () => void = useCallback(() => {
    resetGameState();
    setupGame(mainPlayer, currentGameMode).then();
  }, [currentGameMode, mainPlayer, setupGame, resetGameState]);

  const onNewGame: () => void = useCallback(() => {
    navigate(HOME_PATH + "?bottomSidebar=true");
    resetGameState();
  }, [navigate, resetGameState]);

  useEffect(() => {
    if (!isFinished) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
      if (e.key.toLowerCase() === "r") onReplay();
      if (e.key.toLowerCase() === "n") onNewGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFinished, onExit, onReplay, onNewGame]);

  return {
    isFinished,
    gameResult,
    stats,
    onExit,
    onReplay,
    onNewGame,
  };
};
