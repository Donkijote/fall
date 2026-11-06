import { PerfHeadless, usePerf } from "r3f-perf";
import { lazy, Suspense, useEffect, useRef } from "react";

import { Grid, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

import { deckCardCount } from "../../application/lab";
import type { Experiment, Lab, LabState, Study } from "../../application/lab";
import backArt from "../../assets/card-back.svg";
import faceArt from "../../assets/card-face.svg";
import emberTexture from "../../assets/ember.svg";
import { Card } from "./Card";
import { CardDrop } from "./CardDrop";
import { DeckStack } from "./DeckStack";
import { Fire } from "./Fire";
import { TableStudy } from "./TableStudy";

function AutoRun({ lab, experiment }: { lab: Lab; experiment?: Experiment }) {
  const started = useRef<Lab | null>(null);
  useFrame(() => {
    if (started.current !== lab) {
      started.current = lab;
      if (experiment) lab.run(experiment);
    }
  });
  return null;
}

const PhysicsDrop = lazy(() => import("./PhysicsDrop"));

export type SceneSettings = {
  rate: number;
  perf: boolean;
  dpr: number;
};

function Scene({
  children,
  settings,
  burning,
}: {
  children: React.ReactNode;
  settings: SceneSettings;
  burning: boolean;
}) {
  const { perf } = settings;
  const background = burning ? "#170e0c" : "#2a2420";

  return (
    <>
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 7.5, 16]} />
      <ambientLight intensity={1.75} />
      <directionalLight position={[3, 5, 4]} intensity={2.8} color="#fff0df" />
      <Grid
        position={[0, -1.82, 0]}
        args={[12, 12]}
        cellSize={0.38}
        cellColor={burning ? "#382019" : "#70584a"}
        cellThickness={0.45}
        sectionSize={1.9}
        sectionColor={burning ? "#523121" : "#9b7962"}
        sectionThickness={0.75}
        fadeDistance={10}
        fadeStrength={1.6}
      />
      {children}
      {perf && <PerfHeadless logsPerSecond={4} />}
    </>
  );
}

function PerformanceHud() {
  const fps = usePerf((state) => state.log?.fps as number | undefined);
  return (
    <div className="absolute top-4 right-4 rounded-full bg-background/90 px-3 py-1 text-xs tabular-nums">
      {fps ? Math.round(fps) : "…"} FPS
    </div>
  );
}

function CardStudy({
  lab,
  state,
  settings,
  revision,
}: {
  lab: Lab;
  state: LabState;
  settings: SceneSettings;
  revision: number;
}) {
  const { fire, drops, cardFalls } = state;
  const { rate } = settings;

  if (cardFalls) {
    return <CardDrop attempt={revision} effect={state.cardDropEffect} />;
  }

  return (
    <>
      <Card lab={lab} frozen={state.cardFrozen} hot={state.cardHot} flaming={state.cardFlaming} />
      {fire && (
        <Suspense fallback={null}>
          <Fire rate={rate} />
          <pointLight position={[0, -0.8, 1]} intensity={5} color="#ff7e3d" />
        </Suspense>
      )}
      {drops > 0 && (
        <Suspense fallback={null}>
          <PhysicsDrop key={revision} attempt={drops} />
        </Suspense>
      )}
    </>
  );
}

export function LabViewport({
  lab,
  state,
  settings,
  study,
  experiment,
  revision,
}: {
  lab: Lab;
  state: LabState;
  settings: SceneSettings;
  study: Study;
  experiment?: Experiment;
  revision: number;
}) {
  const { dpr, perf } = settings;
  const deck = study === "deck";
  const labels = {
    card: state.cardFalls
      ? {
          ice: ["ICE IMPACT", "Press Shatter frozen card to replay"],
          heat: ["HEAT TRANSFER", "Press Drop hot card to replay"],
          flame: ["FLAME IMPACT", "Press Drop flame card to replay"],
          plain: ["CARD IMPACT", "Press Drop card to replay"],
        }[state.cardDropEffect]
      : [`ACE OF DIAMONDS / ${state.faceUp ? "FACE" : "BACK"}`, "Hover to tilt · Tap to flip"],
    deck: [
      `DECK STACK / ${deckCardCount} CARDS`,
      `${state.deckFanned ? "Fan open" : "Stack closed"} · Drag to tilt`,
    ],
    table: ["TABLE / DEAL STUDY", "Dealer + 3 players"],
  }[study];

  useEffect(() => {
    useTexture.preload([faceArt, backArt]);
    useTexture.preload(emberTexture);
  }, []);

  return (
    <section
      className="relative flex min-h-[28rem] flex-col overflow-hidden rounded-3xl border bg-card lg:min-h-[38rem]"
      aria-label={`3D ${study} preview`}
    >
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.22, 6.9], fov: 43 }}
          dpr={[1, dpr]}
          gl={{ antialias: true }}
          fallback={
            <p className="p-8 text-center text-muted-foreground">
              WebGL is unavailable in this browser.
            </p>
          }
        >
          <Scene
            settings={settings}
            burning={
              study === "card" &&
              ((state.cardFlaming && !state.cardFalls) ||
                (state.cardFalls > 0 && state.cardDropEffect === "flame"))
            }
          >
            <Suspense fallback={null}>
              {study === "card" && (
                <CardStudy lab={lab} state={state} settings={settings} revision={revision} />
              )}
              {deck && <DeckStack lab={lab} />}
              {study === "table" && (
                <TableStudy
                  lab={lab}
                  captureEffect={state.activeCaptureIntensity}
                  capturing={state.tableCaptures > 0}
                />
              )}
              <AutoRun lab={lab} experiment={experiment} />
            </Suspense>
          </Scene>
        </Canvas>
      </div>
      {perf && <PerformanceHud />}
      <div
        className="pointer-events-none absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium"
        aria-hidden="true"
      >
        3D Preview
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-2 bg-background/90 px-5 py-3 text-xs text-muted-foreground">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </section>
  );
}
