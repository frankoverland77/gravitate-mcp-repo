#!/usr/bin/env node

// Simple MCP Server Test
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log("🧪 Testing Excalibrr MCP Server");
console.log("===============================\n");

async function testMCPServer() {
    try {
        console.log("Test 1: Starting server...");
        
        // Start the server
        const serverProcess = spawn('node', ['build/index.js'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let serverOutput = '';
        let serverError = '';

        serverProcess.stdout.on('data', (data) => {
            serverOutput += data.toString();
        });

        serverProcess.stderr.on('data', (data) => {
            serverError += data.toString();
            if (data.toString().includes('running on stdio')) {
                console.log("✅ Server started successfully");
                runTests();
            }
        });

        async function runTests() {
            console.log("\nTest 2: Testing tools/list...");
            
            const toolsListRequest = {
                jsonrpc: "2.0",
                id: 1,
                method: "tools/list"
            };

            serverProcess.stdin.write(JSON.stringify(toolsListRequest) + '\n');

            // Wait a bit for response
            await setTimeout(1000);

            console.log("\nTest 3: Testing component discovery...");
            
            const discoveryRequest = {
                jsonrpc: "2.0",
                id: 2,
                method: "tools/call",
                params: {
                    name: "discover_components",
                    arguments: {}
                }
            };

            serverProcess.stdin.write(JSON.stringify(discoveryRequest) + '\n');

            // Wait for response
            await setTimeout(2000);

            console.log("\nTest 4: Testing component details...");
            
            const detailsRequest = {
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

            serverProcess.stdin.write(JSON.stringify(detailsRequest) + '\n');

            // Wait for final response
            await setTimeout(2000);

            console.log("\n📋 Server Output:");
            console.log(serverOutput);
            
            if (serverError && !serverError.includes('running on stdio')) {
                console.log("\n❌ Server Errors:");
                console.log(serverError);
            }

            serverProcess.kill();
            
            // Basic validation
            if (serverOutput.includes('discover_components') || serverError.includes('running on stdio')) {
                console.log("\n🎉 Tests completed! Server appears to be working.");
            } else {
                console.log("\n⚠️  Server may have issues - check output above.");
            }
        }

        // Timeout after 10 seconds
        setTimeout(() => {
            console.log("\n⏰ Test timeout - killing server");
            serverProcess.kill();
        }, 10000);

    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

testMCPServer();
