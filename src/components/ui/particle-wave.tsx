"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleWaveProps {
  className?: string;
}

const ParticleWave: React.FC<ParticleWaveProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // --------------------------------------------------
    // Scene
    // --------------------------------------------------
    const scene = new THREE.Scene();

    // --------------------------------------------------
    // Camera
    // --------------------------------------------------
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    camera.position.set(0, 8, 18);
    camera.lookAt(0, 0, 0);

    // --------------------------------------------------
    // Renderer
    // --------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(
      container.clientWidth,
      container.clientHeight,
      false,
    );

    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // --------------------------------------------------
    // Particle configuration
    // --------------------------------------------------
    const particleCount = 5000;

    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    const colors = new Float32Array(particleCount * 3);

    // --------------------------------------------------
    // Create particle wave
    // --------------------------------------------------
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const x = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 20;

      const distance = Math.sqrt(x * x + z * z);

      const y =
        Math.sin(distance * 0.8) * 1.2 +
        Math.sin(x * 0.5) * 0.4 +
        Math.cos(z * 0.4) * 0.3;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      // Particle color
      const color = new THREE.Color();

      const colorValue = 0.5 + Math.random() * 0.5;

      color.setRGB(
        0.15 * colorValue,
        0.55 * colorValue,
        1 * colorValue,
      );

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    // --------------------------------------------------
    // Geometry
    // --------------------------------------------------
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3),
    );

    // --------------------------------------------------
    // Particle material
    // --------------------------------------------------
    const material = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // --------------------------------------------------
    // Particle system
    // --------------------------------------------------
    const particles = new THREE.Points(geometry, material);

    scene.add(particles);

    // --------------------------------------------------
    // Animation
    // --------------------------------------------------
    const clock = new THREE.Clock();

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      const positionAttribute = geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;

      const positionArray = positionAttribute.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        const x = originalPositions[i3];
        const originalY = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        // Create moving wave
        const wave1 =
          Math.sin(
            x * 0.45 +
              elapsedTime * 1.2,
          ) * 0.5;

        const wave2 =
          Math.cos(
            z * 0.35 +
              elapsedTime * 0.8,
          ) * 0.35;

        const radialWave =
          Math.sin(
            Math.sqrt(x * x + z * z) * 0.8 -
              elapsedTime * 1.5,
          ) * 0.5;

        positionArray[i3] = x;

        positionArray[i3 + 1] =
          originalY +
          wave1 +
          wave2 +
          radialWave;

        positionArray[i3 + 2] = z;
      }

      positionAttribute.needsUpdate = true;

      // Slowly rotate the entire particle field
      particles.rotation.y =
        elapsedTime * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    // --------------------------------------------------
    // Responsive resize
    // --------------------------------------------------
    const handleResize = () => {
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2),
      );
    };

    const resizeObserver = new ResizeObserver(
      handleResize,
    );

    resizeObserver.observe(container);

    // --------------------------------------------------
    // Cleanup
    // --------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);

      resizeObserver.disconnect();

      geometry.dispose();
      material.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
    />
  );
};

export default ParticleWave;