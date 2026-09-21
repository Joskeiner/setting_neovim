// CanvasTextures para el mock Neovim 3D (T2 de PLAN-SIMULADOR-3D.md).
// Todo se dibuja en canvas 2D y se envuelve en THREE.CanvasTexture, siguiendo
// el patrón de HeroScene.ts (createKeycapTexture).

import * as THREE from "three";

// Paleta Nord (web/src/styles/global.css @theme)
export const NORD = {
  nord0: "#2E3440",
  nord1: "#3B4252",
  nord2: "#434C5E",
  nord3: "#4C566A",
  nord4: "#D8DEE9",
  nord5: "#E5E9F0",
  nord6: "#ECEFF4",
  nord7: "#8FBCBB",
  nord8: "#88C0D0",
  nord9: "#81A1C1",
  nord10: "#5E81AC",
  nord11: "#BF616A",
  nord13: "#EBCB8B",
  nord14: "#A3BE8C",
  nord15: "#B48EAD",
} as const;

const MONO = "'JetBrains Mono', 'SF Mono', monospace";

function makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export type EditorTexture = {
  texture: THREE.CanvasTexture;
  /** Redibuja el editor; cursor=false oculta el cursor; highlightAlpha dibuja los highlights de búsqueda. */
  draw: (mode: "normal" | "insert" | "visual", cursor?: boolean, highlightAlpha?: number) => void;
};

// ── Editor: buffer falso con números de línea + código + cursor ──────────────

