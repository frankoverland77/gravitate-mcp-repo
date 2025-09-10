const { spawn } = require('child_process');
const path = require('path');

// Test Figma tools
// You'll need to provide a real Figma file URL for testing

// Example Figma file URL - replace with your own
const FIGMA_FILE_URL = "https://www.figma.com/file/h9ID5bx5puEzVpDBr5UbpJ/Pricing-Engine";

async function testFigmaTool(toolName, args) {
  return new Promise((resolve, reject) => {
    const request = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    };

    const mcpServer = spawn('node', [path.join(__dirname, '..', '..', 'mcp-server', 'build', 'index.js')]);
    let responseBuffer = '';
    let errorBuffer = '';

    mcpServer.stdout.on('data', (data) => {
      responseBuffer += data.toString();
      
      const lines = responseBuffer.split('\n');
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line) {
          try {
            const response = JSON.parse(line);
            if (response.result || response.error) {
              console.log(`\n${toolName} result:`);
              console.log('-------------------');
              if (response.result) {
                console.log(response.result.content[0].text);
              } else {
                console.log('Error:', response.error);
              }
              mcpServer.kill();
              resolve(response);
            }
          } catch (e) {
            // Not valid JSON yet, continue buffering
          }
        }
      }
      responseBuffer = lines[lines.length - 1];
    });

    mcpServer.stderr.on('data', (data) => {
      errorBuffer += data.toString();
    });

    mcpServer.on('error', (error) => {
      console.error('Failed to start MCP server:', error);
      reject(error);
    });

    mcpServer.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error('Server stderr:', errorBuffer);
      }
    });

    // Send request after brief delay
    setTimeout(() => {
      mcpServer.stdin.write(JSON.stringify(request) + '\n');
    }, 100);

    // Timeout after 10 seconds (Figma API calls can take a moment)
    setTimeout(() => {
      mcpServer.kill();
      resolve(null);
    }, 10000);
  });
}

async function runTests() {
  console.log('🎨 Testing Figma Integration Tools\n');
  console.log('Note: You need to provide a real Figma file URL in the script for testing.\n');
  
  // Test 1: List components (using a public Figma file)
  console.log('Test 1: Listing Figma components...');
  console.log('Using URL:', FIGMA_FILE_URL);
  
  if (FIGMA_FILE_URL.includes('EXAMPLE')) {
    console.log('\n⚠️  Please replace FIGMA_FILE_URL in the script with a real Figma file URL!');
    console.log('You can use any Figma file you have access to.');
    console.log('The URL should look like: https://www.figma.com/file/ABC123XYZ/Your-File-Name\n');
    return;
  }
  
  await testFigmaTool('list_figma_components', {
    fileUrl: FIGMA_FILE_URL
  });
  
  // Test 2: Import from Figma (if you have a specific node)
  console.log('\nTest 2: Importing from Figma...');
  await testFigmaTool('import_from_figma', {
    fileUrl: FIGMA_FILE_URL
    // You can add nodeId here if you want to import a specific component
    // nodeId: "123:456"
  });
  
  console.log('\n✅ Figma integration tests complete!');
}

runTests().catch(console.error);