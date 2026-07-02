import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.VITE_BASE_PATH || "/",
    plugins: [react()],
    build: {
      // Emit hashed bundles under /static/ (not the default /assets/). A prior
      // deploy poisoned some /assets/<hash>.js URLs with the SPA HTML fallback
      // cached as immutable; moving to a fresh namespace orphans those dead
      // entries so production references only clean URLs.
      assetsDir: "static",
      rollupOptions: {
        output: {
          // Function form so react-dom's deep production module lands in
          // vendor too — the array form only caught the package entry files,
          // leaving ~500 kB of react-dom inside the content-hashed index
          // chunk, so every content deploy re-downloaded React itself.
          manualChunks(id) {
            if (id.includes("node_modules")) return "vendor";
          },
        },
      },
    },
  };
});
