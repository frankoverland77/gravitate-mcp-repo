// React project scaffolding orchestrator - imports from specialized modules

import {
  ReactProjectConfig,
  DependencyData,
  getDynamicDependencies,
} from "./types.js";
import {
  generatePackageJson,
  generateViteConfig,
  generateTsConfig,
  generateTsNodeConfig,
  generateEslintConfig,
} from "./buildConfigGenerators.js";
import {
  generateIndexHtml,
  generateManifestJson,
  generateRootIndexHtml,
  generateReadme,
} from "./staticFileGenerators.js";
import {
  generateIndexJs,
  generateAppTsx,
  generateStylesCss,
} from "./reactAppGenerators.js";
import {
  generateMockScopes,
  generateMockPageConfig,
  generateMockUserControlPanel,
} from "./mockDataGenerators.js";
import {
  generateThemeConfig,
  generateLightTheme,
  generateDarkTheme,
  generateCoreLess,
  generateLightThemeLess,
  generateDarkThemeLess,
  generateLightThemeJsx,
  generateDarkThemeJsx,
  generateThemeBaseLess,
  generateThemeBaseLightLess,
  generateThemeBaseDarkLess,
  generateDarkMapThemeJs,
} from "./themeGenerators.js";
import { generateComponentFiles } from "./reactComponentGenerators.js";

// Re-export the type for convenience
export type { ReactProjectConfig } from "./types.js";

