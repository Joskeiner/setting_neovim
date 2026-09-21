# Agent Notes for setting_neovim

This is a **Neovim configuration** (not an application). Changes are validated by opening Neovim, not by a build/test CLI.

## Quick Check

- Open Neovim: `nvim`
- Verify plugin loading: `:Lazy`  (should show no errors)
- Verify LSP health: `:checkhealth lsp` or `:LspInfo`
- Update plugin lockfile after plugin changes: `:Lazy sync` → commit `lazy-lock.json`

## Architecture

- `init.lua` — Bootstrap `lazy.nvim`, editor options, keymaps, autocommands.
- `lua/config/plugins.lua` — All plugin definitions for `lazy.nvim`.
- `lua/config/lsp.lua` — LSP configs (`clangd`, `ts_ls`) using `vim.lsp.config` / `vim.lsp.enable`.
- `lazy-lock.json` — Pin commit. Must be committed for reproducibility.
- `web/` — Landing page (Astro + Tailwind v4, managed with **bun**). Neovim ignores it.

## Landing page (`web/`)

- Package manager and runtime: `bun` (not npm/node directly).
- `bun install` — Install dependencies.
- `bun run dev` — Dev server (`astro dev`, http://localhost:4321).
- `bun run build` — Static build (`astro build` → `web/dist/`).
- `bun run preview` — Preview the static build.
- Root `package.json` (workspaces) mirrors these scripts, so they also work from
  the repo root; the real project lives in `web/` (`cd web && bun run dev` is equivalent).
- Tailwind v4 CSS-first: Nord tokens live in `web/src/styles/global.css` via `@theme`
  (usable as `bg-nord0`, `text-nord4`, …). No `tailwind.config.js`.
- Static sections render from data (`web/src/data/plugins.ts`, `web/src/data/editor.ts`,
  `web/src/data/keymaps.ts`), never hardcoded in markup. `keymaps.ts` is the single
  source of truth for all 102 keymaps (tree for the simulator + flat groups for the
  filterable reference); if a keymap changes in Lua, update it there.
- `web/src/components/nvim-preview/` — animated Neovim preview (Three.js) shown next
  to the which-key simulator when it reaches a leaf: `resolvePreview.ts` (pure
  command → archetype classifier, tested with `bun test`), `NvimStage.ts` (scene,
  lazy-loaded only when a leaf is reached), `textures.ts` (CanvasTexture Nord mock).
  No new dependencies (`three` already used by `HeroScene.ts`); fallback 2D DOM for
  no-WebGL / `prefers-reduced-motion`. The 31 global keymaps (outside `<Space>`) are
  not reachable from the simulator, so they have no preview.
- After editing `web/package.json`: run `bun install` and commit `web/bun.lock`.
- Run tests from `web/`: `bun test` (which-key state machine + resolvePreview).

## Requirements

- **Neovim >= 0.10** (uses `vim.lsp.config` / `vim.lsp.enable`).
- `git` >= 2.19, `make`, and a C compiler (`gcc` or `clang`) for `telescope-fzf-native.nvim`.
- `Node.js` >= 18 for `ts_ls` (installed via Mason).

## Installation

Use `install.sh` for an interactive setup (backs up existing config, offers symlink or copy):
```bash
./install.sh
```

Or manual symlink:
```bash
mv ~/.config/nvim ~/.config/nvim.backup.$(date +%Y%m%d%H%M%S)
ln -s /path/to/this/repo ~/.config/nvim
nvim
```

## Key Conventions

- Leader key is `<Space>`.
- `lazy-lock.json` is the source of truth for plugin versions. Run `:Lazy sync` and commit it after editing `lua/config/plugins.lua`.
- LSPs are auto-installed by `mason-lspconfig.nvim` when opening a matching file.
- `opencode.nvim` requires the `opencode` CLI tool installed separately (`opencode login`).
- `rustaceanvim` expects `rust-analyzer` in `$PATH` (via `rustup` or Mason).
- `go.nvim` runs `:GoInstallBinaries` automatically; ensure Go is available.
