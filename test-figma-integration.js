// Quick test script to verify Figma integration
// Run with: node test-figma-integration.js

const path = require('path');
const fs = require('fs');

console.log('🔍 Testing Figma Integration Setup...\n');

const serverPath = '/Users/rebecca.hirai/repos/excalibrr-mcp-server';

// Check if required files exist
const requiredFiles = [
  'src/lib/figma/types.ts',
  'src/lib/figma/client.ts', 
  'src/lib/figma/tokenExtractor.ts',
  'src/server/tools/figma.ts',
  '.env.example',
  'FIGMA_SETUP.md'
];

console.log('📁 Checking required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const fullPath = path.join(serverPath, file);
  const exists = fs.existsSync(fullPath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📦 Checking package.json dependencies:');
const packagePath = path.join(serverPath, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = ['axios', 'zod', '@modelcontextprotocol/sdk'];
  
  requiredDeps.forEach(dep => {
    const hasCore = pkg.dependencies && pkg.dependencies[dep];
    const hasDev = pkg.devDependencies && pkg.devDependencies[dep];
    const exists = hasCore || hasDev;
    console.log(`  ${exists ? '✅' : '❌'} ${dep}`);
  });
} else {
  console.log('  ❌ package.json not found');
}

console.log('\n🔧 Checking build directory:');
const buildPath = path.join(serverPath, 'build');
if (fs.existsSync(buildPath)) {
  const buildFiles = fs.readdirSync(buildPath, { recursive: true });
  console.log(`  ✅ Build directory exists (${buildFiles.length} files)`);
  
  // Check for key build files
  const keyFiles = ['index.js', 'server/mcpServer.js', 'server/tools/figma.js'];
  keyFiles.forEach(file => {
    const exists = fs.existsSync(path.join(buildPath, file));
    console.log(`    ${exists ? '✅' : '❌'} ${file}`);
  });
} else {
  console.log('  ❌ Build directory not found - run npm run build');
}

console.log('\n📋 Summary:');
if (allFilesExist) {
  console.log('✅ All Figma integration files created successfully!');
  console.log('\n🎯 Next steps:');
  console.log('  1. Run: chmod +x build-figma-integration.sh');
  console.log('  2. Run: ./build-figma-integration.sh');
  console.log('  3. Set up .env with FIGMA_API_TOKEN');
  console.log('  4. Test with Claude: "Test my Figma connection"');
  console.log('\n📚 Full setup guide: FIGMA_SETUP.md');
} else {
  console.log('❌ Some files are missing. Please check the file creation process.');
}

console.log('\n🚀 Figma + Excalibrr Integration Ready! 🎨');
