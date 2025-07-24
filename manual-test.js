#!/usr/bin/env node

// Manual test for Excalibrr MCP Server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🧪 Manual Test: Excalibrr MCP Server");
console.log("==================================\n");

// Test 1: Basic server startup
console.log("Test 1: Starting server and checking tools...");

const serverProcess = spawn('node', [join(__dirname, 'build/index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let error = '';

serverProcess.stdout.on('data', (data) => {
    output += data.toString();
});

serverProcess.stderr.on('data', (data) => {
    error += data.toString();
    if (data.toString().includes('running on stdio')) {
        console.log("✅ Server started successfully");
        
        // Send a tools/list request
        console.log("📡 Sending tools/list request...");
        const toolsRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/list"
        };
        
        serverProcess.stdin.write(JSON.stringify(toolsRequest) + '\n');
        
        // Wait a bit for response
        setTimeout(() => {
            console.log("📋 Server output:", output);
            console.log("🔍 Server errors:", error);
            serverProcess.kill();
        }, 2000);
    }
});

serverProcess.on('close', (code) => {
    console.log(`\n🏁 Server process ended with code: ${code}`);
});

// Timeout after 5 seconds
setTimeout(() => {
    console.log("⏰ Test timeout - killing server");
    serverProcess.kill();
}, 5000);