export function createEditorTexture(): EditorTexture {
  const { canvas, ctx } = makeCanvas(1024, 580);
  const codeLines: Array<Array<[string, string]>> = [
    [["fn ", "#81A1C1"], ["main", "#88C0D0"], ["() {", "#D8DEE9"]],
    [["    let ", "#81A1C1"], ["config", "#8FBCBB"], [" = load()", "#D8DEE9"]],
    [["    if ", "#81A1C1"], ["config", "#D8DEE9"], [".debug {", "#D8DEE9"]],
    [["        print!", "#88C0D0"], ["(", "#D8DEE9"], ["\"nvim\"", "#EBCB8B"], [");", "#D8DEE9"]],
    [["    }", "#D8DEE9"]],
    [["    ", "#D8DEE9"]],
    [["    run", "#88C0D0"], ["(config)", "#D8DEE9"]],
    [["}", "#D8DEE9"]],
  ];

  function draw(mode: "normal" | "insert" | "visual", cursor = true, highlightAlpha = 0) {
    ctx.fillStyle = NORD.nord0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Números de línea (gutter)
    ctx.font = `24px ${MONO}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    for (let i = 0; i < codeLines.length; i++) {
      ctx.fillStyle = i === 0 ? NORD.nord9 : NORD.nord3;
      ctx.fillText(String(i + 1), 52, 34 + i * 46);
    }
    // Separador gutter
    ctx.fillStyle = NORD.nord1;
    ctx.fillRect(66, 0, 2, canvas.height);

    // Código (con highlight de búsqueda opcional sobre "config")
    ctx.textAlign = "left";
    for (let i = 0; i < codeLines.length; i++) {
      let x = 86;
      for (const [text, color] of codeLines[i]) {
        const w = ctx.measureText(text).width;
        if (highlightAlpha > 0 && text === "config") {
          ctx.save();
          ctx.globalAlpha = highlightAlpha;
          ctx.fillStyle = NORD.nord13;
          ctx.fillRect(x - 2, 34 + i * 46, w + 4, 32);
          ctx.restore();
        }
        ctx.fillStyle = color;
        ctx.fillText(text, x, 34 + i * 46);
        x += w;
      }
    }

    // Cursor bloque en línea 6, col 4 (parpadeo lo maneja la escena)
    if (cursor) {
      ctx.fillStyle = mode === "insert" ? NORD.nord14 : NORD.nord8;
      ctx.globalAlpha = mode === "visual" ? 0.4 : 1;
      ctx.fillRect(86, 34 + 5 * 46, mode === "insert" ? 3 : 20, 32);
      ctx.globalAlpha = 1;
    }
  }

  draw("normal");

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  return {
    texture,
    draw: (mode, cursor, highlightAlpha) => {
      draw(mode, cursor, highlightAlpha);
      texture.needsUpdate = true;
    },
  };
}

// ── Terminal: prompt + typing progresivo ─────────────────────────────────────

export function createTerminalTexture(): {
  texture: THREE.CanvasTexture;
  /** Dibuja la terminal; typed = número de caracteres visibles del comando. */
  draw: (typed: number, command: string) => void;
} {
  const { canvas, ctx } = makeCanvas(1024, 360);

  function draw(typed: number, command: string) {
    ctx.fillStyle = NORD.nord0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Barra de título estilo split
    ctx.fillStyle = NORD.nord1;
    ctx.fillRect(0, 0, canvas.width, 44);
    ctx.fillStyle = NORD.nord4;
    ctx.font = `20px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("terminal  •  zsh", 16, 24);

    // Prompt + comando tipeado
    ctx.font = `26px ${MONO}`;
    ctx.textBaseline = "top";
    ctx.fillStyle = NORD.nord14;
    ctx.fillText("$", 20, 70);
    ctx.fillStyle = NORD.nord6;
    const visible = command.slice(0, typed);
    ctx.fillText(visible, 44, 70);

    // Cursor subrayado al final del texto
    const w = ctx.measureText(visible).width;
    ctx.fillStyle = NORD.nord6;
    ctx.fillRect(44 + w + 2, 70, 14, 3);

    // Salida simulada cuando el comando está completo
    if (typed >= command.length && command.length > 0) {
      ctx.font = `22px ${MONO}`;
      ctx.fillStyle = NORD.nord4;
      ctx.fillText("ready in 23ms", 20, 120);
      ctx.fillStyle = NORD.nord3;
      ctx.fillText("watching for changes…", 20, 156);
    }

    texture.needsUpdate = true;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  draw(0, "");

  return { texture, draw };
}

// ── Statusline / Tabline estáticas ────────────────────────────────────────────

export function createStatuslineTexture(mode: "normal" | "insert" | "visual" = "normal"): THREE.CanvasTexture {  const { canvas, ctx } = makeCanvas(1024, 48);
  const modeColor = mode === "insert" ? NORD.nord14 : mode === "visual" ? NORD.nord15 : NORD.nord8;
  const modeText = mode === "insert" ? "INSERT" : mode === "visual" ? "VISUAL" : "NORMAL";

  ctx.fillStyle = NORD.nord2;
  ctx.fillRect(0, 0, canvas.width, 48);
  ctx.fillStyle = modeColor;
  ctx.fillRect(0, 0, 130, 48);
  ctx.fillStyle = NORD.nord0;
  ctx.font = `bold 22px ${MONO}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(modeText, 65, 25);

  ctx.fillStyle = NORD.nord4;
  ctx.textAlign = "left";
  ctx.fillText(" main ✚ ", 150, 25);
  ctx.fillStyle = NORD.nord3;
  ctx.textAlign = "right";
  ctx.fillText("utf-8 • lua •  42:8 ", canvas.width - 16, 25);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ── Sidebar NvimTree ──────────────────────────────────────────────────────────

export function createFiletreeTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(480, 580);
  ctx.fillStyle = NORD.nord0;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `22px ${MONO}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const entries: Array<[string, string, boolean]> = [
    ["📁", "setting_neovim", true],
    ["  📁", "lua", false],
    ["  📁", "config", false],
    ["    📄", "plugins.lua", false],
    ["    📄", "lsp.lua", false],
    ["  📄", "init.lua", true],
    ["  📄", "lazy-lock.json", false],
    ["  📄", "README.md", false],
  ];

  entries.forEach(([icon, name, highlight], i) => {
    ctx.fillStyle = highlight ? NORD.nord8 : NORD.nord4;
    ctx.fillText(`${icon} ${name}`, 18, 24 + i * 44);
  });

  ctx.fillStyle = NORD.nord1;
  ctx.fillRect(0, 0, canvas.width, 8);

  return toTexture(canvas);
}

// ── Modal Telescope (finder) ─────────────────────────────────────────────────

export function createFinderTexture(): {
  texture: THREE.CanvasTexture;
  /** prompt = texto de búsqueda; filter = índice de la selección resaltada. */
  draw: (prompt: string, selected: number) => void;
} {
  const { canvas, ctx } = makeCanvas(900, 480);
  const allFiles = [
    "lua/config/plugins.lua",
    "lua/config/lsp.lua",
    "init.lua",
    "lua/keymaps.lua",
    "lazy-lock.json",
    "install.sh",
    "README.md",
  ];

  function draw(prompt: string, selected: number) {
    ctx.fillStyle = NORD.nord1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Prompt
    ctx.fillStyle = NORD.nord0;
    ctx.fillRect(0, 0, canvas.width, 56);
    ctx.font = `26px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = NORD.nord8;
    ctx.fillText("🔍", 16, 28);
    ctx.fillStyle = NORD.nord6;
    ctx.fillText(prompt + "▍", 56, 28);

    // Lista filtrada simple por substring
    const filtered = allFiles.filter((f) => f.includes(prompt));
    ctx.font = `24px ${MONO}`;
    filtered.slice(0, 8).forEach((file, i) => {
      const y = 80 + i * 46;
      if (i === selected % Math.max(filtered.length, 1)) {
        ctx.fillStyle = NORD.nord2;
        ctx.fillRect(8, y - 6, canvas.width - 16, 40);
        ctx.fillStyle = NORD.nord8;
      } else {
        ctx.fillStyle = NORD.nord4;
      }
      ctx.fillText(file, 24, y + 12);
    });

    texture.needsUpdate = true;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  draw("", 0);

  return { texture, draw };
}

// ── Hover / diagnostics float ────────────────────────────────────────────────

export function createHoverTexture(kind: "hover" | "diagnostic"): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(560, 240);
  ctx.fillStyle = NORD.nord1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = kind === "hover" ? NORD.nord8 : NORD.nord11;
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = `22px ${MONO}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = kind === "hover" ? NORD.nord8 : NORD.nord11;
  ctx.fillText(kind === "hover" ? "fn run(config: Config)" : "⚠ undefined variable", 20, 18);

  ctx.fillStyle = NORD.nord4;
  const doc = kind === "hover"
    ? ["Ejecuta la configuración", "cargada del runtime.", ""]
    : ["Se encontró 1 problema en", "la línea 6 (warning).", ""];
  doc.forEach((line, i) => ctx.fillText(line, 20, 60 + i * 34));

  ctx.fillStyle = NORD.nord3;
  ctx.fillText(kind === "hover" ? "LSP: rust-analyzer" : "LSP: diagnostic", 20, canvas.height - 44);

  return toTexture(canvas);
}

// ── Panel AI chat (opencode) ─────────────────────────────────────────────────

export function createChatTexture(): {
  texture: THREE.CanvasTexture;
  /** stream = número de caracteres visibles del mensaje. */
  draw: (stream: number) => void;
} {
  const { canvas, ctx } = makeCanvas(520, 580);
  const message = "Listo: dividí el buffer en dos splits y ejecuté los tests. ▍";

  function draw(stream: number) {
    ctx.fillStyle = NORD.nord0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = NORD.nord1;
    ctx.fillRect(0, 0, canvas.width, 44);

    ctx.font = `20px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = NORD.nord15;
    ctx.fillText("opencode  •  agent", 16, 22);

    // Burbuja del usuario
    ctx.fillStyle = NORD.nord2;
    ctx.fillRect(16, 64, canvas.width - 32, 52);
    ctx.fillStyle = NORD.nord4;
    ctx.font = `20px ${MONO}`;
    ctx.textBaseline = "top";
    ctx.fillText("organiza mis splits", 32, 78);

    // Stream de respuesta
    ctx.fillStyle = NORD.nord6;
    const words = message.slice(0, stream).split(" ");
    let x = 24;
    let y = 150;
    for (const word of words) {
      const w = ctx.measureText(word + " ").width;
      if (x + w > canvas.width - 24) {
        x = 24;
        y += 34;
      }
      ctx.fillText(word, x, y);
      x += w;
    }

    texture.needsUpdate = true;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  draw(0);

  return { texture, draw };
}

// ── Toast / burbuja ──────────────────────────────────────────────────────────

export function createToastTexture(text: string, tone: "ok" | "info" | "error" = "info"): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(720, 120);
  const toneColor = tone === "ok" ? NORD.nord14 : tone === "error" ? NORD.nord11 : NORD.nord8;

  ctx.fillStyle = NORD.nord1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = toneColor;
  ctx.fillRect(0, 0, 10, canvas.height);

  ctx.font = `24px ${MONO}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = toneColor;
  ctx.fillText(tone === "ok" ? "✔" : tone === "error" ? "✖" : "›", 28, canvas.height / 2);
  ctx.fillStyle = NORD.nord6;
  ctx.fillText(text, 68, canvas.height / 2);

  return toTexture(canvas);
}

// ── Tabline de buffers (bufferline.nvim) ─────────────────────────────────────

export function createTablineTexture(): {
  texture: THREE.CanvasTexture;
  /** count = nº de tabs visibles; active = índice resaltado. */
  draw: (count: number, active: number) => void;
} {
  const { canvas, ctx } = makeCanvas(1024, 42);
  const names = ["init.lua", "main.go", "lib.rs"];

  function draw(count: number, active: number) {
    ctx.fillStyle = NORD.nord0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `20px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    let x = 10;
    for (let i = 0; i < count; i++) {
      const name = names[i] ?? `buffer ${i + 1}`;
      const w = Math.max(ctx.measureText(name).width + 36, 90);
      ctx.fillStyle = i === active ? NORD.nord8 : NORD.nord1;
      ctx.fillRect(x, 6, w, 30);
      ctx.fillStyle = i === active ? NORD.nord0 : NORD.nord4;
      ctx.fillText(`${i + 1} ${name}`, x + 14, 22);
      x += w + 4;
    }
    ctx.fillStyle = NORD.nord2;
    ctx.fillRect(0, canvas.height - 3, canvas.width, 3);

    texture.needsUpdate = true;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  draw(3, 0);

  return { texture, draw };
}

// ── Punto de breakpoint (gutter) ─────────────────────────────────────────────

export function createBreakpointTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(128, 128);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  grad.addColorStop(0, "#D08770");
  grad.addColorStop(1, NORD.nord11);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 48, 0, Math.PI * 2);
  ctx.fill();
  return toTexture(canvas);
}
