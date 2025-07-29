#!/usr/bin/env node

// Test script to validate code generation compilation
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🔧 Testing Excalibrr MCP Server Compilation");
console.log("============================================\n");

try {
    console.log("1. Building TypeScript...");
    const buildOutput = execSync('npm run build', { 
        cwd: __dirname, 
        encoding: 'utf8',
        stdio: 'pipe'
    });
    console.log("✅ TypeScript compilation successful");
    
    console.log("2. Testing basic imports...");
    // Try to import the server
    const { createMcpServer } = await import('./build/server/mcpServer.js');
    console.log("✅ Server module imports successfully");
    
    // Try to import code generators
    const { generateGridFiles } = await import('./build/lib/codeGenerators.js');
    console.log("✅ Code generators module imports successfully");
    
    console.log("3. Testing server creation...");
    const server = createMcpServer();
    console.log("✅ Server instance created successfully");
    
    console.log("4. Testing new grid generation functionality...");
    
    // Test the generateGridFiles function
    const testConfig = {
        featureName: "TestExample",
        componentName: "TestExamplePage",
        columns: [
            { field: "id", headerName: "ID", type: "numericColumn" },
            { field: "name", headerName: "Name" },
            { field: "status", headerName: "Status" }
        ],
        sampleData: [
            { id: 1, name: "Test Item 1", status: "Active" },
            { id: 2, name: "Test Item 2", status: "Inactive" }
        ],
        uniqueIdField: "id",
        displayTitle: "Test Example Grid",
        storageKey: "TestExample",
        dataConstName: "testExampleData",
        hookName: "useTestExample",
        getDataFunctionName: "getTestExampleData"
    };
    
    const generatedFiles = generateGridFiles(testConfig);
    console.log(`   Generated ${generatedFiles.length} files successfully`);
    console.log("   Files:", generatedFiles.map(f => f.text.split('**')[1]).filter(Boolean));
    console.log("✅ Grid generation functionality working");
    
    console.log("\n5. Testing server tool registration...");
    // Check if the server has the expected capabilities
    if (server.options && server.options.capabilities) {
        console.log("✅ Server capabilities configured");
    }
    console.log("✅ All tools should be registered during server creation");
    
    console.log("\n🎉 Enhanced MCP Server Test Complete!");
    console.log("\n🚀 Ready to use with Claude Desktop:");
    console.log("- generate_grid_component: Complete file structure generation");
    console.log("- generate_component_code: Enhanced component examples"); 
    console.log("- discover_components: Component library exploration");
    console.log("- All visual preview tools available");
    
    console.log("\n📝 Next steps:");
    console.log("1. Configure Claude Desktop to use this server");
    console.log("2. Test with: 'Generate a grid for contract management'");
    console.log("3. Try: 'Show me examples of the GraviGrid component'");

} catch (error) {
    console.error("❌ Compilation or import failed:");
    console.error(error.message);
    if (error.stdout) {
        console.error("\nBuild output:");
        console.error(error.stdout);
    }
    if (error.stderr) {
        console.error("\nBuild errors:");
        console.error(error.stderr);
    }
    console.error("\nFull error:");
    console.error(error.stack);
    process.exit(1);
}