import fs from "fs";
import path from "path";

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'date' | 'dateRange' | 'switch' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: string[];
}

export interface FormAction {
  type: 'submit' | 'cancel' | 'reset';
  label: string;
  theme?: 'success' | 'theme1' | 'default';
}

export interface CreateFormDemoParams {
  name: string;
  type: 'simple' | 'management' | 'bulk-edit' | 'inline-edit';
  fields: FormField[];
  actions?: FormAction[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  title?: string;
}

const DEMO_DIR = path.join(process.cwd(), "demo", "src", "pages", "demos");

// Generate form field based on type
function generateFormField(field: FormField): string {
  const { name, label, type, required, placeholder, options, validation } = field;
  
  // Build validation rules
  const rules: string[] = [];
  if (required) {
    rules.push(`{ required: true, message: '${label} is required' }`);
  }
  if (validation) {
    rules.push(...validation);
  }
  const rulesString = rules.length > 0 ? `rules={[${rules.join(', ')}]}` : '';
  
  // Generate field component based on type
  let fieldComponent = '';
  
  switch (type) {
    case 'text':
    case 'email':
      fieldComponent = `<Input ${placeholder ? `placeholder="${placeholder}"` : ''} />`;
      break;
      
    case 'number':
      fieldComponent = `<InputNumber ${placeholder ? `placeholder="${placeholder}"` : ''} style={{ width: '100%' }} />`;
      break;
      
    case 'select':
      const optionsString = options ? options.map(opt => `<Option value="${opt}">${opt}</Option>`).join('\n        ') : '';
      fieldComponent = `<Select ${placeholder ? `placeholder="${placeholder}"` : ''}>\n        ${optionsString}\n      </Select>`;
      break;
      
    case 'date':
      fieldComponent = `<DatePicker style={{ width: '100%' }} />`;
      break;
      
    case 'dateRange':
      fieldComponent = `<RangePicker style={{ width: '100%' }} />`;
      break;
      
    case 'switch':
      fieldComponent = `<Switch />`;
      break;
      
    case 'checkbox':
      fieldComponent = `<Checkbox>${label}</Checkbox>`;
      break;
      
    default:
      fieldComponent = `<Input ${placeholder ? `placeholder="${placeholder}"` : ''} />`;
  }
  
  // For checkbox, don't show label separately
  if (type === 'checkbox') {
    return `        <Form.Item name="${name}" valuePropName="checked" ${rulesString}>
          ${fieldComponent}
        </Form.Item>`;
  }
  
  return `        <Form.Item 
          name="${name}" 
          label="${label}"
          ${rulesString}
        >
          ${fieldComponent}
        </Form.Item>`;
}

// Generate action buttons
function generateActions(actions: FormAction[] = []): string {
  // Default actions if none provided
  if (actions.length === 0) {
    actions = [
      { type: 'cancel', label: 'Cancel', theme: 'default' },
      { type: 'submit', label: 'Save', theme: 'success' }
    ];
  }
  
  const buttons = actions.map(action => {
    const themeProps = action.theme === 'success' ? 'success' : action.theme === 'theme1' ? 'theme1' : '';
    const htmlType = action.type === 'submit' ? 'htmlType="submit"' : '';
    const onClick = action.type === 'reset' ? 'onClick={() => form.resetFields()}' : 
                   action.type === 'cancel' ? 'onClick={() => console.log("Cancel clicked")}' : '';
    
    return `            <GraviButton 
              ${htmlType}
              ${themeProps}
              ${onClick}
            >
              ${action.label}
            </GraviButton>`;
  }).join('\n');
  
  return `        <Form.Item>
          <Horizontal style={{ gap: "12px", justifyContent: "flex-end" }}>
${buttons}
          </Horizontal>
        </Form.Item>`;
}

// Generate the main form component
function generateFormComponent(params: CreateFormDemoParams): string {
  const { name, fields, actions, title } = params;
  
  const imports = new Set([
    'GraviButton', 'Horizontal', 'Texto', 'Vertical'
  ]);
  
  // Determine needed antd imports based on field types
  const antdImports = new Set(['Form']);
  fields.forEach(field => {
    switch (field.type) {
      case 'text':
      case 'email':
        antdImports.add('Input');
        break;
      case 'number':
        antdImports.add('InputNumber');
        break;
      case 'select':
        antdImports.add('Select');
        break;
      case 'date':
      case 'dateRange':
        antdImports.add('DatePicker');
        break;
      case 'switch':
        antdImports.add('Switch');
        break;
      case 'checkbox':
        antdImports.add('Checkbox');
        break;
    }
  });
  
  // Generate field components
  const fieldsString = fields.map(field => generateFormField(field)).join('\n\n');
  
  // Generate actions
  const actionsString = generateActions(actions);
  
  // Need destructuring for DatePicker
  const datePickerDestructure = fields.some(f => f.type === 'dateRange') ? 
    '\nconst { RangePicker } = DatePicker;' : '';
    
  // Need Option destructure for Select
  const selectDestructure = fields.some(f => f.type === 'select') ? 
    '\nconst { Option } = Select;' : '';
  
  return `import { ${Array.from(imports).join(', ')} } from '@gravitate-js/excalibrr';
import { ${Array.from(antdImports).join(', ')} } from 'antd';
import React from 'react';
${datePickerDestructure}${selectDestructure}

export function ${name}() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form submitted:', values);
    // Mock save action - replace with actual API call
  };

  return (
    <Vertical style={{ padding: "24px", maxWidth: "600px" }}>
      <Texto category="h4" style={{ marginBottom: "24px" }}>
        ${title || name}
      </Texto>
      
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
${fieldsString}

${actionsString}
      </Form>
    </Vertical>
  );
}`;
}

// No longer generate index.tsx - we import components directly

// Generate mock data file
function generateMockData(fields: FormField[]): string {
  const mockValues: Record<string, any> = {};
  
  fields.forEach(field => {
    switch (field.type) {
      case 'text':
      case 'email':
        mockValues[field.name] = field.name.toLowerCase().includes('email') ? 'user@example.com' : 
                                 field.name.toLowerCase().includes('name') ? 'Sample Name' :
                                 'Sample Value';
        break;
      case 'number':
        mockValues[field.name] = 100;
        break;
      case 'select':
        mockValues[field.name] = field.options?.[0] || 'Option 1';
        break;
      case 'switch':
      case 'checkbox':
        mockValues[field.name] = true;
        break;
      case 'date':
        mockValues[field.name] = new Date().toISOString().split('T')[0];
        break;
      case 'dateRange':
        mockValues[field.name] = [
          new Date().toISOString().split('T')[0],
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        ];
        break;
    }
  });
  
  return `// Mock data for ${fields[0]?.name || 'form'}
export const mockFormData = ${JSON.stringify(mockValues, null, 2)};

// Example options for select fields
${fields.filter(f => f.type === 'select').map(field => 
  `export const ${field.name}Options = ${JSON.stringify(field.options || ['Option 1', 'Option 2', 'Option 3'], null, 2)};`
).join('\n\n')}`;
}

export async function createFormDemo(params: CreateFormDemoParams): Promise<string> {
  const { name } = params;
  
  // Validate parameters
  if (!name) {
    throw new Error("Form name is required");
  }
  
  if (!params.fields || params.fields.length === 0) {
    throw new Error("At least one field is required");
  }
  
  // Create demo directory
  const demoPath = path.join(DEMO_DIR, name);
  if (!fs.existsSync(demoPath)) {
    fs.mkdirSync(demoPath, { recursive: true });
  }
  
  // Generate files
  const formComponent = generateFormComponent(params);
  const mockDataFile = generateMockData(params.fields);
  
  // Write files
  fs.writeFileSync(path.join(demoPath, `${name}.tsx`), formComponent);
  fs.writeFileSync(path.join(demoPath, `${name}.data.ts`), mockDataFile);
  
  // Update pageConfig.tsx to include new demo
  const pageConfigPath = path.join(process.cwd(), "demo", "src", "pageConfig.tsx");
  if (fs.existsSync(pageConfigPath)) {
    let pageConfig = fs.readFileSync(pageConfigPath, "utf8");
    
    // Add import - import component directly from its file
    const importLine = `import { ${name} } from "./pages/demos/${name}/${name}";`;
    if (!pageConfig.includes(importLine)) {
      const importInsertPoint = pageConfig.indexOf('export const createPageConfig');
      pageConfig = pageConfig.slice(0, importInsertPoint) + importLine + '\n' + pageConfig.slice(importInsertPoint);
    }
    
    // Add to config object - use component directly
    const configEntry = `  ${name}: {
    hasPermission: () => true,
    key: "${name}",
    icon: <FileOutlined />,
    title: "${params.title || name}",
    element: <${name} />,
  },`;
    
    if (!pageConfig.includes(`${name}:`)) {
      const configInsertPoint = pageConfig.lastIndexOf('});');
      pageConfig = pageConfig.slice(0, configInsertPoint) + configEntry + '\n' + pageConfig.slice(configInsertPoint);
    }
    
    fs.writeFileSync(pageConfigPath, pageConfig);
  }
  
  // Update AuthenticatedRoute.jsx to add the scope
  const authRoutePath = path.join(process.cwd(), "demo", "src", "_Main", "AuthenticatedRoute.jsx");
  if (fs.existsSync(authRoutePath)) {
    let authRoute = fs.readFileSync(authRoutePath, "utf8");
    
    // Find the scopes object and add the new scope
    const scopesRegex = /const scopes = \{([^}]*)\}/;
    const scopesMatch = authRoute.match(scopesRegex);
    
    if (scopesMatch && !authRoute.includes(`${name}: true`)) {
      const existingScopes = scopesMatch[1];
      const newScope = `    ${name}: true,`;
      const updatedScopes = existingScopes.trimEnd() + '\n' + newScope;
      authRoute = authRoute.replace(scopesRegex, `const scopes = {${updatedScopes}\n  }`);
      fs.writeFileSync(authRoutePath, authRoute);
    }
  }
  
  return `✅ Created form demo: ${name}
📁 Files generated:
  - ${name}/${name}.tsx (main form component)
  - ${name}/${name}.data.ts (mock data)
  
🎯 Demo available at: http://localhost:3000/${name}
🔄 Page config and scopes updated automatically`;
}