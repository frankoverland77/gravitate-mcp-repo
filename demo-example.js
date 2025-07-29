#!/usr/bin/env node

// Simple test to generate Apple Pie Markets example
console.log('🚀 Testing Excalibrr MCP Server - Apple Pie Markets Example')
console.log('This will generate a complete React project for your designer to use.')

// Test data for Apple Pie Markets
const testRequest = {
  featureName: "ApplePieMarkets",
  columns: [
    { field: "id", headerName: "Market ID" },
    { field: "name", headerName: "Market Name" },
    { field: "location", headerName: "Location" },
    { field: "pricePerPie", headerName: "Price per Pie", type: "numericColumn" },
    { field: "stockCount", headerName: "Pies in Stock", type: "numericColumn" },
    { field: "lastDelivery", headerName: "Last Delivery", type: "dateColumn" }
  ],
  sampleData: [
    { 
      id: 1, 
      name: "Downtown Farmer's Market", 
      location: "Main Street", 
      pricePerPie: 12.99, 
      stockCount: 24,
      lastDelivery: "2024-01-15"
    },
    { 
      id: 2, 
      name: "Suburban Market Square", 
      location: "Oak Avenue", 
      pricePerPie: 10.99, 
      stockCount: 18,
      lastDelivery: "2024-01-14"
    },
    { 
      id: 3, 
      name: "University District Market", 
      location: "College Row", 
      pricePerPie: 8.99, 
      stockCount: 32,
      lastDelivery: "2024-01-16"
    }
  ],
  uniqueIdField: "id",
  title: "Apple Pie Markets",
  generateFullProject: true
}

console.log('📊 Sample data includes:')
console.log(`  • ${testRequest.sampleData.length} market locations`)
console.log(`  • ${testRequest.columns.length} data columns`)
console.log(`  • Unique ID field: ${testRequest.uniqueIdField}`)

console.log('\n✨ This will generate:')
console.log('  • Complete React project with package.json')
console.log('  • Full Excalibrr navigation (sidebar + top nav)')
console.log('  • Working data grid with sample data')
console.log('  • Mock navigation sections (PricingEngine, Admin)')
console.log('  • PE theme configuration')
console.log('  • TypeScript throughout')
console.log('  • Ready-to-run demo for stakeholders')

console.log('\n🎯 Perfect for your designer to:')
console.log('  • Show working demos to clients')
console.log('  • Iterate on design concepts')
console.log('  • Hand off complete examples to developers')

console.log('\n✅ MCP Server Enhanced and Ready!')
console.log('Use the generate_grid_component tool with the above data to create the project.')
