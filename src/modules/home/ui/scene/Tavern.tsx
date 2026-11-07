import { useEffect, useMemo } from "react";
import { DataTexture, DoubleSide, RepeatWrapping, Shape, SRGBColorSpace } from "three";
import type { Texture } from "three";

import { createTavernSurface, tavernTextureSize } from "./tavernModel";
import type { TavernSurface } from "./tavernModel";

type Position = [number, number, number];

function Block({
  position,
  size,
  map,
  color = "#ffffff",
  rotation = [0, 0, 0],
}: {
  position: Position;
  size: Position;
  map?: Texture;
  color?: string;
  rotation?: Position;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        map={map}
        bumpMap={map}
        bumpScale={0.045}
        color={color}
        roughness={0.92}
      />
    </mesh>
  );
}

function Beam({
  start,
  end,
  map,
  width = 0.16,
  depth = 0.15,
}: {
  start: [number, number];
  end: [number, number];
  map: Texture;
  width?: number;
  depth?: number;
}) {
  const horizontal = end[0] - start[0];
  const vertical = end[1] - start[1];
  return (
    <Block
      position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, 1.85]}
      size={[width, Math.hypot(horizontal, vertical), depth]}
      rotation={[0, 0, -Math.atan2(horizontal, vertical)]}
      map={map}
    />
  );
}

function arch(width: number, height: number) {
  const shape = new Shape();
  const shoulder = height - width / 2;
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(width / 2, shoulder);
  shape.absarc(0, shoulder, width / 2, 0, Math.PI, false);
  shape.lineTo(-width / 2, 0);
  return shape;
}

function Window({
  position,
  map,
  width = 0.8,
  height = 1.2,
  rotation = [0, 0, 0],
}: {
  position: Position;
  map: Texture;
  width?: number;
  height?: number;
  rotation?: Position;
}) {
  const frame = useMemo(() => arch(width + 0.18, height + 0.1), [width, height]);
  const glass = useMemo(() => arch(width, height), [width, height]);
  return (
    <group position={position} rotation={rotation}>
      <mesh position-z={-0.04}>
        <extrudeGeometry args={[frame, { depth: 0.1, bevelEnabled: false }]} />
        <meshStandardMaterial map={map} color="#543c2b" roughness={0.9} />
      </mesh>
      <mesh position-z={0.07}>
        <shapeGeometry args={[glass]} />
        <meshStandardMaterial
          color="#e8a852"
          emissive="#ff9b2c"
          emissiveIntensity={1.7}
          roughness={0.45}
        />
      </mesh>
      <Block
        position={[0, height / 2 - 0.03, 0.1]}
        size={[0.045, height - 0.08, 0.06]}
        color="#3e302b"
      />
      {[0.33, 0.68].map((fraction) => (
        <Block
          key={fraction}
          position={[0, height * fraction, 0.1]}
          size={[width, 0.04, 0.06]}
          color="#3e302b"
        />
      ))}
      <Block position={[0, -0.04, 0.1]} size={[width + 0.35, 0.13, 0.3]} map={map} />
    </group>
  );
}

function Lantern({ horizontal }: { horizontal: number }) {
  return (
    <group position={[horizontal, 1.65, 2.1]}>
      <Block position={[0, 0.52, -0.12]} size={[0.06, 0.3, 0.08]} color="#28242a" />
      <Block position={[0, 0.6, 0]} size={[0.07, 0.07, 0.3]} color="#28242a" />
      <mesh>
        <boxGeometry args={[0.22, 0.34, 0.22]} />
        <meshStandardMaterial color="#ffda86" emissive="#ffa832" emissiveIntensity={3} />
      </mesh>
      {[-0.14, 0.14].map((height) => (
        <Block key={height} position={[0, height, 0]} size={[0.3, 0.065, 0.3]} color="#30252a" />
      ))}
      {[-0.11, 0.11].map((offset) => (
        <Block
          key={offset}
          position={[offset, 0, 0.13]}
          size={[0.025, 0.35, 0.025]}
          color="#30252a"
        />
      ))}
      <pointLight color="#ff9f3d" intensity={0.55} distance={2.5} decay={2} />
    </group>
  );
}

