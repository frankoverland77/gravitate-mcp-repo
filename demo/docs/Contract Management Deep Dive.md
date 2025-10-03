# Gravitate Pricing Engine - Contract Management Deep Dive
Last updated: Jun 24, 2025


## A. Feature Overview

### Purpose and Business Value
Contract Management enables fuel suppliers and buyers to establish, manage, and execute long-term fuel supply agreements with automated daily pricing calculations. This feature addresses the critical need for supply assurance and margin predictability in the volatile fuel market.

**Core Business Value:**
- **Margin Assurity**: Sellers lock in predictable profit margins over extended periods
- **Supply Security**: Buyers guarantee fuel availability regardless of market conditions
- **Volume Stability**: Both parties achieve predictable, rateable volume flows
- **Risk Mitigation**: Protection against extreme market volatility
- **Operational Efficiency**: Automated daily price calculations eliminate manual processes

### Primary Use Cases

1. **Long-term Supply Agreements**
   - 8-10 year commitments between refiners and major buyers
   - Guaranteed volumes at negotiated pricing formulas
   - Example: Gas station chain securing daily fuel supply

2. **Formula-based Pricing**
   - Complex calculations incorporating multiple market indices
   - Dynamic pricing that adjusts daily while maintaining agreed spreads
   - Protection mechanisms (e.g., "lower of" clauses)

3. **Volume Allocation Management**
   - Daily, weekly, and monthly volume commitments
   - Tracking actual vs. committed volumes
   - Preventing over-allocation across channels

4. **Multi-location Operations**
   - Single contract covering multiple terminals
   - Different products at different locations
   - Coordinated pricing across geography

### User Stories Supported

**As a Refiner Pricing Manager:**
- I need to manage pricing for 100+ active contracts daily
- I want automated formula calculations based on current market data
- I must ensure contract volumes don't interfere with rack operations
- I need visibility into contract performance vs. rack alternatives

**As a Wholesale Buyer:**
- I need guaranteed fuel supply for my retail locations
- I want pricing that's competitive but predictable
- I must track my daily lifting rights
- I need protection when markets spike

**As a Contract Administrator:**
- I need to set up complex pricing formulas
- I want to track compliance with contract terms
- I must manage volume allocations across time periods
- I need audit trails for all pricing decisions

### Success Metrics
- **Pricing Accuracy**: 100% formula calculation accuracy
- **Automation Rate**: >95% of contract prices calculated automatically
- **Volume Compliance**: <1% deviation from rateable targets
- **Margin Achievement**: Meet or exceed target margins on 90%+ of volume
- **Operational Efficiency**: 80% reduction in manual pricing time

## B. Detailed Functionality

### Complete Capability Breakdown

#### 1. Contract Creation and Setup
- **Multi-product Contracts**: Single agreement covering multiple fuel grades
- **Multi-location Support**: Different products at different terminals
- **Flexible Term Lengths**: Support for any duration (typically 8-10 years)
- **Complex Pricing Formulas**: Unlimited variables and calculation complexity
- **Effective Dating**: Precise control over contract start/end dates

#### 2. Pricing Formula Management
- **Variable Components**:
  - Market indices (NYMEX, spot markets)
  - Published prices (Platts, Argus, OPIS)
  - Rack prices (public terminal prices)
  - Custom calculations
  
- **Formula Operators**:
  - Mathematical: +, -, *, /, MIN, MAX, AVG
  - Conditional: IF/THEN logic
  - Temporal: Date-based rules
  - Comparative: "Lower of" calculations

- **Example Formula Structure**:
  ```
  Contract Price = LOWER OF (
    [Rack Price at Terminal],
    [Weighted Average of:
      - 30% × RBOB NYMEX + Pipeline Tariff
      - 40% × Chicago Spot Market
      - 30% × Competitor Average
    ] + $0.17 per gallon
  )
  ```

#### 3. Volume Management
- **Allocation Tracking**:
  - Monthly total commitments
  - Daily rateable targets
  - Real-time lifting updates
  - Remaining volume calculations

