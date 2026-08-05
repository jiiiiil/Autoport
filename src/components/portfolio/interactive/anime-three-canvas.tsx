"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import anime from "animejs";

interface AnimeThreeCanvasProps {
  className?: string;
  gridSize?: number;
}

export function AnimeThreeCanvas({ className = "", gridSize = 4 }: AnimeThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Full Screen Three.js WebGL Setup
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Detect if Light Mode is active on parent or body
    const detectLightMode = () => {
      if (typeof document === "undefined") return false;
      const root = document.querySelector(".ap-portfolio-root") || document.querySelector(".portfolio-root") || document.body;
      return (
        root.classList.contains("theme-white") ||
        root.classList.contains("theme-light") ||
        document.documentElement.classList.contains("light")
      );
    };

    const isLight = detectLightMode();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isLight ? 0xffffff : 0x050508, 0.012);

    // Camera with field of view adjusted for full screen coverage
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    scene.add(camera);

    // 2. Adaptive Lighting (Black 3D Cubes in Light Theme, Platinum Silver in Dark Theme)
    scene.add(new THREE.AmbientLight(isLight ? 0x18181b : 0xffffff, isLight ? 0.9 : 0.45));

    const pointLight = new THREE.PointLight(isLight ? 0x000000 : 0xffffff, isLight ? 12 : 8, 35, 0.3);
    pointLight.position.set(0, 0, 4.5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(isLight ? 0x09090b : 0xe2e8f0, isLight ? 3.5 : 2.0);
    dirLight.position.set(3, 5, 6);
    scene.add(dirLight);

    // 3. Full Screen 3D Cube Grid Geometry
    const count = gridSize * gridSize * gridSize;
    const cellSize = 2.2 / gridSize;
    const spread = ((gridSize - 1) / 2) * cellSize * 1.35; // Wider spread for full screen
    const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);

    // Cube Material: Onyx Black in Light Mode, Platinum Silver in Dark Mode
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(isLight ? "#09090b" : "#e2e8f0"),
      emissive: new THREE.Color(isLight ? "#18181b" : "#050508"),
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // 4. Instanced Mesh Property Targets for Anime.js
    const dummy = new THREE.Object3D();
    const instanceTargets: Array<{
      baseX: number;
      baseY: number;
      baseZ: number;
      currX: number;
      currY: number;
      currZ: number;
      rx: number;
      ry: number;
      rz: number;
    }> = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const bx = -spread + (x / (gridSize - 1 || 1)) * (spread * 2);
          const by = -spread + (y / (gridSize - 1 || 1)) * (spread * 2);
          const bz = -spread + (z / (gridSize - 1 || 1)) * (spread * 2);

          const target = {
            baseX: bx,
            baseY: by,
            baseZ: bz,
            currX: bx,
            currY: by,
            currZ: bz,
            rx: 0,
            ry: 0,
            rz: 0,
          };
          instanceTargets.push(target);
        }
      }
    }

    // 5. Anime.js Long-Duration Animations
    // Loop 1: Majestic Slow Mesh Rotation (24 seconds)
    const meshRotationTarget = { rx: 0, ry: 0 };
    const meshAnim = anime({
      targets: meshRotationTarget,
      ry: Math.PI * 2,
      rx: Math.PI * 2,
      duration: 24000,
      loop: true,
      easing: "linear",
      update: () => {
        mesh.rotation.y = meshRotationTarget.ry;
        mesh.rotation.x = meshRotationTarget.rx;
      },
    });

    // Loop 2: Slow Ambient Point Light Pulsing (6 seconds)
    const lightTarget = { intensity: isLight ? 12 : 14 };
    const lightAnim = anime({
      targets: lightTarget,
      intensity: isLight ? [24, 4] : [28, 3],
      duration: 6000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      update: () => {
        pointLight.intensity = lightTarget.intensity;
      },
    });

    // Loop 3: Slow 3D Grid Stagger Expansion (5.5 seconds)
    const instanceAnimTimeline = anime.timeline({
      loop: true,
      direction: "alternate",
    });

    instanceTargets.forEach((target) => {
      const distFromCenter = Math.sqrt(
        target.baseX * target.baseX + target.baseY * target.baseY + target.baseZ * target.baseZ
      );

      instanceAnimTimeline.add(
        {
          targets: target,
          currX: target.baseX * 3.2,
          currY: target.baseY * 3.2,
          currZ: target.baseZ * 3.2,
          rx: Math.PI,
          ry: Math.PI,
          duration: 5500,
          delay: distFromCenter * 650,
          easing: "easeInOutQuint",
        },
        0
      );
    });

    // 6. Scroll & Cursor Parallax (Full Screen Responsiveness)
    let mouseX = 0;
    let mouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0025;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0025;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      targetScrollY = window.scrollY / maxScroll;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    let animationFrameId: number;

    const render = () => {
      currentScrollY += (targetScrollY - currentScrollY) * 0.05;

      camera.position.z = 7.5 + currentScrollY * 4.0;
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - currentScrollY * 1.8 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      for (let i = 0; i < instanceTargets.length; i++) {
        const t = instanceTargets[i];
        dummy.position.set(t.currX, t.currY, t.currZ);
        dummy.rotation.set(t.rx, t.ry, t.rz);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 7. Handle Full Screen Resize & Theme Changes
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Theme class mutation observer to update 3D cube colors dynamically on theme switch
    const observer = new MutationObserver(() => {
      const currentIsLight = detectLightMode();
      material.color.set(currentIsLight ? "#09090b" : "#e2e8f0");
      material.emissive.set(currentIsLight ? "#18181b" : "#050508");
      scene.fog = new THREE.FogExp2(currentIsLight ? 0xffffff : 0x050508, 0.012);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    const rootEl = document.querySelector(".ap-portfolio-root") || document.querySelector(".portfolio-root");
    if (rootEl) observer.observe(rootEl, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      meshAnim.pause();
      lightAnim.pause();
      instanceAnimTimeline.pause();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [gridSize]);

  return <div ref={containerRef} className={`fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden ${className}`} />;
}
