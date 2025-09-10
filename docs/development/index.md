# 🛠️ Development Documentation

This directory contains internal development guidelines for maintaining and extending the Excalibrr MCP Server's component knowledge base. These files help ensure consistency and quality when adding new component examples that power demo generation.

## 📋 Files Overview

### **Server Management Rules**

Server management rules have been moved to `docs/rules/server-management.mdc` where Claude can automatically follow them when managing development servers.

### **component-examples-guide.md**

- **Purpose**: Coding standards and patterns for component examples in the knowledge base
- **Audience**: Developers adding new component examples to MCP server
- **Content**: File structure conventions, TypeScript patterns, MCP tool integration

### **component-examples-checklist.md**

- **Purpose**: Quality assurance checklist for component examples
- **Audience**: Developers and reviewers working with component examples
- **Content**: Validation criteria, MCP tool compatibility, production standards

### **component-example-template.md**

- **Purpose**: Working template for creating new component example files
- **Audience**: Developers adding new components to the knowledge base
- **Content**: File structure template, example patterns, integration guidelines

## 🎯 Quick Start Workflows

### Adding a New Component to Knowledge Base
1. 📖 Read **component-examples-guide.md** - Understand the standards and patterns
2. 📋 Use **component-example-template.md** - Copy the template structure  
3. ✅ Validate with **component-examples-checklist.md** - Ensure quality before committing

### Code Review Process
1. ✅ Run through **component-examples-checklist.md** systematically
2. 🔍 Verify MCP tool compatibility and theme support
3. 🧪 Test example code works with demo generation

### Troubleshooting
- **Server issues**: Check `docs/rules/server-management.mdc` 
- **Demo generation fails**: Verify examples follow the guide standards
- **Theme problems**: Ensure Excalibrr components are used correctly

## 📁 Organization

These files are separated from user documentation because they are:

- **Internal development guidelines** (not user-facing)
- **Technical implementation details** (not setup instructions)
- **Code quality standards** (not usage examples)

User-facing documentation remains in the parent `/docs/` directory.
