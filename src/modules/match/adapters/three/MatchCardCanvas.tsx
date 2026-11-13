import gsap from "gsap";
import {
  Suspense,
  memo,
  useSyncExternalStore,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { MathUtils, type Group, type Texture } from "three";

import emberTexture from "@/assets/effects/ember.svg";
import { sampleCardCapture } from "@/components/cards/motion/cardCapture";
import { countingArrival, createCountingPlayback } from "@/components/cards/motion/cardCounting";
import {
  cardFlights,
  sampleDeal,
  samplePlay,
  type CardPose,
} from "@/components/cards/motion/cardFlights";
import { appendCapture, appendDeal, appendPlay } from "@/components/cards/motion/cardTimelines";
import {
  getCascadeDuration,
  cascadeFirstPickupDuration,
  cascadeReturnTime,
  sampleCascadeCapture,
} from "@/components/cards/motion/cascadeCapture";
import { collectAt, sampleFallCapture } from "@/components/cards/motion/tableCapture";
import { getCardFaceUrl } from "@/components/cards/SuitGlyph";
import {
  CardArtworkProvider,
  cardArtwork,
  useCardFaceTextures,
  useCardArtwork,
} from "@/components/cards/three/CardArtwork";
import { CardMesh } from "@/components/cards/three/CardMesh";
import {
  FallFlameTrail,
  FallImpactEffects,
  useFallImpactEffects,
} from "@/components/cards/three/FallImpactEffects";
import {
  FallShadow,
  updateFallShadow,
  type FallShadowMesh,
} from "@/components/cards/three/FallShadow";
import { createDeck } from "@/domain/rules/deck";

import { useGSAP } from "@gsap/react";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { cardPitch, viewHeight, type PlaybackChannel, type PlaybackProps } from "./matchCardScene";
import { matchFallEffect } from "./matchFallEffect";
import { sampleFallCascade } from "./sampleFallCascade";

const faceUrls = createDeck().flatMap(({ suit, rank }) => getCardFaceUrl(suit, rank) ?? []);

export function preloadMatchCardArt() {
  useTexture.preload(faceUrls);
  useTexture.preload([cardArtwork.face, cardArtwork.back]);
  useTexture.preload(emberTexture);
}

function applyPose(mesh: Group | undefined, pose: CardPose, size: number) {
  if (!mesh) return;
  mesh.position.fromArray(pose.position);
  mesh.rotation.set(pose.rotation[0], pose.rotation[1], pose.rotation[2], "ZYX");
  mesh.scale.setScalar(size * (pose.scale ?? 1));
  mesh.visible = true;
}

function CardSequence({
  scene,
  audio,
  complete,
  handoff,
  count,
  pileRemaining,
  sequence,
  textures,
  shadow,
}: PlaybackProps & {
  textures: Map<string, Texture>;
  shadow: RefObject<FallShadowMesh | null>;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const cards =
    scene.kind === "deal"
      ? scene.cards
      : scene.kind === "play"
        ? [scene.card]
        : scene.kind === "collect"
          ? [...(scene.played ? [scene.played] : []), ...scene.targets]
          : scene.groups.flatMap((group) => group.cards);
  const fallTarget =
    scene.kind === "collect" && scene.capture === "fall" ? scene.targets[0] : undefined;
  const effects = useFallImpactEffects(matchFallEffect(fallTarget?.art?.rank));
  const meshes = useRef<Group[]>([]);
  const timelineRef = useRef<gsap.core.Timeline>(null);
  const playback = useMemo(
    () => ({
      flights: scene.kind === "deal" ? scene.cards.map(() => ({ progress: 0, fan: 0 })) : [],
      play: { progress: 0 },
      capture: { progress: 0, cooldown: 0, followThrough: 0 },
      count:
        scene.kind === "count"
          ? scene.groups.map(({ cards, quota }) =>
              createCountingPlayback(cards.length, quota, audio.playDealCard),
            )
          : [],
      side: 0,
      rest: 0,
      finished: false,
      started: false,
    }),
    [sequence, audio],
  );

  useLayoutEffect(() => {
    const mesh = shadow.current;
    return () => {
      if (mesh) mesh.visible = false;
    };
  }, [shadow]);

  useGSAP(
    () => {
      if (scene.kind === "count") {
        invalidate();
        return;
      }
      const timeline = gsap.timeline({ paused: true });
      timelineRef.current = timeline;
      if (scene.kind === "play") appendPlay(timeline, playback.play, audio);
      if (scene.kind === "collect")
        appendCapture(
          timeline,
          playback.capture,
          scene.capture,
          scene.targets.length,
          audio,
          effects.effect,
          true,
        );
      if (scene.kind === "deal") {
        for (const first of [scene.cards[0]?.center, !scene.cards[0]?.center]) {
          const indices = scene.cards.flatMap((card, index) =>
            card.center === first ? [index] : [],
          );
          const start = timeline.duration();
          appendDeal(
            timeline,
            indices.map((index) => playback.flights[index]),
            Boolean(first),
            audio,
            "original",
            start,
          );
          indices.forEach((index, order) => {
            if (!scene.cards[index].fan) return;
            timeline.to(
              playback.flights[index],
              { fan: 1, duration: 0.2, ease: "power2.out" },
              start + order * cardFlights.deal.stagger + cardFlights.deal.hand,
            );
          });
        }
      }
      if (!timeline.duration()) complete();
      invalidate();
      return () => {
        timelineRef.current = null;
      };
    },
    { dependencies: [playback], revertOnUpdate: true },
  );

  useFrame(({ clock }, delta) => {
    const timeline = timelineRef.current;
    if (!playback.started && scene.kind !== "count" && !timeline) return;

    if (playback.started && timeline?.progress() === 1) {
      complete();
      return;
    }
    if (playback.started && timeline) {
      timeline.time(Math.min(timeline.duration(), timeline.time() + Math.min(delta, 0.05)), false);
    }

    const nodes = meshes.current;
    if (scene.kind === "deal") {
      scene.cards.forEach((card, index) => {
        const deck = { ...scene.deck, z: scene.deck.z - index * cardPitch };
        const flight = playback.flights[index];
        const target = card.fan
          ? {
              ...card.origin,
              y: MathUtils.lerp(card.origin.y, card.fan.y, flight.fan),
              angle: MathUtils.lerp(card.origin.angle, card.fan.angle, flight.fan),
            }
          : card.origin;
        const growth = MathUtils.smoothstep(flight.progress, 0.2, 1);
        const size = MathUtils.lerp(scene.deckSize, card.size, growth);
        applyPose(nodes[index], sampleDeal(flight.progress, deck, target, card.center), size);
      });
    } else if (scene.kind === "play") {
      applyPose(
        nodes[0],
        samplePlay(playback.play.progress, scene.card.origin, scene.target),
        MathUtils.lerp(scene.card.size, scene.targetSize, playback.play.progress),
      );
    } else if (scene.kind === "collect") {
      const progress = playback.capture.progress;
      const settleSize = (size: number, travel = 0) => MathUtils.lerp(size, scene.pileSize, travel);
      if (scene.capture === "sweep") {
        // Reuse the return leg for the cards left on the table at round end.
        scene.targets.forEach((card, index) => {
          const duration = getCascadeDuration(1);
          const pose = sampleCascadeCapture(
            (duration - cascadeReturnTime + progress * cascadeReturnTime) / duration,
            0,
            card.origin,
            [card.origin],
            scene.pile,
            cardPitch,
          );
          applyPose(nodes[index], pose, settleSize(card.size, pose.pileTravel));
        });
      } else if (scene.played) {
        const target = scene.targets[0];
        const from = scene.played.origin;
        if (scene.capture === "fall") {
          const aftermath =
            playback.capture.cooldown +
            playback.capture.followThrough *
              (getCascadeDuration(scene.targets.length) - cascadeFirstPickupDuration);
          const impact = effects.sample(progress, aftermath, clock.elapsedTime);
          const landing = (top: boolean, position: number) =>
            sampleFallCapture(
              position,
              top,
              top ? from : target.origin,
              target.origin,
              scene.pile,
              cardPitch,
              target.size / 0.83,
              effects.effect,
              impact,
              true,
            );
          const pose = landing(true, progress);
          if (scene.targets.length > 1 && progress >= collectAt) {
            const origins = scene.targets.map(({ origin }) => origin);
            cards.forEach((card, index) => {
              const pair = index < 2 ? landing(index === 0, collectAt) : undefined;
              const continued = sampleFallCascade(
                playback.capture.followThrough,
                index - 1,
                from,
                origins,
                scene.pile,
                cardPitch,
                pair,
              );
              applyPose(
                nodes[index],
                continued,
                settleSize(index === 0 ? target.size : card.size, continued.pileTravel),
              );
            });
            updateFallShadow(shadow.current, pose, -0.003, target.size / 0.34);
          } else {
            const size = MathUtils.lerp(scene.played.size, target.size, pose.handTravel ?? 1);
            // Keep the Fall's lift, then settle to the target card's exact size on impact.
            const liftScale = MathUtils.lerp(pose.scale ?? 1, 1, impact.fallTime);
            applyPose(nodes[0], { ...pose, scale: liftScale }, settleSize(size, pose.pileTravel));
            updateFallShadow(shadow.current, pose, -0.003, target.size / 0.34);
            const lower = landing(false, progress);
            applyPose(nodes[1], lower, settleSize(target.size, lower.pileTravel));
            scene.targets.slice(1).forEach((card, index) => {
              applyPose(
                nodes[index + 2],
                {
                  position: [card.origin.x, card.origin.y, card.origin.z],
                  rotation: [0, Math.PI, card.origin.angle],
                },
                card.size,
              );
            });
          }
        } else {
          const origins = scene.targets.map(({ origin }) => origin);
          cards.forEach((card, index) => {
            const pose =
              scene.capture === "cascade"
                ? sampleCascadeCapture(progress, index - 1, from, origins, scene.pile, cardPitch)
                : sampleCardCapture(
                    progress,
                    index === 0,
                    from,
                    target.origin,
                    scene.pile,
                    cardPitch,
                  );
            const size =
              index === 0
                ? MathUtils.lerp(card.size, target.size, pose.handTravel ?? 1)
                : card.size;
            applyPose(nodes[index], pose, settleSize(size, pose.pileTravel));
          });
        }
      }
    } else {
      let offset = 0;
      scene.groups.forEach((group, groupIndex) => {
        const counter = playback.count[groupIndex];
        const progress = groupIndex === playback.side ? counter.advance(delta) : undefined;
        if (progress) count(group.side, progress);
        const remaining = new Map<string, number>();
        group.cards.forEach((card, index) => {
          const node = nodes[offset++];
          if (!node) return;
          if (groupIndex !== playback.side) {
            node.visible = false;
            return;
          }
          const pose = counter.pose(index);
          // Translate the study's source and destination into the current viewport.
          const travel = pose.travel;
          remaining.set(card.player, (remaining.get(card.player) ?? 0) + Number(travel === 0));
          const bonus = index >= group.quota;
          const end = {
            x: bonus ? group.target.x : group.target.x - 0.9,
            y: group.target.y - (bonus ? 0 : 0.45),
          };
          pose.position[0] += MathUtils.lerp(
            card.origin.x - 2.1,
            end.x - (bonus ? 0 : -0.9),
            travel,
          );
          pose.position[1] += MathUtils.lerp(
            card.origin.y + 0.6,
            end.y - (bonus ? 0 : -0.45),
            travel,
          );
          applyPose(node, pose, card.size);
          node.visible = travel > 0 && pose.visible;
        });
        for (const [player, total] of remaining) pileRemaining(player, total);
        if (progress?.complete) playback.rest += delta;
      });
      if (playback.rest >= 0.65) {
        playback.rest = 0;
        playback.side++;
      }
      if (playback.side === scene.groups.length && !playback.finished) {
        playback.finished = true;
        complete();
      }
    }
    if (!playback.started) {
      playback.started = true;
      const seconds =
        scene.kind === "count"
          ? scene.groups.reduce(
              (total, group) =>
                total +
                0.65 +
                (group.cards.length ? countingArrival(group.cards.length - 1, group.quota) : 0),
              0,
            )
          : timeline!.duration();
      handoff(seconds);
    }
    if (!playback.finished) invalidate();
  });

  return (
    <>
      {fallTarget && (
        <FallImpactEffects
          effects={effects}
          at={fallTarget.origin}
          scale={fallTarget.size / 0.34}
        />
      )}
      {cards.map(({ art }, index) => (
        <group
          key={index}
          visible={false}
          ref={(node) => {
            if (node) meshes.current[index] = node;
          }}
        >
          <group rotation={[0, scene.kind === "count" ? 0 : Math.PI, 0]} scale={[1, 1, 0.24]}>
            <CardMesh
              frost={
                fallTarget && index === 0 && effects.effect === "ice" ? effects.frost : undefined
              }
              heat={
                fallTarget && (effects.effect === "heat" || effects.effect === "flame") && index < 2
                  ? index === 0
                    ? effects.playedHeat
                    : effects.targetHeat
                  : undefined
              }
              faceTexture={
                art
                  ? textures.get(getCardFaceUrl(art.suit, art.rank) ?? cardArtwork.face)
                  : undefined
              }
            />
          </group>
          {fallTarget && index === 0 && effects.effect === "flame" && (
            <FallFlameTrail effects={effects} />
          )}
        </group>
      ))}
    </>
  );
}

function MatchSequences({ playback }: { playback?: PlaybackProps }) {
  const { gl, camera, scene } = useThree();
  const [, back] = useCardArtwork();
  const warmup = useRef<Group>(null);
  const shadow = useRef<FallShadowMesh>(null);
  const paper = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-amber-50")
    .trim();
  const textures = useCardFaceTextures(faceUrls, paper || undefined, 256);
  useLayoutEffect(() => {
    gl.initTexture(back);
    for (const texture of textures.values()) gl.initTexture(texture);
    if (warmup.current) void gl.compileAsync(warmup.current, camera, scene).catch(() => {});
  }, [gl, back, textures, camera, scene]);
  return (
    <>
      <group ref={warmup}>
        <group visible={false}>
          <CardMesh />
        </group>
        <FallShadow mesh={shadow} />
      </group>
      {playback && (
        <CardSequence key={playback.sequence} {...playback} textures={textures} shadow={shadow} />
      )}
    </>
  );
}

function Scene({ channel }: { channel: PlaybackChannel }) {
  // Subscribe inside the existing R3F root so each move can start without
  // going back through the Canvas configuration and React root bridge.
  const playback = useSyncExternalStore(channel.subscribe, channel.getSnapshot);
  const height = useThree(({ size }) => size.height);
  return (
    <>
      <OrthographicCamera
        makeDefault
        zoom={Math.max(1, height) / viewHeight}
        position={[0, 0, 9]}
      />
      <ambientLight intensity={1.75} />
      <directionalLight position={[3, 5, 4]} intensity={2.8} color="#fff0df" />
      <Suspense fallback={null}>
        <CardArtworkProvider>
          <MatchSequences playback={playback} />
        </CardArtworkProvider>
      </Suspense>
    </>
  );
}

const MatchCardCanvas = memo(function MatchCardCanvas({ channel }: { channel: PlaybackChannel }) {
  return (
    <Canvas
      // Keep the SVG colors consistent with the DOM card during the handoff.
      flat
      dpr={[1, 2]}
      style={{ pointerEvents: "none" }}
      gl={{ alpha: true, antialias: true }}
      frameloop="demand"
    >
      <Scene channel={channel} />
    </Canvas>
  );
});

export default MatchCardCanvas;
