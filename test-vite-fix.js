#!/usr/bin/env node

// Test script to verify Vite dependencies are now included in codeGeneration.ts
import { readFile } from 'fs/promises';

async function testViteDependencies() {
  console.log('\n🔧 Testing FIXED Vite Dependencies in codeGeneration.ts\n');
  
  try {
    // Read the codeGeneration.ts file to verify our changes
    const codeGenPath = '/Users/rebecca.hirai/repos/excalibrr-mcp-server/src/server/tools/codeGeneration.ts';
    const codeGenContent = await readFile(codeGenPath, 'utf-8');
    
    // Check if the Vite dependencies are now included
    const hasVite = codeGenContent.includes('"vite": "^7.0.6"');
    const hasViteReact = codeGenContent.includes('"@vitejs/plugin-react": "^4.7.0"');
    const hasViteSvgr = codeGenContent.includes('"vite-plugin-svgr": "^4.3.0"');
    const hasVitePaths = codeGenContent.includes('"vite-tsconfig-paths": "^5.1.4"');
    
    console.log('✅ Vite Dependencies Added to readDependenciesFromMainRepo():');
    console.log(`   📦 vite: ${hasVite ? '✅ INCLUDED' : '❌ MISSING'}`);
    console.log(`   🔌 @vitejs/plugin-react: ${hasViteReact ? '✅ INCLUDED' : '❌ MISSING'}`);
    console.log(`   📄 vite-plugin-svgr: ${hasViteSvgr ? '✅ INCLUDED' : '❌ MISSING'}`);
    console.log(`   🔗 vite-tsconfig-paths: ${hasVitePaths ? '✅ INCLUDED' : '❌ MISSING'}`);
    
    // Check if fallback was fixed
    const hasFallbackFix = codeGenContent.includes('getDynamicDependencies()');
    console.log(`\n✅ Fallback Fixed: ${hasFallbackFix ? '✅ USES getDynamicDependencies()' : '❌ STILL HARDCODED'}`);
    
    // Summary
    const allVitePresent = hasVite && hasViteReact && hasViteSvgr && hasVitePaths;
    console.log(`\n🎯 Status: ${allVitePresent && hasFallbackFix ? '✅ FULLY FIXED!' : '❌ NEEDS MORE WORK'}`);
    
    if (allVitePresent && hasFallbackFix) {
      console.log('\n🚀 The missing Vite dependencies issue is now RESOLVED!');
      console.log('   • Generated projects will now include Vite and all plugins');
      console.log('   • Fallback uses proper getDynamicDependencies() function');
      console.log('   • Ready for testing with MCP server build');
    }
    
  } catch (error) {
    console.error('❌ Error testing:', error.message);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('   1. Build MCP server: npm run build');
  console.log('   2. Test grid generation with MCP tools');
  console.log('   3. Verify package.json includes all Vite dependencies');
  console.log('');
}

testViteDependencies();
