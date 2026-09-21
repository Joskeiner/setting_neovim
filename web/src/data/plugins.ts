// Datos para PluginGrid (fase 2.7, T1).
// Proposito y keymaps transcritos de lua/config/plugins.lua y README.md.
// La fuente unica de keymaps es keymaps.ts (fase 2.2, T2, completada):
// simulador y referencia se alimentan de ella.

export type Plugin = {
  slug: string;
  name: string;
  repo: string;
  purpose: string;
  keymaps: string[];
};

export const plugins: Plugin[] = [
  {
    slug: "nord",
    name: "nord.nvim",
    repo: "https://github.com/shaunsingh/nord.nvim",
    purpose: "Tema de colores Nord con overrides para OpenCode",
    keymaps: [],
  },
  {
    slug: "which-key",
    name: "which-key.nvim",
    repo: "https://github.com/folke/which-key.nvim",
    purpose: "Popup con keymaps disponibles al presionar <leader>",
    keymaps: ["<leader>b"],
  },
  {
    slug: "toggleterm",
    name: "toggleterm.nvim",
    repo: "https://github.com/akinsho/toggleterm.nvim",
    purpose: "Terminal integrada horizontal",
    keymaps: ["<leader>T", "<Alt-q>"],
  },
  {
    slug: "bufferline",
    name: "bufferline.nvim",
    repo: "https://github.com/akinsho/bufferline.nvim",
    purpose: "Pestanas de buffers con diagnosticos LSP",
    keymaps: ["<leader>bn", "<leader>bp", "<leader>bc"],
  },
  {
    slug: "nvim-tree",
    name: "nvim-tree.lua",
    repo: "https://github.com/nvim-tree/nvim-tree.lua",
    purpose: "Explorador de archivos lateral",
    keymaps: ["<leader>e", "<leader>pv"],
  },
  {
    slug: "telescope",
    name: "telescope.nvim",
    repo: "https://github.com/nvim-telescope/telescope.nvim",
    purpose: "Fuzzy finder: archivos, grep, buffers, simbolos LSP",
    keymaps: [
      "<leader>ff",
      "<leader>fg",
      "<leader>fb",
      "<leader>fh",
      "<leader>fr",
      "<leader>fd",
      "<leader>fs",
      "<leader>fw",
      "<leader>fc",
    ],
  },
  {
    slug: "telescope-fzf-native",
    name: "telescope-fzf-native.nvim",
    repo: "https://github.com/nvim-telescope/telescope-fzf-native.nvim",
    purpose: "Backend nativo fzf para Telescope (mas rapido)",
    keymaps: [],
  },
  {
    slug: "mason",
    name: "mason.nvim",
    repo: "https://github.com/williamboman/mason.nvim",
    purpose: "Gestor de LSPs, DAPs, linters y formatters",
    keymaps: [],
  },
  {
    slug: "mason-lspconfig",
    name: "mason-lspconfig.nvim",
    repo: "https://github.com/williamboman/mason-lspconfig.nvim",
    purpose: "Puente entre Mason y nvim-lspconfig",
    keymaps: [],
  },
  {
    slug: "nvim-cmp",
    name: "nvim-cmp",
    repo: "https://github.com/hrsh7th/nvim-cmp",
    purpose: "Motor de autocompletado (LSP, buffer, path, snippets)",
    keymaps: ["<Tab>", "<S-Tab>", "<CR>", "<C-Space>"],
  },
  {
    slug: "nvim-lspconfig",
    name: "nvim-lspconfig",
    repo: "https://github.com/neovim/nvim-lspconfig",
    purpose: "Configuraciones oficiales de LSP para Neovim",
    keymaps: [],
  },
  {
    slug: "opencode",
    name: "opencode.nvim",
    repo: "https://github.com/sudo-tee/opencode.nvim",
    purpose: "Integracion del agente de IA OpenCode con Neovim",
    keymaps: ["<leader>o…"],
  },
  {
    slug: "render-markdown",
    name: "render-markdown.nvim",
    repo: "https://github.com/MeanderingProgrammer/render-markdown.nvim",
    purpose: "Renderizado mejorado de Markdown (usado por opencode)",
    keymaps: [],
  },
  {
    slug: "go-nvim",
    name: "go.nvim",
    repo: "https://github.com/ray-x/go.nvim",
    purpose: "Herramientas para Go: build, test, imports, comentarios IA",
    keymaps: [
      "<leader>gb",
      "<leader>gt",
      "<leader>gca",
      "<leader>gcr",
      "<leader>gai",
      "<leader>gii",
    ],
  },
  {
    slug: "rustaceanvim",
    name: "rustaceanvim",
    repo: "https://github.com/mrcjkb/rustaceanvim",
    purpose: "Configuracion completa para Rust (rust-analyzer)",
    keymaps: ["<leader>rr", "<leader>rt", "<leader>rd", "<leader>re", "<leader>rh"],
  },
  {
    slug: "crates",
    name: "crates.nvim",
    repo: "https://github.com/saecki/crates.nvim",
    purpose: "Autocompletado y versiones en Cargo.toml",
    keymaps: [],
  },
  {
    slug: "neotest",
    name: "neotest",
    repo: "https://github.com/nvim-neotest/neotest",
    purpose: "Ejecucion de tests unificada (Go + Rust)",
    keymaps: ["<leader>tt", "<leader>tl", "<leader>ts", "<leader>to"],
  },
  {
    slug: "nvim-dap",
    name: "nvim-dap",
    repo: "https://github.com/mfussenegger/nvim-dap",
    purpose: "Debug Adapter Protocol para Neovim",
    keymaps: ["<leader>db", "<leader>dc", "<leader>do", "<leader>di", "<leader>dO", "<leader>dr"],
  },
  {
    slug: "cmake-tools",
    name: "cmake-tools.nvim",
    repo: "https://github.com/Civitasv/cmake-tools.nvim",
    purpose: "Integracion CMake: build, run, clean, select kit",
    keymaps: ["<leader>cb", "<leader>cr", "<leader>cc", "<leader>cs"],
  },
  {
    slug: "treesitter",
    name: "nvim-treesitter",
    repo: "https://github.com/nvim-treesitter/nvim-treesitter",
    purpose: "Resaltado y parsing incremental",
    keymaps: [],
  },
  {
    slug: "devicons",
    name: "nvim-web-devicons",
    repo: "https://github.com/nvim-tree/nvim-web-devicons",
    purpose: "Iconos de archivos (nvim-tree, telescope)",
    keymaps: [],
  },
  {
    slug: "plenary",
    name: "plenary.nvim",
    repo: "https://github.com/nvim-lua/plenary.nvim",
    purpose: "Libreria Lua de utilidades (dependencia comun)",
    keymaps: [],
  },
];
