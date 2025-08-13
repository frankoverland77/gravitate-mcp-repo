// Enhanced theme system with proper font integration
// Now includes Lato font loading and typography settings

import * as fs from "fs/promises";
import * as path from "path";

export interface GravitateTheme {
  key: string;
  display: string;
  colors: {
    primary: string[];
    background: string[];
    text: string[];
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  assets: {
    logo?: string;
    loginBanner?: string;
    poweredBy?: string;
  };
  fonts: {
    primary: string;
    fontFiles: FontFile[];
    fontCSS: string;
  };
  isDark: boolean;
  cssVariables: Record<string, string>;
}

export interface FontFile {
  name: string;
  path: string;
  weight: string;
  style: string;
}

export interface ThemeAssets {
  logos: Record<string, string>;
  backgrounds: Record<string, string>;
  poweredBy: Record<string, string>;
  fonts: FontFile[];
}

const GRAVITATE_FRONTEND_PATH =
  "/Users/rebecca.hirai/repos/Gravitate.Dotnet.Next/frontend/src";
const ASSETS_PATH = path.join(GRAVITATE_FRONTEND_PATH, "assets");
const THEMES_PATH = path.join(
  GRAVITATE_FRONTEND_PATH,
  "components/shared/Theming"
);
const FONTS_PATH = path.join(ASSETS_PATH, "fonts");

/**
 * Load Lato font files and generate font-face CSS
 */
async function loadFontSystem(): Promise<{
  fonts: FontFile[];
  fontCSS: string;
}> {
  const fonts: FontFile[] = [];

  // Define Lato font variants based on your core.less
  const fontVariants = [
    { file: "Lato-Regular.ttf", weight: "normal", style: "normal" },
    { file: "Lato-Italic.ttf", weight: "normal", style: "italic" },
    { file: "Lato-Bold.ttf", weight: "600", style: "normal" },
    { file: "Lato-Bold.ttf", weight: "bold", style: "normal" },
    { file: "Lato-BoldItalic.ttf", weight: "bold", style: "italic" },
    { file: "Lato-Light.ttf", weight: "300", style: "normal" },
    { file: "Lato-Black.ttf", weight: "900", style: "normal" },
  ];

  // Create font file entries
  for (const variant of fontVariants) {
    const fontPath = path.join(FONTS_PATH, variant.file);
    try {
      await fs.access(fontPath);
      fonts.push({
        name: variant.file,
        path: fontPath,
        weight: variant.weight,
        style: variant.style,
      });
    } catch (error) {
      console.warn(`Font file not found: ${variant.file}`);
    }
  }

  // Generate @font-face CSS using Google Fonts CDN for reliability
  const fontCSS = `/* Lato Font Family - Loaded from Google Fonts CDN */
@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXiWtFCc.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u8w4BMUTPHjxsAXC-qNiXg7Q.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u_w4BMUTPHjxsI5wq_FQftx9897sxZ.woff2') format('woff2');
  font-weight: 600;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u8w4BMUTPHjx4wUiWfFQftx9897g.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh50XSwiPGQ3q5d0.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* Global Font Application */
body {
  font-family: 'Lato', sans-serif !important;
}

/* Typography Hierarchy */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Lato', sans-serif !important;
}

/* Component Font Styling */
.ant-typography {
  font-family: 'Lato', sans-serif !important;
}

/* ag-Grid Font Integration with comprehensive coverage */
.ag-theme-alpine,
.ag-theme-alpine-dark,
.ag-theme-material,
.ag-theme-balham {
  font-family: 'Lato', sans-serif !important;
  --ag-font-family: 'Lato', sans-serif !important;
  --ag-font-size: 12px !important;
  --ag-header-font-family: 'Lato', sans-serif !important;
  --ag-header-font-size: 12px !important;
  --ag-header-font-weight: 600 !important;
}

.ag-header-cell,
.ag-header-group-cell {
  font-family: 'Lato', sans-serif !important;
}

.ag-header-cell-label,
.ag-header-cell-text {
  font-family: 'Lato', sans-serif !important;
  text-transform: uppercase !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  letter-spacing: 0.5px !important;
}

.ag-cell {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
  font-weight: 400 !important;
}

.ag-cell-value,
.ag-group-value {
  font-family: 'Lato', sans-serif !important;
}

/* Force inheritance for all ag-Grid child elements */
.ag-root-wrapper,
.ag-root-wrapper * {
  font-family: inherit !important;
}

/* Navigation Font Styling */
.horizontal-nav,
.vertical-nav,
.page-wrapper {
  font-family: 'Lato', sans-serif !important;
}

/* Form Controls Font Styling */
.ant-input,
.ant-select,
.ant-button {
  font-family: 'Lato', sans-serif !important;
}

/* GraviGrid specific overrides */
.gravi-grid-container {
  font-family: 'Lato', sans-serif !important;
}

.gravi-grid-container .ag-root-wrapper {
  font-family: 'Lato', sans-serif !important;
}`;

  return { fonts, fontCSS };
}

/**
 * Parse LESS/CSS theme files to extract color variables
 */
async function parseThemeColors(
  themePath: string
): Promise<Record<string, string>> {
  try {
    const themeContent = await fs.readFile(themePath, "utf-8");
    const colors: Record<string, string> = {};

    // Extract LESS variables like @theme-color-1: #0F1121;
    const variableMatches = themeContent.matchAll(/@([^:]+):\s*([^;]+);/g);
    for (const match of variableMatches) {
      const [, varName, value] = match;
      if (varName && value) {
        colors[varName.trim()] = value.trim();
      }
    }

    // Extract CSS custom properties like --theme-color-1: #0F1121;
    const cssVarMatches = themeContent.matchAll(/--([^:]+):\s*([^;]+);/g);
    for (const match of cssVarMatches) {
      const [, varName, value] = match;
      if (varName && value) {
        colors[varName.trim()] = value.trim();
      }
    }

    return colors;
  } catch (error) {
    console.error(`Error parsing theme colors from ${themePath}:`, error);
    return {};
  }
}

/**
 * Load all theme assets (logos, backgrounds, fonts)
 */
async function loadThemeAssets(): Promise<ThemeAssets> {
  const assets: ThemeAssets = {
    logos: {},
    backgrounds: {},
    poweredBy: {},
    fonts: [],
  };

  try {
    // Load fonts
    const { fonts } = await loadFontSystem();
    assets.fonts = fonts;

    // Load OSP assets
    assets.logos.OSP = path.join(ASSETS_PATH, "osp/logos/osp-logo-light.png");
    assets.backgrounds.OSP = path.join(
      ASSETS_PATH,
      "osp/logos/osp-auth-background.jpg"
    );

    // Load PE assets
    assets.logos.PE = path.join(ASSETS_PATH, "SiteImages/grav-logo.svg");
    assets.poweredBy.PE = path.join(
      ASSETS_PATH,
      "SiteImages/PoweredByLogos/PoweredByPE.png"
    );

    // Load BP assets
    assets.logos.BP = path.join(ASSETS_PATH, "bp/logos/bp-logo-light.png");
    assets.backgrounds.BP = path.join(
      ASSETS_PATH,
      "bp/logos/bp-auth-background.png"
    );
    assets.poweredBy.BP = path.join(
      ASSETS_PATH,
      "SiteImages/PoweredByLogos/PoweredByOSP.png"
    );

    // Load other client themes
    const clients = [
      "DKB",
      "FHR",
      "MURPHY",
      "GROWMARK",
      "MOTIVA",
      "P66",
      "SUNOCO",
    ];

    for (const client of clients) {
      const clientLower = client.toLowerCase();
      try {
        // Try to find logo
        const logoPath = path.join(
          ASSETS_PATH,
          `${clientLower}/logos/${clientLower}-logo-dark.png`
        );
        if (
          await fs
            .access(logoPath)
            .then(() => true)
            .catch(() => false)
        ) {
          assets.logos[client] = logoPath;
        }

        // Try to find background
        const bgPath = path.join(
          ASSETS_PATH,
          `${clientLower}/${clientLower}-auth-background.png`
        );
        if (
          await fs
            .access(bgPath)
            .then(() => true)
            .catch(() => false)
        ) {
          assets.backgrounds[client] = bgPath;
        }

        assets.poweredBy[client] = path.join(
          ASSETS_PATH,
          "SiteImages/PoweredByLogos/PoweredByOSP.png"
        );
      } catch (error) {
        console.warn(`Could not load assets for ${client}`);
      }
    }

    // Load seasonal themes
    assets.backgrounds.CHRISTMAS = path.join(
      ASSETS_PATH,
      "SiteImages/Themes/Christmas/christmas-tree.jpg"
    );
  } catch (error) {
    console.error("Error loading theme assets:", error);
  }

  return assets;
}

/**
 * Load and parse all Gravitate themes with font integration
 */
export async function loadGravitateThemes(): Promise<
  Record<string, GravitateTheme>
> {
  const themes: Record<string, GravitateTheme> = {};
  const assets = await loadThemeAssets();
  const { fontCSS } = await loadFontSystem();

  // Theme configurations based on your themeconfigs.ts
  const themeConfigs = [
    {
      key: "OSP",
      display: "OSP",
      isDark: false,
      themeFile: "OSP/osp-theme.less",
    },
    {
      key: "PE",
      display: "PE",
      isDark: false,
      themeFile: "PE/light-theme.less",
    },
    { key: "BP", display: "BP", isDark: false, themeFile: "BP/bp-theme.less" },
    {
      key: "DKB",
      display: "DKB",
      isDark: false,
      themeFile: "DKB/dkb-theme.less",
    },
    {
      key: "FHR",
      display: "FHR",
      isDark: false,
      themeFile: "FHR/fhr-theme.less",
    },
    {
      key: "MURPHY",
      display: "Murphy",
      isDark: false,
      themeFile: "Murphy/murphy-theme.less",
    },
    {
      key: "GROWMARK",
      display: "Growmark",
      isDark: false,
      themeFile: "Growmark/growmark-theme.less",
    },
    {
      key: "MOTIVA",
      display: "Motiva",
      isDark: false,
      themeFile: "Motiva/motiva-theme.less",
    },
    {
      key: "P66",
      display: "P66",
      isDark: false,
      themeFile: "P66/p66-theme.less",
    },
    {
      key: "SUNOCO",
      display: "Sunoco",
      isDark: false,
      themeFile: "Sunoco/sunoco-theme.less",
    },
    {
      key: "LIGHT_MODE",
      display: "Light",
      isDark: false,
      themeFile: "Light/light-theme.less",
    },
    {
      key: "DARK_MODE",
      display: "Dark",
      isDark: true,
      themeFile: "Dark/dark-theme.less",
    },
    {
      key: "CHRISTMAS",
      display: "Christmas",
      isDark: false,
      themeFile: "Christmas/christmas-theme.less",
    },
    {
      key: "THANKSGIVING",
      display: "Thanksgiving",
      isDark: false,
      themeFile: "Thanksgiving/thanksgiving-theme.less",
    },
  ];

  for (const config of themeConfigs) {
    try {
      const themePath = path.join(THEMES_PATH, "Themes", config.themeFile);
      const rawColors = await parseThemeColors(themePath);

      // Convert raw colors to structured format
      const colors = {
        primary: [
          rawColors["theme-color-1"] || "#0F1121",
          rawColors["theme-color-2"] || "#4BADE9",
          rawColors["theme-color-3"] || "#466185",
          rawColors["theme-color-4"] || "#F1AF0F",
        ],
        background: [
          rawColors["bg-1"] || "#ffffff",
          rawColors["bg-2"] || "#F8F9FA",
          rawColors["bg-3"] || "#EEF0F8",
        ],
        text: [
          rawColors["text-color"] || (config.isDark ? "#ffffff" : "#000000"),
          rawColors["text-color-secondary"] ||
            (config.isDark ? "#cccccc" : "#666666"),
        ],
        success: rawColors["theme-success"] || "#64D28D",
        error: rawColors["theme-error"] || "#E42A11",
        warning: rawColors["theme-warning"] || "#FF9900",
        info: rawColors["theme-info"] || "#74CDD7",
      };

      // Create CSS variables for the theme
      const cssVariables: Record<string, string> = {};
      Object.entries(rawColors).forEach(([key, value]) => {
        cssVariables[`--${key}`] = value;
      });

      themes[config.key] = {
        key: config.key,
        display: config.display,
        colors,
        assets: {
          logo: assets.logos[config.key],
          loginBanner: assets.backgrounds[config.key],
          poweredBy: assets.poweredBy[config.key],
        },
        fonts: {
          primary: "Lato",
          fontFiles: assets.fonts,
          fontCSS,
        },
        isDark: config.isDark,
        cssVariables,
      };
    } catch (error) {
      console.error(`Error loading theme ${config.key}:`, error);
    }
  }

  return themes;
}

/**
 * Generate CSS for a specific theme with proper font integration
 */
export function generateThemeCSS(theme: GravitateTheme): string {
  const cssVars = Object.entries(theme.cssVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `${theme.fonts.fontCSS}

/* Theme-specific CSS Variables */
:root[data-theme="${theme.key}"] {
${cssVars}
  
  /* Typography Settings */
  --font-family-primary: '${theme.fonts.primary}', sans-serif;
  --font-size-base: 12px;
}

.theme-${theme.key.toLowerCase()} {
  /* Font Application */
  font-family: '${theme.fonts.primary}', sans-serif;
  font-size: 12px;
  
  /* Background colors */
  --bg-primary: ${theme.colors.background[0]};
  --bg-secondary: ${theme.colors.background[1]};
  --bg-tertiary: ${theme.colors.background[2]};
  
  /* Primary colors */
  --color-primary: ${theme.colors.primary[0]};
  --color-secondary: ${theme.colors.primary[1]};
  --color-accent: ${theme.colors.primary[2]};
  --color-highlight: ${theme.colors.primary[3]};
  
  /* Text colors */
  --text-primary: ${theme.colors.text[0]};
  --text-secondary: ${theme.colors.text[1]};
  
  /* Status colors */
  --color-success: ${theme.colors.success};
  --color-error: ${theme.colors.error};
  --color-warning: ${theme.colors.warning};
  --color-info: ${theme.colors.info};
}

/* Navigation specific styles for ${theme.display} theme */
.theme-${theme.key.toLowerCase()} .horizontal-nav {
  background: var(--color-primary);
  border-bottom: 1px solid var(--color-secondary);
  font-family: '${theme.fonts.primary}', sans-serif;
}

.theme-${theme.key.toLowerCase()} .horizontal-nav .logo {
  background-image: url('${theme.assets.logo || ""}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 200px;
  height: 60px;
}

.theme-${theme.key.toLowerCase()} .vertical-nav {
  background: var(--bg-secondary);
  border-right: 1px solid var(--color-secondary);
  font-family: '${theme.fonts.primary}', sans-serif;
}

/* ag-Grid Font Integration (matching your production styling) */
.theme-${theme.key.toLowerCase()} .ag-theme-alpine {
  font-family: '${theme.fonts.primary}', sans-serif;
  --ag-font-family: '${theme.fonts.primary}', sans-serif;
  --ag-font-size: 12px;
  --ag-background-color: var(--bg-primary);
  --ag-header-background-color: var(--bg-secondary);
  --ag-odd-row-background-color: var(--bg-tertiary);
  --ag-border-color: var(--color-secondary);
  --ag-selected-row-background-color: var(--color-accent);
  --ag-foreground-color: var(--text-primary);
  --ag-secondary-foreground-color: var(--text-secondary);
}

.theme-${theme.key.toLowerCase()} .ag-header-cell-text {
  font-family: '${theme.fonts.primary}', sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.9em;
}

.theme-${theme.key.toLowerCase()} .ag-cell {
  font-family: '${theme.fonts.primary}', sans-serif;
  font-size: 12px;
}

/* Typography Components */
.theme-${theme.key.toLowerCase()} h1,
.theme-${theme.key.toLowerCase()} h2,
.theme-${theme.key.toLowerCase()} h3,
.theme-${theme.key.toLowerCase()} h4,
.theme-${theme.key.toLowerCase()} h5,
.theme-${theme.key.toLowerCase()} h6 {
  font-family: '${theme.fonts.primary}', sans-serif;
}

/* Form Controls */
.theme-${theme.key.toLowerCase()} .ant-input,
.theme-${theme.key.toLowerCase()} .ant-select,
.theme-${theme.key.toLowerCase()} .ant-button {
  font-family: '${theme.fonts.primary}', sans-serif;
}
`;
}

/**
 * Copy font files to generated project
 */
export async function copyFontFiles(
  targetDir: string,
  theme: GravitateTheme
): Promise<void> {
  const fontsDir = path.join(targetDir, "public", "assets", "fonts");
  await fs.mkdir(fontsDir, { recursive: true });

  for (const font of theme.fonts.fontFiles) {
    try {
      const source = font.path;
      const destination = path.join(fontsDir, font.name);
      await fs.copyFile(source, destination);
      console.log(`✅ Copied font: ${font.name}`);
    } catch (error) {
      console.error(`❌ Error copying font ${font.name}:`, error);
    }
  }
}

/**
 * Get theme by key
 */
export async function getThemeByKey(
  themeKey: string
): Promise<GravitateTheme | null> {
  const themes = await loadGravitateThemes();
  return themes[themeKey] || null;
}

/**
 * List all available themes
 */
export async function listAvailableThemes(): Promise<string[]> {
  const themes = await loadGravitateThemes();
  return Object.keys(themes);
}
