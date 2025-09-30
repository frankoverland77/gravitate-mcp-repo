# Formula Manager Implementation Guide
## Excalibrr Design System Pattern

A comprehensive guide for building formula/rule management interfaces using the Excalibrr design system. This pattern can be adapted for any domain requiring mathematical formulas, business rules, pricing calculations, scoring systems, or transformations.

---

## Table of Contents
1. [Phase 1: Static Layout & Components](#phase-1-static-layout--components)
2. [Phase 2: Dynamic Features & Interactions](#phase-2-dynamic-features--interactions)
3. [Reusable Patterns & Utilities](#reusable-patterns--utilities)
4. [Domain Configuration Examples](#domain-configuration-examples)

---

## Phase 1: Static Layout & Components

### 1.1 Required Dependencies

```typescript
// Excalibrr Components
import { Horizontal, Vertical, GraviButton, Texto, GraviGrid } from '@gravitate-js/excalibrr';

// Ant Design Components
import { Switch, Popover, Input, Select, Popconfirm, Drawer } from 'antd';

// Icons
import { 
  FolderOutlined, FolderAddOutlined, FunctionOutlined, EditOutlined, 
  DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined, 
  DownOutlined, RightOutlined, ExperimentOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
```

### 1.2 Three-Column Layout Structure

```typescript
export function FormulaManager() {
  return (
    <Horizontal style={{ 
      minHeight: '100vh', 
      gap: '0',
      padding: '0',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Left Column - Formula Library (20%) */}
      <Vertical style={{ 
        width: '20%',
        minHeight: '100%',
        padding: '16px',
        overflow: 'auto'
      }}>
        {/* Formula Library Content */}
      </Vertical>

      {/* Middle Column - Editor Workspace (60%) */}
      <Vertical style={{ 
        width: '60%',
        borderLeft: '1px solid #d9d9d9',
        borderRight: '1px solid #d9d9d9',
        padding: '24px',
        minHeight: '100%',
        overflow: 'auto'
      }}>
        {/* Editor Content */}
      </Vertical>

      {/* Right Column - Entity Mapping (20%) */}
      <Vertical style={{ 
        width: '20%',
        minHeight: '100%',
        padding: '16px',
        overflow: 'auto'
      }}>
        {/* Entity Mapping Content */}
      </Vertical>
    </Horizontal>
  );
}
```

### 1.3 Left Column: Formula Library

```typescript
// Formula Library Structure
<Vertical style={{ gap: '0' }}>
  {/* Header */}
  <Texto category="h4" style={{ marginBottom: '12px' }}>
    Formulas
  </Texto>
  
  {/* Caption */}
  <Texto category="p2" style={{ 
    marginBottom: '16px', 
    color: '#666',
    lineHeight: '1.4',
    fontSize: '12px'
  }}>
    Set [domain-specific] formulas for [entity] calculations using variables, operators, and templates.
  </Texto>
  
  {/* Action Buttons */}
  <Horizontal style={{ marginBottom: '16px', gap: '8px', flexWrap: 'wrap' }}>
    <GraviButton 
      buttonText='Add Folder' 
      theme2 
      appearance='outlined' 
      icon={<FolderAddOutlined />}
      size="small" 
    />
    <GraviButton 
      buttonText='Add Formula' 
      theme1 
      icon={<PlusOutlined />}
      size="small" 
    />   
  </Horizontal>
  
  {/* Folder/Formula Tree */}
  <Vertical style={{ gap: '0' }}>
    {/* Dynamic folder/formula list */}
  </Vertical>
</Vertical>
```

### 1.4 Middle Column: Editor Workspace

```typescript
// Editor Header Section
<Vertical style={{ marginBottom: '24px', width: '100%' }}>
  <Horizontal style={{ marginBottom: '16px', gap: '12px', width: '100%' }}>
    {/* Formula Name Input */}
    <Vertical style={{ flex: 1 }}>
      <div className="eyebrow-label">Formula Name</div>
      <input
        type="text"
        placeholder="Enter formula name..."
        style={{
          padding: '8px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '14px',
          outline: 'none',
          width: '100%'
        }}
      />
    </Vertical>
    
    {/* Category/Folder Selection */}
    <Vertical style={{ flex: 1 }}>
      <div className="eyebrow-label">Category</div>
      <Select
        placeholder="Select category..."
        style={{ width: '100%' }}
        options={[]} // Dynamic categories
      />
    </Vertical>
  </Horizontal>

  {/* Status and Save Button */}
  <Horizontal style={{ alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
    <Vertical style={{ alignItems: 'flex-start' }}>
      <div className="eyebrow-label">Status</div>
      <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
        <CheckOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
        <Texto category="p1" style={{ color: '#52c41a', margin: 0 }}>
          Ready
        </Texto>
      </Horizontal>
    </Vertical>

    <GraviButton 
      buttonText="Save Formula"
      theme1
      size="small"
    />
  </Horizontal>
</Vertical>
```

### 1.5 Quick Operators Section

```typescript
// Mathematical Operators (Version A) or Side-by-Side with Templates (Version B)
<Vertical style={{ marginBottom: '16px' }}>
  <div className="eyebrow-label" style={{ marginBottom: '8px' }}>Quick Operators</div>
  <Horizontal style={{ gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
    {['+', '-', '*', '/', '(', ')', '%', '^', '.'].map((operator, index) => (
      <GraviButton
        key={index}
        buttonText={operator}
        appearance="outlined"
        size="small"
        style={{
          minWidth: '32px',
          height: '32px',
          padding: '0',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      />
    ))}
    <GraviButton
      buttonText="Space"
      appearance="outlined"
      size="small"
      style={{
        minWidth: '50px',
        height: '32px',
        fontSize: '11px'
      }}
    />
  </Horizontal>
</Vertical>
```

### 1.6 Formula Editor

```typescript
// Main Formula Editor
<div style={{ position: 'relative', marginBottom: '16px' }}>
  <textarea
    className="formula-editor"
    placeholder="Enter your formula here..."
    style={{ 
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontFamily: 'Consolas, Monaco, Courier New, monospace',
      border: '1px solid #333',
      borderRadius: '6px',
      padding: '16px',
      minHeight: '200px',
      width: '100%',
      boxSizing: 'border-box',
      resize: 'none',
      outline: 'none',
      fontSize: '14px',
      lineHeight: '1.5'
    }}
  />
  
  {/* Validation Indicator */}
  <div style={{
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#52c41a' // or '#ff4d4f' for invalid
  }}>
    ✓ Valid
  </div>
</div>
```

### 1.7 Variables Grid

```typescript
// Variables Management Section
<Vertical style={{ marginBottom: '0', alignItems: 'flex-start' }}>
  <Texto category="h4" style={{ marginBottom: '8px' }}>
    Variables
  </Texto>
  <Texto category="p2" style={{ color: '#666', marginBottom: '16px' }}>
    Click on a variable to insert it into your formula. These are the available variables you can use in your calculations.
  </Texto>
  
  {/* Add Variable Button */}
  <GraviButton 
    buttonText="Add Variable"
    theme1
    appearance="outlined"
    icon={<PlusOutlined />}
    size="small"
    style={{ alignSelf: 'flex-start', marginBottom: '12px' }}
  />
  
  {/* Variables Grid */}
  <div style={{ 
    height: '250px',
    width: '100%',
    border: '1px solid #d9d9d9', 
    borderRadius: '6px'
  }}>
    <GraviGrid
      rowData={[]} // Dynamic variables
      columnDefs={[
        {
          field: 'name',
          headerName: 'Name',
          flex: 1,
          cellRenderer: (params: any) => (
            <span 
              style={{ 
                cursor: 'pointer', 
                color: '#1890ff',
                textDecoration: 'underline' 
              }}
            >
              {params.value}
            </span>
          )
        },
        { field: 'type', headerName: 'Type', width: 80 },
        { field: 'value', headerName: 'Value', width: 100 },
        { field: 'description', headerName: 'Description', flex: 2 }
      ]}
      agPropOverrides={{
        domLayout: 'normal',
        headerHeight: 40,
        rowHeight: 40,
        suppressHorizontalScroll: true
      }}
    />
  </div>
</Vertical>
```

### 1.8 Right Column: Entity Mapping

```typescript
// Entity Application Panel
<Vertical style={{ gap: '16px' }}>
  <Texto category="h4" style={{ marginBottom: '12px' }}>
    Apply to [Entities]
  </Texto>
  
  <Texto category="p2" style={{ 
    marginBottom: '16px', 
    color: '#666',
    lineHeight: '1.4',
    fontSize: '12px'
  }}>
    This formula is applied to the following [entities]. You can add or remove [entities] to control which items use this calculation.
  </Texto>
  
  {/* Entity Count and Add Button */}
  <Horizontal style={{ marginBottom: '16px', gap: '8px', alignItems: 'center' }}>
    <Texto category="p2" style={{ color: '#666' }}>
      {0} [Entity/Entities]
    </Texto>
    <GraviButton 
      buttonText="Create Mapping"
      theme2
      size="small"
      icon={<PlusOutlined />}
    />
  </Horizontal>
  
  {/* Applied Entities List */}
  <div style={{ 
    maxHeight: '300px',
    width: '100%',
    border: '1px solid #d9d9d9', 
    borderRadius: '6px',
    overflow: 'auto'
  }}>
    {/* Dynamic entity list */}
  </div>
</Vertical>
```

### 1.9 A/B Testing FAB

```typescript
// Floating Action Button for Version Testing
<div className="fab-container" style={{
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 1000
}}>
  <button 
    className="fab-button"
    style={{
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    }}
  >
    <ExperimentOutlined />
  </button>
</div>
```

---

## Phase 2: Dynamic Features & Interactions

### 2.1 Core State Management

```typescript
// Essential State Variables
const [formulaText, setFormulaText] = useState('');
const [formulaName, setFormulaName] = useState('');
const [selectedFormula, setSelectedFormula] = useState<string | null>(null);
const [formulas, setFormulas] = useState<Formula[]>([]);
const [variables, setVariables] = useState<Variable[]>([]);
const [entities, setEntities] = useState<Entity[]>([]);
const [selectedEntities, setSelectedEntities] = useState<string[]>([]);

// Validation State
const [formulaValidation, setFormulaValidation] = useState<{
  isValid: boolean, 
  error?: string
}>({isValid: true});
const [validationMessage, setValidationMessage] = useState<string>('');

// UI State
const [collapsedFolders, setCollapsedFolders] = useState<string[]>([]);
const [editingMode, setEditingMode] = useState(false);
const [versionMode, setVersionMode] = useState<'A' | 'B'>('A');

// Template Management State
const [templates, setTemplates] = useState<Template[]>([]);
const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
const [editingTemplateData, setEditingTemplateData] = useState<any>(null);
const [templateEditModalVisible, setTemplateEditModalVisible] = useState(false);
```

### 2.2 Formula CRUD Operations

```typescript
// Create/Update Formula
const saveFormula = () => {
  const validation = validateFormula(formulaText);
  
  if (!validation.isValid) {
    setValidationMessage(validation.error || 'Invalid formula');
    return;
  }
  
  if (selectedFormula) {
    // Update existing formula
    const existingFormula = formulas.find(f => f.id === selectedFormula);
    if (existingFormula) {
      updateFormula({ 
        ...existingFormula, 
        name: formulaName, 
        formula: formulaText,
        folder: selectedFolderForFormula || existingFormula.folder
      });
    }
  } else {
    // Create new formula
    const newId = `f${Date.now()}`;
    const newFormula = {
      id: newId,
      name: formulaName,
      formula: formulaText,
      folder: selectedFolderForFormula || 'Default'
    };
    setFormulas([...formulas, newFormula]);
    setSelectedFormula(newId);
  }
  
  setEditingMode(false);
  setValidationMessage('Formula saved successfully!');
  setTimeout(() => setValidationMessage(''), 3000);
};

// Delete Formula
const deleteFormula = (formulaId: string) => {
  setFormulas(formulas.filter(f => f.id !== formulaId));
  if (selectedFormula === formulaId) {
    setSelectedFormula(null);
    setFormulaName('');
    setFormulaText('');
  }
};

// Select Formula for Editing
const selectFormula = (formulaId: string) => {
  const formula = formulas.find(f => f.id === formulaId);
  if (formula) {
    setSelectedFormula(formulaId);
    setFormulaName(formula.name);
    setFormulaText(formula.formula);
    setSelectedFolderForFormula(formula.folder);
    setEditingMode(true);
  }
};
```

### 2.3 Variable Management

```typescript
// Add Variable
const handleAddVariable = () => {
  if (newVariable.name.trim() && newVariable.value.trim()) {
    const newId = Math.max(...variables.map(v => v.id), 0) + 1;
    setVariables([...variables, { ...newVariable, id: newId }]);
    setNewVariable({ name: '', type: 'Number', value: '', description: '' });
    setAddVariableVisible(false);
    setValidationMessage(`Variable "${newVariable.name}" added successfully!`);
    setTimeout(() => setValidationMessage(''), 3000);
  }
};

// Insert Variable into Formula
const insertVariableAtCursor = (variableName: string) => {
  const textarea = textareaRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const newValue = formulaText.substring(0, start) + variableName + formulaText.substring(end);
  setFormulaText(newValue);

  // Set cursor position after inserted text
  setTimeout(() => {
    const newCursorPos = start + variableName.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  }, 0);
};

// Insert Operator
const insertOperator = (operator: string) => {
  const textarea = textareaRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const newValue = formulaText.substring(0, start) + operator + formulaText.substring(end);
  setFormulaText(newValue);

  setTimeout(() => {
    const newCursorPos = start + operator.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  }, 0);
};
```

### 2.4 Formula Validation

```typescript
// Real-time Formula Validation
const validateFormula = (formula: string) => {
  try {
    // Replace variables with test values
    let testFormula = formula;
    variables.forEach(variable => {
      const regex = new RegExp(variable.name, 'g');
      testFormula = testFormula.replace(regex, variable.value);
    });
    
    // Check for valid mathematical expression
    const result = Function('"use strict"; return (' + testFormula + ')')();
    
    if (typeof result !== 'number' || isNaN(result)) {
      return { isValid: false, error: 'Formula must evaluate to a number' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Invalid syntax. Check your variables and operators.' 
    };
  }
};

// Real-time validation on formula change
useEffect(() => {
  const validation = validateFormula(formulaText);
  setFormulaValidation(validation);
}, [formulaText, variables]);
```

### 2.5 Template Management

```typescript
// Apply Template to Current Formula
const applyTemplate = (template: Template) => {
  setFormulaText(template.formula);
  if (!formulaName.trim()) {
    setFormulaName(template.name);
  }
  setTimeout(() => {
    textareaRef.current?.focus();
  }, 0);
};

// Save Current Formula as Template
const saveAsTemplate = () => {
  if (!formulaName.trim() || !formulaText.trim()) {
    setValidationMessage('Formula name and text are required to save as template');
    setTimeout(() => setValidationMessage(''), 3000);
    return;
  }

  const newTemplate = {
    id: Date.now(),
    name: formulaName,
    formula: formulaText,
    description: `Custom template: ${formulaName}`,
    category: 'Custom'
  };

  setCustomTemplates([...customTemplates, newTemplate]);
  setValidationMessage(`Template "${formulaName}" saved successfully!`);
  setTimeout(() => setValidationMessage(''), 3000);
};

// Template Editing Functions
const startEditingTemplate = (template: Template) => {
  setEditingTemplateId(template.id);
  setEditingTemplateData({ ...template });
  if (versionMode === 'B') {
    setTemplateEditModalVisible(true);
  }
};

const saveEditingTemplate = () => {
  if (editingTemplateData) {
    setCustomTemplates(customTemplates.map(t => 
      t.id === editingTemplateData.id ? editingTemplateData : t
    ));
    setValidationMessage(`Template "${editingTemplateData.name}" updated successfully!`);
    setTimeout(() => setValidationMessage(''), 3000);
    cancelEditingTemplate();
  }
};

const cancelEditingTemplate = () => {
  setEditingTemplateId(null);
  setEditingTemplateData(null);
  setTemplateEditModalVisible(false);
};

const deleteTemplate = (templateId: number) => {
  const template = customTemplates.find(t => t.id === templateId);
  if (template) {
    setCustomTemplates(customTemplates.filter(t => t.id !== templateId));
    setValidationMessage(`Template "${template.name}" deleted successfully!`);
    setTimeout(() => setValidationMessage(''), 3000);
  }
};
```

### 2.6 Drag & Drop Functionality

```typescript
// Drag and Drop State
const [draggedFormula, setDraggedFormula] = useState<string | null>(null);
const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
const [showPlaceholder, setShowPlaceholder] = useState(false);
const [isDragging, setIsDragging] = useState(false);

// Drag Event Handlers
const handleDragStart = (e: React.DragEvent, formulaId: string) => {
  setDraggedFormula(formulaId);
  setShowPlaceholder(true);
  setIsDragging(true);
  e.dataTransfer.effectAllowed = 'move';
};

const handleDragEnd = () => {
  setDraggedFormula(null);
  setDragOverFolder(null);
  setShowPlaceholder(false);
  setIsDragging(false);
};

const handleDragOver = (e: React.DragEvent, folderName: string) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  setDragOverFolder(folderName);
};

const handleDrop = (e: React.DragEvent, targetFolder: string) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (draggedFormula) {
    const formula = formulas.find(f => f.id === draggedFormula);
    if (formula) {
      updateFormula({ ...formula, folder: targetFolder });
    }
  }
  
  handleDragEnd();
};
```

### 2.7 Entity Mapping

```typescript
// Toggle Entity Selection
const toggleEntitySelection = (entityId: string) => {
  setSelectedEntities(prev => 
    prev.includes(entityId) 
      ? prev.filter(id => id !== entityId)
      : [...prev, entityId]
  );
};

// Apply Formula to Selected Entities
const addSelectedEntitiesToApplied = () => {
  if (selectedFormula) {
    applyFormulaToEntities(selectedFormula, selectedEntities);
    setSelectedEntities([]);
    setPopoverVisible(false);
  }
};

// Remove Formula from Entity
const removeFormulaFromEntity = (entityId: string) => {
  removeFormulaFromEntity(entityId);
};

// Get entities with current formula applied
const appliedEntities = selectedFormula ? getEntitiesWithFormula(selectedFormula) : [];

// Get available entities for mapping
const getAvailableEntities = () => {
  return selectedFormula ? getAvailableEntitiesForFormula(selectedFormula) : [];
};
```

---

## Reusable Patterns & Utilities

### 3.1 Common CSS Classes

```css
.formula-editor {
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 16px;
  min-height: 200px;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
}

.eyebrow-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
  margin-bottom: 4px;
}

.formula-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.formula-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.formula-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.formula-item:hover .formula-actions {
  opacity: 1;
}

.fab-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.fab-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #1890ff;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
}
```

### 3.2 TypeScript Interfaces

```typescript
// Core Data Types
interface Formula {
  id: string;
  name: string;
  formula: string;
  folder: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Variable {
  id: number;
  name: string;
  type: 'Number' | 'Text' | 'Boolean';
  value: string;
  description: string;
}

interface Template {
  id: number;
  name: string;
  formula: string;
  description: string;
  category: string;
}

interface Entity {
  id: string;
  name: string;
  description?: string;
  [key: string]: any; // Domain-specific properties
}

interface Folder {
  name: string;
  formulas: Formula[];
  isEmpty: boolean;
}

// Validation Types
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Component Props
interface FormulaManagerProps {
  domain: string;
  entityType: string;
  entityTypePlural: string;
  defaultVariables: Variable[];
  defaultTemplates: Template[];
  onFormulaApply?: (formulaId: string, entityIds: string[]) => void;
  onFormulaRemove?: (entityId: string) => void;
}
```

### 3.3 Utility Functions

```typescript
// Formula Utilities
export const createFormulaId = () => `f${Date.now()}`;
export const createTemplateId = () => Date.now();
export const createVariableId = (existingVariables: Variable[]) => 
  Math.max(...existingVariables.map(v => v.id), 0) + 1;

// Validation Utilities
export const validateVariableName = (name: string, existingVariables: Variable[]) => {
  if (!name.trim()) return { isValid: false, error: 'Variable name is required' };
  if (existingVariables.some(v => v.name === name)) {
    return { isValid: false, error: 'Variable name already exists' };
  }
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    return { isValid: false, error: 'Invalid variable name format' };
  }
  return { isValid: true };
};

export const validateFormulaSyntax = (formula: string, variables: Variable[]) => {
  try {
    let testFormula = formula;
    variables.forEach(variable => {
      const regex = new RegExp(`\\b${variable.name}\\b`, 'g');
      testFormula = testFormula.replace(regex, variable.value);
    });
    
    const result = Function('"use strict"; return (' + testFormula + ')')();
    
    if (typeof result !== 'number' || isNaN(result)) {
      return { isValid: false, error: 'Formula must evaluate to a number' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Invalid syntax. Check your variables and operators.' 
    };
  }
};

// Folder Management Utilities
export const getFoldersWithFormulas = (formulas: Formula[], emptyFolders: string[]) => {
  const folderMap: Record<string, Formula[]> = {};
  
  formulas.forEach(formula => {
    if (!folderMap[formula.folder]) {
      folderMap[formula.folder] = [];
    }
    folderMap[formula.folder].push(formula);
  });
  
  emptyFolders.forEach(folderName => {
    if (!folderMap[folderName]) {
      folderMap[folderName] = [];
    }
  });
  
  return Object.entries(folderMap).map(([name, formulas]) => ({ 
    name, 
    formulas, 
    isEmpty: formulas.length === 0 
  }));
};

export const getUniqueFolders = (formulas: Formula[], emptyFolders: string[]) => {
  const formulaFolders = [...new Set(formulas.map(f => f.folder))];
  const allFolders = [...new Set([...formulaFolders, ...emptyFolders])];
  return allFolders.sort();
};

// Template Management Utilities
export const groupTemplatesByCategory = (templates: Template[], customTemplates: Template[]) => {
  const allTemplates = [...templates, ...customTemplates];
  const categories = ['Basic', 'Advanced', 'Custom']; // Domain-specific categories
  
  return categories.map(category => ({
    category,
    templates: allTemplates.filter(t => t.category === category)
  })).filter(group => group.templates.length > 0);
};

// Message Utilities
export const createSuccessMessage = (action: string, name: string) => 
  `${action} "${name}" completed successfully!`;

export const createErrorMessage = (action: string, error: string) => 
  `${action} failed: ${error}`;
```

### 3.4 Custom Hooks

```typescript
// useFormulaValidation Hook
export const useFormulaValidation = (formulaText: string, variables: Variable[]) => {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });

  useEffect(() => {
    const result = validateFormulaSyntax(formulaText, variables);
    setValidation(result);
  }, [formulaText, variables]);

  return validation;
};

// useLocalStorage Hook for Persistence
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};

// useDebounce Hook for Performance
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

---

## Domain Configuration Examples

### 4.1 Pricing Calculator (E-commerce/Retail)

```typescript
const pricingConfig = {
  domain: 'pricing',
  entityType: 'product',
  entityTypePlural: 'products',
  defaultVariables: [
    { id: 1, name: 'base_cost', type: 'Number', value: '10.00', description: 'Base product cost' },
    { id: 2, name: 'shipping_cost', type: 'Number', value: '5.00', description: 'Shipping cost' },
    { id: 3, name: 'markup_percent', type: 'Number', value: '1.4', description: 'Markup multiplier' },
    { id: 4, name: 'tax_rate', type: 'Number', value: '0.08', description: 'Tax rate percentage' },
    { id: 5, name: 'discount_rate', type: 'Number', value: '0.1', description: 'Discount percentage' }
  ],
  defaultTemplates: [
    {
      id: 1,
      name: 'Standard Pricing',
      formula: '(base_cost + shipping_cost) * markup_percent',
      description: 'Standard markup pricing',
      category: 'Basic'
    },
    {
      id: 2,
      name: 'Tax Inclusive',
      formula: '(base_cost + shipping_cost) * markup_percent * (1 + tax_rate)',
      description: 'Pricing with tax included',
      category: 'Advanced'
    }
  ],
  defaultFolders: ['Standard Pricing', 'Promotional', 'Seasonal'],
  operators: ['+', '-', '*', '/', '(', ')', '%', '^', '.']
};
```

### 4.2 Scoring System (HR/Performance)

```typescript
const scoringConfig = {
  domain: 'scoring',
  entityType: 'employee',
  entityTypePlural: 'employees',
  defaultVariables: [
    { id: 1, name: 'performance_score', type: 'Number', value: '85', description: 'Performance rating (0-100)' },
    { id: 2, name: 'attendance_rate', type: 'Number', value: '0.95', description: 'Attendance rate (0-1)' },
    { id: 3, name: 'project_completion', type: 'Number', value: '90', description: 'Project completion rate' },
    { id: 4, name: 'peer_rating', type: 'Number', value: '4.2', description: 'Peer review rating (1-5)' },
    { id: 5, name: 'goal_achievement', type: 'Number', value: '80', description: 'Goal achievement percentage' }
  ],
  defaultTemplates: [
    {
      id: 1,
      name: 'Basic Performance',
      formula: '(performance_score * 0.6) + (attendance_rate * 100 * 0.4)',
      description: 'Weighted performance and attendance',
      category: 'Basic'
    },
    {
      id: 2,
      name: 'Comprehensive Score',
      formula: '(performance_score * 0.4) + (project_completion * 0.3) + (peer_rating * 20 * 0.2) + (goal_achievement * 0.1)',
      description: 'Multi-factor scoring system',
      category: 'Advanced'
    }
  ],
  defaultFolders: ['Performance Reviews', 'Annual Evaluations', 'Probation Assessments'],
  operators: ['+', '-', '*', '/', '(', ')', '.']
};
```

### 4.3 Risk Assessment (Finance/Insurance)

```typescript
const riskConfig = {
  domain: 'risk_assessment',
  entityType: 'policy',
  entityTypePlural: 'policies',
  defaultVariables: [
    { id: 1, name: 'age_factor', type: 'Number', value: '1.2', description: 'Age-based risk multiplier' },
    { id: 2, name: 'location_risk', type: 'Number', value: '0.8', description: 'Geographic risk factor' },
    { id: 3, name: 'coverage_amount', type: 'Number', value: '100000', description: 'Coverage amount' },
    { id: 4, name: 'deductible', type: 'Number', value: '1000', description: 'Policy deductible' },
    { id: 5, name: 'claim_history', type: 'Number', value: '1.1', description: 'Claims history multiplier' }
  ],
  defaultTemplates: [
    {
      id: 1,
      name: 'Basic Premium',
      formula: 'coverage_amount * 0.001 * age_factor * location_risk',
      description: 'Standard premium calculation',
      category: 'Basic'
    },
    {
      id: 2,
      name: 'Risk-Adjusted Premium',
      formula: 'coverage_amount * 0.001 * age_factor * location_risk * claim_history * (deductible < 500 ? 1.2 : 1.0)',
      description: 'Premium with risk adjustments',
      category: 'Advanced'
    }
  ],
  defaultFolders: ['Auto Insurance', 'Home Insurance', 'Life Insurance'],
  operators: ['+', '-', '*', '/', '(', ')', '%', '?', ':', '<', '>', '==']
};
```

### 4.4 Manufacturing Cost Calculator

```typescript
const manufacturingConfig = {
  domain: 'manufacturing',
  entityType: 'product',
  entityTypePlural: 'products',
  defaultVariables: [
    { id: 1, name: 'material_cost', type: 'Number', value: '25.00', description: 'Raw material cost' },
    { id: 2, name: 'labor_hours', type: 'Number', value: '2.5', description: 'Direct labor hours' },
    { id: 3, name: 'labor_rate', type: 'Number', value: '18.00', description: 'Labor rate per hour' },
    { id: 4, name: 'overhead_rate', type: 'Number', value: '1.5', description: 'Overhead multiplier' },
    { id: 5, name: 'machine_cost', type: 'Number', value: '12.00', description: 'Machine operation cost' }
  ],
  defaultTemplates: [
    {
      id: 1,
      name: 'Direct Cost Only',
      formula: 'material_cost + (labor_hours * labor_rate)',
      description: 'Material and direct labor only',
      category: 'Basic'
    },
    {
      id: 2,
      name: 'Full Manufacturing Cost',
      formula: '(material_cost + (labor_hours * labor_rate) + machine_cost) * overhead_rate',
      description: 'Complete manufacturing cost with overhead',
      category: 'Advanced'
    }
  ],
  defaultFolders: ['Standard Products', 'Custom Orders', 'Prototypes'],
  operators: ['+', '-', '*', '/', '(', ')']
};
```

### 4.5 Energy Usage Calculator

```typescript
const energyConfig = {
  domain: 'energy_usage',
  entityType: 'facility',
  entityTypePlural: 'facilities',
  defaultVariables: [
    { id: 1, name: 'base_consumption', type: 'Number', value: '1000', description: 'Base energy consumption (kWh)' },
    { id: 2, name: 'peak_hours', type: 'Number', value: '8', description: 'Peak usage hours per day' },
    { id: 3, name: 'peak_rate', type: 'Number', value: '0.15', description: 'Peak rate per kWh' },
    { id: 4, name: 'off_peak_rate', type: 'Number', value: '0.08', description: 'Off-peak rate per kWh' },
    { id: 5, name: 'efficiency_factor', type: 'Number', value: '0.9', description: 'Energy efficiency multiplier' }
  ],
  defaultTemplates: [
    {
      id: 1,
      name: 'Flat Rate',
      formula: 'base_consumption * peak_rate * efficiency_factor',
      description: 'Simple flat rate calculation',
      category: 'Basic'
    },
    {
      id: 2,
      name: 'Time of Use',
      formula: '(base_consumption * 0.6 * peak_rate * peak_hours / 24) + (base_consumption * 0.4 * off_peak_rate * (24 - peak_hours) / 24)',
      description: 'Peak and off-peak pricing',
      category: 'Advanced'
    }
  ],
  defaultFolders: ['Commercial', 'Industrial', 'Residential'],
  operators: ['+', '-', '*', '/', '(', ')']
};
```

---

## Implementation Checklist

### Phase 1 Checklist: Static Layout
- [ ] Set up three-column layout structure
- [ ] Implement left column (formula library)
- [ ] Implement middle column (editor workspace)
- [ ] Implement right column (entity mapping)
- [ ] Add formula editor with syntax highlighting
- [ ] Create variables grid component
- [ ] Add operator buttons panel
- [ ] Implement A/B testing FAB
- [ ] Add responsive design considerations
- [ ] Apply domain-specific styling and theming

### Phase 2 Checklist: Dynamic Features
- [ ] Set up state management
- [ ] Implement formula CRUD operations
- [ ] Add variable management system
- [ ] Create template system (A/B versions)
- [ ] Implement drag & drop functionality
- [ ] Add formula validation
- [ ] Create entity mapping system
- [ ] Add real-time preview/calculation
- [ ] Implement error handling
- [ ] Add success/error messaging
- [ ] Create persistence layer
- [ ] Add export/import functionality

### Production Checklist
- [ ] Add comprehensive error boundaries
- [ ] Implement proper TypeScript typing
- [ ] Add unit tests for utilities
- [ ] Add integration tests for key workflows
- [ ] Optimize performance (memoization, debouncing)
- [ ] Add accessibility features
- [ ] Implement proper loading states
- [ ] Add comprehensive documentation
- [ ] Set up monitoring and analytics
- [ ] Create deployment pipeline

---

## Quick Start Commands

```bash
# 1. Create new formula manager component
# Copy the base structure from Phase 1 sections 1.1-1.9

# 2. Configure for your domain
# Replace the domain-specific config from section 4

# 3. Add dynamic features incrementally
# Start with basic CRUD from section 2.1-2.2
# Add validation from section 2.4
# Add templates from section 2.5
# Add advanced features as needed

# 4. Test and iterate
# Use the checklist to ensure complete implementation
```

This guide provides a complete blueprint for building sophisticated formula management interfaces that can be adapted to any domain requiring mathematical calculations, business rules, or scoring systems.