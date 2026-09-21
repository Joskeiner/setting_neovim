// FUENTE UNICA de keymaps (PLAN-LANDING.md, seccion 5 "Modelo de datos").
// Alimenta el simulador which-key (fase 2.5, T3) y la referencia con filtro (fase 2.6, T2).
//
// Regla de verificacion (fase 2.2, T2): `key`, `label`, `description`, `command`
// estan transcritos LITERALMENTE de las fuentes Lua, con su `source` (archivo:linea):
//   - init.lua (keymaps generales y de terminal, lineas 69-100)
//   - lua/config/plugins.lua (bloques `keys` + grupos which-key, lineas 54-80, 194-198, 246-250, 265-315, 356-361, 394-428, 477-484, 491-497, 545-550, 568-575, 586-591)
//   - lua/config/lsp.lua (keymaps de on_attach, lineas 6-18)
// Conteo verificado contra las fuentes: 71 bajo <Space> + 31 globales = 102 keymaps.
//
// Capa en español: keymaps-es.ts añade `descriptionEs` SIN tocar el inglés
// verificado de este archivo.

import { ES_DESCRIPTIONS } from "./keymaps-es";

export type Mode = "n" | "i" | "t" | "v";

export type KeymapNode = {
  key: string;
  label?: string;
  description?: string;
  command?: string;
  modes?: Mode[];
  source?: string;
  children?: KeymapNode[];
};

const L = "lua/config/plugins.lua";
const I = "init.lua";
const S = "lua/config/lsp.lua";

// ── Arbol anidado: raiz = Space (leader) ─────────────────────────────────────

