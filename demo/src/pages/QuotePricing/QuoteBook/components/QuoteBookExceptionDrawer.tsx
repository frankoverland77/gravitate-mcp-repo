import { useState, useEffect } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CloseOutlined, InboxOutlined, SafetyCertificateOutlined, EditOutlined } from '@ant-design/icons'
import { InputNumber, Select, message } from 'antd'
import type { DrawerState, ExceptionProfile, ThresholdOverride } from '../QuoteBook.types'
import { getComponentStatus } from '../QuoteBook.types'
import type { QuoteRow } from '../QuoteBook.data'

interface QuoteBookExceptionDrawerProps {
  drawerState: DrawerState
  selectedRows: QuoteRow[]
  profiles: ExceptionProfile[]
  profileMap: Record<string, ExceptionProfile>
  onClose: () => void
  onActionModeChange: (mode: 'profile' | 'override') => void
  onApplyProfile: (profileKey: string) => void
  onApplyOverride: (override: ThresholdOverride, overwriteExisting: boolean) => void
  onResetToDefaults: () => void
  onClearSelection: () => void
}

export function QuoteBookExceptionDrawer({
  drawerState,
  selectedRows,
  profiles,
  profileMap,
  onClose,
  onActionModeChange,
  onApplyProfile,
  onApplyOverride,
  onResetToDefaults,
  onClearSelection,
}: QuoteBookExceptionDrawerProps) {
  const { isOpen, mode, selectedRowIds, actionMode } = drawerState
  const selectedCount = selectedRowIds.length

  return (
    <div style={{
      width: isOpen ? '460px' : '0px',
      minWidth: isOpen ? '460px' : '0px',
      overflow: 'hidden',
      transition: 'width 300ms ease, min-width 300ms ease',
      borderLeft: isOpen ? '1px solid var(--gray-200)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-1)',
      flexShrink: 0,
    }}>
      {/* Drawer Header */}
      <Horizontal
        justifyContent="space-between"
        alignItems="center"
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--gray-200)',
          flexShrink: 0,
        }}
      >
        <Texto category="h5" weight="600">
          {mode === 'multi' ? 'Bulk Threshold Change' : 'Threshold Management'}
        </Texto>
        <span
          onClick={onClose}
          style={{
            cursor: 'pointer',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-100)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <CloseOutlined style={{ fontSize: 14 }} />
        </span>
      </Horizontal>

      {/* Drawer Body */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {mode === 'empty' && <EmptyState />}
        {mode === 'single' && (
          <SingleRowState
            row={selectedRows[0]}
            actionMode={actionMode}
            onActionModeChange={onActionModeChange}
            profiles={profiles}
            profileMap={profileMap}
            onApplyProfile={onApplyProfile}
            onApplyOverride={onApplyOverride}
          />
        )}
        {mode === 'multi' && (
          <MultiRowState
            selectedRows={selectedRows}
            actionMode={actionMode}
            onActionModeChange={onActionModeChange}
            profiles={profiles}
            profileMap={profileMap}
            onApplyProfile={onApplyProfile}
            onApplyOverride={onApplyOverride}
          />
        )}
      </div>

      {/* Drawer Footer — hidden for empty state */}
      {mode === 'single' && (
        <Horizontal
          justifyContent="space-between"
          alignItems="center"
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--gray-200)',
            flexShrink: 0,
          }}
        >
          <GraviButton buttonText="Reset to Defaults" onClick={onResetToDefaults} />
          <GraviButton
            theme1
            buttonText={actionMode === 'profile' ? 'Apply to Row' : 'Override Row'}
            onClick={() => {
              const form = document.querySelector('[data-drawer-submit]') as HTMLElement
              form?.click()
            }}
          />
        </Horizontal>
      )}
      {mode === 'multi' && (
        <Horizontal
          justifyContent="space-between"
          alignItems="center"
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--gray-200)',
            flexShrink: 0,
          }}
        >
          <GraviButton buttonText="Clear Selection" onClick={onClearSelection} />
          <GraviButton
            theme1
            buttonText={
              actionMode === 'profile'
                ? `Apply to ${selectedCount} Rows`
                : `Override ${selectedCount} Rows`
            }
            onClick={() => {
              const form = document.querySelector('[data-drawer-submit]') as HTMLElement
              form?.click()
            }}
          />
        </Horizontal>
      )}
    </div>
  )
}

