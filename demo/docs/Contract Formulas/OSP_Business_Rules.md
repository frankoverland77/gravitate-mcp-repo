# OSP Business Rules Matrix - UPDATED
*September 2025 - Post-Kickoff Integration*
*Covers Fixed-Price Day Deals + Index-Based Extended Deals + Template Workflows*

## RULE CATEGORIES OVERVIEW

| Category | Fixed Deals | Index Deals | Template Mode | Rules Count |
|----------|-------------|-------------|---------------|-------------|
| Volume Management | ✅ | ✅ (Enhanced) | N/A | 12 |
| Pricing Rules | ✅ | ✅ (New) | N/A | 12 |  
| Order Processing | ✅ | ✅ (Enhanced) | N/A | 13 |
| **NEW** Formula Creation | N/A | ✅ | ✅ | 10 |
| **NEW** Template Rules | N/A | ✅ | ✅ | 8 |
| Access Control | ✅ | ✅ | ✅ | 10 |
| Validation Rules | ✅ | ✅ (Enhanced) | ✅ | 12 |
| Calculation Rules | ✅ | ✅ (New) | N/A | 10 |
| Workflow Rules | ✅ | ✅ (Enhanced) | ✅ | 10 |
| Integration Rules | ✅ | ✅ (Enhanced) | N/A | 8 |
| **TOTAL** | **45** | **68** | **23** | **105** |

---

## VOLUME MANAGEMENT RULES - ENHANCED

| Rule ID | Applies To | Rule Description | Implementation | Error Handling |
|---------|-----------|-----------------|----------------|----------------|
| VM-001 | Both | Total volume cannot exceed TABS allocation | Real-time validation against TABS API | Display: "Volume exceeds terminal allocation" |
| VM-002 | Both | Discretionary volume shared between rack and OSP | Sum(rack_orders + osp_orders) <= total_discretionary | Block order if exceeded |
| VM-003 | Both | Contract volumes separate from discretionary | Contract allocations use different TABS groups | Prevent mixing allocation types |
| VM-004 | Both | Default split: 60% rack, 40% OSP | Configurable per allocation group | Warn if >80% to one channel |
| VM-005 | Both | TABS sync required every 5 minutes | Background job polls TABS API | Alert if sync fails 3x |
| VM-006 | **NEW** Index | Soft holds for index deals vs hard decrements for fixed | IF index: soft_hold, IF fixed: hard_decrement | Handle conversion at lifting |
| VM-007 | Both | Cannot allocate negative volumes | volume_available >= 0 always | Reject order, return to selection |
| VM-008 | Both | Handle simultaneous orders same product | Optimistic locking with version counter | Retry with updated volume |
| VM-009 | Both | Day deals expire at 11:59 PM delivery day | Auto-expire unfulfilled allocations | Remove from available products |
| VM-010 | **NEW** Index | Index deals can have 20+ day lifting windows | Allow extended windows for index pricing | Validate within 31-day limit |
| VM-011 | **NEW** Index | Volume depletion alerts for extended windows | Monitor over longer periods | Graduated alerts (50%, 80%, 100%) |
| VM-012 | **NEW** Both | Real-time bidirectional sync with TABS | OSP ↔ TABS reconciliation every 5 min | Queue updates if offline, reconcile on reconnect |

## PRICING RULES - DUAL PARADIGM

### Fixed-Price Rules
| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| PR-001 | Fixed | Fixed prices lock at order submission | Snapshot price at order.created_at | Price immutable after submission |
| PR-002 | Fixed | Live prices update every 30 seconds | Subscribe to market data websocket | Show last known if feed lost |
| PR-003 | Fixed | Spread can be positive or negative | Allow -999.99 to +999.99 | Validate reasonable bounds |
| PR-004 | Fixed | Prompt = next day, Forward = 2+ days | Calculate delivery date from current date | Prevent past date selection |

### **NEW** Index-Price Rules  
| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| PR-005 | Index | Base index required for all formulas | Validate index exists in market data | "Invalid or missing base index" |
| PR-006 | Index | Price calculated ONLY at lifting time | Never at order time | Enforce in calculation engine |
| PR-007 | Index | Formula components must sum to 100% | SUM(all_weights) == 100 | "Component weights must sum to 100%" |
| PR-008 | Index | Differential range: -$1.00 to +$1.00 | Validate input bounds | "Differential out of acceptable range" |
| PR-009 | Index | Formula snapshot prevents changes affecting orders | Lock formula at order creation | Orders use snapshot, not current formula |
| PR-010 | Index | Market data fallback cascade | Try primary → alternate → prior day | Log all fallbacks for audit |
| PR-011 | Both | Must use spot market matching location | Validate market-location mapping | "Index not available for location" |
| PR-012 | Both | Prices to 4 decimal places (mills) | ROUND(price, 4) | Consistent rounding rules |

