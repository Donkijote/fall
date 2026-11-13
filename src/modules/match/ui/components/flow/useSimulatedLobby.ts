import { useEffect, useState } from "react";

export function useSimulatedLobby(seatCount: number, returning: boolean) {
  const [guestCount, setGuestCount] = useState(0);

  useEffect(() => {
    if (returning) return;

    const timers = [900, 1600, 2300]
      .slice(0, seatCount - 1)
      .map((delay, index) => window.setTimeout(() => setGuestCount(index + 1), delay));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [seatCount, returning]);

  return guestCount;
}
