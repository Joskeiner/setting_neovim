// Escena Three.js del mock Neovim animado (T2/T3 de PLAN-SIMULADOR-3D.md).
// Reutiliza los patrones de HeroScene.ts: WebGLRenderer({alpha, antialias}),
// pixelRatio ≤ 2, ACESFilmic, luces Nord, IntersectionObserver + dispose.
// Animación con reloj manual (elapsed + lerp), sin GSAP. play(spec) retorna
// Promise y cancela la animación anterior.

import * as THREE from "three";
import type { PreviewSpec } from "./resolvePreview";
import {
  createEditorTexture,
  createTerminalTexture,
  createStatuslineTexture,
  createTablineTexture,
  createFiletreeTexture,
  createFinderTexture,
  createHoverTexture,
  createChatTexture,
  createToastTexture,
  createBreakpointTexture,
} from "./textures";

export type NvimStageHandle = {
  /** Reproduce (o repite) la animación del arquetipo dado. */
  play: (spec: PreviewSpec) => Promise<void>;
  /** Detiene la animación en curso y oculta actores. */
  stop: () => void;
  dispose: () => void;
};

const DURATION: Record<string, number> = {
  terminal: 1500,
  vsplit: 1000,
  hsplit: 1000,
  filetree: 1100,
  finder: 1600,
  hover: 1100,
  diagnostic: 1200,
  breakpoint: 1100,
  "git-diff": 1300,
  "ai-chat": 1700,
  "save-flash": 900,
  "buffer-cycle": 1000,
  "buffer-close": 1100,
  nohl: 1000,
  quit: 1000,
  toast: 1200,
};

const EDITOR_W = 6;
const EDITOR_H = 3.4;

