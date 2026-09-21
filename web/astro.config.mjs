import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// NOTA: @astrojs/sitemap se anade en la fase 2.8 (pulido/SEO, T2).
// El resto del plan usa Vanilla TS en modulos aislados, sin React/Vue.
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  // Puerto base 4321. `strictPort: false` deja que Vite suba al siguiente
  // puerto libre si se ejecuta `astro dev/preview` directamente.
  // `bun run dev/preview` usa ademas scripts/run-with-free-port.mjs, que
  // detecta el puerto ocupado antes de lanzar Astro y avisa en consola.
  server: {
    port: 4321,
    strictPort: false,
  },
  preview: {
    port: 4321,
    strictPort: false,
  },
});
