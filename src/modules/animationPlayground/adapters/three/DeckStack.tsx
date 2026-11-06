import gsap from "gsap";
import { useRef } from "react";
import type { Group } from "three";

import { useGSAP } from "@gsap/react";
import { PresentationControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { deckCardCount } from "../../application/lab";
import type { Lab } from "../../application/lab";
import { CardMesh } from "./Card";
import { useMotionSettings } from "./MotionSettings";

const cardPitch = 0.028;
const center = (deckCardCount - 1) / 2;

export function DeckStack({ lab }: { lab: Lab }) {
  const motionSettings = useMotionSettings();
  const cards = useRef<Group[]>([]);
  const lifts = useRef<Group[]>([]);
  const aspect = useThree(({ size }) => size.width / size.height);
  const scale = Math.min(0.7, aspect * 0.77);

  useGSAP(
    () => {
      const fan = gsap.timeline({ paused: true }).timeScale(motionSettings.speed);
      const riffle = gsap.timeline({ paused: true }).timeScale(motionSettings.speed);
      const liftDuration = 0.28;
      riffle.to(
        lifts.current.map((card) => card.position),
        {
          x: 0.58,
          z: 0.72,
          duration: liftDuration,
          ease: motionSettings.ease === "original" ? "power2.out" : motionSettings.ease,
        },
        0,
      );

      cards.current.forEach((card, index) => {
        const offset = (index - center) / center;
        const spreadAt = (deckCardCount - 1 - index) * 0.011;
        fan.to(
          card.position,
          {
            x: offset * 2.28,
            y: 0.38 - offset ** 2 * 0.82,
            duration: 0.72,
            ease: motionSettings.ease === "original" ? "power2.inOut" : motionSettings.ease,
          },
          spreadAt,
        );
        fan.to(
          card.rotation,
          {
            z: -offset * 0.56,
            duration: 0.72,
            ease: motionSettings.ease === "original" ? "power2.inOut" : motionSettings.ease,
          },
          spreadAt,
        );

        // Low indices sit at the bottom. Each card drops from the raised packet
        // while the unreleased cards stay above it.
        const releaseAt = liftDuration + 0.08 + index * 0.038;
        riffle.to(
          lifts.current[index].position,
          {
            x: 0,
            z: 0,
            duration: 0.24,
            ease: motionSettings.ease === "original" ? "power2.in" : motionSettings.ease,
          },
          releaseAt,
        );
      });

      fan.progress(lab.getState().deckFanned ? 1 : 0);
      return lab.subscribe((state, previous) => {
        if (state.deckFanned !== previous.deckFanned) {
          if (state.deckFanned) fan.play();
          else fan.reverse();
        }
        if (state.riffles !== previous.riffles) riffle.restart();
      });
    },
    { dependencies: [lab], revertOnUpdate: true },
  );

  return (
    <PresentationControls
      global
      cursor={false}
      speed={1.45}
      damping={0.16}
      polar={[-0.6, 0.85]}
      azimuth={[-1.25, 1.25]}
    >
      <group position={[0, -0.28, 0]} rotation={[-0.96, 0, -0.13]} scale={scale}>
        {Array.from({ length: deckCardCount }, (_, index) => (
          <group
            key={index}
            position={[0, 0, (index - center) * cardPitch]}
            ref={(node) => {
              if (node) cards.current[index] = node;
            }}
          >
            <group
              ref={(node) => {
                if (node) lifts.current[index] = node;
              }}
            >
              <group rotation={[0, Math.PI, 0]} scale={[1, 1, 0.27]}>
                <CardMesh />
              </group>
            </group>
          </group>
        ))}
      </group>
    </PresentationControls>
  );
}
