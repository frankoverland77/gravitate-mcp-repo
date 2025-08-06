// Form generation tools for existing projects
// src/server/tools/formGeneration.ts

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as fs from "fs/promises";
import * as path from "path";

// Form-related templates
const FORM_COMPONENT_TEMPLATE = `import React, { useEffect } from 'react'
import {
  Vertical,
  Horizontal,
  Texto,
  GraviButton,
  useNotification,
} from '@gravitate-js/excalibrr'
import { Form, Input, Select, DatePicker, InputNumber, Switch } from 'antd'
import moment from 'moment'
{{#if hasRelations}}
import { use{{FeatureName}} } from '../api/use{{FeatureName}}'
{{/if}}

interface {{FeatureName}}FormProps {
  initialData?: any
  onSubmit: (values: any) => void
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export function {{FeatureName}}Form({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: {{FeatureName}}FormProps) {
  const [form] = Form.useForm()
  const notification = useNotification()
  {{#if hasRelations}}
  // Add any lookup data hooks here
  {{/if}}

  useEffect(() => {
    if (initialData && mode === 'edit') {
      // Transform data for form
      const formData = {
        ...initialData,
        {{#each dateFields}}
        {{field}}: initialData.{{field}} ? moment(initialData.{{field}}) : null,
        {{/each}}
      }
      form.setFieldsValue(formData)
    }
  }, [initialData, form, mode])

  const handleSubmit = async (values: any) => {
    try {
      // Transform form values for API
      const submitData = {
        ...values,
        {{#each dateFields}}
        {{field}}: values.{{field}} ? values.{{field}}.toISOString() : null,
        {{/each}}
      }
      
      await onSubmit(submitData)
    } catch (error) {
      notification.error({
        message: 'Error',
        description: \`Failed to \${mode} {{displayTitle}}\`,
      })
    }
  }

  const handleReset = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Vertical>
        {{#each formGroups}}
        <Vertical>
          <Texto size="lg" weight="semibold">{{groupTitle}}</Texto>
          <Horizontal wrap>
            {{#each fields}}
            <Form.Item
              name="{{field}}"
              label="{{label}}"
              rules={[
                {{#if required}}
                { required: true, message: 'Please enter {{label}}' },
                {{/if}}
                {{#if validation}}
                {{validation}}
                {{/if}}
              ]}
              style={{ minWidth: '{{width}}px', flex: 1 }}
            >
              {{#if isSelect}}
              <Select
                placeholder="Select {{label}}"
                options={{{options}}}
                {{#if multiple}}mode="multiple"{{/if}}
              />
              {{/if}}
              {{#if isDate}}
              <DatePicker
                style={{ width: '100%' }}
                format="{{dateFormat}}"
                {{#if showTime}}showTime{{/if}}
              />
              {{/if}}
              {{#if isNumber}}
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter {{label}}"
                {{#if min}}min={{min}}{{/if}}
                {{#if max}}max={{max}}{{/if}}
                {{#if precision}}precision={{precision}}{{/if}}
              />
              {{/if}}
              {{#if isBoolean}}
              <Switch />
              {{/if}}
              {{#if isTextArea}}
              <Input.TextArea
                placeholder="Enter {{label}}"
                rows={{{rows}}}
              />
              {{/if}}
              {{#if isText}}
              <Input placeholder="Enter {{label}}" />
              {{/if}}
            </Form.Item>
            {{/each}}
          </Horizontal>
        </Vertical>
        {{/each}}

        <Horizontal justify="flex-end">
          <GraviButton
            variant="secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            Cancel
          </GraviButton>
          <GraviButton
            variant="primary"
            htmlType="submit"
            loading={isLoading}
          >
            {mode === 'create' ? 'Create' : 'Update'} {{displayTitle}}
          </GraviButton>
        </Horizontal>
      </Vertical>
    </Form>
  )
}`;

