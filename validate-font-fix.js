#!/usr/bin/env node

// Quick validation that font fix is in place
import { readFile } from 'fs/promises';
import { join } from 'path';

async function validateFontFix() {
  console.log('🔍 Validating Font Fix Implementation...\n');
  
  const checks = [];
  
  // Check if gridFontFix.ts exists
  try {
    const fontFixPath = join(process.cwd(), 'src/lib/gridFontFix.ts');
    const content = await readFile(fontFixPath, 'utf-8');
    
    checks.push({
      name: 'gridFontFix.ts exists',
      passed: true
    });
    
    checks.push({
      name: 'Contains Lato font declarations',
      passed: content.includes("font-family: 'Lato'")
    });
    
    checks.push({
      name: 'Contains ag-Grid font variables',
      passed: content.includes('--ag-font-family')
    });
    
    checks.push({
      name: 'Contains uppercase transform',
      passed: content.includes('text-transform: uppercase')
    });
    
  } catch (error) {
    checks.push({
      name: 'gridFontFix.ts exists',
      passed: false,
      error: error.message
    });
  }
  
  // Check if navigationSystem.ts imports the fix
  try {
    const navPath = join(process.cwd(), 'src/lib/navigationSystem.ts');
    const content = await readFile(navPath, 'utf-8');
    
    checks.push({
      name: 'navigationSystem.ts imports gridFontFix',
      passed: content.includes('gridFontFix')
    });
    
    checks.push({
      name: 'Includes useEffect for font loading',
      passed: content.includes('useEffect')
    });
    
  } catch (error) {
    checks.push({
      name: 'navigationSystem.ts updated',
      passed: false,
      error: error.message
    });
  }
  
  // Display results
  console.log('Validation Results:');
  console.log('==================\n');
  
  checks.forEach(check => {
    const icon = check.passed ? '✅' : '❌';
    console.log(`${icon} ${check.name}`);
    if (check.error) {
      console.log(`   Error: ${check.error}`);
    }
  });
  
  const allPassed = checks.every(c => c.passed);
  
  console.log('\n' + '='.repeat(40));
  if (allPassed) {
    console.log('✨ Font fix is properly implemented!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Restart the MCP server');
    console.log('3. Generate a new grid component');
    console.log('4. Verify Lato font in the output');
  } else {
    console.log('⚠️  Some issues found. Please review the implementation.');
  }
}

validateFontFix().catch(console.error);