- **Multi-period Support**:
  - Annual contracts with monthly allocations
  - Seasonal volume variations
  - Holiday/weekend adjustments
  - Force majeure provisions

#### 4. Pricing Execution
- **Daily Calculations**: Automatic formula evaluation
- **Market Data Integration**: Real-time variable updates
- **Validation Rules**: Ensure all required data present
- **Exception Handling**: Missing data protocols

#### 5. Performance Monitoring
- **Contract vs. Rack Analysis**: Daily margin comparisons
- **Volume Pacing**: Track rateable performance
- **Compliance Reporting**: Adherence to terms
- **Profitability Analysis**: Margin achievement

### Input/Output Specifications

**Inputs Required:**
- Contract header information (parties, terms, dates)
- Product/location/volume details
- Pricing formula components
- Market data feeds
- Daily lifting data

**System Outputs:**
- Daily contract prices by product/location
- Volume allocation status
- Margin calculations
- Compliance reports
- Audit trails

### Configuration Options

1. **Pricing Windows**
   - 6 PM to 6 PM (rack standard)
   - Midnight to midnight
   - Custom windows supported

2. **Formula Types**
   - Cost-plus structures
   - Index-based pricing
   - Hybrid formulas
   - Tiered pricing

3. **Volume Rules**
   - Strict allocations
   - Flexible banking
   - Carry-forward options
   - Make-up provisions

### Customization Possibilities
- Custom formula variables
- Specialized calculation methods
- Client-specific business rules
- Unique approval workflows
- Tailored reporting formats

### Limitations and Constraints
- Cannot exceed terminal physical capacity
- Must maintain data isolation between customers
- Formula complexity may impact performance
- Historical data retention limits
- Real-time calculation constraints during peak periods

## C. User Interface & Interaction Design

### Screen-by-Screen Walkthrough

#### 1. Contract Management Main View
```
┌─────────────────────────────────────────────────────┐
│ Contract Management                                  │
├─────────────────────────────────────────────────────┤
│ Active Contracts: 127  |  Total Volume: 2.3M gal/day│
├─────────────────────────────────────────────────────┤
│ Contract List                                       │
│ ┌─────┬──────────┬─────────┬──────────┬──────────┐│
│ │ ID  │ Customer │Products │ Term     │ Status   ││
│ ├─────┼──────────┼─────────┼──────────┼──────────┤│
│ │C001 │Texas Ent │   16    │8 years   │ Active   ││
│ │C002 │Costco    │   8     │10 years  │ Active   ││
│ └─────┴──────────┴─────────┴──────────┴──────────┘│
└─────────────────────────────────────────────────────┘
```

#### 2. Contract Detail View
- **Header Section**: Contract parties, term, status
- **Products Tab**: List of all products with pricing formulas
- **Locations Tab**: Terminal assignments
- **Pricing Tab**: Formula definitions and current calculations
- **Volume Tab**: Allocations and lifting history
- **Performance Tab**: Analytics and comparisons

#### 3. Formula Builder Interface
- **Variable Library**: Drag-and-drop components
- **Formula Canvas**: Visual formula construction
- **Testing Panel**: Real-time calculation preview
- **Validation Messages**: Error and warning display

### UI Components and Patterns

**Grid Components:**
- Sortable/filterable contract lists
- Inline editing capabilities
- Bulk selection operations
- Export functionality

**Detail Forms:**
- Tab-based organization
- Accordion sections for complex data
- Modal dialogs for actions
- Inline validation

**Data Visualizations:**
- Volume pacing charts
- Margin trend analysis
- Competitive position graphs
- Allocation burn-down

### Interaction Flows

1. **Creating a New Contract**
   ```
   Select "New Contract" → Enter Basic Info → Add Products → 
   Define Locations → Build Formulas → Set Volumes → 
   Review → Activate
   ```

2. **Daily Price Review**
   ```
   Open Contract → View Calculations → Check Variables → 
   Validate Results → Approve/Override → Monitor Impact
   ```

3. **Volume Adjustment**
   ```
   Select Contract → Volume Tab → Modify Allocation → 
   Validate Impact → Save Changes → Notify Stakeholders
   ```

