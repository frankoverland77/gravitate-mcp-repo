// Code generation helper functions - now using modular structure
// This file serves as the main entry point but delegates to specialized modules

// Re-export everything from the generators modules
export {
  // Grid-specific generators
  generateGraviGridCode,
  generateGridFiles,
  generateMainComponent,
  generateColumnDefs,
  generateDummyData,
  generateApiHook,
  generateTypes,
  generateRowInterface,
  type GridConfig,

  // Generic component generators
  generateLayoutCode,
  generateFormCode,
  generateGenericCode,

  // React project scaffolding
  generateReactProject,
  type ReactProjectConfig,

  // Re-export everything for backwards compatibility
  getDynamicDependencies,
  generatePackageJson,
  generateViteConfig,
  generateTsConfig,
  generateTsNodeConfig,
  generateEslintConfig,
  generateIndexHtml,
  generateManifestJson,
  generateRootIndexHtml,
  generateReadme,
  generateIndexJs,
  generateAppTsx,
  generateStylesCss,
  generateMockScopes,
  generateMockPageConfig,
  generateMockUserControlPanel,
  generateThemeConfig,
  generateLightTheme,
  generateDarkTheme,
  generateCoreLess,
  generateLightThemeLess,
  generateDarkThemeLess,
  generateLightThemeJsx,
  generateDarkThemeJsx,
  generateComponentFiles,
} from "./generators/index.js";

// Re-export types for convenience
export type { ComponentInfo, UseCase } from "./types.js";
