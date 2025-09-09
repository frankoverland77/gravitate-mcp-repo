import { spawn, exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { handleToolError } from "../utils/demoUtils.js";

interface RunDevServerArgs {
  demoName: string;
  action?: "start" | "stop" | "restart";
  port?: number;
}

// Track running servers
const runningServers = new Map<string, any>();

/**
 * Manages development servers for demos
 *
 * This tool:
 * - Starts Vite dev servers for demos
 * - Tracks running servers
 * - Provides hot-reload functionality
 * - Auto-assigns ports to avoid conflicts
 */
export async function runDevServerTool(args: RunDevServerArgs) {
  const { demoName, action = "start", port } = args;

  try {
    const demoPath = path.join(process.cwd(), "demos", demoName);

    // Check if demo exists
    await fs.access(demoPath);

    switch (action) {
      case "start":
        return await startDevServer(demoName, demoPath, port);
      case "stop":
        return await stopDevServer(demoName);
      case "restart":
        await stopDevServer(demoName);
        return await startDevServer(demoName, demoPath, port);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    return handleToolError(`Run dev server for ${demoName}`, error);
  }
}

/**
 * Start a development server for a demo
 */
async function startDevServer(
  demoName: string,
  demoPath: string,
  requestedPort?: number
): Promise<any> {
  // Check if server is already running
  if (runningServers.has(demoName)) {
    const server = runningServers.get(demoName);
    return {
      content: [
        {
          type: "text",
          text: `ℹ️ Server for ${demoName} is already running on port ${server.port}

🌐 URL: http://localhost:${server.port}
📁 Location: ./demos/${demoName}`,
        },
      ],
    };
  }

  // Find an available port
  const port = requestedPort || (await findAvailablePort(3000));

  // Install dependencies if needed (using yarn as per Frank's preference)
  try {
    await new Promise<void>((resolve, reject) => {
      exec("yarn install", { cwd: demoPath }, (error) => {
        if (error) {
          console.log("Dependencies already linked or error:", error.message);
        }
        resolve(); // Continue even if yarn install fails (deps might be linked)
      });
    });
  } catch (error) {
    console.log("Yarn install failed, continuing anyway:", error);
  }

  // Start the Vite dev server
  const serverProcess = spawn(
    "yarn",
    ["dev", "--port", port.toString(), "--host"],
    {
      cwd: demoPath,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  // Track the server
  runningServers.set(demoName, {
    process: serverProcess,
    port,
    startTime: new Date(),
  });

  // Handle server output
  let serverReady = false;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!serverReady) {
        reject(new Error("Server failed to start within 30 seconds"));
      }
    }, 30000);

    serverProcess.stdout?.on("data", (data) => {
      const output = data.toString();
      console.log(`[${demoName}] ${output}`);

      // Check if server is ready
      if (output.includes("Local:") || output.includes(`localhost:${port}`)) {
        serverReady = true;
        clearTimeout(timeout);
        resolve({
          content: [
            {
              type: "text",
              text: `✅ Started development server for ${demoName}

🌐 URL: http://localhost:${port}
📁 Location: ./demos/${demoName}
🔄 Hot-reload: Enabled

The demo is now running and will automatically reload when you make changes.`,
            },
          ],
        });
      }
    });

    serverProcess.stderr?.on("data", (data) => {
      const error = data.toString();
      console.error(`[${demoName}] ERROR: ${error}`);

      // If it's just a warning, don't fail
      if (!error.toLowerCase().includes("error") || error.includes("warning")) {
        return;
      }

      clearTimeout(timeout);
      reject(new Error(`Server failed to start: ${error}`));
    });

    serverProcess.on("error", (error) => {
      clearTimeout(timeout);
      runningServers.delete(demoName);
      reject(new Error(`Failed to start server: ${error.message}`));
    });

    serverProcess.on("exit", (code) => {
      runningServers.delete(demoName);
      if (code !== 0 && !serverReady) {
        clearTimeout(timeout);
        reject(new Error(`Server exited with code ${code}`));
      }
    });
  });
}

/**
 * Stop a development server
 */
async function stopDevServer(demoName: string): Promise<any> {
  const server = runningServers.get(demoName);

  if (!server) {
    return {
      content: [
        {
          type: "text",
          text: `ℹ️ No server running for ${demoName}`,
        },
      ],
    };
  }

  // Kill the process
  server.process.kill("SIGTERM");
  runningServers.delete(demoName);

  return {
    content: [
      {
        type: "text",
        text: `✅ Stopped development server for ${demoName}

The server has been shut down.`,
      },
    ],
  };
}

/**
 * Find an available port starting from the given port
 */
async function findAvailablePort(startPort: number): Promise<number> {
  const { createServer } = await import("net");

  return new Promise((resolve, reject) => {
    const server = createServer();

    server.listen(startPort, () => {
      const port = (server.address() as any)?.port;
      server.close(() => resolve(port));
    });

    server.on("error", () => {
      // Port is busy, try the next one
      findAvailablePort(startPort + 1)
        .then(resolve)
        .catch(reject);
    });
  });
}
