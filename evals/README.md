# Excalibrr Demo Evals

Automated code quality and visual fidelity grading for demo pages.

## Quick Start

```bash
yarn eval:quick    # Code quality only, ~10 seconds
yarn eval          # Full suite with screenshots
yarn eval:report   # Generate HTML report
```

## What It Checks

**Code Quality** (19 anti-pattern rules)
- Excalibrr v5 API compliance (open vs visible, destroyOnHidden, items prop patterns)
- Layout prop conventions (gap, flex, height as direct props, not inline styles)
- Component usage (Excalibrr components instead of raw HTML elements)
- Page registration (pageConfig.tsx + AuthenticatedRoute.jsx)
- Import ordering (React, Excalibrr, AntD, local)
- ESLint violations

**Visual Fidelity**
- Theme wrapper compliance
- Hardcoded color detection (should use theme variables)
- Hardcoded pixel spacing (should use utility classes)
- Screenshot capture verification

## Scoring

Each case is scored 0-100 per dimension, then assigned a verdict:
- **PASS** (80+, no critical findings)
- **NEEDS_WORK** (60-79)
- **FAIL** (<60 or critical findings)

Severity weights: critical -20, major -8, minor -2.

## Test Cases (Tier 1)

| Case | Page | Tests |
|------|------|-------|
| smoke-simple-grid | GlobalTieredPricing | Basic grid with column defs |
| smoke-form-feature | ContractManagement | Forms and modal interactions |
| smoke-editable-grid | DeliveredPricing | Editable column definitions |
| smoke-dashboard | ProjectHub | Dashboard with layout components |
| smoke-full-feature | SubscriptionManagement | Multi-tab feature |
| smoke-osp-feature | OnlineSellingPlatform | Market/trading grid |
| smoke-design-system | DesignSystem | Component showcase |
| smoke-contract-measurement | ContractMeasurement | Measurement tracking grid |
| smoke-quotebook | QuotebookQoL | Multi-feature quotebook |
| smoke-price-management | PriceManagement | Pricing with sub-pages |

## Filtering

```bash
yarn eval -- --tags grid              # Only grid-tagged cases
yarn eval -- --case smoke-dashboard   # Single case
yarn eval -- --no-screenshots         # Skip visual checks
```

## Reference Solutions

`reference-solutions/` contains ideal implementations for comparison:

```bash
yarn eval:compare -- smoke-simple-grid
```

To add a new reference solution, create a file in the appropriate subdirectory matching the case's expected structure.

## Project Structure

```
evals/
├── src/
│   ├── cases/          # Test case definitions
│   ├── graders/        # Code quality + visual fidelity scoring
│   ├── runners/        # Eval orchestration + screenshot capture
│   ├── reporters/      # Console + HTML output
│   ├── analyzers/      # Transcript parsing + trends
│   └── scripts/        # CLI entry points
├── reference-solutions/
├── baselines/          # Saved baseline scores (generated)
└── reports/            # Output reports (generated)
```
