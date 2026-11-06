import { createUIGameStoreService } from "@/application/services/UIGameStoreService";
import type { UIState } from "@/domain/entities/UI";

vi.mock("@/application/store/uiGameStore", () => ({
  initialUIState: {
    playingCard: null,
    captureOverride: null,
    cascadeFollowers: [],
  },
}));

describe("createUIGameStoreService", () => {
  let state: UIState;
  let getState: () => UIState;
  let setState: (next: UIState) => void;
  let setSpy: ReturnType<typeof vi.fn>;
  let service: ReturnType<typeof createUIGameStoreService>;

  beforeEach(() => {
    state = {
      playingCard: null,
      captureOverride: null,
      cascadeFollowers: [],
    };
    setSpy = vi.fn((next) => {
      state = next;
    });
    getState = () => state;
    setState = setSpy;
    service = createUIGameStoreService(getState, setState);
  });

  it("setPlayingCard updates playingCard and preserves other fields", () => {
    state.cascadeFollowers = ["coins-1"];
    service.setPlayingCard({ suit: "coins", rank: 7 });
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(state).toEqual({
      playingCard: { suit: "coins", rank: 7 },
      captureOverride: null,
      cascadeFollowers: ["coins-1"],
    });
  });

  it("setCaptureOverride updates captureOverride and preserves other fields", () => {
    state.playingCard = { suit: "cups", rank: 3 };
    service.setCaptureOverride({ fromKey: "coins-1", toKey: "coins-2" });
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(state).toEqual({
      playingCard: { suit: "cups", rank: 3 },
      captureOverride: { fromKey: "coins-1", toKey: "coins-2" },
      cascadeFollowers: [],
    });
  });

  it("addCascadeFollower appends when missing", () => {
    expect(state.cascadeFollowers).toEqual([]);
    service.addCascadeFollower("coins-2");
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(state.cascadeFollowers).toEqual(["coins-2"]);
  });

  it("addCascadeFollower is idempotent for existing key", () => {
    state.cascadeFollowers = ["coins-2"];
    service.addCascadeFollower("coins-2");
    expect(setSpy).not.toHaveBeenCalled();
    expect(state.cascadeFollowers).toEqual(["coins-2"]);
  });

  it("addCascadeFollower can add multiple distinct keys preserving order", () => {
    service.addCascadeFollower("coins-2");
    service.addCascadeFollower("cups-7");
    service.addCascadeFollower("swords-3");
    expect(setSpy).toHaveBeenCalledTimes(3);
    expect(state.cascadeFollowers).toEqual(["coins-2", "cups-7", "swords-3"]);
  });

  it("clearUI resets to initialUIState", async () => {
    state = {
      playingCard: { suit: "coins", rank: 1 },
      captureOverride: { fromKey: "coins-1", toKey: "coins-2" },
      cascadeFollowers: ["coins-3"],
    };
    service.clearUI();
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(state).toEqual({
      playingCard: null,
      captureOverride: null,
      cascadeFollowers: [],
    });
  });
});
