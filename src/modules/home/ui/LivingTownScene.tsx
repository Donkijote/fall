import { Component, lazy, Suspense, useCallback, useState } from "react";
import type { ReactNode } from "react";

import { useAtmospherePreferences } from "@/infrastructure/ui/hooks/useAtmospherePreferences";

import { townArtwork } from "./scene/townArtwork";
import type { TownArtwork } from "./scene/townArtwork";
import "./living-town.css";

const LivingTownCanvas = lazy(() => import("./scene/LivingTownCanvas"));

const plannedLandmarks = [
  { artwork: townArtwork[6], label: "Merchant" },
  { artwork: townArtwork[7], label: "Quests" },
];

const tavernEmbers = [
  { left: "34%", top: "72%", animationDelay: "-1s" },
  { left: "47%", top: "61%", animationDelay: "-3.5s" },
  { left: "65%", top: "66%", animationDelay: "-5s" },
  { left: "74%", top: "49%", animationDelay: "-2s" },
  { left: "56%", top: "38%", animationDelay: "-4s" },
  { left: "28%", top: "54%", animationDelay: "-6s" },
];

function ArtworkLayer({ artwork }: { artwork: TownArtwork }) {
  const [status, setStatus] = useState("loading");

  return (
    <img
      className={`living-town-art living-town-${artwork.id}`}
      data-artwork={artwork.id}
      data-slot={`living-town-${artwork.id}`}
      data-status={status}
      src={artwork.source}
      width={artwork.width}
      height={artwork.height}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      onLoad={() => setStatus("ready")}
      onError={() => setStatus("failed")}
    />
  );
}

function PlannedLandmark({ artwork, label }: { artwork: TownArtwork; label: string }) {
  return (
    <div className={`living-town-landmark living-town-${artwork.id}-anchor`}>
      <button
        type="button"
        className="living-town-planned-landmark"
        disabled
        aria-label={`${label} (coming soon)`}
      >
        <ArtworkLayer artwork={artwork} />
        <span className="living-town-nameplate" aria-hidden="true">
          {label}
        </span>
      </button>
    </div>
  );
}

function PlazaSurface() {
  return (
    <div
      className="living-town-plaza"
      data-artwork="plaza"
      data-slot="living-town-plaza"
      aria-hidden="true"
      style={{ backgroundImage: `url("${townArtwork[3].source}")` }}
    />
  );
}

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function SceneEnhancement({
  compact,
  visible,
  onFailure,
}: {
  compact: boolean;
  visible: boolean;
  onFailure: () => void;
}) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div className="living-town-webgl" data-ready={ready}>
      <SceneBoundary onFailure={onFailure}>
        <Suspense fallback={null}>
          <LivingTownCanvas
            compact={compact}
            visible={visible}
            onReady={onReady}
            onFailure={onFailure}
          />
        </Suspense>
      </SceneBoundary>
    </div>
  );
}

export function LivingTownScene({
  canPlay = false,
  onPlay,
}: {
  canPlay?: boolean;
  onPlay?: () => void;
}) {
  const { animate, compact, visible } = useAtmospherePreferences();
  const [failed, setFailed] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);

  return (
    <div className="living-town-scene" data-slot="living-town-scene">
      <div className="living-town-frame" aria-hidden="true">
        <ArtworkLayer artwork={townArtwork[0]} />
        <div data-slot="living-town-mountains">
          <ArtworkLayer artwork={townArtwork[1]} />
          <ArtworkLayer artwork={townArtwork[2]} />
        </div>
        <div className="living-town-mountain-haze" />
        {animate && !failed && (
          <SceneEnhancement compact={compact} visible={visible} onFailure={onFailure} />
        )}
      </div>
      <div className="living-town-ground" aria-hidden="true" />
      <PlazaSurface />
      <div className="living-town-world" data-slot="living-town-world">
        <PlannedLandmark artwork={townArtwork[4]} label="Arena" />
        <div className="living-town-tavern-anchor" data-facing="inward">
          <button
            type="button"
            className="living-town-tavern-trigger"
            aria-label="Play at the tavern"
            disabled={!canPlay}
            onClick={onPlay}
          >
            <ArtworkLayer artwork={townArtwork[5]} />
            {animate && (
              <span className="living-town-embers" data-visible={visible} aria-hidden="true">
                {tavernEmbers.slice(0, compact ? 4 : 6).map((ember) => (
                  <span key={ember.left} className="living-town-ember" style={ember} />
                ))}
              </span>
            )}
            <span className="living-town-tavern-nameplate" aria-hidden="true">
              The Tavern
            </span>
          </button>
        </div>
        {plannedLandmarks.map(({ artwork, label }) => (
          <PlannedLandmark key={artwork.id} artwork={artwork} label={label} />
        ))}
      </div>
      <div className="living-town-atmosphere" aria-hidden="true" />
    </div>
  );
}
