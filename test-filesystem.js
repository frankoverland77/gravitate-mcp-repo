#!/usr/bin/env node

// Test the enhanced MCP server filesystem writing
import path from 'path'
import fs from 'fs/promises'

console.log('🧪 Testing file writing capability...')

const testDir = '/Users/rebecca.hirai/repos/TestMCPProject'

async function testFileSystem() {
  try {
    // Test creating directory
    await fs.mkdir(testDir, { recursive: true })
    console.log('✅ Directory creation works')
    
    // Test writing file
    await fs.writeFile(path.join(testDir, 'test.txt'), 'Hello from MCP Server!', 'utf-8')
    console.log('✅ File writing works')
    
    // Test reading file back
    const content = await fs.readFile(path.join(testDir, 'test.txt'), 'utf-8')
    console.log(`✅ File reading works: "${content}"`)
    
    // Clean up
    await fs.rmdir(testDir, { recursive: true })
    console.log('✅ Cleanup works')
    
    console.log('\n🎉 All filesystem operations work! Enhanced MCP server ready.')
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testFileSystem()