export function generateReactProject(
  config: ReactProjectConfig,
  dependencyData?: DependencyData
) {
  const {
    featureName,
    componentName,
    columns,
    sampleData,
    uniqueIdField,
    displayTitle,
    storageKey,
    dataConstName,
    hookName,
    getDataFunctionName,
  } = config;

  // Use provided dependencies or defaults
  const projectDependencies = dependencyData || getDynamicDependencies();

  return [
    // Package.json
    {
      type: "text" as const,
      text: `📄 **package.json**\n\`\`\`json\n${generatePackageJson(
        featureName,
        projectDependencies
      )}\n\`\`\``,
    },

    // Public/index.html
    {
      type: "text" as const,
      text: `📄 **public/index.html**\n\`\`\`html\n${generateIndexHtml(
        featureName
      )}\n\`\`\``,
    },

    // CRITICAL FIX: Add manifest.json
    {
      type: "text" as const,
      text: `📄 **public/manifest.json**\n\`\`\`json\n${generateManifestJson()}\n\`\`\``,
    },

    // Root index.html for Vite
    {
      type: "text" as const,
      text: `📄 **index.html**\n\`\`\`html\n${generateRootIndexHtml()}\n\`\`\``,
    },

    // Src/index.tsx (changed from .js to .tsx for consistency)
    {
      type: "text" as const,
      text: `📄 **src/index.tsx**\n\`\`\`typescript\n${generateIndexJs()}\n\`\`\``,
    },

    // App.tsx - FIXED TO MATCH WORKING EXAMPLE
    {
      type: "text" as const,
      text: `📄 **src/App.tsx**\n\`\`\`typescript\n${generateAppTsx(
        featureName,
        componentName
      )}\n\`\`\``,
    },

    // Mock scopes
    {
      type: "text" as const,
      text: `📄 **src/mocks/mockScopes.ts**\n\`\`\`typescript\n${generateMockScopes(
        featureName
      )}\n\`\`\``,
    },

    // Mock page config - FIXED WITH PROPER ICONS
    {
      type: "text" as const,
      text: `📄 **src/mocks/mockPageConfig.tsx**\n\`\`\`typescript\n${generateMockPageConfig(
        featureName,
        componentName
      )}\n\`\`\``,
    },

    // Mock user control panel - FIXED TO USE HORIZONTAL/VERTICAL
    {
      type: "text" as const,
      text: `📄 **src/mocks/MockUserControlPanel.tsx**\n\`\`\`typescript\n${generateMockUserControlPanel()}\n\`\`\``,
    },

    // Theme config - UPDATED TO MATCH WORKING EXAMPLE
    {
      type: "text" as const,
      text: `📄 **src/components/themeConfig.ts**\n\`\`\`typescript\n${generateThemeConfig()}\n\`\`\``,
    },

    // Theme Components - NEW
    {
      type: "text" as const,
      text: `📄 **src/components/ThemeComponents/LightTheme.tsx**\n\`\`\`typescript\n${generateLightTheme()}\n\`\`\``,
    },

    {
      type: "text" as const,
      text: `📄 **src/components/ThemeComponents/DarkTheme.tsx**\n\`\`\`typescript\n${generateDarkTheme()}\n\`\`\``,
    },

    // Theming folder structure - NEW
    {
      type: "text" as const,
      text: `📄 **src/Theming/core.less**\n\`\`\`less\n${generateCoreLess()}\n\`\`\``,
    },

    // Theme Base files - CRITICAL FIX: Add the missing theme base files
    {
      type: "text" as const,
      text: `📄 **src/Theming/ThemeBase/base.less**\n\`\`\`less\n${generateThemeBaseLess()}\n\`\`\``,
    },

    {
      type: "text" as const,
      text: `📄 **src/Theming/ThemeBase/light.less**\n\`\`\`less\n${generateThemeBaseLightLess()}\n\`\`\``,
    },

    {
      type: "text" as const,
      text: `📄 **src/Theming/ThemeBase/dark.less**\n\`\`\`less\n${generateThemeBaseDarkLess()}\n\`\`\``,
    },

    {
      type: "text" as const,
      text: `📄 **src/Theming/ThemeBase/darkMapTheme.js**\n\`\`\`javascript\n${generateDarkMapThemeJs()}\n\`\`\``,
    },

    {
      type: "text" as const,
      text: `📄 **src/Theming/Themes/Light/light-theme.less**\n\`\`\`less\n${generateLightThemeLess()}\n\`\`\``,
    },

    {
      type: "text" as const,
      text: `📄 **src/Theming/Themes/Light/Light.jsx**\n\`\`\`jsx\n${generateLightThemeJsx()}\n\`\`\``,
    },

    {
      type: "text" as const,
      text: `📄 **src/Theming/Themes/Dark/dark-theme.less**\n\`\`\`less\n${generateDarkThemeLess()}\n\`\`\``,
    },

    {
      type: "text" as const,
      text: `📄 **src/Theming/Themes/Dark/Dark.jsx**\n\`\`\`jsx\n${generateDarkThemeJsx()}\n\`\`\``,
    },

    // Vite config
    {
      type: "text" as const,
      text: `📄 **vite.config.ts**\n\`\`\`typescript\n${generateViteConfig()}\n\`\`\``,
    },

    // TypeScript config
    {
      type: "text" as const,
      text: `📄 **tsconfig.json**\n\`\`\`json\n${generateTsConfig()}\n\`\`\``,
    },

    // TypeScript Node config (for Vite)
    {
      type: "text" as const,
      text: `📄 **tsconfig.node.json**\n\`\`\`json\n${generateTsNodeConfig()}\n\`\`\``,
    },

    // ESLint config
    {
      type: "text" as const,
      text: `📄 **eslint.config.js**\n\`\`\`javascript\n${generateEslintConfig()}\n\`\`\``,
    },

    // Component files - FIXED
    ...generateComponentFiles(config),

    // README
    {
      type: "text" as const,
      text: `📄 **README.md**\n\`\`\`markdown\n${generateReadme(
        featureName,
        componentName
      )}\n\`\`\``,
    },

    // Styles.css
    {
      type: "text" as const,
      text: `📄 **src/styles.css**\n\`\`\`css\n${generateStylesCss()}\n\`\`\``,
    },

    // FIX: Add assets directory structure
    {
      type: "text" as const,
      text: `📄 **src/assets/SiteImages/.gitkeep**\n\`\`\`\n# Placeholder for site images\n\`\`\``,
    },
    {
      type: "text" as const,
      text: `📄 **src/assets/fonts/.gitkeep**\n\`\`\`\n# Placeholder for custom fonts\n\`\`\``,
    },
  ];
}
