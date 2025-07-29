#!/usr/bin/env node

// Quick test to see if the enhanced MCP server compiles and works
import { generateReactProject } from "./build/lib/codeGenerators.js";

const testConfig = {
  featureName: "ApplePieMarkets",
  componentName: "ApplePieMarketsPage",
  columns: [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Market Name" },
    { field: "price", headerName: "Price per Pie" },
  ],
  sampleData: [
    { id: 1, name: "Downtown Market", price: 12.99 },
    { id: 2, name: "Suburban Market", price: 10.99 },
  ],
  uniqueIdField: "id",
  displayTitle: "Apple Pie Markets",
  storageKey: "ApplePieMarkets",
  dataConstName: "applePieMarketsData",
  hookName: "useApplePieMarkets",
  getDataFunctionName: "getApplePieMarketsData",
};

const testDependencies = {
  "@gravitate-js/excalibrr": "4.0.34-osp",
  "ag-grid-community": "^30.2.1",
  "ag-grid-react": "^30.2.1",
  "@tanstack/react-query": "^4.10.3",
  "react-router-dom": "6.16.0",
  react: "^18.2.0",
  "react-dom": "^18.2.0",
  typescript: "^4.7.4",
};

console.log("🧪 Testing React project generation...");

try {
  const files = generateReactProject(testConfig, testDependencies);
  console.log(`✅ Successfully generated ${files.length} files`);
  console.log("📄 Files generated:");
  files.forEach((file, index) => {
    const titleMatch = file.text.match(/\*\*(.*?)\*\*/);
    const fileName = titleMatch ? titleMatch[1] : `File ${index + 1}`;
    console.log(`  ${index + 1}. ${fileName}`);
  });
  console.log("\n🎉 Test passed! Enhanced MCP server is ready.");
} catch (error) {
  console.error("❌ Test failed:", error);
  process.exit(1);
}