export const keymapTree: KeymapNode = {
  key: "<Space>",
  label: "leader",
  description: "Leader key — raiz de todos los grupos",
  source: `${I}:2`,
  children: [
    {
      key: "b",
      label: "buffers",
      description: "Show keymaps",
      command: 'function() require("which-key").show({ global = true }) end',
      modes: ["n"],
      source: `${L}:79`,
      children: [
        { key: "n", description: "Next buffer", command: "<cmd>BufferLineCycleNext<CR>", modes: ["n"], source: `${L}:195` },
        { key: "p", description: "Previous buffer", command: "<cmd>BufferLineCyclePrev<CR>", modes: ["n"], source: `${L}:196` },
        { key: "c", description: "Close buffer", command: "<cmd>bdelete<CR>", modes: ["n"], source: `${L}:197` },
      ],
    },
    {
      key: "c",
      label: "cmake/code",
      children: [
        { key: "b", description: "CMake build", command: "<cmd>CMakeBuild<CR>", modes: ["n"], source: `${L}:587` },
        { key: "r", description: "CMake run", command: "<cmd>CMakeRun<CR>", modes: ["n"], source: `${L}:588` },
        { key: "c", description: "CMake clean", command: "<cmd>CMakeClean<CR>", modes: ["n"], source: `${L}:589` },
        { key: "s", description: "CMake select kit", command: "<cmd>CMakeSelectKit<CR>", modes: ["n"], source: `${L}:590` },
        { key: "a", description: "Code action (LSP)", command: "vim.lsp.buf.code_action()", modes: ["n"], source: `${S}:10` },
        { key: "h", description: "Switch header/source (clangd)", command: "<cmd>ClangdSwitchSourceHeader<CR>", modes: ["n"], source: `${S}:17` },
      ],
    },
    {
      key: "d",
      label: "debug",
      children: [
        { key: "b", description: "Toggle breakpoint", command: 'function() require("dap").toggle_breakpoint() end', modes: ["n"], source: `${L}:569` },
        { key: "c", description: "Continue", command: 'function() require("dap").continue() end', modes: ["n"], source: `${L}:570` },
        { key: "o", description: "Step over", command: 'function() require("dap").step_over() end', modes: ["n"], source: `${L}:571` },
        { key: "i", description: "Step into", command: 'function() require("dap").step_into() end', modes: ["n"], source: `${L}:572` },
        { key: "O", description: "Step out", command: 'function() require("dap").step_out() end', modes: ["n"], source: `${L}:573` },
        { key: "r", description: "Toggle REPL", command: 'function() require("dap").repl.toggle() end', modes: ["n"], source: `${L}:574` },
      ],
    },
    { key: "e", description: "Toggle file tree", command: "<cmd>NvimTreeToggle<CR>", modes: ["n"], source: `${L}:247` },
    {
      key: "f",
      label: "find/telescope",
      children: [
        { key: "f", description: "Find files", command: "<cmd>Telescope find_files<CR>", modes: ["n"], source: `${L}:306` },
        { key: "g", description: "Live grep", command: "<cmd>Telescope live_grep<CR>", modes: ["n"], source: `${L}:307` },
        { key: "b", description: "Buffers", command: "<cmd>Telescope buffers<CR>", modes: ["n"], source: `${L}:308` },
        { key: "h", description: "Help tags", command: "<cmd>Telescope help_tags<CR>", modes: ["n"], source: `${L}:309` },
        { key: "r", description: "Recent files", command: "<cmd>Telescope oldfiles<CR>", modes: ["n"], source: `${L}:310` },
        { key: "d", description: "Diagnostics", command: "<cmd>Telescope diagnostics<CR>", modes: ["n"], source: `${L}:311` },
        { key: "s", description: "Document symbols", command: "<cmd>Telescope lsp_document_symbols<CR>", modes: ["n"], source: `${L}:312` },
        { key: "w", description: "Grep word under cursor", command: "<cmd>Telescope grep_string<CR>", modes: ["n"], source: `${L}:313` },
        { key: "c", description: "Cambiar tema/colorscheme", command: "<cmd>Telescope colorscheme<CR>", modes: ["n"], source: `${L}:314` },
      ],
    },
    {
      key: "g",
      label: "go",
      children: [
        { key: "b", description: "Go build", command: ":GoBuild<CR>", modes: ["n"], source: `${L}:478` },
        { key: "t", description: "Go test", command: ":GoTest<CR>", modes: ["n"], source: `${L}:479` },
        {
          key: "a",
          label: "ai",
          children: [
            { key: "i", description: "Go AI command", command: "<cmd>GoAI<CR>", modes: ["n"], source: `${L}:482` },
          ],
        },
        {
          key: "c",
          label: "comment/review",
          children: [
            { key: "a", description: "Go comment AI", command: ":GoCmtAI<CR>", modes: ["n"], source: `${L}:480` },
            { key: "r", description: "Go code review", command: ":GoCodeReview<CR>", modes: ["n"], source: `${L}:481` },
          ],
        },
        {
          key: "i",
          label: "install",
          children: [
            { key: "i", description: "Go install binaries", command: ":GoInstallBinaries<CR>", modes: ["n"], source: `${L}:483` },
          ],
        },
      ],
    },
    { key: "h", description: "Clear highlights", command: "<cmd>nohlsearch<CR>", modes: ["n"], source: `${I}:71` },
    {
      key: "o",
      label: "opencode",
      children: [
        { key: "g", description: "Toggle opencode", command: "<cmd>OpenCodeToggle<CR>", modes: ["n"], source: `${L}:396` },
        { key: "i", description: "Open input", command: "<cmd>OpenCode open input<CR>", modes: ["n"], source: `${L}:399` },
        { key: "o", description: "Open output", command: "<cmd>OpenCode open output<CR>", modes: ["n"], source: `${L}:400` },
        { key: "q", description: "Close opencode", command: "<cmd>OpenCode close<CR>", modes: ["n"], source: `${L}:401` },
        { key: "t", description: "Toggle focus", command: "<cmd>OpenCode toggle focus<CR>", modes: ["n"], source: `${L}:403` },
        { key: "s", description: "Select session", command: "<cmd>OpenCode session select<CR>", modes: ["n"], source: `${L}:404` },
        { key: "R", description: "Rename session", command: "<cmd>OpenCode session rename<CR>", modes: ["n"], source: `${L}:405` },
        { key: "p", description: "Change model", command: "<cmd>OpenCode configure provider<CR>", modes: ["n"], source: `${L}:407` },
        { key: "V", description: "Model variant", command: "<cmd>OpenCode variant<CR>", modes: ["n"], source: `${L}:408` },
        {
          key: "d",
          label: "diff",
          description: "Open diff",
          command: "<cmd>OpenCode diff open<CR>",
          modes: ["n"],
          source: `${L}:410`,
        },
        { key: "]", description: "Next diff", command: "<cmd>OpenCode diff next<CR>", modes: ["n"], source: `${L}:411` },
        { key: "[", description: "Prev diff", command: "<cmd>OpenCode diff prev<CR>", modes: ["n"], source: `${L}:412` },
        { key: "c", description: "Close diff", command: "<cmd>OpenCode diff close<CR>", modes: ["n"], source: `${L}:413` },
        {
          key: "r",
          label: "revert",
          children: [
            { key: "a", description: "Revert all (prompt)", command: "<cmd>OpenCode revert all prompt<CR>", modes: ["n"], source: `${L}:415` },
            { key: "t", description: "Revert this (prompt)", command: "<cmd>OpenCode revert this prompt<CR>", modes: ["n"], source: `${L}:416` },
          ],
        },
        { key: "b", description: "Agent build", command: "<cmd>OpenCode agent build<CR>", modes: ["n"], source: `${L}:418` },
        { key: "l", description: "Agent plan", command: "<cmd>OpenCode agent plan<CR>", modes: ["n"], source: `${L}:419` },
        { key: "/", description: "Quick chat", command: "<cmd>OpenCode quick_chat<CR>", modes: ["n", "v"], source: `${L}:421` },
        { key: "T", description: "Timeline", command: "<cmd>OpenCode timeline<CR>", modes: ["n"], source: `${L}:423` },
        { key: "x", description: "Swap position", command: "<cmd>OpenCode swap position<CR>", modes: ["n"], source: `${L}:425` },
        { key: "C", description: "Cancel opencode", command: "<cmd>OpenCode cancel<CR>", modes: ["n"], source: `${L}:427` },
      ],
    },
    {
      key: "p",
      label: "nvim-tree",
      children: [
        { key: "v", description: "Find file in tree", command: "<cmd>NvimTreeFindFile<CR>", modes: ["n"], source: `${L}:248` },
      ],
    },
    { key: "q", description: "Quit", command: "<cmd>quit<CR>", modes: ["n"], source: `${I}:70` },
    {
      key: "r",
      label: "rust",
      children: [
        { key: "r", description: "Rust run", command: "<cmd>RustRun<CR>", modes: ["n"], source: `${L}:492` },
        { key: "t", description: "Rust test", command: "<cmd>RustTest<CR>", modes: ["n"], source: `${L}:493` },
        { key: "d", description: "Rust debuggables", command: "<cmd>RustDebuggables<CR>", modes: ["n"], source: `${L}:494` },
        { key: "e", description: "Rust expand macro", command: "<cmd>RustExpandMacro<CR>", modes: ["n"], source: `${L}:495` },
        { key: "h", description: "Rust hover actions", command: "<cmd>RustHoverActions<CR>", modes: ["n"], source: `${L}:496` },
      ],
    },
    { key: "rn", description: "Rename symbol (LSP)", command: "vim.lsp.buf.rename()", modes: ["n"], source: `${S}:9` },
    { key: "s", description: "Horizontal split", command: "<cmd>split<CR>", modes: ["n"], source: `${I}:78` },
    {
      key: "t",
      label: "test",
      children: [
        { key: "t", description: "Run file tests", command: 'function() require("neotest").run.run(vim.fn.expand("%")) end', modes: ["n"], source: `${L}:546` },
        { key: "l", description: "Run nearest test", command: 'function() require("neotest").run.run() end', modes: ["n"], source: `${L}:547` },
        { key: "s", description: "Test summary", command: 'function() require("neotest").summary.toggle() end', modes: ["n"], source: `${L}:548` },
        { key: "o", description: "Test output", command: 'function() require("neotest").output.open() end', modes: ["n"], source: `${L}:549` },
      ],
    },
    { key: "T", description: "Toggle terminal", command: "<cmd>ToggleTerm<CR>", modes: ["n"], source: `${L}:55` },
    { key: "v", description: "Vertical split", command: "<cmd>vsplit<CR>", modes: ["n"], source: `${I}:77` },
    { key: "vd", description: "Show diagnostic in float (LSP)", command: "vim.diagnostic.open_float()", modes: ["n"], source: `${S}:14` },
    { key: "w", description: "Save", command: "<cmd>write<CR>", modes: ["n"], source: `${I}:69` },
  ],
};

