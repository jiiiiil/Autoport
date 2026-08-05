"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeCanvasBackgroundProps {
  primaryColor?: string;
  accentColor?: string;
  particleCount?: number;
  className?: string;
}

export function ThreeCanvasBackground({
  primaryColor = "#00f0ff", // Electric Cyan
  accentColor = "#f59e0b",  // Neon Gold/Amber
  particleCount = 700,
  className = "",
}: ThreeCanvasBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.0018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 400;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 4. Particle Wave Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const c1 = new THREE.Color(primaryColor);
    const c2 = new THREE.Color(accentColor);
    const c3 = new THREE.Color("#38bdf8"); // Cyan highlight

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 1400;
      positions[i3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i3 + 2] = (Math.random() - 0.5) * 1000;

      const mix = Math.random();
      const color = mix < 0.6 ? c1 : mix < 0.85 ? c2 : c3;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      scales[i] = Math.random() * 4 + 1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Material with Soft Glow Sprite
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 6,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 5. Floating 3D Geometric Polyhedra (Icosahedrons & Octahedrons)
    const shapesGroup = new THREE.Group();
    const wireframeMat1 = new THREE.MeshBasicMaterial({
      color: new THREE.Color(primaryColor),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframeMat2 = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });

    const icoGeo = new THREE.IcosahedronGeometry(60, 1);
    const octGeo = new THREE.OctahedronGeometry(45, 0);

    const shape1 = new THREE.Mesh(icoGeo, wireframeMat1);
    shape1.position.set(-280, 120, -100);
    shapesGroup.add(shape1);

    const shape2 = new THREE.Mesh(octGeo, wireframeMat2);
    shape2.position.set(300, -100, -150);
    shapesGroup.add(shape2);

    const shape3 = new THREE.Mesh(icoGeo, wireframeMat1);
    shape3.position.set(220, 200, -200);
    shape3.scale.set(0.6, 0.6, 0.6);
    shapesGroup.add(shape3);

    scene.add(shapesGroup);

    // 6. Interactive Parallax & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.4;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 0.3;
      camera.position.y = -targetY * 0.3;
      camera.lookAt(scene.position);

      // Rotate particle cloud gently
      particles.rotation.y = time * 0.03;
      particles.rotation.x = Math.sin(time * 0.02) * 0.1;

      // Animate wave positions
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pos[i3 + 1] += Math.sin(time * 1.5 + pos[i3] * 0.005) * 0.3;
      }
      geometry.attributes.position.needsUpdate = true;

      // Rotate floating geometric shapes
      shape1.rotation.x = time * 0.15;
      shape1.rotation.y = time * 0.2;
      shape2.rotation.x = -time * 0.2;
      shape2.rotation.z = time * 0.15;
      shape3.rotation.y = time * 0.25;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      material.dispose();
      texture.dispose();
      wireframeMat1.dispose();
      wireframeMat2.dispose();
      icoGeo.dispose();
      octGeo.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [primaryColor, accentColor, particleCount]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
