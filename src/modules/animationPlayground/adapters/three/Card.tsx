import gsap from "gsap";
import { useRef, useState } from "react";
import { MathUtils, type Group } from "three";

import { CardMesh } from "@/components/cards/three/CardMesh";

import { useGSAP } from "@gsap/react";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import type { Lab } from "../../application/lab";
import { FlameCardEffects } from "./FlameCardEffects";
import { useMotionSettings } from "./MotionSettings";

gsap.registerPlugin(useGSAP);

export function Card({
  lab,
  frozen,
  hot,
  flaming,
}: {
  lab: Lab;
  frozen: boolean;
  hot: boolean;
  flaming: boolean;
}) {
  const motionSettings = useMotionSettings();
  const frost = useRef({ value: frozen ? 1 : 0 });
  const heat = useRef({
    strength: { value: hot ? 1 : flaming ? 0.68 : 0 },
    time: { value: 0 },
    scorch: { value: flaming ? 1 : 0 },
  });
  const pose = useRef<Group>(null);
  const turn = useRef<Group>(null);
  const hit = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);
  useGSAP(
    () => {
      if (!turn.current || !hit.current) return;
      // A new preview restarts shader envelopes without replacing the card mesh.
      frost.current.value = 0;
      heat.current.strength.value = 0;
      heat.current.scorch.value = 0;
      const flip = gsap
        .timeline({ paused: true })
        .timeScale(motionSettings.speed)
        .to(turn.current.rotation, {
          y: Math.PI,
          duration: 0.72,
          ease: motionSettings.ease === "original" ? "power2.inOut" : motionSettings.ease,
        });
      flip.progress(lab.getState().faceUp ? 0 : 1);

      const shake = gsap
        .timeline({ paused: true })
        .timeScale(motionSettings.speed)
        .to(
          hit.current.position,
          {
            keyframes: { x: [0, -0.19, 0.15, -0.09, 0.045, 0] },
            duration: 0.43,
          },
          0,
        )
        .to(
          hit.current.rotation,
          {
            keyframes: { z: [0, -0.12, 0.085, -0.045, 0] },
            duration: 0.43,
          },
          0,
        );

      return lab.subscribe((state, previous) => {
        if (state.faceUp !== previous.faceUp) {
          if (state.faceUp) flip.reverse();
          else flip.play();
        }
        if (state.impact !== previous.impact) shake.restart();
      });
    },
    { dependencies: [lab], revertOnUpdate: true },
  );

  useFrame(({ pointer, clock }, delta) => {
    heat.current.time.value = clock.elapsedTime;
    heat.current.strength.value = MathUtils.damp(
      heat.current.strength.value,
      hot ? 1 : flaming ? 0.68 : 0,
      3,
      delta,
    );
    heat.current.scorch.value = MathUtils.damp(
      heat.current.scorch.value,
      flaming ? 1 : 0,
      flaming ? 2.2 : 4,
      delta,
    );
    frost.current.value = MathUtils.damp(
      frost.current.value,
      frozen ? 1 : 0,
      frozen ? 2.4 : 4,
      delta,
    );
    if (!pose.current) return;
    const { position, rotation } = pose.current;
    const lift = (hovered ? 0.18 : 0) - (flaming ? 0.17 : 0);
    position.y = MathUtils.damp(position.y, lift, 8, delta);
    pose.current.scale.setScalar(
      MathUtils.damp(pose.current.scale.x, flaming ? 0.91 : 1, 8, delta),
    );
    rotation.x = MathUtils.damp(rotation.x, hovered ? -pointer.y * 0.36 : -0.09, 8, delta);
    rotation.y = MathUtils.damp(rotation.y, hovered ? pointer.x * 0.55 : -0.2, 8, delta);
    rotation.z = MathUtils.damp(rotation.z, hovered ? 0 : -0.085, 8, delta);
  });

  return (
    <group ref={pose} rotation={[-0.09, -0.2, -0.085]}>
      <group ref={hit}>
        <group
          ref={turn}
          onPointerOver={(event) => {
            if (event.pointerType === "mouse") setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          onPointerUp={(event) => {
            if (event.button !== 0) return;
            event.stopPropagation();
            lab.run("flip");
          }}
        >
          <CardMesh frost={frost} heat={heat} />
          {flaming && <FlameCardEffects />}
        </group>
      </group>
    </group>
  );
}