/* ---------- Empty State ---------- */
function EmptyState() {
  return (
    <Vertical
      justifyContent="center"
      alignItems="center"
      flex="1"
      style={{ padding: '60px 24px', textAlign: 'center', minHeight: 300 }}
    >
      <InboxOutlined style={{ fontSize: 40, color: 'var(--gray-300)', marginBottom: 16 }} />
      <Texto category="h5" weight="600" style={{ marginBottom: 8 }}>
        No rows selected
      </Texto>
      <Texto appearance="medium">
        Select one or more rows in the grid to manage thresholds, apply profiles, or set overrides.
      </Texto>
    </Vertical>
  )
}

/* ---------- Action Mode Toggle ---------- */
function ActionModeToggle({
  actionMode,
  onActionModeChange,
}: {
  actionMode: 'profile' | 'override'
  onActionModeChange: (mode: 'profile' | 'override') => void
}) {
  return (
    <div style={{
      display: 'flex',
      border: '1px solid var(--gray-200)',
      borderRadius: 6,
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <span
        onClick={() => onActionModeChange('profile')}
        style={{
          flex: 1,
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          background: actionMode === 'profile' ? 'var(--theme-color-1)' : 'transparent',
          color: actionMode === 'profile' ? '#fff' : 'var(--gray-600)',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <SafetyCertificateOutlined style={{ fontSize: 13 }} />
        Apply Profile
      </span>
      <span
        onClick={() => onActionModeChange('override')}
        style={{
          flex: 1,
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          background: actionMode === 'override' ? 'var(--theme-color-1)' : 'transparent',
          color: actionMode === 'override' ? '#fff' : 'var(--gray-600)',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <EditOutlined style={{ fontSize: 13 }} />
        Set Override
      </span>
    </div>
  )
}

/* ---------- Profile Radio Cards ---------- */
function ProfileRadioCards({
  profiles,
  selectedKey,
  onSelect,
}: {
  profiles: ExceptionProfile[]
  selectedKey: string | null
  onSelect: (key: string) => void
}) {
  const orgProfiles = profiles.filter(p => p.tier === 'org')
  const personalProfiles = profiles.filter(p => p.tier === 'personal')

  const renderCard = (profile: ExceptionProfile) => {
    const isSelected = selectedKey === profile.key
    return (
      <div
        key={profile.key}
        onClick={() => onSelect(profile.key)}
        style={{
          padding: '10px 12px',
          borderRadius: 6,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: isSelected ? '#2563eb' : 'var(--gray-200)',
          borderLeft: isSelected ? '3px solid #2563eb' : '1px solid var(--gray-200)',
          background: isSelected ? '#eff6ff' : 'transparent',
          marginBottom: 6,
          transition: 'all 0.15s',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        {/* Radio circle */}
        <div style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: `2px solid ${isSelected ? '#2563eb' : 'var(--gray-300)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
        }}>
          {isSelected && (
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
          )}
        </div>
        <div>
          <Texto weight="600" style={{ fontSize: 13 }}>{profile.name}</Texto>
          <Texto appearance="medium" style={{ fontSize: 11, lineHeight: 1.3, marginTop: 2 }}>
            {profile.description}
          </Texto>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Texto appearance="medium" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
        Organization
      </Texto>
      {orgProfiles.map(renderCard)}
      <div style={{ height: 1, background: 'var(--gray-200)', margin: '10px 0' }} />
      <Texto appearance="medium" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
        Personal
      </Texto>
      {personalProfiles.map(renderCard)}
    </div>
  )
}

/* ---------- Threshold Preview ---------- */
function ThresholdPreview({ profileKey, profileMap }: { profileKey: string | null; profileMap: Record<string, ExceptionProfile> }) {
  if (!profileKey) return null
  const profile = profileMap[profileKey]
  if (!profile) return null

  const statusColors: Record<string, string> = {
    hard: '#dc2626',
    soft: '#d97706',
    off: 'var(--gray-400)',
  }

  const formatBoundary = (val: number | null) => val !== null ? `$${val.toFixed(4)}` : '—'

  return (
    <div style={{
      border: '1px solid var(--gray-200)',
      borderRadius: 6,
      padding: 12,
      marginTop: 12,
    }}>
      <Texto weight="600" style={{ fontSize: 12, marginBottom: 10 }}>
        {profile.name} — Threshold Values
      </Texto>
      {profile.thresholds.slice(0, 5).map(t => {
        const status = getComponentStatus(t)
        const hasCritical = t.criticalBelow !== null || t.criticalAbove !== null
        const hasWarning = t.warningBelow !== null || t.warningAbove !== null
        return (
          <div
            key={t.component}
            style={{ padding: '4px 0', borderBottom: '1px solid var(--gray-50)' }}
          >
            <Horizontal
              justifyContent="space-between"
              alignItems="center"
            >
              <Horizontal alignItems="center" style={{ gap: '6px' }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: t.colorDot,
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
                <Texto style={{ fontSize: 12 }}>{t.component}</Texto>
              </Horizontal>
              <Texto style={{ fontSize: 11, fontFamily: 'monospace', color: statusColors[status] }}>
                {status === 'off' ? 'Off' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Texto>
            </Horizontal>
            {status !== 'off' && (
              <div style={{ marginLeft: 14, fontSize: 11, fontFamily: 'monospace', color: 'var(--gray-500)' }}>
                {hasCritical && <div style={{ color: '#dc2626' }}>Critical: {formatBoundary(t.criticalBelow)} .. {formatBoundary(t.criticalAbove)}</div>}
                {hasWarning && <div style={{ color: '#d97706' }}>Warning: {formatBoundary(t.warningBelow)} .. {formatBoundary(t.warningAbove)}</div>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Override Form ---------- */
function OverrideForm({
  extraCheckbox,
  onSubmit,
}: {
  extraCheckbox?: boolean
  onSubmit: (override: ThresholdOverride, overwriteExisting: boolean) => void
}) {
  const [component, setComponent] = useState<string | null>(null)
  const [criticalBelow, setCriticalBelow] = useState<number | null>(null)
  const [warningBelow, setWarningBelow] = useState<number | null>(null)
  const [warningAbove, setWarningAbove] = useState<number | null>(null)
  const [criticalAbove, setCriticalAbove] = useState<number | null>(null)
  const [overwriteExisting, setOverwriteExisting] = useState(false)

  const componentOptions = [
    'Margin', 'Cost', 'Market Move', 'Price Delta', 'Price', 'Bench Delta', 'Bench Value',
  ]

  const isAbsolute = component === 'Market Move' || component === 'Bench Delta'

  const handleSubmit = () => {
    if (!component) {
      message.warning('Please select a component.')
      return
    }
    if (criticalBelow === null && warningBelow === null && warningAbove === null && criticalAbove === null) {
      message.warning('At least one boundary must be set.')
      return
    }
    onSubmit({ component, criticalBelow, warningBelow, warningAbove, criticalAbove }, overwriteExisting)
    // Reset form
    setComponent(null)
    setCriticalBelow(null)
    setWarningBelow(null)
    setWarningAbove(null)
    setCriticalAbove(null)
    setOverwriteExisting(false)
  }

  const boundaryRow = (label: string, color: string, value: number | null, onChange: (v: number | null) => void, disabled?: boolean) => (
    <Horizontal alignItems="center" style={{ gap: '8px', marginBottom: 8 }}>
      <span style={{
        width: 110,
        fontSize: 12,
        fontWeight: 500,
        color,
        flexShrink: 0,
      }}>
        {label}
      </span>
      <InputNumber
        size="small"
        style={{ flex: 1 }}
        step={0.0001}
        placeholder={disabled ? 'N/A' : 'null'}
        value={value}
        onChange={v => onChange(v)}
        disabled={disabled}
      />
    </Horizontal>
  )

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <Texto style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Component</Texto>
        <Select
          placeholder="Select component..."
          style={{ width: '100%' }}
          size="small"
          value={component}
          onChange={val => {
            setComponent(val)
            // Reset below fields for absolute components
            if (val === 'Market Move' || val === 'Bench Delta') {
              setCriticalBelow(null)
              setWarningBelow(null)
            }
          }}
          options={componentOptions.map(c => ({ value: c, label: c }))}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <Texto style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Boundaries</Texto>
        {boundaryRow('Critical Below', '#dc2626', criticalBelow, setCriticalBelow, isAbsolute)}
        {boundaryRow('Warning Below', '#d97706', warningBelow, setWarningBelow, isAbsolute)}
        {boundaryRow('Warning Above', '#d97706', warningAbove, setWarningAbove)}
        {boundaryRow('Critical Above', '#dc2626', criticalAbove, setCriticalAbove)}
      </div>
      {extraCheckbox && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gray-600)', cursor: 'pointer' }}>
          <input type="checkbox" checked={overwriteExisting} onChange={e => setOverwriteExisting(e.target.checked)} />
          Override rows with existing custom thresholds
        </label>
      )}
      {/* Hidden submit trigger for footer button */}
      <span data-drawer-submit style={{ display: 'none' }} onClick={handleSubmit} />
    </div>
  )
}

/* ---------- Single Row State ---------- */
function SingleRowState({
  row,
  actionMode,
  onActionModeChange,
  profiles,
  profileMap,
  onApplyProfile,
  onApplyOverride,
}: {
  row: QuoteRow | undefined
  actionMode: 'profile' | 'override'
  onActionModeChange: (mode: 'profile' | 'override') => void
  profiles: ExceptionProfile[]
  profileMap: Record<string, ExceptionProfile>
  onApplyProfile: (profileKey: string) => void
  onApplyOverride: (override: ThresholdOverride, overwriteExisting: boolean) => void
}) {
  const [selectedProfileKey, setSelectedProfileKey] = useState<string | null>(null)

  useEffect(() => {
    setSelectedProfileKey(row?.profileKey || null)
  }, [row?.id])

  if (!row) return null

  const handleProfileSubmit = () => {
    if (!selectedProfileKey) {
      message.warning('Please select a profile.')
      return
    }
    onApplyProfile(selectedProfileKey)
  }

  return (
    <Vertical style={{ padding: '16px' }}>
      {/* Scope summary */}
      <div style={{
        padding: '8px 12px',
        background: 'var(--gray-50)',
        borderRadius: 6,
        marginBottom: 16,
        fontSize: 12,
        color: 'var(--gray-600)',
      }}>
        Showing: {row.location} · {row.product} — QC-0{row.id}
      </div>

      {/* Action mode toggle */}
      <ActionModeToggle actionMode={actionMode} onActionModeChange={onActionModeChange} />

      {/* Content area */}
      <div style={{ marginTop: 16 }}>
        {actionMode === 'profile' ? (
          <>
            <ProfileRadioCards
              profiles={profiles}
              selectedKey={selectedProfileKey}
              onSelect={setSelectedProfileKey}
            />
            <ThresholdPreview profileKey={selectedProfileKey} profileMap={profileMap} />
            {/* Hidden submit trigger for footer button */}
            <span data-drawer-submit style={{ display: 'none' }} onClick={handleProfileSubmit} />
          </>
        ) : (
          <OverrideForm onSubmit={onApplyOverride} />
        )}
      </div>
    </Vertical>
  )
}

/* ---------- Multi Row State ---------- */
function MultiRowState({
  selectedRows,
  actionMode,
  onActionModeChange,
  profiles,
  profileMap,
  onApplyProfile,
  onApplyOverride,
}: {
  selectedRows: QuoteRow[]
  actionMode: 'profile' | 'override'
  onActionModeChange: (mode: 'profile' | 'override') => void
  profiles: ExceptionProfile[]
  profileMap: Record<string, ExceptionProfile>
  onApplyProfile: (profileKey: string) => void
  onApplyOverride: (override: ThresholdOverride, overwriteExisting: boolean) => void
}) {
  const [selectedProfileKey, setSelectedProfileKey] = useState<string | null>(null)
  const selectedCount = selectedRows.length

  useEffect(() => {
    if (selectedRows.length > 0) {
      setSelectedProfileKey(selectedRows[0].profileKey || null)
    }
  }, [selectedRows.map(r => r.id).join(',')])

  // Compute aggregated info
  const uniqueLocations = [...new Set(selectedRows.map(r => r.location))]
  const uniqueProducts = [...new Set(selectedRows.map(r => r.product))]
  const subtitle = `${uniqueLocations.length === 1 ? uniqueLocations[0] : `${uniqueLocations.length} locations`} · ${uniqueProducts.length === 1 ? uniqueProducts[0] : 'Mixed products'}`

  // Profile mismatch
  const profileGroups: Record<string, number> = {}
  selectedRows.forEach(r => {
    const key = r.profileKey || 'none'
    profileGroups[key] = (profileGroups[key] || 0) + 1
  })
  const profileKeys = Object.keys(profileGroups)
  const hasMismatch = profileKeys.length > 1

  // Impact stats
  const rowsWithOverrides = selectedRows.filter(r => r.overrides && r.overrides.length > 0).length

  const handleProfileSubmit = () => {
    if (!selectedProfileKey) {
      message.warning('Please select a profile.')
      return
    }
    onApplyProfile(selectedProfileKey)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Selection summary header */}
      <Horizontal
        alignItems="center"
        style={{ gap: '12px', padding: '16px', borderBottom: '1px solid var(--gray-100)' }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'var(--theme-color-1)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
        }}>
          {selectedCount}
        </div>
        <div>
          <Texto weight="600">{selectedCount} rows selected</Texto>
          <Texto appearance="medium" style={{ fontSize: 12 }}>{subtitle}</Texto>
        </div>
      </Horizontal>

      {/* Profile mismatch notice */}
      {hasMismatch && (
        <div style={{
          margin: '12px 16px',
          padding: '10px 12px',
          background: '#fffbeb',
          border: '1px solid #fcd34d',
          borderRadius: 6,
          fontSize: 12,
        }}>
          <Horizontal alignItems="center" style={{ gap: '6px', marginBottom: 6 }}>
            <span style={{ color: '#d97706', fontWeight: 600 }}>Profile mismatch</span>
          </Horizontal>
          <Horizontal style={{ gap: '6px', flexWrap: 'wrap' }}>
            {profileKeys.map(key => {
              const profile = profileMap[key]
              const name = profile?.name || key
              return (
                <span key={key} style={{
                  padding: '2px 8px',
                  background: '#fff',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 4,
                  fontSize: 11,
                }}>
                  {name} ({profileGroups[key]})
                </span>
              )
            })}
          </Horizontal>
        </div>
      )}

      {/* Action mode toggle */}
      <div style={{ padding: '0 16px 16px' }}>
        <ActionModeToggle actionMode={actionMode} onActionModeChange={onActionModeChange} />
      </div>

      {/* Content area */}
      <div style={{ padding: '0 16px 16px' }}>
        {actionMode === 'profile' ? (
          <>
            <ProfileRadioCards
              profiles={profiles}
              selectedKey={selectedProfileKey}
              onSelect={setSelectedProfileKey}
            />
            <ThresholdPreview profileKey={selectedProfileKey} profileMap={profileMap} />
            {/* Hidden submit trigger for footer button */}
            <span data-drawer-submit style={{ display: 'none' }} onClick={handleProfileSubmit} />
          </>
        ) : (
          <OverrideForm extraCheckbox onSubmit={onApplyOverride} />
        )}
      </div>

      {/* Impact preview panel */}
      <div style={{
        margin: '0 16px 16px',
        padding: 12,
        background: 'var(--gray-50)',
        borderRadius: 6,
        border: '1px solid var(--gray-200)',
      }}>
        <Texto weight="600" style={{ fontSize: 12, marginBottom: 8 }}>Impact Preview</Texto>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Horizontal justifyContent="space-between" style={{ fontSize: 12 }}>
            <Texto appearance="medium" style={{ fontSize: 12 }}>Rows selected</Texto>
            <Texto weight="500" style={{ fontSize: 12 }}>{selectedCount}</Texto>
          </Horizontal>
          <Horizontal justifyContent="space-between" style={{ fontSize: 12 }}>
            <Texto appearance="medium" style={{ fontSize: 12 }}>Profiles affected</Texto>
            <Texto weight="500" style={{ fontSize: 12 }}>
              {profileKeys.length} different profile{profileKeys.length !== 1 ? 's' : ''} → 1
            </Texto>
          </Horizontal>
          <Horizontal justifyContent="space-between" style={{ fontSize: 12 }}>
            <Texto appearance="medium" style={{ fontSize: 12 }}>Rows with custom overrides</Texto>
            <Texto weight="500" style={{ fontSize: 12 }}>{rowsWithOverrides}</Texto>
          </Horizontal>
        </div>
      </div>
    </div>
  )
}