const FORM_MODAL_TEMPLATE = `import React from 'react'
import { Modal } from 'antd'
import { {{FeatureName}}Form } from './{{FeatureName}}Form'
import { use{{FeatureName}} } from '../api/use{{FeatureName}}'

interface {{FeatureName}}FormModalProps {
  visible: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData?: any
  onSuccess?: () => void
}

export function {{FeatureName}}FormModal({
  visible,
  onClose,
  mode,
  initialData,
  onSuccess,
}: {{FeatureName}}FormModalProps) {
  const { create{{FeatureName}}, update{{FeatureName}} } = use{{FeatureName}}()

  const handleSubmit = async (values: any) => {
    try {
      if (mode === 'create') {
        await create{{FeatureName}}.mutateAsync(values)
      } else {
        await update{{FeatureName}}.mutateAsync({
          id: initialData.{{uniqueIdField}},
          data: values,
        })
      }
      
      onSuccess?.()
      onClose()
    } catch (error) {
      // Error handling is done in the form component
    }
  }

  return (
    <Modal
      title={\`\${mode === 'create' ? 'Create' : 'Edit'} {{displayTitle}}\`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={{{modalWidth}}}
      destroyOnClose
    >
      <{{FeatureName}}Form
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={
          create{{FeatureName}}.isLoading || update{{FeatureName}}.isLoading
        }
        mode={mode}
      />
    </Modal>
  )
}`;

const FORM_DRAWER_TEMPLATE = `import React from 'react'
import { Drawer } from 'antd'
import { {{FeatureName}}Form } from './{{FeatureName}}Form'
import { use{{FeatureName}} } from '../api/use{{FeatureName}}'

interface {{FeatureName}}FormDrawerProps {
  visible: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData?: any
  onSuccess?: () => void
}

export function {{FeatureName}}FormDrawer({
  visible,
  onClose,
  mode,
  initialData,
  onSuccess,
}: {{FeatureName}}FormDrawerProps) {
  const { create{{FeatureName}}, update{{FeatureName}} } = use{{FeatureName}}()

  const handleSubmit = async (values: any) => {
    try {
      if (mode === 'create') {
        await create{{FeatureName}}.mutateAsync(values)
      } else {
        await update{{FeatureName}}.mutateAsync({
          id: initialData.{{uniqueIdField}},
          data: values,
        })
      }
      
      onSuccess?.()
      onClose()
    } catch (error) {
      // Error handling is done in the form component
    }
  }

  return (
    <Drawer
      title={\`\${mode === 'create' ? 'Create' : 'Edit'} {{displayTitle}}\`}
      open={visible}
      onClose={onClose}
      width={{{drawerWidth}}}
      destroyOnClose
    >
      <{{FeatureName}}Form
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={
          create{{FeatureName}}.isLoading || update{{FeatureName}}.isLoading
        }
        mode={mode}
      />
    </Drawer>
  )
}`;

const ENHANCED_GRID_TEMPLATE = `import React, { useMemo, useState } from 'react'
import { GraviGrid, Vertical, Texto, Horizontal, GraviButton } from '@gravitate-js/excalibrr'
import { get{{FeatureName}}ColumnDefs } from './columnDefs'
import { use{{FeatureName}} } from './api/use{{FeatureName}}'
import { {{FeatureName}}Form{{ContainerType}} } from './components/{{FeatureName}}Form{{ContainerType}}'

export function {{FeatureName}}Grid() {
  const [formVisible, setFormVisible] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  
  const { get{{FeatureName}}List } = use{{FeatureName}}()
  const { data, isLoading, error, refetch } = get{{FeatureName}}List()

  const columnDefs = useMemo(() => get{{FeatureName}}ColumnDefs({
    onEdit: (record) => {
      setSelectedRecord(record)
      setFormMode('edit')
      setFormVisible(true)
    },
    onDelete: (record) => {
      // Add delete confirmation here
      console.log('Delete:', record)
    },
  }), [])

  const getRowId = useMemo(
    () => (params: any) => String(params.data.{{uniqueIdField}}),
    []
  )

  const handleCreate = () => {
    setSelectedRecord(null)
    setFormMode('create')
    setFormVisible(true)
  }

  const handleFormSuccess = () => {
    refetch()
  }

  if (error) {
    return (
      <Vertical padding={4}>
        <Texto size="lg" color="error">
          Error loading {{displayTitle}} data
        </Texto>
        <Texto size="sm" color="subtle">
          {error.message}
        </Texto>
      </Vertical>
    )
  }

  return (
    <Vertical height="100%">
      <Horizontal justify="space-between" align="center" padding={2}>
        <Texto size="xl" weight="bold">
          {{displayTitle}}
        </Texto>
        <GraviButton variant="primary" size="md" onClick={handleCreate}>
          Create New
        </GraviButton>
      </Horizontal>
      
      <GraviGrid
        rowData={data || []}
        columnDefs={columnDefs}
        getRowId={getRowId}
        loading={isLoading}
        storageKey="{{storageKey}}"
        enableRangeSelection
        rowSelection="multiple"
        animateRows
        pagination
        paginationPageSize={20}
      />
      
      <{{FeatureName}}Form{{ContainerType}}
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        mode={formMode}
        initialData={selectedRecord}
        onSuccess={handleFormSuccess}
      />
    </Vertical>
  )
}`;

