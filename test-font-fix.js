// Test script to verify font fix is working
import { generateThemedGraviGrid } from './build/lib/navigationSystem.js';
import { getThemeByKey } from './build/lib/themeSystem.js';
import fs from 'fs/promises';
import path from 'path';

async function testFontFix() {
  console.log('🧪 Testing Font Fix Integration...\n');
  
  try {
    // Load OSP theme
    const theme = await getThemeByKey('OSP');
    if (!theme) {
      console.error('❌ Failed to load OSP theme');
      return;
    }
    
    console.log('✅ Loaded OSP theme');
    
    // Generate a test grid
    const navConfig = {
      theme,
      user: {
        name: 'Test User',
        email: 'test@gravitate.energy'
      },
      currentModule: 'PricingEngine',
      currentPage: 'ContractManagement'
    };
    
    const gridConfig = {
      title: 'Font Test Grid',
      columns: [
        { field: 'id', headerName: 'ID', type: 'numericColumn' },
        { field: 'contractNumber', headerName: 'Contract Number' },
        { field: 'customerName', headerName: 'Customer Name' },
        { field: 'status', headerName: 'Status' }
      ],
      sampleData: [
        { id: 1, contractNumber: 'CNT-2024-001', customerName: 'Acme Corp', status: 'Active' },
        { id: 2, contractNumber: 'CNT-2024-002', customerName: 'Global Energy', status: 'Pending' }
      ],
      uniqueIdField: 'id'
    };
    
    const gridCode = generateThemedGraviGrid(navConfig, gridConfig);
    
    // Check for font-related code
    const fontChecks = {
      hasUseEffect: gridCode.includes('useEffect'),
      hasFontFamily: gridCode.includes("font-family: 'Lato'"),
      hasAgFontFamily: gridCode.includes('--ag-font-family'),
      hasTextTransform: gridCode.includes('text-transform: uppercase'),
      hasFontWeight: gridCode.includes('font-weight: 600'),
      hasInlineStyles: gridCode.includes('el.style.fontFamily'),
      hasCriticalFontFix: gridCode.includes('Critical font fix')
    };
    
    console.log('\n📊 Font Fix Validation Results:');
    console.log('================================');
    
    Object.entries(fontChecks).forEach(([check, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${check.replace(/([A-Z])/g, ' $1').trim()}`);
    });
    
    const allPassed = Object.values(fontChecks).every(v => v);
    
    if (allPassed) {
      console.log('\n🎉 All font fixes are properly integrated!');
      
      // Save test output
      const outputDir = path.join(process.cwd(), 'build-test', 'font-fix-test');
      await fs.mkdir(outputDir, { recursive: true });
      
      const testFile = path.join(outputDir, 'TestGrid.tsx');
      await fs.writeFile(testFile, gridCode);
      
      console.log(`\n📁 Test grid saved to: ${testFile}`);
      console.log('\n✨ Font fix is working correctly!');
      console.log('\nThe generated components now include:');
      console.log('  • Lato font family declarations');
      console.log('  • ag-Grid CSS variables for fonts');
      console.log('  • useEffect hook for runtime font application');
      console.log('  • Uppercase text transform for headers');
      console.log('  • Proper font weights (600 for headers)');
      console.log('  • Inline style application as fallback');
      
    } else {
      console.log('\n⚠️  Some font fixes are missing. Please check the implementation.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testFontFix();
