import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Genera una textura canvas para la cara superior del keycap
function createKeycapTexture(text: string, isHighlighted: boolean): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Fondo keycap
  ctx.fillStyle = isHighlighted ? "#434C5E" : "#3B4252";
  ctx.fillRect(0, 0, 256, 256);

  // Borde sutil interno
  ctx.strokeStyle = isHighlighted ? "#88C0D0" : "#4C566A";
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 236, 236);

  // Texto glifo
  ctx.fillStyle = isHighlighted ? "#ECEFF4" : "#D8DEE9";
  ctx.font = text.length > 2 ? "bold 44px 'JetBrains Mono', monospace" : "bold 72px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function initHeroScene(container: HTMLElement): () => void {
  // Comprobación de reduced motion o fallback
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 450;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    return () => {};
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Iluminación Nord
  const ambientLight = new THREE.AmbientLight(0xd8dee9, 1.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x88c0d0, 2.5);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0x88c0d0, 3, 10);
  pointLight.position.set(0, 0, 3);
  scene.add(pointLight);

  const group = new THREE.Group();
  scene.add(group);

  // Keycaps: Space central + orbitales
  const keyConfigs = [
    { label: "Space", x: 0, y: 0, z: 0, w: 2.8, h: 1.1, d: 0.6, highlight: true },
    { label: "f", x: -2.4, y: 1.4, z: -0.4, w: 1.1, h: 1.1, d: 0.6, highlight: false },
    { label: "o", x: -0.8, y: 1.7, z: 0.2, w: 1.1, h: 1.1, d: 0.6, highlight: false },
    { label: "d", x: 0.8, y: 1.7, z: -0.2, w: 1.1, h: 1.1, d: 0.6, highlight: false },
    { label: "g", x: 2.4, y: 1.3, z: -0.5, w: 1.1, h: 1.1, d: 0.6, highlight: false },
    { label: "r", x: -2.3, y: -1.4, z: -0.2, w: 1.1, h: 1.1, d: 0.6, highlight: false },
    { label: "t", x: -0.8, y: -1.6, z: 0.3, w: 1.1, h: 1.1, d: 0.6, highlight: false },
    { label: "c", x: 0.8, y: -1.6, z: -0.1, w: 1.1, h: 1.1, d: 0.6, highlight: false },
    { label: "b", x: 2.3, y: -1.4, z: 0.1, w: 1.1, h: 1.1, d: 0.6, highlight: false },
  ];

  const meshes: Array<{ mesh: THREE.Mesh; origX: number; origY: number; origZ: number; speed: number; phase: number }> = [];

  for (const cfg of keyConfigs) {
    const geom = new RoundedBoxGeometry(cfg.w, cfg.h, cfg.d, 4, 0.08);
    const texture = createKeycapTexture(cfg.label, cfg.highlight);

    const sideMat = new THREE.MeshStandardMaterial({
      color: cfg.highlight ? 0x434c5e : 0x2e3440,
      roughness: 0.4,
      metalness: 0.1,
    });

    const topMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.3,
      metalness: 0.1,
      emissive: cfg.highlight ? 0x88c0d0 : 0x000000,
      emissiveIntensity: cfg.highlight ? 0.15 : 0,
    });

    // Materiales en orden de caras: +X, -X, +Y, -Y, +Z, -Z
    const materials = [sideMat, sideMat, sideMat, sideMat, topMat, sideMat];
    const mesh = new THREE.Mesh(geom, materials);

    mesh.position.set(cfg.x, cfg.y, cfg.z);
    mesh.rotation.x = 0.25;
    mesh.rotation.y = -0.15;
    group.add(mesh);

    meshes.push({
      mesh,
      origX: cfg.x,
      origY: cfg.y,
      origZ: cfg.z,
      speed: 0.8 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Parallax con el mouse
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const onMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX = (x / rect.width) * 0.5;
    mouseY = -(y / rect.height) * 0.5;
  };

  window.addEventListener("mousemove", onMouseMove);

  // Render loop controlado con pausa fuera del viewport
  let isVisible = true;
  let reqId = 0;
  let startTime = performance.now();

  const io = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !reqId) {
      animate();
    }
  }, { threshold: 0.1 });
  io.observe(container);

  const animate = () => {
    if (!isVisible) {
      reqId = 0;
      return;
    }
    const elapsedTime = (performance.now() - startTime) / 1000;

    // Lerp hacia el mouse
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    group.rotation.y = targetX * 0.6;
    group.rotation.x = targetY * 0.6;

    // Flotación sutil de cada keycap
    for (const item of meshes) {
      item.mesh.position.y = item.origY + Math.sin(elapsedTime * item.speed + item.phase) * 0.08;
      item.mesh.position.z = item.origZ + Math.cos(elapsedTime * (item.speed * 0.8) + item.phase) * 0.05;
    }

    renderer.render(scene, camera);
    reqId = requestAnimationFrame(animate);
  };

  animate();

  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize);

  return () => {
    io.disconnect();
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    cancelAnimationFrame(reqId);
    renderer.dispose();
    for (const item of meshes) {
      item.mesh.geometry.dispose();
      if (Array.isArray(item.mesh.material)) {
        item.mesh.material.forEach(m => m.dispose());
      }
    }
    if (renderer.domElement.parentElement) {
      renderer.domElement.remove();
    }
  };
}