function Barrel({ map }: { map: Texture }) {
  return (
    <group position={[2.85, 0.55, 2.45]}>
      <mesh>
        <cylinderGeometry args={[0.34, 0.38, 0.9, 20]} />
        <meshStandardMaterial
          map={map}
          bumpMap={map}
          bumpScale={0.035}
          color="#ac906b"
          roughness={0.9}
        />
      </mesh>
      {[-0.3, 0.3].map((height) => (
        <mesh key={height} position-y={height} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.365, 0.035, 5, 20]} />
          <meshStandardMaterial color="#413c39" metalness={0.7} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function Tavern() {
  const maps = useMemo(() => {
    const surfaces: TavernSurface[] = ["stone", "timber", "roof", "plaster"];
    return Object.fromEntries(
      surfaces.map((surface) => {
        const texture = new DataTexture(
          createTavernSurface(surface),
          tavernTextureSize,
          tavernTextureSize,
        );
        texture.colorSpace = SRGBColorSpace;
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.repeat.set(surface === "roof" ? 3 : 2, 2);
        texture.needsUpdate = true;
        return [surface, texture];
      }),
    ) as Record<TavernSurface, DataTexture>;
  }, []);
  const gable = useMemo(
    () => new Shape().moveTo(-2.4, 3.95).lineTo(2.4, 3.95).lineTo(0, 6.5).closePath(),
    [],
  );
  const doorway = useMemo(() => arch(1.05, 2.05), []);

  useEffect(() => () => Object.values(maps).forEach((texture) => texture.dispose()), [maps]);

  return (
    <group rotation={[0.08, -0.42, 0.015]}>
      <Block position={[0, 0.75, 0]} size={[4.85, 1.5, 3.55]} map={maps.stone} />
      <Block position={[0, 2.75, 0]} size={[4.6, 2.55, 3.4]} map={maps.plaster} color="#cbb99e" />
      {[-1.7, 1.7].map((depth) => (
        <mesh key={depth} position-z={depth}>
          <shapeGeometry args={[gable]} />
          <meshStandardMaterial
            map={maps.plaster}
            color="#c0a783"
            roughness={1}
            side={DoubleSide}
          />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <Block
          key={side}
          position={[side * 1.51, 5.15, 0]}
          size={[4.05, 0.16, 4.6]}
          rotation={[0, 0, -side * 0.73]}
          map={maps.roof}
        />
      ))}
      <Block position={[0, 6.53, 0]} size={[0.22, 0.2, 4.8]} map={maps.timber} />
      {[-2.38, 0, 2.38].map((horizontal) => (
        <Beam
          key={horizontal}
          start={[horizontal, 1.35]}
          end={[horizontal, horizontal === 0 ? 6.5 : 4.0]}
          map={maps.timber}
          width={0.2}
        />
      ))}
      {[1.4, 2.45, 4.0].map((height) => (
        <Beam key={height} start={[-2.4, height]} end={[2.4, height]} map={maps.timber} />
      ))}
      <Beam start={[-2.65, 3.8]} end={[0, 6.65]} map={maps.timber} width={0.23} />
      <Beam start={[0, 6.65]} end={[2.65, 3.8]} map={maps.timber} width={0.23} />
      <Beam start={[-2.28, 2.5]} end={[-1.35, 3.9]} map={maps.timber} width={0.1} />
      <Beam start={[2.28, 2.5]} end={[1.35, 3.9]} map={maps.timber} width={0.1} />
      <Block
        position={[1.32, 6.15, -0.55]}
        size={[0.64, 2.7, 0.72]}
        map={maps.stone}
        color="#9d8d84"
      />
      <Block
        position={[1.32, 7.52, -0.55]}
        size={[0.88, 0.2, 0.94]}
        map={maps.stone}
        color="#877a74"
      />
      <Block position={[1.32, 7.64, -0.55]} size={[0.45, 0.06, 0.5]} color="#25232a" />
      <Window position={[-1.18, 2.58, 1.81]} map={maps.timber} />
      <Window position={[1.18, 2.58, 1.81]} map={maps.timber} />
      <Window position={[0, 4.45, 1.81]} map={maps.timber} width={0.65} height={1.0} />
      <Window position={[2.34, 2.55, 0.55]} rotation={[0, Math.PI / 2, 0]} map={maps.timber} />
      <Block position={[2.36, 2.7, -1.6]} size={[0.18, 2.7, 0.18]} map={maps.timber} />
      <Block position={[2.36, 1.42, 0]} size={[0.18, 0.2, 3.5]} map={maps.timber} />
      <mesh position={[-0.35, 0.2, 1.83]}>
        <extrudeGeometry args={[doorway, { depth: 0.12, bevelEnabled: false }]} />
        <meshStandardMaterial map={maps.timber} color="#8d704f" roughness={0.9} />
      </mesh>
      {[0.65, 1.4].map((height) => (
        <Block
          key={height}
          position={[-0.35, height, 1.98]}
          size={[0.95, 0.07, 0.06]}
          color="#302a27"
        />
      ))}
      <mesh position={[0, 1.12, 2.04]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.075, 0.02, 6, 14]} />
        <meshStandardMaterial color="#b18a4f" metalness={0.8} roughness={0.45} />
      </mesh>
      <Block
        position={[0, 2.45, 2.35]}
        size={[5.5, 0.15, 1.8]}
        rotation={[0.18, 0, 0]}
        map={maps.roof}
      />
      {[-2.4, 2.4].map((horizontal) => (
        <Block
          key={horizontal}
          position={[horizontal, 1.1, 3.0]}
          size={[0.15, 2.2, 0.15]}
          map={maps.timber}
        />
      ))}
      <Block position={[0, 2.2, 3.05]} size={[5.2, 0.16, 0.16]} map={maps.timber} />
      <Block position={[0, 0.05, 2.4]} size={[5.6, 0.24, 1.8]} map={maps.stone} />
      {[0, 1, 2].map((step) => (
        <Block
          key={step}
          position={[-0.3, -step * 0.1, 3.5 + step * 0.24]}
          size={[2.0 + step * 0.25, 0.16, 0.4]}
          map={maps.stone}
        />
      ))}
      <Lantern horizontal={-1.85} />
      <Lantern horizontal={1.85} />
      <Barrel map={maps.timber} />
      <Block
        position={[-2.85, 0.45, 2.4]}
        size={[0.75, 0.8, 0.75]}
        map={maps.timber}
        color="#c4a77a"
      />
      <Block position={[2.8, 3.35, 1.95]} size={[1.15, 0.08, 0.08]} color="#31292c" />
      <Block
        position={[3.1, 2.85, 1.95]}
        size={[0.85, 0.58, 0.13]}
        map={maps.timber}
        color="#c4a77a"
      />
      <mesh position={[3.1, 2.86, 2.04]}>
        <cylinderGeometry args={[0.1, 0.085, 0.22, 12]} />
        <meshStandardMaterial color="#c99d4f" metalness={0.6} roughness={0.45} />
      </mesh>
    </group>
  );
}
