# setting_neovim

> Configuración personal de Neovim basada en [lazy.nvim](https://github.com/folke/lazy.nvim). Optimizada para desarrollo en Go, Rust, C/C++ (CMake), TypeScript/JavaScript y con integración directa con [OpenCode](https://github.com/sudo-tee/opencode.nvim).

---

## Requisitos

| Dependencia | Versión mínima | Notas |
|-------------|----------------|-------|
| Neovim      | >= 0.10        | Requiere soporte nativo para `vim.lsp.config` / `vim.lsp.enable` |
| git         | >= 2.19        | Para clonar lazy.nvim y plugins |
| make        | -              | Necesario para compilar `telescope-fzf-native.nvim` |
| Compilador C| gcc/clang      | Necesario para `telescope-fzf-native.nvim` y algunos parsers de Treesitter |
| Node.js     | >= 18          | Requerido por LSPs como `ts_ls` (instalado vía Mason) |

---

## Instalación rápida

### Opción A: Script automático (recomendado)

```bash
git clone <URL_DEL_REPO> ~/setting_neovim
cd ~/setting_neovim
./install.sh
```

El script detectará tu configuración actual de Neovim, creará un backup y te preguntará si deseas un **symlink** (recomendado) o una **copia estática**.

### Opción B: Manual (symlink)

```bash
# 1. Backup de tu config actual
mv ~/.config/nvim ~/.config/nvim.backup.$(date +%Y%m%d%H%M%S)

# 2. Crear symlink al repo
git clone <URL_DEL_REPO> ~/setting_neovim
ln -s ~/setting_neovim ~/.config/nvim

# 3. Abrir Neovim (lazy instalará todo automáticamente)
nvim
```

### Opción C: Manual (copia estática)

```bash
git clone <URL_DEL_REPO> ~/setting_neovim
cp -R ~/setting_neovim/* ~/.config/nvim/
nvim
```

---

## Estructura del repositorio

```
.
├── init.lua                 -- Configuración general: opciones, keymaps, autocommands, bootstrap de lazy.nvim
├── lazy-lock.json           -- Lockfile con los commits exactos de cada plugin (reproducibilidad)
├── lua/
│   └── config/
│       ├── plugins.lua      -- Definición y configuración de todos los plugins gestionados por lazy.nvim
│       └── lsp.lua          -- Configuración de LSPs: clangd, ts_ls, keymaps y on_attach
├── install.sh               -- Script de instalación interactivo con backup automático
├── .gitignore               -- Ignora archivos generados por Neovim y el SO
├── README.md                -- Este archivo
└── LICENSE                  -- Licencia del proyecto
```

---

## Plugins

| Plugin | Propósito |
|--------|-----------|
| [nord.nvim](https://github.com/shaunsingh/nord.nvim) | Tema de colores Nord con overrides para OpenCode |
| [which-key.nvim](https://github.com/folke/which-key.nvim) | Muestra popup con keymaps disponibles al presionar `<leader>` |
| [nvim-tree.lua](https://github.com/nvim-tree/nvim-tree.lua) | Explorador de archivos lateral |
| [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) | Fuzzy finder extensible (archivos, grep, buffers, símbolos LSP, etc.) |
| [telescope-fzf-native.nvim](https://github.com/nvim-telescope/telescope-fzf-native.nvim) | Backend nativo de fzf para Telescope (más rápido) |
| [mason.nvim](https://github.com/williamboman/mason.nvim) | Gestor de LSPs, DAPs, linters y formatters |
| [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim) | Puente entre Mason y nvim-lspconfig |
| [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) | Motor de autocompletado |
| [cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp) | Fuente de autocompletado desde LSP |
| [cmp-buffer](https://github.com/hrsh7th/cmp-buffer) | Fuente de autocompletado desde el buffer actual |
| [cmp-path](https://github.com/hrsh7th/cmp-path) | Fuente de autocompletado para rutas de archivos |
| [LuaSnip](https://github.com/L3MON4D3/LuaSnip) | Motor de snippets |
| [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) | Configuraciones oficiales de LSP para Neovim |
| [opencode.nvim](https://github.com/sudo-tee/opencode.nvim) | Integración de OpenCode (agente de IA) con Neovim |
| [render-markdown.nvim](https://github.com/MeanderingProgrammer/render-markdown.nvim) | Renderizado mejorado de Markdown (usado por opencode) |
| [go.nvim](https://github.com/ray-x/go.nvim) | Herramientas específicas para Go (build, test, imports, AI comments) |
| [rustaceanvim](https://github.com/mrcjkb/rustaceanvim) | Configuración completa para Rust (rust-analyzer) |
| [crates.nvim](https://github.com/saecki/crates.nvim) | Autocompletado y info de versiones en `Cargo.toml` |
| [neotest](https://github.com/nvim-neotest/neotest) | Framework de ejecución de tests unificado |
| [neotest-golang](https://github.com/fredrikaverpil/neotest-golang) | Adaptador de Neotest para Go |
| [neotest-rust](https://github.com/rouge8/neotest-rust) | Adaptador de Neotest para Rust |
| [nvim-dap](https://github.com/mfussenegger/nvim-dap) | Protocolo de Debug Adapter para Neovim |
| [mason-nvim-dap.nvim](https://github.com/jay-babu/mason-nvim-dap.nvim) | Integración Mason-DAP |
| [nvim-dap-go](https://github.com/leoluz/nvim-dap-go) | Configuración DAP para Go (delve) |
| [cmake-tools.nvim](https://github.com/Civitasv/cmake-tools.nvim) | Integración con CMake (build, run, select kit) |
| [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) | Parser incremental para resaltado de sintaxis y más |
| [nvim-web-devicons](https://github.com/nvim-tree/nvim-web-devicons) | Iconos para archivos (usado por nvim-tree y telescope) |
| [plenary.nvim](https://github.com/nvim-lua/plenary.nvim) | Librería Lua de utilidades (dependencia de muchos plugins) |

---

## Keymaps

> `<leader>` está configurado como **espacio** (` `).

### Generales

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>w` | `n` | Guardar archivo (`:write`) |
| `<leader>q` | `n` | Salir (`:quit`) |
| `<leader>h` | `n` | Limpiar resaltado de búsqueda (`:nohlsearch`) |
| `jj` | `i` | Salir de modo insertar (como `Esc`) |
| `<C-h>` | `n` | Mover cursor a ventana izquierda |
| `<C-j>` | `n` | Mover cursor a ventana abajo |
| `<C-k>` | `n` | Mover cursor a ventana arriba |
| `<C-l>` | `n` | Mover cursor a ventana derecha |

### Terminal

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>T` | `n` | Abrir terminal nueva |
| `<Alt-Right>` | `t` | Siguiente tab (terminal) |
| `<Alt-Left>` | `t` | Tab anterior (terminal) |
| `<Alt-q>` | `t` | Cerrar terminal (forzado) |
| `<Alt-q>` | `n` | Cerrar primer buffer de terminal encontrado |
| `<Alt-j>` | `n` | Toggle panel de quickfix |

### NvimTree (Explorador de archivos)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>e` | `n` | Toggle explorador de archivos |
| `<leader>pv` | `n` | Encontrar archivo actual en el árbol |

### Telescope (Fuzzy Finder)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>ff` | `n` | Buscar archivos (`find_files`) |
| `<leader>fg` | `n` | Buscar texto en proyecto (`live_grep`) |
| `<leader>fb` | `n` | Listar buffers abiertos |
| `<leader>fh` | `n` | Buscar en tags de ayuda |
| `<leader>fr` | `n` | Archivos recientes (`oldfiles`) |
| `<leader>fd` | `n` | Diagnósticos del LSP |
| `<leader>fs` | `n` | Símbolos del documento (LSP) |
| `<leader>fw` | `n` | Buscar palabra bajo el cursor |
| `<C-j>` | `i` (Telescope) | Mover selección abajo |
| `<C-k>` | `i` (Telescope) | Mover selección arriba |
| `<C-q>` | `i` (Telescope) | Enviar seleccionados a quickfix |
| `<Esc>` / `q` | `i` / `n` (Telescope) | Cerrar Telescope |

### LSP (Language Server Protocol)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `gd` | `n` | Ir a definición |
| `gr` | `n` | Mostrar referencias |
| `gi` | `n` | Ir a implementación |
| `K` | `n` | Mostrar hover/documentation |
| `<leader>rn` | `n` | Renombrar símbolo |
| `<leader>ca` | `n` | Acciones de código (code action) |
| `[d` | `n` | Ir al diagnóstico anterior |
| `]d` | `n` | Ir al siguiente diagnóstico |
| `<leader>vd` | `n` | Mostrar diagnóstico en float |
| `<leader>ch` | `n` | Switch entre header/source (solo `clangd`) |

### Autocompletado (nvim-cmp)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<Tab>` | `i` | Siguiente ítem de autocompletado |
| `<S-Tab>` | `i` | Ítem anterior de autocompletado |
| `<CR>` | `i` | Confirmar selección |
| `<C-Space>` | `i` | Forzar autocompletado |

### Go (go.nvim)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>gb` | `n` | `GoBuild` |
| `<leader>gt` | `n` | `GoTest` |
| `<leader>gca` | `n` | `GoCmtAI` (comentario con IA) |
| `<leader>gcr` | `n` | `GoCodeReview` |
| `<leader>gai` | `n` | `GoAI` (comando IA) |
| `<leader>gii` | `n` | `GoInstallBinaries` |

### Rust (rustaceanvim)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>rr` | `n` | `RustRun` |
| `<leader>rt` | `n` | `RustTest` |
| `<leader>rd` | `n` | `RustDebuggables` |
| `<leader>re` | `n` | `RustExpandMacro` |
| `<leader>rh` | `n` | `RustHoverActions` |

### Tests (neotest)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>tt` | `n` | Ejecutar tests del archivo actual |
| `<leader>tl` | `n` | Ejecutar test más cercano |
| `<leader>ts` | `n` | Toggle panel resumen de tests |
| `<leader>to` | `n` | Abrir salida del test |

### Debug (nvim-dap)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>db` | `n` | Toggle breakpoint |
| `<leader>dc` | `n` | Continuar ejecución |
| `<leader>do` | `n` | Step over |
| `<leader>di` | `n` | Step into |
| `<leader>dO` | `n` | Step out |
| `<leader>dr` | `n` | Toggle REPL de debug |

### CMake (cmake-tools.nvim)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>cb` | `n` | `CMakeBuild` |
| `<leader>cr` | `n` | `CMakeRun` |
| `<leader>cc` | `n` | `CMakeClean` |
| `<leader>cs` | `n` | `CMakeSelectKit` |

### OpenCode (opencode.nvim)

| Keymap | Modo | Descripción |
|--------|------|-------------|
| `<leader>og` | `n` | Toggle OpenCode |
| `<leader>oi` | `n` | Abrir panel de input |
| `<leader>oo` | `n` | Abrir panel de output |
| `<leader>oq` | `n` | Cerrar OpenCode |
| `<leader>ot` | `n` | Toggle focus entre input/output |
| `<leader>os` | `n` | Seleccionar sesión |
| `<leader>oR` | `n` | Renombrar sesión |
| `<leader>op` | `n` | Cambiar proveedor/modelo |
| `<leader>oV` | `n` | Variante del modelo |
| `<leader>od` | `n` | Abrir diff |
| `<leader>o]` | `n` | Siguiente diff |
| `<leader>o[` | `n` | Diff anterior |
| `<leader>oc` | `n` | Cerrar diff |
| `<leader>ora` | `n` | Revertir todos los cambios (con prompt) |
| `<leader>ort` | `n` | Revertir cambio actual (con prompt) |
| `<leader>ob` | `n` | Agent: build |
| `<leader>ol` | `n` | Agent: plan |
| `<leader>o/` | `n`, `v` | Quick chat (visual o normal) |
| `<leader>oT` | `n` | Timeline |
| `<leader>ox` | `n` | Intercambiar posición de paneles |
| `<leader>oC` | `n` | Cancelar operación de OpenCode |

### Which-Key (grupos)

Al presionar `<leader>` y esperar (o presionar `<leader>b`), se muestra un popup con los grupos disponibles:

| Grupo | Descripción |
|-------|-------------|
| `<leader>f` | find / telescope |
| `<leader>o` | opencode |
| `<leader>od` | diff |
| `<leader>or` | revert |
| `<leader>d` | debug |
| `<leader>g` | go |
| `<leader>r` | rust |
| `<leader>t` | test |
| `<leader>c` | cmake / code |

---

## LSPs configurados

| LSP | Lenguajes | Características |
|-----|-----------|-----------------|
| `clangd` | C, C++, CUDA, Objective-C | `--clang-tidy`, `--background-index`, header-switch (`<leader>ch`) |
| `ts_ls` | JavaScript, TypeScript, React, Vue | Diagnostics, autocompletado, acciones de código |

Ambos LSPs se instalan automáticamente mediante **Mason** al abrir un archivo del lenguaje correspondiente (gracias a `mason-lspconfig.nvim`).

### Instalación manual de LSPs vía Mason

```vim
:Mason
```
Navega con `i` para instalar los servidores que necesites.

---

## Opciones del editor (init.lua)

| Opción | Valor | Efecto |
|--------|-------|--------|
| `number` + `relativenumber` | `true` | Números de línea absolutos y relativos |
| `cursorline` | `true` | Resaltar línea del cursor |
| `colorcolumn` | `"100"` | Límite visual de 100 columnas |
| `tabstop` / `shiftwidth` / `softtabstop` | `2` | Indentación de 2 espacios |
| `expandtab` | `true` | Usar espacios en lugar de tabs |
| `undofile` | `true` | Persistencia del historial de undo entre sesiones |
| `clipboard` | `"unnamedplus"` | Compartir portapapeles con el sistema |
| `scrolloff` / `sidescrolloff` | `8` | Margen de 8 líneas/columnas al hacer scroll |

---

## Cómo extender la configuración

### Agregar un nuevo plugin

Edita `lua/config/plugins.lua` y añade una nueva tabla al array que se retorna:

```lua
{
  "autor/plugin.nvim",
  event = "VeryLazy",      -- o ft = { "python" }, cmd = "Comando"
  dependencies = { "otro/plugin" },
  config = function()
    require("plugin").setup({})
  end,
  keys = {
    { "<leader>np", "<cmd>PluginComando<CR>", desc = "Nuevo plugin" },
  },
}
```

Reinicia Neovim o ejecuta `:Lazy sync` para instalar.

### Agregar un nuevo LSP

Edita `lua/config/lsp.lua` y añade la configuración siguiendo el patrón existente:

```lua
vim.lsp.config.pyright = {
  capabilities = capabilities,
  on_attach = on_attach,
  filetypes = { "python" },
  root_markers = { "pyproject.toml", "setup.py", ".git" },
}

vim.lsp.enable({ "clangd", "ts_ls", "pyright" })
```

Asegúrate de que el servidor esté disponible en tu `$PATH` o instálalo con `:Mason`.

### Actualizar plugins

```vim
:Lazy sync      -- Sincronizar (instalar/actualizar/limpiar)
:Lazy update    -- Actualizar todos los plugins
:Lazy clean     -- Eliminar plugins no usados
```

El archivo `lazy-lock.json` se actualiza automáticamente y debe commitearse para garantizar reproducibilidad entre máquinas.

---

## Notas

- **OpenCode**: El plugin `opencode.nvim` requiere que tengas [opencode](https://github.com/sudo-tee/opencode) instalado y configurado en tu sistema (`opencode login`).
- **Telescope-fzf-native**: Si la compilación falla, verifica que tienes `make` y un compilador C instalados. Puedes compilarlo manualmente:
  ```bash
  cd ~/.local/share/nvim/lazy/telescope-fzf-native.nvim
  make
  ```
- **Rust**: `rustaceanvim` asume que `rust-analyzer` está en tu `$PATH` (instálalo vía `rustup component add rust-analyzer` o Mason).
- **Go**: `go.nvim` intentará instalar sus dependencias binarias (`gopls`, `delve`, etc.) automáticamente con `:GoInstallBinaries`.

---

## Licencia

Ver [LICENSE](LICENSE).
