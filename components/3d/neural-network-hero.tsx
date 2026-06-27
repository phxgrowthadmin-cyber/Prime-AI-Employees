"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";

function NeuralNetwork() {
  const ref = useRef<THREE.Points>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 30;
  }, [camera]);

  // Generate particle positions in a neural network pattern
  const particlesArray = useRef<Float32Array | null>(null);

  useEffect(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      // Create neural network-like clusters
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 20;
      const depth = (Math.random() - 0.5) * 40;

      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = Math.sin(angle) * radius;
      positions[i + 2] = depth;
    }

    particlesArray.current = positions;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.0001;
      ref.current.rotation.y += 0.0002;
    }
  });

  return (
    <Points ref={ref} positions={particlesArray.current || new Float32Array()} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#6C63FF" size={0.2} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

export function NeuralNetworkHero() {
  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-bg-primary via-bg-primary to-surface overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="absolute inset-0" style={{ background: "transparent" }}>
        <NeuralNetwork />
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
