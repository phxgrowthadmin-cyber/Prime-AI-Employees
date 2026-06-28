"use client";

/* eslint-disable react-hooks/purity, react-hooks/refs, react-hooks/set-state-in-effect --
 * Three.js scene file. Mutation IS the programming model:
 *   - useMemo / useState init blocks generate one-shot randomized particle layouts
 *   - useFrame callbacks mutate scratch buffers per frame (not render)
 *   - WebGL capability detection requires a mount flag set inside useEffect
 * The strict React purity rules don't fit this domain.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  SOCIAL_PLATFORMS,
  createSocialLogoTexture,
  createEarthTexture,
} from "@/lib/social-logos";

type PerfTier = "low" | "mid" | "high";

interface SceneProps {
  scrollProgress: { current: number };
  tier: PerfTier;
}

// ─── EARTH GLOBE ──────────────────────────────────────────────────────────
// Procedural Earth at the center. Slow rotation. Atmospheric back-shell.

function EarthGlobe({ scrollProgress, tier }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => createEarthTexture(), []);
  const segments = tier === "high" ? 64 : tier === "mid" ? 40 : 28;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = scrollProgress.current;

    if (groupRef.current) {
      // Subtle axial tilt + scroll-driven barrel roll
      groupRef.current.rotation.z = 0.41 + Math.sin(p * Math.PI) * 0.05;
      groupRef.current.rotation.x = -p * 0.25;
    }
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.045 + p * 0.6;
    }
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(t * 0.7) * 0.04;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Halo glow disc behind the planet (matches the cyan aura in reference) */}
      <mesh ref={haloRef} position={[0, 0, -0.4]}>
        <ringGeometry args={[2.6, 5.2, 64]} />
        <meshBasicMaterial
          color="#1e6fbf"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.2, segments, segments]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Atmospheric back-shell — cyan rim glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.35, segments, segments]} />
        <meshBasicMaterial
          color="#4fb6ff"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── ORBITING SOCIAL LOGO ─────────────────────────────────────────────────
// One sprite per logo, billboarded to face the camera.

interface OrbitConfig {
  brand: string;
  radius: number;
  speed: number;
  phase: number;
  tilt: number;       // ring tilt around X axis
  yaw: number;        // ring rotation around Y axis
  size: number;
  vertical: number;   // vertical offset within ring plane
}

