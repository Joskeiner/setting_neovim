// Clasificador puro (T1 de PLAN-SIMULADOR-3D.md): comando Neovim -> arquetipo
// de preview. No muta keymaps.ts (fuente única); solo interpreta su `command`.
//
// El ORDEN de las reglas importa (primer match gana):
//   - "vsplit" antes que "split<CR>" ("<cmd>vsplit<CR>".includes("split<CR>") es true)
//   - "diff" antes que "OpenCode" (los "OpenCode diff …" contienen ambos)

import type { KeymapNode } from "../../data/keymaps";

export type PreviewKind =
  | "terminal"
  | "vsplit"
  | "hsplit"
  | "filetree"
  | "finder"
  | "hover"
  | "diagnostic"
  | "breakpoint"
  | "git-diff"
  | "ai-chat"
  | "save-flash"
  | "buffer-cycle"
  | "buffer-close"
  | "nohl"
  | "quit"
  | "toast";

export type PreviewSpec = {
  kind: PreviewKind;
  /** Comando original, para mostrarlo en el toast/fallback. */
  command: string;
  /** Texto que se "tipea" o muestra en la animación. */
  label: string;
};

// Hoja real del simulador: tiene comando y no es un grupo intermedio.
export function isLeaf(node: KeymapNode): boolean {
  return node.command !== undefined && (node.children?.length ?? 0) === 0;
}

// Extrae un identificador corto del comando para el typing/toast.
function extractLabel(node: KeymapNode): string {
  const cmd = node.command ?? "";
  const cmdMatch = cmd.match(/<cmd>([^<]+)<CR>/);
  if (cmdMatch) return cmdMatch[1].trim();
  const fnMatch = cmd.match(/require\("([^"]+)"\)/);
  if (fnMatch) return `${fnMatch[1]} ${node.description ?? ""}`.trim();
  return node.description ?? cmd;
}

export function resolvePreview(node: KeymapNode): PreviewSpec | null {
  if (!isLeaf(node)) return null;

  const cmd = node.command ?? "";
  const lower = cmd.toLowerCase();
  const label = extractLabel(node);
  const base = { command: cmd, label };

  // 1. vsplit DEBE ir antes que split<CR> (substring solapado)
  if (lower.includes("vsplit")) return { kind: "vsplit", ...base };
  // 2. split<CR> (horizontal)
  if (lower.includes("split<cr>")) return { kind: "hsplit", ...base };
  // 3. Terminal
  if (lower.includes("togglet")) return { kind: "terminal", ...base };
  // 4. git-diff DEBE ir antes que OpenCode ("OpenCode diff …" contiene ambos)
  if (lower.includes("diff")) return { kind: "git-diff", ...base };
  // 5. File tree
  if (lower.includes("nvimtree")) return { kind: "filetree", ...base };
  // 6. Telescope / fuzzy finder
  if (lower.includes("telescope")) return { kind: "finder", ...base };
  // 7. Debugger (nvim-dap)
  if (lower.includes("dap")) return { kind: "breakpoint", ...base };
  // 8. AI chat (opencode)
  if (lower.includes("opencode")) return { kind: "ai-chat", ...base };
  // 9. LSP: hover / code action / rename / definition / references
  if (
    lower.includes("hover") ||
    lower.includes("code_action") ||
    lower.includes("rename") ||
    lower.includes("definition") ||
    lower.includes("references")
  ) {
    return { kind: "hover", ...base };
  }
  // 10. Diagnósticos
  if (lower.includes("diagnostic")) return { kind: "diagnostic", ...base };
  // 11. Guardar -> flash en statusline
  if (lower.includes("write")) {
    return { kind: "save-flash", ...base };
  }
  // 12. Limpiar highlights de búsqueda
  if (lower.includes("nohlsearch")) {
    return { kind: "nohl", ...base };
  }
  // 13. Navegar buffers (bufferline)
  if (lower.includes("bufferlinecycle")) {
    return { kind: "buffer-cycle", ...base };
  }
  // 14. Cerrar buffer
  if (lower.includes("bdelete")) {
    return { kind: "buffer-close", ...base };
  }
  // 15. Salir
  if (lower.includes("quit")) {
    return { kind: "quit", ...base };
  }
  // 16. Resto: neotest, CMake, GoBuild/GoTest, RustRun… -> toast
  return { kind: "toast", ...base };
}