### Error States and Messaging

**Common Error Scenarios:**
- "Missing required market data for formula calculation"
- "Volume allocation exceeds terminal capacity"
- "Contract effective date conflicts with existing agreement"
- "Formula contains circular reference"
- "Insufficient data for contract price calculation"

**Error Handling Patterns:**
- Inline validation with immediate feedback
- Blocking errors prevent dangerous actions
- Warning messages for non-critical issues
- Detailed error logs for troubleshooting

### Accessibility Considerations
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Clear focus indicators
- Descriptive labels and ARIA attributes

## D. Business Logic & Rules

### Calculation Methods

#### 1. Formula Evaluation Process
```
1. Retrieve current market data
2. Apply date rules for variable selection
3. Execute formula calculations
4. Apply min/max constraints
5. Compare to alternative calculations (if any)
6. Validate result
7. Store with audit trail
```

#### 2. Variable Resolution
- **Hierarchy**: Specific → Regional → National
- **Timing**: Current day, previous day, average
- **Fallback**: Use last known good value
- **Validation**: Check staleness and validity

#### 3. Complex Formula Examples

**Tiered Pricing Formula:**
```
IF (Monthly Volume < 100,000 gallons)
  THEN Base Price + $0.05
ELSE IF (Monthly Volume < 500,000 gallons)  
  THEN Base Price + $0.03
ELSE
  Base Price + $0.01
```

**Protected Rack Formula:**
```
MIN(
  [Current Rack Price],
  [30-Day Average Rack Price + $0.02]
)
```

### Validation Rules

1. **Contract Level**
   - Unique contract identifiers
   - Valid date ranges (start < end)
   - At least one product defined
   - Pricing formula completeness

2. **Product Level**
   - Valid product codes
   - Associated locations exist
   - Formula variables available
   - Volume allocations positive

3. **Formula Level**
   - Mathematical validity
   - Variable availability
   - No circular references
   - Result within bounds

### Conditional Logic

**Volume-Based Adjustments:**
- If ahead of rateable pace → Allow banking
- If behind pace → Require catch-up
- If at capacity → Block additional lifts

**Market Conditions:**
- If market volatility > threshold → Apply dampening
- If data missing → Use fallback rules
- If formula invalid → Revert to previous

### Edge Case Handling

1. **Partial Data Availability**
   - Use available data with documented assumptions
   - Apply weighted calculations where possible
   - Flag as estimated vs. actual

2. **Contract Conflicts**
   - Multiple contracts for same product/location
   - Overlapping volume allocations
   - Resolution hierarchy rules

3. **Extreme Market Events**
   - Circuit breaker provisions
   - Force majeure triggers
   - Emergency override protocols

### Default Behaviors
- **Missing Data**: Use previous day's value with warning
- **Formula Errors**: Revert to last valid calculation
- **Volume Exceeded**: Allow with notification
- **No Activity**: Maintain contract in ready state

## E. Data Requirements

### Required Fields

**Contract Header:**
- Contract ID (unique identifier)
- Buyer ID (counterparty reference)
- Seller ID (internal reference)
- Start Date
- End Date
- Status (Draft/Active/Suspended/Terminated)

**Product Details:**
- Product Code
- Location Code
- Volume Commitment
- Pricing Formula ID
- Effective Dates

**Formula Components:**
- Variable Type
- Source Reference
- Calculation Method
- Required/Optional Flag

### Optional Fields
- Contract Description
- Special Terms
- Notification Preferences
- Banking Rules
- Seasonal Adjustments
- Alternative Formulas

### Data Formats and Types

**Dates:**
- ISO 8601 format (YYYY-MM-DD)
- Time components when needed (HH:MM:SS)
- Timezone: Terminal local time

**Volumes:**
- Numeric, decimal precision to 3 places
- Units: Gallons (US)
- Negative values not allowed

**Prices:**
- Currency: USD
- Precision: 4 decimal places (tenths of cents)
- Format: #.#### per gallon

**Identifiers:**
- Alphanumeric, no special characters
- Case-insensitive storage
- Maximum 50 characters

