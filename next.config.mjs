import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Next.js detectaba un package-lock.json suelto en ~ y elegía mal la raíz del workspace.
    root: path.dirname(fileURLToPath(import.meta.url))
  }
};

export default nextConfig;
