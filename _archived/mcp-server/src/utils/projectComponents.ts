// Project-specific component registry for Gravitate.Dotnet.Next
// These components work alongside Excalibrr components

import { ComponentInfo } from "./types.js";

export interface ProjectComponent extends ComponentInfo {
  projectCategory: ProjectComponentCategory;
  usageContext: string;
  commonUseCases: string[];
  relatedExcalibrComponents: string[];
}

export type ProjectComponentCategory =
  | "cell-editors" // Grid cell editing
  | "bulk-editors" // Bulk editing operations
  | "column-defs" // Shared column definitions
  | "grid-messages" // Grid-related messages
  | "action-buttons" // Shared action buttons
  | "grid-utilities" // Grid utility functions
  | "shared-ui"; // Shared UI components

// Manual registry of the most important project components
export const PROJECT_COMPONENTS: ProjectComponent[] = [
  // Cell Editors
  {
    name: "SearchableSelect",
    file: "src/components/shared/Grid/cellEditors/SelectCellEditor.tsx",
    projectCategory: "cell-editors",
    category: "interactive",
    description:
      "Advanced select cell editor with search, multi-select, and select-all functionality",
    usageContext:
      "Used in grid cells that need dropdown selection with search capabilities",
    commonUseCases: [
      "Product type selection in trading grids",
      "User role assignment",
      "Status selection with search",
      "Multi-value selections in grids",
    ],
    relatedExcalibrComponents: ["GraviGrid"],
    props: {
      options: {
        type: "DropdownOption[]",
        required: true,
        description: "Array of selectable options",
      },
      showSearch: {
        type: "boolean",
        required: false,
        description: "Enable search functionality",
      },
      mode: {
        type: "'multiple' | 'tags'",
        required: false,
        description: "Multi-select mode",
      },
      showSelectedValue: {
        type: "boolean",
        required: false,
        description: "Show selected value in editor",
      },
      matchOptionId: {
        type: "string",
        required: false,
        description: "ID of option to match/highlight",
      },
      showPopConfirmOnClear: {
        type: "boolean",
        required: false,
        description: "Confirm before clearing selection",
      },
      enableSelectAllFromSearch: {
        type: "boolean",
        required: false,
        description: "Allow select all from search results",
      },
    },
  },

  {
    name: "DateEditor",
    file: "src/components/shared/Grid/cellEditors/index.tsx",
    projectCategory: "cell-editors",
    category: "interactive",
    description: "Date picker cell editor with moment.js integration",
    usageContext: "Used in grid cells for date selection and editing",
    commonUseCases: [
      "Effective date editing in trading systems",
      "Contract date modifications",
      "Scheduling and timeline management",
    ],
    relatedExcalibrComponents: ["GraviGrid"],
    props: {
      defaultValue: {
        type: "any",
        required: false,
        description: "Default date value",
      },
      picker: {
        type: "any",
        required: false,
        description: "Date picker type (date, month, year)",
      },
      value: { type: "any", required: true, description: "Current date value" },
    },
  },

  {
    name: "NumberCellEditor",
    file: "src/components/shared/Grid/cellEditors/NumberCellEditor.tsx",
    projectCategory: "cell-editors",
    category: "interactive",
    description: "Specialized number input for grid cells with validation",
    usageContext: "Used for numeric data entry in grids",
    commonUseCases: [
      "Price editing in trading grids",
      "Quantity adjustments",
      "Percentage inputs",
      "Financial calculations",
    ],
    relatedExcalibrComponents: ["GraviGrid"],
    props: {
      value: {
        type: "number",
        required: true,
        description: "Current numeric value",
      },
      precision: {
        type: "number",
        required: false,
        description: "Decimal precision",
      },
      min: {
        type: "number",
        required: false,
        description: "Minimum allowed value",
      },
      max: {
        type: "number",
        required: false,
        description: "Maximum allowed value",
      },
    },
  },

  // Bulk Editors
  {
    name: "BulkSelectEditor",
    file: "src/components/shared/Grid/bulkChange/bulkCellEditors.tsx",
    projectCategory: "bulk-editors",
    category: "interactive",
    description: "Select editor for bulk operations on multiple grid rows",
    usageContext: "Used in bulk change drawer for mass updates",
    commonUseCases: [
      "Bulk status changes across multiple records",
      "Mass assignment of categories or types",
      "Batch operations in data management",
    ],
    relatedExcalibrComponents: ["GraviGrid", "BulkChangeDrawer"],
    props: {
      options: {
        type: "any[]",
        required: true,
        description: "Available options for selection",
      },
      propKey: {
        type: "string",
        required: true,
        description: "Property key being edited",
      },
      selectEditorProps: {
        type: "SelectProps<any>",
        required: false,
        description: "Additional select props",
      },
      selectEditorStyle: {
        type: "CSSProperties",
        required: false,
        description: "Custom styling",
      },
    },
  },

  {
    name: "BulkChangeDrawer",
    file: "src/components/shared/Grid/bulkChange/BulkChangeDrawer.tsx",
    projectCategory: "bulk-editors",
    category: "interactive",
    description: "Drawer component for bulk editing operations",
    usageContext: "Provides UI for bulk editing selected grid rows",
    commonUseCases: [
      "Mass updates to trading positions",
      "Bulk status changes",
      "Batch property modifications",
    ],
    relatedExcalibrComponents: ["GraviGrid", "Vertical", "Horizontal"],
    props: {
      visible: {
        type: "boolean",
        required: true,
        description: "Controls drawer visibility",
      },
      selectedRows: {
        type: "any[]",
        required: true,
        description: "Array of selected grid rows",
      },
      onClose: {
        type: "() => void",
        required: true,
        description: "Callback when drawer closes",
      },
      onBulkUpdate: {
        type: "(changes: any) => void",
        required: true,
        description: "Callback for bulk updates",
      },
    },
  },

  {
    name: "BulkChangeBar",
    file: "src/components/shared/Grid/bulkChange/BulkChangeBar.tsx",
    projectCategory: "bulk-editors",
    category: "interactive",
    description:
      "Action bar that appears when rows are selected for bulk operations",
    usageContext:
      "Shows bulk action options when multiple grid rows are selected",
    commonUseCases: [
      "Quick access to bulk operations",
      "Selection count display",
      "Bulk action triggers",
    ],
    relatedExcalibrComponents: ["GraviGrid", "Horizontal", "GraviButton"],
    props: {
      selectedCount: {
        type: "number",
        required: true,
        description: "Number of selected rows",
      },
      onBulkEdit: {
        type: "() => void",
        required: true,
        description: "Callback for bulk edit action",
      },
      onClearSelection: {
        type: "() => void",
        required: true,
        description: "Callback to clear selection",
      },
    },
  },

  // Shared Column Definitions
  {
    name: "CheckboxColumn",
    file: "src/components/shared/Grid/sharedColumnDefs/CheckboxColumn.tsx",
    projectCategory: "column-defs",
    category: "ui",
    description: "Reusable checkbox column definition for grids",
    usageContext: "Used to add checkbox selection columns to grids",
    commonUseCases: [
      "Row selection columns",
      "Boolean data display",
      "Multi-select interfaces",
    ],
    relatedExcalibrComponents: ["GraviGrid"],
    props: {
      headerCheckboxSelection: {
        type: "boolean",
        required: false,
        description: "Enable header checkbox for select all",
      },
      checkboxSelection: {
        type: "boolean",
        required: false,
        description: "Enable row checkbox selection",
      },
    },
  },

  {
    name: "TrueFalseBulkEditableColumn",
    file: "src/components/shared/Grid/defaultColumnDefs/TrueFalseBulkEditableColumn.tsx",
    projectCategory: "column-defs",
    category: "interactive",
    description: "Boolean column definition with bulk editing capabilities",
    usageContext: "Used for boolean fields that can be bulk edited",
    commonUseCases: [
      "Active/inactive status columns",
      "Feature toggle columns",
      "Boolean flags with bulk operations",
    ],
    relatedExcalibrComponents: ["GraviGrid", "BulkChangeDrawer"],
    props: {
      field: { type: "string", required: true, description: "Data field name" },
      headerName: {
        type: "string",
        required: true,
        description: "Column header text",
      },
      isBulkEditable: {
        type: "boolean",
        required: false,
        description: "Enable bulk editing",
      },
    },
  },

  {
    name: "TrueFalseEditableColumn",
    file: "src/components/shared/Grid/defaultColumnDefs/TrueFalseEditableColumn.tsx",
    projectCategory: "column-defs",
    category: "interactive",
    description: "Boolean column definition with individual cell editing",
    usageContext: "Used for boolean fields with individual cell editing",
    commonUseCases: [
      "Individual toggle controls",
      "Boolean field editing",
      "Status toggle columns",
    ],
    relatedExcalibrComponents: ["GraviGrid"],
    props: {
      field: { type: "string", required: true, description: "Data field name" },
      headerName: {
        type: "string",
        required: true,
        description: "Column header text",
      },
      editable: {
        type: "boolean",
        required: false,
        description: "Enable cell editing",
      },
    },
  },

  // Messages and Utilities
  {
    name: "UpdateNotificationMessage",
    file: "src/components/shared/Grid/Messages/UpdateNotificationMessage.tsx",
    projectCategory: "grid-messages",
    category: "ui",
    description: "Notification message for grid update operations",
    usageContext: "Displays notifications after grid operations complete",
    commonUseCases: [
      "Success messages after bulk updates",
      "Error notifications for failed operations",
      "Status updates for long-running operations",
    ],
    relatedExcalibrComponents: ["GraviGrid", "useNotification"],
    props: {
      type: {
        type: "'success' | 'error' | 'warning'",
        required: true,
        description: "Message type",
      },
      message: {
        type: "string",
        required: true,
        description: "Message content",
      },
      onClose: {
        type: "() => void",
        required: false,
        description: "Close callback",
      },
    },
  },

  // Utility Functions
  {
    name: "stopCloseOnEnter",
    file: "src/components/shared/Grid/cellEditors/index.tsx",
    projectCategory: "grid-utilities",
    category: "ui",
    description: "Utility function to prevent editor closing on Enter key",
    usageContext: "Used with select components in cell editors",
    commonUseCases: [
      "Preventing accidental editor closing",
      "Custom keyboard behavior in cell editors",
      "Tab navigation in grids",
    ],
    relatedExcalibrComponents: ["GraviGrid"],
    props: {
      params: {
        type: "ICellEditorParams",
        required: true,
        description: "Cell editor parameters",
      },
    },
  },

  {
    name: "suppressKeyboardEvent",
    file: "src/components/shared/Grid/cellEditors/index.tsx",
    projectCategory: "grid-utilities",
    category: "ui",
    description:
      "Utility to suppress AG-Grid keyboard events when editor is open",
    usageContext: "Used to control keyboard behavior in cell editors",
    commonUseCases: [
      "Custom Enter key behavior",
      "Preventing grid navigation during editing",
      "Editor-specific keyboard handling",
    ],
    relatedExcalibrComponents: ["GraviGrid"],
    props: {
      params: {
        type: "CellKeyDownEvent",
        required: true,
        description: "Keyboard event parameters",
      },
    },
  },
];

