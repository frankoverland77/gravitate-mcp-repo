// HTTP server wrapper for MCP server - simplified approach
import express, { Request, Response } from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface HttpServerConfig {
  port: number;
  host?: string;
  cors?: boolean;
}

// Simple HTTP transport implementation that forwards JSON-RPC messages
class SimpleHTTPTransport {
  private pendingRequests = new Map<
    string | number,
    { resolve: (value: any) => void; reject: (error: any) => void }
  >();

  constructor(private onMessage: (message: any) => void) {}

  start() {
    // No-op for HTTP transport
  }

  close() {
    // No-op for HTTP transport
  }

  send(message: any) {
    // For HTTP transport, we handle responses through the pending requests map
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve } = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);
      resolve(message);
    }
  }

  async handleRequest(request: any): Promise<any> {
    if (request.id) {
      // For requests that expect a response
      return new Promise((resolve, reject) => {
        this.pendingRequests.set(request.id, { resolve, reject });
        this.onMessage(request);

        // Set a timeout for requests
        setTimeout(() => {
          if (this.pendingRequests.has(request.id)) {
            this.pendingRequests.delete(request.id);
            reject(new Error("Request timeout"));
          }
        }, 30000); // 30 second timeout
      });
    } else {
      // For notifications (no response expected)
      this.onMessage(request);
      return null;
    }
  }
}

export function createHttpServer(
  mcpServerFactory: () => McpServer,
  config: HttpServerConfig
) {
  const app = express();

  // Single server instance for now - can be made session-based later
  let mcpServer: McpServer | null = null;
  let transport: SimpleHTTPTransport | null = null;

  // Initialize server
  const initializeServer = async () => {
    if (!mcpServer) {
      mcpServer = mcpServerFactory();
      transport = new SimpleHTTPTransport((message) => {
        // This is where the MCP server will send responses
        // In a real implementation, this would be handled by the transport
      });

      // Connect the server to our simple transport
      await mcpServer.connect(transport as any);
      console.log("🔧 MCP server initialized");
    }
  };

  // Middleware
  app.use(express.json({ limit: "10mb" }));
  if (config.cors) {
    app.use(
      cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "mcp-session-id"],
        credentials: true,
      })
    );
  }

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "healthy",
      version: process.env.npm_package_version || "1.0.0",
      timestamp: new Date().toISOString(),
      transport: "http",
    });
  });

  // Main MCP endpoint - simplified approach
  app.post("/mcp", async (req: Request, res: Response) => {
    try {
      console.log("📨 Received MCP request:", req.body?.method || "unknown");

      // Validate JSON-RPC format
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32700,
            message: "Parse error",
          },
          id: null,
        });
      }

      // Initialize server if needed
      await initializeServer();

      if (!transport) {
        throw new Error("Transport not initialized");
      }

      // Handle the request through our simple transport
      const response = await transport.handleRequest(req.body);

      console.log("✅ MCP response sent for method:", req.body?.method);

      if (response) {
        res.json(response);
      } else {
        // For notifications, return 204 No Content
        res.status(204).end();
      }
    } catch (error) {
      console.error("❌ MCP request failed:", error);

      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal error",
          data: error instanceof Error ? error.message : String(error),
        },
        id: req.body?.id || null,
      });
    }
  });

  // Handle preflight OPTIONS requests
  app.options("/mcp", (req: Request, res: Response) => {
    res.status(200).end();
  });

  // 404 handler
  app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
      error: "Not found",
      message:
        "Use POST /mcp for MCP requests or GET /health for health checks",
    });
  });

  return {
    app,
    start: () => {
      const server = app.listen(config.port, config.host || "0.0.0.0", () => {
        console.log(
          `🚀 Excalibrr MCP HTTP Server running on http://${
            config.host || "0.0.0.0"
          }:${config.port}`
        );
        console.log(
          `🔍 Health check: http://${config.host || "localhost"}:${
            config.port
          }/health`
        );
        console.log(
          `🤖 MCP endpoint: http://${config.host || "localhost"}:${
            config.port
          }/mcp`
        );
      });

      return server;
    },
  };
}