function OrbitingLogo({
  config,
  scrollProgress,
}: {
  config: OrbitConfig;
  scrollProgress: { current: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createSocialLogoTexture(config.brand), [config.brand]);
  const { camera } = useThree();
  const tmp = useRef(new THREE.Vector3()).current;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const p = scrollProgress.current;

    const angle = config.phase + t * config.speed * (1 + p * 0.5);
    // Local position on a tilted ring
    const localX = Math.cos(angle) * config.radius;
    const localZ = Math.sin(angle) * config.radius;
    const localY = config.vertical + Math.sin(angle * 2 + config.phase) * 0.08;

    // Apply ring tilt (rotation around X) and yaw (rotation around Y)
    const cosT = Math.cos(config.tilt);
    const sinT = Math.sin(config.tilt);
    const yAfterTilt = localY * cosT - localZ * sinT;
    const zAfterTilt = localY * sinT + localZ * cosT;

    const cosY = Math.cos(config.yaw);
    const sinY = Math.sin(config.yaw);
    tmp.set(
      localX * cosY + zAfterTilt * sinY,
      yAfterTilt,
      -localX * sinY + zAfterTilt * cosY
    );

    meshRef.current.position.copy(tmp);
    meshRef.current.quaternion.copy(camera.quaternion);
    const breath = 1 + Math.sin(t * 1.2 + config.phase) * 0.06;
    meshRef.current.scale.setScalar(config.size * breath);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

function OrbitingLogos({ scrollProgress, tier }: SceneProps) {
  const configs = useMemo<OrbitConfig[]>(() => {
    // 3 concentric rings, each tilted slightly differently for the
    // sphere-of-orbits look in reference image 2.
    const ringPlans = [
      { radius: 3.4, count: tier === "high" ? 14 : tier === "mid" ? 10 : 7, tilt: 0.05, yaw: 0, size: 0.55, speed: 0.18 },
      { radius: 4.6, count: tier === "high" ? 20 : tier === "mid" ? 14 : 9, tilt: 0.55, yaw: 0.4, size: 0.45, speed: 0.13 },
      { radius: 5.8, count: tier === "high" ? 24 : tier === "mid" ? 16 : 10, tilt: -0.7, yaw: -0.5, size: 0.38, speed: 0.09 },
    ];

    const out: OrbitConfig[] = [];
    let brandIdx = 0;
    ringPlans.forEach((plan, ringIdx) => {
      for (let i = 0; i < plan.count; i++) {
        const platform = SOCIAL_PLATFORMS[brandIdx % SOCIAL_PLATFORMS.length];
        brandIdx++;
        out.push({
          brand: platform.brand,
          radius: plan.radius + (Math.random() - 0.5) * 0.15,
          speed: plan.speed * (1 + ringIdx * 0.1) * (Math.random() * 0.3 + 0.85),
          phase: (i / plan.count) * Math.PI * 2 + Math.random() * 0.2,
          tilt: plan.tilt,
          yaw: plan.yaw,
          size: plan.size + (Math.random() - 0.5) * 0.08,
          vertical: (Math.random() - 0.5) * 0.25,
        });
      }
    });
    return out;
  }, [tier]);

  return (
    <>
      {configs.map((c, i) => (
        <OrbitingLogo key={i} config={c} scrollProgress={scrollProgress} />
      ))}
    </>
  );
}

// ─── ENERGY LINES ─────────────────────────────────────────────────────────
// Subtle electric arcs from rings toward Earth — gives the "data flowing"
// look from reference image 2.

function EnergyArcs({ scrollProgress, tier }: SceneProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const count = tier === "high" ? 14 : tier === "mid" ? 8 : 0;
  const arcs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        phase: (i / Math.max(count, 1)) * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
        radius: 3.8 + Math.random() * 1.6,
        tilt: (Math.random() - 0.5) * 1.2,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current || count === 0) return;
    const t = clock.getElapsedTime();
    const p = scrollProgress.current;
    tmpColor.set(0x4fb6ff).lerp(new THREE.Color(0x6c63ff), p);

    for (let i = 0; i < count; i++) {
      const a = arcs[i];
      const angle = a.phase + t * a.speed * 0.4;
      const x = Math.cos(angle) * a.radius;
      const y = Math.sin(angle) * a.radius * Math.sin(a.tilt);
      const z = Math.sin(angle) * a.radius * Math.cos(a.tilt);
      dummy.position.set(x * 0.5, y * 0.5, z * 0.5);
      dummy.lookAt(0, 0, 0);
      const len = a.radius * (0.7 + Math.sin(t * 2 + a.phase) * 0.1);
      dummy.scale.set(0.015, 0.015, len);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, tmpColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (count === 0) return null;
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[1, 1, 1, 6, 1]} />
      <meshBasicMaterial transparent opacity={0.35} depthWrite={false} />
    </instancedMesh>
  );
}

// ─── STARFIELD ────────────────────────────────────────────────────────────

