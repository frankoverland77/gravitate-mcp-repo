# Self-Service UI Agent: Technical Architecture Spec

**Status:** Draft / Proposal  
**Author:** Rebecca Page  
**Date:** 2026-04-08  
**Audience:** Engineering team, Platform/Infra team

---

## Problem Statement

Non-technical stakeholders (delivery, support, product) frequently need small UI changes: fixing a unit label, adding a column to a grid, adjusting display formatting. Today, every change — no matter how trivial — requires a developer to context-switch, make the fix, open a PR, and get it reviewed. This creates bottleneck delays for simple changes and pulls engineers away from higher-value work.

## Proposed Solution

A web-accessible tool that allows non-technical users to describe UI changes in plain language. An AI agent interprets the request, makes the code change in an isolated environment, and presents a live preview. A developer then reviews and merges the resulting PR.

A working prototype exists running locally via Docker. This spec proposes the architecture for deploying it as a shared internal tool.

---

## Architecture Overview

The system has four components:

```
+------------------+       +-------------------+       +---------------------+
|                  |       |                   |       |                     |
|   Chat UI        | <---> |   Orchestrator    | <---> |  Ephemeral Pod      |
|   (Web app)      |       |   (Backend svc)   |       |  (AKS)              |
|                  |       |                   |       |                     |
+------------------+       +-------------------+       |  - Repo clone       |
                                                       |  - Dev server       |
                                                       |  - Claude Code      |
                                    +----------------> |  - Preview (port)   |
                                    |                  |                     |
                           +--------+--------+         +---------------------+
                           |                 |
                           |  Preview Proxy  |
                           |  (Ingress)      |
                           |                 |
                           +-----------------+
```

### Component 1: Chat UI

A web interface where the non-technical user types their request and sees the agent's responses.

**Options for hosting:**

- **A route within gravitate.net** behind a permission/role check (e.g., `/admin/agent` or similar). Keeps it discoverable and uses existing auth.
- **A standalone lightweight app** with its own auth. More isolation, but another thing to deploy and maintain.

**Recommendation:** A route within the existing app is simpler if the permission model supports it. If not, a standalone React app deployed to AKS alongside other services.

**Key features:**

- Chat message input/output
- Live preview iframe or link to the ephemeral environment
- Session management (start new session, resume, end)
- Status indicators (container spinning up, agent working, preview ready)

### Component 2: Orchestrator

A backend service that manages the lifecycle of ephemeral containers and proxies communication between the chat UI and the agent running inside each container.

**Responsibilities:**

- Receive chat messages from the UI, forward to the agent in the correct pod
- Provision new pods when a session starts
- Tear down pods after idle timeout (suggested: 30 minutes)
- Track active sessions and their associated pods
- Enforce concurrency limits (start with max 5 concurrent sessions)

**Implementation:** A lightweight Node.js or Python service running as a deployment on the existing AKS cluster. Communicates with the Kubernetes API to manage pods. Could use WebSockets for real-time chat relay.

**Alternative approach:** Instead of a custom orchestrator, consider whether the Claude Agent SDK could serve as the orchestration layer. This would handle the LLM interaction directly while a thin wrapper manages container lifecycle. This is an open question that depends on how the prototype currently bridges chat to Claude Code.

### Component 3: Ephemeral Pod (AKS)

Each user session gets a dedicated Kubernetes pod. The pod contains everything needed to run the frontend dev environment and the AI agent.

**What runs inside the pod:**

- A clone of the gravitate.net frontend (pre-installed in the Docker image)
- The dev server (`yarn start`)
- Claude Code (or a custom agent via Claude Agent SDK / Anthropic API)
- The skill files and documentation from excalibrr-mcp-server (pre-installed in image)

**Pod lifecycle:**

1. User starts a session via the chat UI
2. Orchestrator creates a Kubernetes Job or Deployment from the pre-baked image
3. Pod starts, runs `git pull` to get latest code, starts the dev server
4. Agent begins accepting chat messages
5. User interacts, agent makes changes, dev server hot-reloads
6. When the user is satisfied, agent commits to a new branch and opens a PR
7. Pod is torn down after idle timeout or user ends session

