# OSP Master Knowledge Index
*Updated September 2025 - Post-Kickoff Integration*

## DOCUMENT MANIFEST

This knowledge base contains comprehensive information about the Gravitate Online Selling Platform (OSP) for wholesale fuel trading. Created specifically for AI consumption to enable accurate prototype design and user experience validation.

### Document Structure
1. **OSP_Domain_Model.md** - Entity relationships, data flow, state transitions
2. **OSP_Screen_Wireframes.md** - ASCII wireframes for all screens, navigation flows
3. **OSP_User_Journeys.md** - Step-by-step user flows, emotional journeys, edge cases
4. **OSP_Business_Rules.md** - Complete rule matrix with 100+ validation rules
5. **OSP_UI_Components.md** - Component library, patterns, accessibility specs
6. **OSP_Integration_Map.md** - External systems, APIs, sync patterns
7. **OSP_Terminology_Graph.md** - Domain concepts, relationships, synonyms
8. **OSP_Master_Index.md** - This document, quick reference guide

### Extended Knowledge Base
9. **OSP_Index_Pricing_Knowledge/** - Complete 13-file knowledge base for index deals
10. **OSP_Formula_Template_Updates/** - Template-based formula builder UX improvements

## QUICK REFERENCE GUIDE

### System Overview - UPDATED
- **Purpose**: Digital marketplace enabling **both fixed-price day deals AND index-based extended deals** for wholesale fuel transactions
- **Market Position**: 
  - **Current**: 5% of wholesale fuel transactions ($2B) via traditional day deals
  - **Target**: Expand to 15-20% market by adding index deals competing with 65% contract market
- **Users**: Fuel buyers (distributors), sellers (refiners/traders), price marketers
- **Core Value**: Alternative to rack pricing with better margins PLUS reduced price risk via index pricing

### **NEW** Dual Pricing Paradigms
```
FIXED-PRICE DEALS (Current State):
├── Price locked at order creation
├── Small volumes (1-2 loads)
├── Short durations (1-3 days)  
├── Seller bears all price risk
└── Simple "Buy Now" workflow

INDEX-BASED DEALS (New Addition):
├── Price calculated at lifting time
├── Large volumes (10-40 loads)
├── Extended durations (20+ days)
├── Risk shared via market movement
└── Formula-driven pricing workflow
```

### Key User Flows - ENHANCED
1. **Buyer Flow (Fixed)**: Login → Browse Products → Enter Order → Get Loading Number
2. **Buyer Flow (Index)**: Login → Browse Index Deals → Accept Terms → Order → Lift → Get Final Price  
3. **Seller Flow (Fixed)**: Setup Allocation → Create Formula → Monitor Volume
4. **Seller Flow (Index)**: Create Index Formula → Publish Deal → Monitor Liftings → Calculate Final Prices
5. **Price Marketer Flow**: Build Formula via Template (15 sec) OR Manual Builder (3 min) → Test → Publish

### Critical Features - EXPANDED
- **Dual pricing support**: Fixed and index deals in unified marketplace
- **Template-based formula creation**: 92% time reduction via pre-built formulas  
- **Real-time volume sync** with TABS terminal system
- **Market data integration**: Platts, OPIS, Argus, NYMEX feeds
- **Live/floating prices** updated every 30 seconds (fixed) / at lifting (index)
- **Loading number generation** for terminal pickup
- **Counterparty permission management**
- **Channel split** between rack and OSP sales
- **Soft holds vs hard decrements** for volume management

### Technical Architecture - UPDATED
```
Frontend (React) → API Gateway → Core Services → External Systems
                                       ↓
                        [Orders] [Volume] [Pricing] [Formulas] [Calc Engine]
                                       ↓
                    [TABS] [Market Data] [Auth] [Templates] [Audit]
                                       ↓
                         Platts | OPIS | Argus | NYMEX | DTN
```

## SCREEN INVENTORY - EXPANDED

### Buyer Screens
1. **Login** - Authentication and product discovery
2. **Product Selection Grid** - Browse both fixed AND index deals with filters
3. **Order Entry Form (Fixed)** - Enter gallons, review price, submit
4. **Order Entry Form (Index)** - Enter gallons, accept terms, plan lift date
5. **Order Confirmation** - Loading number and terminal instructions  
6. **Index Terms Acceptance** - Formula explanation and risk acknowledgment

### Seller Screens
7. **Volume Management** - Configure allocations, sync with TABS
8. **Formula Builder (Template Mode)** - Quick 15-second formula creation
9. **Formula Builder (Manual Mode)** - Advanced 3-minute custom formulas
10. **Index Deal Configuration** - Setup extended deals with lifting windows
11. **Deal Monitoring Dashboard** - Track orders, liftings, and calculations

### Price Marketer Screens  
12. **Template Library** - Browse, search, and manage formula templates
13. **Formula Testing** - Preview calculations with sample market data
14. **Performance Analytics** - Track template usage and time savings

### Shared Components
- Global Navigation Bar with fixed/index deal indicators
- Data Grid (sortable, paginated) with pricing type columns
- Form Inputs (validated, formatted) with formula components
- Modals (confirmation, errors, terms acceptance)
- Price Display (live/fixed/calculated indicators)
- Volume Indicators (soft holds vs hard decrements)
- Template Selection Interface
- Formula Display Components

## KEY BUSINESS RULES SUMMARY - UPDATED

### Volume Rules
- Cannot exceed TABS allocation (VM-001)
- Discretionary shared rack/OSP (VM-002)
- **NEW**: Soft holds for index deals vs hard decrements for fixed (VM-006)
- Default 60/40 channel split (VM-004)
- Real-time sync required (VM-005)

### Pricing Rules  
- Base index required for formulas (PR-001)
- Live prices update 30 sec for fixed deals (PR-002)
- Fixed prices lock at submit (PR-003)
- **NEW**: Index prices calculate only at lifting (PR-006)
- **NEW**: Formula components must sum to 100% (PR-007)
- Prompt = next day delivery (PR-005)

### Template Rules (NEW)
- **NEW**: Template usage reduces creation time by 92% (TR-001)
- **NEW**: Templates pre-validated for accuracy (TR-002)  
- **NEW**: Business user friendly vs developer-focused (TR-003)
- **NEW**: Support both quick templates and manual flexibility (TR-004)

### Order Rules
- Minimum 1,000 gallons (OP-001)
- Loading number unique (OP-003)
- Credit limit enforced with 20% buffer for index deals (OP-004)
- Orders final after submit (OP-005)
- **NEW**: Index terms must be explicitly accepted (OP-006)
- **NEW**: No month boundary crossing for index deals (OP-007)

## INTEGRATION SUMMARY - UPDATED

### Critical External Systems
1. **TABS (DTN)** - Terminal volume management
   - Sync every 5 minutes
   - Real-time order decrements (fixed) / soft holds (index)
   - Loading number generation
   - **NEW**: Bidirectional sync for index lifting reconciliation

2. **Market Data Feeds** - Price indices **[EXPANDED]**
   - **Platts**: End-of-day prices via FTP
   - **OPIS**: Real-time via API  
   - **Argus**: Twice daily via email
   - **NYMEX**: Real-time via WebSocket
   - Fallback cascade for missing data
   - 30-second updates for live pricing

3. **Identity Provider** - User authentication
   - OAuth 2.0 / SAML
   - Role-based permissions (buyer/seller/price_marketer)
   - Session management

4. **Formula Calculation Engine** - **[NEW]**
   - Real-time price calculations at lifting
   - Template library management
   - Formula validation and testing
   - Audit trail generation

## USER MENTAL MODELS - UPDATED

### Buyer Perspective (Fixed Deals)
"I need fuel for tomorrow at the best price. I'll check OSP for day deals, compare prices across sellers, and quickly place an order before the volume runs out. I need that loading number to pick up at the terminal."

### Buyer Perspective (Index Deals) **[NEW]**
"I need larger volumes over the next few weeks. I'll look for index deals where I accept formula pricing but get access to bigger volumes and longer lifting windows. I understand the price will be calculated when I actually lift."

### Seller Perspective (Fixed Deals)  
"I have excess inventory to move. I'll allocate some to day deals on OSP, set competitive pricing that floats with the market, and monitor how quickly it's selling so I can adjust my channel split if needed."

### Seller Perspective (Index Deals) **[NEW]**
"I want to commit larger volumes without price risk. I'll create index deals with formula pricing so buyers get bigger lots and longer windows while I'm protected from market movement."

### Price Marketer Perspective **[NEW]**
"I need to create pricing formulas quickly and accurately. I'll use templates 80% of the time for standard deals (15 seconds) and build custom formulas 20% of the time for complex situations (3 minutes). The focus is on business logic, not technical implementation."

### System Perspective
"Match buyers and sellers for **both short-term fixed and extended index** fuel transactions while maintaining accurate inventory through terminal integration, providing transparent pricing, and ensuring reliable fulfillment."

## DESIGN PRINCIPLES FOR PROTOTYPE - UPDATED

### Core UX Principles
1. **Speed is Critical** - Fixed orders <3 minutes, Index terms acceptance <2 minutes
2. **Business User Friendly** - Based on customer feedback (Jake/Sinclair, Mandy/Motiva)
3. **Template-First Approach** - 92% time savings via pre-built formulas
4. **Hybrid Flexibility** - Support both simple templates AND advanced customization
5. **Transparency** - Show live prices, formulas, and real volumes clearly
6. **Reliability** - Never oversell, always accurate calculations
7. **Trust** - Clear confirmations, loading numbers prominent, formula explanations

### UI Patterns to Implement - ENHANCED
- **Dual pricing indicators** (Fixed/Index badges)
- **Template selection interface** with search/filter
- **Formula preview displays** with plain English
- **Terms acceptance workflows** with clear explanations
- Live price pulsing animation (fixed deals)
- Volume depletion progress bars (both types)
- Color-coded availability (green/yellow/red)
- Inline validation with helpful errors
- Loading states during API calls
- Success confirmations with next steps
- **Template usage analytics** and time savings displays

### Customer Feedback Integration **[NEW]**
- **Jake at Sinclair**: "Formula string definition feels designed for developers, not business users"
- **Mandy at Motiva**: Emphasis on business user friendliness over technical flexibility
- **General feedback**: Need significant time reduction (achieved via 92% reduction through templates)
- **Strategic direction**: Hybrid approach combining template ease with manual flexibility

## PROTOTYPE VALIDATION CHECKLIST - UPDATED

### Buyer Journey Validation (Fixed Deals)
- [ ] Can find fixed products quickly with filters  
- [ ] Prices clearly show fixed vs floating
- [ ] Volume availability is obvious
- [ ] Order entry is straightforward
- [ ] Loading number prominently displayed
- [ ] Terminal instructions included

### Buyer Journey Validation (Index Deals) **[NEW]**
- [ ] Can identify index deals clearly in marketplace
- [ ] Formula terms are explained in plain English
- [ ] Terms acceptance workflow is clear and informative
- [ ] Volume and lifting window constraints are obvious
- [ ] Understanding of price calculation timing is confirmed
- [ ] Loading number generation works for index deals

### Seller Journey Validation (Both Types)
- [ ] Allocation setup maps to TABS for both fixed/index
- [ ] Formula builder supports templates AND manual entry
- [ ] Template mode achieves 92% time reduction
- [ ] Volume monitoring works for soft holds and hard decrements
- [ ] Channel split adjustable between fixed/index
- [ ] Counterparty permissions work for both deal types

### Price Marketer Journey Validation **[NEW]**
- [ ] Template library is searchable and filterable
- [ ] Template selection reduces creation time to 15 seconds
- [ ] Manual mode still available for complex cases
- [ ] Formula testing shows preview calculations
- [ ] Business logic focus vs technical implementation
- [ ] Templates can be saved and shared

### System Behavior Validation
- [ ] Concurrent orders handled properly for both types
- [ ] Price changes communicated clearly (real-time fixed, at-lifting index)
- [ ] Volume depletion prevents overselling (hard + soft holds)
- [ ] Market data integration works with fallbacks
- [ ] Formula calculations accurate and auditable
- [ ] Error messages helpful and user-friendly
- [ ] Loading states present throughout
- [ ] Confirmations reassuring and informative

## COMMON PITFALLS TO AVOID - UPDATED

1. **Don't Cache Prices** - Must be real-time for fixed deals, fresh for index calculations
2. **Don't Allow Order Edits** - Orders are final once submitted for both types
3. **Don't Hide Volume** - Transparency builds trust, show both hard/soft allocations
4. **Don't Overcomplicate** - Templates for 80%, manual for 20%, not the reverse
5. **Don't Ignore Customer Feedback** - Business user friendly, not developer-focused
6. **Don't Skip Mobile** - 30% of users on mobile devices
7. **Don't Skip Validation** - Prevent bad data early, especially for formulas
8. **Don't Forget Loading Numbers** - Critical for fulfillment in both deal types
9. **Don't Calculate Index Prices Early** - Only at lifting time, never at order time
10. **Don't Cross Month Boundaries** - Current limitation for index deals

## SUCCESS METRICS FOR PROTOTYPE - UPDATED

### Efficiency Metrics
- **Fixed deals**: Time to complete order <3 minutes
- **Index deals**: Time to accept terms and order <2 minutes
- **Formula creation**: Template mode <15 seconds, Manual mode <3 minutes
- **Time savings**: 92% reduction via templates (validated with customers)
- Clicks to purchase: <7 clicks (fixed), <10 clicks (index with terms)
- Page load time: <2 seconds
- Search to selection: <30 seconds

### Accuracy Metrics
- Zero overselling incidents (both hard decrements and soft holds)
- 100% loading number generation
- Price accuracy within 0.01% (fixed) / formula calculation accuracy (index)
- Volume sync within 5 minutes
- Formula validation 100% accurate before publishing

### User Satisfaction Metrics
- Task completion rate: >95% for both deal types
- Error recovery rate: >90%
- Clarity of information: >4.5/5 (addressing customer feedback)
- Trust in system: >4.5/5
- **NEW**: Business user friendliness rating: >4.5/5
- **NEW**: Time savings perception: >4.0/5

## TERMINOLOGY QUICK REFERENCE - UPDATED

### Most Important Terms (Existing)
- **Day Deal**: 1-3 day fuel delivery contracts (fixed pricing)
- **Rack**: Traditional 24-hour fixed pricing
- **TABS**: Terminal automation system for volumes
- **Loading Number**: 9-digit pickup authorization
- **Discretionary**: Flexible volume for rack/OSP
- **Prompt**: Next-day delivery (Day 1)
- **Forward**: Future delivery (Day 2-7)
- **Basis**: Price differential from index
- **Live/Floating**: Real-time price updates
- **Counterparty**: Trading partner (buyer/seller)

### **NEW** Index Pricing Terms
- **Index Deal**: Extended delivery contracts with formula pricing
- **Formula**: Mathematical definition of price calculation (e.g., "Platts + 0.05")
- **Template**: Pre-built formula for common use cases
- **Publisher**: Market data provider (Platts, OPIS, Argus, NYMEX)
- **Instrument**: Specific index (RBOB_Prompt, Diesel_NYH, etc.)
- **Date Rule**: When to fetch price (prior_day, prompt_month, etc.)
- **Soft Hold**: Volume reservation for index deals
- **Hard Decrement**: Immediate volume commitment for fixed deals
- **Lifting Time**: When buyer physically picks up fuel and price is calculated
- **Terms Acceptance**: Buyer's explicit agreement to index pricing terms

## AI INSTRUCTIONS FOR USING THIS KNOWLEDGE - UPDATED

When designing the prototype:

1. **Reference the wireframes** in OSP_Screen_Wireframes.md for exact layouts (UPDATED)
2. **Follow the user journeys** in OSP_User_Journeys.md for flow logic (UPDATED)
3. **Enforce business rules** from OSP_Business_Rules.md strictly (UPDATED)
4. **Use UI components** from OSP_UI_Components.md consistently (UPDATED)
5. **Understand integrations** from OSP_Integration_Map.md for behavior (UPDATED)
6. **Apply terminology** from OSP_Terminology_Graph.md accurately (UPDATED)
7. **NEW**: Reference OSP_Index_Pricing_Knowledge/ for complete index deal context
8. **NEW**: Use template-first approach reflecting customer feedback
9. **NEW**: Ensure business user friendliness over technical complexity

Remember this is for UX validation, not production. Focus on:
- User flow clarity for BOTH fixed and index deals
- Information architecture supporting dual paradigms
- Visual hierarchy distinguishing deal types
- Interaction patterns for template selection
- Error handling for formula validation
- Success feedback for both immediate and deferred pricing
- **Customer feedback integration** (business user friendly)
- **Time savings demonstration** (template efficiency)

The prototype should feel real enough to validate the user experience while acknowledging technical integrations may be simulated for demonstration purposes.

## HYBRID STRATEGIC APPROACH **[NEW]**

Based on customer feedback and strategic direction:

### Template-Based Majority (80% of use cases)
- Pre-built formulas for common scenarios
- 15-second creation time
- Business user friendly
- Validated and tested
- Searchable library

### Manual Flexibility (20% of use cases)  
- Custom formula builder for complex needs
- 3-minute creation time
- Advanced user focused
- Full flexibility maintained
- Expert mode available

### Unified Experience
- No divergent workflows
- Consistent UI patterns
- Progressive disclosure of complexity
- Seamless transition between modes
- Holistic thinking across platform

## END OF KNOWLEDGE BASE - UPDATED

**Total documentation**: 8 core files + 13 index pricing files + 3 template files = 24 comprehensive files  
**Domain coverage**: 100% of discussed features including dual pricing paradigms  
**Use case support**: Buyer, Seller, Price Marketer flows for both fixed and index deals  
**Integration points**: 7 major external systems including market data feeds  
**Business rules**: 150+ validation rules across both deal types  
**UI components**: 25+ reusable patterns including template interfaces  
**User journeys**: 5 primary flows with multiple alternatives  
**Customer feedback**: Integrated throughout based on Jake/Sinclair and Mandy/Motiva input  
**Time savings**: 92% reduction in formula creation via template approach  

This knowledge base is optimized for AI consumption to enable accurate prototype development for the **enhanced Gravitate OSP** wholesale fuel trading platform supporting both traditional fixed-price day deals and new index-based extended deals.

---
*Last Updated: September 2025 - Post-Kickoff Integration Complete*
