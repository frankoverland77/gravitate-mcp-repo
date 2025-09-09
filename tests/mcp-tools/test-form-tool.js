const { spawn } = require('child_process');
const path = require('path');

// Test data for creating a product form
const createFormRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "create_form_demo",
    arguments: {
      name: "ProductForm",
      type: "simple",
      title: "Product Information",
      fields: [
        {
          name: "productName",
          label: "Product Name",
          type: "text",
          required: true,
          placeholder: "Enter product name"
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          placeholder: "Enter product description"
        },
        {
          name: "price",
          label: "Price",
          type: "number",
          required: true,
          placeholder: "0.00"
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["Electronics", "Clothing", "Food", "Books"]
        },
        {
          name: "inStock",
          label: "In Stock",
          type: "switch"
        }
      ],
      actions: [
        { type: "cancel", label: "Cancel", theme: "default" },
        { type: "submit", label: "Save Product", theme: "success" }
      ]
    }
  }
};

// Spawn the MCP server
const mcpServer = spawn('node', [path.join(__dirname, '..', '..', 'mcp-server', 'build', 'index.js')]);

let responseBuffer = '';

mcpServer.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  
  // Try to parse complete JSON responses
  const lines = responseBuffer.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line) {
      try {
        const response = JSON.parse(line);
        console.log('Response:', JSON.stringify(response, null, 2));
        
        // Exit after receiving response
        if (response.result || response.error) {
          mcpServer.kill();
          process.exit(0);
        }
      } catch (e) {
        // Not valid JSON yet, continue buffering
      }
    }
  }
  responseBuffer = lines[lines.length - 1];
});

mcpServer.stderr.on('data', (data) => {
  console.error('Server message:', data.toString());
});

mcpServer.on('error', (error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});

// Send the request after a brief delay to ensure server is ready
setTimeout(() => {
  console.log('Sending create_form_demo request...');
  mcpServer.stdin.write(JSON.stringify(createFormRequest) + '\n');
}, 100);

// Timeout after 5 seconds
setTimeout(() => {
  console.log('Timeout - killing server');
  mcpServer.kill();
  process.exit(1);
}, 5000);