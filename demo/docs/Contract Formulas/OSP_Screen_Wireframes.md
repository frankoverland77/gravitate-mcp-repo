# OSP Screen Flows & Wireframes - UPDATED
*September 2025 - Post-Kickoff Integration*  
*Covers Fixed-Price Day Deals + Index-Based Extended Deals + Template Workflows*

## ENHANCED NAVIGATION FLOWS

### Fixed-Price Deal Flow (Traditional)
```
[Login] ──► [Mixed Marketplace] ──► [Fixed Order Entry] ──► [Order Confirmation]
              │                           │                        │
              ▼                           ▼                        ▼
     [Filter Products]             [Price Preview]         [Loading Instructions]
              │                           │
              ▼                           ▼
     [Saved Searches]             [Volume Check]
```

### **NEW** Index-Based Deal Flow
```
[Login] ──► [Mixed Marketplace] ──► [Formula Terms] ──► [Index Order Entry] ──► [Order Confirmation]
              │                           │                    │                       │
              ▼                           ▼                    ▼                       ▼
     [Filter by Type]            [Accept Terms Modal]  [Lifting Schedule]    [Email w/ Formula]
                                                              │
                                                              ▼
                                                      [Lifting & Final Price]
```

### **NEW** Template-Based Formula Creation Flow  
```
[Formula Management] ──► [Template Selection] ──► [Customize] ──► [Test] ──► [Apply]
         │                      │                    │           │         │
         ▼                      ▼                    ▼           ▼         ▼
  [Manual Builder]      [Search Templates]    [Adjust Diff] [Preview] [Publish]
                               │
                               ▼
                        [Template Library]
```

---

## BUYER SCREENS - ENHANCED

