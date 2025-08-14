// Central exports for all code generation functions
// This provides a clean API for consumers of the generator functions

// Grid-specific generators
export {
  generateGraviGridCode,
  generateGridFiles,
  generateMainComponent,
  generateColumnDefs,
  generateDummyData,
  generateApiHook,
  generateTypes,
  generateRowInterface,
  type GridConfig,
} from "./gridGenerators.js";

// Generic component generators
export {
  generateLayoutCode,
  generateFormCode,
  generateGenericCode,
} from "./componentGenerators.js";

// React project scaffolding
export {
  generateReactProject,
  type ReactProjectConfig,
} from "./reactProjectGenerator.js";

// Re-export everything for backwards compatibility
export { getDynamicDependencies } from "./types.js";
export {
  generatePackageJson,
  generateViteConfig,
  generateTsConfig,
  generateTsNodeConfig,
  generateEslintConfig,
} from "./buildConfigGenerators.js";
export {
  generateIndexHtml,
  generateManifestJson,
  generateRootIndexHtml,
  generateReadme,
} from "./staticFileGenerators.js";
export {
  generateIndexJs,
  generateAppTsx,
  generateStylesCss,
} from "./reactAppGenerators.js";
export {
  generateMockScopes,
  generateMockPageConfig,
  generateMockUserControlPanel,
} from "./mockDataGenerators.js";
export {
  generateThemeConfig,
  generateLightTheme,
  generateDarkTheme,
  generateCoreLess,
  generateLightThemeLess,
  generateDarkThemeLess,
  generateLightThemeJsx,
  generateDarkThemeJsx,
} from "./themeGenerators.js";
export { generateComponentFiles } from "./reactComponentGenerators.js";
export {
  generateServerManagementREADME,
  generateServerCheckScript,
} from "./serverManagementGuide.js";

// Re-export types for convenience
export type { ComponentInfo, UseCase } from "../types.js";
