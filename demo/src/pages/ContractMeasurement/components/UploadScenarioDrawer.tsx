import { useState, useEffect, useRef } from 'react'
import { Texto, Horizontal, Vertical, GraviButton } from '@gravitate-js/excalibrr'
import { Drawer, Button, Input, Table, Progress } from 'antd'
import {
  CloudUploadOutlined,
  CheckCircleFilled,
  FileExcelOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import type { Scenario } from '../types/scenario.types'
import { generateScenarioId } from '../types/scenario.types'

interface UploadScenarioDrawerProps {
  visible: boolean
  onClose: () => void
  onSave?: (scenario: Scenario) => void
  editingScenario?: Scenario
}

type WizardStep = 1 | 2 | 3

// Mock mapping data - simulates column detection from uploaded file
const MOCK_MAPPINGS = [
  { key: '1', source: 'Product Code', target: 'Product', matched: true },
  { key: '2', source: 'City', target: 'Location', matched: true },
  { key: '3', source: 'Base Price', target: 'Price', matched: true },
  { key: '4', source: 'Effective Date', target: 'Date', matched: true },
  { key: '5', source: 'Notes', target: '(Unmapped)', matched: false },
]

// Mock preview data - simulates parsed spreadsheet rows
const MOCK_PREVIEW = [
  { key: '1', product: 'Regular Gasoline', location: 'Houston', price: '$2.45', date: '2024-01-15' },
  { key: '2', product: 'Premium Gasoline', location: 'Dallas', price: '$2.89', date: '2024-01-15' },
  { key: '3', product: 'Diesel', location: 'Austin', price: '$2.67', date: '2024-01-15' },
  { key: '4', product: 'Regular Gasoline', location: 'San Antonio', price: '$2.42', date: '2024-01-15' },
  { key: '5', product: 'Jet Fuel', location: 'Houston', price: '$3.12', date: '2024-01-15' },
]

export function UploadScenarioDrawer({
  visible,
  onClose,
  onSave,
  editingScenario,
}: UploadScenarioDrawerProps) {
  const [step, setStep] = useState<WizardStep>(1)
  const [name, setName] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditMode = !!editingScenario

  // Reset form when drawer opens
  useEffect(() => {
    if (visible) {
      if (editingScenario) {
        // Edit mode - skip to step 3 (confirm/preview) with existing data
        setStep(3)
        setName(editingScenario.name)
        setFileName('Previously uploaded file')
      } else {
        // Add mode - start fresh
        setStep(1)
        setName('')
        setFileName(null)
      }
      setIsProcessing(false)
    }
  }, [visible, editingScenario])

  // Simulate file processing
  const handleFileSelect = (selectedFileName: string) => {
    setIsProcessing(true)
    setFileName(selectedFileName)

    // Auto-generate name from filename if not provided
    if (!name.trim()) {
      const baseName = selectedFileName.replace(/\.[^/.]+$/, '') // Remove extension
      setName(baseName)
    }

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setStep(2)
    }, 800)
  }

  // Handle real file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file.name)
    }
  }

  // Handle simulated upload (no real file needed)
  const handleSimulateUpload = () => {
    handleFileSelect('supplier_pricing_2024.xlsx')
  }

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file.name)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const canSave = name.trim().length > 0 && step === 3

  const handleSave = () => {
    if (!canSave) return

    const now = new Date().toISOString()
    const scenario: Scenario = {
      id: editingScenario?.id || generateScenarioId(),
      name: name.trim(),
      products: editingScenario?.products || 'all',
      status: 'complete',
      entryMethod: 'upload',
      isReference: editingScenario?.isReference || false,
      createdAt: editingScenario?.createdAt || now,
      updatedAt: now,
      priceConfig: editingScenario?.priceConfig || {},
    }
    onSave?.(scenario)
    onClose()
  }

  // Handle re-upload (start over with new file)
  const handleReupload = () => {
    setStep(1)
    setFileName(null)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as WizardStep)
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as WizardStep)
    }
  }

  // Mapping table columns
  const mappingColumns = [
    {
      title: 'Your Column',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '',
      key: 'arrow',
      width: 50,
      render: () => <ArrowRightOutlined style={{ color: '#8c8c8c' }} />,
    },
    {
      title: 'Mapped To',
      dataIndex: 'target',
      key: 'target',
      render: (text: string, record: { matched: boolean }) => (
        <Horizontal alignItems="center" style={{ gap: '8px' }}>
          {record.matched && <CheckCircleFilled style={{ color: '#52c41a' }} />}
          <span style={{ color: record.matched ? '#262626' : '#8c8c8c' }}>{text}</span>
        </Horizontal>
      ),
    },
  ]

  // Preview table columns
  const previewColumns = [
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ]

  return (
    <Drawer
      placement="bottom"
      height="70%"
      visible={visible}
      onClose={onClose}
      closable={false}
      title={null}
      headerStyle={{ display: 'none' }}
      bodyStyle={{
        backgroundColor: '#f5f5f5',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      zIndex={2000}
      destroyOnClose
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0c5a58',
          padding: '20px 24px',
          flexShrink: 0,
        }}
      >
        <Horizontal justifyContent="space-between" alignItems="flex-start">
          <Vertical style={{ gap: '4px' }}>
            <Texto style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
              {isEditMode ? 'Edit Upload Scenario' : 'Add Upload Scenario'}
            </Texto>
            <Texto style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
              {isEditMode ? 'Review or re-upload pricing data' : 'Import pricing data from a spreadsheet'}
            </Texto>
          </Vertical>
          <Button
            type="link"
            onClick={onClose}
            style={{ color: '#ffffff', fontSize: '20px', padding: 0, height: 'auto', lineHeight: 1 }}
          >
            ×
          </Button>
        </Horizontal>
      </div>

      {/* Step Indicator */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '16px 24px',
          borderBottom: '1px solid #e8e8e8',
          flexShrink: 0,
        }}
      >
        <Horizontal alignItems="center" style={{ gap: '24px' }}>
          {[1, 2, 3].map((s) => (
            <Horizontal key={s} alignItems="center" style={{ gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: step >= s ? '#0c5a58' : '#e8e8e8',
                  color: step >= s ? '#ffffff' : '#8c8c8c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {step > s ? <CheckCircleFilled /> : s}
              </div>
              <Texto
                category="p2"
                style={{ color: step >= s ? '#262626' : '#8c8c8c', fontWeight: step === s ? 600 : 400 }}
              >
                {s === 1 && 'Select File'}
                {s === 2 && 'Map Columns'}
                {s === 3 && 'Review & Import'}
              </Texto>
            </Horizontal>
          ))}
        </Horizontal>
      </div>

      {/* Content - Scrollable area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          padding: '24px',
        }}
      >
        {/* STEP 1: File Selection */}
        {step === 1 && (
          <Vertical style={{ gap: '24px' }}>
            {/* Scenario Name */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Scenario Name
              </Texto>
              <Input
                placeholder="Enter scenario name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="large"
                maxLength={100}
              />
            </div>

            {/* File Dropzone */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Upload File
              </Texto>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #d9d9d9',
                  borderRadius: '8px',
                  padding: '48px',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isProcessing ? (
                  <Vertical alignItems="center" style={{ gap: '16px' }}>
                    <Progress type="circle" percent={75} width={60} />
                    <Texto category="p1">Processing {fileName}...</Texto>
                  </Vertical>
                ) : (
                  <Vertical alignItems="center" style={{ gap: '16px' }}>
                    <CloudUploadOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />
                    <Vertical alignItems="center" style={{ gap: '4px' }}>
                      <Texto category="p1" weight="600">
                        Click to upload or drag file here
                      </Texto>
                      <Texto category="p2" appearance="medium">
                        Supports .xlsx, .xls, .csv
                      </Texto>
                    </Vertical>
                  </Vertical>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Or simulate */}
            <Horizontal justifyContent="center">
              <GraviButton
                buttonText="Simulate Upload (Demo)"
                appearance="outlined"
                onClick={handleSimulateUpload}
                icon={<FileExcelOutlined />}
              />
            </Horizontal>
          </Vertical>
        )}

        {/* STEP 2: Column Mapping */}
        {step === 2 && (
          <Vertical style={{ gap: '24px' }}>
            {/* File info */}
            <div
              style={{
                backgroundColor: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <Horizontal alignItems="center" style={{ gap: '12px' }}>
                <FileExcelOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Vertical style={{ gap: '2px' }}>
                  <Texto category="p1" weight="600">
                    {fileName}
                  </Texto>
                  <Texto category="p2" appearance="medium">
                    15 rows detected • 5 columns found
                  </Texto>
                </Vertical>
              </Horizontal>
            </div>

            {/* Mapping Preview */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Column Mapping
              </Texto>
              <Texto category="p2" appearance="medium" style={{ marginBottom: '16px', display: 'block' }}>
                We automatically mapped your columns. Review the mappings below.
              </Texto>
              <Table
                dataSource={MOCK_MAPPINGS}
                columns={mappingColumns}
                pagination={false}
                size="small"
                style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
              />
            </div>

            {/* Mapping Summary */}
            <Horizontal style={{ gap: '24px' }}>
              <div
                style={{
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  flex: 1,
                }}
              >
                <Horizontal alignItems="center" style={{ gap: '8px' }}>
                  <CheckCircleFilled style={{ color: '#52c41a', fontSize: '20px' }} />
                  <Texto category="p2">
                    <strong>4 columns</strong> successfully mapped
                  </Texto>
                </Horizontal>
              </div>
            </Horizontal>
          </Vertical>
        )}

        {/* STEP 3: Data Preview */}
        {step === 3 && (
          <Vertical style={{ gap: '24px' }}>
            {/* Ready to import banner */}
            <div
              style={{
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <Horizontal justifyContent="space-between" alignItems="center">
                <Horizontal alignItems="center" style={{ gap: '12px' }}>
                  <CheckCircleFilled style={{ fontSize: '24px', color: '#52c41a' }} />
                  <Vertical style={{ gap: '2px' }}>
                    <Texto category="p1" weight="600">
                      {isEditMode ? 'Data Loaded' : 'Ready to Import'}
                    </Texto>
                    <Texto category="p2" appearance="medium">
                      15 rows validated • No errors found
                    </Texto>
                  </Vertical>
                </Horizontal>
                {isEditMode && (
                  <GraviButton
                    buttonText="Re-upload File"
                    appearance="outlined"
                    onClick={handleReupload}
                    icon={<CloudUploadOutlined />}
                  />
                )}
              </Horizontal>
            </div>

            {/* Scenario Name - Editable */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Scenario Name
              </Texto>
              <Input
                placeholder="Enter scenario name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="large"
                maxLength={100}
              />
            </div>

            {/* Data Preview */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Data Preview (5 of 15 rows)
              </Texto>
              <Table
                dataSource={MOCK_PREVIEW}
                columns={previewColumns}
                pagination={false}
                size="small"
                style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
              />
            </div>
          </Vertical>
        )}
      </div>

      {/* Fixed Footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid #d9d9d9',
          backgroundColor: '#ffffff',
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        <Horizontal justifyContent="space-between" alignItems="center">
          <div>
            {step > 1 && !isEditMode && (
              <GraviButton buttonText="Back" appearance="outlined" onClick={handleBack} />
            )}
          </div>
          <Horizontal style={{ gap: '16px' }}>
            <GraviButton
              buttonText="Cancel"
              size="large"
              appearance="outlined"
              onClick={onClose}
              style={{ minWidth: '100px' }}
            />
            {step < 3 ? (
              <GraviButton
                buttonText="Continue"
                size="large"
                theme1
                onClick={handleNext}
                style={{ minWidth: '140px' }}
              />
            ) : (
              <GraviButton
                buttonText={isEditMode ? 'Save Changes' : 'Import Scenario'}
                size="large"
                success
                disabled={!canSave}
                onClick={handleSave}
                style={{ minWidth: '140px' }}
              />
            )}
          </Horizontal>
        </Horizontal>
      </div>
    </Drawer>
  )
}
