#!/usr/bin/env node

// Test script to verify theme base file generation

import { generateReactProject } from './build/lib/generators/reactProjectGenerator.js';

const config = {
  featureName: 'ThemeBaseTest',
  componentName: 'ThemeBaseTestGrid',
  columns: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' }
  ],
  sampleData: [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' }
  ],
  uniqueIdField: 'id',
  displayTitle: 'Theme Base Test',
  storageKey: 'themeBaseTestGrid',
  dataConstName: 'themeBaseTestData',
  hookName: 'useThemeBaseTestData',
  getDataFunctionName: 'getThemeBaseTestData'
};

console.log('Testing theme base file generation...\n');

const files = generateReactProject(config);

// Check for theme base files
const themeBaseFiles = files.filter(f => 
  f.text.includes('src/Theming/ThemeBase/') || 
  f.text.includes('ThemeBase')
);

console.log(`Found ${themeBaseFiles.length} theme base files:`);
themeBaseFiles.forEach(file => {
  const match = file.text.match(/\*\*(.+?)\*\*/);
  if (match) {
    console.log(`  - ${match[1]}`);
  }
});

// Check specific files
const expectedFiles = [
  'src/Theming/ThemeBase/base.less',
  'src/Theming/ThemeBase/light.less',
  'src/Theming/ThemeBase/dark.less',
  'src/Theming/ThemeBase/darkMapTheme.js'
];

console.log('\nChecking for expected files:');
expectedFiles.forEach(expectedFile => {
  const found = files.some(f => f.text.includes(expectedFile));
  console.log(`  ${found ? '✓' : '✗'} ${expectedFile}`);
});

console.log('\nTheme base file generation test complete!');
