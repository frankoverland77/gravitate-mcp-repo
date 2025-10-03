# OSP User Journey Maps - UPDATED
*September 2025 - Post-Kickoff Integration*
*Covers Fixed-Price Day Deals + Index-Based Extended Deals + Template Workflows*

## BUYER JOURNEYS

### BUYER JOURNEY 1: Purchase Fixed-Price Day Deal

### Journey Overview
**Actor**: Fuel Buyer at distribution company
**Goal**: Purchase 8,000 gallons of RBOB for tomorrow's delivery at best available price
**Success Metric**: Confirmed order with loading number in < 3 minutes

### Step-by-Step Journey
```
START
  │
  ▼
[1. LOGIN]
  │ Trigger: Daily fuel procurement task
  │ Action: Enter credentials
  │ System: Validate user, load permissions
  │ Output: Filtered product list based on relationships
  │ Time: 5 seconds
  │
  ▼
[2. SCAN AVAILABLE PRODUCTS]
  │ Trigger: Need specific product/location
  │ Action: Review grid, compare prices
  │ System: Display live prices, available volumes
  │ Decision Point: Which seller/price combination?
  │ Time: 30-60 seconds
  │
  ▼
[3. APPLY FILTERS]
  │ Trigger: Too many options displayed
  │ Action: Filter by location "Pasadena"
  │ System: Reduce grid to relevant options
  │ Output: 3-5 matching products
  │ Time: 10 seconds
  │
  ▼
[4. SELECT PRODUCT]
  │ Trigger: Found acceptable price/volume
  │ Action: Click [BUY] button
  │ System: Navigate to order entry
  │ Validation: Check volume still available
  │ Time: 2 seconds
  │
  ▼
[5. ENTER QUANTITY]
  │ Trigger: Order form displayed
  │ Action: Type "8000" in gallons field
  │ System: Calculate total, show price
  │ Decision Point: Accept floating vs fixed price?
  │ Time: 15-30 seconds
  │
  ▼
[6. REVIEW ORDER]
  │ Trigger: Need to verify details
  │ Action: Check price, delivery date, terms
  │ System: Display complete order summary
  │ Decision Point: Proceed or modify?
  │ Time: 10-20 seconds
  │
  ▼
[7. SUBMIT ORDER]
  │ Trigger: Order details acceptable
  │ Action: Click [SUBMIT ORDER]
  │ System: 
  │   - Validate volume availability (TABS check)
  │   - Lock in price if fixed
  │   - Generate loading number
  │   - Decrement available volume
  │ Output: Confirmation screen
  │ Time: 2-5 seconds
  │
  ▼
[8. RECEIVE CONFIRMATION]
  │ Trigger: Order processed successfully
  │ Action: Save/print loading number
  │ System: Display loading instructions
  │ Output: Loading number 9100362
  │ Time: 5 seconds
  │
  ▼
END - SUCCESS
```

### Alternative Paths

#### Path A: Volume Depleted During Order
```
Step 5 → [ERROR: Volume No Longer Available]
         │ System: Another buyer purchased volume
         │ Action: Return to product grid
         └─→ Return to Step 2
```

#### Path B: Price Change During Order
```
Step 6 → [WARNING: Price Has Changed]
         │ System: Live price updated
         │ Action: Accept new price or cancel
         ├─→ Accept: Continue to Step 7
         └─→ Cancel: Return to Step 2
```

#### Path C: Credit Limit Exceeded
```
Step 7 → [ERROR: Credit Limit Exceeded]
         │ System: Order exceeds available credit
         │ Action: Reduce quantity or cancel
         ├─→ Reduce: Return to Step 5
         └─→ Cancel: End journey
```

### Emotional Journey Map
```
Confidence Level (1-10)
10 ┤
 9 ┤           ╱────────╲
 8 ┤       ╱──╯         ╲
 7 ┤   ╱──╯              ╲────────
 6 ┤ ╱╯                   ╲
 5 ┤╯                      ╲
 4 ┤                        ╲
 3 ┤                         ╲
 2 ┤
 1 └─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬
     Login  Scan  Filter Select Enter Review Submit Confirm
     
😟 Anxious: "Will good prices be available?"
😐 Focused: "Comparing options"
😊 Confident: "Found good deal"
😰 Nervous: "Hope volume doesn't run out"
😌 Relieved: "Order confirmed!"
```

---

### **NEW** BUYER JOURNEY 2: Purchase Index-Based Extended Deal

