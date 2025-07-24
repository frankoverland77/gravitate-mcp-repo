#!/usr/bin/env node

// MCP Test Client - sends JSON-RPC commands and shows responses
import { spawn } from 'child_process';

console.log("🧪 MCP Server Test Client");
console.log("=========================\n");

async function testMCPCommands() {
    const serverProcess = spawn('node', ['build/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let responses = [];
    let serverReady = false;

    serverProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
            console.log("📤 Server Response:");
            console.log(output);
            console.log("---\n");
        }
    });

    serverProcess.stderr.on('data', (data) => {
        const error = data.toString().trim();
        if (error.includes('running on stdio')) {
            console.log("✅ Server is ready!");
            serverReady = true;
            runTests();
        } else if (error) {
            console.log("⚠️  Server message:", error);
        }
    });

    async function runTests() {
        // Wait a moment for server to be fully ready
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log("🔧 Test 1: List available tools");
        const toolsListCmd = {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/list"
        };
        serverProcess.stdin.write(JSON.stringify(toolsListCmd) + '\n');

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("🔍 Test 2: Discover components");
        const discoverCmd = {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: {
                name: "discover_components",
                arguments: {}
            }
        };
        serverProcess.stdin.write(JSON.stringify(discoverCmd) + '\n');

        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log("📖 Test 3: Get component details");
        const detailsCmd = {
            jsonrpc: "2.0",
            id: 3,
            method: "tools/call",
            params: {
                name: "get_component_details",
                arguments: {
                    componentName: "Horizontal"
                }
            }
        };
        serverProcess.stdin.write(JSON.stringify(detailsCmd) + '\n');

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("🏁 Tests completed! Check responses above.");
        serverProcess.kill();
    }

    // Timeout safety
    setTimeout(() => {
        if (!serverReady) {
            console.log("❌ Server didn't start properly");
            serverProcess.kill();
        }
    }, 5000);
}

testMCPCommands().catch(console.error);
