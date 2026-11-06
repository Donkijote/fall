import { CuboidCollider, CylinderCollider, Physics, RigidBody } from "@react-three/rapier";

export default function PhysicsDrop({ attempt }: { attempt: number }) {
  const fromRight = attempt % 2 === 1;

  return (
    <Physics>
      <CuboidCollider
        position={[0, -1.9, 0]}
        args={[10, 0.08, 10]}
        restitution={0.25}
        friction={0.7}
      />
      <RigidBody
        key={attempt}
        position={[fromRight ? 1.33 : -1.33, 1.8, 0.45]}
        rotation={[0.45, 0.4, 0.6]}
        colliders={false}
        angularVelocity={[fromRight ? 2 : 0, 1, 3]}
        linearDamping={0.35}
        angularDamping={0.45}
      >
        <CylinderCollider args={[0.05, 0.27]} restitution={0.3} friction={0.65} />
        <mesh>
          <cylinderGeometry args={[0.27, 0.27, 0.1, 32]} />
          <meshStandardMaterial color="#e49c62" metalness={0.42} roughness={0.27} />
        </mesh>
        <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.17, 0.2, 32]} />
          <meshBasicMaterial color="#ffe0a8" side={2} />
        </mesh>
      </RigidBody>
    </Physics>
  );
}