#### Journey Overview
**Actor**: Fuel Buyer at distribution company
**Goal**: Purchase 15,000 gallons of RBOB for extended lifting window with index pricing
**Success Metric**: Terms accepted and order confirmed with lifting schedule in < 5 minutes
**Key Difference**: Must understand and accept formula pricing terms

#### Step-by-Step Journey
```
START
  │
  ▼
[1. LOGIN]
  │ Trigger: Need larger volume with extended lifting window
  │ Action: Enter credentials
  │ System: Validate user, load permissions
  │ Output: Mixed marketplace with both fixed and index deals
  │ Time: 5 seconds
  │
  ▼
[2. FILTER FOR INDEX DEALS]
  │ Trigger: Looking for larger volumes and flexible lifting
  │ Action: Apply filter "Index deals only"
  │ System: Display index-priced listings with formula indicators
  │ Output: 5-8 index deals available
  │ Time: 10 seconds
  │
  ▼
[3. REVIEW INDEX LISTING]
  │ Trigger: Found suitable product/location
  │ Action: Click on listing showing "📊 Platts+0.050"
  │ System: Display listing summary with volume and lifting window
  │ Decision Point: Volume (42,000g) and window (20 days) acceptable?
  │ Time: 15-30 seconds
  │
  ▼
[4. VIEW FORMULA TERMS]
  │ Trigger: Need to understand pricing mechanism
  │ Action: Click [VIEW TERMS] button
  │ System: Display formula terms modal with:
  │   - Plain English explanation
  │   - Sample calculation
  │   - Risk disclosure
  │ Decision Point: Accept index pricing vs find fixed deal?
  │ Time: 60-90 seconds
  │
  ▼
[5. ACCEPT TERMS]
  │ Trigger: Terms acceptable for business needs
  │ Action: Check "I understand index pricing" checkbox
  │ System: Enable order entry form
  │ Validation: Terms acceptance logged with timestamp
  │ Time: 10 seconds
  │
  ▼
[6. ENTER ORDER DETAILS]
  │ Trigger: Terms accepted, ready to order
  │ Action: 
  │   - Enter quantity: "15000" gallons
  │   - Select planned lifting date range
  │ System: 
  │   - Validate volume availability
  │   - Check credit limit with 20% buffer
  │   - Show estimated price range
  │ Time: 30-45 seconds
  │
  ▼
[7. REVIEW INDEX ORDER]
  │ Trigger: Order details entered
  │ Action: Review order summary including:
  │   - Volume: 15,000 gallons
  │   - Formula: Platts RBOB + $0.050
  │   - Lifting window: Sept 1-20
  │   - Final price: "Calculated at lifting"
  │ Decision Point: Proceed with deferred pricing?
  │ Time: 20-30 seconds
  │
  ▼
[8. SUBMIT INDEX ORDER]
  │ Trigger: Order details acceptable
  │ Action: Click [PLACE ORDER]
  │ System:
  │   - Create soft hold in TABS (not hard decrement)
  │   - Generate loading number for lifting window
  │   - Send confirmation with formula terms
  │ Output: Order confirmed with lifting instructions
  │ Time: 3-5 seconds
  │
  ▼
[9. RECEIVE INDEX CONFIRMATION]
  │ Trigger: Order processed successfully
  │ Action: Review confirmation details
  │ System: Display:
  │   - Loading number: 9100574
  │   - Lifting window: Sept 1-20, 2025
  │   - Formula snapshot preserved
  │   - Instructions for lifting day pricing
  │ Output: Email with terms and lifting instructions
  │ Time: 10 seconds
  │
  ▼
[10. SCHEDULE LIFTING]
  │ Trigger: Plan actual fuel pickup
  │ Action: Coordinate with dispatch for lifting date
  │ System: Available for lifting anytime in window
  │ Output: Lifting scheduled for Sept 9
  │ Time: Outside system (business planning)
  │
  ▼
[11. LIFTING DAY - FINAL PRICING]
  │ Trigger: Truck arrives at terminal (Sept 9)
  │ Action: Terminal generates BOL
  │ System:
  │   - Fetch Sept 9 Platts RBOB price: $2.405
  │   - Apply formula: $2.405 + $0.050 = $2.455/gal
  │   - Calculate total: 15,000 × $2.455 = $36,825
  │   - Convert soft hold to hard decrement
  │   - Generate final invoice
  │ Output: Final price confirmed and invoiced
  │ Time: 2-3 minutes
  │
  ▼
END - SUCCESS
```

