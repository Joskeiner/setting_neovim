// Filtro en vivo de la referencia de keymaps (fase 2.6, T2).
// Sin framework: modulo aislado de Vanilla TS, como define PLAN-LANDING.md.

const MODE_NAMES: Record<string, string> = {
  n: "normal",
  i: "insert",
  t: "terminal",
  v: "visual",
};

// Normalizacion compartida (build-time para los datos, runtime para el query):
//  - minusculas y sin acentos
//  - <Space>/<leader> -> "space"
//  - <C-x> -> "ctrl+x", <A-x> -> "alt+x", <S-x> -> "shift+x"
//  - corchetes y simbolos de secuencia separados por espacios
export function normalizeKeymapText(input: string): string {
  return input
    .toLowerCase()
    .replace(/<leader>/g, " space ")
    .replace(/<space>/g, " space ")
    .replace(/<c-/g, " ctrl+")
    .replace(/<a-/g, " alt+")
    .replace(/<s-/g, " shift+")
    .replace(/<(\/?)([a-z\\]+)>/g, " $2 ")
    .replace(/[<>'"]+/g, " ")
    .replace(/\[(\S)/g, " [ $1")
    .replace(/(\S)\]/g, "$1 ] ")
    .replace(/\//g, " / ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function entrySearchText(entry: {
  path: string;
  description: string;
  descriptionEs?: string;
  modes: string[];
}): string {
  const modes = entry.modes.map((mode) => MODE_NAMES[mode] ?? mode).join(" ");
  return normalizeKeymapText(
    `${entry.path} ${entry.descriptionEs ?? ""} ${entry.description} ${modes}`,
  );
}

// Version compacta del path para coincidencias de teclas: "<Space>ff" -> "spaceff".
export function entryPathCompact(path: string): string {
  return normalizeKeymapText(path).replace(/\s+/g, "");
}

function escapeRegExp(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

// Un token coincide si: esta en el path compacto (teclas, p. ej. "ff" en "spaceff")
// o inicia una palabra en el texto (descripcion/grupo/modos), para que "ff" no
// haga match con "buffers" ni "diff" pero "diff" yes.
export function tokenMatches(token: string, text: string, pathCompact: string): boolean {
  if (pathCompact.includes(token)) return true;
  return new RegExp(`(^|\\s)${escapeRegExp(token)}`).test(text);
}

// El markup ya viene renderizado estaticamente (funciona sin JS).
// Con JS: filtrado por tokens (AND), conteo de resultados y ocultar grupos vacios.
function init(): void {
  const input = document.querySelector<HTMLInputElement>("#keymap-search");
  const status = document.querySelector<HTMLParagraphElement>("#keymap-status");
  if (!input || !status) return;

  const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-search]"));
  const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-group]"));
  const total = rows.length;
  status.textContent = `${total} keymaps`;

  input.addEventListener("input", () => {
    const tokens = normalizeKeymapText(input.value).split(" ").filter(Boolean);
    let visible = 0;

    for (const row of rows) {
      const haystack = row.dataset.search ?? "";
      const pathCompact = row.dataset.pathCompact ?? "";
      const match = tokens.every((token) => tokenMatches(token, haystack, pathCompact));
      row.hidden = !match;
      if (match) visible += 1;
    }

    for (const group of groups) {
      const anyVisible = Array.from(
        group.querySelectorAll<HTMLElement>("[data-search]"),
      ).some((row) => !row.hidden);
      group.hidden = !anyVisible;
      if (tokens.length > 0) {
        for (const details of group.querySelectorAll("details")) {
          details.open = true;
        }
      }
    }

    status.textContent =
      tokens.length === 0
        ? `${total} keymaps`
        : `${visible} de ${total} keymaps`;
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
