# RFP Management - Conversation Archive

This document captures meeting transcripts, decisions, and action items from RFP Management development sessions.

---

## [CONVERSATION: 2026-01-19 | Type: Product-Design Daily Sync]
Participants: Reece Johnson (Product), Agustin Reichhardt (Product), Frank Overland (Design)
Project: RFP Management
Prior Reference: Session 3 (2026-01-16) from project-context.md

### Summary
Product and design team reviewed prototype for RFP Management feature, focusing on round progression mechanics, supplier comparison workflow, parameter configuration, and bid editing capabilities. Major decisions made around round completion requirements, parameter alignment with Contract Measurement patterns, and bid editing workflow.

### Key Points
- Reviewed current prototype implementation showing RFP list tiles, round comparison screens, and supplier matrix
- Discussed round progression mechanics - users should be able to view past rounds without it being a "one-way door"
- Identified issues with parameter configuration modal mixing historical data settings (price/volume lookback) with threshold configurations (ratability, allocation, penalties)
- Reviewed supplier comparison table showing average pricing, volume, ratability, allocation, penalties, and issues
- Discussed need for product-group-level price breakdowns rather than single average across all products
- Examined bottom detail grid showing product/location level pricing breakdown
- Reviewed filtering concept where bottom grid filters would update top summary grid responsively
- Discussed bid editing workflow and removed "send back" concept in favor of explicit bid editing
- Identified need for version tracking on bid edits to show what changed from round to round
- Discussed supplier offering multiple bids (Valero Option 1 vs Valero Option 2)

### Decisions
- [DECIDED] Round progression is NOT a one-way door - users must be able to view previous rounds and their decisions | Decided by: Reece Johnson, Agustin Reichhardt
- [DECIDED] Before advancing to next round, ALL suppliers in current round must have a disposition (advance, eliminate, or pending review) | Decided by: Agustin Reichhardt
- [DECIDED] Round advancement is blocked until all suppliers are processed - show validation message explaining incomplete round | Decided by: Team consensus
- [DECIDED] Eliminate action requires explicit user selection with a note/reason explaining why supplier was eliminated | Decided by: Agustin Reichhardt, Reece Johnson
- [DECIDED] Eliminated suppliers table shows elimination reason in a new "Reason" column | Decided by: Agustin Reichhardt
- [DECIDED] Parameters modal should separate into two concepts: (1) Price/Volume history lookback settings aligned with Contract Measurement, (2) Threshold configurations (ratability, allocation, penalties) | Decided by: Reece Johnson
- [DECIDED] Remove "Send Back" action entirely from the UI | Decided by: Reece Johnson
- [DECIDED] "Edit Bid" allows inline modification of supplier bid details with version tracking on the backend | Decided by: Reece Johnson, Frank Overland
- [DECIDED] Average price should break down by product group (collapsible rows) rather than single average across all products | Decided by: Agustin Reichhardt
- [DECIDED] Bottom detail grid filtering should update top summary grid responsively (e.g., filter to gasoline only, top grid shows gasoline-only averages) | Decided by: Reece Johnson
- [DECIDED] Issues column should show popup on click explaining what thresholds were violated | Decided by: Frank Overland, Agustin Reichhardt
- [DECIDED] Incumbent supplier pin/unpin action should be removed - incumbent is locked to first position | Decided by: Frank Overland
- [DECIDED] Allocation changes from "Flexible/Moderate/Strict" to time-period based: "Daily/Weekly/Tri-Weekly/Monthly/Quarterly" | Decided by: Reece Johnson, Agustin Reichhardt
- [DECIDED] Ratability remains as explicit volume number (not percentage range) pending customer feedback | Decided by: Reece Johnson
- [DECIDED] Total Volume row represents total contract volume, not monthly allocation | Decided by: Agustin Reichhardt
- [DECIDED] Support multiple bids from same supplier with naming pattern "Supplier Name - Bid Description" (e.g., "Valero - Best Price", "Valero - Best Volume") | Decided by: Reece Johnson
- [DECIDED] RFP creation defines: contract details, product/locations with desired volumes, incumbent contract (if any), invited suppliers (creates columns) | Decided by: Reece Johnson
- [DECIDED] RFP responses are interchangeable with "price scenarios" from Contract Measurement - same editing workflow applies | Decided by: Reece Johnson
- [DECIDED] When advancing to next round, selected suppliers' columns carry forward with their current price scenarios as defaults, then user edits before comparison | Decided by: Reece Johnson
- [DECIDED] Bid editing supports three methods: (1) formula-based, (2) benchmark-based, (3) spreadsheet upload - same as Contract Measurement | Decided by: Reece Johnson
- [DECIDED] Scenarios have "working" and "ready to compare" states - cannot progress round until all scenarios marked ready | Decided by: Reece Johnson
- [DECIDED] Each bid edit creates a new version with metadata (version number, edited by, timestamp) for audit trail | Decided by: Frank Overland, Reece Johnson

