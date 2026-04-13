import { useState, useCallback, useRef } from 'react'
import { GraviGrid, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Select, message } from 'antd'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons'
import {
  competitorSelectOptions,
  publisherOptions,
  getLocationName,
  getProductName,
} from './Grid/mockData'
import type { CompetitorQuoteRow, CompetitorAssociation } from './Grid/mockData'

type NewRowForm = {
  competitor: string | undefined
  publisher: string | undefined
  product: string | undefined
  terminal: string | undefined
}

const emptyForm: NewRowForm = {
  competitor: undefined,
  publisher: undefined,
  product: undefined,
  terminal: undefined,
}

export function CompetitorDetailPanel({
  parentRow,
  associations,
  detailColDefs,
  onAddAssociation,
}: {
  parentRow: CompetitorQuoteRow
  associations: CompetitorAssociation[]
  detailColDefs: any[]
  onAddAssociation?: (quoteRowId: number, newAssoc: Omit<CompetitorAssociation, 'id'>) => void
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<NewRowForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof NewRowForm, boolean>>>({})
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const parentTerminal = getLocationName(parentRow.locationId)
  const parentProduct = getProductName(parentRow.productId)

  const handleStartAdd = useCallback(() => {
    setIsAdding(true)
    setForm({ ...emptyForm, product: parentProduct, terminal: parentTerminal })
    setErrors({})
  }, [parentProduct, parentTerminal])

  const handleCancelAdd = useCallback(() => {
    setIsAdding(false)
    setForm(emptyForm)
    setErrors({})
  }, [])

  const handleSave = useCallback(() => {
    const newErrors: Partial<Record<keyof NewRowForm, boolean>> = {}
    if (!form.competitor) newErrors.competitor = true
    if (!form.publisher) newErrors.publisher = true
    if (!form.product) newErrors.product = true
    if (!form.terminal) newErrors.terminal = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const missing = Object.keys(newErrors).join(', ')
      message.error(`Please fill in all required fields: ${missing}`)
      return
    }

    const newAssoc: Omit<CompetitorAssociation, 'id'> = {
      name: form.competitor!,
      publisher: form.publisher!,
      product: form.product!,
      terminal: form.terminal!,
      region: '',
      productGroup: parentProduct.includes('10%') ? 'Diesel' : 'Diesel',
      visibility: 'Show',
    }

    onAddAssociation?.(parentRow.id, newAssoc)

    const maxId = associations.reduce((max, a) => Math.max(max, a.id), 0)
    const newId = maxId + 1
    setHighlightedRowId(newId)

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    highlightTimerRef.current = setTimeout(() => setHighlightedRowId(null), 4000)

    setIsAdding(false)
    setForm(emptyForm)
    setErrors({})
    message.success(`Added ${form.competitor} association`)
  }, [form, associations, parentRow.id, parentProduct, onAddAssociation])

  const publisherSelectOptions = publisherOptions.map((o) => ({ value: o.label, label: o.label }))

  return (
    <div className="competitor-detail-panel">
      <style>{`
        .add-row-form {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 10px 12px;
          border: 1px solid #fcd34d;
          background: #fffef5;
          margin-bottom: 8px;
          border-radius: 4px;
        }
        .add-row-field {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .add-row-field .field-label {
          font-size: 11px;
          font-weight: 600;
          color: #333;
        }
        .add-row-field .field-label.has-error {
          color: #ef4444;
        }
      `}</style>

      <div className="competitor-detail-toolbar">
        <Texto appearance="medium" style={{ fontSize: 12 }}>
          {associations.length} competitor associations
          {isAdding && <span style={{ color: 'var(--success-color, #10b981)', fontWeight: 600 }}> + 1 new</span>}
        </Texto>
        {isAdding ? (
          <Horizontal gap={8}>
            <GraviButton
              success
              buttonText="Save"
              icon={<SaveOutlined />}
              onClick={handleSave}
            />
            <GraviButton
              buttonText="Cancel"
              onClick={handleCancelAdd}
            />
          </Horizontal>
        ) : (
          <Horizontal gap={8}>
            <GraviButton
              success
              buttonText="Add Row"
              icon={<PlusOutlined />}
              onClick={handleStartAdd}
            />
          </Horizontal>
        )}
      </div>

      {isAdding && (
        <div className="add-row-form">
          <div className="add-row-field">
            <span className={`field-label${errors.competitor ? ' has-error' : ''}`}>Competitor</span>
            <Select
              showSearch
              placeholder="Select competitor"
              value={form.competitor}
              onChange={(val) => { setForm((f) => ({ ...f, competitor: val })); setErrors((e) => ({ ...e, competitor: false })) }}
              options={competitorSelectOptions}
              status={errors.competitor ? 'error' : undefined}
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div className="add-row-field">
            <span className={`field-label${errors.publisher ? ' has-error' : ''}`}>Publisher</span>
            <Select
              showSearch
              placeholder="Select publisher"
              value={form.publisher}
              onChange={(val) => { setForm((f) => ({ ...f, publisher: val })); setErrors((e) => ({ ...e, publisher: false })) }}
              options={publisherSelectOptions}
              status={errors.publisher ? 'error' : undefined}
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div className="add-row-field">
            <span className={`field-label${errors.product ? ' has-error' : ''}`}>Product</span>
            <Select
              showSearch
              placeholder="Select product"
              value={form.product}
              onChange={(val) => { setForm((f) => ({ ...f, product: val })); setErrors((e) => ({ ...e, product: false })) }}
              options={[
                { value: parentProduct, label: parentProduct },
              ]}
              status={errors.product ? 'error' : undefined}
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div className="add-row-field">
            <span className={`field-label${errors.terminal ? ' has-error' : ''}`}>Terminal</span>
            <Select
              showSearch
              placeholder="Select terminal"
              value={form.terminal}
              onChange={(val) => { setForm((f) => ({ ...f, terminal: val })); setErrors((e) => ({ ...e, terminal: false })) }}
              options={[
                { value: parentTerminal, label: parentTerminal },
              ]}
              status={errors.terminal ? 'error' : undefined}
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
        </div>
      )}

      <GraviGrid
        storageKey={`competitor-detail-${parentRow.id}`}
        rowData={associations}
        columnDefs={detailColDefs}
        agPropOverrides={{
          domLayout: 'autoHeight',
          suppressRowDrag: true,
          suppressMovableColumns: true,
          getRowId: (p: any) => String(p.data.id),
          getRowStyle: (params: any) => {
            if (params.data?.id === highlightedRowId) {
              return { backgroundColor: '#dcfce7', borderLeft: '3px solid #10b981' }
            }
            return undefined
          },
        }}
        hideControlBar={true}
      />
    </div>
  )
}
