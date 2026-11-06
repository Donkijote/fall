export type GameResult = "win" | "lose";

export type GameOverStats = {
  teamScore?: string;
};

export type ConfettiSide = "left" | "right";

export type ModalText = Record<GameResult, { title: string; message: string }>;