### 1. LOGIN SCREEN (Updated)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Gravitate OSP - Wholesale Fuel Platform                         [Help] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                     ┌─────────────────────────────┐                    │
│                     │   DUAL PRICING PLATFORM     │                    │
│                     │ Fixed Deals + Index Deals   │                    │
│                     └─────────────────────────────┘                    │
│                                                                         │
│                     ┌─────────────────────────────┐                    │
│                     │ Username: [_______________] │                    │
│                     │                             │                    │
│                     │ Password: [_______________] │                    │
│                     │                             │                    │
│                     │ [x] Remember Me             │                    │
│                     │                             │                    │
│                     │     [ LOGIN ]  [ RESET ]    │                    │
│                     └─────────────────────────────┘                    │
│                                                                         │
│              ✓ Fixed-price day deals                                   │
│              ✓ Index-based extended deals                              │
│              ✓ Template-driven formula creation                        │
│                                                                         │
│                     Forgot Password? | Contact Support                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. **NEW** MIXED MARKETPLACE - Fixed + Index Deals
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Welcome, [Buyer Name]                 [My Orders] [Settings] [⚙] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FILTERS:  Market: [Gulf Coast ▼]  Product: [All ▼]  Type: [All ▼]      │
│           Location: [All Terminals ▼]  Seller: [All ▼]                 │
│           [x] Available only  [ ] Index deals only  [Apply Filters]    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Product        │ Location    │ Seller  │ Price Type      │ Vol   │ Act │
├────────────────┼─────────────┼─────────┼─────────────────┼───────┼─────┤
│ RBOB 87 UB     │ Pasadena,TX │ Shell   │ 💲 $2.4892 LIVE │25,000g│[BUY]│
│ Prompt Day 1   │ Term 5421   │         │ Fixed Price     │       │     │
├────────────────┼─────────────┼─────────┼─────────────────┼───────┼─────┤
│ RBOB 87 UB     │ Austin, TX  │ Valero  │ 📊 Platts+0.050 │42,000g│[VIEW│
│ Extended 20d   │ Term 3322   │         │ Index Formula   │       │TERMS│
├────────────────┼─────────────┼─────────┼─────────────────┼───────┼─────┤
│ ULSD 62        │ Houston, TX │ Chevron │ 📊 OPIS+0.030   │85,000g│[VIEW│
│ Extended 15d   │ Term 8811   │         │ Index Formula   │       │TERMS│
├────────────────┼─────────────┼─────────┼─────────────────┼───────┼─────┤
│ CBOB 87        │ Chicago, IL │ BP      │ 💲 $2.5020 FIXED│3,000g │[BUY]│
│ Forward Day 2  │ Term 2244   │         │ Locked Price    │       │     │
├────────────────┼─────────────┼─────────┼─────────────────┼───────┼─────┤
│ Jet A          │ Dallas, TX  │ Phillips│ 📊 Argus-0.020  │55,000g│[VIEW│
│ Extended 31d   │ Term 9955   │         │ Index Formula   │       │TERMS│
├────────────────┴─────────────┴─────────┴─────────────────┴───────┴─────┤
│                                                 Page 1 of 8  [<] [>]    │
└─────────────────────────────────────────────────────────────────────────┘

Legend: 💲 = Fixed pricing | 📊 = Index/formula pricing | g = gallons
```

### 3. **NEW** INDEX TERMS ACCEPTANCE MODAL
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Index Deal Terms - Please Review                               [X]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PRODUCT DETAILS                                                       │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Product:  RBOB 87 Unbranded                                   │     │
│  │ Location: Austin, TX - Terminal 3322                          │     │
│  │ Seller:   Valero Energy Trading                               │     │
│  │ Volume:   42,000 gallons available                            │     │
│  │ Window:   Sept 1-20, 2025 (20-day lifting window)             │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  PRICING FORMULA                                                       │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Formula:      Platts Gulf Coast 87 Prompt + $0.050            │     │
│  │ Base Index:   Platts Gulf Coast Pipeline 87 Gasoline          │     │
│  │ Price Timing: Prior business day closing price                │     │
│  │ Differential: +5.0 cents per gallon                           │     │
│  │                                                               │     │
│  │ ⚠️  IMPORTANT: Final price calculated when you lift product   │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  EXAMPLE CALCULATION                                                   │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ If you lift on Sept 10, 2025:                                 │     │
│  │ • Sept 9 Platts close: $2.4050                               │     │
│  │ • Your price: $2.4050 + $0.0500 = $2.4550/gal               │     │
│  │ • 8,000 gallons = $19,640.00 total                           │     │
│  │                                                               │     │
│  │ If market moves up/down, your price moves accordingly         │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  REQUIRED ACKNOWLEDGMENTS                                              │
│  [x] I understand final price will be calculated at lifting            │
│  [x] I accept the price may be higher or lower than estimate           │
│  [x] I have read and agree to the index pricing terms                  │
│                                                                         │
│         [ CANCEL ]                    [ ACCEPT TERMS & ORDER ]         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4. INDEX ORDER ENTRY FORM  
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Index Deal Order Entry                       [Back] [Cancel]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PRODUCT DETAILS                                                       │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Product:  RBOB 87 Unbranded                                   │     │
│  │ Location: Austin, TX - Terminal 3322                          │     │
│  │ Seller:   Valero Energy Trading                               │     │
│  │ Type:     Index Deal - Extended Lifting Window                │     │
│  │ Window:   Sept 1-20, 2025                                     │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  PRICING (Index-Based)                                                 │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Formula:     📊 Platts Gulf Coast 87 + $0.050                │     │
│  │ Current Est: ~$2.4550/gal (based on last close)               │     │
│  │ Final Price: ⏰ Calculated at lifting time                    │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ORDER QUANTITY                                                        │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Enter Gallons: [________8000_] (Available: 42,000)           │     │
│  │                                                               │     │
│  │ Estimated Total: 8,000 gal × ~$2.4550 = ~$19,640.00         │     │
│  │ Credit Hold:     $19,640.00 × 1.2 buffer = $23,568.00       │     │
│  │ Terminal Fee:                                $    50.00       │     │
│  │ ─────────────────────────────────────────────                │     │
│  │ Credit Reserved:                           ~$23,618.00       │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  LIFTING SCHEDULE                                                      │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Valid Dates: Sept 1-20, 2025                                 │     │
│  │ Planned Lift: [____09/10/2025____] 📅                       │     │
│  │ (You can lift any day within the window)                     │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ⚠️  REMINDER: Final invoice amount determined at actual lifting        │
│                                                                         │
│         [ CANCEL ORDER ]            [ PLACE INDEX ORDER ]              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5. INDEX ORDER CONFIRMATION
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Index Order Confirmed        [Print] [Email] [Track] [New Order] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│         ✓ INDEX ORDER SUCCESSFULLY SUBMITTED                           │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │                  CONFIRMATION DETAILS                         │     │
│  │                                                               │     │
│  │  Order Number:    IDX-2025-092346                             │     │
│  │  Loading Number:  9100363                                     │     │
│  │  Submitted:       Sept 23, 2025 3:15 PM                      │     │
│  │                                                               │     │
│  │  ─────────────────────────────────────────────                │     │
│  │                                                               │     │
│  │  Product:         RBOB 87 Unbranded                           │     │
│  │  Quantity:        8,000 gallons                               │     │
│  │  Pricing:         📊 Platts GC 87 + $0.050                  │     │
│  │  Est. Price:      ~$2.4550 per gallon                        │     │
│  │  Est. Amount:     ~$19,640.00 (plus $50 terminal fee)        │     │
│  │                                                               │     │
│  │  ⚠️ ACTUAL PRICE: Calculated when you lift product            │     │
│  │                                                               │     │
│  │  ─────────────────────────────────────────────                │     │
│  │                                                               │     │
│  │  LIFTING INSTRUCTIONS:                                        │     │
│  │  Terminal:        Austin Terminal 3322                        │     │
│  │  Address:         5678 Energy Way, Austin, TX 78745          │     │
│  │  Hours:           24/7 Access                                 │     │
│  │  Lifting Window:  Sept 1-20, 2025                             │     │
│  │  Planned Date:    Sept 10, 2025                               │     │
│  │  Contact:         Terminal Ops: (512) 555-0200               │     │
│  │                                                               │     │
│  │  Present loading number 9100363 at terminal gate             │     │
│  │  Final price calculation and invoice sent after lifting       │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## **NEW** SELLER SCREENS - Template-Enhanced Formula Builder

### 6. FORMULA MANAGEMENT WITH TEMPLATES
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Formula Management                  [+ New] [Templates] [Import] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CREATION METHOD - Select Your Approach                               │
│                                                                         │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────┐│
│  │   ⚡ QUICK TEMPLATE     │ │   📝 BUILD MANUAL       │ │   📥 IMPORT ││
│  │                         │ │                         │ │             ││
│  │   ⏱️ 15 seconds average │ │   ⏱️ 3 minutes average  │ │   From file ││
│  │   🎯 92% time savings   │ │   🔧 Full flexibility   │ │   or system ││
│  │   ✅ Business friendly  │ │   ⚙️ Advanced users     │ │             ││
│  │                         │ │                         │ │             ││
│  │    [ USE TEMPLATES ]    │ │    [ MANUAL BUILD ]     │ │  [ IMPORT ] ││
│  └─────────────────────────┘ └─────────────────────────┘ └─────────────┘│
│                                                                         │
│  EXISTING FORMULAS                                    [Search: ______] │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Formula Name              │ Type     │ Used │ Status │ Action │     │
│  │───────────────────────────┼──────────┼──────┼────────┼────────│     │
│  │ Gulf Coast 90/10 Blend    │ Template │ 47x  │ Active │ [Edit] │     │
│  │ Platts RBOB + Fixed Diff  │ Manual   │ 23x  │ Active │ [Edit] │     │
│  │ OPIS Rack Alternative     │ Template │ 19x  │ Draft  │ [Edit] │     │
│  │ Custom Houston Formula    │ Manual   │ 8x   │ Active │ [Copy] │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  📊 PRODUCTIVITY STATS                                                 │
│  Time saved this month: 47.5 hours via templates                      │
│  Template usage: 78% (Target: 80%)                                    │
│  Average creation time: 22 seconds (Target: <30 sec)                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7. TEMPLATE SELECTION SCREEN  
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Template Library - Select Formula Type        [Manual Mode] [X] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SEARCH: [gasoline gulf coast______] 🔍      Filter: [Gasoline ▼]      │
│                                                                         │
│  ⭐ RECOMMENDED TEMPLATES                                               │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                                                               │    │
│  │  🏆 GULF COAST 90/10 BLEND                   Used 47 times   │    │
│  │      90% Platts RBOB + 10% Ethanol + Differential            │    │
│  │      ⏱️ 15 seconds │ ⭐ Most Popular │ 📍 Gulf Coast         │    │
│  │      [Preview]  [Quick Select]                               │    │
│  │                                                               │    │
│  │  🥈 PLATTS + FIXED DIFFERENTIAL             Used 23 times   │    │
│  │      100% Platts Gulf Coast + Custom Spread                  │    │
│  │      ⏱️ 12 seconds │ 💰 Simple │ 📍 Gulf Coast              │    │
│  │      [Preview]  [Quick Select]                               │    │
│  │                                                               │    │
│  │  🥉 OPIS/PLATTS LOWER-OF                   Used 15 times    │    │
│  │      Lower of OPIS Rack Net vs Platts + Diff                │    │
│  │      ⏱️ 25 seconds │ 🔄 Complex │ 📍 Multiple Markets       │    │
│  │      [Preview]  [Quick Select]                               │    │
│  │                                                               │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  📂 ALL TEMPLATES BY CATEGORY                                          │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                                                               │    │
│  │ 🏭 GASOLINE FORMULAS (12 templates)                          │    │
│  │    └─ Gulf Coast Blends (4) • Midwest Rack (3) • PADD V (2) │    │
│  │                                                               │    │
│  │ ⛽ DIESEL FORMULAS (8 templates)                             │    │
│  │    └─ Pipeline ULSD (3) • Biodiesel Blends (2) • Heating Oil │    │
│  │                                                               │    │
│  │ ✈️ JET FUEL FORMULAS (4 templates)                           │    │
│  │    └─ Jet A (2) • Jet A-1 (1) • Military JP-8 (1)          │    │
│  │                                                               │    │
│  │ 🔥 HEATING OIL (2 templates)                                 │    │
│  │    └─ Seasonal Premium • Standard ULHO                       │    │
│  │                                                               │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│             [ CANCEL ]         [ CREATE CUSTOM INSTEAD ]              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8. TEMPLATE CUSTOMIZATION SCREEN
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Customize Template: Gulf Coast 90/10          [Save] [Test] [X] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SELECTED TEMPLATE: Gulf Coast 90/10 Blend                             │
│  📊 Used 47 times • ⏱️ 15 sec avg • ✅ Pre-validated                   │
│                                                                         │
│  ═══ PRE-CONFIGURED COMPONENTS ═══                                     │
│                                                                         │
│  ┌─ Component 1 (90%) ──────────────────────────────────┐             │
│  │ ✓ Platts US Gulf Coast Pipeline RBOB                  │             │
│  │   Price Type: Prior Day Close │ Status: ✅ Available  │             │
│  │   Display As: "Platts RBOB Gulf Coast"                │             │
│  └─────────────────────────────────────────────────────┘             │
│                                                                         │
│  ┌─ Component 2 (10%) ──────────────────────────────────┐             │
│  │ ✓ Platts Chicago Ethanol Spot                         │             │
│  │   Price Type: Prior Day Close │ Status: ✅ Available  │             │
│  │   Display As: "Platts Chicago Ethanol"                │             │
│  └─────────────────────────────────────────────────────┘             │
│                                                                         │
│  ═══ CUSTOMIZE YOUR DIFFERENTIAL ═══                                   │
│                                                                         │
│  ┌─ Your Contract Terms ────────────────────────────────┐             │
│  │                                                       │             │
│  │ Differential: [+] [___0.0325___] cents/gallon       │             │
│  │                                                       │             │
│  │ Display Name: [Motiva Gulf Standard Contract_______] │             │
│  │                                                       │             │
│  └─────────────────────────────────────────────────────┘             │
│                                                                         │
│  ═══ PREVIEW YOUR FORMULA ═══                                          │
│                                                                         │
│  🔍 Business Display: "90% Platts RBOB + 10% Ethanol + 3.25¢"         │
│  🔧 System Formula: (0.9×PLATTS_GC_RBOB) + (0.1×PLATTS_CHI_ETH) + 0.0325│
│                                                                         │
│  ⏱️ Time to Create: 15 seconds (Saved 2 min 45 sec vs manual!)         │
│                                                                         │
│  💡 SMART VALIDATION                                                   │
│  ✅ Components sum to 100%        ✅ All indices available              │
│  ✅ Differential in reasonable range  ✅ Formula passes validation      │
│                                                                         │
│        [ CANCEL ]    [ SAVE TEMPLATE ]    [ APPLY FORMULA ]            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9. MANUAL FORMULA BUILDER (For Comparison)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Manual Formula Builder                [Template Mode] [Save] [X] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ADVANCED FORMULA CONSTRUCTION                                          │
│  ⏱️ Target Time: 3 minutes • 🔧 Full Flexibility • 👨‍💻 Expert Mode     │
│                                                                         │
│  ═══ STEP 1: BASE INDEX SELECTION ═══                                  │
│                                                                         │
│  Publisher:  [Select Publisher_______________▼]                         │
│              └─ Platts, OPIS, Argus, NYMEX, DTN                       │
│                                                                         │
│  Instrument: [Search instruments____________]                           │
│              └─ Filtered by publisher selection                         │
│                                                                         │
│  Price Type: [Prior Day Close_______________▼]                         │
│              └─ Close, Average, High, Low, Settlement                  │
│                                                                         │
│  Date Rule:  [Prior Business Day____________▼]                         │
│              └─ Prior day, 3-day avg, prompt month, etc.              │
│                                                                         │
│  Weight:     [____100____]%                                           │
│                                                                         │
│  ═══ STEP 2: ADDITIONAL COMPONENTS (Optional) ═══                      │
│                                                                         │
│  [ + ADD COMPONENT ]   (Max 5 total)                                  │
│                                                                         │
│  ═══ STEP 3: DIFFERENTIAL ═══                                          │
│                                                                         │
│  Spread:     [+] [___________] cents/gallon                           │
│              Range: -100.0 to +100.0                                   │
│                                                                         │
│  ═══ STEP 4: FORMULA DETAILS ═══                                      │
│                                                                         │
│  Name:       [Custom Formula Name________________]                      │
│                                                                         │
│  Display:    [Auto-generated from components____]                      │
│                                                                         │
│  ═══ VALIDATION STATUS ═══                                             │
│                                                                         │
│  ⚠️ Components must sum to 100%                                        │
│  ⚠️ Select at least one publisher                                      │
│  ⚠️ All instruments must be validated                                   │
│                                                                         │
│    [ CANCEL ]    [ SAVE DRAFT ]    [ TEST ]    [ VALIDATE & APPLY ]    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 10. **NEW** VOLUME MANAGEMENT - Enhanced for Dual Deals
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Volume Management                    [Sync TABS] [Settings] [⚙] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ALLOCATION OVERVIEW                      Last Sync: 3:45 PM ✅         │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Total Discretionary Pool: 500,000 gallons                    │     │
│  │                                                               │     │
│  │ 💲 Fixed Deals:    275,000g (55%) ████████████░░░░░          │     │
│  │ 📊 Index Deals:    165,000g (33%) ████████░░░░░░░░░          │     │
│  │ 🔄 Available:       60,000g (12%) ███░░░░░░░░░░░░░░░          │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ALLOCATION GROUPS                               [+ New Group]         │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Gulf Coast Discretionary Mix            [Edit] [📊 Analytics]│     │
│  │ TABS ID: GRP-5421-DISC                           [Unlink]    │     │
│  │                                                               │     │
│  │ Product  │Location │Total  │Fixed Used│Index Hold│Available│ │     │
│  │──────────┼─────────┼───────┼──────────┼──────────┼─────────┤ │     │
│  │ RBOB 87  │Pasadena │100,000│ 75,000g  │ 15,000g* │ 10,000g │ │     │
│  │ ULSD 62  │Houston  │150,000│ 100,000g │ 30,000g* │ 20,000g │ │     │
│  │ CBOB 87  │Beaumont │ 50,000│ 35,000g  │ 10,000g* │  5,000g │ │     │
│  │                                                               │     │
│  │ *Soft holds for index deals (convert at lifting)             │     │
│  │                                                               │     │
│  │ Channel Split: [Fixed 60%] [Index 40%] [Rebalance]          │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ Extended Index Only                      [Edit] [📊 Analytics]│     │
│  │ TABS ID: GRP-8899-INDEX                          [Unlink]    │     │
│  │                                                               │     │
│  │ Product  │Location │Total  │Orders    │Soft Holds│Available│ │     │
│  │──────────┼─────────┼───────┼──────────┼──────────┼─────────┤ │     │
│  │ RBOB 87  │Austin   │200,000│ 42 orders│120,000g* │ 80,000g │ │     │
│  │ ULSD 62  │Dallas   │300,000│ 28 orders│180,000g* │120,000g │ │     │
│  │                                                               │     │
│  │ Avg Window: 18 days  │ Longest: 31 days │ Shortest: 3 days  │ │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  🔄 AUTOMATED REBALANCING RULES                     [Configure Rules] │
│  • When fixed deals <20%: Alert to increase fixed allocation           │
│  • When index holds >80%: Warn about overcommitment                   │
│  • Daily reconciliation with TABS                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## **NEW** PRICE MARKETER SCREENS

### 11. TEMPLATE LIBRARY MANAGEMENT
```
┌─────────────────────────────────────────────────────────────────────────┐
│  OSP | Template Library Management        [+ Create] [Import] [Export] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [All Templates] [My Templates] [Shared] [Archives] [Usage Stats]      │
│                                                                         │
│  Search: [gulf coast gasoline____] 🔍  Sort: [Most Used ▼] [Filter ▼] │
│                                                                         │
│  📊 LIBRARY STATISTICS                                                 │
│  • Total Templates: 47    • Active: 43    • Usage Rate: 78%           │
│  • Time Saved Monthly: 127 hours    • Avg Creation: 18 seconds        │
│                                                                         │
│  ┌─ COMPLETE FORMULA TEMPLATES ─────────────────────────────────┐     │
│  │                                                               │     │
│  │ Name                │ Category │ Used │ Created │ Actions     │     │
│  │─────────────────────┼──────────┼──────┼─────────┼─────────────│     │
│  │ Gulf Coast 90/10    │ Gasoline │ 47x  │ Jan 2025│[Edit][Copy] │     │
│  │ Midwest Diesel Std  │ Diesel   │ 31x  │ Feb 2025│[Edit][Copy] │     │
│  │ NYMEX Forward Blend │ Complex  │ 28x  │ Mar 2025│[Edit][Copy] │     │
│  │ Rack Alternative    │ Gasoline │ 19x  │ Jan 2025│[Edit][Copy] │     │
│  │ Premium Uplift      │ Gasoline │ 15x  │ Apr 2025│[Edit][Copy] │     │
│  │ Chicago Ethanol     │ Renewable│ 12x  │ May 2025│[Edit][Copy] │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ┌─ COMPONENT BUILDING BLOCKS ──────────────────────────────────┐     │
│  │                                                               │     │
│  │ Component           │ Type     │ Used │ Index        │ Actions │     │
│  │─────────────────────┼──────────┼──────┼──────────────┼─────────│     │
│  │ Platts RBOB Base    │ Base     │ 85x  │ GC Pipeline  │[+][Copy]│     │
│  │ Ethanol 10% Mix     │ Component│ 52x  │ Chicago Spot │[+][Copy]│     │
│  │ OPIS Rack Net       │ Base     │ 34x  │ Multi-Market │[+][Copy]│     │
│  │ Biodiesel B100      │ Component│ 18x  │ SME RINs     │[+][Copy]│     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  📈 TEMPLATE PERFORMANCE METRICS                                      │
│  • Most Successful: Gulf Coast 90/10 (47 uses, 100% success rate)     │
│  • Fastest Creation: Platts + Fixed (12 sec average)                   │
│  • Most Time Saved: Midwest Complex (3.2 min → 22 sec = 168% savings) │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## SHARED SYSTEM COMPONENTS

### Navigation Bar - Enhanced
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [🏠 OSP] | Marketplace | Orders | Formulas | Volume | Reports | [User▼]│
│                                                                         │
│ Quick Actions: [💲 Fixed Deals] [📊 Index Deals] [⚡ Templates] [📞 Help]│
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Grid Enhanced - Mixed Deal Types
```
║ Standard Columns for Both Types:
║ Product | Location | Seller | Available | Actions
║
║ Pricing Column Variations:
║ 💲 $2.4567 LIVE    (Fixed deal, live price)
║ 💲 $2.4567 FIXED   (Fixed deal, locked price)  
║ 📊 Platts+0.050    (Index deal, formula)
║ 📊 OPIS-0.025      (Index deal, formula)
║
║ Volume Column Enhancements:
║ 25,000g Available  (Fixed deals - immediate commitment)
║ 42,000g (20d)      (Index deals - extended window)
║
║ Actions Column:
║ [BUY NOW]          (Fixed deals)
║ [VIEW TERMS]       (Index deals)
```

### Form Components - Enhanced
```
Price Type Selector:
( ) Fixed Price → Enter price manually
(•) Index Formula → Select/create formula

Volume Entry (Enhanced):
┌─────────────────────────┐
│ Gallons: [____8000____] │
│ Available: 42,000g      │
│ Type: Index Deal        │
│ Window: 20 days         │
└─────────────────────────┘

Credit Display (Enhanced):
┌─────────────────────────┐
│ Fixed Deal:             │
│ Total: $19,640.00       │
│                         │
│ Index Deal:             │  
│ Estimated: ~$19,640.00  │
│ Credit Hold: $23,568.00 │
│ (includes 20% buffer)   │
└─────────────────────────┘
```

### Status Indicators
```
Deal Type Badges:
💲 FIXED  | 📊 INDEX

Price Status:
🟢 LIVE    (updating every 30 sec)
🔵 LOCKED  (fixed at order)
🟡 FORMULA (calculated at lifting)

Volume Status:
■ HARD     (immediate commitment)
□ SOFT     (reservation hold)

Templates:
⚡ TEMPLATE (15 sec)
🔧 MANUAL   (3 min)
```

---

## MOBILE RESPONSIVE ENHANCEMENTS

### Mobile Marketplace
```
┌─────────────────────┐
║ OSP Mobile         ≡║
║ [Filter] [Sort]     ║
╠═════════════════════╣
║                     ║
║ ┌─ RBOB 87 UB ────┐ ║
║ │ Pasadena, TX     │ ║  
║ │ Shell Trading    │ ║
║ │ 💲 $2.49 FIXED   │ ║
║ │ 25,000g avail    │ ║
║ │                  │ ║
║ │ [    BUY NOW    ]│ ║
║ └──────────────────┘ ║
║                     ║
║ ┌─ RBOB 87 UB ────┐ ║
║ │ Austin, TX       │ ║
║ │ Valero Energy    │ ║
║ │ 📊 Platts+0.050  │ ║
║ │ 42,000g (20d)    │ ║
║ │                  │ ║
║ │ [ VIEW TERMS ]   │ ║
║ └──────────────────┘ ║
║                     ║
║ Page 1 of 8 [>]     ║
╚═════════════════════╝
```

---

## WIREFRAME VALIDATION CHECKLIST

### Fixed Deal Flow Validation
- [ ] Clear distinction between fixed/live pricing
- [ ] Immediate volume depletion visible
- [ ] Loading number prominently displayed
- [ ] Price locked at submission clearly indicated

### Index Deal Flow Validation  
- [ ] Formula terms clearly explained in business language
- [ ] Terms acceptance required before ordering
- [ ] Lifting window and flexibility obvious
- [ ] Price calculation timing clearly communicated
- [ ] Credit buffer for price movement shown

### Template System Validation
- [ ] Template mode achieves <20 second creation time
- [ ] Business user friendly language throughout
- [ ] Seamless transition between template/manual modes
- [ ] Time savings prominently displayed
- [ ] Pre-validation of templates clear

### Overall System Validation
- [ ] Mixed marketplace clearly shows both deal types
- [ ] Navigation supports both workflows
- [ ] Volume management handles both allocation types
- [ ] Status indicators distinguish deal characteristics
- [ ] Mobile responsive for all new features

---

**Last Updated**: September 2025 - Post-Kickoff Integration Complete  
**Screen Coverage**: Fixed + Index + Templates = 11 primary screens  
**Customer Feedback**: Business user friendly design throughout  
**Time Savings**: Template mode targets validated (92% reduction)  
**Dual Paradigm**: Unified interface supporting both pricing models
