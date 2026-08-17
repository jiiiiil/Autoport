"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function VolumetricSkyBackground({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 25);
    camera.lookAt(0, 8, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Procedural Volumetric Cloud Sea Shader Material
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

      // 2D Noise functions for cloud puff density
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0) );
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float total = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 5; i++) {
          total += snoise(p) * amp;
          p *= 2.02;
          amp *= 0.5;
        }
        return total;
      }

      void main() {
        vec2 st = vUv * 3.5;
        st.x += uTime * 0.015;
        st.y += sin(uTime * 0.01) * 0.1;

        // FBM Cloud noise density
        float n = fbm(st);
        float n2 = fbm(st * 1.8 + vec2(uTime * 0.02, -uTime * 0.01));
        float cloudDensity = smoothstep(-0.2, 0.65, n + n2 * 0.5);

        // Sky colors matching reference image: Soft blue sky to cloud horizon
        vec3 skyTop = vec3(0.48, 0.82, 0.98);    // #7AD1FA
        vec3 skyBottom = vec3(0.78, 0.93, 1.0);  // #C7EEFF
        vec3 cloudBase = vec3(0.96, 0.98, 1.0);  // #F5FAFF
        vec3 cloudShadow = vec3(0.72, 0.82, 0.90); // Deep soft shadow

        // Sunlight highlights from top-left
        vec2 sunPos = vec2(0.15, 0.85);
        float sunDist = length(vUv - sunPos);
        float sunGlow = exp(-sunDist * 2.2);

        vec3 skyColor = mix(skyBottom, skyTop, vUv.y) + vec3(1.0, 0.95, 0.8) * sunGlow * 0.45;
        vec3 finalCloud = mix(cloudShadow, cloudBase, cloudDensity) + vec3(1.0, 0.9, 0.75) * sunGlow * cloudDensity * 0.3;

        vec3 finalColor = mix(skyColor, finalCloud, cloudDensity * smoothstep(0.0, 0.6, vUv.y));
        gl_FragColor = vec4(finalColor, 0.95);
      }
    `;

    const geometry = new THREE.PlaneGeometry(80, 50, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.22;
    mesh.position.set(0, -2, -5);
    scene.add(mesh);

    // 3. Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();
      mesh.position.y = -2 + Math.sin(clock.getElapsedTime() * 0.4) * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    // 4. Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`volumetric-sky-container fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Three.js Volumetric Shader Canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Layered Soft Cloud Horizon Overlay matching the image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(122,209,250,0.4) 0%, rgba(207,238,255,0.2) 40%, rgba(255,255,255,0.85) 85%, rgba(255,253,246,1) 100%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Soft Sunlight Glow (Top Left) */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-radial from-amber-100/70 via-sky-100/40 to-transparent blur-3xl opacity-80 animate-pulse pointer-events-none" />
    </div>
  );
}

export default VolumetricSkyBackground;