#### Alternative Paths for Index Deals

##### Path A: Formula Terms Rejected
```
Step 4 → [DECISION: Terms not acceptable]
         │ Reason: Price risk too high
         │ Action: Return to marketplace
         └─→ Return to Step 2 (filter for fixed deals)
```

##### Path B: Volume Unavailable at Lifting
```
Step 11 → [ERROR: TABS allocation depleted]
          │ System: Soft hold expired or reallocated
          │ Action: Emergency procurement needed
          │ Resolution: Contact seller for alternative
```

##### Path C: Market Data Unavailable
```
Step 11 → [ERROR: Platts price not available]
          │ System: Apply fallback pricing rules
          │ Action: Use prior business day price
          │ Alert: Notify both parties of fallback
```

---

## SELLER JOURNEYS

### SELLER JOURNEY 1: Setup Fixed-Price Day Deal Allocation

### Journey Overview
**Actor**: Price Marketer at fuel supplier
**Goal**: Configure 100,000 gallon allocation for day deals with live pricing
**Success Metric**: Allocation synced with TABS and available to buyers

### Step-by-Step Journey
```
START
  │
  ▼
[1. ACCESS VOLUME MANAGEMENT]
  │ Trigger: Morning allocation setup routine
  │ Action: Navigate to Volume Management
  │ System: Load current allocations from TABS
  │ Output: Display allocation groups
  │ Time: 5 seconds
  │
  ▼
[2. CREATE ALLOCATION GROUP]
  │ Trigger: Need new day deal offering
  │ Action: Click [+ New Group]
  │ System: Display allocation form
  │ Input: Name, type (discretionary)
  │ Time: 30 seconds
  │
  ▼
[3. MAP TO TABS]
  │ Trigger: Need terminal integration
  │ Action: Enter TABS group ID
  │ System: Validate ID exists in TABS
  │ Critical: Must match exactly
  │ Time: 20 seconds
  │
  ▼
[4. CONFIGURE PRODUCTS]
  │ Trigger: Define what's being sold
  │ Action: Add product/location combinations
  │ System: Validate against master data
  │ Input: RBOB 87, Pasadena, 100,000 gal
  │ Time: 45 seconds
  │
  ▼
[5. SET CHANNEL SPLIT]
  │ Trigger: Allocate between rack and OSP
  │ Action: Set 60% rack, 40% OSP
  │ System: Calculate available volumes
  │ Output: 40,000 gallons for day deals
  │ Time: 15 seconds
  │
  ▼
[6. CREATE PRICE FORMULA]
  │ Trigger: Need pricing logic
  │ Action: Navigate to Formula Builder
  │ System: Load formula interface
  │ Time: 5 seconds
  │
  ▼
[7. CONFIGURE FORMULA]
  │ Trigger: Set pricing rules
  │ Action: 
  │   - Select Platts Gulf Coast index
  │   - Add +0.0325 spread
  │   - Set as "floating/live"
  │ System: Validate formula syntax
  │ Time: 60 seconds
  │
  ▼
[8. TEST FORMULA]
  │ Trigger: Verify pricing works
  │ Action: Click [Test]
  │ System: Calculate sample price
  │ Output: $2.4892 per gallon
  │ Time: 10 seconds
  │
  ▼
[9. CREATE TRADE ENTRY]
  │ Trigger: Make available to buyers
  │ Action: Create trade entry setup
  │ Input: 
  │   - Link allocation
  │   - Link formula
  │   - Set counterparties
  │ System: Validate all components
  │ Time: 45 seconds
  │
  ▼
[10. PUBLISH TO BUYERS]
  │ Trigger: Ready to sell
  │ Action: Click [Publish]
  │ System: 
  │   - Sync with TABS
  │   - Make visible to permitted buyers
  │   - Start volume tracking
  │ Output: Live on platform
  │ Time: 5 seconds
  │
  ▼
END - SUCCESS
```

### Monitoring Loop (Ongoing)
```
[MONITOR VOLUMES]
  │ Frequency: Every 5 minutes
  │ Check: Volume depletion rate
  │ Alert: If > 80% consumed
  │ Action: Adjust channel split if needed
  └─→ Loop continues throughout day
```

### **NEW** SELLER JOURNEY 2: Create Index-Based Extended Deal

#### Journey Overview
**Actor**: Price Marketer at fuel supplier
**Goal**: Create index deal with 45,000 gallon allocation using template-based formula
**Success Metric**: Index listing published with formula in < 3 minutes
**Key Difference**: Formula creation and extended lifting windows

