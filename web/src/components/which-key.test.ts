import { describe, it, expect } from "bun:test";
import { createSimulator } from "./which-key";
import { keymapTree } from "../data/keymaps";

describe("Which-Key State Machine", () => {
  it("inicia en nodo root sin teclas activas", () => {
    const sim = createSimulator(keymapTree);
    expect(sim.getState().pressedKeys.length).toBe(0);
    expect(sim.getState().currentNode.key).toBe("<Space>");
  });

  it("al presionar Space activa el primer nivel", () => {
    const sim = createSimulator(keymapTree);
    const ok = sim.sendKey("Space");
    expect(ok).toBe(true);
    expect(sim.getState().pressedKeys).toEqual(["Space"]);
  });

  it("navega ruta profunda Space -> o -> d (diff)", () => {
    const sim = createSimulator(keymapTree);
    sim.sendKey("Space");
    const okO = sim.sendKey("o");
    expect(okO).toBe(true);
    expect(sim.getState().currentNode.label).toBe("opencode");

    const okD = sim.sendKey("d");
    expect(okD).toBe(true);
    expect(sim.getState().currentNode.description).toBe("Open diff");
    expect(sim.getState().currentNode.command).toBe("<cmd>OpenCode diff open<CR>");
  });

  it("stepBack (Esc) sube un nivel en el arbol", () => {
    const sim = createSimulator(keymapTree);
    sim.sendKey("Space");
    sim.sendKey("o");
    sim.sendKey("d");
    expect(sim.getState().pressedKeys).toEqual(["Space", "o", "d"]);

    sim.stepBack();
    expect(sim.getState().pressedKeys).toEqual(["Space", "o"]);
    expect(sim.getState().currentNode.label).toBe("opencode");
  });

  it("reset vuelve al estado inicial", () => {
    const sim = createSimulator(keymapTree);
    sim.sendKey("Space");
    sim.sendKey("f");
    sim.reset();
    expect(sim.getState().pressedKeys.length).toBe(0);
    expect(sim.getState().history.length).toBe(0);
  });

  // ── T0: teclas multi-carácter (buffer de prefijo) ──────────────────────────

  it("T0: 'rn' (rename) es alcanzable aunque 'r' tambien abre el grupo rust", () => {
    const sim = createSimulator(keymapTree);
    sim.sendKey("Space");
    expect(sim.sendKey("r")).toBe(true);
    // Prefijo provisional: la UI puede mostrar el grupo rust o el rename
    expect(sim.getState().currentNode.key).toBe("r");

    expect(sim.sendKey("n")).toBe(true);
    expect(sim.getState().currentNode.key).toBe("rn");
    expect(sim.getState().currentNode.command).toBe("vim.lsp.buf.rename()");
    expect(sim.getState().pressedKeys).toEqual(["Space", "rn"]);
  });

  it("T0: 'vd' (diagnostic float) es alcanzable aunque 'v' sea la hoja vsplit", () => {
    const sim = createSimulator(keymapTree);
    sim.sendKey("Space");
    expect(sim.sendKey("v")).toBe(true);
    expect(sim.sendKey("d")).toBe(true);
    expect(sim.getState().currentNode.key).toBe("vd");
    expect(sim.getState().currentNode.command).toBe("vim.diagnostic.open_float()");
   });

  it("T0: 'v' seguido de tecla no-ambigua mantiene el comportamiento antiguo (vsplit)", () => {
    const sim = createSimulator(keymapTree);
    sim.sendKey("Space");
    expect(sim.sendKey("v")).toBe(true);
    expect(sim.sendKey("x")).toBe(true);
    expect(sim.getState().currentNode.key).toBe("v");
    expect(sim.getState().currentNode.command).toBe("<cmd>vsplit<CR>");
  });

  it("T0: case-sensitive exacto — 'T' abre la terminal, no el grupo test", () => {
    const sim = createSimulator(keymapTree);
    sim.sendKey("Space");
    expect(sim.sendKey("T")).toBe(true);
    expect(sim.getState().currentNode.command).toBe("<cmd>ToggleTerm<CR>");

    const sim2 = createSimulator(keymapTree);
    sim2.sendKey("Space");
    expect(sim2.sendKey("t")).toBe(true);
    expect(sim2.getState().currentNode.label).toBe("test");
  });
});
