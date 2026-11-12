import gsap from "gsap";
import { Suspense, useMemo, useRef } from "react";
import { MathUtils, type Group } from "three";

import { sampleCardCapture } from "@/components/cards/motion/cardCapture";
import {
  createCountingPlayback,
  type CountingSnapshot,
} from "@/components/cards/motion/cardCounting";
import { sampleDeal, samplePlay, type CardPose } from "@/components/cards/motion/cardFlights";
import { sampleCardImpact } from "@/components/cards/motion/cardImpactMotion";
import {
  appendCapture,
  appendDeal,
  appendPlay,
  type CardMotionAudio,
} from "@/components/cards/motion/cardTimelines";
import {
  getCascadeDuration,
  cascadeReturnTime,
  sampleCascadeCapture,
} from "@/components/cards/motion/cascadeCapture";
import {
  captureDuration,
  impactAt,
  sampleFallCapture,
} from "@/components/cards/motion/tableCapture";
import { getCardFaceUrl } from "@/components/cards/SuitGlyph";
import {
  CardArtworkProvider,
  cardArtwork,
  useCardFaceTextures,
} from "@/components/cards/three/CardArtwork";
import { CardMesh } from "@/components/cards/three/CardMesh";
import {
  FallShadow,
  updateFallShadow,
  type FallShadowMesh,
} from "@/components/cards/three/FallShadow";

import { useGSAP } from "@gsap/react";
import { OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { cardPitch, viewHeight, type CardScene } from "./matchCardScene";

type PlaybackProps = {
  scene: CardScene;
  audio: CardMotionAudio;
  complete: () => void;
  count: (side: number, snapshot: CountingSnapshot) => void;
};

function applyPose(mesh: Group | undefined, pose: CardPose, size: number) {
  if (!mesh) return;
  mesh.position.fromArray(pose.position);
  mesh.rotation.set(pose.rotation[0], pose.rotation[1], pose.rotation[2]);
  mesh.scale.setScalar(size * (pose.scale ?? 1));
  mesh.visible = true;
}

function CardSequence({ scene, audio, complete, count }: PlaybackProps) {
  const cards =
    scene.kind === "deal"
      ? scene.cards
      : scene.kind === "play"
        ? [scene.card]
        : scene.kind === "collect"
          ? [...(scene.played ? [scene.played] : []), ...scene.targets]
          : scene.groups.flatMap((group) => group.cards);
  const images = [
    ...new Set(
      cards.map(({ art }) =>
        art ? (getCardFaceUrl(art.suit, art.rank) ?? cardArtwork.face) : cardArtwork.face,
      ),
    ),
  ];
  const textures = useCardFaceTextures(images);
  const meshes = useRef<Group[]>([]);
  const shadow = useRef<FallShadowMesh>(null);
  const playback = useMemo(
    () => ({
      flights: scene.kind === "deal" ? scene.cards.map(() => ({ progress: 0 })) : [],
      play: { progress: 0 },
      capture: { progress: 0, cooldown: 0 },
      count:
        scene.kind === "count"
          ? scene.groups.map(({ cards, quota }) =>
              createCountingPlayback(cards.length, quota, audio.playDealCard),
            )
          : [],
      side: 0,
      rest: 0,
      finished: false,
    }),
    [scene, audio],
  );

  useGSAP(
    () => {
      if (scene.kind === "count") return;
      const timeline = gsap.timeline({ onComplete: complete });
      if (scene.kind === "play") appendPlay(timeline, playback.play, audio);
      if (scene.kind === "collect")
        appendCapture(timeline, playback.capture, scene.capture, scene.targets.length, audio);
      if (scene.kind === "deal") {
        for (const first of [scene.cards[0]?.center, !scene.cards[0]?.center]) {
          appendDeal(
            timeline,
            playback.flights.filter((_, index) => scene.cards[index].center === first),
            Boolean(first),
            audio,
            "original",
            timeline.duration(),
          );
        }
      }
      if (!timeline.duration()) complete();
    },
    { dependencies: [scene, playback], revertOnUpdate: true },
  );

  useFrame((_, delta) => {
    const nodes = meshes.current;
    if (scene.kind === "deal") {
      scene.cards.forEach((card, index) => {
        const deck = { ...scene.deck, z: scene.deck.z - index * cardPitch };
        applyPose(
          nodes[index],
          sampleDeal(playback.flights[index].progress, deck, card.origin, card.center),
          card.size,
        );
      });
    } else if (scene.kind === "play") {
      applyPose(
        nodes[0],
        samplePlay(playback.play.progress, scene.card.origin, scene.target),
        scene.card.size,
      );
    } else if (scene.kind === "collect") {
      const progress = playback.capture.progress;
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
          applyPose(nodes[index], pose, card.size);
        });
      } else if (scene.played) {
        const target = scene.targets[0];
        const from = scene.played.origin;
        if (scene.capture === "fall") {
          const duration = captureDuration("plain");
          const impact = sampleCardImpact(
            "plain",
            (progress - impactAt) * duration + playback.capture.cooldown,
          );
          const pose = sampleFallCapture(
            progress,
            true,
            from,
            target.origin,
            scene.pile,
            cardPitch,
            target.size / 0.83,
            "plain",
            impact,
          );
          applyPose(nodes[0], pose, scene.played.size);
          updateFallShadow(shadow.current, pose, -0.003, target.size / 0.34);
          applyPose(
            nodes[1],
            sampleFallCapture(
              progress,
              false,
              target.origin,
              target.origin,
              scene.pile,
              cardPitch,
              target.size / 0.83,
              "plain",
              impact,
            ),
            target.size,
          );
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
            applyPose(nodes[index], pose, card.size);
          });
        }
      }
    } else {
      let offset = 0;
      scene.groups.forEach((group, groupIndex) => {
        const counter = playback.count[groupIndex];
        const progress = groupIndex === playback.side ? counter.advance(delta) : undefined;
        if (progress) count(group.side, progress);
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
          node.visible = pose.visible;
        });
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
  });

  return (
    <>
      {scene.kind === "collect" && scene.capture === "fall" && <FallShadow mesh={shadow} />}
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
              faceTexture={
                art
                  ? textures.get(getCardFaceUrl(art.suit, art.rank) ?? cardArtwork.face)
                  : undefined
              }
            />
          </group>
        </group>
      ))}
    </>
  );
}

function Scene({ playback }: { playback?: PlaybackProps }) {
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
      {playback && (
        <Suspense fallback={null}>
          <CardArtworkProvider>
            <CardSequence {...playback} />
          </CardArtworkProvider>
        </Suspense>
      )}
    </>
  );
}

export default function MatchCardCanvas({ playback }: { playback?: PlaybackProps }) {
  return (
    <Canvas
      dpr={[1, 2]}
      style={{ pointerEvents: "none" }}
      gl={{ alpha: true, antialias: true }}
      frameloop={playback ? "always" : "demand"}
    >
      <Scene playback={playback} />
    </Canvas>
  );
}
