"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

interface SocialIconParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  angle: number;
  angleVelocity: number;
  icon: string;
  color: string;
}

const SOCIAL_PLATFORMS = [
  { name: "Instagram", icon: "📷", color: "#E4405F" },
  { name: "X", icon: "𝕏", color: "#000000" },
  { name: "TikTok", icon: "♪", color: "#000000" },
  { name: "YouTube", icon: "▶", color: "#FF0000" },
  { name: "LinkedIn", icon: "in", color: "#0A66C2" },
  { name: "Snapchat", icon: "👻", color: "#FFFC00" },
  { name: "Discord", icon: "◉", color: "#5865F2" },
  { name: "Telegram", icon: "✈", color: "#0088cc" },
];

function SocialNetworkScene() {
  const ref = useRef<THREE.Group>(null);
  const { camera, scene } = useThree();
  const particlesRef = useRef<SocialIconParticle[]>([]);

  useEffect(() => {
    camera.position.z = 30;
  }, [camera]);

  useEffect(() => {
    // Create social media particles
    const particles: SocialIconParticle[] = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 20;
      const depth = (Math.random() - 0.5) * 40;

      const platform = SOCIAL_PLATFORMS[Math.floor(Math.random() * SOCIAL_PLATFORMS.length)];

      particles.push({
        position: new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, depth),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        ),
        angle: Math.random() * Math.PI * 2,
        angleVelocity: (Math.random() - 0.5) * 0.02,
        icon: platform.icon,
        color: platform.color,
      });
    }

    particlesRef.current = particles;

    // Create meshes for each particle
    particles.forEach((particle) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d")!;

      // Draw background circle
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(128, 128, 100, 0, Math.PI * 2);
      ctx.fill();

      // Draw icon
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

      // Update particles
      ref.current.children.forEach((mesh) => {
        const meshData = (mesh as any).userData;
        if (meshData?.particle) {
          const particle = meshData.particle;

          // Update position
          particle.position.add(particle.velocity);

          // Bounce off boundaries
          if (Math.abs(particle.position.x) > 25) particle.velocity.x *= -1;
          if (Math.abs(particle.position.y) > 25) particle.velocity.y *= -1;
          if (Math.abs(particle.position.z) > 40) particle.velocity.z *= -1;

          // Update angle
          particle.angle += particle.angleVelocity;

          // Apply to mesh
          mesh.position.copy(particle.position);
          mesh.rotation.z = particle.angle;

          // Add subtle bob animation
          mesh.position.y += Math.sin(Date.now() * 0.001 + particle.position.x) * 0.02;
        }
      });
    }
  });

  return <group ref={ref} />;
}

export function NeuralNetworkHero() {
  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-bg-primary via-bg-primary to-surface overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="absolute inset-0" style={{ background: "transparent" }}>
        <SocialNetworkScene />
        <Preload all />
      </Canvas>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary/80 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="space-y-4 px-4 max-w-3xl animate-fade-in">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              AI Agents
            </span>
            <br />
            <span className="text-text-1">That Never Sleep</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-2 max-w-2xl mx-auto leading-relaxed">
            Deploy intelligent autonomous agents that handle your entire business. Sales, support, research, operations—all running 24/7.
          </p>
        </div>
      </div>
    </div>
  );
}