### Action Items
- [OWNER: Frank Overland] Fix tiles on RFP list page to be clickable for all statuses (draft, any round stage) | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Fix visual details - tag styling, arrow positioning on list page | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Add issue details display - either short message in column or click popup showing threshold violations | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Remove pin/unpin action from incumbent supplier column | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Implement manual column reordering for supplier columns (drag to reorder) | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Add parameters display to round screen showing current pricing, volume, threshold settings | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Change round progression to allow toggling between rounds without "ending" previous rounds | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Restructure elimination flow - add explicit "Eliminate" action with required note/reason field | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Add "Reason" column to eliminated suppliers table showing why each was eliminated | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Block round advancement until all suppliers have disposition, show validation message | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Restructure parameters modal to separate price/volume history from threshold configuration | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Add product group breakdown to average price row (collapsible rows showing gasoline, diesel separately) | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Implement same pattern for total volume row breakdown by product group | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Implement responsive filtering - bottom grid filters update top summary grid calculations | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Remove "Send Back" button from comparison toolbar | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Change allocation options from Flexible/Moderate/Strict to Daily/Weekly/Tri-Weekly/Monthly/Quarterly | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Add support for multiple bids from same supplier with subtitle naming | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Implement bid editing workflow with scenario status (working/ready to compare) | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Add version tracking to bid edits (version number, editor, timestamp) | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Design bulk change modal for editing multiple details at once (e.g., adjust diff across all P66 products) | Due: unspecified | Status: OPEN
- [OWNER: Frank Overland] Push next iteration to Vercel for review | Due: Tomorrow (2026-01-20) | Status: OPEN
- [OWNER: Reece Johnson] Send Slack message with allocation change details (Flexible/Moderate/Strict → time periods) | Due: unspecified | Status: OPEN
- [OWNER: Product Team] Gather customer feedback on ratability representation (volume vs percentage) from retail customers this week | Due: This week | Status: OPEN
- [OWNER: Product Team] Validate parameter importance ranking concept with customers | Due: unspecified | Status: OPEN

### Open Threads
- How to display Gravitate AI recommendation logic based on weighted parameter importance (if user ranks penalties as least important, recommendation should deprioritize penalty violations)
- Whether ratability should be percentage-based thresholds or explicit volume numbers - pending customer feedback
- Bulk change modal design and workflow details
- RFP creation flow design (not in scope for current iteration)
- How to visually distinguish bid versions and show what changed from round to round in the UI
- Should there be a "lagger" state for suppliers not yet processed in a round, or force all to be explicitly dispositioned

### Context Links
- Relates to: Session 3 (2026-01-16) - Multi-round support implementation
- Builds on: Sessions 1-3 establishing round progression, supplier matrix, elimination tracking
- Deferred from: RFP creation flow, bulk change implementation, historical round comparison with actual data diffs

---