### Validation Rules

**Business Validations:**
- End date must be after start date
- Volumes must not exceed terminal capacity
- Formulas must reference valid variables
- Counterparty must have active status

**Format Validations:**
- Dates in correct format
- Numbers within acceptable ranges
- Required fields populated
- Referenced entities exist

### Dependencies on Other Data

**External Dependencies:**
- Market price feeds (must be current)
- Terminal configurations (capacity limits)
- Counterparty status (credit approval)
- Product specifications (valid grades)

**Internal Dependencies:**
- Reference data (products, locations)
- User permissions (who can modify)
- Allocation pools (volume availability)
- Pricing windows (calculation timing)

## F. Integration Points

### Dependencies on Other Features

#### 1. Quote Book Integration
- Contract prices appear as locked rows
- Cannot modify via normal pricing workflow
- Spreads may reference contract prices
- Margin calculations include contract volume

#### 2. Allocation Management
- Contracts create dedicated allocation buckets
- Real-time updates as lifts occur
- Prevent over-commitment
- Balance with rack allocations

#### 3. Formula Engine
- Shared variable definitions
- Common calculation methods
- Consistent valuation logic
- Unified error handling

#### 4. Publishing System
- Contract prices included in notifications
- Different distribution lists possible
- Timing coordination with rack prices
- Audit trail maintenance

### API Endpoints Used

**Contract Management APIs:**
```
GET    /api/contracts           - List all contracts
GET    /api/contracts/{id}      - Get specific contract
POST   /api/contracts           - Create new contract
PUT    /api/contracts/{id}      - Update contract
DELETE /api/contracts/{id}      - Terminate contract

GET    /api/contracts/{id}/prices     - Get current prices
GET    /api/contracts/{id}/volumes    - Get volume status
POST   /api/contracts/{id}/calculate  - Force recalculation
```

**Related APIs:**
```
GET    /api/formulas            - Available formulas
GET    /api/allocations         - Volume allocations
GET    /api/market-data         - Current variables
POST   /api/lifting-events      - Record lifts
```

### Data Exchanges

**Inbound Data:**
- Market prices (continuous)
- Lifting events (real-time)
- Counterparty updates (daily)
- Terminal status (hourly)

**Outbound Data:**
- Calculated prices (6 PM daily)
- Volume status (continuous)
- Compliance reports (monthly)
- Invoice data (per lift)

### Event Triggers

**System Events:**
- Contract activation
- Daily price calculation
- Volume threshold reached
- Formula validation failure
- Term expiration approaching

**Business Events:**
- Lifting recorded
- Allocation exceeded
- Price override applied
- Contract modified
- Compliance violation

### Downstream Impacts

1. **Financial Systems**
   - Revenue recognition
   - Margin reporting
   - Invoice generation
   - Accrual calculations

2. **Operational Systems**
   - Terminal authorizations
   - Truck scheduling
   - Inventory planning
   - Supply chain optimization

3. **Customer Systems**
   - Price notifications
   - Order placement
   - Balance inquiries
   - Performance reports

## G. Common Use Cases & Scenarios

### Typical Usage Patterns

#### 1. Daily Contract Price Management
**Morning Routine (8:00 AM):**
```
1. System auto-calculates overnight
2. Pricer reviews exceptions only
3. Validates unusual movements
4. Approves for notification
5. Monitors lifting activity
```

#### 2. New Contract Setup
**Typical Timeline: 2-4 hours**
```
1. Sales provides term sheet
2. Create contract header (15 min)
3. Add products/locations (30 min)
4. Build pricing formulas (1-2 hours)
5. Test calculations (30 min)
6. Review and activate (15 min)
```

#### 3. Month-End Reconciliation
```
1. Compare lifted vs. allocated
2. Calculate true-up amounts
3. Generate compliance reports
4. Update next month allocations
5. Notify relevant parties
```

### Best Practices

**Formula Design:**
- Keep formulas as simple as possible
- Use named variables for clarity
- Document complex logic
- Test edge cases thoroughly
- Version control changes

