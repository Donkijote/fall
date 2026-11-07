import { Component, lazy, Suspense, useCallback, useState } from "react";
import type { ReactNode } from "react";

import { useAtmospherePreferences } from "@/infrastructure/ui/hooks/useAtmospherePreferences";

import { MountainBackdrop } from "./scene/MountainBackdrop";
import { TavernBackdrop } from "./scene/TavernBackdrop";
import "./living-town.css";

const LivingTownCanvas = lazy(() => import("./scene/LivingTownCanvas"));

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
      <div className="living-town-sky" data-slot="living-town-sky" />
      <div className="living-town-clouds living-town-clouds-distant" />
      <div className="living-town-clouds living-town-clouds-near" />
      <MountainBackdrop />
      <TavernBackdrop />
      {animate && !failed && (
        <SceneEnhancement compact={compact} visible={visible} onFailure={onFailure} />
      )}
      <div className="living-town-ground" />
      <div className="living-town-mountain-haze" />
      <div className="living-town-atmosphere" />
    </div>
  );
}
