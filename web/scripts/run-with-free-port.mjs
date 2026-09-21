#!/usr/bin/env bun
/**
 * run-with-free-port.mjs
 *
 * Detector de puerto para localhost:
 *  - Empieza en `PORT` (o 4321 por defecto, puerto de Astro).
 *  - Si esta ocupado, prueba con los siguientes hasta encontrar uno libre.
 *  - Lanza `astro dev` o `astro preview` en ese puerto.
 *
 * Uso:
 *   bun scripts/run-with-free-port.mjs dev [-- ...args extra de astro]
 *   bun scripts/run-with-free-port.mjs preview [-- ...args extra de astro]
 *   PORT=4321 bun scripts/run-with-free-port.mjs dev
 */

import net from "node:net";
import { spawn } from "node:child_process";

const DEFAULT_PORT = 4321;
const MAX_TRIES = 10;

function parsePreferredPort() {
  const raw = process.env.PORT?.trim();
  if (!raw) return DEFAULT_PORT;
  const n = Number.parseInt(raw, 10);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    console.error(`[port] PORT="${raw}" no es valido. Usa 1-65535.`);
    process.exit(1);
  }
  return n;
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err) => {
      // EADDRINUSE = ocupado, EACCES = sin permiso -> tratar como no usable
      resolve(false);
    });
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    // Escuchar sin host especifico detecta ocupacion en cualquier interfaz local.
    server.listen(port, "0.0.0.0");
  });
}

async function findFreePort(preferred) {
  for (let i = 0; i < MAX_TRIES; i++) {
    const candidate = preferred + i;
    if (candidate > 65535) break;
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(candidate)) return candidate;
  }
  return null;
}

async function main() {
  const [command, ...restArgs] = process.argv.slice(2);
  if (command !== "dev" && command !== "preview") {
    console.error("[port] Uso: bun scripts/run-with-free-port.mjs <dev|preview> [args extra...]");
    process.exit(1);
  }

  // `bun run dev -- --host` deja un "--" suelto: lo filtramos.
  const extraArgs = restArgs.filter((a) => a !== "--");
  const preferred = parsePreferredPort();
  const port = await findFreePort(preferred);

  if (port === null) {
    console.error(
      `[port] Todos los puertos ${preferred}-${preferred + MAX_TRIES - 1} estan ocupados. Libera uno o define PORT con otro valor.`,
    );
    process.exit(1);
  }

  if (port !== preferred) {
    console.log(`[port] Puerto ${preferred} ocupado, usando puerto libre ${port} -> http://localhost:${port}`);
  } else {
    console.log(`[port] Puerto ${preferred} libre -> http://localhost:${port}`);
  }

  // Lanzar Astro en el puerto elegido. process.execPath es el binario de bun,
  // asi funciona igual desde `bun run dev` en web/ o desde la raiz del repo.
  const child = spawn(
    process.execPath,
    ["x", "astro", command, "--port", String(port), ...extraArgs],
    { stdio: "inherit" },
  );

  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 0);
  });
  child.on("error", (err) => {
    console.error(`[port] No se pudo lanzar "astro ${command}":`, err.message);
    process.exit(1);
  });
}

await main();
