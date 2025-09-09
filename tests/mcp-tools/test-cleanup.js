const { spawn } = require('child_process');
const path = require('path');

// Test cleanup for each demo
const demos = ['CustomerForm', 'ProductForm', 'TradeManagement'];

async function cleanupDemo(demoName) {
  return new Promise((resolve, reject) => {
    const cleanupRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "cleanup_demo",
        arguments: {
          name: demoName,
          force: true
        }
      }
    };

    const mcpServer = spawn('node', [path.join(__dirname, '..', '..', 'mcp-server', 'build', 'index.js')]);
    let responseBuffer = '';

    mcpServer.stdout.on('data', (data) => {
      responseBuffer += data.toString();
      
      const lines = responseBuffer.split('\n');
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line) {
          try {
            const response = JSON.parse(line);
            if (response.result || response.error) {
              console.log(`\n${demoName} cleanup result:`);
              console.log('-------------------');
              if (response.result) {
                console.log(response.result.content[0].text);
              } else {
                console.log('Error:', response.error);
              }
              mcpServer.kill();
              resolve();
            }
          } catch (e) {
            // Not valid JSON yet, continue buffering
          }
        }
      }
      responseBuffer = lines[lines.length - 1];
    });

    mcpServer.stderr.on('data', (data) => {
      // Ignore server startup messages
    });

    mcpServer.on('error', (error) => {
      console.error('Failed to start MCP server:', error);
      reject(error);
    });

    // Send request after brief delay
    setTimeout(() => {
      mcpServer.stdin.write(JSON.stringify(cleanupRequest) + '\n');
    }, 100);

    // Timeout after 3 seconds
    setTimeout(() => {
      mcpServer.kill();
      resolve();
    }, 3000);
  });
}

async function runCleanup() {
  console.log('🧹 Starting cleanup of all demo forms...\n');
  
  for (const demo of demos) {
    await cleanupDemo(demo);
  }
  
  console.log('\n✅ All demos cleaned up!');
}

runCleanup().catch(console.error);