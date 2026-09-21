// Descripciones en español de los 102 keymaps (complemento de keymaps.ts).
// El inglés de keymaps.ts sigue siendo la transcripción literal verificada
// contra Lua (regla de oro del plan); este archivo solo añade la capa ES.
// Clave: path del leader ("<Space>w") o path|modos para globales ("jj|i").

export const ES_DESCRIPTIONS: Record<string, string> = {
  // ── Generales (leader) ──
  "<Space>w": "Guardar el archivo actual",
  "<Space>q": "Salir de la ventana actual",
  "<Space>h": "Limpiar el resaltado de la última búsqueda",
  "<Space>v": "Dividir la ventana en vertical",
  "<Space>s": "Dividir la ventana en horizontal",
  // ── Buffers ──
  "<Space>b": "Mostrar el menú de atajos (which-key)",
  "<Space>bn": "Ir al siguiente búfer abierto",
  "<Space>bp": "Ir al búfer abierto anterior",
  "<Space>bc": "Cerrar el búfer actual",
  // ── CMake / código ──
  "<Space>cb": "Compilar el proyecto con CMake",
  "<Space>cr": "Ejecutar el proyecto con CMake",
  "<Space>cc": "Limpiar los artefactos de compilación de CMake",
  "<Space>cs": "Elegir el kit o compilador de CMake",
  "<Space>ca": "Mostrar las acciones de código del LSP",
  "<Space>ch": "Alternar entre cabecera y fuente en C/C++ (clangd)",
  // ── Debug ──
  "<Space>db": "Poner o quitar un punto de interrupción",
  "<Space>dc": "Continuar la ejecución del depurador",
  "<Space>do": "Avanzar una línea sin entrar en funciones",
  "<Space>di": "Entrar dentro de la función actual",
  "<Space>dO": "Salir de la función actual",
  "<Space>dr": "Abrir o cerrar la consola del depurador",
  // ── NvimTree ──
  "<Space>e": "Mostrar u ocultar el explorador de archivos",
  "<Space>pv": "Localizar el archivo actual dentro del árbol",
  // ── Telescope ──
  "<Space>ff": "Buscar archivos por nombre",
  "<Space>fg": "Buscar texto dentro de todos los archivos",
  "<Space>fb": "Ver la lista de búferes abiertos",
  "<Space>fh": "Buscar en la ayuda de Neovim",
  "<Space>fr": "Abrir archivos usados recientemente",
  "<Space>fd": "Ver los diagnósticos del proyecto",
  "<Space>fs": "Ver los símbolos del archivo actual",
  "<Space>fw": "Buscar la palabra que está bajo el cursor",
  "<Space>fc": "Cambiar el tema de colores del editor",
  // ── Go ──
  "<Space>gb": "Compilar el paquete Go actual",
  "<Space>gt": "Ejecutar las pruebas de Go",
  "<Space>gai": "Abrir el comando de IA para Go",
  "<Space>gca": "Generar un comentario con IA",
  "<Space>gcr": "Pedir una revisión de código con IA",
  "<Space>gii": "Instalar las herramientas binarias de Go",
  // ── OpenCode ──
  "<Space>og": "Mostrar u ocultar el panel de OpenCode",
  "<Space>oi": "Abrir el panel de entrada de OpenCode",
  "<Space>oo": "Abrir el panel de salida de OpenCode",
  "<Space>oq": "Cerrar OpenCode",
  "<Space>ot": "Cambiar el foco entre entrada y salida",
  "<Space>os": "Elegir una sesión de OpenCode",
  "<Space>oR": "Renombrar la sesión actual",
  "<Space>op": "Cambiar el proveedor o modelo de IA",
  "<Space>oV": "Cambiar la variante del modelo",
  "<Space>od": "Abrir la vista de diferencias",
  "<Space>o]": "Ir a la siguiente diferencia",
  "<Space>o[": "Ir a la diferencia anterior",
  "<Space>oc": "Cerrar la vista de diferencias",
  "<Space>ora": "Revertir todos los cambios (pide confirmación)",
  "<Space>ort": "Revertir el cambio actual (pide confirmación)",
  "<Space>ob": "Poner al agente en modo construcción",
  "<Space>ol": "Poner al agente en modo planificación",
  "<Space>o/": "Abrir un chat rápido con el texto seleccionado",
  "<Space>oT": "Ver la línea de tiempo de la sesión",
  "<Space>ox": "Intercambiar la posición de los paneles",
  "<Space>oC": "Cancelar la operación de OpenCode en curso",
  // ── Rust ──
  "<Space>rr": "Ejecutar el proyecto Rust",
  "<Space>rt": "Ejecutar las pruebas de Rust",
  "<Space>rd": "Ver los objetivos depurables de Rust",
  "<Space>re": "Expandir la macro que está bajo el cursor",
  "<Space>rh": "Ver acciones rápidas del código Rust",
  // ── LSP (leader) ──
  "<Space>rn": "Renombrar el símbolo que está bajo el cursor",
  "<Space>vd": "Mostrar el diagnóstico en una ventana flotante",
  // ── Tests ──
  "<Space>tt": "Ejecutar las pruebas del archivo actual",
  "<Space>tl": "Ejecutar la prueba más cercana al cursor",
  "<Space>ts": "Mostrar u ocultar el resumen de pruebas",
  "<Space>to": "Abrir la salida de la última prueba",
  // ── Terminal (leader) ──
  "<Space>T": "Mostrar u ocultar la terminal integrada",

  // ── Globales: generales ──
  "jj|i": "Salir del modo inserción (equivale a Esc)",
  "<C-h>|n": "Mover el foco a la ventana de la izquierda",
  "<C-j>|n": "Mover el foco a la ventana de abajo",
  "<C-k>|n": "Mover el foco a la ventana de arriba",
  "<C-l>|n": "Mover el foco a la ventana de la derecha",
  // ── Globales: terminal ──
  "<A-Right>|t": "Ir a la pestaña siguiente",
  "<A-Left>|t": "Ir a la pestaña anterior",
  "<C-[>|t": "Volver al modo normal dentro de la terminal",
  "jj|t": "Volver al modo normal dentro de la terminal",
  "<C-h>|t": "Mover el foco a la izquierda desde la terminal",
  "<C-j>|t": "Mover el foco abajo desde la terminal",
  "<C-k>|t": "Mover el foco arriba desde la terminal",
  "<C-l>|t": "Mover el foco a la derecha desde la terminal",
  "<A-q>|t": "Ocultar la terminal",
  "<A-q>|n": "Mostrar u ocultar la terminal",
  "<A-j>|n": "Mostrar u ocultar el panel de errores (quickfix)",
  // ── Globales: Telescope ──
  "<C-j>|i": "Bajar la selección en Telescope",
  "<C-k>|i": "Subir la selección en Telescope",
  "<C-q>|i": "Enviar la selección a la lista de errores",
  "<Esc>|i": "Cerrar Telescope",
  "q|n": "Cerrar Telescope",
  // ── Globales: LSP ──
  "gd": "Ir a la definición del símbolo",
  "gr": "Mostrar dónde se usa el símbolo",
  "gi": "Ir a la implementación del símbolo",
  "K": "Mostrar la documentación del símbolo",
  "[d": "Ir al diagnóstico anterior",
  "]d": "Ir al diagnóstico siguiente",
  // ── Globales: autocompletado ──
  "<Tab>|i": "Elegir la siguiente sugerencia",
  "<S-Tab>|i": "Elegir la sugerencia anterior",
  "<CR>|i": "Confirmar la sugerencia elegida",
  "<C-Space>|i": "Forzar que aparezcan sugerencias",
};
