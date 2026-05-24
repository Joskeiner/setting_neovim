-- General
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Lazy.nvim bootstrap
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.uv.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup("config.plugins")

-- Editor
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.cursorline = true
vim.opt.termguicolors = true
vim.opt.colorcolumn = "100"
vim.opt.showmode = false
vim.opt.signcolumn = "yes"

-- Indentation
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.softtabstop = 2
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.wrap = false

-- Search
vim.opt.hlsearch = true
vim.opt.incsearch = true
vim.opt.ignorecase = true
vim.opt.smartcase = true

-- Splits
vim.opt.splitright = true
vim.opt.splitbelow = true

-- Undo / Backup
vim.opt.undofile = true
vim.opt.undodir = vim.fn.stdpath("data") .. "/undo"
vim.opt.backup = false
vim.opt.writebackup = false

-- Mouse
vim.opt.mouse = "a"

-- Clipboard
vim.opt.clipboard = "unnamedplus"

-- Completion
vim.opt.completeopt = { "menu", "menuone", "noselect" }
vim.opt.pumheight = 10

-- Scrolling
vim.opt.scrolloff = 8
vim.opt.sidescrolloff = 8

-- Keymaps
vim.keymap.set("n", "<leader>w", "<cmd>write<CR>", { desc = "Save" })
vim.keymap.set("n", "<leader>q", "<cmd>quit<CR>", { desc = "Quit" })
vim.keymap.set("n", "<leader>h", "<cmd>nohlsearch<CR>", { desc = "Clear highlights" })
vim.keymap.set("i", "jj", "<ESC>", { desc = "Escape" })
vim.keymap.set("n", "<C-h>", "<C-w>h", { desc = "Go left" })
vim.keymap.set("n", "<C-j>", "<C-w>j", { desc = "Go down" })
vim.keymap.set("n", "<C-k>", "<C-w>k", { desc = "Go up" })
vim.keymap.set("n", "<C-l>", "<C-w>l", { desc = "Go right" })

-- From VS Code keybindings (setting_vscode/keybindings.json)
vim.keymap.set("t", "<A-Right>", "<C-\\><C-n>:tabnext<CR>", { desc = "Next terminal" })
vim.keymap.set("t", "<A-Left>", "<C-\\><C-n>:tabprevious<CR>", { desc = "Previous terminal" })
vim.keymap.set("n", "<leader>T", "<cmd>terminal<CR>", { desc = "New terminal" })
vim.keymap.set("t", "<A-q>", "<C-\\><C-n>:bdelete!<CR>", { desc = "Kill terminal" })
vim.keymap.set("n", "<A-q>", function()
  local bufs = vim.api.nvim_list_bufs()
  for _, buf in ipairs(bufs) do
    if vim.bo[buf].filetype == "terminal" then
      vim.api.nvim_buf_delete(buf, { force = true })
      break
    end
  end
end, { desc = "Kill terminal (normal)" })
vim.keymap.set("n", "<A-j>", function()
  local qf_open = false
  for _, win in ipairs(vim.api.nvim_list_wins()) do
    if vim.bo[vim.api.nvim_win_get_buf(win)].filetype == "qf" then
      qf_open = true
      break
    end
  end
  if qf_open then vim.cmd("cclose") else vim.cmd("copen") end
end, { desc = "Toggle quickfix panel" })

-- Autocommands
local augroup = vim.api.nvim_create_augroup("UserConfig", { clear = true })

vim.api.nvim_create_autocmd("TextYankPost", {
  group = augroup,
  callback = function()
    vim.highlight.on_yank { higroup = "IncSearch", timeout = 200 }
  end,
  desc = "Highlight yanked text",
})

