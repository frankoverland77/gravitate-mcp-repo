import { createDemoTool } from './mcp-server/build/tools/createDemo.js';

// Test the createDemo tool
async function testDemo() {
  try {
    console.log('Testing demo creation...');
    const result = await createDemoTool({ 
      instruction: "Create a product inventory grid with filtering" 
    });
    console.log('Success!');
    console.log(result.content[0].text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testDemo();