**Resource allocation (starting point):**

- CPU: 2 cores per pod
- Memory: 4 GB per pod
- Storage: ephemeral (no persistent volume needed)
- Max concurrent pods: 5 (adjustable)

### Component 4: Preview Proxy

Routes external requests to the correct pod's dev server port so the user can see their changes live.

**Approach:** Use the existing AKS ingress controller (likely nginx-ingress or Azure Application Gateway) to route based on a session identifier. Each session gets a URL like:

```
https://agent-preview-{session-id}.gravitate.energy
```

Or, if wildcard DNS is too complex to set up initially:

```
https://agent-preview.gravitate.energy/{session-id}/
```

The orchestrator registers/deregisters ingress rules as pods come and go.

---

## Pre-Baked Docker Image Strategy

The single biggest UX risk is cold start time. Cloning the repo and running `yarn install` on every session start would take 2-5+ minutes. The fix is to pre-bake as much as possible into the Docker image.

### Image Build Pipeline

**Trigger:** Nightly, or on every merge to the main branch (via TeamCity)

**Build stages:**

```dockerfile
# Stage 1: Install dependencies (has NPM token, not persisted in final image)
FROM node:20-alpine AS deps
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
RUN rm -f ~/.npmrc

# Stage 2: Runtime image (no secrets)
FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install Claude Code (or Agent SDK runtime)
# [Details TBD based on agent approach]

# Copy skill files and documentation
COPY excalibrr-skills/ /app/.claude/skills/

# The entrypoint pulls latest code and starts the dev server
COPY entrypoint.sh /entrypoint.sh
CMD ["/entrypoint.sh"]
```

**Entrypoint script:**

```bash
#!/bin/bash
# Pull latest changes (image has full clone from build time)
git pull origin main

# Start dev server in background, pointing at deployed backend
export VITE_API_BASE_URL=https://api.gravitate.energy
yarn start &

# Start the agent listener (receives chat messages from orchestrator)
# [Implementation depends on agent approach]
```

**Image registry:** Azure Container Registry (ACR), which is already in use.

**Expected cold start with pre-baked image:** 15-45 seconds (git pull + dev server startup). This is acceptable for the use case — the user can see a "spinning up your environment" message during this time.

### Secret Management

| Secret | When Needed | Where It Lives |
|--------|-------------|----------------|
| NPM token (private registry) | Image build time only | TeamCity build parameter |
| Anthropic API key (for Claude) | Pod runtime | Kubernetes Secret, injected as env var |
| Backend API credentials (if any) | Pod runtime | Kubernetes Secret or Azure Key Vault |
| Git credentials (for branching/PR) | Pod runtime | Kubernetes Secret (GitHub PAT or deploy key) |

The NPM token **never** reaches the running pod. It exists only in the build stage and is discarded in the multi-stage Docker build.

---

## The Agent: Claude Code vs. Custom Agent

This is the most consequential architectural decision and needs input from the prototype developer.

### Option A: Claude Code in the Container

The current prototype runs Claude Code directly. Claude Code is a full-featured coding agent with file read/write/edit, shell access, and automatic CLAUDE.md ingestion.

**Pros:**

- Already working in the prototype
- Automatically picks up CLAUDE.md and skill files from the repo
- Full codebase understanding out of the box
- Maintained by Anthropic — you get improvements for free

**Cons:**

- Claude Code is a CLI tool designed for terminal interaction; wrapping it behind a web chat has friction
- Less control over the UX (message formatting, streaming, error handling)
- Dependency on Claude Code's CLI interface stability
- Licensing/usage model may not fit a multi-user deployed service (needs verification)

**Key question:** How is the prototype currently bridging the web chat UI to Claude Code's CLI? Is it using `--print` mode, piping stdin/stdout, or something else?

### Option B: Custom Agent via Claude Agent SDK / Anthropic API

