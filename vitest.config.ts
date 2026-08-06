import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    testTimeout: 15000,
    // .worktrees/ holds checked-out git worktrees of other branches. Without
    // this, vitest collects their copies of every spec too — the suite silently
    // doubles and the CDPT ship gate ends up validating stale branch code
    // alongside the real tree. Only ever test this working tree.
    exclude: ["**/node_modules/**", "**/dist/**", "**/.worktrees/**"],
  },
});