function Starfield({ count, scrollProgress }: { count: number; scrollProgress: { current: number } }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const m = new THREE.PointsMaterial({
      color: "#dfe7ff",
      size: 0.32,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    return { geometry: g, material: m };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.005;
    pointsRef.current.rotation.x = scrollProgress.current * 0.3;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ─── AURORA BACKDROP ──────────────────────────────────────────────────────
// Large back-facing dome with a blue/cyan gradient — emulates the cosmic
// nebula glow in reference image 2.

function AuroraDome() {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const W = 256;
    const H = 256;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Deep navy base
    ctx.fillStyle = "#070b20";
    ctx.fillRect(0, 0, W, H);

    // Aurora wisps — radial gradients
    const blobs = [
      { x: 0.3, y: 0.4, r: 0.5, color: "rgba(50,110,200,0.7)" },
      { x: 0.7, y: 0.5, r: 0.6, color: "rgba(108,99,255,0.5)" },
      { x: 0.5, y: 0.7, r: 0.7, color: "rgba(0,170,230,0.55)" },
      { x: 0.2, y: 0.8, r: 0.4, color: "rgba(80,180,255,0.45)" },
    ];
    for (const b of blobs) {
      const g = ctx.createRadialGradient(
        b.x * W,
        b.y * H,
        0,
        b.x * W,
        b.y * H,
        b.r * W
      );
      g.addColorStop(0, b.color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.008;
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[80, 32, 16]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

// ─── CAMERA RIG ───────────────────────────────────────────────────────────
// Glides through a series of waypoints driven by scroll. Mouse parallax adds
// micro-motion on top.

const cameraScratch = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();

function CameraRig({ scrollProgress }: { scrollProgress: { current: number } }) {
  const { camera, mouse } = useThree();

  useFrame(() => {
    const p = scrollProgress.current;
    const waypoints: THREE.Vector3[] = [
      new THREE.Vector3(0, 0.6, 13),     // 0 Origin — full view, Earth + rings
      new THREE.Vector3(-2.0, 1.4, 10.5), // 1 Capabilities — angled approach
      new THREE.Vector3(2.8, -0.6, 9.5),  // 2 Agents — under-side glance
      new THREE.Vector3(-3.0, 2.0, 8.5),  // 3 Integrations — close pass
      new THREE.Vector3(0.0, 3.0, 12.0),  // 4 Pricing — pull back, top down
      new THREE.Vector3(0, 0.5, 16.0),    // 5 Convergence — sit-back full frame
    ];
    const total = waypoints.length - 1;
    const scaled = p * total;
    const i = Math.min(Math.floor(scaled), total - 1);
    const localT = scaled - i;

    cameraScratch.copy(waypoints[i]).lerp(waypoints[i + 1], localT);
    cameraScratch.x += mouse.x * 0.7;
    cameraScratch.y += mouse.y * 0.4;

    camera.position.lerp(cameraScratch, 0.06);
    cameraTarget.set(0, 0, 0);
    camera.lookAt(cameraTarget);
  });

  return null;
}

// ─── SCENE ROOT ───────────────────────────────────────────────────────────

function Scene({ scrollProgress, tier }: SceneProps) {
  const starCount = tier === "high" ? 1400 : tier === "mid" ? 700 : 300;
  return (
    <>
      <CameraRig scrollProgress={scrollProgress} />
      <AuroraDome />
      <Starfield count={starCount} scrollProgress={scrollProgress} />
      <EarthGlobe scrollProgress={scrollProgress} tier={tier} />
      <EnergyArcs scrollProgress={scrollProgress} tier={tier} />
      <OrbitingLogos scrollProgress={scrollProgress} tier={tier} />
    </>
  );
}

// ─── PUBLIC COMPONENT ─────────────────────────────────────────────────────

export function ImmersiveScrollScene() {
  const [tier, setTier] = useState<PerfTier | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollProgress = useRef<{ current: number }>({ current: 0 }).current;

  useEffect(() => {
    setMounted(true);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setTier("low");
      return;
    }

    let webglOK = false;
    try {
      const probe = document.createElement("canvas");
      const gl = probe.getContext("webgl2") || probe.getContext("webgl");
      webglOK = !!gl;
    } catch {
      webglOK = false;
    }
    if (!webglOK) {
      setTier("low");
      return;
    }

    const cores = navigator.hardwareConcurrency || 2;
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) {
      setTier(cores >= 6 ? "mid" : "low");
    } else if (cores >= 8) {
      setTier("high");
    } else if (cores >= 4) {
      setTier("mid");
    } else {
      setTier("low");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let frame = 0;
    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      scrollProgress.current = THREE.MathUtils.clamp(p, 0, 1);
      frame = 0;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mounted, scrollProgress]);

  if (!mounted || tier === null) {
    return <div className="fixed inset-0 -z-10 bg-bg-primary" aria-hidden />;
  }

  if (tier === "low") {
    return <LowTierFallback />;
  }

  return (
    <div className="fixed inset-0 -z-10 bg-bg-primary" aria-hidden>
      <Canvas
        dpr={tier === "high" ? [1, 1.75] : [1, 1.25]}
        gl={{
          antialias: tier === "high",
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.6, 13], fov: 55, near: 0.1, far: 200 }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#070b20"]} />
        <fog attach="fog" args={["#070b20", 28, 90]} />
        <Scene scrollProgress={scrollProgress} tier={tier} />
      </Canvas>
      {/* Vignette so type stays readable over the scene */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(7,11,32,0.6) 100%)",
        }}
      />
    </div>
  );
}

function LowTierFallback() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg-primary" aria-hidden>
      {/* Earth-themed CSS aura: navy base + cyan glow ring + dust */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #2961a6 0%, #0a2e5a 40%, #07112b 70%, transparent 100%)",
          boxShadow: "0 0 200px 30px rgba(79,182,255,0.25), inset -40px -40px 100px rgba(0,0,0,0.4)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(108,99,255,0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
