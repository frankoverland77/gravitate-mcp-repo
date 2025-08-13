#!/bin/bash

# Enhanced Visual Preview System Build Script
# This script builds the Excalibrr MCP Server with the new enhanced visual preview capabilities

echo "🔨 Building Excalibrr MCP Server with Enhanced Visual Previews..."
echo ""

# Change to the MCP server directory
cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the correct MCP server directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Build the project
echo "🏗️  Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🎨 Enhanced Visual Preview Features Added:"
    echo "   • generate_authentic_preview - Create previews with real Gravitate styling"
    echo "   • list_gravitate_themes - Show all available client themes"
    echo "   • compare_component_themes - Side-by-side theme comparisons"
    echo "   • generate_component_showcase - All variants in one view"
    echo ""
    echo "🎯 Key Improvements:"
    echo "   • Authentic Gravitate color palettes and fonts"
    echo "   • Professional sidebar navigation"
    echo "   • Real ag-Grid styling with proper borders and spacing"
    echo "   • Lato font integration"
    echo "   • Production-like layout and typography"
    echo "   • Proper status indicators and formatting"
    echo ""
    echo "📋 Available Themes:"
    echo "   • OSP - OSP Energy (dark green/teal)"
    echo "   • PE - Pricing Engine (blue/professional) [default]"
    echo "   • BP - BP Energy (BP branded colors)"
    echo "   • Plus: DKB, FHR, MURPHY, GROWMARK, MOTIVA, P66, SUNOCO"
    echo ""
    echo "🚀 Ready to test! Try these commands in Claude Desktop:"
    echo "   • generate_authentic_preview componentName:GraviGrid themeKey:PE"
    echo "   • list_gravitate_themes"
    echo "   • compare_component_themes componentName:GraviGrid themes:[\"PE\",\"OSP\",\"BP\"]"
    echo ""
    echo "📁 Previews will be saved to: ~/Desktop/excalibrr-previews/"
    echo ""
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