Build a purpose-built agent using the Anthropic API with tool use. Define a constrained set of tools (read file, edit file, run shell command, take screenshot of preview, create git branch, open PR).

**Pros:**

- Full control over the chat protocol and UX
- Can constrain the agent's capabilities (e.g., prevent it from modifying backend code, limit to certain directories)
- Cleaner integration with the web chat UI
- Can inject skill docs as system prompt context directly
- No dependency on Claude Code CLI stability

**Cons:**

- Significantly more engineering effort to build and maintain
- Need to implement tool definitions, error handling, streaming, context management
- Risk of building a worse version of what Claude Code already does

### Recommendation

Start with Option A (Claude Code) since it's already working. Investigate the licensing question immediately. If Claude Code can be deployed as a multi-user service, optimize the chat bridge. If it can't, or if the UX limitations are too severe, plan the migration to Option B.

---

## Monorepo Considerations (gravitate.net)

The prototype works with a non-monorepo (BB). Gravitate.net is a monorepo. Key considerations:

**Image size:** The full monorepo clone + `node_modules` will be larger. Estimate the image size and ensure it's within acceptable limits for ACR and pod pull times.

**Sparse checkout:** If the monorepo is very large, consider `git sparse-checkout` to pull only the frontend directory. This only works if the frontend has no cross-workspace dependencies that need to be present on disk.

**Yarn workspaces:** If gravitate.net uses Yarn workspaces, `yarn install` at the root installs everything. You may need `yarn workspace @gravitate/frontend install` (or equivalent) to limit the install scope.

**Dev server:** Confirm that `yarn start` (or the equivalent workspace command) works standalone when the backend workspace isn't present. It should if env vars point the API calls at the deployed backend.

**Action item:** Run the frontend workspace in isolation on a developer's machine, pointing at the deployed backend, and confirm everything works. This validates the fundamental assumption before building any infrastructure.

---

## Context Injection: What the Agent Needs to Know

The agent's output quality depends entirely on the context it receives about the codebase's component vocabulary and patterns. The excalibrr-mcp-server repo already has this documentation:

### Already Available (in this repo)

| Asset | Location | Purpose |
|-------|----------|---------|
| CLAUDE.md | Root | Common mistakes, mandatory workflow, dev commands |
| Solutions Demo Builder skill | `demo/skills/solutions-demo-builder/SKILL.md` | End-to-end workflow for building UI features |
| Component API reference | `demo/skills/.../references/component-api.md` | Props, anti-patterns, correct usage |
| Grid patterns | `demo/skills/.../references/grid-patterns.md` | GraviGrid setup, columns, bulk editing |
| Form patterns | `demo/skills/.../references/form-patterns.md` | Form + modal patterns |
| Layout patterns | `demo/skills/.../references/layout-patterns.md` | Horizontal/Vertical, spacing, CSS vars |
| Feature structure | `demo/skills/.../references/feature-structure.md` | Folder layout, scaffolding |
| Demo app conventions | `demo/skills/.../references/demo-app-conventions.md` | Route registration, theming |
| Rule files (.mdc) | `docs/rules/` | 11 rule files covering component usage, CSS, theming, etc. |

### Needs to Be Created / Ported for gravitate.net

- **Gravitate.net-specific patterns:** API layer conventions, state management approach, environment configuration
- **Navigation/routing specifics:** How gravitate.net's nav differs from the demo app
- **Data fetching patterns:** How API calls are structured, auth headers, error handling
- **Testing expectations:** If the agent should run tests before committing

### Delivery Mechanism

If using Claude Code (Option A): Place CLAUDE.md and skill files in the repo root. Claude Code picks them up automatically.

If using a custom agent (Option B): Inject the documentation as system prompt context when initializing the agent for each session.

---

## Git Workflow

1. Agent creates a feature branch: `agent/{session-id}/{short-description}`
2. Agent makes changes and commits with a descriptive message
3. Agent opens a PR against the main development branch
4. PR includes:
   - Description of what was changed and why (from the chat conversation)
   - Screenshot of the preview (if possible)
   - Link back to the chat session (for context)
