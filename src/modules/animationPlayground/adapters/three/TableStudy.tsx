import gsap from "gsap";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import { MathUtils } from "three";
import type { Group, Mesh, MeshBasicMaterial } from "three";

import { useGSAP } from "@gsap/react";
import { OrthographicCamera, RoundedBox, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { deckCardCount } from "../../application/lab";
import type { CardDropEffect, Lab } from "../../application/lab";
import shadowTexture from "../../assets/ember.svg";
import { CardMesh } from "./Card";
import { cardCaptureDuration, sampleCardCapture } from "./cardCapture";
import type { FrostUniform } from "./cardFrost";
import type { HeatUniforms } from "./cardHeat";
import { cardLandingPose, flameCooldownDuration, sampleCardImpact } from "./cardImpactMotion";
import { FlameEnvelope } from "./FlameEnvelope";
import { FlameImpact } from "./FlameImpact";
import { HeatImpactWave } from "./HeatImpactWave";
import { IceShards } from "./IceShards";
import { useMotionSettings } from "./MotionSettings";
import {
  captureDuration,
  captureElement,
  captureFlight,
  collectAt,
  impactAt,
} from "./tableCapture";

const viewHeight = 6.1;
const tableDepth = 5.55;
const dealerY = -1.93;
const seatCount = 4;
const rounds = 3;
const handCardCount = seatCount * rounds;
const playedCardIndex = (rounds - 1) * seatCount; // The top card of the right player's hand.
const centerCardCount = 4;
const matchedCardIndex = playedCardIndex + 1; // Top card of the far player’s hand.
const movingCardCount = handCardCount + centerCardCount;
const remainingCards = deckCardCount - movingCardCount;
const cardPitch = 0.0075;
const feltTop = 0.04;

function stackHeight(index: number) {
  return feltTop + 0.012 + index * cardPitch;
}

function TableCard({
  size,
  frost,
  heat,
}: {
  size: number;
  frost?: RefObject<FrostUniform>;
  heat?: RefObject<HeatUniforms>;
}) {
  return (
    <group rotation={[0, Math.PI, 0]} scale={[size, size, 0.07]}>
      <CardMesh frost={frost} heat={heat} />
    </group>
  );
}

export function TableStudy({
  lab,
  captureEffect,
  capturing,
}: {
  lab: Lab;
  captureEffect: CardDropEffect;
  capturing: boolean;
}) {
  const motionSettings = useMotionSettings();
  const simpleCapture = lab.getState().activeCaptureMode === "card";
  const capturedCardIndex = simpleCapture ? handCardCount : matchedCardIndex;
  const tabletop = useRef<Group>(null);
  const heatWave = useRef({ value: 0 });
  const shatter = useRef({ value: 0 });
  const blast = useRef({ blast: 0, burn: 0 });
  const frost = useRef({ value: 0 });
  const playedHeat = useRef<HeatUniforms>({
    strength: { value: 0 },
    time: { value: 0 },
    scorch: { value: 0 },
    ignition: { value: 1 },
  });
  const matchHeat = useRef<HeatUniforms>({
    strength: { value: 0 },
    time: { value: 0 },
    impact: { value: [0.16, 0.19, 0.54] },
    scorch: { value: 0 },
  });
  const flameTrail = useRef<Group>(null);
  const flameOpacity = useRef({ value: 0 });
  const flameIgnition = useRef({ value: 0 });
  const fallShadow = useRef<Mesh>(null);
  const shadowMaterial = useRef<MeshBasicMaterial>(null);
  const shadow = useTexture(shadowTexture);
  const cards = useRef<Group[]>([]);
  const [flights] = useState(() =>
    Array.from({ length: movingCardCount }, (_, index) => ({
      progress: 0,
      stackIndex: deckCardCount - 1 - index,
    })),
  );
  const [playMotion] = useState(() => ({ progress: 0 }));
  const [captureMotion] = useState(() => ({ progress: 0, cooldown: 0 }));
  const size = useThree(({ size }) => size);
  const tableWidth = Math.max(3.5, (viewHeight * size.width) / Math.max(1, size.height) - 0.24);
  const deckX = -Math.min(1.83, tableWidth / 2 - 0.55);
  const cardSize = Math.min(0.34, tableWidth * 0.054);
  const centerSpacing = Math.min(0.88, tableWidth * 0.14);
  const centerRowSpacing = 2.88 * cardSize + 0.14;
  const sideX = tableWidth / 2 - Math.min(0.92, tableWidth * 0.135);
  const seats = [
    { x: sideX, y: 0.1, angle: -Math.PI / 2 },
    { x: 0, y: 1.9, angle: 0 },
    { x: -sideX, y: 0.1, angle: Math.PI / 2 },
    { x: 0, y: dealerY, angle: 0 },
  ];

  const matchX = Math.min(1.55, sideX * 0.76);
  const matchY = -1.16;
  const matchZ = stackHeight(0);
  const blastScale = Math.min(
    0.69,
    (tableWidth / 2 - matchX - 0.12) / 1.78,
    (tableDepth / 2 + matchY - 0.12) / 1.78,
  );

  useFrame(({ clock }) => {
    const capture = captureMotion.progress;
    const effect = lab.getState().activeCaptureIntensity;
    const ember = effect === "flame";
    const duration = captureDuration(effect);
    const afterCollection = (captureMotion.cooldown * duration) / captureDuration("plain");
    const impact = sampleCardImpact(
      effect,
      (capture - impactAt) * duration + afterCollection,
      (1 - impactAt) * duration,
    );
    const pose = cardLandingPose(effect, impact);
    const impactScale = cardSize / 0.83;
    const hitX = matchX + (pose.x + 0.18) * impactScale;
    const hitY = matchY + pose.y * impactScale;
    const lowerX = matchX + (pose.lowerX + 0.03) * impactScale;
    const lowerY = matchY + (pose.lowerY + 0.06) * impactScale;
    const prime = captureElement(capture, effect);
    const flamePrime = ember ? prime : 0;
    heatWave.current.value = impact.heatWave;
    frost.current.value = prime * impact.frost;
    shatter.current.value = impact.shards;
    blast.current.blast = impact.blast;
    blast.current.burn = impact.burn;
    playedHeat.current.time.value = clock.elapsedTime;
    matchHeat.current.time.value = clock.elapsedTime;
    playedHeat.current.strength.value = prime * impact.topHeat;
    matchHeat.current.strength.value = impact.bottomHeat;
    if (playedHeat.current.scorch) playedHeat.current.scorch.value = prime * impact.topScorch;
    if (matchHeat.current.scorch) matchHeat.current.scorch.value = impact.bottomScorch;
    if (playedHeat.current.ignition) playedHeat.current.ignition.value = ember ? flamePrime : 1;
    if (matchHeat.current.impact) matchHeat.current.impact.value[2] = ember ? 0 : 0.54;
    flameIgnition.current.value = flamePrime;
    flameOpacity.current.value = impact.fireLife;
    if (flameTrail.current) {
      flameTrail.current.visible = ember && flamePrime > 0 && flameOpacity.current.value > 0.002;
      flameTrail.current.scale.setScalar(cardSize);
    }
    if (fallShadow.current)
      fallShadow.current.visible = !simpleCapture && capture > 0.27 && capture < impactAt;

    if (tabletop.current) {
      const tableShake = pose.tableShake * impactScale;
      tabletop.current.position.set(tableShake, -0.23 + tableShake * 0.6, -0.1 - tableShake * 0.38);
      tabletop.current.rotation.set(-Math.PI / 2, 0, tableShake * 0.37);
    }

    cards.current.forEach((card, index) => {
      const { progress, stackIndex } = flights[index];
      const center = index >= handCardCount;
      let x: number;
      let y: number;
      let angle: number;
      let landingZ: number;

      if (center) {
        const centerIndex = index - handCardCount;
        const column = centerIndex % 2;
        const row = Math.floor(centerIndex / 2);
        x = (column - 0.5) * centerSpacing;
        y = (0.5 - row) * centerRowSpacing;
        angle = 0;
        landingZ = stackHeight(0);
      } else {
        const seat = seats[index % seatCount];
        const round = Math.floor(index / seatCount);
        const spread = round - (rounds - 1) / 2;
        const spacing = spread * 0.21;
        x = seat.x + Math.cos(seat.angle) * spacing;
        y = seat.y + Math.sin(seat.angle) * spacing;
        angle = seat.angle - spread * 0.11;
        landingZ = stackHeight(round);
      }

      const played = index === playedCardIndex ? playMotion.progress : 0;
      const lift = (center ? 0.48 : 0.26) * Math.sin(Math.PI * progress);
      if (played > 0) {
        card.position.set(
          MathUtils.lerp(x, Math.min(1.55, sideX * 0.76), played),
          MathUtils.lerp(y, -1.16, played),
          MathUtils.lerp(landingZ, stackHeight(0), played) + 0.42 * Math.sin(Math.PI * played),
        );
        card.rotation.set(
          0,
          Math.PI * MathUtils.smoothstep(played, 0.18, 0.87),
          MathUtils.lerp(angle, -0.12, played),
        );
      } else {
        card.position.set(
          MathUtils.lerp(deckX, x, progress),
          MathUtils.lerp(dealerY, y, progress),
          MathUtils.lerp(stackHeight(stackIndex), landingZ, progress) + lift,
        );
        card.rotation.set(
          0,
          center ? Math.PI * MathUtils.smoothstep(progress, 0.16, 0.86) : 0,
          angle * progress,
        );
      }

      const topCard = index === playedCardIndex;
      if (topCard) card.scale.setScalar(1);
      if (simpleCapture && (topCard || index === capturedCardIndex)) {
        const sample = sampleCardCapture(
          capture,
          topCard,
          { x, y, z: landingZ, angle },
          { x: -centerSpacing / 2, y: centerRowSpacing / 2, z: matchZ },
          { x: sideX, y: 1.55, z: stackHeight(4) },
          cardPitch,
        );
        card.position.set(sample.position[0], sample.position[1], sample.position[2]);
        card.rotation.set(sample.rotation[0], sample.rotation[1], sample.rotation[2]);
        return;
      }
      if (!capture || (!topCard && index !== capturedCardIndex)) return;

      if (capture < collectAt) {
        if (topCard) {
          if (capture <= 0.27) return;
          const flight = captureFlight(capture, effect, impact);
          card.position.set(
            MathUtils.lerp(x, hitX, flight.travel),
            MathUtils.lerp(y, hitY, flight.travel) + flight.lift * 0.22,
            MathUtils.lerp(landingZ, matchZ + cardPitch, flight.travel) + flight.lift,
          );
          card.rotation.set(
            pose.pitch * flight.flip,
            Math.PI * flight.flip + pose.roll * flight.flip,
            MathUtils.lerp(angle, -pose.yaw, flight.travel),
          );
          // The overhead camera cannot show much vertical motion on its own.
          card.scale.setScalar(1 + flight.lift * 0.27);
          if (fallShadow.current && shadowMaterial.current) {
            fallShadow.current.position.set(
              card.position.x,
              card.position.y - flight.lift * 0.35,
              feltTop + 0.003,
            );
            fallShadow.current.scale.setScalar(1 + flight.lift * 0.44);
            shadowMaterial.current.opacity =
              flight.travel * (0.36 - Math.min(flight.lift, 1.6) * 0.16);
          }
        } else {
          const earlierPlay = MathUtils.smoothstep(capture, 0, 0.23);
          card.position.set(
            MathUtils.lerp(x, lowerX, earlierPlay),
            MathUtils.lerp(y, lowerY, earlierPlay),
            MathUtils.lerp(landingZ, matchZ, earlierPlay) + 0.38 * Math.sin(Math.PI * earlierPlay),
          );
          card.rotation.y = Math.PI * MathUtils.smoothstep(earlierPlay, 0.12, 0.88);
          card.rotation.z = angle * (1 - earlierPlay) - (pose.lowerYaw - 0.09);
        }
        return;
      }

      const collect = MathUtils.smoothstep(capture, collectAt, 1);
      const flip = Math.PI * MathUtils.smoothstep(collect, 0.14, 0.86);
      const offsetZ = topCard ? cardPitch : 0;
      const offsetX = topCard ? (hitX - lowerX) * (1 - collect) : 0;
      const offsetY = topCard ? (hitY - lowerY) * (1 - collect) : 0;
      // Keep the landing offset when picking up the pair, then square the pile.
      card.position.set(
        MathUtils.lerp(lowerX, sideX, collect) +
          Math.cos(flip) * offsetX +
          Math.sin(flip) * offsetZ,
        MathUtils.lerp(lowerY, 1.55, collect) + offsetY,
        MathUtils.lerp(matchZ, matchZ + cardPitch, collect) +
          0.52 * Math.sin(Math.PI * collect) +
          Math.cos(flip) * offsetZ -
          Math.sin(flip) * offsetX,
      );
      const landingYaw = topCard ? -pose.yaw : -(pose.lowerYaw - 0.09);
      card.rotation.set(0, Math.PI + flip, landingYaw * (1 - collect));
    });
  });

  useGSAP(
    () => {
      const hands = flights.slice(0, handCardCount);
      const center = flights.slice(handCardCount);

      function timeline(batch: typeof flights, duration: number) {
        const deal = gsap.timeline({ paused: true }).timeScale(motionSettings.speed);
        batch.forEach((flight, index) => {
          deal.to(
            flight,
            {
              progress: 1,
              duration,
              ease: motionSettings.ease === "original" ? "power1.out" : motionSettings.ease,
              onStart: lab.playDealCard,
            },
            index * 0.24,
          );
        });
        return deal;
      }

      function stackFrom(batch: typeof flights, top: number) {
        batch.forEach((flight, index) => {
          flight.stackIndex = top - index;
        });
      }

      function startDeal(batch: typeof flights, other: typeof flights, otherDealt: boolean) {
        if (otherDealt) {
          stackFrom(batch, remainingCards + batch.length - 1);
        } else {
          stackFrom(batch, deckCardCount - 1);
          stackFrom(other, deckCardCount - 1 - batch.length);
        }
      }

      const handDeal = timeline(hands, 0.54);
      const centerDeal = timeline(center, 0.68);
      const play = gsap
        .timeline({ paused: true })
        .timeScale(motionSettings.speed)
        .to(playMotion, {
          progress: 1,
          duration: 0.75,
          ease: motionSettings.ease === "original" ? "power1.inOut" : motionSettings.ease,
        });

      const capture = gsap
        .timeline({ paused: true })
        .timeScale(motionSettings.speed)
        .to(captureMotion, {
          progress: 1,
          duration: simpleCapture ? cardCaptureDuration : captureDuration("plain"),
          ease: "none",
        });
      if (!simpleCapture)
        capture.to(captureMotion, {
          cooldown: flameCooldownDuration,
          duration: flameCooldownDuration,
          ease: "none",
        });

      function startCapture(replay = false) {
        if (
          lab.getState().tableCaptures &&
          handDeal.progress() === 1 &&
          (replay || capture.progress() === 0)
        ) {
          capture
            .timeScale(
              simpleCapture
                ? motionSettings.speed
                : (motionSettings.speed * captureDuration("plain")) /
                    captureDuration(lab.getState().activeCaptureIntensity),
            )
            .restart();
        }
      }

      handDeal.eventCallback("onComplete", () => {
        if (lab.getState().tablePlays > 0) play.restart();
        else startCapture();
      });

      const saved = lab.getState();
      if (saved.centerDeals && !saved.tableDeals) startDeal(center, hands, false);
      handDeal.progress(saved.tableDeals > 0 ? 1 : 0, true);
      centerDeal.progress(saved.centerDeals > 0 ? 1 : 0, true);
      play.progress(saved.tablePlays > 0 ? 1 : 0, true);
      capture.progress(saved.tableCaptures > 0 ? 1 : 0, true);

      return lab.subscribe((state, previous) => {
        if (!state.tableCaptures && previous.tableCaptures) capture.pause(0, true);
        if (!state.tableDeals && !state.centerDeals) {
          play.pause(0, true);
          handDeal.pause(0, true);
          centerDeal.pause(0, true);
          startDeal(hands, center, false);
          return;
        }
        if (state.tableDeals !== previous.tableDeals) {
          play.pause(0, true);
          startDeal(hands, center, state.centerDeals > 0);
          handDeal.restart();
        }
        if (state.centerDeals !== previous.centerDeals) {
          startDeal(center, hands, state.tableDeals > 0);
          centerDeal.restart();
        }
        if (state.tablePlays > previous.tablePlays && handDeal.progress() === 1) {
          play.restart();
        }
        if (state.tableCaptures > previous.tableCaptures) startCapture(true);
      });
    },
    { dependencies: [lab, flights, playMotion, captureMotion], revertOnUpdate: true },
  );

  return (
    <>
      <OrthographicCamera
        makeDefault
        zoom={Math.max(1, size.height) / viewHeight}
        position={[0, 6.4, 0.48]}
        rotation={[-Math.atan2(6.4, 0.48), 0, 0]}
      />
      <group ref={tabletop} position={[0, -0.23, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <RoundedBox
          args={[tableWidth, tableDepth, 0.2]}
          position={[0, 0, -0.1]}
          radius={0.09}
          smoothness={4}
        >
          <meshStandardMaterial color="#66402c" roughness={0.54} />
        </RoundedBox>
        <RoundedBox
          args={[tableWidth - 0.22, tableDepth - 0.22, 0.09]}
          position={[0, 0, -0.005]}
          radius={0.04}
          smoothness={4}
        >
          <meshStandardMaterial color="#164a38" roughness={1} />
        </RoundedBox>
        {capturing && captureEffect === "heat" && (
          <group position={[matchX + 0.07, matchY, feltTop + 0.004]} scale={0.88}>
            <HeatImpactWave motion={heatWave} />
          </group>
        )}
        {capturing && captureEffect === "ice" && (
          <group position={[matchX - 0.11, matchY - 0.05, matchZ]} scale={0.49}>
            <IceShards progress={shatter} />
          </group>
        )}
        {capturing && captureEffect === "flame" && (
          <group
            position={[
              matchX - 0.15 * blastScale,
              matchY - 0.08 * blastScale,
              feltTop * (1 - blastScale) + 0.002,
            ]}
            scale={blastScale}
          >
            <FlameImpact motion={blast} overhead />
          </group>
        )}
        {capturing && (
          <mesh ref={fallShadow} visible={false} renderOrder={1}>
            <planeGeometry args={[1.1, 1.34]} />
            <meshBasicMaterial
              ref={shadowMaterial}
              map={shadow}
              color="#000"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        )}
        {simpleCapture &&
          Array.from({ length: 3 }, (_, index) => (
            <group key={`captured-${index}`} position={[sideX, 1.55, stackHeight(index)]}>
              <TableCard size={cardSize} />
            </group>
          ))}
        {Array.from({ length: remainingCards }, (_, index) => (
          <group key={index} position={[deckX, dealerY, stackHeight(index)]}>
            <TableCard size={cardSize} />
          </group>
        ))}
        {Array.from({ length: movingCardCount }, (_, index) => (
          <group
            key={index}
            position={[deckX, dealerY, stackHeight(deckCardCount - 1 - index)]}
            ref={(card) => {
              if (card) cards.current[index] = card;
            }}
          >
            <TableCard
              size={cardSize}
              frost={index === playedCardIndex ? frost : undefined}
              heat={
                index === playedCardIndex
                  ? playedHeat
                  : index === capturedCardIndex
                    ? matchHeat
                    : undefined
              }
            />
            {index === playedCardIndex && capturing && captureEffect === "flame" && (
              <group ref={flameTrail} visible={false}>
                <FlameEnvelope opacity={flameOpacity} ignition={flameIgnition} />
              </group>
            )}
          </group>
        ))}
      </group>
    </>
  );
}