**Volume Management:**
- Set realistic rateable targets
- Monitor daily pacing
- Adjust proactively
- Communicate changes early
- Maintain buffer capacity

**Data Quality:**
- Validate market data sources
- Set up fallback rules
- Monitor data freshness
- Document assumptions
- Regular audit checks

### Common Mistakes to Avoid

1. **Over-Complex Formulas**
   - Too many nested conditions
   - Unclear variable names
   - Missing documentation
   - No fallback provisions

2. **Poor Volume Planning**
   - Unrealistic commitments
   - No seasonal adjustments
   - Ignoring historical patterns
   - Insufficient buffer

3. **Inadequate Testing**
   - Only testing happy path
   - Ignoring edge cases
   - No stress testing
   - Missing data scenarios

### Power User Tips

**Efficiency Shortcuts:**
- Use contract templates for similar agreements
- Bulk copy formulas across products
- Set up alert rules for exceptions
- Create saved views for common filters
- Leverage keyboard shortcuts

**Advanced Features:**
- Multi-tier pricing structures
- Dynamic volume adjustments
- Seasonal formula variations
- Performance-based pricing
- Portfolio optimization

### Troubleshooting Guide

**Common Issues:**

1. **"Contract price not calculating"**
   - Check: Are all required variables present?
   - Check: Is contract active?
   - Check: Are we within effective dates?
   - Solution: Review formula validation errors

2. **"Volume allocation mismatch"**
   - Check: Recent lifting events processed?
   - Check: Correct allocation bucket?
   - Check: Time zone considerations?
   - Solution: Reconcile with TABS data

3. **"Formula returning unexpected value"**
   - Check: Variable values correct?
   - Check: Date rules applied properly?
   - Check: Calculation precedence?
   - Solution: Use formula testing tool

## H. Technical Implementation Notes

### Architecture Decisions

1. **Separate Contract Module**
   - Isolated business logic
   - Independent scaling
   - Specialized security rules
   - Dedicated database schema

2. **Real-time Calculation Engine**
   - In-memory formula evaluation
   - Distributed processing capability
   - Caching strategy for static data
   - Event-driven updates

3. **Integration Architecture**
   - Message queue for lifting events
   - API gateway for external data
   - Webhook notifications
   - Batch processing for reports

### Performance Optimizations

**Calculation Performance:**
- Formula pre-compilation
- Variable caching (15-minute TTL)
- Parallel evaluation for multiple contracts
- Incremental updates where possible

**Data Access:**
- Indexed queries on common filters
- Materialized views for reports
- Partitioned tables by date
- Read replicas for analytics

**UI Responsiveness:**
- Lazy loading for large contracts
- Virtual scrolling in grids
- Progressive data loading
- Client-side caching

### Technical Debt Considerations

**Current Limitations:**
- Excel-based upload for initial setup
- Limited formula debugging tools
- No version control UI
- Manual rollback process
- Batch-only reporting

**Planned Improvements:**
- Native UI for contract creation
- Visual formula builder
- Git-based version control
- Real-time analytics
- API-first architecture

### Future Enhancement Opportunities

**Near-term Roadmap:**
1. AI-powered formula optimization
2. Predictive volume analytics
3. Multi-currency support
4. Mobile app for approvals
5. Enhanced audit capabilities

**Long-term Vision:**
1. Blockchain-based smart contracts
2. Automated negotiation tools
3. Market simulation capabilities
4. Integrated supply chain optimization
5. Predictive margin analytics

**Innovation Areas:**
- Natural language formula creation
- Automated compliance monitoring
- Dynamic pricing optimization
- Real-time P&L impact analysis
- Portfolio-level optimization

---

## Appendix: Contract Management Specific Terms

**Banking**: Ability to carry forward unused volume allocations

**Force Majeure**: Contract provisions for extraordinary events

**Rateable**: Consistent daily volume draw-down

**Take-or-Pay**: Commitment to purchase regardless of need

**Term Sheet**: Initial contract agreement outline

**True-up**: Period-end reconciliation of actual vs. planned

**Volume Commitment**: Agreed purchase quantities over time