5. A developer reviews the PR, requests changes or approves
6. Developer merges

**Guardrails:**

- Agent can only modify files in the frontend directory
- Agent cannot modify CI/CD configuration, environment files, or infrastructure code
- Agent cannot merge its own PRs
- Agent commits are clearly attributed (e.g., `Co-Authored-By: Gravitate Agent`)

---

## Cost Estimate (Rough)

Assuming 3-5 concurrent sessions, each lasting ~30 minutes:

| Item | Cost Model | Estimate |
|------|-----------|----------|
| AKS pod compute (2 CPU, 4 GB) | ~$0.10/hr per pod | ~$15-25/month |
| ACR image storage | ~$5/month (Basic tier) | $5/month |
| Anthropic API usage (Claude) | ~$0.01-0.05 per interaction | $50-200/month depending on volume |
| Ingress / networking | Included in AKS | $0 incremental |
| **Total** | | **~$70-230/month** |

These are rough numbers. The Anthropic API cost depends heavily on conversation length and how many tool calls the agent makes per interaction. The Claude Code licensing model (if using Option A) may have its own cost structure.

---

## Open Questions

| # | Question | Owner | Blocking? |
|---|----------|-------|-----------|
| 1 | How does the prototype bridge the web chat UI to Claude Code? (stdin/stdout pipe? `--print` mode? WebSocket?) | Prototype developer | Yes |
| 2 | Can Claude Code be deployed as a multi-user service, or is it licensed per-developer? | Rebecca / Anthropic | Yes |
| 3 | What cloud provider are we on — Azure or GCP? (Infra confirms) | Platform team | Yes |
| 4 | Can the gravitate.net frontend run standalone with `yarn start` pointing at the deployed backend? | Rebecca / Frontend team | Yes |
| 5 | What's the actual image size for the monorepo with `node_modules`? | TBD | No |
| 6 | Does the prototype use any codebase indexing or RAG, or is it pure Claude Code with CLAUDE.md? | Prototype developer | No |
| 7 | What auth mechanism should gate access to the agent? (Existing app roles? Separate?) | Product / Engineering | No |
| 8 | Should the agent be able to run the existing test suite before committing? | Engineering | No |
| 9 | What's the acceptable cold start time for the UX? | Product | No |

---

## Suggested Next Steps

1. **Immediate (this week):**
   - Get answers to blocking questions #1-4
   - Get the Dockerfile and chat bridge code from the prototype developer

2. **Spike (next 1-2 weeks):**
   - Build the pre-baked Docker image for the gravitate.net frontend
   - Measure cold start time (git pull + dev server startup)
   - Test the frontend running standalone against the deployed backend
   - Clarify Claude Code licensing for deployed use

3. **Build (2-4 weeks):**
   - Orchestrator service (pod lifecycle management)
   - Chat UI (basic, iterate later)
   - Ingress/preview routing
   - Port skill docs from excalibrr-mcp-server into gravitate.net repo

4. **Validate (1 week):**
   - End-to-end test: non-technical user makes a request, sees preview, PR is opened
   - Measure: agent accuracy, cold start time, total time-to-PR

---

## Appendix: Cloud Provider Alternatives

If the cloud provider turns out to be GCP instead of Azure:

| Concern | Azure (AKS) | GCP Alternative |
|---------|-------------|-----------------|
| Ephemeral containers | AKS pods | Cloud Run (scale-to-zero built in, simpler) |
| Image registry | ACR | Artifact Registry |
| Secrets | Key Vault / K8s Secrets | Secret Manager |
| Ingress/preview URLs | Nginx Ingress / App Gateway | Cloud Run (automatic per-service URLs) |

Cloud Run on GCP would actually simplify the architecture — it handles ingress, scaling, and per-session URLs natively, potentially eliminating the need for a separate preview proxy component.

If on AWS: ECS Fargate for compute, ECR for images, Secrets Manager for secrets, ALB for ingress.