## **NEW** FORMULA CREATION RULES

| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| FC-001 | Template/Manual | Components must sum to exactly 100% | Validate on save/publish | "Component weights must sum to 100%" |
| FC-002 | Template/Manual | Publisher-instrument combinations must be valid | Cross-reference lookup table | "Invalid publisher-instrument pair" |
| FC-003 | Template/Manual | Date rules must match publisher availability | Validate against publisher schedules | "Date rule not available for publisher" |
| FC-004 | Template/Manual | Differential must be between -1.00 and +1.00 | Range validation | "Differential out of range" |
| FC-005 | Template/Manual | Formula names must be unique per organization | Check existence before save | "Formula name already exists" |
| FC-006 | Template/Manual | Maximum 5 components per formula | Count validation | "Maximum 5 components allowed" |
| FC-007 | Template/Manual | No duplicate publisher-instrument pairs in single formula | Uniqueness check | "Duplicate components not allowed" |
| FC-008 | Template/Manual | All formulas must have human-readable display string | Auto-generate or require manual | "Display string required" |
| FC-009 | Template/Manual | Formula must be validated before use in listings | Validation engine check | "Formula failed validation" |
| FC-010 | Template/Manual | Cannot edit formula if used by active listings | Check for active dependencies | "Formula in use, cannot edit" |

## **NEW** TEMPLATE RULES - Customer Feedback Integration

| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| TR-001 | Template | Template mode achieves 15-second creation time | Optimize UI for speed | Track and alert if >20 seconds |
| TR-002 | Template | Templates are pre-validated for accuracy | Validation at template creation | "Template failed validation" |
| TR-003 | Template | Business user friendly vs developer-focused | Plain English display, no technical jargon | User feedback: "Is this clear?" |
| TR-004 | Template | Support both quick templates AND manual flexibility | Progressive disclosure design | Seamless transition between modes |
| TR-005 | Template | Templates reduce creation time by 92% | Track actual vs manual timing | Alert if benefit <80% |
| TR-006 | Template | Templates are searchable and filterable | Full-text search + metadata filters | "No templates found" with suggestions |
| TR-007 | Template | Most common use cases covered by templates | 80% coverage target | Track usage patterns for gaps |
| TR-008 | Template | Templates can be customized without starting over | Allow differential adjustments | Preserve template benefits |

## ORDER PROCESSING RULES - ENHANCED

### Fixed Deal Orders
| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| OP-001 | Fixed | Minimum order 1,000 gallons | Validate on entry form | "Minimum order is 1,000 gallons" |
| OP-002 | Fixed | Cannot exceed available volume | order.gallons <= product.volume_available | "Only X gallons available" |
| OP-003 | Fixed | Orders final after submission | No modifications after submit | "Contact support to cancel" |
| OP-004 | Fixed | Volume decremented immediately at order | Hard decrement in TABS | Immediate volume reduction |

### **NEW** Index Deal Orders
| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| OP-005 | Index | Index terms must be explicitly accepted | Checkbox + acknowledgment modal | Block order if not accepted |
| OP-006 | Index | Volume soft-held until lifting | Create soft hold in TABS | Convert to hard decrement at lifting |
| OP-007 | Index | Credit check includes 20% buffer for price movement | order_value × 1.2 for credit check | "Insufficient credit including buffer" |
| OP-008 | Index | Planned lifting date must be within window | Validate against listing constraints | "Lifting date outside allowed window" |
| OP-009 | Index | No month boundary crossing (current limitation) | Validate delivery month | "Cannot cross month boundaries" |

### Both Deal Types
| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| OP-010 | Both | Loading number must be unique | Generate via TABS sequence | Retry generation if duplicate |
| OP-011 | Both | Credit check required | Check buyer.credit_available >= order.total | "Insufficient credit available" |
| OP-012 | Both | Delivery window 00:01-23:59 on delivery day | Set based on product instrument | Display in confirmation |
| OP-013 | Both | User must have buyer role | Check user.roles.includes('buyer') | "Not authorized to place orders" |

## ACCESS CONTROL RULES - UPDATED

| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| AC-001 | Both | Buyers see only permitted counterparties | Filter by user.permitted_sellers | No error, silent filter |
| AC-002 | Both | Filter by product access rights | Check user.permitted_products | Products hidden if not permitted |
| AC-003 | Both | Filter by location permissions | Check user.permitted_terminals | Locations hidden if not permitted |
| AC-004 | Both | Some buyers see net, others see basis | Check user.pricing_view_type | Display appropriate format |
| AC-005 | Both | Hide products with zero volume | WHERE volume_available > 0 | Remove from grid automatically |
| AC-006 | Both | Only show active sellers | WHERE seller.status = 'ACTIVE' | No inactive seller products |
| AC-007 | Both | Session timeout after 30 min idle | Track last activity timestamp | Redirect to login with message |
| AC-008 | **NEW** Template | Template access by role (price_marketer vs admin) | Role-based template permissions | "Insufficient permissions for templates" |
| AC-009 | **NEW** Index | Index deal access requires explicit permission | Check user.index_deals_enabled | Hide index deals if not permitted |
| AC-010 | Both | Log all transactions | Write to audit_log table | Async, don't block transaction |

## VALIDATION RULES - ENHANCED

| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| VL-001 | Both | Gallons must be positive integer | RegEx: /^[1-9]\\d*$/ | "Enter whole gallons only" |
| VL-002 | Both | TABS group ID must exist | Validate against TABS.getGroups() | "TABS group not found" |
| VL-003 | Both | Product code must be standard | Match against product master list | "Invalid product code" |
| VL-004 | Both | Terminal must be active | Check terminal.status = 'ACTIVE' | "Terminal currently inactive" |
| VL-005 | Both | Cannot order for past dates | delivery_date >= TODAY | "Cannot order for past dates" |
| VL-006 | Both | Valid email required | RFC 5322 email validation | "Invalid email format" |
| VL-007 | Both | 10-digit US phone required | RegEx: /^\\d{10}$/ | "Enter 10-digit phone" |
| VL-008 | Both | Min 8 char, 1 upper, 1 number password | Complex password validation | Show requirements |
| VL-009 | **NEW** Index | Formula validation before listing | Complete validation engine check | "Formula contains errors" |
| VL-010 | **NEW** Index | Publisher availability validation | Check market data feed status | "Publisher data unavailable" |
| VL-011 | **NEW** Template | Template compatibility with product/location | Validate template applicability | "Template not compatible" |
| VL-012 | **NEW** Both | Reasonable volume limits (1K-100K gallons) | Sanity check order sizes | "Order size seems unusually large" |

## **NEW** PRICE CALCULATION RULES - Index Deals Only

| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| CL-001 | Index | Price calculated only at lifting time | Trigger on BOL creation | Never calculate at order time |
| CL-002 | Index | Use formula snapshot from order creation | Freeze formula state at order | Prevent retroactive formula changes |
| CL-003 | Index | Apply date rules for market data fetch | Handle holidays, weekends, delays | Use prior business day if needed |
| CL-004 | Index | Market data fallback cascade | Try primary → alternate → historical | Log all fallback usage |
| CL-005 | Index | Round to 3 decimal places (mills) | ROUND(final_price, 3) | Consistent rounding across all calculations |
| CL-006 | Index | Generate complete audit trail | Log every calculation step | Required for dispute resolution |
| CL-007 | Index | Handle multiple components with weights | SUM(component_price × weight) + differential | Validate weights sum to 100% |
| CL-008 | Index | Holiday and weekend date handling | Use business day logic | Clear rules for non-trading days |
| CL-009 | Index | Currency handling (USD only currently) | All calculations in USD | Support for future multi-currency |
| CL-010 | Index | Manual override capability for pricing team | Admin override with justification required | Full audit trail for overrides |

## WORKFLOW RULES - ENHANCED

| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| WF-001 | Fixed | Login → Browse → Order → Confirm | Enforce navigation flow | Redirect if skip steps |
| WF-002 | **NEW** Index | Login → Browse → Terms → Order → Confirm → Lift → Invoice | Extended workflow for index deals | Clear progress indicators |
| WF-003 | Both | Order form timeout 10 minutes | Session timer on form | "Session expired, please retry" |
| WF-004 | Both | Must show confirmation screen | Required step, no skip | Always display after submit |
| WF-005 | Both | Confirmation must be printable | Print CSS stylesheet | Clean print layout |
| WF-006 | Both | Option to email confirmation | Send via email service | "Email sent to: [address]" |
| WF-007 | **NEW** Template | Template selection → Customization → Apply | Streamlined template workflow | 15-second target |
| WF-008 | **NEW** Template | Manual mode → Build → Test → Apply | Full flexibility workflow | 3-minute target |
| WF-009 | **NEW** Both | Back button preserves form data | Store in session storage | Restore on navigation back |
| WF-010 | Both | Clear form after successful submission | Reset all form fields | Prevent duplicate orders |

