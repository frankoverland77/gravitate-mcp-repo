import React, { useEffect, useState, useRef } from 'react';
import { Horizontal, Vertical, GraviButton, Texto, GraviGrid } from '@gravitate-js/excalibrr';
import { Switch, Popover, Input, Select, Popconfirm, Drawer } from 'antd';
import { FolderOutlined, FolderAddOutlined, FunctionOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, EllipsisOutlined, CloseOutlined, DownOutlined, RightOutlined, ExperimentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useProductFormula } from '@contexts/ProductFormulaContext';

export function FormulaManager() {
  /* MCP Theme Script */
  // Set BP theme for this demo (follows ControlPanel pattern)
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("TYPE_OF_THEME", "BP");
    }
  }, []);
  /* End MCP Theme Script */

  const {
    formulas,
    setFormulas,
    applyFormulaToProducts,
    removeFormulaFromProduct,
    getProductsWithFormula,
    getAvailableProductsForFormula,
    updateFormula
  } = useProductFormula();

  const [formulaText, setFormulaText] = useState('(base_cost * 1.4) + (ingredients_cost * 1.1)');
  const [formulaName, setFormulaName] = useState('Standard Markup');
  const [livePrice, setLivePrice] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedFormula, setSelectedFormula] = useState<string | null>('f1');
  const [collapsedFolders, setCollapsedFolders] = useState<string[]>([]);
  const [formulaValidation, setFormulaValidation] = useState<{isValid: boolean, error?: string}>({isValid: true});
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [editingMode, setEditingMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Drag and drop state
  const [draggedFormula, setDraggedFormula] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);
  
  // Add folder/formula state
  const [addFolderVisible, setAddFolderVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderForFormula, setSelectedFolderForFormula] = useState('');
  
  // Add variable state
  const [addVariableVisible, setAddVariableVisible] = useState(false);
  const [variables, setVariables] = useState([
    { id: 1, name: 'base_cost', type: 'Number', value: '12.50', description: 'Base product cost' },
    { id: 2, name: 'ingredients_cost', type: 'Number', value: '8.25', description: 'Total ingredients cost' },
    { id: 3, name: 'labor_rate', type: 'Number', value: '15.00', description: 'Hourly labor rate' },
    { id: 4, name: 'markup_percent', type: 'Number', value: '1.4', description: 'Standard markup multiplier' },
    { id: 5, name: 'discount_rate', type: 'Number', value: '0.1', description: 'Seasonal discount rate' }
  ]);
  const [newVariable, setNewVariable] = useState({ name: '', type: 'Number', value: '', description: '' });
  
  // Empty folders state
  const [emptyFolders, setEmptyFolders] = useState<string[]>([]);
  
  // A/B Version state
  const [versionMode, setVersionMode] = useState<'A' | 'B'>('A');
  const [fabExpanded, setFabExpanded] = useState(false);
  const [selectedTemplateB, setSelectedTemplateB] = useState<any>(null);
  
  // Template editing state
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [editingTemplateData, setEditingTemplateData] = useState<any>(null);
  const [templateEditModalVisible, setTemplateEditModalVisible] = useState(false);
  
  // Templates state
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Cost Plus Fixed',
      formula: 'base_cost + ingredients_cost + 5.00',
      description: 'Add fixed amount to total costs',
      category: 'Basic'
    },
    {
      id: 2,
      name: 'Percentage Markup',
      formula: '(base_cost + ingredients_cost) * markup_percent',
      description: 'Apply percentage markup to total costs',
      category: 'Basic'
    },
    {
      id: 3,
      name: 'Labor Plus Materials',
      formula: 'base_cost + ingredients_cost + (labor_rate * 0.5)',
      description: 'Include labor cost calculation',
      category: 'Advanced'
    },
    {
      id: 4,
      name: 'Tiered Pricing',
      formula: 'base_cost < 10 ? (base_cost + ingredients_cost) * 1.5 : (base_cost + ingredients_cost) * 1.3',
      description: 'Different markup based on cost tiers',
      category: 'Advanced'
    },
    {
      id: 5,
      name: 'Seasonal Discount',
      formula: '(base_cost + ingredients_cost) * (1 - discount_rate)',
      description: 'Apply seasonal or promotional discounts',
      category: 'Promotions'
    }
  ]);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, formulaId: string) => {
    console.log('Drag start:', formulaId);
    setDraggedFormula(formulaId);
    setShowPlaceholder(true);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    console.log('Drag end');
    setDraggedFormula(null);
    setDragOverFolder(null);
    setShowPlaceholder(false);
    setIsDragging(false);
  };

  const handleMouseDown = (formulaId: string) => {
    setMouseDownTime(Date.now());
  };

  const handleMouseUp = (formulaId: string) => {
    const timeDiff = Date.now() - mouseDownTime;
    // Only treat as click if it was a short press and not during drag
    if (timeDiff < 200 && !isDragging) {
      console.log('Click select formula:', formulaId);
      selectFormula(formulaId);
    }
  };

  const handleDragOver = (e: React.DragEvent, folderName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folderName);
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolder: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Drop:', draggedFormula, 'to folder:', targetFolder);
    
    if (draggedFormula) {
      // Find the formula being dragged and update its folder
      const formula = formulas.find(f => f.id === draggedFormula);
      if (formula) {
        console.log('Updating formula:', formula.name, 'from', formula.folder, 'to', targetFolder);
        
        // Remove target folder from empty folders if it was empty
        if (emptyFolders.includes(targetFolder)) {
          setEmptyFolders(emptyFolders.filter(f => f !== targetFolder));
        }
        
        updateFormula({ ...formula, folder: targetFolder });
      } else {
        console.log('Formula not found:', draggedFormula);
      }
    }
    
    handleDragEnd();
  };

  // Add new variable
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

  // Function to insert variable at cursor position
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

  // Function to insert operator at cursor position
  const insertOperator = (operator: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = formulaText.substring(0, start) + operator + formulaText.substring(end);
    setFormulaText(newValue);

    // Set cursor position after inserted text
    setTimeout(() => {
      const newCursorPos = start + operator.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // Function to apply template to current formula
  const applyTemplate = (template: any) => {
    setFormulaText(template.formula);
    if (!formulaName.trim()) {
      setFormulaName(template.name);
    }
    // Focus textarea after applying template
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  // Function to save current formula as template
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

  // Function to switch versions
  const switchVersion = (version: 'A' | 'B') => {
    setVersionMode(version);
    setFabExpanded(false);
    setValidationMessage(`Switched to Version ${version}: ${version === 'A' ? 'Table View' : 'Dropdown View'}`);
    setTimeout(() => setValidationMessage(''), 2000);
  };

  // Template editing functions
  const startEditingTemplate = (template: any) => {
    setEditingTemplateId(template.id);
    setEditingTemplateData({ ...template });
    if (versionMode === 'B') {
      setTemplateEditModalVisible(true);
    }
  };

  const cancelEditingTemplate = () => {
    setEditingTemplateId(null);
    setEditingTemplateData(null);
    setTemplateEditModalVisible(false);
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

  const deleteTemplate = (templateId: number) => {
    const template = customTemplates.find(t => t.id === templateId);
    if (template) {
      setCustomTemplates(customTemplates.filter(t => t.id !== templateId));
      setValidationMessage(`Template "${template.name}" deleted successfully!`);
      setTimeout(() => setValidationMessage(''), 3000);
    }
  };

  // Handle click outside FAB to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const fabContainer = document.querySelector('.fab-container');
      if (fabExpanded && fabContainer && !fabContainer.contains(event.target as Node)) {
        setFabExpanded(false);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fabExpanded) {
        setFabExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [fabExpanded]);

  // Function to toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Function to add selected products to applied list
  const addSelectedProductsToApplied = () => {
    if (selectedFormula) {
      applyFormulaToProducts(selectedFormula, selectedProducts);
      setSelectedProducts([]);
      setPopoverVisible(false);
    }
  };

  // Function to remove product from applied list
  const removeProductFromApplied = (productId: string) => {
    removeFormulaFromProduct(productId);
  };

  // Get available products for mapping (not already applied to current formula)
  const getAvailableProducts = () => {
    return selectedFormula ? getAvailableProductsForFormula(selectedFormula) : [];
  };

  // Get products applied to current formula
  const appliedProducts = selectedFormula ? getProductsWithFormula(selectedFormula) : [];

  // Initialize formulas on component mount
  useEffect(() => {
    const initialFormulas = [
      { id: "f1", name: "Standard Markup", formula: "(base_cost * 1.4) + (ingredients_cost * 1.1)", folder: "Basic Pricing" },
      { id: "f2", name: "Cost Plus", formula: "base_cost + ingredients_cost + 5.00", folder: "Basic Pricing" },
      { id: "f3", name: "Weekend Premium", formula: "(base_cost + ingredients_cost) * 1.25", folder: "Basic Pricing" },
      { id: "f4", name: "Holiday Discount", formula: "(base_cost + ingredients_cost) * 0.9", folder: "Seasonal Adjustments" },
      { id: "f5", name: "Summer Special", formula: "base_cost * 1.2 + ingredients_cost", folder: "Seasonal Adjustments" },
      { id: "f6", name: "Back to School", formula: "(base_cost + ingredients_cost) * 0.85", folder: "Seasonal Adjustments" }
    ];
    
    // Only initialize if formulas are empty
    if (formulas.length === 0) {
      setFormulas(initialFormulas);
      
      // Load the first formula by default
      const firstFormula = initialFormulas[0];
      setFormulaName(firstFormula.name);
      setFormulaText(firstFormula.formula);
    }
  }, [formulas.length, setFormulas]);

  // Formula validation function
  const validateFormula = (formula: string) => {
    try {
      // Basic syntax check - replace variables with test values
      let testFormula = formula
        .replace(/base_cost/g, '10')
        .replace(/ingredients_cost/g, '5')
        .replace(/labor_rate/g, '15')
        .replace(/markup_percent/g, '1.4')
        .replace(/discount_rate/g, '0.1');
      
      // Check for valid mathematical expression
      const result = Function('"use strict"; return (' + testFormula + ')')();
      
      if (typeof result !== 'number' || isNaN(result)) {
        return { isValid: false, error: 'Formula must evaluate to a number' };
      }
      
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: 'Invalid syntax. Use variables: base_cost, ingredients_cost, labor_rate, markup_percent, discount_rate' 
      };
    }
  };

  // Real-time validation on formula change
  useEffect(() => {
    const validation = validateFormula(formulaText);
    setFormulaValidation(validation);
  }, [formulaText]);

  // Get folders with formulas
  const getFoldersWithFormulas = () => {
    const folderMap: Record<string, any[]> = {};
    
    // Add folders with formulas
    formulas.forEach(formula => {
      if (!folderMap[formula.folder]) {
        folderMap[formula.folder] = [];
      }
      folderMap[formula.folder].push(formula);
    });
    
    // Add empty folders
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

  // Toggle folder collapse
  const toggleFolder = (folderName: string) => {
    setCollapsedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(name => name !== folderName)
        : [...prev, folderName]
    );
  };

  // Select formula for editing
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

  // Save formula
  const saveFormula = () => {
    const validation = validateFormula(formulaText);
    
    if (!validation.isValid) {
      setValidationMessage(validation.error || 'Invalid formula');
      return;
    }
    
    setValidationMessage('');
    
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
      const newId = 'f' + (formulas.length + 1);
      const newFormula = {
        id: newId,
        name: formulaName,
        formula: formulaText,
        folder: selectedFolderForFormula || 'Basic Pricing'
      };
      setFormulas([...formulas, newFormula]);
      setSelectedFormula(newId);
    }
    
    setEditingMode(false);
  };

  // Add new folder
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      // Check if folder already exists
      const existingFolders = [...new Set(formulas.map(f => f.folder)), ...emptyFolders];
      if (!existingFolders.includes(newFolderName.trim())) {
        setEmptyFolders([...emptyFolders, newFolderName.trim()]);
        setValidationMessage(`Folder "${newFolderName}" created successfully!`);
        setTimeout(() => setValidationMessage(''), 3000);
      } else {
        setValidationMessage(`Folder "${newFolderName}" already exists.`);
        setTimeout(() => setValidationMessage(''), 3000);
      }
      setAddFolderVisible(false);
      setNewFolderName('');
    }
  };

  // Add new formula
  const handleAddFormula = () => {
    const newId = `f${Date.now()}`;
    const defaultFolder = "Basic Pricing";
    
    // Create new empty formula
    const newFormula = {
      id: newId,
      name: '',
      formula: '',
      folder: defaultFolder
    };
    
    // Add to formulas array
    setFormulas([...formulas, newFormula]);
    
    // Select the new formula for editing
    setSelectedFormula(newId);
    setFormulaName('');
    setFormulaText('');
    setSelectedFolderForFormula(defaultFolder);
    setEditingMode(true);
  };

  // Get unique folder names for dropdown
  const getUniqueFolders = () => {
    const formulaFolders = [...new Set(formulas.map(f => f.folder))];
    const allFolders = [...new Set([...formulaFolders, ...emptyFolders])];
    return allFolders.sort();
  };

  return (
    <>
      <style>{`
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
        .folder-item {
          margin-bottom: 12px;
        }
        .folder-header {
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 8px;
        }
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
        .formula-item.draggable {
          cursor: grab !important;
          transition: all 0.2s ease;
          user-select: none;
        }
        .formula-item.dragging {
          cursor: grabbing !important;
          transform: rotate(3deg);
          opacity: 0.8;
          z-index: 1000;
          position: relative;
          user-select: none;
        }
        .formula-placeholder {
          background-color: #f0f0f0;
          border: 2px dashed #ccc;
          border-radius: 3px;
          height: 30px;
          margin: 2px 0;
        }
        .folder-header.drag-over {
          background-color: rgba(24, 144, 255, 0.1);
          border: 2px dashed #1890ff;
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
        .fab-button:hover {
          background-color: #40a9ff;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          transform: scale(1.05);
        }
        .fab-options {
          position: absolute;
          bottom: 60px;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 8px;
          min-width: 120px;
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .fab-options.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
        .fab-option {
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }
        .fab-option:hover {
          background-color: #f5f5f5;
        }
        .fab-option:last-child {
          margin-bottom: 0;
        }
        .fab-option.active {
          background-color: #e6f7ff;
          color: #1890ff;
          font-weight: 500;
        }
        .version-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }
        .version-a {
          background-color: #1890ff;
        }
        .version-b {
          background-color: #52c41a;
        }
        .fab-close-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          border: none;
          background: #f5f5f5;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #666;
          transition: all 0.2s ease;
        }
        .fab-close-button:hover {
          background: #e8e8e8;
          color: #333;
        }
        .fab-button:focus {
          outline: 2px solid #1890ff;
          outline-offset: 2px;
        }
      `}</style>
      
      <Horizontal gap={0} style={{ minHeight: '100vh',
        padding: '0',
        backgroundColor: '#f5f5f5' }}>
        {/* Left Column - 20% */}
        <Vertical style={{ 
          width: '20%',
          minHeight: '100%',
          padding: '16px',
          overflow: 'auto'
        }}>
          {/* Page Title */}
          <Texto category="h4" className="mb-2">
            Formulas
          </Texto>
          
          {/* Caption */}
          <Texto category="p2" style={{ 
            marginBottom: '16px', 
            color: '#666',
            lineHeight: '1.4',
            fontSize: '12px'
          }}>
            Set pricing formulas for bakery items using ingredient costs, labor, and markup.
          </Texto>
          
          {/* Add Buttons */}
          <Horizontal gap={8} style={{ marginBottom: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <Popover
              content={
                <div style={{ padding: '8px' }}>
                  <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Add New Folder</div>
                  <Input
                    placeholder="Enter folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onPressEnter={handleAddFolder}
                    style={{ marginBottom: '8px', width: '200px' }}
                    autoFocus
                  />
                  <Horizontal gap={8} style={{ justifyContent: 'flex-end' }}>
                    <GraviButton 
                      buttonText="Cancel" 
                      appearance="outlined" 
                      size="small" 
                      onClick={() => {
                        setAddFolderVisible(false);
                        setNewFolderName('');
                      }}
                    />
                    <GraviButton 
                      buttonText="Add" 
                      theme1 
                      size="small" 
                      onClick={handleAddFolder}
                      disabled={!newFolderName.trim()}
                    />
                  </Horizontal>
                </div>
              }
              title={null}
              trigger="click"
              open={addFolderVisible}
              onOpenChange={setAddFolderVisible}
              placement="bottomLeft"
            >
              <GraviButton 
                buttonText='Add Folder' 
                theme2 
                appearance='outlined' 
                icon={<FolderAddOutlined />}
                size="small" 
              />
            </Popover>
            <GraviButton 
              buttonText='Add Formula' 
              theme1 
              icon={<PlusOutlined />}
              size="small" 
              onClick={handleAddFormula}
            />   
          </Horizontal>
          
          {/* Formula List */}
          <Vertical gap={0}>
            {getFoldersWithFormulas().map((folder, folderIndex) => (
              <div key={folderIndex} className="folder-item mb-1">
                <div 
                  className={`folder-header ${dragOverFolder === folder.name ? 'drag-over' : ''}`}
                  style={{ 
                    padding: '6px 8px',
                    borderRadius: '3px',
                    marginBottom: '6px',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleFolder(folder.name)}
                  onDragOver={(e) => handleDragOver(e, folder.name)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, folder.name)}
                >
                  <Horizontal gap={6} style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Horizontal gap={6} style={{ alignItems: 'center' }}>
                      {collapsedFolders.includes(folder.name) ? (
                        <RightOutlined style={{ color: '#666', fontSize: '10px' }} />
                      ) : (
                        <DownOutlined style={{ color: '#666', fontSize: '10px' }} />
                      )}
                      <FolderOutlined style={{ color: 'inherit', fontSize: '14px' }} />
                      <Texto category="p2" style={{ 
                        fontWeight: '600', 
                        fontSize: '13px',
                        opacity: folder.isEmpty ? 0.7 : 1
                      }}>
                        {folder.name}
                      </Texto>
                    </Horizontal>
                    <Texto category="p2" style={{ 
                      fontSize: '11px', 
                      color: '#666',
                      backgroundColor: '#f5f5f5',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontWeight: '500'
                    }}>
                      {folder.formulas.length}
                    </Texto>
                  </Horizontal>
                </div>
                
                {!collapsedFolders.includes(folder.name) && (
                  <Vertical gap={2} style={{ paddingLeft: '12px' }}>
                    {folder.isEmpty ? (
                      <div style={{ 
                        padding: '8px 12px', 
                        color: '#999', 
                        fontStyle: 'italic', 
                        fontSize: '12px' 
                      }}>
                        Empty folder - drag formulas here
                      </div>
                    ) : (
                      folder.formulas.map((formula) => (
                      <React.Fragment key={formula.id}>
                        {showPlaceholder && draggedFormula === formula.id && (
                          <div className="formula-placeholder" />
                        )}
                        <div
                          className={`formula-item draggable ${draggedFormula === formula.id ? 'dragging' : ''}`}
                          style={{
                            padding: '4px 6px',
                            borderRadius: '3px',
                            border: selectedFormula === formula.id ? '1px solid #1890ff' : '1px solid transparent',
                            backgroundColor: selectedFormula === formula.id ? '#e6f7ff' : 'transparent',
                            display: draggedFormula === formula.id ? 'none' : 'block'
                          }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, formula.id)}
                          onDragEnd={handleDragEnd}
                          onMouseDown={() => handleMouseDown(formula.id)}
                          onMouseUp={() => handleMouseUp(formula.id)}
                        >
                        <Horizontal style={{ 
                          alignItems: 'center', 
                          justifyContent: 'space-between' 
                        }}>
                          <Horizontal gap={4} style={{ alignItems: 'center' }}>
                            <FunctionOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                            <Texto category="p2" style={{ fontSize: '12px' }}>{formula.name}</Texto>
                          </Horizontal>
                          
                          <div className="formula-actions">
                            <Horizontal gap={4}>
                              <EditOutlined 
                                style={{ 
                                  color: '#1890ff', 
                                  cursor: 'pointer',
                                  padding: '2px',
                                  fontSize: '10px'
                                }} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectFormula(formula.id);
                                }}
                              />
                              <DeleteOutlined 
                                style={{ 
                                  color: '#ff4d4f', 
                                  cursor: 'pointer',
                                  padding: '2px',
                                  fontSize: '10px'
                                }} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormulas(formulas.filter(f => f.id !== formula.id));
                                  if (selectedFormula === formula.id) {
                                    setSelectedFormula(null);
                                    setFormulaName('');
                                    setFormulaText('');
                                  }
                                }}
                              />
                            </Horizontal>
                          </div>
                        </Horizontal>
                        </div>
                      </React.Fragment>
                      ))
                    )}
                  </Vertical>
                )}
              </div>
            ))}
          </Vertical>
        </Vertical>

        {/* Middle Column - 60% */}
        <Vertical style={{ 
          width: '60%',
          borderLeft: '1px solid #d9d9d9',
          borderRight: '1px solid #d9d9d9',
          padding: '24px',
          minHeight: '100%',
          overflow: 'auto'
        }}>
          {/* ========== FORMULAS SECTION ========== */}
          {/* Formula Header Row */}
          <Vertical style={{ marginBottom: '24px', width: '100%' }}>
            {/* Formula Name Input and Folder Selection */}
            <Horizontal gap={12} style={{ marginBottom: '16px', width: '100%' }}>
              {/* Formula Name - 50% */}
              <Vertical style={{ flex: 1 }}>
                <div className="eyebrow-label">Formula Name</div>
                <input
                  type="text"
                  value={formulaName}
                  onChange={(e) => setFormulaName(e.target.value)}
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
              
              {/* Folder Selection - 50% */}
              <Vertical style={{ flex: 1 }}>
                <div className="eyebrow-label">Folder</div>
                <Select
                  value={selectedFolderForFormula || (selectedFormula ? formulas.find(f => f.id === selectedFormula)?.folder : '')}
                  onChange={(value) => setSelectedFolderForFormula(value)}
                  placeholder="Select folder..."
                  style={{ width: '100%' }}
                  options={getUniqueFolders().map(folder => ({
                    value: folder,
                    label: folder
                  }))}
                />
              </Vertical>
            </Horizontal>

            <Horizontal style={{ alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
              {/* Status Section */}
              <Vertical style={{ alignItems: 'flex-start' }}>
                <div className="eyebrow-label">Status</div>
                <Horizontal gap={8} style={{ alignItems: 'center' }}>
                  {formulaValidation.isValid ? (
                    <>
                      <CheckOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                      <Texto category="p1" style={{ color: '#52c41a', margin: 0 }}>
                        Ready
                      </Texto>
                    </>
                  ) : (
                    <>
                      <CloseOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
                      <Texto category="p1" style={{ color: '#ff4d4f', margin: 0 }}>
                        Invalid
                      </Texto>
                    </>
                  )}
                </Horizontal>
              </Vertical>

              {/* Save Button */}
              <GraviButton 
                buttonText="Save Formula"
                theme1
                size="small"
                onClick={saveFormula}
                disabled={!formulaName.trim() || !formulaText.trim()}
              />
            </Horizontal>
          </Vertical>

          {/* Operator Buttons Panel and Template Dropdown (Side by Side for Version B) */}
          {versionMode === 'B' ? (
            <Horizontal gap={24} style={{ marginBottom: '16px', alignItems: 'flex-start' }}>
              {/* Operators Section */}
              <Vertical style={{ flex: 1 }}>
                <div className="eyebrow-label mb-1">Quick Operators</div>
                <Horizontal gap={6} style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                  {['+', '-', '*', '/', '(', ')', '%', '^', '.'].map((operator, index) => (
                    <GraviButton
                      key={index}
                      buttonText={operator}
                      appearance="outlined"
                      size="small"
                      onClick={() => insertOperator(operator)}
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
                    onClick={() => insertOperator(' ')}
                    style={{
                      minWidth: '50px',
                      height: '32px',
                      fontSize: '11px'
                    }}
                  />
                </Horizontal>
              </Vertical>

              {/* Template Dropdown Section */}
              <Vertical style={{ flex: 1 }}>
                <div className="eyebrow-label mb-1">Formula Templates</div>
                <Horizontal gap={12} style={{ alignItems: 'flex-end' }}>
                  <Vertical style={{ flex: 1 }}>
                    <Select
                      placeholder="Choose a template to apply..."
                      value={selectedTemplateB?.id || null}
                      onChange={(value) => {
                        const template = [...templates, ...customTemplates].find(t => t.id === value);
                        setSelectedTemplateB(template);
                      }}
                      style={{ width: '100%' }}
                      allowClear
                      onClear={() => setSelectedTemplateB(null)}
                      options={['Basic', 'Advanced', 'Promotions', 'Custom']
                        .map((category) => {
                          const categoryTemplates = [...templates, ...customTemplates].filter(t => t.category === category);
                          if (categoryTemplates.length === 0) return null;

                          return {
                            label: (
                              <span style={{
                                fontWeight: '600',
                                color: category === 'Custom' ? '#389e0d' : '#666',
                                fontSize: '12px'
                              }}>
                                {category} Templates
                              </span>
                            ),
                            options: categoryTemplates.map((template) => ({
                              key: template.id,
                              value: template.id,
                              label: (
                                <Horizontal style={{
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%'
                                }}>
                                  <Horizontal gap={8} style={{ alignItems: 'center', flex: 1 }}>
                                    <span style={{ fontWeight: '500' }}>{template.name}</span>
                                    <span style={{
                                      backgroundColor: template.category === 'Custom' ? '#f6ffed' : '#fff7e6',
                                      color: template.category === 'Custom' ? '#389e0d' : '#d48806',
                                      padding: '1px 4px',
                                      borderRadius: '3px',
                                      fontSize: '10px',
                                      fontWeight: '500'
                                    }}>
                                      {template.category}
                                    </span>
                                  </Horizontal>
                                  {/* Show edit/delete icons for custom templates only */}
                                  {template.category === 'Custom' && (
                                    <Horizontal gap={4} style={{ alignItems: 'center' }}>
                                      <EditOutlined
                                        style={{
                                          color: '#1890ff',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          padding: '2px'
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          startEditingTemplate(template);
                                        }}
                                        title="Edit template"
                                      />
                                      <Popconfirm
                                        title={`Delete "${template.name}"? This action cannot be undone.`}
                                        onConfirm={(e) => {
                                          e?.stopPropagation();
                                          deleteTemplate(template.id);
                                        }}
                                        okText="Delete"
                                        cancelText="Cancel"
                                        okButtonProps={{ danger: true }}
                                      >
                                        <DeleteOutlined
                                          style={{
                                            color: '#ff4d4f',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            padding: '2px'
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          title="Delete template"
                                        />
                                      </Popconfirm>
                                    </Horizontal>
                                  )}
                                </Horizontal>
                              ),
                            })),
                          };
                        })
                        .filter(Boolean)}
                    />
                  </Vertical>
                  <GraviButton
                    buttonText="Apply"
                    theme1
                    size="small"
                    onClick={() => {
                      if (selectedTemplateB) {
                        applyTemplate(selectedTemplateB);
                        setSelectedTemplateB(null);
                      }
                    }}
                    disabled={!selectedTemplateB}
                  />
                  <GraviButton 
                    buttonText="Save as Template"
                    theme2
                    appearance="outlined"
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={saveAsTemplate}
                    disabled={!formulaName.trim() || !formulaText.trim()}
                  />
                </Horizontal>
                {selectedTemplateB && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px'
                  }}>
                    <Texto category="p2" style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      {selectedTemplateB.description}
                    </Texto>
                    <code style={{
                      fontSize: '11px',
                      backgroundColor: '#f5f5f5',
                      padding: '4px 6px',
                      borderRadius: '3px',
                      fontFamily: 'Consolas, Monaco, monospace',
                      display: 'block',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedTemplateB.formula}
                    </code>
                  </div>
                )}
              </Vertical>
            </Horizontal>
          ) : (
            /* Version A: Operators Only */
            <Vertical className="mb-2">
              <div className="eyebrow-label mb-1">Quick Operators</div>
              <Horizontal gap={6} style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                {['+', '-', '*', '/', '(', ')', '%', '^', '.'].map((operator, index) => (
                  <GraviButton
                    key={index}
                    buttonText={operator}
                    appearance="outlined"
                    size="small"
                    onClick={() => insertOperator(operator)}
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
                  onClick={() => insertOperator(' ')}
                  style={{
                    minWidth: '50px',
                    height: '32px',
                    fontSize: '11px'
                  }}
                />
              </Horizontal>
            </Vertical>
          )}

          {/* Template Edit Drawer for Version B */}
          {versionMode === 'B' && (
              <Drawer
                title="Edit Template"
                placement="right"
                size="default"
                onClose={cancelEditingTemplate}
                open={templateEditModalVisible}
                width={450}
                styles={{ body: { padding: '24px' } }}
                footerStyle={{ textAlign: 'right' }}
                footer={
                  <Horizontal gap={8} style={{ justifyContent: 'flex-end' }}>
                    <GraviButton 
                      buttonText="Cancel" 
                      appearance="outlined" 
                      size="small" 
                      onClick={cancelEditingTemplate}
                    />
                    <GraviButton 
                      buttonText="Save Changes" 
                      theme1 
                      size="small" 
                      onClick={saveEditingTemplate}
                      disabled={!editingTemplateData?.name?.trim() || !editingTemplateData?.formula?.trim()}
                    />
                  </Horizontal>
                }
              >
                <Vertical gap={16}>
                  <div>
                    <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Template Name</div>
                    <Input
                      placeholder="Enter template name"
                      value={editingTemplateData?.name || ''}
                      onChange={(e) => setEditingTemplateData({
                        ...editingTemplateData,
                        name: e.target.value
                      })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  
                  <div>
                    <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Description</div>
                    <Input
                      placeholder="Enter template description"
                      value={editingTemplateData?.description || ''}
                      onChange={(e) => setEditingTemplateData({
                        ...editingTemplateData,
                        description: e.target.value
                      })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  
                  <div>
                    <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Formula</div>
                    <textarea
                      placeholder="Enter formula..."
                      value={editingTemplateData?.formula || ''}
                      onChange={(e) => setEditingTemplateData({
                        ...editingTemplateData,
                        formula: e.target.value
                      })}
                      style={{
                        width: '100%',
                        height: '120px',
                        padding: '12px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontFamily: 'Consolas, Monaco, monospace',
                        resize: 'vertical',
                        lineHeight: '1.5'
                      }}
                    />
                  </div>
                  
                  {editingTemplateData && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f9f9f9',
                      border: '1px solid #e8e8e8',
                      borderRadius: '6px'
                    }}>
                      <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: '500', color: '#666' }}>
                        Category: Custom Template
                      </div>
                      <div style={{ fontSize: '11px', color: '#999' }}>
                        Custom templates can be edited and deleted. Use variables like base_cost, ingredients_cost, markup_percent, etc.
                      </div>
                    </div>
                  )}
                </Vertical>
              </Drawer>
          )}

          {/* Formula Editor */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <textarea
              ref={textareaRef}
              className="formula-editor"
              value={formulaText}
              onChange={(e) => setFormulaText(e.target.value)}
              placeholder="Enter your formula here..."
              style={{ 
                marginBottom: validationMessage ? '8px' : '0px',
                borderColor: formulaValidation.isValid ? '#333' : '#ff4d4f'
              }}
            />
            
            {/* Validation Indicator - Bottom Right */}
            <div style={{
              position: 'absolute',
              bottom: validationMessage ? '35px' : '8px',
              right: '8px',
              fontSize: '12px',
              fontWeight: '500',
              color: formulaValidation.isValid ? '#52c41a' : '#ff4d4f'
            }}>
              {formulaValidation.isValid ? '✓ Valid' : '✗ Invalid'}
            </div>
          </div>
          
          {/* Validation Message */}
          {validationMessage && (
            <div style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: validationMessage.includes('successfully') || validationMessage.includes('created') || validationMessage.includes('added') || validationMessage.includes('deleted') || validationMessage.includes('Switched to') ? '#f6ffed' : '#fff2f0',
              border: validationMessage.includes('successfully') || validationMessage.includes('created') || validationMessage.includes('added') || validationMessage.includes('deleted') || validationMessage.includes('Switched to') ? '1px solid #b7eb8f' : '1px solid #ffccc7',
              borderRadius: '4px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {(validationMessage.includes('successfully') || validationMessage.includes('created') || validationMessage.includes('added') || validationMessage.includes('deleted') || validationMessage.includes('Switched to')) && (
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
              )}
              <Texto category="p2" style={{ 
                color: validationMessage.includes('successfully') || validationMessage.includes('created') || validationMessage.includes('added') || validationMessage.includes('deleted') || validationMessage.includes('Switched to') ? '#52c41a' : '#ff4d4f', 
                margin: 0 
              }}>
                {validationMessage}
              </Texto>
            </div>
          )}

          {/* Live Price Toggle */}
          <Horizontal gap={12} style={{ alignItems: 'center', marginBottom: '32px' }}>
            <Switch 
              checked={livePrice}
              onChange={setLivePrice}
            />
            <Texto category="p1" style={{ margin: 0 }}>
              Live Price
            </Texto>
          </Horizontal>

          {/* ========== VARIABLES SECTION ========== */}
          {/* Variables Header */}
          <Vertical style={{ marginBottom: '0', alignItems: 'flex-start' }}>
            <Texto category="h4" className="mb-1">
              Variables
            </Texto>
            <Texto category="p2" style={{ color: '#666', marginBottom: '16px' }}>
              Click on a variable to insert it into your formula. These are the available variables you can use in your calculations.
            </Texto>
            
            {/* Add Variable Button */}
            <Popover
              content={
                <div style={{ padding: '8px', width: '300px' }}>
                  <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '500' }}>Add New Variable</div>
                  
                  <Vertical gap={8}>
                    <div>
                      <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Name</div>
                      <Input
                        placeholder="Variable name (e.g., labor_cost)"
                        value={newVariable.name}
                        onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                        style={{ width: '100%' }}
                      />
                    </div>
                    
                    <div>
                      <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Type</div>
                      <Select
                        value={newVariable.type}
                        onChange={(value) => setNewVariable({...newVariable, type: value})}
                        style={{ width: '100%' }}
                        options={[
                          { value: 'Number', label: 'Number' },
                          { value: 'Text', label: 'Text' },
                          { value: 'Boolean', label: 'Boolean' }
                        ]}
                      />
                    </div>
                    
                    <div>
                      <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Default Value</div>
                      <Input
                        placeholder="Default value"
                        value={newVariable.value}
                        onChange={(e) => setNewVariable({...newVariable, value: e.target.value})}
                        style={{ width: '100%' }}
                      />
                    </div>
                    
                    <div>
                      <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Description</div>
                      <Input
                        placeholder="Variable description (optional)"
                        value={newVariable.description}
                        onChange={(e) => setNewVariable({...newVariable, description: e.target.value})}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </Vertical>
                  
                  <Horizontal gap={8} style={{ justifyContent: 'flex-end', marginTop: '12px' }}>
                    <GraviButton 
                      buttonText="Cancel" 
                      appearance="outlined" 
                      size="small" 
                      onClick={() => {
                        setAddVariableVisible(false);
                        setNewVariable({ name: '', type: 'Number', value: '', description: '' });
                      }}
                    />
                    <GraviButton 
                      buttonText="Add" 
                      theme1 
                      size="small" 
                      onClick={handleAddVariable}
                      disabled={!newVariable.name.trim() || !newVariable.value.trim()}
                    />
                  </Horizontal>
                </div>
              }
              title={null}
              trigger="click"
              open={addVariableVisible}
              onOpenChange={setAddVariableVisible}
              placement="bottomLeft"
            >
              <GraviButton 
                buttonText="Add Variable"
                theme1
                appearance="outlined"
                icon={<PlusOutlined />}
                size="small"
                style={{ alignSelf: 'flex-start', marginBottom: '12px' }}
              />
            </Popover>
            
            {/* Variables Grid */}
            <div style={{ 
              height: '250px',
              width: '100%',
              border: '1px solid #d9d9d9', 
              borderRadius: '6px'
            }}>
            <GraviGrid
              rowData={variables}
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
                      onClick={() => insertVariableAtCursor(params.value)}
                    >
                      {params.value}
                    </span>
                  )
                },
                {
                  field: 'type',
                  headerName: 'Type',
                  width: 80
                },
                {
                  field: 'value',
                  headerName: 'Value',
                  width: 100
                },
                {
                  field: 'description',
                  headerName: 'Description',
                  flex: 2
                },
                {
                  headerName: 'Actions',
                  width: 100,
                  cellRenderer: (params: any) => (
                    <Horizontal gap={8} style={{ alignItems: 'center' }}>
                      <EditOutlined 
                        style={{ 
                          color: '#1890ff', 
                          cursor: 'pointer', 
                          fontSize: '14px' 
                        }}
                        onClick={() => console.log('Edit variable:', params.data.id)}
                      />
                      <DeleteOutlined 
                        style={{ 
                          color: '#ff4d4f', 
                          cursor: 'pointer', 
                          fontSize: '14px' 
                        }}
                        onClick={() => console.log('Delete variable:', params.data.id)}
                      />
                    </Horizontal>
                  )
                }
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

          {/* ========== TEMPLATES SECTION (VERSION A ONLY) ========== */}
          {/* Templates Header */}
          {versionMode === 'A' && (
          <Vertical style={{ marginTop: '32px', marginBottom: '0', alignItems: 'flex-start' }}>
            <Texto category="h4" className="mb-1">
              Formula Templates
            </Texto>
            <Texto category="p2" style={{ color: '#666', marginBottom: '16px' }}>
              Quick-start with common formula patterns. Click to apply a template to your current formula.
            </Texto>
            
            {/* Save as Template Button */}
            <Horizontal gap={8} style={{ alignItems: 'center', marginBottom: '16px' }}>
              <GraviButton 
                buttonText="Save as Template"
                theme2
                appearance="outlined"
                icon={<PlusOutlined />}
                size="small"
                onClick={saveAsTemplate}
                disabled={!formulaName.trim() || !formulaText.trim()}
                style={{ alignSelf: 'flex-start' }}
              />
              {customTemplates.length > 0 && (
                <Texto category="p2" style={{ color: '#666', fontSize: '12px' }}>
                  {customTemplates.length} custom template{customTemplates.length !== 1 ? 's' : ''}
                </Texto>
              )}
            </Horizontal>
            
            {/* Templates Grid */}
            <div style={{ 
              height: '300px',
              width: '100%',
              border: '1px solid #d9d9d9', 
              borderRadius: '6px'
            }}>
            <GraviGrid
              rowData={[...templates, ...customTemplates]}
              columnDefs={[
                {
                  field: 'name',
                  headerName: 'Template Name',
                  flex: 1,
                  cellRenderer: (params: any) => {
                    const isEditing = editingTemplateId === params.data.id;
                    
                    if (isEditing) {
                      return (
                        <input
                          type="text"
                          value={editingTemplateData?.name || ''}
                          onChange={(e) => setEditingTemplateData({
                            ...editingTemplateData,
                            name: e.target.value
                          })}
                          style={{
                            width: '100%',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px'
                          }}
                          autoFocus
                        />
                      );
                    }
                    
                    return (
                      <span 
                        style={{ 
                          cursor: 'pointer', 
                          color: '#1890ff',
                          textDecoration: 'underline',
                          fontWeight: '500'
                        }}
                        onClick={() => applyTemplate(params.data)}
                      >
                        {params.value}
                      </span>
                    );
                  }
                },
                {
                  field: 'category',
                  headerName: 'Category',
                  width: 100,
                  cellRenderer: (params: any) => (
                    <span style={{ 
                      backgroundColor: params.value === 'Custom' ? '#f6ffed' : '#fff7e6',
                      color: params.value === 'Custom' ? '#389e0d' : '#d48806',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {params.value}
                    </span>
                  )
                },
                {
                  field: 'description',
                  headerName: 'Description',
                  flex: 2,
                  cellRenderer: (params: any) => {
                    const isEditing = editingTemplateId === params.data.id;
                    
                    if (isEditing) {
                      return (
                        <input
                          type="text"
                          value={editingTemplateData?.description || ''}
                          onChange={(e) => setEditingTemplateData({
                            ...editingTemplateData,
                            description: e.target.value
                          })}
                          style={{
                            width: '100%',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px'
                          }}
                        />
                      );
                    }
                    
                    return params.value;
                  }
                },
                {
                  field: 'formula',
                  headerName: 'Formula Preview',
                  flex: 2,
                  cellRenderer: (params: any) => {
                    const isEditing = editingTemplateId === params.data.id;
                    
                    if (isEditing) {
                      return (
                        <textarea
                          value={editingTemplateData?.formula || ''}
                          onChange={(e) => setEditingTemplateData({
                            ...editingTemplateData,
                            formula: e.target.value
                          })}
                          style={{
                            width: '100%',
                            height: '30px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontFamily: 'Consolas, Monaco, monospace',
                            resize: 'none'
                          }}
                        />
                      );
                    }
                    
                    return (
                      <code style={{ 
                        fontSize: '11px',
                        backgroundColor: '#f5f5f5',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontFamily: 'Consolas, Monaco, monospace'
                      }}>
                        {params.value.length > 50 ? params.value.substring(0, 50) + '...' : params.value}
                      </code>
                    );
                  }
                },
                {
                  headerName: 'Actions',
                  width: 120,
                  cellRenderer: (params: any) => {
                    const isEditing = editingTemplateId === params.data.id;
                    
                    if (isEditing) {
                      return (
                        <Horizontal gap={8} style={{ alignItems: 'center' }}>
                          <CheckOutlined 
                            style={{ 
                              color: '#52c41a', 
                              cursor: 'pointer', 
                              fontSize: '14px' 
                            }}
                            onClick={saveEditingTemplate}
                            title="Save changes"
                          />
                          <CloseOutlined 
                            style={{ 
                              color: '#ff4d4f', 
                              cursor: 'pointer', 
                              fontSize: '14px' 
                            }}
                            onClick={cancelEditingTemplate}
                            title="Cancel editing"
                          />
                        </Horizontal>
                      );
                    }
                    
                    return (
                      <Horizontal gap={8} style={{ alignItems: 'center' }}>
                        {params.data.category === 'Custom' && (
                          <>
                            <EditOutlined 
                              style={{ 
                                color: '#1890ff', 
                                cursor: 'pointer', 
                                fontSize: '14px' 
                              }}
                              onClick={() => startEditingTemplate(params.data)}
                              title="Edit template"
                            />
                            <Popconfirm
                              title={`Delete "${params.data.name}"? This action cannot be undone.`}
                              onConfirm={() => deleteTemplate(params.data.id)}
                              okText="Delete"
                              cancelText="Cancel"
                              okButtonProps={{ danger: true }}
                            >
                              <DeleteOutlined 
                                style={{ 
                                  color: '#ff4d4f', 
                                  cursor: 'pointer', 
                                  fontSize: '14px' 
                                }}
                                title="Delete template"
                              />
                            </Popconfirm>
                          </>
                        )}
                      </Horizontal>
                    );
                  }
                }
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
          )}
        </Vertical>

        {/* Right Column - 20% */}
        <Vertical style={{ 
          width: '20%',
          minHeight: '100%',
          padding: '16px',
          overflow: 'auto'
        }}>
          {/* Page Title */}
          <Texto category="h4" className="mb-2">
            Apply to Products
          </Texto>
          
          {/* Caption */}
          <Texto category="p2" style={{ 
            marginBottom: '16px', 
            color: '#666',
            lineHeight: '1.4',
            fontSize: '12px'
          }}>
            This formula is applied to the following products. You can add or remove products to control which items use this pricing calculation.
          </Texto>
          
          {/* Product Count and Create Mapping Button */}
          <Horizontal gap={8} style={{ marginBottom: '16px', alignItems: 'center' }}>
            <Texto category="p2" style={{ color: '#666' }}>
              {appliedProducts.length} Product{appliedProducts.length !== 1 ? 's' : ''}
            </Texto>
            <Popover
              content={
                <Vertical style={{ width: '280px', maxHeight: '250px' }}>
                  <Texto category="p2" style={{ marginBottom: '12px', fontWeight: '600' }}>
                    Select Products to Add:
                  </Texto>
                  <div style={{ maxHeight: '180px', overflow: 'auto', marginBottom: '12px' }}>
                    {getAvailableProducts().map((product) => (
                      <div
                        key={product.ProductId}
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          marginBottom: '4px',
                          border: selectedProducts.includes(product.ProductId) 
                            ? '2px solid #1890ff' 
                            : '1px solid #d9d9d9',
                          backgroundColor: selectedProducts.includes(product.ProductId) 
                            ? '#e6f7ff' 
                            : 'transparent'
                        }}
                        onClick={() => toggleProductSelection(product.ProductId)}
                      >
                        <Texto category="p2" style={{ fontWeight: '500', marginBottom: '2px' }}>
                          {product.Name}
                        </Texto>
                        <Texto category="p2" style={{ color: '#666', fontSize: '11px' }}>
                          {product.ProductId} - {product.Category}
                        </Texto>
                      </div>
                    ))}
                    {getAvailableProducts().length === 0 && (
                      <Texto category="p2" style={{ color: '#999' }}>
                        All products have been added
                      </Texto>
                    )}
                  </div>
                  <Horizontal gap={8} style={{ justifyContent: 'flex-end' }}>
                    <GraviButton 
                      buttonText="Cancel"
                      size="small"
                      onClick={() => {
                        setSelectedProducts([]);
                        setPopoverVisible(false);
                      }}
                    />
                    <GraviButton 
                      buttonText={`Add ${selectedProducts.length} Product${selectedProducts.length !== 1 ? 's' : ''}`}
                      theme2
                      size="small"
                      onClick={addSelectedProductsToApplied}
                      disabled={selectedProducts.length === 0}
                    />
                  </Horizontal>
                </Vertical>
              }
              title="Add Product"
              trigger="click"
              open={popoverVisible}
              onOpenChange={setPopoverVisible}
            >
              <GraviButton 
                buttonText="Create Mapping"
                theme2
                size="small"
                icon={<PlusOutlined />}
              />
            </Popover>
          </Horizontal>
          
          {/* Applied Products List */}
          <div style={{ 
            maxHeight: '300px',
            width: '100%',
            border: '1px solid #d9d9d9', 
            borderRadius: '6px',
            overflow: 'auto'
          }}>
            {appliedProducts.length === 0 ? (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: '#999' 
              }}>
                <Texto category="p2">
                  No products applied yet
                </Texto>
              </div>
            ) : (
              appliedProducts.map((product) => (
                <div
                  key={product.ProductId}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #d9d9d9',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Vertical gap={2} style={{ flex: 1 }}>
                    <Texto category="p2" style={{ 
                      fontWeight: 'bold', 
                      fontSize: '12px',
                      marginBottom: '2px'
                    }}>
                      {product.Name}
                    </Texto>
                    <Horizontal gap={8} style={{ alignItems: 'center' }}>
                      <Texto category="p2" style={{ 
                        color: '#666', 
                        fontSize: '10px' 
                      }}>
                        {product.ProductId}
                      </Texto>
                      <Texto category="p2" style={{ 
                        color: '#666', 
                        fontSize: '10px' 
                      }}>
                        {product.Category}
                      </Texto>
                      <Texto category="p2" style={{ 
                        color: '#52c41a', 
                        fontSize: '10px',
                        fontWeight: '500'
                      }}>
                        ${product.FinalPrice?.toFixed(2) || '0.00'}
                      </Texto>
                    </Horizontal>
                  </Vertical>
                  <CloseOutlined 
                    style={{ 
                      color: '#ff4d4f', 
                      cursor: 'pointer', 
                      fontSize: '12px',
                      padding: '4px',
                      marginLeft: '8px'
                    }}
                    onClick={() => removeProductFromApplied(product.ProductId)}
                  />
                </div>
              ))
            )}
          </div>
        </Vertical>
      </Horizontal>

      {/* Floating Action Button for A/B Testing */}
      <div className="fab-container">
        <div 
          className={`fab-options ${fabExpanded ? 'visible' : ''}`}
          role="menu"
          aria-label="Version selection menu"
        >
          <button 
            className="fab-close-button"
            onClick={() => setFabExpanded(false)}
            aria-label="Close version menu"
            title="Close"
          >
            <CloseOutlined />
          </button>
          <div 
            className={`fab-option ${versionMode === 'A' ? 'active' : ''}`}
            onClick={() => switchVersion('A')}
            role="menuitem"
            tabIndex={fabExpanded ? 0 : -1}
          >
            <span className="version-badge version-a">A</span>
            <span>Table View</span>
          </div>
          <div 
            className={`fab-option ${versionMode === 'B' ? 'active' : ''}`}
            onClick={() => switchVersion('B')}
            role="menuitem"
            tabIndex={fabExpanded ? 0 : -1}
          >
            <span className="version-badge version-b">B</span>
            <span>Dropdown View</span>
          </div>
        </div>
        <button 
          className="fab-button"
          onClick={() => setFabExpanded(!fabExpanded)}
          aria-expanded={fabExpanded}
          aria-label={`A/B Test - Currently: Version ${versionMode}. Click to toggle version options.`}
          title={`A/B Test - Currently: Version ${versionMode}`}
        >
          <ExperimentOutlined />
        </button>
      </div>
    </>
  );
}