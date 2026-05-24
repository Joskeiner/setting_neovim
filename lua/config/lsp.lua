local capabilities = require("cmp_nvim_lsp").default_capabilities() 

local on_attach = function(client, bufnr)
  local bufopts = { noremap = true, silent = true, buffer = bufnr }

  vim.keymap.set("n", "gd", vim.lsp.buf.definition, bufopts)
  vim.keymap.set("n", "gr", vim.lsp.buf.references, bufopts)
  vim.keymap.set("n", "gi", vim.lsp.buf.implementation, bufopts)
  vim.keymap.set("n", "<leader>rn", vim.lsp.buf.rename, bufopts)
  vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, bufopts)
  vim.keymap.set("n", "K", vim.lsp.buf.hover, bufopts)
  vim.keymap.set("n", "[d", function() vim.diagnostic.jump({ count = -1 }) end, bufopts)
  vim.keymap.set("n", "]d", function() vim.diagnostic.jump({ count = 1 }) end, bufopts)
  vim.keymap.set("n", "<leader>vd", vim.diagnostic.open_float, bufopts)

  if client.name == "clangd" then
    vim.keymap.set("n", "<leader>ch", "<cmd>ClangdSwitchSourceHeader<CR>", bufopts)
  end
end

vim.lsp.config.clangd = {
  cmd = { "clangd", "--clang-tidy", "--background-index", "--header-insertion=iwyu" },
  capabilities = capabilities,
  on_attach = on_attach,
  filetypes = { "c", "cpp", "cuda", "objc", "objcpp" },
  root_markers = { "compile_commands.json", "compile_flags.txt", ".clangd" },
}

vim.lsp.config.ts_ls = {
  capabilities = capabilities,
  on_attach = on_attach,
  filetypes = { "javascript", "typescript", "javascriptreact", "typescriptreact", "vue" },
  root_markers = { "package.json", "tsconfig.json", "jsconfig.json" },
}

vim.lsp.enable({ "clangd", "ts_ls" })
