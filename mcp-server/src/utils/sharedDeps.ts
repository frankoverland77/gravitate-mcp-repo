import { promises as fs } from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Ensures shared dependencies are installed in the /shared directory
 * This allows all demos to use the same node_modules, saving space and time
 */
export async function ensureSharedDependencies(): Promise<void> {
  const sharedPath = path.join(process.cwd(), "shared");
  const packageJsonPath = path.join(sharedPath, "package.json");

  try {
    // Check if shared directory exists
    await fs.access(sharedPath);

    // Check if package.json exists
    await fs.access(packageJsonPath);

    // Check if node_modules exists
    await fs.access(path.join(sharedPath, "node_modules"));

    console.log("✅ Shared dependencies already installed");
    return;
  } catch (error) {
    // Need to set up shared dependencies
    console.log("📦 Setting up shared dependencies...");
  }

  // Create shared directory
  await fs.mkdir(sharedPath, { recursive: true });

  // Create package.json for shared dependencies
  const packageJson = {
    name: "excalibrr-shared-deps",
    version: "1.0.0",
    type: "module",
    dependencies: {
      "@gravitate-js/excalibrr": "^4.0.34-osp",
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "ag-grid-community": "^31.0.0",
      "ag-grid-react": "^31.0.0",
    },
    devDependencies: {
      vite: "^5.0.0",
      "@vitejs/plugin-react": "^4.0.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
    },
  };

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Install dependencies using yarn (Frank's preference)
  try {
    console.log("🔄 Installing shared dependencies with yarn...");
    execSync("yarn install", {
      cwd: sharedPath,
      stdio: "inherit",
    });
    console.log("✅ Shared dependencies installed successfully");
  } catch (error) {
    console.error("❌ Failed to install shared dependencies:", error);
    throw new Error(
      "Failed to install shared dependencies. Make sure yarn is installed."
    );
  }
}

/**
 * Gets the path to shared node_modules
 */
export function getSharedNodeModulesPath(): string {
  return path.join(process.cwd(), "shared", "node_modules");
}

/**
 * Checks if a specific package is available in shared dependencies
 */
export async function isPackageAvailable(
  packageName: string
): Promise<boolean> {
  const packagePath = path.join(getSharedNodeModulesPath(), packageName);
  try {
    await fs.access(packagePath);
    return true;
  } catch {
    return false;
  }
}