// Helper functions
function inferFormFieldType(field: string, type?: string): string {
  const fieldLower = field.toLowerCase();

  // Date fields
  if (fieldLower.includes("date") || fieldLower.includes("time")) {
    return "date";
  }

  // Boolean fields
  if (
    fieldLower.startsWith("is") ||
    fieldLower.startsWith("has") ||
    fieldLower.includes("active") ||
    fieldLower.includes("enabled")
  ) {
    return "boolean";
  }

  // Number fields
  if (
    fieldLower.includes("id") ||
    fieldLower.includes("count") ||
    fieldLower.includes("amount") ||
    fieldLower.includes("price") ||
    fieldLower.includes("quantity") ||
    fieldLower.includes("number")
  ) {
    return "number";
  }

  // Email fields
  if (fieldLower.includes("email")) {
    return "email";
  }

  // Long text fields
  if (
    fieldLower.includes("description") ||
    fieldLower.includes("notes") ||
    fieldLower.includes("comment") ||
    fieldLower.includes("details")
  ) {
    return "textarea";
  }

  // Select fields
  if (
    fieldLower.includes("status") ||
    fieldLower.includes("type") ||
    fieldLower.includes("category")
  ) {
    return "select";
  }

  // Default to text
  return "text";
}

function groupFormFields(fields: any[]): any[] {
  // Group fields logically
  const groups: Record<string, any[]> = {
    basic: [],
    details: [],
    metadata: [],
  };

  fields.forEach((field) => {
    const fieldLower = field.field.toLowerCase();

    if (
      fieldLower.includes("date") ||
      fieldLower.includes("created") ||
      fieldLower.includes("updated") ||
      fieldLower.includes("by")
    ) {
      groups.metadata.push(field);
    } else if (
      fieldLower.includes("description") ||
      fieldLower.includes("notes") ||
      fieldLower.includes("comment") ||
      fieldLower.includes("details")
    ) {
      groups.details.push(field);
    } else {
      groups.basic.push(field);
    }
  });

  // Convert to array format
  const formGroups = [];

  if (groups.basic.length > 0) {
    formGroups.push({
      groupTitle: "Basic Information",
      fields: groups.basic,
    });
  }

  if (groups.details.length > 0) {
    formGroups.push({
      groupTitle: "Additional Details",
      fields: groups.details,
    });
  }

  if (groups.metadata.length > 0) {
    formGroups.push({
      groupTitle: "Metadata",
      fields: groups.metadata,
    });
  }

  return formGroups;
}

// Simple template engine (reusing from productionCodeGeneration.ts)
class SimpleTemplateEngine {
  static render(template: string, data: Record<string, any>): string {
    // Handle simple variable replacements {{variable}}
    let result = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });

    // Handle arrays {{#each items}}...{{/each}}
    result = result.replace(
      /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (match, arrayName, itemTemplate) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) return "";

        return array
          .map((item) => {
            const itemContext = { ...data, ...item };
            return SimpleTemplateEngine.render(itemTemplate, itemContext);
          })
          .join("");
      }
    );

    // Handle conditionals {{#if condition}}...{{/if}}
    result = result.replace(
      /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, condition, content) => {
        return data[condition]
          ? SimpleTemplateEngine.render(content, data)
          : "";
      }
    );

    return result;
  }
}