// ── Keymaps fuera del leader (no forman parte del arbol del simulador) ──────

export type KeymapEntry = {
  /** Secuencia completa, p. ej. "<Space>ff" o "<C-h>" o "jj". */
  path: string;
  /** Tokens individuales para render <kbd>. */
  keys: string[];
  /** Descripción original en inglés, literal de Lua (verificada). */
  description: string;
  /** Descripción en español (capa de keymaps-es.ts). */
  descriptionEs?: string;
  command?: string;
  modes: Mode[];
  source: string;
};

export type KeymapGroup = {
  id: string;
  title: string;
  entries: KeymapEntry[];
};

const GLOBAL_KEYMAPS: Array<KeymapEntry & { group: string }> = [
  // Generales (init.lua)
  { path: "jj", keys: ["j", "j"], description: "Escape", command: "<ESC>", modes: ["i"], source: `${I}:72`, group: "general" },
  { path: "<C-h>", keys: ["<C-h>"], description: "Go left", command: "<C-w>h", modes: ["n"], source: `${I}:73`, group: "general" },
  { path: "<C-j>", keys: ["<C-j>"], description: "Go down", command: "<C-w>j", modes: ["n"], source: `${I}:74`, group: "general" },
  { path: "<C-k>", keys: ["<C-k>"], description: "Go up", command: "<C-w>k", modes: ["n"], source: `${I}:75`, group: "general" },
  { path: "<C-l>", keys: ["<C-l>"], description: "Go right", command: "<C-w>l", modes: ["n"], source: `${I}:76`, group: "general" },
  // Terminal (init.lua)
  { path: "<A-Right>", keys: ["<A-Right>"], description: "Next tab", command: '<C-\\><C-n>:tabnext<CR>', modes: ["t"], source: `${I}:81`, group: "terminal" },
  { path: "<A-Left>", keys: ["<A-Left>"], description: "Previous tab", command: '<C-\\><C-n>:tabprevious<CR>', modes: ["t"], source: `${I}:82`, group: "terminal" },
  { path: "<C-[>", keys: ["<C-[>"], description: "Exit terminal insert mode", command: "<C-\\><C-n>", modes: ["t"], source: `${I}:83`, group: "terminal" },
  { path: "jj", keys: ["j", "j"], description: "Exit terminal insert mode", command: "<C-\\><C-n>", modes: ["t"], source: `${I}:84`, group: "terminal" },
  { path: "<C-h>", keys: ["<C-h>"], description: "Go left", command: "<C-\\><C-n><C-w>h", modes: ["t"], source: `${I}:85`, group: "terminal" },
  { path: "<C-j>", keys: ["<C-j>"], description: "Go down", command: "<C-\\><C-n><C-w>j", modes: ["t"], source: `${I}:86`, group: "terminal" },
  { path: "<C-k>", keys: ["<C-k>"], description: "Go up", command: "<C-\\><C-n><C-w>k", modes: ["t"], source: `${I}:87`, group: "terminal" },
  { path: "<C-l>", keys: ["<C-l>"], description: "Go right", command: "<C-\\><C-n><C-w>l", modes: ["t"], source: `${I}:88`, group: "terminal" },
  { path: "<A-q>", keys: ["<A-q>"], description: "Hide terminal", command: "<cmd>ToggleTerm<CR>", modes: ["t"], source: `${I}:89`, group: "terminal" },
  { path: "<A-q>", keys: ["<A-q>"], description: "Toggle terminal", command: "<cmd>ToggleTerm<CR>", modes: ["n"], source: `${I}:90`, group: "terminal" },
  { path: "<A-j>", keys: ["<A-j>"], description: "Toggle quickfix panel", command: 'function() … cclose/copen … end', modes: ["n"], source: `${I}:91`, group: "terminal" },
  // Telescope (mappings dentro de pickers, plugins.lua)
  { path: "<C-j>", keys: ["<C-j>"], description: "Move selection next", command: "actions.move_selection_next", modes: ["i"], source: `${L}:270`, group: "telescope" },
  { path: "<C-k>", keys: ["<C-k>"], description: "Move selection previous", command: "actions.move_selection_previous", modes: ["i"], source: `${L}:271`, group: "telescope" },
  { path: "<C-q>", keys: ["<C-q>"], description: "Send selected to quickfix", command: "actions.send_selected_to_qflist + actions.open_qflist", modes: ["i"], source: `${L}:272`, group: "telescope" },
  { path: "<Esc>", keys: ["<Esc>"], description: "Close Telescope", command: "actions.close", modes: ["i"], source: `${L}:273`, group: "telescope" },
  { path: "q", keys: ["q"], description: "Close Telescope", command: "actions.close", modes: ["n"], source: `${L}:276`, group: "telescope" },
  // LSP sin leader (lsp.lua on_attach)
  { path: "gd", keys: ["g", "d"], description: "Go to definition", command: "vim.lsp.buf.definition()", modes: ["n"], source: `${S}:6`, group: "lsp" },
  { path: "gr", keys: ["g", "r"], description: "Show references", command: "vim.lsp.buf.references()", modes: ["n"], source: `${S}:7`, group: "lsp" },
  { path: "gi", keys: ["g", "i"], description: "Go to implementation", command: "vim.lsp.buf.implementation()", modes: ["n"], source: `${S}:8`, group: "lsp" },
  { path: "K", keys: ["K"], description: "Hover / documentation", command: "vim.lsp.buf.hover()", modes: ["n"], source: `${S}:11`, group: "lsp" },
  { path: "[d", keys: ["[", "d"], description: "Previous diagnostic", command: 'vim.diagnostic.jump({ count = -1 })', modes: ["n"], source: `${S}:12`, group: "lsp" },
  { path: "]d", keys: ["]", "d"], description: "Next diagnostic", command: 'vim.diagnostic.jump({ count = 1 })', modes: ["n"], source: `${S}:13`, group: "lsp" },
  // Autocompletado nvim-cmp (plugins.lua)
  { path: "<Tab>", keys: ["<Tab>"], description: "Next completion item", command: "cmp.mapping.select_next_item()", modes: ["i"], source: `${L}:357`, group: "completion" },
  { path: "<S-Tab>", keys: ["<S-Tab>"], description: "Previous completion item", command: "cmp.mapping.select_prev_item()", modes: ["i"], source: `${L}:358`, group: "completion" },
  { path: "<CR>", keys: ["<CR>"], description: "Confirm completion", command: "cmp.mapping.confirm({ select = true })", modes: ["i"], source: `${L}:359`, group: "completion" },
  { path: "<C-Space>", keys: ["<C-Space>"], description: "Force completion", command: "cmp.mapping.complete()", modes: ["i"], source: `${L}:360`, group: "completion" },
];

