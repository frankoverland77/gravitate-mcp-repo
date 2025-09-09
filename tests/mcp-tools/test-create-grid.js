import { createDemoTool } from './mcp-server/build/tools/createDemo.js';

// Create a grid demo for testing
async function createGridDemo() {
  console.log('Creating Inventory Grid demo...');
  
  try {
    const result = await createDemoTool({ 
      instruction: "Create an inventory grid with editable quantity and price columns" 
    });
    console.log(result.content[0].text);
  } catch (error) {
    console.error('Error:', error);
  }
}

createGridDemo();