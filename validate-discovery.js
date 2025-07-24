#!/usr/bin/env node

// Validation: Check what our component scanner should find
import fs from 'fs/promises';
import path from 'path';

const EXCALIBRR_PATH = "/Users/rebecca.hirai/repos/excalibrr/src/components";

async function validateComponentDiscovery() {
    console.log("🔍 Validating Component Discovery");
    console.log("================================\n");

    try {
        // Step 1: Check if path exists
        console.log("1. Checking library path...");
        console.log(`   Path: ${EXCALIBRR_PATH}`);
        
        const pathExists = await fs.access(EXCALIBRR_PATH).then(() => true).catch(() => false);
        console.log(`   Exists: ${pathExists ? '✅' : '❌'}`);
        
        if (!pathExists) {
            console.log("❌ Library path not found!");
            return;
        }

        // Step 2: Check index.ts exports
        console.log("\n2. Reading component index...");
        const indexPath = path.join(EXCALIBRR_PATH, 'index.ts');
        const indexContent = await fs.readFile(indexPath, 'utf-8');
        
        const exportMatches = indexContent.match(/export\s+{\s*([^}]+)\s*}/g);
        const componentNames = [];
        
        if (exportMatches) {
            for (const match of exportMatches) {
                const components = match.replace(/export\s+{\s*|\s*}/g, '').split(',');
                for (const comp of components) {
                    const cleanName = comp.trim().split(' as ')[0].trim();
                    if (cleanName && !cleanName.startsWith('use') && !cleanName.includes('Provider')) {
                        componentNames.push(cleanName);
                    }
                }
            }
        }
        
        console.log(`   Found ${componentNames.length} exported components`);
        console.log(`   Examples: ${componentNames.slice(0, 5).join(', ')}...`);

        // Step 3: Check a few specific files
        console.log("\n3. Checking specific component files...");
        
        const testComponents = [
            { name: 'Horizontal', path: 'Layout/Horizontal.tsx' },
            { name: 'GraviGrid', path: 'GraviGrid/GraviGrid.tsx' },
            { name: 'Vertical', path: 'Layout/Vertical.tsx' }
        ];
        
        for (const comp of testComponents) {
            const filePath = path.join(EXCALIBRR_PATH, comp.path);
            const exists = await fs.access(filePath).then(() => true).catch(() => false);
            
            if (exists) {
                const content = await fs.readFile(filePath, 'utf-8');
                const hasInterface = content.includes('interface') || content.includes('type');
                const hasProps = content.match(/(\w+)Props/);
                
                console.log(`   ${comp.name}: ✅ exists, ${hasInterface ? '✅' : '❌'} has interface, ${hasProps ? '✅' : '❌'} has props`);
            } else {
                console.log(`   ${comp.name}: ❌ file not found`);
            }
        }

        console.log("\n✅ Validation complete!");
        console.log(`\n📊 Summary:`);
        console.log(`   - Expected to find ~${componentNames.length} components`);
        console.log(`   - Should extract props from interface definitions`);
        console.log(`   - Should categorize by file structure and content`);
        
    } catch (error) {
        console.error("❌ Validation failed:", error);
    }
}

validateComponentDiscovery();
