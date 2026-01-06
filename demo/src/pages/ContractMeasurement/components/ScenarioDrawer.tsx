import { useState, useEffect } from 'react'
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { PlusOutlined, CloseOutlined, BarChartOutlined, FormOutlined, DatabaseOutlined, PercentageOutlined, DollarOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Drawer, Input, Select, Button } from 'antd'
import type { Scenario, ScenarioFormData, ProductSelection, EntryMethod } from '../types/scenario.types'
import { PRODUCT_OPTIONS, COUNTERPARTY_OPTIONS } from '../types/scenario.types'

interface ScenarioDrawerProps {
  visible: boolean
  onClose: () => void
  scenario?: Scenario // If provided, we're in edit mode
  onSave: (data: ScenarioFormData) => void
}

export function ScenarioDrawer({ visible, onClose, scenario, onSave }: ScenarioDrawerProps) {
  const isEditMode = !!scenario

  // Form state
  const [name, setName] = useState('')
  const [counterparty, setCounterparty] = useState<string | undefined>(undefined)
  const [products, setProducts] = useState<ProductSelection>('all')
  const [entryMethod, setEntryMethod] = useState<EntryMethod>('benchmark')

  // Reset form when drawer opens/closes or scenario changes
  useEffect(() => {
    if (visible) {
      if (scenario) {
        setName(scenario.name)
        setCounterparty(scenario.counterparty)
        setProducts(scenario.products)
        setEntryMethod(scenario.entryMethod)
      } else {
        setName('')
        setCounterparty(undefined)
        setProducts('all')
        setEntryMethod('benchmark')
      }
    }
  }, [visible, scenario])

  const handleSave = () => {
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      counterparty,
      products,
      entryMethod,
    })
  }

  const getEntryMethodTileStyle = (method: EntryMethod) => ({
    flex: 1,
    padding: '16px',
    border: entryMethod === method ? '2px solid #51b073' : '1px solid #d9d9d9',
    borderRadius: '8px',
    backgroundColor: entryMethod === method ? 'rgba(81, 176, 115, 0.05)' : '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center' as const,
  })

  const getConfigCardStyle = () => ({
    flex: 1,
    padding: '16px',
    border: '1px solid #d9d9d9',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '100px',
  })

  return (
    <Drawer
      placement='bottom'
      height='70%'
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
      {/* Custom Header - Green Background */}
      <div
        style={{
          backgroundColor: '#0C5A58',
          padding: '20px 24px',
          flexShrink: 0,
        }}
      >
        <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Vertical style={{ gap: '4px' }}>
            <Horizontal style={{ alignItems: 'center', gap: '12px' }}>
              <Texto style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                {isEditMode ? `Edit: ${scenario?.name}` : 'Add Scenario'}
              </Texto>
            </Horizontal>
            <Texto style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
              Configure pricing formula and volume settings for this scenario
            </Texto>
          </Vertical>
          <Button
            type='link'
            onClick={onClose}
            style={{ color: '#ffffff', fontSize: '20px', padding: 0, height: 'auto' }}
          >
            <CloseOutlined />
          </Button>
        </Horizontal>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          paddingBottom: '100px', // Space for sticky footer
        }}
      >
        <Vertical style={{ gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Scenario Settings Section */}
          <Vertical style={{ gap: '16px' }}>
            <Texto category='h6' weight='600' style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: '#595959' }}>
              Scenario Settings
            </Texto>
            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '16px' }}>
              <Vertical style={{ gap: '16px' }}>
                {/* Scenario Name */}
                <Vertical style={{ gap: '8px' }}>
                  <Texto category='p2' weight='600'>
                    Scenario Name
                  </Texto>
                  <Input
                    placeholder='Enter scenario name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    style={{ maxWidth: '400px' }}
                  />
                </Vertical>

                {/* Counterparty & Products Row */}
                <Horizontal style={{ gap: '24px', flexWrap: 'wrap' }}>
                  <Vertical style={{ gap: '8px', flex: 1, minWidth: '200px' }}>
                    <Texto category='p2' weight='600'>
                      Counterparty
                    </Texto>
                    <Select
                      placeholder='Select counterparty'
                      value={counterparty}
                      onChange={setCounterparty}
                      options={COUNTERPARTY_OPTIONS}
                      style={{ width: '100%' }}
                      allowClear
                    />
                  </Vertical>
                  <Vertical style={{ gap: '8px', flex: 1, minWidth: '200px' }}>
                    <Texto category='p2' weight='600'>
                      Products / Locations
                    </Texto>
                    <Select
                      placeholder='Select products'
                      value={products}
                      onChange={(val) => setProducts(val as ProductSelection)}
                      options={PRODUCT_OPTIONS}
                      style={{ width: '100%' }}
                    />
                  </Vertical>
                </Horizontal>
              </Vertical>
            </div>
          </Vertical>

          {/* Price Configuration Section */}
          <Vertical style={{ gap: '16px' }}>
            <Texto category='h6' weight='600' style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: '#595959' }}>
              Price Configuration
            </Texto>
            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '16px' }}>
              <Vertical style={{ gap: '16px' }}>
                {/* Entry Method Tiles */}
                <Vertical style={{ gap: '8px' }}>
                  <Texto category='p2' weight='600'>
                    Entry Method
                  </Texto>
                  <Horizontal style={{ gap: '16px' }}>
                    <div style={getEntryMethodTileStyle('benchmark')} onClick={() => setEntryMethod('benchmark')}>
                      <Vertical style={{ alignItems: 'center', gap: '8px' }}>
                        <BarChartOutlined style={{ fontSize: '24px', color: entryMethod === 'benchmark' ? '#51b073' : '#8c8c8c' }} />
                        <Texto weight='600'>Benchmark</Texto>
                        <Texto category='p2' appearance='medium'>
                          Use standard industry benchmarks
                        </Texto>
                      </Vertical>
                    </div>
                    <div style={getEntryMethodTileStyle('formula')} onClick={() => setEntryMethod('formula')}>
                      <Vertical style={{ alignItems: 'center', gap: '8px' }}>
                        <FormOutlined style={{ fontSize: '24px', color: entryMethod === 'formula' ? '#51b073' : '#8c8c8c' }} />
                        <Texto weight='600'>Formula</Texto>
                        <Texto category='p2' appearance='medium'>
                          Build custom pricing formula
                        </Texto>
                      </Vertical>
                    </div>
                  </Horizontal>
                </Vertical>

                {/* TBD Button based on entry method */}
                <div style={{ backgroundColor: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: '8px', padding: '16px' }}>
                  <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Vertical style={{ gap: '4px' }}>
                      <Texto weight='600'>
                        {entryMethod === 'benchmark' ? 'Choose Benchmark' : 'Configure Formula'}
                      </Texto>
                      <Texto category='p2' appearance='medium'>
                        {entryMethod === 'benchmark'
                          ? 'Select from available industry benchmarks'
                          : 'Build custom pricing formula with components'}
                      </Texto>
                    </Vertical>
                    <GraviButton
                      buttonText={entryMethod === 'benchmark' ? 'Choose Benchmark (TBD)' : 'Build Formula (TBD)'}
                      appearance='outlined'
                      onClick={() => {
                        // TBD - will open benchmark selector or formula builder
                        console.log(`${entryMethod} configuration TBD`)
                      }}
                    />
                  </Horizontal>
                </div>

                {/* Formula Summary */}
                <Horizontal style={{ gap: '16px' }}>
                  <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Texto category='p2'>
                        <strong>5</strong> Complete
                      </Texto>
                    </Horizontal>
                  </div>
                  <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                      <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                      <Texto category='p2'>
                        <strong>1</strong> Incomplete
                      </Texto>
                    </Horizontal>
                  </div>
                  <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#fafafa', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                      <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                      <Texto category='p2'>
                        <strong>41</strong> Remaining
                      </Texto>
                    </Horizontal>
                  </div>
                </Horizontal>
              </Vertical>
            </div>
          </Vertical>

          {/* Volume Configuration Section */}
          <Vertical style={{ gap: '16px' }}>
            <Texto category='h6' weight='600' style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: '#595959' }}>
              Volume Configuration
            </Texto>
            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '16px' }}>
              <Horizontal style={{ gap: '16px', flexWrap: 'wrap' }}>
                {/* Allocation Data Card */}
                <div style={getConfigCardStyle()}>
                  <Vertical style={{ gap: '12px', height: '100%' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                      <DatabaseOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                      <Texto weight='600'>Allocation Data</Texto>
                    </Horizontal>
                    <Texto category='p2' appearance='medium'>
                      Configure volume allocations for each product/location
                    </Texto>
                    <div style={{ marginTop: 'auto' }}>
                      <GraviButton
                        buttonText='Configure Allocation (TBD)'
                        appearance='outlined'
                        onClick={() => console.log('Allocation config TBD')}
                      />
                    </div>
                  </Vertical>
                </div>

                {/* Rateability Requirements Card */}
                <div style={getConfigCardStyle()}>
                  <Vertical style={{ gap: '12px', height: '100%' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                      <PercentageOutlined style={{ fontSize: '18px', color: '#52c41a' }} />
                      <Texto weight='600'>Rateability Requirements</Texto>
                    </Horizontal>
                    <Texto category='p2' appearance='medium'>
                      Set minimum and maximum volume thresholds
                    </Texto>
                    <div style={{ marginTop: 'auto' }}>
                      <GraviButton
                        buttonText='Configure Rateability (TBD)'
                        appearance='outlined'
                        onClick={() => console.log('Rateability config TBD')}
                      />
                    </div>
                  </Vertical>
                </div>

                {/* Penalties Card */}
                <div style={getConfigCardStyle()}>
                  <Vertical style={{ gap: '12px', height: '100%' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                      <DollarOutlined style={{ fontSize: '18px', color: '#ff4d4f' }} />
                      <Texto weight='600'>Penalties</Texto>
                    </Horizontal>
                    <Texto category='p2' appearance='medium'>
                      Define penalty structures for volume shortfalls
                    </Texto>
                    <div style={{ marginTop: 'auto' }}>
                      <GraviButton
                        buttonText='Configure Penalties (TBD)'
                        appearance='outlined'
                        onClick={() => console.log('Penalties config TBD')}
                      />
                    </div>
                  </Vertical>
                </div>
              </Horizontal>
            </div>
          </Vertical>
        </Vertical>
      </div>

      {/* Sticky Footer */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          borderTop: '1px solid #d9d9d9',
          backgroundColor: '#ffffff',
          zIndex: 10,
        }}
      >
        <Horizontal style={{ justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <Button size='large' onClick={onClose} style={{ minWidth: '100px' }}>
            Cancel
          </Button>
          <Button type='primary' size='large' onClick={handleSave} disabled={!name.trim()} style={{ minWidth: '140px' }}>
            {isEditMode ? 'Save Changes' : 'Add Scenario'}
          </Button>
        </Horizontal>
      </div>
    </Drawer>
  )
}
