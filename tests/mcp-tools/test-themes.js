import { changeThemeTool } from './mcp-server/build/tools/changeTheme.js';

async function testThemes() {
  console.log('🎨 Testing Theme Changes...\n');
  
  const themes = ['OSP', 'BP', 'PE'];
  
  for (const theme of themes) {
    try {
      console.log(`Testing theme: ${theme}`);
      
      const result = await changeThemeTool({
        demoName: "InventoryGrid",
        theme: theme
      });
      
      console.log('✅ Success:', result.content[0].text);
      console.log('---\n');
      
    } catch (error) {
      console.error(`❌ Error with ${theme}:`, error.message);
      console.log('---\n');
    }
  }
}

testThemes();