const GROUP_TITLES: Array<{ id: string; title: string }> = [
  { id: "general", title: "Generales" },
  { id: "terminal", title: "Terminal" },
  { id: "nvim-tree", title: "NvimTree (explorador)" },
  { id: "telescope", title: "Telescope (fuzzy finder)" },
  { id: "buffers", title: "Buffers (bufferline)" },
  { id: "lsp", title: "LSP" },
  { id: "completion", title: "Autocompletado (nvim-cmp)" },
  { id: "go", title: "Go (go.nvim)" },
  { id: "rust", title: "Rust (rustaceanvim)" },
  { id: "tests", title: "Tests (neotest)" },
  { id: "debug", title: "Debug (nvim-dap)" },
  { id: "cmake", title: "CMake (cmake-tools.nvim)" },
  { id: "opencode", title: "OpenCode (opencode.nvim)" },
];

// Clasifica un path con prefijo <Space> segun el grupo de primer nivel.
function groupForLeaderPath(path: string): string {
  const rest = path.slice("<Space>".length);
  if (rest.startsWith("o")) return "opencode";
  if (rest.startsWith("g")) return "go";
  if (rest.startsWith("r")) return "rust";
  if (rest.startsWith("t")) return "tests";
  if (rest.startsWith("d")) return "debug";
  if (rest.startsWith("f")) return "telescope";
  if (rest === "ca" || rest === "ch" || rest === "rn" || rest === "vd") return "lsp";
  if (rest.startsWith("c")) return "cmake";
  if (rest.startsWith("b")) return "buffers";
  if (rest === "e" || rest.startsWith("p")) return "nvim-tree";
  if (rest === "T") return "terminal";
  return "general";
}

