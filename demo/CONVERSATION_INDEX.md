# Master Conversation Index

This document serves as the canonical index of all conversation archives across projects in the Excalibrr Demo workspace.

---

## Project Registry

| Project | Description | Conversation Archive | Last Conversation | Context Document |
|---------|-------------|---------------------|-------------------|------------------|
| RFP Management | Request for Proposal supplier bidding and comparison feature within Contract Measurement | `/demo/src/pages/RFP/conversation-archive.md` | 2026-01-19 | `/demo/src/pages/RFP/project-context.md` |
| Contract Measurement | Contract performance benchmarking and scenario analysis | (not yet created) | N/A | `/demo/src/pages/ContractMeasurement/project-context.md` |
| Subscription Management | Subscription lifecycle and billing management | (not yet created) | N/A | `/demo/src/pages/SubscriptionManagement/PROJECT_CONTEXT.md` |

---

## Archive File Structure

Each project maintains its own conversation archive document located within the project folder structure:

```
demo/src/pages/{ProjectName}/
├── project-context.md          # Project scope, decisions, progress (READ-ONLY for archiving)
└── conversation-archive.md     # Meeting transcripts and conversations
```

---

## Document Purposes

### Conversation Archive (THIS SYSTEM)
- Captures meeting content, discussions, and action items
- Optimized for AI retrieval and future reference
- Maintains chronological record of decisions and their context
- Each entry stands alone but cross-references related entries

### Project Context (SEPARATE - READ-ONLY FOR ARCHIVING)
- Documents project scope, goals, current status
- Tracks implementation progress and technical decisions
- NOT edited by conversation archiving process
- Used as reference for conversation categorization

---

## Last Updated
2026-01-19 - Initial creation with RFP Management archive

---

## Usage Notes

When processing new conversation transcripts:
1. Identify project from transcript content
2. Check this index for existing archive location
3. Read project context document for terminology alignment
4. Append new conversation entry to archive
5. Update "Last Conversation" date in this index
6. DO NOT modify project context documents (read-only reference)
