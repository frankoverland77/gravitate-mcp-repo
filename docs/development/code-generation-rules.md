# 🚨 Server Management Rules for Excalibrr MCP Server

## Core Operational Rules

### Rule #1: ONE SERVER PER PROJECT ⚡

**NEVER run multiple dev servers for the same project!**

- ❌ Bad: `yarn dev` while another server is already running
- ✅ Good: `yarn run dev:clean` (stops existing + starts fresh)

### Rule #2: CHECK BEFORE STARTING 🔍

**Always verify server state before starting:**

```bash
# Check what's running
yarn run dev:check
# or manual check
ps aux | grep vite | grep project-name
```

### Rule #3: USE CLEAN COMMANDS 🧹

**When in doubt, use clean commands:**

```bash
yarn run dev:clean    # Stops existing + starts fresh
yarn run stop         # Just stops servers
yarn run dev:check    # Just checks status
```

### Rule #4: PORT AWARENESS 📡

**Pay attention to actual ports in terminal output:**

- Look for: "Local: http://localhost:XXXX/"
- Don't assume port 3001 - it might auto-increment to 3002, 3003, etc.
- Update browser URL to match actual port

## Implementation in Generated Projects

### Package.json Scripts (Auto-Generated)

```json
{
  "scripts": {
    "dev": "vite",
    "dev:clean": "pkill -f 'vite.*projectname' || true && vite",
    "dev:check": "ps aux | grep vite | grep projectname || echo 'No servers running'",
    "stop": "pkill -f 'vite.*projectname' || true"
  }
}
```

### Generated Documentation

Every project now includes:

- `SERVER_MANAGEMENT.md` - Detailed server management guide
- `scripts/server-check.sh` - Utility script for server management

## Error Prevention

### "Port 3001 is in use, trying another one..."

**Cause**: Another server already running
**Solution**:

```bash
yarn run dev:clean
# Not just: yarn dev
```

### Multiple Browser Tabs on Different Ports

**Cause**: Started new servers without stopping old ones
**Solution**:

```bash
yarn run stop
yarn run dev
```

## Developer Workflow

### Starting Work Session

```bash
cd project-name
yarn run dev:check    # See what's running
yarn run dev:clean    # Start fresh
```

### Switching Between Projects

```bash
# In old project
yarn run stop

# In new project
yarn run dev:clean
```

### Debugging Issues

```bash
yarn run dev:check    # What's running?
yarn run stop         # Stop everything
yarn run dev          # Start clean
```

## MCP Server Integration

This rule system is automatically integrated into:

- ✅ **Package.json generation** - Includes server management scripts
- ✅ **Project scaffolding** - Adds documentation and utilities
- ✅ **README templates** - Includes usage instructions
- ✅ **Error handling** - Provides clear guidance

---

**Remember**: One server per project, check before starting, use clean commands! 🚀
