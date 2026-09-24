"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas
    });
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    const group = new THREE.Group();
    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2(0, 0);

    camera.position.set(0, 0, 9);
    scene.add(group);

    const coreGeometry = new THREE.IcosahedronGeometry(1.45, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x66d8ff,
      transparent: true,
      opacity: 0.16,
      wireframe: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const nodePositions: number[] = [];
    const nodeColors: number[] = [];
    const lines: number[] = [];
    const palette = [
      new THREE.Color("#80dfff"),
      new THREE.Color("#8e7bff"),
      new THREE.Color("#36c486"),
      new THREE.Color("#f2a23a")
    ];

    for (let i = 0; i < 66; i += 1) {
      const radius = 2.25 + (i % 9) * 0.23;
      const angle = i * 0.74;
      const layer = (i % 7) - 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle * 0.82) * (1.25 + (i % 5) * 0.1);
      const z = Math.sin(angle) * radius * 0.54 + layer * 0.18;
      const color = palette[i % palette.length];

      nodePositions.push(x, y, z);
      nodeColors.push(color.r, color.g, color.b);

      if (i > 0 && i % 3 !== 0) {
        lines.push(
          nodePositions[(i - 1) * 3],
          nodePositions[(i - 1) * 3 + 1],
          nodePositions[(i - 1) * 3 + 2],
          x,
          y,
          z
        );
      }
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute("color", new THREE.Float32BufferAttribute(nodeColors, 3));

    const nodeMaterial = new THREE.PointsMaterial({
      size: 0.075,
      transparent: true,
      opacity: 0.82,
      vertexColors: true
    });

    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    group.add(nodes);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x9bdfff,
      transparent: true,
      opacity: 0.18
    });
    const meshLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(meshLines);

    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.11
    });

    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(
          new THREE.Path()
            .absellipse(0, 0, 2.4 + i * 0.58, 1.1 + i * 0.24, 0, Math.PI * 2)
            .getSpacedPoints(160)
        ),
        ringMaterial
      );
      ring.rotation.x = 0.65 + i * 0.28;
      ring.rotation.y = -0.35 + i * 0.18;
      group.add(ring);
    }

    function resize() {
      if (!canvas) {
        return;
      }

      const { clientWidth, clientHeight } = canvas;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(clientWidth, clientHeight, false);
    }

    function onPointerMove(event: PointerEvent) {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    let animationFrame = 0;

    function animate() {
      const elapsed = clock.getElapsedTime();

      if (isVisible) {
        group.rotation.y = elapsed * 0.14 + pointer.x * 0.12;
        group.rotation.x = Math.sin(elapsed * 0.35) * 0.12 - pointer.y * 0.08;
        core.rotation.x = elapsed * 0.18;
        core.rotation.y = elapsed * 0.28;
        nodes.rotation.z = Math.sin(elapsed * 0.22) * 0.12;
        renderer.render(scene, camera);
      }

      animationFrame = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrame);
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      ringMaterial.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="heroOrbit" aria-hidden="true" />;
}
