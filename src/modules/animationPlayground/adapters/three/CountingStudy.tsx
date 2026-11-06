import { useEffect, useRef } from "react";
import type { Group } from "three";

import { Html, OrthographicCamera, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { deckCardCount } from "../../application/lab";
import type { Lab } from "../../application/lab";
import { CardMesh } from "./Card";
import { countingArrival, countingProgress, sampleCountingCard } from "./cardCounting";
import { useMotionSettings } from "./MotionSettings";

export function CountingStudy({ lab, total, quota }: { lab: Lab; total: number; quota: number }) {
  const { size } = useThree();
  const { speed } = useMotionSettings();
  const cards = useRef<Group[]>([]);
  const elapsed = useRef(0);
  const lastCount = useRef(-1);
  const counter = useRef<HTMLSpanElement>(null);
  const points = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const bonusLabel = useRef<HTMLParagraphElement>(null);
  const tableWidth = Math.max(5.6, (size.width / Math.max(1, size.height)) * 6.1 - 0.4);

  useEffect(() => {
    elapsed.current = 0;
    lastCount.current = -1;
  }, [lab, total, quota]);

  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, 0.05) * speed;
    const seconds = elapsed.current;
    const progress = countingProgress(seconds, total, quota);
    cards.current.forEach((card, index) => {
      if (index >= total) return;
      const pose = sampleCountingCard(index, seconds, total, quota);
      card.position.set(...pose.position);
      card.rotation.set(...pose.rotation);
      card.scale.setScalar(pose.scale);
      card.visible = pose.visible;
    });
    if (progress.counted !== lastCount.current) {
      if (progress.counted > 0) lab.playDealCard();
      lastCount.current = progress.counted;
      if (counter.current) counter.current.textContent = `${progress.counted} / ${total}`;
      if (status.current) {
        status.current.textContent = progress.complete
          ? "Counting complete"
          : progress.counted >= quota
            ? "Each extra card earns a point"
            : `Counting to ${quota}`;
      }
      if (points.current) {
        points.current.textContent = `+${progress.points}`;
        points.current.style.opacity = progress.points > 0 ? "1" : "0";
      }
      if (bonusLabel.current) {
        bonusLabel.current.textContent =
          progress.points > 0
            ? progress.points === 1
              ? "BONUS POINT"
              : "BONUS POINTS"
            : progress.complete
              ? "NO BONUS POINTS"
              : "";
      }
    }
    if (points.current) {
      const sincePoint = seconds - countingArrival(progress.counted - 1, quota);
      const pulse = progress.points > 0 ? Math.max(0, 1 - sincePoint / 0.4) : 0;
      points.current.style.transform = `translateY(${-pulse * 8}px) scale(${1 + Math.sin(pulse * Math.PI) * 0.16})`;
    }
  });

  return (
    <>
      <OrthographicCamera
        makeDefault
        zoom={Math.max(1, size.height) / 6.1}
        position={[0, 6.4, 0.48]}
        rotation={[-Math.atan2(6.4, 0.48), 0, 0]}
      />
      <group position={[0, -0.23, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <RoundedBox
          args={[tableWidth, 5.55, 0.2]}
          position={[0, 0, -0.1]}
          radius={0.09}
          smoothness={4}
        >
          <meshStandardMaterial color="#66402c" roughness={0.54} />
        </RoundedBox>
        <RoundedBox
          args={[tableWidth - 0.22, 5.33, 0.09]}
          position={[0, 0, -0.005]}
          radius={0.04}
          smoothness={4}
        >
          <meshStandardMaterial color="#164a38" roughness={1} />
        </RoundedBox>
        {Array.from({ length: deckCardCount - total }, (_, index) => (
          <group key={`opponent-${index}`} position={[-2.1, 1.5, 0.065 + index * 0.008]}>
            <group rotation={[0, Math.PI, 0.07]} scale={[0.3, 0.3, 0.07]}>
              <CardMesh />
            </group>
          </group>
        ))}
        {Array.from({ length: total }, (_, index) => (
          <group
            key={index}
            position={[2.1, -0.6, 0.065 + (total - index) * 0.008]}
            ref={(card) => {
              if (card) cards.current[index] = card;
            }}
          >
            <group scale={[0.3, 0.3, 0.07]}>
              <CardMesh />
            </group>
          </group>
        ))}
      </group>
      <Html fullscreen className="pointer-events-none select-none">
        <div className="absolute inset-x-4 top-14 text-center text-white">
          <p className="text-xs font-medium tracking-[0.2em] text-white/60">END OF ROUND</p>
          <p ref={status} role="status" className="mt-2 text-sm">
            Counting to {quota}
          </p>
        </div>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-amber-200">
          <div
            ref={points}
            className="font-heading text-6xl font-bold tabular-nums opacity-0 sm:text-7xl"
          >
            +0
          </div>
          <p ref={bonusLabel} className="mt-2 text-xs font-medium tracking-[0.16em]" />
        </div>
        <div className="absolute inset-x-4 bottom-6 flex items-end justify-between gap-4 text-white">
          <div>
            <p className="text-xs text-white/60">Cards counted</p>
            <span ref={counter} className="text-2xl font-semibold tabular-nums">
              0 / {total}
            </span>
          </div>
          <div className="text-right text-xs text-white/60">
            <p>Your captured pile</p>
            <p className="mt-1">Quota {quota} · +1 per extra card</p>
          </div>
        </div>
      </Html>
    </>
  );
}
