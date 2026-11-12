import { useMemo, type RefObject } from "react";
import {
  ExtrudeGeometry,
  Shape,
  SRGBColorSpace,
  type MeshBasicMaterial,
  type Texture,
} from "three";

import { useCardArtwork } from "./CardArtwork";
import { addCardFrost, type FrostUniform } from "./cardFrost";
import { addCardHeat, type HeatUniforms } from "./cardHeat";

class CardGeometry extends ExtrudeGeometry {
  constructor() {
    const width = 2.06;
    const height = 2.88;
    const depth = 0.09;
    // Match the rounded silhouette of the app card while retaining the 3D mesh.
    const radius = width * (12 / 96);
    const x = width / 2 - radius;
    const y = height / 2 - radius;
    const outline = new Shape();
    outline.absarc(x, y, radius, 0, Math.PI / 2);
    outline.absarc(-x, y, radius, Math.PI / 2, Math.PI);
    outline.absarc(-x, -y, radius, Math.PI, Math.PI * 1.5);
    outline.absarc(x, -y, radius, Math.PI * 1.5, Math.PI * 2);
    outline.closePath();

    super(outline, { depth, bevelEnabled: false, curveSegments: 12 });
    this.translate(0, 0, -depth / 2);

    const [caps, sides] = this.groups;
    const { normal, position, uv } = this.attributes;
    this.clearGroups();
    this.addGroup(sides.start, sides.count, 0);

    // Project the art across the whole cap. Mirror the back UVs so it reads
    // correctly after the card turns over.
    const capEnd = caps.start + caps.count;
    let groupStart = caps.start;
    let material = normal.getZ(groupStart) > 0 ? 1 : 2;
    for (let i = caps.start; i < capEnd; i += 3) {
      const front = normal.getZ(i) > 0;
      const faceMaterial = front ? 1 : 2;
      if (faceMaterial !== material) {
        this.addGroup(groupStart, i - groupStart, material);
        groupStart = i;
        material = faceMaterial;
      }
      for (let vertex = i; vertex < i + 3; vertex++) {
        const u = position.getX(vertex) / width;
        uv.setXY(vertex, 0.5 + (front ? u : -u), 0.5 + position.getY(vertex) / height);
      }
    }
    this.addGroup(groupStart, capEnd - groupStart, material);
  }
}

const cardGeometry = new CardGeometry();

export function CardMesh({
  frost,
  heat,
  faceTexture,
}: {
  faceTexture?: Texture;
  frost?: RefObject<FrostUniform>;
  heat?: RefObject<HeatUniforms>;
}) {
  const surfaceShaders = useMemo(() => {
    function createSurfaceShader(surface: "front" | "back") {
      if (!frost && !heat) return undefined;
      const addFrost = frost && addCardFrost(frost);
      const addHeat = heat && addCardHeat(heat, surface);
      return {
        onBeforeCompile: (...args: Parameters<MeshBasicMaterial["onBeforeCompile"]>) => {
          addFrost?.(...args);
          addHeat?.(...args);
        },
        customProgramCacheKey: () => `card-surface:${surface}:${Boolean(frost)}:${Boolean(heat)}`,
      };
    }
    return { front: createSurfaceShader("front"), back: createSurfaceShader("back") };
  }, [frost, heat]);
  const [face, back] = useCardArtwork();
  return (
    <mesh geometry={cardGeometry}>
      <meshStandardMaterial attach="material-0" color="#e4e4e7" roughness={0.75} />
      <meshBasicMaterial
        attach="material-1"
        map={faceTexture ?? face}
        map-colorSpace={SRGBColorSpace}
        {...surfaceShaders.front}
      />
      <meshBasicMaterial
        attach="material-2"
        map={back}
        map-colorSpace={SRGBColorSpace}
        {...surfaceShaders.back}
      />
    </mesh>
  );
}
