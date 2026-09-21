import type { KeymapNode } from "../data/keymaps";

export interface SimulatorState {
  currentNode: KeymapNode;
  history: KeymapNode[];
  pressedKeys: string[];
  activeKey: string | null;
}

export function createSimulator(rootNode: KeymapNode) {
  let state: SimulatorState = {
    currentNode: rootNode,
    history: [],
    pressedKeys: [],
    activeKey: null,
  };

  // Buffer de prefijo (T0 de PLAN-SIMULADOR-3D.md): cuando una tecla casa con
  // un hijo Y además es prefijo de la key de otro hijo más larga (ej. "r" casa
  // con el grupo rust y también es prefijo de "rn"; "v" casa con la hoja
  // vsplit y con "vd"), la tecla queda pendiente y la siguiente la resuelve,
  // igual que el timeout de prefijos de Neovim. Sin tocar keymaps.ts.
  let pendingMulti: { parent: KeymapNode; matchedKey: string } | null = null;

  const listeners = new Set<(state: SimulatorState) => void>();

  function notify() {
    listeners.forEach((fn) => fn({ ...state }));
  }

  function reset() {
    state = {
      currentNode: rootNode,
      history: [],
      pressedKeys: [],
      activeKey: null,
    };
    pendingMulti = null;
    notify();
  }

  function stepBack() {
    if (state.history.length === 0) return;
    const prevNode = state.history.pop()!;
    state.pressedKeys.pop();
    state.currentNode = prevNode;
    state.activeKey = state.pressedKeys[state.pressedKeys.length - 1] ?? null;
    pendingMulti = null;
    notify();
  }

  // Busca un hijo por tecla. Coincidencia EXACTA primero (case-sensitive) para
  // distinguir "T" (terminal) de "t" (grupo test); si no hay, cae a mayúsculas/
  // minúsculas (permite pulsar "t" mayúscula por error sin romper la navegación).
  function findChild(node: KeymapNode, key: string): KeymapNode | undefined {
    const children = node.children ?? [];
    const exact = children.find((c) => c.key === key);
    if (exact) return exact;
    return children.find((c) => c.key.toLowerCase() === key.toLowerCase());
  }

  function navigateTo(node: KeymapNode, child: KeymapNode, displayKey?: string) {
    state.history.push(node);
    state.pressedKeys.push(displayKey ?? child.key);
    state.currentNode = child;
  }

  function sendKey(inputKey: string): boolean {
    // Normalizar nombres de tecla
    let key = inputKey;
    if (key === " " || key.toLowerCase() === "space") {
      key = "Space";
    }

    state.activeKey = key;

    // Resolver un prefijo pendiente con la tecla recibida
    if (pendingMulti) {
      const { parent, matchedKey } = pendingMulti;
      pendingMulti = null;

      // Revertir el avance provisional del prefijo (push de navigateTo)
      state.history.pop();
      state.pressedKeys.pop();

      // 1) ¿La tecla completa una secuencia multi-carácter? (ej. "r"+"n" -> "rn")
      const candidate = matchedKey + key;
      const children = parent.children ?? [];
      const fullMatch = children.find((c) => c.key === candidate);
      if (fullMatch) {
        navigateTo(parent, fullMatch);
        notify();
        return true;
      }

      // 2) Si no: la tecla anterior era el mapeo completo (grupo u hoja corta);
      //    descender a él y descartar la tecla actual (trigger de resolución).
      const shortMatch = findChild(parent, matchedKey);
      if (shortMatch) {
        navigateTo(parent, shortMatch);
        notify();
        return true;
      }
      notify();
      return false;
    }

    // Si estamos en la raíz (Space) y aún no se presionó Space
    if (state.currentNode === rootNode && state.pressedKeys.length === 0) {
      if (key === "Space" || key === rootNode.key) {
        state.pressedKeys.push("Space");
        notify();
        return true;
      }
      return false;
    }

    return dispatchKey(state.currentNode, key);
  }

  function dispatchKey(node: KeymapNode, key: string): boolean {
    const children = node.children ?? [];
    const match = findChild(node, key);

    if (match) {
      // Ambigüedad de prefijo: la key del hijo casado es prefijo estricto de la
      // key de otro hijo (grupo u hoja). Queda pendiente hasta la próxima tecla.
      const isAmbiguous = children.some(
        (c) => c !== match && c.key.length > match.key.length && c.key.startsWith(match.key)
      );

      if (isAmbiguous) {
        pendingMulti = { parent: node, matchedKey: match.key };
        // Avance provisional en la ruta (como which-key antes del timeout)
        navigateTo(node, match);
        notify();
        return true;
      }

      navigateTo(node, match);
      notify();
      return true;
    }

    notify();
    return false;
  }

  return {
    getState: () => ({ ...state }),
    subscribe: (fn: (state: SimulatorState) => void) => {
      listeners.add(fn);
      fn({ ...state });
      return () => listeners.delete(fn);
    },
    sendKey,
    stepBack,
    reset,
  };
}