// Aplanar el arbol: solo nodos hoja con `description` (los puros intermediarios
// como <Space>g-a o <Space>o-r tienen descripcion en sus hijos, no ellos).
function flattenTree(node: KeymapNode, prefix = ""): KeymapEntry[] {
  const path = prefix + node.key;
  const out: KeymapEntry[] = [];
  const isRoot = prefix === "";
  if (!isRoot && node.description) {
    out.push({
      path,
      keys: isRoot ? [node.key] : tokenize(path),
      description: node.description,
      command: node.command,
      modes: node.modes ?? ["n"],
      source: node.source ?? "",
    });
  }
  for (const child of node.children ?? []) {
    out.push(...flattenTree(child, isRoot ? "<Space>" : path));
  }
  return out;
}

// "<Space>ff" -> ["<Space>", "f", "f"];  "<C-h>" -> ["<C-h>"]
export function tokenize(path: string): string[] {
  return path.match(/<[^>]+>|\S/g) ?? [];
}

export function esForEntry(path: string, modes: Mode[]): string | undefined {
  if (path.startsWith("<Space>")) return ES_DESCRIPTIONS[path];
  return ES_DESCRIPTIONS[`${path}|${modes.join(",")}`] ?? ES_DESCRIPTIONS[path];
}

// Vista plana por grupos para las tablas (compartida con el arbol: misma fuente).
export const keymapGroups: KeymapGroup[] = GROUP_TITLES.map(({ id, title }) => {
  const leaderEntries = flattenTree(keymapTree).filter(
    (entry) => groupForLeaderPath(entry.path) === id,
  );
  const globalEntries = GLOBAL_KEYMAPS.filter((entry) => entry.group === id).map(
    ({ group: _group, ...entry }) => entry,
  );
  const entries = [...leaderEntries, ...globalEntries].map((entry) => ({
    ...entry,
    descriptionEs: esForEntry(entry.path, entry.modes) ?? entry.description,
  }));
  return { id, title, entries };
});

// Conteo total verificado (102 = 71 del arbol con descripcion + 31 globales).
export const keymapCount: number = keymapGroups.reduce(
  (sum, group) => sum + group.entries.length,
  0,
);
