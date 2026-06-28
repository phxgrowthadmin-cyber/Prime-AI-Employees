"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";
import { FloatingLogosCss } from "./floating-logos-css";

interface IntegrationParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  angle: number;
  angleVelocity: number;
  icon: string;
  color: string;
}

const INTEGRATIONS = [
  { icon: '💬', name: 'Slack', color: '#36C5F0' },
  { icon: '🎮', name: 'Discord', color: '#5865F2' },
  { icon: '🎯', name: 'HubSpot', color: '#FF7A59' },
  { icon: '🏢', name: 'Salesforce', color: '#00A1E0' },
  { icon: '📝', name: 'Notion', color: '#000000' },
  { icon: '💳', name: 'Stripe', color: '#635BFF' },
  { icon: '⚡', name: 'Zapier', color: '#FF4F00' },
  { icon: '📧', name: 'Google', color: '#4285F4' },
  { icon: '📱', name: 'Microsoft', color: '#0078D4' },
  { icon: '📋', name: 'Airtable', color: '#18BFFF' },
  { icon: '📨', name: 'Telegram', color: '#0088CC' },
  { icon: '📈', name: 'Pipedrive', color: '#2EBF91' },
];

function IntegrationNetworkScene() {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const particlesRef = useRef<IntegrationParticle[]>([]);

  useEffect(() => {
    camera.position.z = 30;
  }, [camera]);

  useEffect(() => {
    const particles: IntegrationParticle[] = [];
    const particleCount = Math.min(60, INTEGRATIONS.length * 5);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 20;
      const depth = (Math.random() - 0.5) * 40;

      const integration = INTEGRATIONS[i % INTEGRATIONS.length];

      particles.push({
        position: new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, depth),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        ),
        angle: Math.random() * Math.PI * 2,
        angleVelocity: (Math.random() - 0.5) * 0.02,
        icon: integration.icon,
        color: integration.color,
      });
    }

    particlesRef.current = particles;

    particles.forEach((particle) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(128, 128, 100, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "bold 120px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(particle.icon, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const geometry = new THREE.PlaneGeometry(1, 1);
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.copy(particle.position);
      mesh.rotation.z = particle.angle;

      (mesh as any).userData = {
        particle,
        originalZ: mesh.position.z,
      };

      if (ref.current) {
        ref.current.add(mesh);
      }
    });
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.00005;
      ref.current.rotation.y += 0.0001;

      ref.current.children.forEach((mesh) => {
        const meshData = (mesh as any).userData;
        if (meshData?.particle) {
          const particle = meshData.particle;
          particle.position.add(particle.velocity);

          if (Math.abs(particle.position.x) > 25) particle.velocity.x *= -1;
          if (Math.abs(particle.position.y) > 25) particle.velocity.y *= -1;
          if (Math.abs(particle.position.z) > 40) particle.velocity.z *= -1;

          particle.angle += particle.angleVelocity;

          mesh.position.copy(particle.position);
          mesh.rotation.z = particle.angle;
          mesh.position.y += Math.sin(Date.now() * 0.001 + particle.position.x) * 0.02;
        }
      });
    }
  });

  return <group ref={ref} />;
}

export function NeuralNetworkHero() {
  const [useWebGL, setUseWebGL] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setUseWebGL(false);
      return;
    }

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setUseWebGL(false);
        return;
      }
    } catch (e) {
      setUseWebGL(false);
      return;
    }

    // Check hardware capabilities
    const cores = navigator.hardwareConcurrency || 1;
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);

    if (cores < 2 || pixelRatio > 2) {
      setUseWebGL(false);
      return;
    }
  }, []);

  if (!isClient) {
    return (
      <div className="relative w-full h-[600px] bg-gradient-to-b from-bg-primary via-bg-primary to-[#0F1117] overflow-hidden" />
    );
  }

  // Use CSS fallback on low-end devices or if WebGL unavailable
  if (!useWebGL) {
    return <FloatingLogosCss />;
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-bg-primary via-bg-primary to-[#0F1117] overflow-hidden">
      <Canvas className="absolute inset-0" style={{ background: "transparent" }}>
        <IntegrationNetworkScene />
        <Preload all />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary/80 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="space-y-4 px-4 max-w-3xl animate-fade-in">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              AI Agents
            </span>
            <br />
            <span className="text-[#F8F9FF]">That Never Sleep</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Deploy intelligent autonomous agents that handle your entire business. Sales, support, research, operations—all running 24/7.
          </p>
        </div>
      </div>
    </div>
  );
}
