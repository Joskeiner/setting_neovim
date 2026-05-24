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
