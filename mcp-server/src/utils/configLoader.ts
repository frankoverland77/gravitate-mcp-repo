/**
 * Configuration Loader
 * Loads and validates components.json configuration
 */

import { promises as fs } from "fs";
import path from "path";

export interface ComponentsConfig {
  style?: string;
  rsc?: boolean;
  tsx?: boolean;
  tailwind?: {
    config?: string;
    css?: string;
    baseColor?: string;
    cssVariables?: boolean;
  };
  aliases?: {
    components?: string;
    utils?: string;
    ui?: string;
    [key: string]: string | undefined;
  };
  registries?: {
    [key: string]: {
      name: string;
      url: string;
      description?: string;
    };
  };
}

/**
 * Load components.json from a project directory
 */
export async function loadComponentsConfig(
  projectPath: string
): Promise<ComponentsConfig | null> {
  try {
    const configPath = path.join(projectPath, "components.json");
    const configContent = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(configContent) as ComponentsConfig;
    return config;
  } catch (error) {
    // Config file doesn't exist or is invalid
    return null;
  }
}

/**
 * Save components.json to a project directory
 */
export async function saveComponentsConfig(
  projectPath: string,
  config: ComponentsConfig
): Promise<void> {
  const configPath = path.join(projectPath, "components.json");
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Get the default components.json configuration
 */
export function getDefaultConfig(): ComponentsConfig {
  return {
    style: "default",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "tailwind.config.js",
      css: "src/index.css",
      baseColor: "slate",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
    },
    registries: {
      excalibrr: {
        name: "Excalibrr Component Registry",
        url: "mcp://excalibrr",
        description: "Official Excalibrr component library with Gravitate theming",
      },
    },
  };
}

/**
 * Check if a project has components.json configured
 */
export async function hasComponentsConfig(
  projectPath: string
): Promise<boolean> {
  try {
    const configPath = path.join(projectPath, "components.json");
    await fs.access(configPath);
    return true;
  } catch {
    return false;
  }
}