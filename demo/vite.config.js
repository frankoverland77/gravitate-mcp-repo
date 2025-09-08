import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

const getRootAlias = (name) => path.resolve(__dirname, `src/${name}`);

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
    react(),
    tsconfigPaths(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
});





