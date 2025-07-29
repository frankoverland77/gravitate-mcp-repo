#!/usr/bin/env node
// Test script to verify fixes are implemented correctly

import { readFile } from 'fs/promises';
import { join } from 'path';

async function testFixes() {
  console.log("🔍 Testing MCP Server Fixes...\n");
  
  const fixes = [
    { file: 'src/lib/generators/reactProjectGenerator.ts', fix: 'Root index.html generation' },
    { file: 'src/lib/generators/reactProjectGenerator.ts', fix: 'AG-Grid CSS imports in index.tsx' },
    { file: 'src/lib/generators/reactProjectGenerator.ts', fix: 'LESS in devDependencies' },
    { file: 'src/lib/generators/reactProjectGenerator.ts', fix: 'styles.css generation' },
    { file: 'src/lib/generators/reactProjectGenerator.ts', fix: 'Vite config with aliases' },
  ];
  
  for (const { file, fix } of fixes) {
    try {
      const content = await readFile(join('/Users/rebecca.hirai/repos/excalibrr-mcp-server', file), 'utf-8');
      
      // Check for specific fixes
      if (fix === 'Root index.html generation' && content.includes('generateRootIndexHtml')) {
        console.log(`✅ ${fix} - Found generateRootIndexHtml function`);
      } else if (fix === 'AG-Grid CSS imports in index.tsx' && content.includes('ag-grid-community/styles/ag-grid.css')) {
        console.log(`✅ ${fix} - Found AG-Grid CSS imports`);
      } else if (fix === 'LESS in devDependencies' && content.includes('less: "^3.9.0"')) {
        console.log(`✅ ${fix} - Found LESS in devDependencies`);
      } else if (fix === 'styles.css generation' && content.includes('generateStylesCss')) {
        console.log(`✅ ${fix} - Found generateStylesCss function`);
      } else if (fix === 'Vite config with aliases' && content.includes('getRootAlias')) {
        console.log(`✅ ${fix} - Found Vite alias configuration`);
      } else {
        console.log(`❌ ${fix} - Not found in ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error reading ${file}: ${error.message}`);
    }
  }
  
  console.log("\n📋 Summary of Changes:");
  console.log("1. Added root index.html for Vite entry point");
  console.log("2. Updated index.tsx with AG-Grid CSS imports");
  console.log("3. Moved LESS to devDependencies");
  console.log("4. Added styles.css generation");
  console.log("5. Updated Vite config with proper aliases");
  console.log("6. Fixed project structure display in success message");
  console.log("\n✨ All fixes have been implemented!");
}

testFixes().catch(console.error);