export function registerFormGenerationTools(server: McpServer): void {
  // Tool: Generate form for existing feature
  server.tool(
    "generate_form_for_feature",
    "Generate a form component for creating/editing records in an existing feature",
    {
      projectRoot: z.string().describe("Root path of the Gravitate project"),
      moduleName: z.string().describe("Module name where the feature exists"),
      featureName: z.string().describe("Feature name in PascalCase"),
      fields: z
        .array(
          z.object({
            field: z.string().describe("Field name matching your API/types"),
            label: z.string().describe("Display label for the form field"),
            type: z
              .enum([
                "text",
                "number",
                "date",
                "select",
                "boolean",
                "textarea",
                "email",
              ])
              .optional()
              .describe("Field type (will be inferred if not provided)"),
            required: z
              .boolean()
              .optional()
              .describe("Whether field is required"),
            options: z
              .array(
                z.object({
                  label: z.string(),
                  value: z.string(),
                })
              )
              .optional()
              .describe("Options for select fields"),
            validation: z
              .string()
              .optional()
              .describe("Additional validation rules"),
            width: z
              .number()
              .optional()
              .describe("Minimum width for the field"),
          })
        )
        .describe("Form field definitions"),
      containerType: z
        .enum(["Modal", "Drawer"])
        .default("Modal")
        .describe("Whether to wrap form in a Modal or Drawer"),
      containerWidth: z
        .number()
        .optional()
        .describe(
          "Width of the modal/drawer (default: 600 for modal, 720 for drawer)"
        ),
      uniqueIdField: z
        .string()
        .describe("The field name that uniquely identifies records"),
      updateGrid: z
        .boolean()
        .default(true)
        .describe("Also update the grid component to use the form"),
    },
    async (params) => {
      try {
        const featurePath = path.join(
          params.projectRoot,
          "src/modules",
          params.moduleName,
          params.featureName
        );

        // Check if feature exists
        await fs.access(featurePath);

        // Process fields
        const processedFields = params.fields.map((field) => {
          const fieldType = field.type || inferFormFieldType(field.field);
          return {
            ...field,
            type: fieldType,
            isText: fieldType === "text" || fieldType === "email",
            isNumber: fieldType === "number",
            isDate: fieldType === "date",
            isSelect: fieldType === "select",
            isBoolean: fieldType === "boolean",
            isTextArea: fieldType === "textarea",
            width: field.width || 300,
            rows: fieldType === "textarea" ? 4 : undefined,
            dateFormat: fieldType === "date" ? "YYYY-MM-DD" : undefined,
            options: field.options
              ? `[${field.options
                  .map((o) => `{ label: '${o.label}', value: '${o.value}' }`)
                  .join(", ")}]`
              : "[]",
          };
        });

        // Group fields logically
        const formGroups = groupFormFields(processedFields);

        // Get date fields for special handling
        const dateFields = processedFields.filter((f) => f.isDate);

        // Prepare template data
        const templateData = {
          FeatureName: params.featureName,
          displayTitle: params.featureName.replace(/([A-Z])/g, " $1").trim(),
          uniqueIdField: params.uniqueIdField,
          formGroups,
          dateFields,
          hasRelations: processedFields.some(
            (f) => f.isSelect && f.options === "[]"
          ),
          modalWidth: params.containerWidth || 600,
          drawerWidth: params.containerWidth || 720,
          ContainerType: params.containerType,
          storageKey: `${params.moduleName}_${params.featureName}`,
        };

        const filesCreated: string[] = [];

        // Create components directory if it doesn't exist
        const componentsPath = path.join(featurePath, "components");
        await fs.mkdir(componentsPath, { recursive: true });

        // Generate form component
        const formContent = SimpleTemplateEngine.render(
          FORM_COMPONENT_TEMPLATE,
          templateData
        );
        const formPath = path.join(
          componentsPath,
          `${params.featureName}Form.tsx`
        );
        await fs.writeFile(formPath, formContent, "utf-8");
        filesCreated.push(formPath);

        // Generate modal/drawer wrapper
        const containerTemplate =
          params.containerType === "Modal"
            ? FORM_MODAL_TEMPLATE
            : FORM_DRAWER_TEMPLATE;
        const containerContent = SimpleTemplateEngine.render(
          containerTemplate,
          templateData
        );
        const containerPath = path.join(
          componentsPath,
          `${params.featureName}Form${params.containerType}.tsx`
        );
        await fs.writeFile(containerPath, containerContent, "utf-8");
        filesCreated.push(containerPath);

        // Update grid component if requested
        if (params.updateGrid) {
          const gridPath = path.join(
            componentsPath,
            `${params.featureName}Grid.tsx`
          );
          try {
            // Check if grid exists
            await fs.access(gridPath);

            // Generate enhanced grid
            const enhancedGridContent = SimpleTemplateEngine.render(
              ENHANCED_GRID_TEMPLATE,
              templateData
            );

            // Create backup
            const backupPath = `${gridPath}.backup`;
            const originalContent = await fs.readFile(gridPath, "utf-8");
            await fs.writeFile(backupPath, originalContent, "utf-8");

            // Write enhanced grid
            await fs.writeFile(gridPath, enhancedGridContent, "utf-8");
            filesCreated.push(gridPath);
          } catch (error) {
            // Grid doesn't exist, skip update
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `✅ **Form Generated Successfully!**

**Module:** ${params.moduleName}
**Feature:** ${params.featureName}
**Container Type:** ${params.containerType}

**Files Created:**
${filesCreated
  .map((file) => `• ${path.relative(params.projectRoot, file)}`)
  .join("\n")}

**Form Structure:**
${formGroups
  .map(
    (group) =>
      `\n**${group.groupTitle}:**\n${group.fields
        .map(
          (f: any) =>
            `  • ${f.label} (${f.type}${f.required ? ", required" : ""})`
        )
        .join("\n")}`
  )
  .join("\n")}

**Integration Steps:**

1. **Update Column Definitions** to include edit action:
\`\`\`typescript
// In columnDefs.tsx, update ActionMenu to accept callbacks:
export const get${params.featureName}ColumnDefs = ({ onEdit, onDelete }) => [
  // ... existing columns
  {
    headerName: 'Actions',
    cellRendererParams: {
      onEdit,
      onDelete,
    },
  },
]
\`\`\`

2. **Update Action Menu** to call the callbacks:
\`\`\`typescript
// In components/actionMenu.tsx:
<Menu.Item key="edit" onClick={() => onEdit(data)}>
  Edit
</Menu.Item>
\`\`\`

3. **For Select Fields**, add data fetching:
\`\`\`typescript
// In the form component, fetch options for select fields:
const { data: statusOptions } = useQuery(['statusOptions'], fetchStatusOptions)
\`\`\`

**Form Features:**
✅ Create and Edit modes
✅ Form validation
✅ ${params.containerType} container
✅ Integrated with TanStack Query mutations
✅ Date field handling with moment.js
✅ Loading states
✅ Error notifications
${params.updateGrid ? "✅ Grid component updated with form integration" : ""}

**Next Steps:**
1. Customize field validation rules
2. Add any dependent field logic
3. Implement custom select options fetching
4. Test create and edit operations`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error generating form: ${error}`,
            },
          ],
        };
      }
    }
  );

  // Tool: Generate standalone form
  server.tool(
    "generate_standalone_form",
    "Generate a standalone form component that can be used anywhere",
    {
      formName: z
        .string()
        .describe("Form name in PascalCase (e.g., 'UserProfile')"),
      fields: z
        .array(
          z.object({
            field: z.string(),
            label: z.string(),
            type: z
              .enum([
                "text",
                "number",
                "date",
                "select",
                "boolean",
                "textarea",
                "email",
              ])
              .optional(),
            required: z.boolean().optional(),
            placeholder: z.string().optional(),
            validation: z.string().optional(),
          })
        )
        .describe("Form field definitions"),
      layout: z.enum(["vertical", "horizontal", "inline"]).default("vertical"),
      submitEndpoint: z
        .string()
        .optional()
        .describe("API endpoint for form submission"),
      outputPath: z.string().describe("Where to save the form component"),
    },
    async (params) => {
      // Implementation for standalone forms
      // This would generate a form that's not tied to a specific feature
      return {
        content: [
          {
            type: "text",
            text: "Standalone form generation coming soon!",
          },
        ],
      };
    }
  );
}
