import { describe, it, expect } from "bun:test";
import { resolvePreview, isLeaf, type PreviewKind } from "./resolvePreview";
import { keymapTree, type KeymapNode } from "../../data/keymaps";

// Recorre el árbol y devuelve todas las hojas reales con su path.
function collectLeaves(node: KeymapNode, prefix = ""): Array<{ path: string; node: KeymapNode }> {
  const path = prefix + node.key;
  const out: Array<{ path: string; node: KeymapNode }> = [];
  if (prefix !== "" && isLeaf(node)) out.push({ path, node });
  for (const child of node.children ?? []) {
    out.push(...collectLeaves(child, path));
  }
  return out;
}

const leaves = collectLeaves(keymapTree);

describe("resolvePreview", () => {
  it("devuelve null para grupos (no hojas)", () => {
    expect(resolvePreview(keymapTree)).toBeNull();
    const rust = keymapTree.children?.find((c) => c.key === "r");
    expect(rust).toBeDefined();
    expect(resolvePreview(rust!)).toBeNull();
  });

  it("casos concretos del plan §5.1", () => {
    expect(resolvePreview({ key: "T", command: "<cmd>ToggleTerm<CR>" } as KeymapNode)?.kind).toBe("terminal");
    expect(resolvePreview({ key: "ff", command: "<cmd>Telescope find_files<CR>" } as KeymapNode)?.kind).toBe("finder");
    expect(resolvePreview({ key: "db", command: 'function() require("dap").toggle_breakpoint() end' } as KeymapNode)?.kind).toBe("breakpoint");
    expect(resolvePreview({ key: "x", command: "vim.lsp.buf.hover()" } as KeymapNode)?.kind).toBe("hover");
    expect(resolvePreview({ key: "rn", command: "vim.lsp.buf.rename()" } as KeymapNode)?.kind).toBe("hover");
    expect(resolvePreview({ key: "vd", command: "vim.diagnostic.open_float()" } as KeymapNode)?.kind).toBe("diagnostic");
  });

  it("precedencia: vsplit antes que split<CR>", () => {
    expect(resolvePreview({ key: "v", command: "<cmd>vsplit<CR>" } as KeymapNode)?.kind).toBe("vsplit");
    expect(resolvePreview({ key: "s", command: "<cmd>split<CR>" } as KeymapNode)?.kind).toBe("hsplit");
  });

  it("precedencia: diff antes que OpenCode", () => {
    expect(resolvePreview({ key: "od", command: "<cmd>OpenCode diff open<CR>" } as KeymapNode)?.kind).toBe("git-diff");
    expect(resolvePreview({ key: "og", command: "<cmd>OpenCodeToggle<CR>" } as KeymapNode)?.kind).toBe("ai-chat");
  });

  it("save-flash / nohl / buffers / quit", () => {
    expect(resolvePreview({ key: "w", command: "<cmd>write<CR>" } as KeymapNode)?.kind).toBe("save-flash");
    expect(resolvePreview({ key: "h", command: "<cmd>nohlsearch<CR>" } as KeymapNode)?.kind).toBe("nohl");
    expect(resolvePreview({ key: "bn", command: "<cmd>BufferLineCycleNext<CR>" } as KeymapNode)?.kind).toBe("buffer-cycle");
    expect(resolvePreview({ key: "bp", command: "<cmd>BufferLineCyclePrev<CR>" } as KeymapNode)?.kind).toBe("buffer-cycle");
    expect(resolvePreview({ key: "bc", command: "<cmd>bdelete<CR>" } as KeymapNode)?.kind).toBe("buffer-close");
    expect(resolvePreview({ key: "q", command: "<cmd>quit<CR>" } as KeymapNode)?.kind).toBe("quit");
  });

  it("TODA hoja del árbol produce un PreviewSpec con kind válido (fallback toast)", () => {
    const valid = new Set<PreviewKind>([
      "terminal", "vsplit", "hsplit", "filetree", "finder", "hover",
      "diagnostic", "breakpoint", "git-diff", "ai-chat", "save-flash",
      "buffer-cycle", "buffer-close", "nohl", "quit", "toast",
    ]);
    expect(leaves.length).toBeGreaterThan(50);
    for (const { path, node } of leaves) {
      const spec = resolvePreview(node);
      expect(spec).not.toBeNull();
      expect(valid.has(spec!.kind)).toBe(true);
      expect(spec!.command.length).toBeGreaterThan(0);
      expect(spec!.label.length).toBeGreaterThan(0);
      void path;
    }
  });

  it("distribución de kinds cubre los arquetipos principales", () => {
    const counts = new Map<PreviewKind, number>();
    for (const { node } of leaves) {
      const kind = resolvePreview(node)!.kind;
      counts.set(kind, (counts.get(kind) ?? 0) + 1);
    }
    for (const kind of ["terminal", "vsplit", "hsplit", "filetree", "finder", "hover", "diagnostic", "breakpoint", "git-diff", "ai-chat", "save-flash", "buffer-cycle", "buffer-close", "nohl", "quit", "toast"] as PreviewKind[]) {
      expect(counts.get(kind) ?? 0).toBeGreaterThan(0);
    }
  });
});
