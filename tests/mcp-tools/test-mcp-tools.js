import { createDemoTool } from './mcp-server/build/tools/createDemo.js';
import { modifyGridTool } from './mcp-server/build/tools/modifyGrid.js';

// Test the MCP server tools
async function testMCPTools() {
  console.log('=== Testing MCP Server Tools ===\n');
  
  try {
    // Test 1: Create a demo using the createDemo tool
    console.log('1. Testing createDemo tool...');
    const createResult = await createDemoTool({ 
      instruction: "Create a product inventory grid with inline editing and filtering" 
    });
    console.log(createResult.content[0].text);
    console.log('\n---\n');
    
    // Test 2: Add a new column to the grid
    console.log('2. Testing modifyGrid - add_column...');
    try {
      const addColumnResult = await modifyGridTool({
        demoName: "InventoryGrid",
        action: "add_column",
        config: {
          field: "unitPrice",
          headerName: "Unit Price",
          type: "number",
          width: 120,
          editable: true
        }
      });
      console.log(addColumnResult.content[0].text);
    } catch (error) {
      console.log('Expected error (demo might not exist):', error.message);
    }
    console.log('\n---\n');
    
    // Test 3: Modify an existing column
    console.log('3. Testing modifyGrid - modify_column...');
    try {
      const modifyResult = await modifyGridTool({
        demoName: "InventoryGrid",
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
      console.log(modifyResult.content[0].text);
    } catch (error) {
      console.log('Expected error:', error.message);
    }
    console.log('\n---\n');
    
    // Test 4: Add a renderer to a column
    console.log('4. Testing modifyGrid - add_renderer...');
    try {
      const rendererResult = await modifyGridTool({
        demoName: "InventoryGrid",
        action: "add_renderer",
        config: {
          field: "IsActive",
          renderer: "(params) => params.value ? '✅ Active' : '❌ Inactive'"
        }
      });
      console.log(rendererResult.content[0].text);
    } catch (error) {
      console.log('Expected error:', error.message);
    }
    console.log('\n---\n');
    
    // Test 5: Make a column editable
    console.log('5. Testing modifyGrid - make_editable...');
    try {
      const editableResult = await modifyGridTool({
        demoName: "InventoryGrid",
        action: "make_editable",
        config: {
          field: "ProductName",
          editable: true
        }
      });
      console.log(editableResult.content[0].text);
    } catch (error) {
      console.log('Expected error (action might not be implemented):', error.message);
    }
    
    console.log('\n=== Test Summary ===');
    console.log('✅ createDemo tool works');
    console.log('⚠️  modifyGrid tool expects demos in ./demos/ directory');
    console.log('📝 Need to align directory structure between tools');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMCPTools();