import { Component, lazy, Suspense, useCallback, useState } from "react";
import type { ReactNode } from "react";

import mountainCastle from "@/assets/login/mountain-castle.png";
import { useAtmospherePreferences } from "@/infrastructure/ui/hooks/useAtmospherePreferences";

import "./LoginAtmosphere.css";

const AtmosphereCanvas = lazy(() => import("./scene/AtmosphereCanvas"));

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

export function LoginAtmosphere() {
  const { animate, compact, visible } = useAtmospherePreferences();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const showScene = animate && !failed;
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);

  return (
    <div className="login-atmosphere" aria-hidden="true">
      <img className="login-landscape" src={mountainCastle} alt="" fetchPriority="high" />
      <div className="login-scene-shade" />
      {showScene && (
        <div className="login-webgl" data-ready={ready}>
          <SceneBoundary onFailure={onFailure}>
            <Suspense fallback={null}>
              <AtmosphereCanvas
                compact={compact}
                visible={visible}
                onReady={onReady}
                onFailure={onFailure}
              />
            </Suspense>
          </SceneBoundary>
        </div>
      )}
      <div className="login-ember-glow" />
    </div>
  );
}
