import { Component, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import type { Group } from "three";

import { getCardFaceUrl } from "@/components/cards/SuitGlyph";
import { CardArtworkProvider, useCardFaceTextures } from "@/components/cards/three/CardArtwork";
import { CardMesh } from "@/components/cards/three/CardMesh";
import { FlameEnvelope } from "@/components/cards/three/FlameEnvelope";
import { useDeckArtwork } from "@/components/cards/useDeckArtwork";
import type { Card } from "@/domain/entities/Card";

import { Canvas, useFrame } from "@react-three/fiber";

import type { TableBonusEffects } from "./tableBonusEffects";

function CardFlames({
  board,
  effect,
  index,
  card: face,
}: {
  board: RefObject<HTMLDivElement | null>;
  effect: TableBonusEffects[number];
  index: number;
  card: Card;
}) {
  const anchor = useRef<Group>(null);
  const heatCard = useRef<Group>(null);
  const flames = useRef<Group>(null);
  const { deck } = useDeckArtwork();
  const faceUrl = getCardFaceUrl(face.suit, face.rank, deck);
  const textures = useCardFaceTextures([faceUrl]);
  useFrame(({ clock }) => {
    const root = board.current;
    const card = root?.querySelectorAll<HTMLElement>("[data-bonus-card]")[index];
    if (!root || !card || !anchor.current) return;
    const bounds = root.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    anchor.current.visible =
      effect.stage >= 3 &&
      (effect.flame.current.value > 0.001 || effect.heat.current.strength.value > 0.001);
    if (heatCard.current) heatCard.current.visible = effect.stage === 3;
    if (flames.current) flames.current.visible = effect.stage === 4;
    effect.heat.current.time.value = clock.elapsedTime;
    anchor.current.position.set(
      rect.left + rect.width / 2 - bounds.left - bounds.width / 2,
      bounds.height / 2 - (rect.top + rect.height / 2 - bounds.top),
      0,
    );
    anchor.current.scale.setScalar(rect.width / 2.06);
  });
  return (
    <group ref={anchor} visible={false}>
      <group ref={heatCard} visible={false}>
        <CardMesh heat={effect.heat} faceTexture={textures.get(faceUrl)} />
      </group>
      <group ref={flames} visible={false}>
        <FlameEnvelope opacity={effect.flame} ignition={effect.ignition} />
      </group>
    </group>
  );
}

// A lost/unavailable renderer must never interrupt the DOM deal or score handoff.
class FlameBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function TableBonusFlames({
  board,
  effects,
  cards,
}: {
  board: RefObject<HTMLDivElement | null>;
  effects: TableBonusEffects;
  cards: Card[];
}) {
  if (typeof WebGL2RenderingContext === "undefined") return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      <FlameBoundary>
        <Canvas
          orthographic
          camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 200 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
        >
          <CardArtworkProvider>
            {effects.map((effect, index) => (
              <CardFlames
                key={index}
                board={board}
                effect={effect}
                index={index}
                card={cards[index]}
              />
            ))}
          </CardArtworkProvider>
        </Canvas>
      </FlameBoundary>
    </div>
  );
}
