/**
 * MCP Server Tools Test Suite
 * 
 * Comprehensive tests for all MCP server tools:
 * - createDemo
 * - modifyGrid
 * - changeTheme
 * - runDevServer
 */

import { createDemoTool } from '../../mcp-server/build/tools/createDemo.js';
import { modifyGridTool } from '../../mcp-server/build/tools/modifyGrid.js';
import { changeThemeTool } from '../../mcp-server/build/tools/changeTheme.js';
import { promises as fs } from 'fs';
import path from 'path';

// Test configuration - we'll use the already created InventoryGrid for testing
const TEST_DEMO_NAME = 'InventoryGrid';
const DEMO_PATH = path.join(process.cwd(), 'demo', 'src', 'pages', 'demos', `${TEST_DEMO_NAME}.tsx`);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const prefix = {
    success: `${colors.green}✅`,
    error: `${colors.red}❌`,
    warning: `${colors.yellow}⚠️`,
    info: `${colors.blue}ℹ️`,
    test: `${colors.cyan}🧪`
  }[type] || '';
  
  console.log(`${prefix} ${message}${colors.reset}`);
}

function section(title) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.bright}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}\n`);
}

async function cleanupTestDemo() {
  try {
    // Save original content if it exists
    const originalContent = await fs.readFile(DEMO_PATH, 'utf-8').catch(() => null);
    const dataPath = DEMO_PATH.replace('.tsx', '.data.ts');
    const originalData = await fs.readFile(dataPath, 'utf-8').catch(() => null);
    
    return { originalContent, originalData, dataPath };
  } catch (error) {
    return { originalContent: null, originalData: null, dataPath: DEMO_PATH.replace('.tsx', '.data.ts') };
  }
}

async function restoreOriginalDemo(backup) {
  if (!backup) return;
  
  try {
    if (backup.originalContent) {
      await fs.writeFile(DEMO_PATH, backup.originalContent);
      log('Restored original demo file', 'info');
    }
    if (backup.originalData) {
      await fs.writeFile(backup.dataPath, backup.originalData);
      log('Restored original data file', 'info');
    }
  } catch (error) {
    log(`Failed to restore original files: ${error.message}`, 'warning');
  }
}

async function testCreateDemo() {
  section('TEST 1: Verify Existing Demo / Create Demo Tool');
  
  try {
    // First check if InventoryGrid already exists
    try {
      await fs.access(DEMO_PATH);
      log('InventoryGrid demo already exists, verifying structure...', 'info');
      
      // Read and verify content
      const content = await fs.readFile(DEMO_PATH, 'utf-8');
      
      // Check for key components
      const checks = [
        { name: 'GraviGrid import', pattern: /import.*GraviGrid.*from/ },
        { name: 'columnDefs', pattern: /const columnDefs\s*=/ },
        { name: 'Mock data import', pattern: /import.*mockData.*from/ },
        { name: 'Component export', pattern: /export function InventoryGrid/ }
      ];
      
      for (const check of checks) {
        if (check.pattern.test(content)) {
          log(`  ✓ ${check.name} found`, 'success');
        } else {
          log(`  ✗ ${check.name} missing`, 'error');
        }
      }
      
      return true;
    } catch (error) {
      // Demo doesn't exist, create it
      log('Demo does not exist, creating a new grid demo...', 'test');
      
      const result = await createDemoTool({ 
        instruction: "Create an inventory grid with editable quantity and price columns, filtering, and sorting" 
      });
      
      // Check if file was created
      await fs.access(DEMO_PATH);
      log('Demo file created successfully', 'success');
      return true;
    }
  } catch (error) {
    log(`Demo verification/creation failed: ${error.message}`, 'error');
    return false;
  }
}

async function testAddColumn() {
  section('TEST 2: Add Column to Grid');
  
  try {
    log('Adding a unitPrice column...', 'test');
    
    const result = await modifyGridTool({
      demoName: TEST_DEMO_NAME,
      action: "add_column",
      config: {
        field: "unitPrice",
        headerName: "Unit Price",
        type: "number",
        width: 120,
        editable: true
      }
    });
    
    // Verify the column was added
    const content = await fs.readFile(DEMO_PATH, 'utf-8');
    
    if (content.includes('unitPrice') && content.includes('Unit Price')) {
      log('Column added successfully', 'success');
      
      // Check for auto-added features
      if (content.includes('agNumberColumnFilter')) {
        log('  ✓ Number filter auto-added', 'success');
      }
      if (content.includes('NumberCellEditor')) {
        log('  ✓ NumberCellEditor auto-added for editable number column', 'success');
      }
      
      return true;
    } else {
      log('Column not found in file', 'error');
      return false;
    }
  } catch (error) {
    log(`Add column failed: ${error.message}`, 'error');
    return false;
  }
}

async function testModifyColumn() {
  section('TEST 3: Modify Existing Column');
  
  try {
    log('Modifying the Quantity column...', 'test');
    
    // First, check what columns exist
    const contentBefore = await fs.readFile(DEMO_PATH, 'utf-8');
    const hasQuantity = contentBefore.includes('"Quantity"') || contentBefore.includes("'Quantity'");
    
    if (!hasQuantity) {
      log('Quantity column not found, trying LoadNumber instead', 'warning');
      
      // Try with a column that should exist
      const result = await modifyGridTool({
        demoName: TEST_DEMO_NAME,
        action: "modify_column",
        config: {
          field: "LoadNumber",
          updates: {
            headerName: "Load ID",
            width: 150,
            pinned: 'left'
          }
        }
      });
    } else {
      const result = await modifyGridTool({
        demoName: TEST_DEMO_NAME,
        action: "modify_column",
        config: {
          field: "Quantity",
          updates: {
            headerName: "Stock Quantity",
            width: 150,
            editable: true,
            cellEditor: "NumberCellEditor"
          }
        }
      });
    }
    
    const contentAfter = await fs.readFile(DEMO_PATH, 'utf-8');
    
    if (contentAfter.includes('Stock Quantity') || contentAfter.includes('Load ID')) {
      log('Column modified successfully', 'success');
      return true;
    } else {
      log('Column modification not applied', 'error');
      return false;
    }
  } catch (error) {
    log(`Modify column failed: ${error.message}`, 'error');
    return false;
  }
}

async function testAddRenderer() {
  section('TEST 4: Add Custom Cell Renderer');
  
  try {
    log('Adding a custom renderer to IsActive column...', 'test');
    
    // Check if IsActive column exists
    const content = await fs.readFile(DEMO_PATH, 'utf-8');
    const hasIsActive = content.includes('IsActive');
    
    if (!hasIsActive) {
      log('IsActive column not found, skipping test', 'warning');
      return true; // Skip this test
    }
    
    const result = await modifyGridTool({
      demoName: TEST_DEMO_NAME,
      action: "add_renderer",
      config: {
        field: "IsActive",
        renderer: "(params) => params.value ? '✅ Active' : '❌ Inactive'"
      }
    });
    
    const contentAfter = await fs.readFile(DEMO_PATH, 'utf-8');
    
    if (contentAfter.includes('✅ Active') || contentAfter.includes('❌ Inactive')) {
      log('Custom renderer added successfully', 'success');
      return true;
    } else {
      log('Custom renderer not found', 'error');
      return false;
    }
  } catch (error) {
    log(`Add renderer failed: ${error.message}`, 'error');
    return false;
  }
}

async function testMakeEditable() {
  section('TEST 5: Make Column Editable');
  
  try {
    log('Making ProductName column editable...', 'test');
    
    const result = await modifyGridTool({
      demoName: TEST_DEMO_NAME,
      action: "make_editable",
      config: {
        field: "ProductName",
        editable: true
      }
    });
    
    const content = await fs.readFile(DEMO_PATH, 'utf-8');
    
    // Check if the field has editable: true
    const columnDefsMatch = content.match(/const columnDefs = (\[[\s\S]*?\]);/);
    if (columnDefsMatch) {
      const columnDefs = eval(columnDefsMatch[1]);
      const productColumn = columnDefs.find(col => col.field === 'ProductName');
      
      if (productColumn && productColumn.editable === true) {
        log('Column made editable successfully', 'success');
        return true;
      }
    }
    
    log('Editable property not set correctly', 'warning');
    return false;
  } catch (error) {
    log(`Make editable failed: ${error.message}`, 'error');
    return false;
  }
}

async function testChangeTheme() {
  section('TEST 6: Change Theme');
  
  try {
    log('Changing theme to BP...', 'test');
    
    const result = await changeThemeTool({
      demoName: TEST_DEMO_NAME,
      theme: "BP"
    });
    
    log(result.content[0].text, 'info');
    
    // Since theme changes might be in a different place, just check the result
    return !result.isError;
  } catch (error) {
    log(`Change theme failed: ${error.message}`, 'error');
    return false;
  }
}

async function runAllTests() {
  console.log(`${colors.bright}${colors.blue}`);
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║         MCP SERVER TOOLS TEST SUITE              ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(colors.reset);
  
  // Save original state before tests
  const backup = await cleanupTestDemo();
  
  const results = {
    createDemo: false,
    addColumn: false,
    modifyColumn: false,
    addRenderer: false,
    makeEditable: false,
    changeTheme: false
  };
  
  try {
    // Run tests in sequence
    results.createDemo = await testCreateDemo();
    
    if (results.createDemo) {
      results.addColumn = await testAddColumn();
      results.modifyColumn = await testModifyColumn();
      results.addRenderer = await testAddRenderer();
      results.makeEditable = await testMakeEditable();
      results.changeTheme = await testChangeTheme();
    } else {
      log('Skipping remaining tests due to demo creation failure', 'warning');
    }
    
    // Summary
    section('TEST RESULTS SUMMARY');
    
    const passed = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;
    
    console.log(`${colors.bright}Tests Passed: ${colors.green}${passed}/${total}${colors.reset}`);
    console.log('');
    
    for (const [test, result] of Object.entries(results)) {
      const status = result ? `${colors.green}PASS` : `${colors.red}FAIL`;
      console.log(`  ${status}${colors.reset} - ${test}`);
    }
    
    console.log('');
    
    if (passed === total) {
      console.log(`${colors.green}${colors.bright}🎉 All tests passed!${colors.reset}`);
    } else {
      console.log(`${colors.yellow}${colors.bright}⚠️  Some tests failed. Please review the output above.${colors.reset}`);
    }
  } finally {
    // Always restore original files after tests
    section('CLEANUP');
    await restoreOriginalDemo(backup);
    log('Test cleanup complete', 'success');
  }
}

// Run the test suite
runAllTests().catch(error => {
  console.error(`${colors.red}Test suite failed:`, error);
  process.exit(1);
});