#!/bin/bash

# Quick rebuild and test font fix
echo "🔧 Quick rebuild with font fix..."

# Build
npm run build

# Test
echo ""
echo "🧪 Running font fix test..."
node test-font-fix.js

echo ""
echo "✅ Font fix build and test complete!"
