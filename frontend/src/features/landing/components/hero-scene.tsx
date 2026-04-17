"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { Group, Mesh } from "three";

type HeroSceneProps = {
  scrollProgress?: number;
  spinStep?: number;
  spinDirection?: 1 | -1;
  spinLocked?: boolean;
  onSpinComplete?: () => void;
  backgroundColor?: string;
};

function BurgerModel({
  scrollProgress,
  spinStep,
  spinDirection,
  spinLocked,
  onSpinComplete,
}: {
  scrollProgress: number;
  spinStep: number;
  spinDirection: 1 | -1;
  spinLocked: boolean;
  onSpinComplete?: () => void;
}) {
  const groupRef = useRef<Group>(null);
  const gltf = useGLTF("/burger_realistic_free.glb");
  const targetRotationYRef = useRef(0);
  const lastSpinStepRef = useRef(spinStep);
  const spinCompletionSentRef = useRef(true);

  useEffect(() => {
    if (spinStep === lastSpinStepRef.current) return;
    lastSpinStepRef.current = spinStep;
    targetRotationYRef.current += Math.PI * 2 * spinDirection;
    spinCompletionSentRef.current = false;
  }, [spinDirection, spinStep]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const currentY = groupRef.current.rotation.y;
    const targetY = targetRotationYRef.current;
    const rotationDiff = targetY - currentY;

    if (Math.abs(rotationDiff) > 0.0008) {
      const maxStep = delta * 5.4;
      const step = Math.sign(rotationDiff) * Math.min(Math.abs(rotationDiff), maxStep);
      groupRef.current.rotation.y += step;
    } else {
      groupRef.current.rotation.y = targetY;
      if (spinLocked && !spinCompletionSentRef.current) {
        spinCompletionSentRef.current = true;
        onSpinComplete?.();
      }
    }

    groupRef.current.rotation.x = scrollProgress * 0.35;

    const targetScale = scrollProgress * 0.55;
    const currentScale = groupRef.current.scale.x;
    const nextScale = currentScale + (targetScale - currentScale) * 0.12;
    groupRef.current.scale.setScalar(nextScale);

    groupRef.current.position.y = -0.2 + scrollProgress * 0.22;
  });

  return (
    <group ref={groupRef} scale={0.4} position={[0, 0, -2]}>
      <Center>
        <primitive object={gltf.scene} />
      </Center>
    </group>
  );
}

function FallbackMesh() {
  const meshRef = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.45;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={meshRef} position={[0, -0.2, 0]}>
      <torusKnotGeometry args={[0.65, 0.22, 180, 24]} />
      <meshStandardMaterial color="#f3a436" roughness={0.3} metalness={0.65} />
    </mesh>
  );
}

export default function HeroScene({
  scrollProgress = 0,
  spinStep = 0,
  spinDirection = 1,
  spinLocked = false,
  onSpinComplete,
  backgroundColor = "#141211",
}: HeroSceneProps) {
  const [contextLost, setContextLost] = useState(false);

  if (contextLost) {
    return (
      <div className="relative h-full w-full" style={{ backgroundColor }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,164,54,0.16)_0%,rgba(20,18,17,0.92)_70%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/logo.png" alt="Burgembiraaa logo" width={64} height={64} className="h-16 w-16 opacity-85" />
        </div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 45 }}
      dpr={[1, 1.4]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          setContextLost(true);
        });
      }}
    >
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[backgroundColor, 5, 12]} />

      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 2]} intensity={1.15} color="#ffdca0" />
      <pointLight position={[-2, -1, 2]} intensity={0.65} color="#f3a436" />

      <Suspense fallback={<FallbackMesh />}>
        <BurgerModel
          scrollProgress={scrollProgress}
          spinStep={spinStep}
          spinDirection={spinDirection}
          spinLocked={spinLocked}
          onSpinComplete={onSpinComplete}
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/burger_realistic_free.glb");
