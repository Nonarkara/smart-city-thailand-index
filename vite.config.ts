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
            if (!id.includes("node_modules")) return;
            // d3-geo / topojson-client / world-atlas are imported only by
            // GlobeMap, which is lazy and only reachable from /partners.
            // Left in `vendor` they taxed every first paint — including the
            // phone opening a shared /city/ link — with ~90 kB of map data
            // nobody on that page renders.
            if (/node_modules\/(?:\.pnpm\/)?(?:@types\+)?(?:d3-geo|topojson-client|topojson-specification|world-atlas)/.test(id)) {
              return "globe";
            }
            return "vendor";
          },
        },
      },
    },
  };
});
