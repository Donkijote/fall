import gsap from "gsap";
import { Component, lazy, Suspense, useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";

import mountainCastle from "@/assets/login/mountain-castle.png";
import { useAtmospherePreferences } from "@/infrastructure/ui/hooks/useAtmospherePreferences";

import { useGSAP } from "@gsap/react";

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
  const webglRef = useRef<HTMLDivElement>(null);

  if (!showScene && ready) setReady(false);

  useGSAP(
    () => {
      if (!showScene || !ready || !webglRef.current) return;
      gsap.from(webglRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power1.inOut",
        clearProps: "opacity",
      });
    },
    { dependencies: [showScene, ready], revertOnUpdate: true },
  );
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);

  return (
    <div
      className="login-atmosphere pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      <img
        className="login-landscape absolute inset-0 size-full object-cover object-center"
        src={mountainCastle}
        alt=""
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-radial-[ellipse_at_50%_38%] from-transparent from-12% to-artwork-shadow/85 to-95%">
        <div className="absolute inset-0 bg-linear-to-b from-artwork-shadow/60 via-artwork-shadow/70 via-45% to-artwork-shadow/95" />
      </div>
      {showScene && (
        <div
          ref={webglRef}
          className="login-webgl absolute inset-0 size-full data-[ready=false]:opacity-0"
          data-ready={ready}
        >
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
      <div className="absolute inset-0 bg-radial-[ellipse_at_50%_115%] from-primary/12 to-transparent to-58%" />
    </div>
  );
}
