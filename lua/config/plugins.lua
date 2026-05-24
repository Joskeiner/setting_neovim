return {
  {
    "shaunsingh/nord.nvim",
    lazy = false,
    priority = 1000,
    config = function()
      vim.g.nord_contrast = true
      vim.g.nord_borders = true
      vim.g.nord_disable_background = false
      vim.g.nord_cursorline_transparent = false
      vim.g.nord_enable_sidebar_background = false
      vim.g.nord_italic = true
      vim.g.nord_uniform_diff_background = true
      vim.g.nord_bold = true

      require("nord").set()
      vim.cmd.colorscheme("nord")

      -- Opencode.nvim highlight overrides to match OpenCode's UI
      local colors = {
        nord0 = "#2E3440",
        nord1 = "#3B4252",
        nord2 = "#434C5E",
        nord3 = "#4C566A",
        nord4 = "#D8DEE9",
        nord8 = "#88C0D0",
        nord11 = "#BF616A",
      }

      vim.api.nvim_set_hl(0, "OpencodeBackground", { bg = colors.nord1 })
      vim.api.nvim_set_hl(0, "OpencodeBorder", { fg = colors.nord2, bg = colors.nord1 })
    end,
  },

  {
    "akinsho/toggleterm.nvim",
    version = "*",
    lazy = false,
    config = function()
      require("toggleterm").setup({
        size = 15,
        direction = "horizontal",
        start_in_insert = true,
        persist_mode = true,
        shade_terminals = true,
        close_on_exit = true,
        highlights = {
          Normal = {
            guibg = "#3B4252",
          },
        },
      })
    end,
    keys = {
      { "<leader>T", "<cmd>ToggleTerm<CR>", desc = "Toggle terminal" },
    },
  },

  {
    "folke/which-key.nvim",
    event = "VeryLazy",
    opts = {
      preset = "modern",
      delay = 300,
      spec = {
        { "<leader>b", group = "buffers" },
        { "<leader>f", group = "find/telescope" },
        { "<leader>o", group = "opencode" },
        { "<leader>od", group = "diff" },
        { "<leader>or", group = "revert" },
        { "<leader>d", group = "debug" },
        { "<leader>g", group = "go" },
        { "<leader>r", group = "rust" },
        { "<leader>t", group = "test" },
        { "<leader>c", group = "cmake/code" },
      },
    },
    keys = {
      { "<leader>b", function() require("which-key").show({ global = true }) end, desc = "Show keymaps" },
    },
  },

  {
    "akinsho/bufferline.nvim",
    version = "*",
    dependencies = "nvim-tree/nvim-web-devicons",
    config = function()
      require("bufferline").setup({
        options = {
          mode = "buffers",
          separator_style = "slant",
          show_tab_indicators = true,
          show_close_icon = false,
          diagnostics = "nvim_lsp",
          diagnostics_indicator = function(count, level, diagnostics_dict, context)
            return "(" .. count .. ")"
          end,
          offsets = {
            {
              filetype = "NvimTree",
              text = "File Explorer",
              text_align = "left",
              highlight = "Directory",
              separator = true,
            },
          },
        },
        highlights = {
          fill = {
            guibg = "#2E3440",
            guifg = "#D8DEE9",
          },
          background = {
            guibg = "#3B4252",
            guifg = "#D8DEE9",
          },
          buffer_selected = {
            guibg = "#4C566A",
            guifg = "#ECEFF4",
            gui = "bold",
          },
          tab_selected = {
            guibg = "#4C566A",
            guifg = "#88C0D0",
            gui = "bold",
          },
          tab_close = {
            guibg = "#BF616A",
            guifg = "#ECEFF4",
          },
          indicator_selected = {
            guifg = "#88C0D0",
            guibg = "#4C566A",
          },
          close_button = {
            guibg = "#3B4252",
            guifg = "#4C566A",
          },
          close_button_visible = {
            guibg = "#4C566A",
            guifg = "#BF616A",
          },
          close_button_selected = {
            guibg = "#4C566A",
            guifg = "#BF616A",
          },
          duplicate = {
            guibg = "#3B4252",
            guifg = "#4C566A",
          },
          duplicate_selected = {
            guibg = "#4C566A",
            guifg = "#ECEFF4",
            gui = "bold",
          },
          modified = {
            guibg = "#3B4252",
            guifg = "#EBCB8B",
          },
          modified_selected = {
            guibg = "#4C566A",
            guifg = "#EBCB8B",
          },
          modified_visible = {
            guibg = "#3B4252",
            guifg = "#EBCB8B",
          },
          numbers = {
            guibg = "#3B4252",
            guifg = "#4C566A",
          },
          numbers_selected = {
            guibg = "#4C566A",
            guifg = "#88C0D0",
            gui = "bold",
          },
          error = {
            guifg = "#BF616A",
          },
          error_selected = {
            guifg = "#BF616A",
          },
          warning = {
            guifg = "#EBCB8B",
          },
          warning_selected = {
            guifg = "#EBCB8B",
          },
        },
      })
    end,
    keys = {
      { "<leader>bn", "<cmd>BufferLineCycleNext<CR>", desc = "Next buffer" },
      { "<leader>bp", "<cmd>BufferLineCyclePrev<CR>", desc = "Previous buffer" },
      { "<leader>bc", "<cmd>bdelete<CR>", desc = "Close buffer" },
    },
  },

  {
    "nvim-tree/nvim-tree.lua",
    dependencies = {
      "nvim-tree/nvim-web-devicons",
    },
    config = function()
      -- Disable netrw
      vim.g.loaded_netrwPlugin = 1
      vim.g.loaded_netrw = 1

      require("nvim-tree").setup({
        sort_by = "case_sensitive",
        view = {
          width = 30,
          side = "left",
        },
        renderer = {
          group_empty = true,
          icons = {
            show = {
              file = true,
              folder = true,
              folder_arrow = true,
              git = true,
            },
          },
        },
        filters = {
          dotfiles = false,
          custom = { "^.git$" },
        },
        git = {
          enable = true,
          ignore = false,
        },
        actions = {
          open_file = {
            quit_on_open = false,
            window_picker = {
              enable = true,
            },
          },
        },
      })
    end,
    keys = {
      { "<leader>e", "<cmd>NvimTreeToggle<CR>", desc = "Toggle file tree" },
      { "<leader>pv", "<cmd>NvimTreeFindFile<CR>", desc = "Find file in tree" },
    },
  },

  {
    "nvim-telescope/telescope.nvim",
    tag = "0.1.8",
    dependencies = {
      "nvim-lua/plenary.nvim",
      {
        "nvim-telescope/telescope-fzf-native.nvim",
        build = "make",
      },
    },
    config = function()
      local telescope = require("telescope")
      local actions = require("telescope.actions")

      telescope.setup({
        defaults = {
          file_ignore_patterns = { "node_modules", ".git/", "target/", "dist/" },
          mappings = {
            i = {
              ["<C-j>"] = actions.move_selection_next,
              ["<C-k>"] = actions.move_selection_previous,
              ["<C-q>"] = actions.send_selected_to_qflist + actions.open_qflist,
              ["<Esc>"] = actions.close,
            },
            n = {
              ["q"] = actions.close,
            },
          },
          layout_config = {
            horizontal = {
              preview_width = 0.55,
              results_width = 0.8,
            },
            width = 0.87,
            height = 0.80,
            preview_cutoff = 120,
          },
          borderchars = { "─", "│", "─", "│", "╭", "╮", "╯", "╰" },
        },
        pickers = {
          find_files = {
            hidden = true,
            follow = true,
          },
          live_grep = {
            additional_args = function()
              return { "--hidden" }
            end,
          },
        },
      })

      pcall(telescope.load_extension, "fzf")
    end,
    keys = {
      { "<leader>ff", "<cmd>Telescope find_files<CR>", desc = "Find files" },
      { "<leader>fg", "<cmd>Telescope live_grep<CR>", desc = "Live grep" },
      { "<leader>fb", "<cmd>Telescope buffers<CR>", desc = "Buffers" },
      { "<leader>fh", "<cmd>Telescope help_tags<CR>", desc = "Help tags" },
      { "<leader>fr", "<cmd>Telescope oldfiles<CR>", desc = "Recent files" },
      { "<leader>fd", "<cmd>Telescope diagnostics<CR>", desc = "Diagnostics" },
      { "<leader>fs", "<cmd>Telescope lsp_document_symbols<CR>", desc = "Document symbols" },
      { "<leader>fw", "<cmd>Telescope grep_string<CR>", desc = "Grep word under cursor" },
    },
  },

  {
    "williamboman/mason.nvim",
    build = ":MasonUpdate",
    config = true,
  },

  {
    "williamboman/mason-lspconfig.nvim",
    dependencies = { "williamboman/mason.nvim" },
    config = function()
      require("mason-lspconfig").setup({
        ensure_installed = {
          "clangd",
          "ts_ls",
        },
        automatic_installation = true,
      })
    end,
  },

  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-buffer",
      "hrsh7th/cmp-path",
      "L3MON4D3/LuaSnip",
    },
    config = function()
      local cmp = require("cmp")
      local luasnip = require("luasnip")

      cmp.setup({
        snippet = {
          expand = function(args)
            luasnip.lsp_expand(args.body)
          end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<Tab>"] = cmp.mapping.select_next_item(),
          ["<S-Tab>"] = cmp.mapping.select_prev_item(),
          ["<CR>"] = cmp.mapping.confirm({ select = true }),
          ["<C-Space>"] = cmp.mapping.complete(),
        }),
        sources = {
          { name = "nvim_lsp" },
          { name = "buffer" },
          { name = "path" },
        },
      })
    end,
  },

  {
    "neovim/nvim-lspconfig",
    dependencies = { "hrsh7th/cmp-nvim-lsp" },
    config = function()
      require("config.lsp")
    end,
  },

  {
    "sudo-tee/opencode.nvim",
    dependencies = {
      "nvim-lua/plenary.nvim",
      {
        "MeanderingProgrammer/render-markdown.nvim",
        opts = {
          anti_conceal = { enabled = false },
          file_types = { "markdown", "opencode_output" },
        },
        ft = { "markdown", "opencode_output" },
      },
      "nvim-telescope/telescope.nvim",
    },
    cmd = { "OpenCode", "OpenCodeToggle" },
    keys = {
      -- Main toggle
      { "<leader>og", "<cmd>OpenCodeToggle<CR>", desc = "Toggle opencode" },
      -- Input/Output
      { "<leader>oi", "<cmd>OpenCode open input<CR>", desc = "Open input" },
      { "<leader>oo", "<cmd>OpenCode open output<CR>", desc = "Open output" },
      { "<leader>oq", "<cmd>OpenCode close<CR>", desc = "Close opencode" },
      -- Focus
      { "<leader>ot", "<cmd>OpenCode toggle focus<CR>", desc = "Toggle focus" },
      -- Sessions
      { "<leader>os", "<cmd>OpenCode session select<CR>", desc = "Select session" },
      { "<leader>oR", "<cmd>OpenCode session rename<CR>", desc = "Rename session" },
      -- Model/Provider
      { "<leader>op", "<cmd>OpenCode configure provider<CR>", desc = "Change model" },
      { "<leader>oV", "<cmd>OpenCode variant<CR>", desc = "Model variant" },
      -- Diff
      { "<leader>od", "<cmd>OpenCode diff open<CR>", desc = "Open diff" },
      { "<leader>o]", "<cmd>OpenCode diff next<CR>", desc = "Next diff" },
      { "<leader>o[", "<cmd>OpenCode diff prev<CR>", desc = "Prev diff" },
      { "<leader>oc", "<cmd>OpenCode diff close<CR>", desc = "Close diff" },
      -- Revert
      { "<leader>ora", "<cmd>OpenCode revert all prompt<CR>", desc = "Revert all (prompt)" },
      { "<leader>ort", "<cmd>OpenCode revert this prompt<CR>", desc = "Revert this (prompt)" },
      -- Agents
      { "<leader>ob", "<cmd>OpenCode agent build<CR>", desc = "Agent build" },
      { "<leader>ol", "<cmd>OpenCode agent plan<CR>", desc = "Agent plan" },
      -- Quick chat (visual mode)
      { "<leader>o/", "<cmd>OpenCode quick_chat<CR>", mode = { "n", "v" }, desc = "Quick chat" },
      -- Timeline
      { "<leader>oT", "<cmd>OpenCode timeline<CR>", desc = "Timeline" },
      -- Swap position
      { "<leader>ox", "<cmd>OpenCode swap position<CR>", desc = "Swap position" },
      -- Cancel
      { "<leader>oC", "<cmd>OpenCode cancel<CR>", desc = "Cancel opencode" },
    },
    config = function()
      require("opencode").setup({
        preferred_picker = "telescope",
        preferred_completion = "nvim-cmp",
        default_mode = "build",
        keymap_prefix = "<leader>o",
        ui = {
          position = "bottom",
          input_position = "bottom",
          window_width = 0.40,
          window_highlight = "Normal:OpencodeBackground,FloatBorder:OpencodeBorder",
          persist_state = true,
          display_model = true,
          display_context_size = true,
          display_cost = true,
          input = {
            min_height = 0.10,
            max_height = 0.25,
          },
        },
        context = {
          enabled = true,
          current_file = { enabled = true, show_full_path = true },
          selection = { enabled = true },
          diagnostics = { warning = true, error = true },
        },
      })
    end,
  },

  {
    "ray-x/go.nvim",
    dependencies = {
      "ray-x/guihua.lua",
      "neovim/nvim-lspconfig",
      "nvim-treesitter/nvim-treesitter",
    },
    ft = { "go", "gomod" },
    build = ':lua require("go.install").update_all_sync()',
    config = function()
      require("go").setup({
        goimports = true,
        gofmt = true,
        lsp_codelens = true,
        lsp_document_formatting = true,
        luasnip = true,
      })
    end,
    keys = {
      { "<leader>gb", ":GoBuild<CR>", desc = "Go build" },
      { "<leader>gt", ":GoTest<CR>", desc = "Go test" },
      { "<leader>gca", ":GoCmtAI<CR>", desc = "Go comment AI" },
      { "<leader>gcr", ":GoCodeReview<CR>", desc = "Go code review" },
      { "<leader>gai", "<cmd>GoAI<CR>", desc = "Go AI command" },
      { "<leader>gii", ":GoInstallBinaries<CR>", desc = "Go install binaries" },
    },
  },

  {
    "mrcjkb/rustaceanvim",
    lazy = false,
    ft = { "rust" },
    keys = {
      { "<leader>rr", "<cmd>RustRun<CR>", desc = "Rust run" },
      { "<leader>rt", "<cmd>RustTest<CR>", desc = "Rust test" },
      { "<leader>rd", "<cmd>RustDebuggables<CR>", desc = "Rust debuggables" },
      { "<leader>re", "<cmd>RustExpandMacro<CR>", desc = "Rust expand macro" },
      { "<leader>rh", "<cmd>RustHoverActions<CR>", desc = "Rust hover actions" },
    },
    config = function()
      vim.g.rustaceanvim = {
        tools = {
          float_win_config = {
            border = "rounded",
          },
        },
        server = {
          default_settings = {
            ["rust-analyzer"] = {
              checkOnSave = true,
              inlayHints = {
                bindingModeHints = true,
                closingBraceHints = true,
                lifetimeElisionHints = "skip_trivial",
                parameterHints = true,
                reborrowHints = "strict",
                typeHints = true,
              },
            },
          },
        },
      }
    end,
  },

  {
    "saecki/crates.nvim",
    ft = { "toml" },
    dependencies = { "nvim-lua/plenary.nvim" },
    config = function()
      require("crates").setup({
        completion = {
          cmp = { enabled = true },
        },
      })
    end,
  },

  {
    "nvim-neotest/neotest",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "nvim-treesitter/nvim-treesitter",
      "fredrikaverpil/neotest-golang",
      "rouge8/neotest-rust",
    },
    keys = {
      { "<leader>tt", function() require("neotest").run.run(vim.fn.expand("%")) end, desc = "Run file tests" },
      { "<leader>tl", function() require("neotest").run.run() end, desc = "Run nearest test" },
      { "<leader>ts", function() require("neotest").summary.toggle() end, desc = "Test summary" },
      { "<leader>to", function() require("neotest").output.open() end, desc = "Test output" },
    },
    config = function()
      require("neotest").setup({
        adapters = {
          require("neotest-golang"),
          require("neotest-rust"),
        },
      })
    end,
  },

  {
    "mfussenegger/nvim-dap",
    dependencies = {
      "williamboman/mason.nvim",
      "jay-babu/mason-nvim-dap.nvim",
      "leoluz/nvim-dap-go",
    },
    keys = {
      { "<leader>db", function() require("dap").toggle_breakpoint() end, desc = "Toggle breakpoint" },
      { "<leader>dc", function() require("dap").continue() end, desc = "Continue" },
      { "<leader>do", function() require("dap").step_over() end, desc = "Step over" },
      { "<leader>di", function() require("dap").step_into() end, desc = "Step into" },
      { "<leader>dO", function() require("dap").step_out() end, desc = "Step out" },
      { "<leader>dr", function() require("dap").repl.toggle() end, desc = "Toggle REPL" },
    },
    config = function()
      require("mason-nvim-dap").setup({})
      require("dap-go").setup()
    end,
  },

  {
    "Civitasv/cmake-tools.nvim",
    ft = { "c", "cpp", "cmake" },
    dependencies = { "nvim-lua/plenary.nvim" },
    keys = {
      { "<leader>cb", "<cmd>CMakeBuild<CR>", desc = "CMake build" },
      { "<leader>cr", "<cmd>CMakeRun<CR>", desc = "CMake run" },
      { "<leader>cc", "<cmd>CMakeClean<CR>", desc = "CMake clean" },
      { "<leader>cs", "<cmd>CMakeSelectKit<CR>", desc = "CMake select kit" },
    },
    config = function()
      require("cmake-tools").setup({})
    end,
  },
}