// Utility functions for working with project components
export class ProjectComponentRegistry {
  static findByName(name: string): ProjectComponent | undefined {
    return PROJECT_COMPONENTS.find((comp) => comp.name === name);
  }

  static findByCategory(
    category: ProjectComponentCategory
  ): ProjectComponent[] {
    return PROJECT_COMPONENTS.filter(
      (comp) => comp.projectCategory === category
    );
  }

  static findForUseCase(useCase: string): ProjectComponent[] {
    const lowerCase = useCase.toLowerCase();
    return PROJECT_COMPONENTS.filter(
      (comp) =>
        comp.commonUseCases.some((uc) =>
          uc.toLowerCase().includes(lowerCase)
        ) || comp.description?.toLowerCase().includes(lowerCase)
    );
  }

  static getRelatedComponents(componentName: string): ProjectComponent[] {
    const component = this.findByName(componentName);
    if (!component) return [];

    return PROJECT_COMPONENTS.filter((comp) =>
      comp.relatedExcalibrComponents.some((exc) =>
        component.relatedExcalibrComponents.includes(exc)
      )
    );
  }

  static getAllCellEditors(): ProjectComponent[] {
    return this.findByCategory("cell-editors");
  }

  static getAllBulkEditors(): ProjectComponent[] {
    return this.findByCategory("bulk-editors");
  }

  static getAllColumnDefs(): ProjectComponent[] {
    return this.findByCategory("column-defs");
  }

  // Get components that work well with a specific Excalibrr component
  static findCompatibleComponents(
    excalibrComponent: string
  ): ProjectComponent[] {
    return PROJECT_COMPONENTS.filter((comp) =>
      comp.relatedExcalibrComponents.includes(excalibrComponent)
    );
  }

  // Generate import statements for project components
  static generateImports(componentNames: string[]): string {
    const imports = componentNames
      .map((name) => this.findByName(name))
      .filter((comp) => comp !== undefined)
      .map((comp) => {
        const relativePath = comp!.file
          ?.replace("src/components/", "@components/")
          ?.replace(".tsx", "")
          ?.replace(".ts", "");
        return `import { ${comp!.name} } from '${relativePath}';`;
      });

    return imports.join("\n");
  }
}
