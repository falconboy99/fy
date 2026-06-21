"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CosmicScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xd3b27c, 1.1);
    scene.add(ambient);

    const point = new THREE.PointLight(0xffd18f, 1.4, 30);
    point.position.set(2, 1, 4);
    scene.add(point);

    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.16, 220, 20);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x9f7936,
      emissive: 0x36230d,
      metalness: 0.85,
      roughness: 0.24,
      transparent: true,
      opacity: 0.4,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    const count = 800;
    const vertices = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      vertices[i * 3] = (Math.random() - 0.5) * 24;
      vertices[i * 3 + 1] = (Math.random() - 0.5) * 16;
      vertices[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xf4d6a2,
      size: 0.025,
      transparent: true,
      opacity: 0.72,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    let raf = 0;
    const animate = () => {
      knot.rotation.x += 0.0025;
      knot.rotation.y += 0.0034;
      stars.rotation.y += 0.0007;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      knotGeo.dispose();
      knotMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="cosmic-scene" ref={mountRef} aria-hidden />;
}
