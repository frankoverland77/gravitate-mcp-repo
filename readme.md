# Excalibrr Demo Builder

AI-assisted demo environment for building Gravitate Selling Solutions feature prototypes using the [Excalibrr](https://github.com/gravitate-js/excalibrr) component library.

## Quick Start

```bash
yarn install    # Install dependencies
yarn dev        # Start the demo app (Vite dev server)
```

Then open the URL shown in your terminal (usually `http://localhost:5173`).

## What This Is

This repo is a **demo application** that showcases Gravitate product features built with Excalibrr components. It serves as:

- A **living reference** for how features should look and behave
- A **prototyping environment** for new feature designs
- A **training ground** for Claude Code to learn Excalibrr patterns and generate quality demos

The demo app contains 20 feature areas covering Online Selling Platform, Pricing Engine, Contract Management, RFP workflows, and more.

## Project Structure

```
excalibrr-demo-builder/
├── demo/                        # React/Vite demo application
│   ├── src/
│   │   ├── pages/               # 20 feature demo pages
│   │   ├── components/shared/   # Shared components and theme system
│   │   └── _Main/               # App shell and routing
│   ├── skills/                  # Claude Code skill definitions
│   │   └── solutions-demo-builder/
│   └── package.json
│
├── evals/                       # Evaluation framework
│   ├── src/
│   │   ├── cases/               # Test case definitions
│   │   ├── graders/             # Code quality + visual fidelity scoring
│   │   ├── runners/             # Eval orchestration
│   │   └── reporters/           # Console + HTML report output
│   └── reference-solutions/     # Ideal implementations for comparison
│
├── docs/                        # Documentation
│   ├── rules/                   # 15 code convention rules (.mdc)
│   ├── development/             # Component development guides
│   └── superpowers/specs/       # Full-build design specifications
│
├── .claude/                     # Claude Code configuration
│   ├── agents/                  # 9 specialized agents
│   ├── commands/                # 5 slash commands
│   └── skills/                  # 2 registered skills
│
└── CLAUDE.md                    # Development workflow and conventions
```

## Claude Code Integration

This repo is designed to work with [Claude Code](https://docs.anthropic.com/en/docs/claude-code). The AI tooling includes:

- **Skills** - `/excalibrr`, `/start-feature`, `/excalibrr-create`, `/excalibrr-patterns`, `/bulk-change`
- **Agents** - Specialized agents for component resolution, pattern retrieval, UI review, and more
- **Rules** - 15 `.mdc` rule files that enforce Excalibrr conventions during code generation
- **Evals** - Automated grading for code quality and visual fidelity

## Evals

```bash
yarn eval:quick    # Fast code quality check (no screenshots)
yarn eval          # Full eval suite with screenshots
yarn eval:report   # Generate HTML report with scores and screenshots
```

## Key Dependencies

| Package | Version |
|---------|---------|
| @gravitate-js/excalibrr | ^5.2.7 |
| antd | ^5.23.0 |
| ag-grid-react | ^30.2.1 |
| React | ^18.2.0 |
| Vite | 7.1.11 |

## Development Workflow

Before generating any Excalibrr component code with Claude Code:

1. Read `demo/skills/solutions-demo-builder/SKILL.md`
2. Follow the conventions in `CLAUDE.md`
3. Run the pre-commit hook before presenting: `git add <files> && git hook run pre-commit`