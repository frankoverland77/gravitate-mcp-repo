#!/usr/bin/env node

// Diagnostic test for Excalibrr component discovery
import { getAllComponents } from './build/lib/componentAnalysis.js';

console.log("🔍 Excalibrr Component Discovery Test");
console.log("====================================\n");

async function runDiagnostic() {
    try {
        console.log("1. Checking library path...");
        const libraryPath = "/Users/rebecca.hirai/repos/excalibrr";
        console.log(`   Library path: ${libraryPath}`);
        
        console.log("\n2. Scanning for components...");
        const components = await getAllComponents();
        
        console.log(`   Found ${components.length} components:`);
        
        if (components.length === 0) {
            console.log("   ⚠️  No components found - this might indicate:");
            console.log("   - Path configuration issue");
            console.log("   - Component scanning logic issue");
            console.log("   - TypeScript/build configuration issue");
        } else {
            console.log("\n3. Component summary:");
            components.forEach((comp, index) => {
                console.log(`   ${index + 1}. ${comp.name} (${comp.category})`);
                console.log(`      File: ${comp.file.split('/').pop()}`);
                console.log(`      Props: ${Object.keys(comp.props || {}).length} properties`);
                if (comp.description) {
                    console.log(`      Description: ${comp.description.substring(0, 80)}...`);
                }
                console.log("");
            });
        }
        
        console.log("✅ Diagnostic complete!");
        
    } catch (error) {
        console.error("❌ Diagnostic failed:", error);
        console.error("Stack trace:", error.stack);
    }
}

runDiagnostic();