#### Step-by-Step Journey
```
START
  │
  ▼
[1. LOGIN TO SELLER PORTAL]
  │ Trigger: Create larger volume deal with price protection
  │ Action: Access formula management and listings
  │ System: Load seller permissions and existing formulas
  │ Output: Seller dashboard with dual deal type options
  │ Time: 5 seconds
  │
  ▼
[2. CHOOSE CREATION METHOD]
  │ Trigger: Need formula for index deal
  │ Action: Navigate to Formula Builder
  │ Decision Point: Use template (fast) or build custom (flexible)?
  │ System: Display template vs manual options
  │ Time: 10 seconds
  │
  ▼
[3. SELECT TEMPLATE MODE]
  │ Trigger: Want 15-second formula creation
  │ Action: Click "⚡ Quick Template"
  │ System: Display template library with search/filters
  │ Output: 20+ available templates
  │ Time: 5 seconds
  │
  ▼
[4. FIND SUITABLE TEMPLATE]
  │ Trigger: Search for gasoline formula
  │ Action: 
  │   - Search: "gasoline gulf coast"
  │   - Filter: Product=Gasoline, Terminal=Gulf Coast
  │ System: Return matching templates
  │ Output: "Gulf Coast 90/10 Blend" template found
  │ Time: 10 seconds
  │
  ▼
[5. PREVIEW TEMPLATE]
  │ Trigger: Verify template components
  │ Action: Click [Preview] on recommended template
  │ System: Display:
  │   - 90% Platts RBOB Gulf Coast
  │   - 10% Platts Chicago Ethanol
  │   - Sample calculation
  │ Decision Point: Template suitable or need customization?
  │ Time: 15 seconds
  │
  ▼
[6. CUSTOMIZE DIFFERENTIAL]
  │ Trigger: Template good, adjust pricing
  │ Action: 
  │   - Click [Select] 
  │   - Modify differential: +$0.045
  │   - Update display name: "Valero Austin Standard"
  │ System: Validate changes and update preview
  │ Output: Customized formula ready
  │ Time: 15 seconds
  │
  ▼
[7. APPLY FORMULA]
  │ Trigger: Formula configured correctly
  │ Action: Click [APPLY FORMULA]
  │ System: Save formula and transition to listing creation
  │ Output: Formula "Valero Austin Standard" created
  │ Time: 5 seconds
  │ Total Formula Time: 65 seconds (vs 3+ minutes manual)
  │
  ▼
[8. CREATE INDEX LISTING]
  │ Trigger: Formula ready, need to create listing
  │ Action: Configure listing parameters:
  │   - Product: 87 Gasoline Unbranded
  │   - Location: Austin Terminal
  │   - Formula: Valero Austin Standard
  │   - Total Volume: 45,000 gallons
  │   - Min Order: 8,000 gallons
  │   - Lifting Window: Sept 1-25 (25 days)
  │ System: Validate all parameters
  │ Time: 60 seconds
  │
  ▼
[9. SET VOLUME ALLOCATION]
  │ Trigger: Link to TABS allocation
  │ Action: Select allocation source
  │ System: Query TABS for available volumes
  │ Output: 120,000 gallons available in AUS-87-DISC
  │ Validation: Sufficient volume for 45,000 gallon listing
  │ Time: 15 seconds
  │
  ▼
[10. CONFIGURE BUYER ACCESS]
  │ Trigger: Determine who can see listing
  │ Action: Select "Authorized Buyers Only"
  │ System: Apply buyer permission filters
  │ Output: 12 authorized buyers will see listing
  │ Time: 10 seconds
  │
  ▼
[11. PUBLISH INDEX LISTING]
  │ Trigger: All parameters configured
  │ Action: Click [PUBLISH LISTING]
  │ System:
  │   - Create soft volume reservation in TABS
  │   - Make listing visible to buyers
  │   - Start monitoring volume depletion
  │   - Send notifications to buyers
  │ Output: Index listing live on marketplace
  │ Time: 5 seconds
  │
  ▼
[12. MONITOR INDEX DEAL]
  │ Trigger: Ongoing management needed
  │ Action: Monitor order activity and volume
  │ System: Track soft holds vs hard decrements
  │ Output: Dashboard showing deal performance
  │ Time: Ongoing
  │
  ▼
END - SUCCESS
```

#### Alternative Paths for Index Seller

