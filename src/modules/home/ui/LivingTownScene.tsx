import { Component, lazy, Suspense, useCallback, useState } from "react";
import type { ReactNode } from "react";

import { useAtmospherePreferences } from "@/infrastructure/ui/hooks/useAtmospherePreferences";

import { townArtwork } from "./scene/townArtwork";
import type { TownArtwork } from "./scene/townArtwork";
import "./living-town.css";

const LivingTownCanvas = lazy(() => import("./scene/LivingTownCanvas"));

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
      draggable={false}
      decoding="async"
      onLoad={() => setStatus("ready")}
      onError={() => setStatus("failed")}
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

export function LivingTownScene() {
  const { animate, compact, visible } = useAtmospherePreferences();
  const [failed, setFailed] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);

  return (
    <div className="living-town-scene" data-slot="living-town-scene" aria-hidden="true">
      <div className="living-town-frame">
        <ArtworkLayer artwork={townArtwork[0]} />
        <div data-slot="living-town-mountains">
          <ArtworkLayer artwork={townArtwork[1]} />
          <ArtworkLayer artwork={townArtwork[2]} />
        </div>
        <div className="living-town-mountain-haze" />
        {animate && !failed && (
          <SceneEnhancement compact={compact} visible={visible} onFailure={onFailure} />
        )}
        <div className="living-town-ground" />
        <ArtworkLayer artwork={townArtwork[3]} />
      </div>
      <div className="living-town-tavern-anchor">
        <div className="living-town-contact" />
        <ArtworkLayer artwork={townArtwork[4]} />
      </div>
      <div className="living-town-atmosphere" />
    </div>
  );
}
