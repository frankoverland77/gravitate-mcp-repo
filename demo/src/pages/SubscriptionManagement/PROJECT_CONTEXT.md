# Subscription Management - Project Context

## Overview

The Subscription Management feature is a prototype demo built using Excalibrr components. It replicates the UX patterns from Gravitate's **ManagePriceNotifications** module based on Reece's mockup designs. The feature allows users to manage price notification subscriptions, configure notification content, and set up notification destinations by counterparty.

## File Structure

```
demo/src/pages/SubscriptionManagement/
├── SubscriptionManagement.tsx          # Main page with tabbed navigation
├── SubscriptionManagement.types.ts     # TypeScript interfaces and constants
├── SubscriptionManagement.data.ts      # Sample data for demo
├── components/
│   ├── columnDefs.tsx                  # AG Grid column definitions
│   ├── EmailInput.tsx                  # Tag-based email input component
│   └── SiteIdInput.tsx                 # Tag-based site ID input component
├── tabs/
│   ├── SubscriptionManagementTab.tsx   # Main subscription grid tab
│   ├── NotificationDestinationsTab.tsx # Recipient configuration tab
│   └── PreviewNotificationsTab.tsx     # Placeholder for notification preview
└── styles/
    └── SubscriptionManagement.css      # Feature-specific styles
```

## Features Implemented

### 1. Subscription Management Tab

The main tab displays a GraviGrid with subscription data and provides:

- **Checkbox Selection Column**: Multi-select with header checkbox for bulk operations
- **Status Column**: Switch toggle to activate/deactivate subscriptions
- **Counterparty Column**: Display of counterparty name with ID
- **Quote Configuration Column**: Rack Pricing vs Delivered Pricing types
- **Products Column**: Pill button showing count of selected products (e.g., "116 selected")
- **Locations Column**: Pill button showing count of selected locations
- **Content Configuration Column Group**: 16 checkbox columns for configuring notification content

#### Content Configuration Fields

| Field                      | Description                               |
| -------------------------- | ----------------------------------------- |
| IncludeCounterparty        | Include counterparty name in notification |
| IncludeLoadingNumber       | Include loading number                    |
| IncludePortalLink          | Include portal link                       |
| IncludeEffectiveDate       | Include effective date                    |
| IncludeEffectiveTime       | Include effective time                    |
| IncludeExpirationDate      | Include expiration date                   |
| IncludeProduct             | Include product name                      |
| IncludeOriginLocation      | Include origin location                   |
| IncludeDestinationLocation | Include destination location              |
| IncludeProductPrice        | Include product price                     |
| IncludeFreight             | Include freight cost                      |
| IncludeTaxAllIn            | Include all-in tax                        |
| IncludeTaxLocal            | Include local tax                         |
| IncludeTaxState            | Include state tax                         |
| IncludeTaxFederal          | Include federal tax                       |
| IncludeAllInPrice          | Include all-in price                      |

#### Bulk Edit Mode

When rows are selected, the grid enters bulk edit mode:

- Non-selected rows become disabled (opacity reduced)
- Control bar switches from "Create" button to bulk action buttons
- **Activate All**: Sets `IsActive = true` for all selected rows
- **Deactivate All**: Sets `IsActive = false` for all selected rows
- **Cancel**: Deselects all rows and exits bulk edit mode

### 2. Notification Destinations Tab

A grid for configuring notification recipients by counterparty:

- **Counterparty Column**: Display counterparty name
- **Site ID Column**: Tag-based input for site IDs (blue tags)
- **Email Column**: Tag-based input for email addresses (green tags for active, red strikethrough for opted-out)

### 3. Preview Notifications Tab

Placeholder tab for future implementation. Will allow users to preview and send notifications.

## Custom Components

### EmailInput

Tag-based email input component with the following features:

- Email validation using regex
- Green tags for active emails
- Red strikethrough tags for opted-out emails with tooltip showing opt-out date
- Supports: Enter, Tab, comma to add tags
- Supports: Backspace to remove last tag
- Supports: Paste multiple comma-separated emails
- Read-only mode for display-only scenarios

### SiteIdInput

Tag-based site ID input component:

- Blue tags for site IDs
- Auto-uppercase conversion
- Same keyboard interactions as EmailInput
- Read-only mode support

## Styling

### CSS Classes

| Class                          | Purpose                                            |
| ------------------------------ | -------------------------------------------------- |
| `.content-config-cell`         | Green tint background for content config columns   |
| `.content-config-header-group` | Header group styling                               |
| `.content-config-first-col`    | Left border on first content config column         |
| `.bulk-edit-disabled-row`      | Reduced opacity for non-selected rows in bulk mode |
| `.selection-pill-active`       | Green pill button for selected products/locations  |
| `.selection-pill-inactive`     | Gray pill button for empty selections              |
| `.email-tag`                   | Green email tag styling                            |
| `.email-tag-opted-out`         | Red strikethrough email tag                        |
| `.site-id-tag`                 | Blue site ID tag styling                           |

### Theme Variables Used

- `--theme-color-2` (green): Primary accent color
- `--gray-300`: Input borders
- `--gray-500`, `--gray-600`: Disabled/placeholder text
- `--bg-1`: White background

## Data Model

### SubscriptionData

```typescript
interface SubscriptionData {
  Id: number;
  CounterPartyId: number;
  CounterPartyName: string;
  QuoteConfigurationName: string;
  ProductIds: number[];
  LocationIds: number[];
  IsActive: boolean;
  // 16 content configuration boolean fields
  IncludeCounterparty: boolean;
  IncludeLoadingNumber: boolean;
  // ... etc
}
```

### RecipientData

```typescript
interface RecipientData {
  CounterPartyId: string;
  CounterPartyName: string;
  SiteIds: string[];
  Emails: string[];
  OptedOutEmails?: OptedOutEmail[];
}

interface OptedOutEmail {
  email: string;
  optedOutDate: string;
}
```

## Patterns Followed

### Gravitate ManagePriceNotifications Module

- Tabbed page structure
- Grid with control bar and action buttons
- Bulk edit mode with row selection
- Column definitions separated into their own file
- Content configuration as column group with checkboxes

### Excalibrr Conventions

- `Vertical` and `Horizontal` layout components
- `GraviGrid` with `agPropOverrides` and `controlBarProps`
- `Texto` for typography with proper `category` and `appearance`
- `GraviButton` with `success` boolean prop
- `NotificationMessage` for user feedback
- CSS classes over inline styles where possible

## Future Work

1. **Products/Locations Drawers**: Implement drawer panels for selecting products and locations
2. **Create Subscription Modal**: Add modal for creating new subscriptions
3. **Preview Notifications**: Build out the preview tab functionality
4. **API Integration**: Replace sample data with real API calls
5. **Permission-based Actions**: Wire up `canWrite` to actual permission system
6. **Opted-out Email Management**: Add functionality to manage opted-out emails

## Navigation

The demo is registered in the navigation system under the "Grids" category:

- Route path: `/demos/grids/subscription-management`
- Title: "Subscription Management"
- Category: grids

## Dependencies

- `@gravitate-js/excalibrr`: Core component library
- `antd`: Tabs, Switch, Checkbox, Tag, Input, Tooltip
- `ag-grid-community`: Grid types and interfaces
- `@ant-design/icons`: PlusCircleOutlined, MailOutlined
