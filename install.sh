#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
NVIM_CONFIG_DIR="${HOME}/.config/nvim"
BACKUP_DIR="${HOME}/.config/nvim.backup.$(date +%Y%m%d%H%M%S)"

echo "========================================"
echo "  Neovim Config Installer (Lazy.nvim)"
echo "========================================"
echo ""

# Pre-flight checks
if ! command -v nvim &> /dev/null; then
    echo "ERROR: Neovim no está instalado."
    echo "Instálalo antes de continuar: https://github.com/neovim/neovim/blob/master/INSTALL.md"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "ERROR: git no está instalado."
    exit 1
fi

if ! command -v make &> /dev/null; then
    echo "WARNING: make no está instalado. Algunos plugins (telescope-fzf-native) pueden fallar al compilarse."
fi

echo "Repo:    ${REPO_DIR}"
echo "Destino: ${NVIM_CONFIG_DIR}"
echo ""

# Backup existing config
if [ -d "${NVIM_CONFIG_DIR}" ] || [ -L "${NVIM_CONFIG_DIR}" ]; then
    echo "Se encontró una configuración existente en ${NVIM_CONFIG_DIR}"
    echo "Creando backup en: ${BACKUP_DIR}"
    cp -RL "${NVIM_CONFIG_DIR}" "${BACKUP_DIR}"
    rm -rf "${NVIM_CONFIG_DIR}"
    echo "Backup listo."
fi

# Install mode selection
echo ""
echo "Elige método de instalación:"
echo "  1) Symlink (recomendado) - los cambios en el repo se reflejan inmediatamente en Neovim"
echo "  2) Copiar archivos - copia estática, independiente del repo"
echo ""
read -rp "Opción [1]: " choice
choice=${choice:-1}

if [ "$choice" = "2" ]; then
    echo "Copiando archivos..."
    cp -R "${REPO_DIR}/init.lua" "${NVIM_CONFIG_DIR}/init.lua"
    cp -R "${REPO_DIR}/lua" "${NVIM_CONFIG_DIR}/lua"
    cp -R "${REPO_DIR}/lazy-lock.json" "${NVIM_CONFIG_DIR}/lazy-lock.json"
    echo "Copia completada."
else
    echo "Creando symlink..."
    ln -s "${REPO_DIR}" "${NVIM_CONFIG_DIR}"
    echo "Symlink creado."
fi

echo ""
echo "========================================"
echo "  Instalación completada"
echo "========================================"
echo ""
echo "Primeros pasos:"
echo "  1. Abre Neovim:  nvim"
echo "  2. Lazy.nvim descargará e instalará los plugins automáticamente."
echo "  3. Espera a que termine la instalación y reinicia Neovim."
echo ""
echo "Si usas telescope-fzf-native, asegúrate de tener un compilador C (gcc/clang)."
echo ""
