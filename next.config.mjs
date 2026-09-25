import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Next.js detectaba un package-lock.json suelto en ~ y elegía mal la raíz del workspace.
    root: path.dirname(fileURLToPath(import.meta.url))
  },
  // Sin esto, el servidor dev bloquea los chunks de JS para 127.0.0.1/localhost
  // y la página se queda sin hidratar (los botones y el avatar no responden).
  allowedDevOrigins: ["127.0.0.1", "localhost"]
};

export default nextConfig;
