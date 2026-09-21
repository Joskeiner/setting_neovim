// Datos para LspSection e InstallSection (fase 2.7, T1).
// Transcritos literalmente de init.lua, lua/config/lsp.lua y README.md.

export type EditorOption = {
  option: string;
  value: string;
  effect: string;
};

export const editorOptions: EditorOption[] = [
  { option: "number + relativenumber", value: "true", effect: "Numeros de linea absolutos y relativos" },
  { option: "cursorline", value: "true", effect: "Resaltar linea del cursor" },
  { option: "colorcolumn", value: '"100"', effect: "Limite visual de 100 columnas" },
  { option: "tabstop / shiftwidth / softtabstop", value: "2", effect: "Indentacion de 2 espacios" },
  { option: "expandtab", value: "true", effect: "Usar espacios en lugar de tabs" },
  { option: "undofile", value: "true", effect: "Historial de undo persistente entre sesiones" },
  { option: "clipboard", value: '"unnamedplus"', effect: "Compartir portapapeles con el sistema" },
  { option: "scrolloff / sidescrolloff", value: "8", effect: "Margen de 8 lineas/columnas al hacer scroll" },
];

export type Lsp = {
  name: string;
  languages: string;
  cmd: string[];
  filetypes: string[];
  rootMarkers: string[];
  extra: string;
};

export const lsps: Lsp[] = [
  {
    name: "clangd",
    languages: "C, C++, CUDA, Objective-C",
    cmd: ["clangd", "--clang-tidy", "--background-index", "--header-insertion=iwyu"],
    filetypes: ["c", "cpp", "cuda", "objc", "objcpp"],
    rootMarkers: ["compile_commands.json", "compile_flags.txt", ".clangd"],
    extra: "Header-switch con <leader>ch",
  },
  {
    name: "ts_ls",
    languages: "JavaScript, TypeScript, React, Vue",
    cmd: [],
    filetypes: ["javascript", "typescript", "javascriptreact", "typescriptreact", "vue"],
    rootMarkers: ["package.json", "tsconfig.json", "jsconfig.json"],
    extra: "Diagnostics, autocompletado, acciones de codigo",
  },
];

export const yankAutocmd = `vim.api.nvim_create_autocmd("TextYankPost", {
  group = vim.api.nvim_create_augroup("UserConfig", { clear = true }),
  callback = function()
    vim.highlight.on_yank { higroup = "IncSearch", timeout = 200 }
  end,
  desc = "Highlight yanked text",
})`;

export type Requirement = {
  dependency: string;
  version: string;
  notes: string;
};

export const requirements: Requirement[] = [
  { dependency: "Neovim", version: ">= 0.10", notes: "Soporte nativo de vim.lsp.config / vim.lsp.enable" },
  { dependency: "git", version: ">= 2.19", notes: "Para clonar lazy.nvim y plugins" },
  { dependency: "make", version: "-", notes: "Compilar telescope-fzf-native.nvim" },
  { dependency: "Compilador C", version: "gcc/clang", notes: "telescope-fzf-native.nvim y parsers de Treesitter" },
  { dependency: "Node.js", version: ">= 18", notes: "Requerido por LSPs como ts_ls (via Mason)" },
];

export type InstallPath = {
  id: string;
  title: string;
  commands: string[];
  note?: string;
};

export const installPaths: InstallPath[] = [
  {
    id: "script",
    title: "Opcion A: script automatico (recomendado)",
    commands: ["git clone <URL_DEL_REPO> ~/setting_neovim", "cd ~/setting_neovim", "./install.sh"],
    note: "Detecta tu config actual, crea un backup y ofrece symlink o copia estatica.",
  },
  {
    id: "symlink",
    title: "Opcion B: manual (symlink)",
    commands: [
      "mv ~/.config/nvim ~/.config/nvim.backup.$(date +%Y%m%d%H%M%S)",
      "git clone <URL_DEL_REPO> ~/setting_neovim",
      "ln -s ~/setting_neovim ~/.config/nvim",
      "nvim",
    ],
  },
  {
    id: "copia",
    title: "Opcion C: manual (copia estatica)",
    commands: ["git clone <URL_DEL_REPO> ~/setting_neovim", "cp -R ~/setting_neovim/* ~/.config/nvim/", "nvim"],
  },
];
