#!/usr/bin/env node

// Quick test to see if the build works
const { spawn } = require('child_process');
const path = require('path');

console.log('🔧 Testing Excalibrr MCP Server Build...');

const projectDir = '/Users/rebecca.hirai/repos/excalibrr-mcp-server';
process.chdir(projectDir);

console.log('Current directory:', process.cwd());

// Run TypeScript build
const tscProcess = spawn('npx', ['tsc'], { 
  stdio: 'inherit',
  cwd: projectDir 
});

tscProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Build successful! Your MCP server should be working now.');
    console.log('\n📋 To restart your server:');
    console.log('   cd /Users/rebecca.hirai/repos/excalibrr-mcp-server');
    console.log('   npm run start');
    
    // Test if the built index.js exists
    const fs = require('fs');
    const buildPath = path.join(projectDir, 'build', 'index.js');
    if (fs.existsSync(buildPath)) {
      console.log('\n✅ Build output confirmed at:', buildPath);
    } else {
      console.log('\n⚠️  Build output not found at expected location');
    }
  } else {
    console.error(`\n❌ Build failed with exit code ${code}`);
    console.error('Check the TypeScript errors above for details.');
  }
});

tscProcess.on('error', (error) => {
  console.error('❌ Error running TypeScript build:', error.message);
});
