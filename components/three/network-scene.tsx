"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { useTheme } from "next-themes";
import { useIsMobile, useReducedMotion } from "@/hooks/use-media";
import { createNetworkData, stepNetwork } from "@/lib/network-sim";

type Pointer = { x: number; y: number };
type Props = { count: number; reduced: boolean; dark: boolean; pointer: React.RefObject<Pointer> };

function Network({ count, reduced, dark, pointer }: Props) {
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const packetsRef = useRef<THREE.Points>(null);

  // Lazily created once per `count` (pure, seeded); mutated only by stepNetwork().
  const [data] = useState(() => createNetworkData(count));

  useFrame((state, delta) => {
    stepNetwork(data, Math.min(delta, 0.05) * 60, reduced);

    const lines = linesRef.current;
    if (lines) {
      (lines.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      lines.geometry.setDrawRange(0, data.segCount * 2);
    }
    const pts = pointsRef.current;
    if (pts) (pts.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    const pk = packetsRef.current;
    if (pk) (pk.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

    const g = group.current;
    if (g && !reduced) {
      g.rotation.y += (pointer.current.x * 0.35 - g.rotation.y) * 0.04;
      g.rotation.x += (-pointer.current.y * 0.2 - g.rotation.x) * 0.04;
      g.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.09} vertexColors transparent opacity={dark ? 0.95 : 0.8} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={dark ? "#7f9dff" : "#4466dd"} transparent opacity={dark ? 0.2 : 0.22} depthWrite={false} />
      </lineSegments>
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.packetPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.17} color={dark ? "#38d4f2" : "#0e7490"} transparent opacity={0.95} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

/** Lightweight R3F distributed-systems graph. Pauses when scrolled out of view. */
export default function NetworkScene() {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const count = mobile ? 38 : 85;

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      <Canvas
        key={count}
        dpr={mobile ? 1 : [1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "low-power" }}
        frameloop={visible ? "always" : "never"}
        style={{ pointerEvents: "none" }}
      >
        <Network count={count} reduced={reduced} dark={resolvedTheme !== "light"} pointer={pointer} />
      </Canvas>
    </div>
  );
}