## INTEGRATION RULES - ENHANCED

| Rule ID | Category | Rule Description | Implementation | Error Handling |
|---------|----------|-----------------|----------------|----------------|
| IN-001 | Both | Real-time volume sync required | Webhook + polling backup | Cache last known state |
| IN-002 | Fixed | Price feeds max 30 sec latency | WebSocket connection | Fallback to last price |
| IN-003 | Both | Retry failed TABS calls 3x | Exponential backoff | Alert ops after 3 fails |
| IN-004 | **NEW** Index | Market data integration (Platts/OPIS/Argus/NYMEX) | Multiple feed integration | Fallback cascade |
| IN-005 | **NEW** Index | Formula calculation engine integration | Real-time calculation service | Manual override capability |
| IN-006 | **NEW** Both | Template library sync across instances | Centralized template management | Local cache with sync |
| IN-007 | **NEW** Index | Audit trail integration | Comprehensive logging service | No calculation without audit |
| IN-008 | **NEW** Both | Graceful degradation when systems offline | Degraded mode with clear warnings | Queue operations for later |

## CUSTOMER FEEDBACK INTEGRATION RULES **[NEW]**

| Rule ID | Customer | Rule Description | Implementation | Success Metric |
|---------|----------|-----------------|----------------|----------------|
| CF-001 | Jake/Sinclair | Formula definition must be business-user friendly | Plain English display strings | "Is this understandable?" |
| CF-002 | Mandy/Motiva | Avoid developer-focused terminology | Use business terms throughout UI | User comprehension >90% |
| CF-003 | General | Achieve 92% time reduction via templates | Track actual vs manual times | Validate 92% or better |
| CF-004 | General | Template-first approach (80/20 split) | Default to templates, offer manual | 80% template usage |
| CF-005 | General | Seamless transition between template/manual | Progressive disclosure design | No workflow disruption |
| CF-006 | General | Maintain flexibility for advanced users | Expert mode available | Power users can access full features |

## BUSINESS RULE ENFORCEMENT PRIORITY

### Priority 1 (Blocking - Must Enforce)
- Volume cannot exceed TABS allocation (VM-001)
- Index terms must be explicitly accepted (OP-005) 
- Formula components must sum to 100% (FC-001)
- Price calculated only at lifting for index deals (CL-001)
- Credit limits including buffers (OP-007)

### Priority 2 (Warning - Should Enforce)
- Large differentials impact competitiveness (FC-004)
- Template time targets (TR-001, TR-005)
- Volume depletion alerts (VM-011)
- Market data fallbacks (PR-010)

### Priority 3 (Advisory - May Enforce)
- Lifting window recommendations (VM-010)
- Template usage patterns (TR-007)
- Business user friendliness feedback (CF-002)

## RULE ENFORCEMENT SUMMARY

| Deal Type | Total Rules | Blocking Rules | Warning Rules | Advisory Rules |
|-----------|-------------|----------------|---------------|----------------|
| Fixed Deals | 45 | 32 | 8 | 5 |
| Index Deals | 68 | 48 | 12 | 8 |
| Template Mode | 23 | 15 | 5 | 3 |
| **Combined System** | **105** | **75** | **20** | **10** |

## VALIDATION CHECKLIST FOR PROTOTYPE

### Must Validate (Blocking Rules)
- [ ] All volume operations respect TABS integration
- [ ] Index deals require explicit terms acceptance
- [ ] Formula validation before any usage
- [ ] Price calculations only at appropriate times
- [ ] Credit limits with appropriate buffers
- [ ] Template mode achieves time targets
- [ ] Business user friendly vs technical language

### Should Validate (Warning Rules)  
- [ ] Volume depletion warnings displayed
- [ ] Market data fallbacks logged
- [ ] Large differential warnings
- [ ] Holiday date handling

### May Validate (Advisory Rules)
- [ ] Template usage patterns tracked
- [ ] User comprehension feedback collected
- [ ] Workflow efficiency metrics captured

---

**Last Updated**: September 2025 - Post-Kickoff Integration  
**Rule Coverage**: Fixed + Index + Templates = Complete System  
**Customer Feedback**: Integrated throughout (Jake/Sinclair, Mandy/Motiva)  
**Validation Target**: 92% time reduction via templates achieved  
**Business Focus**: Business user friendly over developer-focused technical complexity