##### Path A: Template Not Suitable
```
Step 5 → [DECISION: Need custom formula]
         │ Reason: Unique pricing requirements
         │ Action: Switch to manual builder
         └─→ Build custom (3+ minutes vs 65 seconds)
```

##### Path B: TABS Volume Insufficient
```
Step 9 → [ERROR: Insufficient TABS volume]
         │ System: Only 30,000 gallons available
         │ Action: Reduce listing volume or find more allocation
         └─→ Adjust parameters and retry
```

##### Path C: No Authorized Buyers
```
Step 10 → [WARNING: No buyers have access]
          │ System: Permission filters exclude all buyers
          │ Action: Adjust buyer permissions or contact admin
          └─→ Fix permissions before publishing
```

---

## PRICE MARKETER JOURNEYS

### **ENHANCED** PRICE MARKETER JOURNEY 1: Template-Based Formula Creation

#### Journey Overview
**Actor**: Price Marketer creating formulas efficiently
**Goal**: Create accurate formula in 15 seconds using templates
**Success Metric**: 92% time reduction vs manual building
**Key Innovation**: Business user friendly vs developer-focused

#### Template Workflow
```
START
  │
  ▼
[1. ACCESS TEMPLATE LIBRARY]
  │ Trigger: Need formula for new deal
  │ Action: Navigate to "Template Library"
  │ System: Display searchable template collection
  │ Output: 50+ pre-validated templates
  │ Time: 5 seconds
  │
  ▼
[2. SEARCH TEMPLATES]
  │ Trigger: Find relevant template
  │ Action: Search "RBOB Platts" + filter by Product=Gasoline
  │ System: Return matching templates with usage stats
  │ Output: 8 relevant templates found
  │ Time: 5 seconds
  │
  ▼
[3. SELECT BEST TEMPLATE]
  │ Trigger: Found "Gulf Coast 90/10 Blend" (used 47x)
  │ Action: Click template name
  │ System: Display template details and sample calculation
  │ Decision Point: This template or keep searching?
  │ Time: 5 seconds
  │
  ▼
[4. APPLY WITH MINIMAL CUSTOMIZATION]
  │ Trigger: Template is 95% correct
  │ Action: Adjust differential from +0.0325 to +0.0280
  │ System: Update preview and validate
  │ Output: "Your formula ready in 15 seconds!"
  │ Time: 5 seconds
  │ **TOTAL TIME: 20 seconds (vs 3+ minutes manual)**
  │
  ▼
END - SUCCESS
```

### PRICE MARKETER JOURNEY 2: Adjust Live Pricing

### Journey Overview
**Actor**: Price Marketer monitoring market conditions
**Goal**: Adjust spread on live formula based on market movement
**Success Metric**: Price updated without disrupting active orders

### Quick Adjustment Flow
```
[1. MARKET ALERT]
    │ Trigger: Platts price spike detected
    ▼
[2. ACCESS FORMULA]
    │ Time: 10 seconds
    │ Action: Open formula management
    ▼
[3. MODIFY SPREAD]
    │ Old: +0.0325
    │ New: +0.0425 (increase by 1 cent)
    ▼
[4. SAVE CHANGES]
    │ Impact: Applies to NEW orders only
    │ Existing orders keep original terms
    ▼
[5. VERIFY UPDATE]
    │ Check: New orders show updated price
    │ Confirm: $2.5892 (was $2.4892)
```

---

## SYSTEM INTERACTION POINTS

### Critical Integration Moments
1. **LOGIN**: User permissions from identity provider
2. **PRODUCT DISPLAY**: Real-time volume from TABS
3. **PRICE CALCULATION**: Live index from market feeds
4. **ORDER SUBMISSION**: Simultaneous TABS allocation
5. **CONFIRMATION**: Loading number generation

### Failure Recovery Patterns
```
TABS Unavailable:
├─→ Cache last known volumes (5 min TTL)
├─→ Queue orders for batch processing
└─→ Display warning to users

Price Feed Lost:
├─→ Freeze at last known price
├─→ Disable floating price option
└─→ Alert price marketers

High Volume Contention:
├─→ Implement optimistic locking
├─→ Show real-time availability
└─→ Queue overflow orders
```

## USER MENTAL MODELS

### Buyer Mental Model
"I need fuel → Check prices → Find best deal → Buy quickly before it's gone → Get loading number"

### Seller Mental Model  
"Set up inventory → Define pricing → Make available → Monitor depletion → Adjust as needed"

### System Conceptual Model
"Allocation Pool → Trading Rules → Live Market → Transaction → Physical Fulfillment"
