#!/bin/bash

# Clean up Docker-related files for direct STDIO setup

echo "🧹 Cleaning up Docker files for STDIO-only setup"
echo "==============================================="
echo ""

# Files to remove
FILES_TO_REMOVE=(
    "docker-compose.yml"
    "start-excalibrr.sh" 
    "build-docker.sh"
    "manage-excalibrr.sh"
    "cleanup-excalibrr.sh"
    "diagnose-issue.sh"
    "fix-and-test.sh"
    "copy-projects-from-docker.sh"
    "start-excalibrr-http.sh"
    "setup-with-compose.sh"
    "setup-everything.sh"
)

# Remove files
for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        echo "🗑️  Removing: $file"
        rm -f "$file"
    fi
done

# Remove empty Docker directories
DIRS_TO_REMOVE=(
    "screenshots"
    "previews" 
    "generated"
)

for dir in "${DIRS_TO_REMOVE[@]}"; do
    if [ -d "$dir" ] && [ ! "$(ls -A "$dir")" ]; then
        echo "🗑️  Removing empty directory: $dir"
        rmdir "$dir"
    fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📦 Files kept for potential future use:"
echo "   • Dockerfile - for future containerization"
echo "   • .dockerignore - harmless to keep"
echo ""
echo "🎯 Your MCP server is now set up for direct STDIO use only."
echo "   Ready for Claude Desktop, Claude Code, and Cursor!"
echo ""