export function initNvimStage(container: HTMLElement): NvimStageHandle {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 340;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    return { play: async () => {}, stop: () => {}, dispose: () => {} };
  }
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Luces Nord
  scene.add(new THREE.AmbientLight(0xd8dee9, 1.4));
  const dirLight = new THREE.DirectionalLight(0x88c0d0, 1.6);
  dirLight.position.set(4, 6, 6);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0x81a1c1, 2, 14);
  pointLight.position.set(0, 0, 4);
  scene.add(pointLight);

  // ── Actores base (mock Neovim fijo) ────────────────────────────────────────

  const editor = createEditorTexture();
  const editorPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(EDITOR_W, EDITOR_H),
    new THREE.MeshBasicMaterial({ map: editor.texture, transparent: true }),
  );
  editorPlane.position.y = 0.25;
  scene.add(editorPlane);

  // Tabline dinámica: pestañas de buffers (bufferline.nvim simulado)
  const tablineDynamic = createTablineTexture();
  const tabline = new THREE.Mesh(
    new THREE.PlaneGeometry(EDITOR_W, 0.3),
    new THREE.MeshBasicMaterial({ map: tablineDynamic.texture, transparent: true }),
  );
  tabline.position.set(0, EDITOR_H / 2 + 0.25 + 0.15, 0.001);
  scene.add(tabline);

  const statuslineMat = new THREE.MeshBasicMaterial({ map: createStatuslineTexture("normal") });
  const statusline = new THREE.Mesh(new THREE.PlaneGeometry(EDITOR_W, 0.3), statuslineMat);
  statusline.position.set(0, -EDITOR_H / 2 + 0.25 - 0.15, 0.001);
  scene.add(statusline);

  // ── Actores ocultos (se animan según kind) ────────────────────────────────

  const terminal = createTerminalTexture();
  const terminalPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(EDITOR_W, 1.4),
    new THREE.MeshBasicMaterial({ map: terminal.texture, transparent: true, opacity: 0 }),
  );
  terminalPlane.position.set(0, -2.2, 0.05);
  scene.add(terminalPlane);

  const sidebarPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, EDITOR_H),
    new THREE.MeshBasicMaterial({ map: createFiletreeTexture(), transparent: true, opacity: 0 }),
  );
  sidebarPlane.position.set(-4, 0.25, 0.04);
  scene.add(sidebarPlane);

  // Split: copia del editor desplazada + divisor brillante
  const splitPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(EDITOR_W / 2 - 0.03, EDITOR_H),
    new THREE.MeshBasicMaterial({ map: editor.texture, transparent: true, opacity: 0 }),
  );
  splitPlane.position.set(0, 0.25, -0.01);
  scene.add(splitPlane);
  // Split horizontal: panel inferior de ancho completo
  const hsplitPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(EDITOR_W, EDITOR_H),
    new THREE.MeshBasicMaterial({ map: editor.texture, transparent: true, opacity: 0 }),
  );
  hsplitPlane.position.set(0, 0.25, -0.01);
  scene.add(hsplitPlane);
  const divider = new THREE.Mesh(
    new THREE.PlaneGeometry(0.05, EDITOR_H),
    new THREE.MeshBasicMaterial({ color: 0x88c0d0, transparent: true, opacity: 0 }),
  );
  divider.position.set(0, 0.25, 0.02);
  scene.add(divider);

  // Modal finder
  const finder = createFinderTexture();
  const finderPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 2.45),
    new THREE.MeshBasicMaterial({ map: finder.texture, transparent: true, opacity: 0 }),
  );
  finderPlane.position.set(0, 0.35, 0.06);
  scene.add(finderPlane);

  // Hover / diagnostic float
  const hoverMat = { map: createHoverTexture("hover"), transparent: true, opacity: 0 } as THREE.MeshBasicMaterialParameters;
  const diagMat = { map: createHoverTexture("diagnostic"), transparent: true, opacity: 0 } as THREE.MeshBasicMaterialParameters;
  const hoverPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.1), new THREE.MeshBasicMaterial(hoverMat));
  hoverPlane.position.set(1.1, 1.0, 0.06);
  scene.add(hoverPlane);
  const diagPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.1), new THREE.MeshBasicMaterial(diagMat));
  diagPlane.position.set(1.1, 1.0, 0.06);
  scene.add(diagPlane);

  // Breakpoint en el gutter
  const breakpoint = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.22),
    new THREE.MeshBasicMaterial({ map: createBreakpointTexture(), transparent: true, opacity: 0 }),
  );
  breakpoint.position.set(-2.6, 0.25 + 0.65, 0.03);
  scene.add(breakpoint);

  // AI chat panel (derecha)
  const chat = createChatTexture();
  const chatPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, EDITOR_H),
    new THREE.MeshBasicMaterial({ map: chat.texture, transparent: true, opacity: 0 }),
  );
  chatPlane.position.set(4, 0.25, 0.05);
  scene.add(chatPlane);

  // Toast
  let toastTex: THREE.CanvasTexture | null = null;
  const toastPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.55),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
  );
  toastPlane.position.set(0, -1.2, 0.08);
  scene.add(toastPlane);

  // ── Control de animación ───────────────────────────────────────────────────

  type Anim = { t: number; duration: number; tick: (p: number, t: number) => void; resolve: () => void };
  let current: Anim | null = null;
  let reqId = 0;
  let clockStart = performance.now();
  let visible = true;
  let lastBlink = true;

  const ease = (p: number) => 1 - Math.pow(1 - p, 3); // easeOutCubic
  const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

  function hideActors() {
    terminalPlane.material.opacity = 0;
    terminalPlane.position.y = -2.2;
    sidebarPlane.material.opacity = 0;
    sidebarPlane.position.x = -4;
    splitPlane.material.opacity = 0;
    divider.material.opacity = 0;
    finderPlane.material.opacity = 0;
    finderPlane.scale.set(0.8, 0.8, 1);
    hoverPlane.material.opacity = 0;
    diagPlane.material.opacity = 0;
    hoverPlane.scale.set(0.7, 0.7, 1);
    diagPlane.scale.set(0.7, 0.7, 1);
    breakpoint.material.opacity = 0;
    breakpoint.scale.set(1, 1, 1);
    chatPlane.material.opacity = 0;
    chatPlane.position.x = 4;
    toastPlane.material.opacity = 0;
    toastPlane.position.y = -1.6;
    splitPlane.scale.set(1, 1, 1);
    splitPlane.visible = true;
    splitPlane.position.set(0, 0.25, -0.01);
    hsplitPlane.scale.set(1, 1, 1);
    hsplitPlane.visible = true;
    hsplitPlane.material.opacity = 0;
    hsplitPlane.position.set(0, 0.25, -0.01);
    editorPlane.scale.set(1, 1, 1);
    editorPlane.position.set(0, 0.25, 0);
    editorPlane.material.opacity = 1;
    statusline.material.opacity = 1;
    tabline.material.opacity = 1;
    tablineDynamic.draw(3, 0);
    divider.rotation.z = 0;
    divider.scale.set(1, 1, 1);
    divider.material.color.setHex(0x88c0d0);
    camera.position.z = 8.5;
    editor.draw("normal");
  }

  function animate() {
    if (!visible) {
      reqId = 0;
      return;
    }
    const elapsed = (performance.now() - clockStart) / 1000;

    // Cursor del editor parpadea cuando no hay animación activa
    if (!current) {
      const phase = Math.sin(elapsed * 4) > -0.2;
      if (phase !== lastBlink) {
        lastBlink = phase;
        editor.draw("normal", phase);
      }
    }

    if (current) {
      const p = Math.min((performance.now() - current.t) / current.duration, 1);
      current.tick(p, elapsed);
      if (p >= 1) {
        const resolve = current.resolve;
        current = null;
        resolve();
      }
    }

    renderer.render(scene, camera);
    reqId = requestAnimationFrame(animate);
  }

  function ensureLoop() {
    clockStart = performance.now();
    if (!reqId) reqId = requestAnimationFrame(animate);
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reqId) {
        clockStart = performance.now();
        reqId = requestAnimationFrame(animate);
      }
    },
    { threshold: 0.05 },
  );
  io.observe(container);

  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  // El contenedor nace oculto (0x0) y aparece al llegar a una hoja:
  // ResizeObserver reajusta el canvas en cuanto el layout lo hace visible.
  const ro = new ResizeObserver(onResize);
  ro.observe(container);
  window.addEventListener("resize", onResize);

  // ── Coreografías por kind ─────────────────────────────────────────────────

  function buildTick(kind: string, spec: PreviewSpec, elapsedRef: { now: number }) {
    void elapsedRef;
    switch (kind) {
      case "terminal": {
        const cmd = spec.label.toLowerCase().includes("toggle")
          ? "bun run dev"
          : spec.label;
        let typedShown = -1;
        return (p: number) => {
          const slide = ease(Math.min(p / 0.35, 1));
          terminalPlane.position.y = lerp(-2.2, -0.75, slide);
          terminalPlane.material.opacity = slide;
          // typing entre 40% y 90% de la animación
          const typingP = Math.max(0, Math.min((p - 0.4) / 0.5, 1));
          const typed = Math.round(typingP * cmd.length);
          if (typed !== typedShown) {
            typedShown = typed;
            terminal.draw(typed, cmd);
          }
        };
      }
      case "vsplit":
      case "hsplit": {
        const vertical = kind === "vsplit";
        return (p: number) => {
          const s = ease(p);
          divider.material.opacity = Math.min(p * 2, 1) * (0.6 + 0.4 * Math.abs(Math.sin(p * Math.PI * 6)));
          camera.position.z = lerp(8.5, 9.2, s);
          if (vertical) {
            splitPlane.material.opacity = s;
            editorPlane.scale.x = lerp(1, 0.49, s);
            editorPlane.position.x = lerp(0, -(EDITOR_W / 4 + 0.015), s);
            splitPlane.position.x = lerp(0, EDITOR_W / 4 + 0.015, s);
          } else {
            // Panel superior: editor original comprimido; panel inferior: segundo buffer
            editorPlane.scale.y = lerp(1, 0.49, s);
            editorPlane.position.y = lerp(0.25, 0.25 + EDITOR_H / 4 + 0.015, s);
            hsplitPlane.material.opacity = s;
            hsplitPlane.scale.y = lerp(0.02, 0.49, s);
            hsplitPlane.position.y = lerp(0.25, 0.25 - EDITOR_H / 4 - 0.015, s);
            splitPlane.visible = false;
            divider.rotation.z = Math.PI / 2;
          }
        };
      }
      case "filetree":
        return (p: number) => {
          const s = ease(Math.min(p / 0.6, 1));
          sidebarPlane.position.x = lerp(-4, -1.9, s);
          sidebarPlane.material.opacity = s;
        };
      case "finder": {
        const prompts = ["", "p", "pl", "plu", "plug"];
        const target = prompts.length - 1;
        let lastStep = -1;
        return (p: number) => {
          const s = ease(Math.min(p / 0.3, 1));
          finderPlane.material.opacity = s;
          const sc = lerp(0.8, 1, s);
          finderPlane.scale.set(sc, sc, 1);
          const step = Math.round(ease(p) * target);
          if (step !== lastStep) {
            lastStep = step;
            finder.draw(prompts[step], 0);
          }
        };
      }
      case "hover":
        return (p: number) => {
          const s = ease(Math.min(p / 0.4, 1));
          hoverPlane.material.opacity = s;
          const sc = lerp(0.7, 1, s);
          hoverPlane.scale.set(sc, sc, 1);
        };
      case "diagnostic":
        return (p: number) => {
          const s = ease(Math.min(p / 0.4, 1));
          diagPlane.material.opacity = s;
          const sc = lerp(0.7, 1, s);
          diagPlane.scale.set(sc, sc, 1);
        };
      case "breakpoint":
        return (p: number, elapsed: number) => {
          breakpoint.material.opacity = Math.min(p * 3, 1);
          const pulse = 1 + 0.25 * Math.sin(elapsed * 6);
          breakpoint.scale.set(pulse, pulse, 1);
        };
      case "git-diff": {
        let flip = false;
        return (p: number) => {
          const s = ease(Math.min(p / 0.5, 1));
          splitPlane.material.opacity = s;
          splitPlane.position.x = EDITOR_W / 4 + 0.015;
          editorPlane.scale.x = lerp(1, 0.49, s);
          editorPlane.position.x = lerp(0, -(EDITOR_W / 4 + 0.015), s);
          divider.material.opacity = s * 0.9;
          // "cambios" verdes/rojos: parpadeo del divisor en verde tras abrirse
          if (p > 0.6 && !flip) {
            flip = true;
            divider.material.color.setHex(0xa3be8c);
          }
        };
      }
      case "ai-chat": {
        let lastStream = -1;
        return (p: number) => {
          const slide = ease(Math.min(p / 0.3, 1));
          chatPlane.position.x = lerp(4, 1.95, slide);
          chatPlane.material.opacity = slide;
          const stream = Math.round(Math.max(0, (p - 0.35) / 0.65) * 64);
          if (stream !== lastStream) {
            lastStream = stream;
            chat.draw(stream);
          }
        };
      }
      case "save-flash":
        return (p: number) => {
          const flash = Math.sin(Math.min(p, 1) * Math.PI);
          const ok = spec.command.includes("write");
          toastPlane.material.opacity = flash;
          toastPlane.position.y = lerp(-1.6, -1.25, ease(p));
          if (!toastTex) {
            toastTex = createToastTexture(ok ? "written ✔" : `:${spec.label}`, ok ? "ok" : "info");
            toastPlane.material.map = toastTex;
            toastPlane.material.needsUpdate = true;
          }
        };
      case "buffer-cycle": {
        const next = spec.command.includes("CycleNext");
        const from = next ? 0 : 1;
        const to = next ? 1 : 0;
        let drawn = -1;
        return (p: number) => {
          const step = p < 0.45 ? from : to;
          if (step !== drawn) {
            drawn = step;
            tablineDynamic.draw(3, step);
          }
          // toast de confirmación en la segunda mitad
          if (p >= 0.5) {
            if (!toastTex) {
              toastTex = createToastTexture(next ? "buffer → main.go" : "buffer ← init.lua");
              toastPlane.material.map = toastTex;
              toastPlane.material.needsUpdate = true;
            }
            toastPlane.material.opacity = Math.sin(((p - 0.5) / 0.5) * Math.PI);
            toastPlane.position.y = lerp(-1.6, -1.25, ease((p - 0.5) / 0.5));
          }
        };
      }
      case "buffer-close": {
        let drawn = -1;
        return (p: number) => {
          const step = p < 0.45 ? 0 : 1;
          if (step !== drawn) {
            drawn = step;
            // 3 tabs con la última activa -> la pestaña se cierra y quedan 2
            if (step === 0) tablineDynamic.draw(3, 2);
            else tablineDynamic.draw(2, 1);
          }
          if (p >= 0.5) {
            if (!toastTex) {
              toastTex = createToastTexture("buffer closed", "error");
              toastPlane.material.map = toastTex;
              toastPlane.material.needsUpdate = true;
            }
            toastPlane.material.opacity = Math.sin(((p - 0.5) / 0.5) * Math.PI);
            toastPlane.position.y = lerp(-1.6, -1.25, ease((p - 0.5) / 0.5));
          }
        };
      }
      case "nohl": {
        let lastAlpha = -1;
        return (p: number) => {
          // highlights de búsqueda amarillos que se desvanecen
          const alpha = Math.round((1 - ease(Math.min(p / 0.7, 1))) * 10) / 10;
          if (alpha !== lastAlpha) {
            lastAlpha = alpha;
            editor.draw("normal", true, alpha);
          }
        };
      }
      case "quit": {
        let built = false;
        return (p: number) => {
          const s = ease(p);
          editorPlane.material.opacity = lerp(1, 0.12, s);
          statusline.material.opacity = lerp(1, 0.15, s);
          tabline.material.opacity = lerp(1, 0.15, s);
          if (p >= 0.4) {
            if (!built) {
              built = true;
              toastTex?.dispose();
              toastTex = createToastTexture(":quit", "error");
              toastPlane.material.map = toastTex;
              toastPlane.material.needsUpdate = true;
            }
            toastPlane.material.opacity = Math.sin(((p - 0.4) / 0.6) * Math.PI);
            toastPlane.position.y = lerp(-1.6, -1.25, ease((p - 0.4) / 0.6));
          }
        };
      }
      case "toast":
      default: {
        let built = false;
        return (p: number) => {
          if (!built) {
            built = true;
            toastTex?.dispose();
            toastTex = createToastTexture(`:${spec.label}`);
            toastPlane.material.map = toastTex;
            toastPlane.material.needsUpdate = true;
          }
          toastPlane.material.opacity = Math.sin(Math.min(p, 1) * Math.PI);
          toastPlane.position.y = lerp(-1.6, -1.25, ease(Math.min(p * 2, 1)));
        };
      }
    }
  }

  // ── API pública ────────────────────────────────────────────────────────────

  function stop() {
    current = null;
    hideActors();
  }

  async function play(spec: PreviewSpec): Promise<void> {
    if (reducedMotion) return;
    current = null; // cancela la anterior
    hideActors();
    toastTex?.dispose();
    toastTex = null;
    toastPlane.material.map = null;
    toastPlane.material.needsUpdate = true;
    const oldStatusline = (statusline.material as THREE.MeshBasicMaterial).map;
    oldStatusline?.dispose();
    statusline.material.map = createStatuslineTexture("normal");
    statusline.material.needsUpdate = true;
    const duration = DURATION[spec.kind] ?? 1200;
    const start = performance.now();
    const tick = buildTick(spec.kind, spec, { now: start });

    await new Promise<void>((resolve) => {
      current = { t: start, duration, tick, resolve };
    });
  }

  function dispose() {
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("resize", onResize);
    cancelAnimationFrame(reqId);
    renderer.dispose();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mat = obj.material as THREE.MeshBasicMaterial;
        mat.map?.dispose();
        mat.dispose();
      }
    });
    if (renderer.domElement.parentElement) {
      renderer.domElement.remove();
    }
  }

  ensureLoop();

  return { play, stop, dispose };
}
