import {
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  ShaderMaterial,
  Vector2,
} from "three";

import { applyProps } from "@react-three/fiber";

import { animateMaterials } from "./animateMaterials";

function createLayers() {
  const uniforms = {
    uTime: { value: 0 },
    uDpr: { value: 1 },
    uPointer: { value: new Vector2() },
  };
  const layers = new Group();
  const materials = Array.from({ length: 6 }, (_, index) => {
    const material = new ShaderMaterial();
    applyProps(material, { uniforms });
    const geometry = new BufferGeometry();
    layers.add(
      index === 2 || index === 5 ? new Points(geometry, material) : new Mesh(geometry, material),
    );
    return material;
  });
  return { uniforms, layers, materials };
}

describe("login material animation", () => {
  it("updates attached shader uniforms even when R3F copies scalar wrappers", () => {
    const { uniforms, layers, materials } = createLayers();
    for (const material of materials) {
      expect(material.uniforms.uTime).not.toBe(uniforms.uTime);
    }

    animateMaterials(layers, 0.5, 1.5);

    for (const material of materials) {
      expect(material.uniforms.uTime.value).toBe(0.5);
      expect(material.uniforms.uDpr.value).toBe(1.5);
    }
    expect(uniforms.uTime.value).toBe(0);
  });

  it("keeps fog and ember time advancing without any pointer movement", () => {
    const { layers, materials } = createLayers();
    animateMaterials(layers, 1, 1);
    animateMaterials(layers, 2, 1);

    for (const material of materials) {
      expect(material.uniforms.uTime.value).toBe(2);
      expect(material.uniforms.uPointer.value.toArray()).toEqual([0, 0]);
    }
  });

  it("continues animating after material props are reapplied", () => {
    const { uniforms, layers, materials } = createLayers();
    animateMaterials(layers, 2, 1);
    for (const material of materials) applyProps(material, { uniforms });

    animateMaterials(layers, 3, 1.25);

    for (const material of materials) {
      expect(material.uniforms.uTime.value).toBe(3);
      expect(material.uniforms.uDpr.value).toBe(1.25);
    }
  });

  it("ignores non-shader scene objects", () => {
    const layers = new Group();
    layers.add(new Mesh(new BufferGeometry(), new MeshBasicMaterial()));
    expect(() => animateMaterials(layers, 1, 1)).not.toThrow();
  });
});
