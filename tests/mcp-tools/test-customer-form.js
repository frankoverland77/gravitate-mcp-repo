const { spawn } = require('child_process');
const path = require('path');

// Test data for creating a customer management form with complex fields
const createFormRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "create_form_demo",
    arguments: {
      name: "CustomerForm",
      type: "management",
      title: "Customer Management",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          placeholder: "Enter first name"
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          placeholder: "Enter last name"
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "customer@example.com"
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "text",
          placeholder: "+1 (555) 123-4567"
        },
        {
          name: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          required: true
        },
        {
          name: "membershipPeriod",
          label: "Membership Period",
          type: "dateRange"
        },
        {
          name: "customerType",
          label: "Customer Type",
          type: "select",
          required: true,
          options: ["Regular", "Premium", "VIP", "Corporate"]
        },
        {
          name: "creditLimit",
          label: "Credit Limit",
          type: "number",
          placeholder: "10000"
        },
        {
          name: "activeAccount",
          label: "Active Account",
          type: "switch"
        },
        {
          name: "emailNotifications",
          label: "Receive Email Notifications",
          type: "checkbox"
        },
        {
          name: "smsNotifications",
          label: "Receive SMS Notifications",
          type: "checkbox"
        },
        {
          name: "newsletter",
          label: "Subscribe to Newsletter",
          type: "checkbox"
        }
      ],
      actions: [
        { type: "reset", label: "Reset Form", theme: "default" },
        { type: "cancel", label: "Cancel", theme: "default" },
        { type: "submit", label: "Save Customer", theme: "success" }
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
  console.log('Sending create_form_demo request for CustomerForm...');
  mcpServer.stdin.write(JSON.stringify(createFormRequest) + '\n');
}, 100);

// Timeout after 5 seconds
setTimeout(() => {
  console.log('Timeout - killing server');
  mcpServer.kill();
  process.exit(1);
}, 5000);