// Build and development configuration file generators

import { DependencyData } from "./types.js";

export function generatePackageJson(
  featureName: string,
  dependencyData: DependencyData
) {
  const packageJson = {
    name: `${featureName.toLowerCase()}-demo`,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
      start: "vite",
      "build:tsc": "tsc",
      lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "lint:fix": "eslint . --ext ts,tsx --fix",
    },
    dependencies: {
      ...dependencyData.dependencies,
    },
    devDependencies: {
      ...dependencyData.devDependencies,
    },
    // Yarn resolutions for dependency conflicts (based on working LemonadeCompetitors)
    resolutions: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "@nivo/core": "^0.79.0",
      "@nivo/bar": "^0.79.1",
      "@nivo/line": "^0.79.0",
      "@nivo/tooltip": "^0.79.0",
      "react-virtualized":
        "git+https://git@github.com/remorses/react-virtualized-fixed-import.git#9.22.3",
      ...dependencyData.resolutions,
    },
    // Package manager configuration
    packageManager: "yarn@1.22.19",
    engines: {
      node: ">=16.0.0",
      yarn: ">=1.22.0",
    },
    browserslist: {
      production: [">0.2%", "not dead", "not op_mini all"],
      development: [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version",
      ],
    },
  };

  return JSON.stringify(packageJson, null, 2);
}

export function generateViteConfig() {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import path from "path";

const getRootAlias = (name) => path.resolve(__dirname, \`src/\${name}\`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  define: {
    __APP_VERSION__: JSON.stringify(1),
    "process.env": {},
  },
  resolve: {
    alias: [
      { find: '@assets', replacement: getRootAlias('assets') },
      { find: '@Theming', replacement: getRootAlias('Theming') },
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
    port: 3001,
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@gravitate-js/excalibrr",
      "ag-grid-community",
      "ag-grid-react",
    ],
  },
});`;
}

export function generateTsConfig() {
  const tsConfig = {
    compilerOptions: {
      /* Visit https://aka.ms/tsconfig to read more about this file */

      /* Language and Environment */
      target: "ESNext",
      jsx: "react-jsx",

      /* Modules */
      module: "ESNext",
      moduleResolution: "node",
      baseUrl: ".",
      paths: {
        "@api/*": ["./src/api/*"],
        "@assets/*": ["./src/assets/*"],
        "@components/*": ["./src/components/*"],
        "@constants/*": ["./src/constants/*"],
        "@utils/*": ["./src/utils/*"],
        "@pages/*": ["./src/pages/*"],
        "@contexts/*": ["./src/contexts/*"],
        "@modules/*": ["./src/modules/*"],
        "@hooks/*": ["./src/hooks/*"],
      },
      types: ["vite/client"],

      /* Interop Constraints */
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,

      /* Type Checking */
      strict: true,
      noImplicitAny: false,

      /* Completeness */
      skipLibCheck: true,
    },
  };

  return JSON.stringify(tsConfig, null, 2);
}

export function generateTsNodeConfig() {
  const tsNodeConfig = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: "ESNext",
      moduleResolution: "bundler",
      allowSyntheticDefaultImports: true,
    },
    include: ["vite.config.ts"],
  };

  return JSON.stringify(tsNodeConfig, null, 2);
}

export function generateEslintConfig() {
  return `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    },
  },
)`;
}
