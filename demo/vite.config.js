import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import { execSync } from "child_process";

const getRootAlias = (name) => path.resolve(__dirname, `src/${name}`);

/**
 * Page Registration Check Plugin
 * Runs on dev server startup to warn about unregistered pages
 */
function pageRegistrationPlugin() {
  return {
    name: "page-registration-check",
    buildStart() {
      try {
        execSync("node scripts/check-page-registration.cjs --warn", {
          cwd: process.cwd(),
          stdio: "inherit",
        });
      } catch (e) {
        // Script outputs warning but doesn't block dev server
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@gravitate-js/excalibrr"],
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    minify: false,
    commonjsOptions: {
      include: [/@gravitate-js\/excalibrr/, /node_modules/],
    },
  },
  resolve: {
    alias: [
      { find: "@components", replacement: getRootAlias("components") },
      { find: "@pages", replacement: getRootAlias("pages") },
      { find: "@utils", replacement: getRootAlias("utils") },
      { find: "@api", replacement: getRootAlias("api") },
      { find: "@styles", replacement: getRootAlias("styles") },
      { find: "@assets", replacement: getRootAlias("assets") },
      { find: "@hooks", replacement: getRootAlias("hooks") },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  plugins: [
    pageRegistrationPlugin(),
    react(),
    tsconfigPaths(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
});





