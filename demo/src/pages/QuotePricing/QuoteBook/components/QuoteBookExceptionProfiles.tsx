import { useState } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { PlusOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Input, Select, message } from 'antd'
import type { ExceptionProfile, ThresholdSeverity } from '../QuoteBook.types'

type EditMode = 'view' | 'edit' | 'create'

type EditForm = {
  name: string
  description: string
  ownership: 'personal' | 'org'
  startFrom: string
  thresholds: {
    component: string
    colorDot: string
    floor: number
    ceiling: number
    severity: ThresholdSeverity
    orgFloor: number
    orgCeiling: number
  }[]
  scopeTerminal: string
  scopeProduct: string
}

interface QuoteBookExceptionProfilesProps {
  profiles: ExceptionProfile[]
  onCreateProfile: (profile: ExceptionProfile) => void
  onUpdateProfile: (profile: ExceptionProfile) => void
  onDeleteProfile: (profileKey: string) => void
}

export function QuoteBookExceptionProfiles({
  profiles,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
}: QuoteBookExceptionProfilesProps) {
  const [selectedProfileKey, setSelectedProfileKey] = useState('standard')
  const [editMode, setEditMode] = useState<EditMode>('view')
  const [editForm, setEditForm] = useState<EditForm>(() => makeDefaultEditForm(profiles))

  const orgProfiles = profiles.filter(p => p.tier === 'org')
  const personalProfiles = profiles.filter(p => p.tier === 'personal')
  const selectedProfile = profiles.find(p => p.key === selectedProfileKey) || profiles[0]

  const handleSelectProfile = (key: string) => {
    setSelectedProfileKey(key)
    setEditMode('view')
  }

  const handleEdit = () => {
    setEditForm({
      name: selectedProfile.name,
      description: selectedProfile.description,
      ownership: selectedProfile.tier,
      startFrom: selectedProfile.key,
      thresholds: selectedProfile.thresholds.map(t => ({ ...t })),
      scopeTerminal: 'all',
      scopeProduct: 'all',
    })
    setEditMode('edit')
  }

  const handleCreate = () => {
    setEditForm(makeDefaultEditForm(profiles))
    setEditMode('create')
  }

  const handleDuplicate = () => {
    setEditForm({
      name: `Copy of ${selectedProfile.name}`,
      description: selectedProfile.description,
      ownership: 'personal',
      startFrom: selectedProfile.key,
      thresholds: selectedProfile.thresholds.map(t => ({ ...t })),
      scopeTerminal: 'all',
      scopeProduct: 'all',
    })
    setEditMode('create')
  }

  const handleSave = () => {
    if (!editForm.name.trim()) {
      message.warning('Profile name is required.')
      return
    }

    // Validate org limits
    for (const t of editForm.thresholds) {
      if (t.floor < t.orgFloor || t.ceiling > t.orgCeiling) {
        message.error(`${t.component}: values exceed org limits (${t.orgFloor.toFixed(4)} – ${t.orgCeiling.toFixed(4)})`)
        return
      }
    }

    if (editMode === 'create') {
      const key = editForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
      const newProfile: ExceptionProfile = {
        key,
        name: editForm.name,
        tier: 'personal',
        description: editForm.description,
        isSystem: false,
        scope: 'All rows',
        badge: null,
        thresholds: editForm.thresholds.map(t => ({ ...t })),
      }
      onCreateProfile(newProfile)
      setSelectedProfileKey(key)
      setEditMode('view')
      message.success(`Profile "${editForm.name}" created.`)
    } else {
      const updated: ExceptionProfile = {
        ...selectedProfile,
        name: editForm.name,
        description: editForm.description,
        thresholds: editForm.thresholds.map(t => ({ ...t })),
      }
      onUpdateProfile(updated)
      setEditMode('view')
      message.success('Profile saved.')
    }
  }

  const handleDelete = () => {
    onDeleteProfile(selectedProfileKey)
    setSelectedProfileKey('default')
  }

  return (
    <Horizontal style={{ flex: 1, overflow: 'hidden' }}>
      {/* Left Sidebar — 300px */}
      <div style={{
        width: 300,
        minWidth: 300,
        flexShrink: 0,
        borderRight: '1px solid var(--gray-200)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-1)',
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--gray-200)',
          flexShrink: 0,
        }}>
          <Texto category="h5" weight="600">Exception Profiles</Texto>
        </div>

        {/* Scrollable profile list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
          {/* Organization section */}
          <Horizontal alignItems="center" style={{ gap: '6px', padding: '8px 8px 4px' }}>
            <LockOutlined style={{ fontSize: 11, color: 'var(--gray-400)' }} />
            <Texto appearance="medium" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Organization
            </Texto>
          </Horizontal>
          {orgProfiles.map(profile => (
            <ProfileCard
              key={profile.key}
              name={profile.name}
              description={profile.description}
              badge={profile.badge}
              isSelected={selectedProfileKey === profile.key && editMode === 'view'}
              isActive={profile.key === 'standard'}
              onClick={() => handleSelectProfile(profile.key)}
            />
          ))}

          {/* Personal section */}
          <Horizontal alignItems="center" style={{ gap: '6px', padding: '16px 8px 4px' }}>
            <UserOutlined style={{ fontSize: 11, color: 'var(--gray-400)' }} />
            <Texto appearance="medium" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Personal
            </Texto>
          </Horizontal>
          {personalProfiles.map(profile => (
            <ProfileCard
              key={profile.key}
              name={profile.name}
              description={profile.description}
              badge={profile.badge}
              isSelected={selectedProfileKey === profile.key && editMode === 'view'}
              isActive={false}
              onClick={() => handleSelectProfile(profile.key)}
            />
          ))}
        </div>

        {/* New Profile button */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid var(--gray-200)',
          flexShrink: 0,
        }}>
          <div
            onClick={handleCreate}
            style={{
              padding: '10px',
              border: '2px dashed var(--gray-200)',
              borderRadius: 6,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
              color: 'var(--gray-400)',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <PlusOutlined style={{ fontSize: 12 }} />
            New Custom Profile
          </div>
        </div>
      </div>

      {/* Right Detail Area — flex: 1 */}
      <Vertical flex="1" style={{ overflow: 'hidden', background: 'var(--bg-1)' }}>
        {editMode === 'view' ? (
          <ProfileViewMode
            profile={selectedProfile}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        ) : (
          <ProfileEditMode
            editMode={editMode}
            editForm={editForm}
            setEditForm={setEditForm}
            profiles={profiles}
            onCancel={() => setEditMode('view')}
            onSave={handleSave}
          />
        )}
      </Vertical>
    </Horizontal>
  )
}

function makeDefaultEditForm(profiles: ExceptionProfile[]): EditForm {
  const source = profiles[0]
  return {
    name: '',
    description: '',
    ownership: 'personal',
    startFrom: source?.key || 'standard',
    thresholds: source ? source.thresholds.map(t => ({ ...t })) : [],
    scopeTerminal: 'all',
    scopeProduct: 'all',
  }
}

/* ---------- Profile View Mode ---------- */
function ProfileViewMode({
  profile,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  profile: ExceptionProfile
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const ownerBadge = profile.tier === 'org'
    ? { bg: '#eef2ff', color: '#4338ca', icon: <LockOutlined style={{ fontSize: 10 }} />, text: 'Organization' }
    : { bg: '#fffbeb', color: '#d97706', icon: <UserOutlined style={{ fontSize: 10 }} />, text: 'Personal' }

  return (
    <>
      {/* Detail Header */}
      <Horizontal
        justifyContent="space-between"
        alignItems="center"
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--gray-200)',
          flexShrink: 0,
        }}
      >
        <Vertical>
          <Horizontal alignItems="center" style={{ gap: '8px' }}>
            <Texto category="h5" weight="600">{profile.name}</Texto>
            <span style={{
              padding: '2px 8px',
              background: ownerBadge.bg,
              borderRadius: 4,
              fontSize: 11,
              color: ownerBadge.color,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}>
              {ownerBadge.icon}
              {ownerBadge.text}
            </span>
          </Horizontal>
          <Texto appearance="medium" style={{ fontSize: 12, marginTop: 2 }}>
            {profile.description}
          </Texto>
        </Vertical>
        <Horizontal style={{ gap: '8px' }}>
          {profile.tier === 'org' && (
            <GraviButton buttonText="Duplicate as Personal" onClick={onDuplicate} />
          )}
          {profile.tier === 'personal' && !profile.isSystem && (
            <>
              <GraviButton buttonText="Edit" onClick={onEdit} />
              <GraviButton buttonText="Delete" onClick={onDelete} />
            </>
          )}
          {profile.isSystem && (
            <GraviButton buttonText="Edit" onClick={onEdit} />
          )}
        </Horizontal>
      </Horizontal>

      {/* Detail Body — scrollable */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {/* Threshold grid: 2-column CSS grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 20,
        }}>
          {profile.thresholds.map(t => (
            <ThresholdSummaryCard key={t.component} threshold={t} />
          ))}
        </div>

        {/* Scope */}
        <div style={{
          padding: '12px 16px',
          background: 'var(--gray-50)',
          borderRadius: 6,
          marginBottom: 16,
        }}>
          <Texto appearance="medium" style={{ fontSize: 12 }}>
            Applies to: {profile.scope}
          </Texto>
        </div>
      </div>

      {/* Detail Footer (view mode) */}
      <Horizontal
        alignItems="center"
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--gray-200)',
          flexShrink: 0,
        }}
      >
        <Texto appearance="medium" style={{ fontSize: 12 }}>
          Active since Today 2:34 PM
        </Texto>
      </Horizontal>
    </>
  )
}

/* ---------- Threshold Summary Card ---------- */
function ThresholdSummaryCard({ threshold }: { threshold: ExceptionProfile['thresholds'][0] }) {
  const severityColors: Record<string, { bg: string; color: string }> = {
    Hard: { bg: '#fef2f2', color: '#dc2626' },
    Soft: { bg: '#fffbeb', color: '#d97706' },
    Off: { bg: 'var(--gray-100)', color: 'var(--gray-400)' },
  }
  const sc = severityColors[threshold.severity] || severityColors.Off

  return (
    <div style={{
      padding: '10px 12px',
      border: '1px solid var(--gray-200)',
      borderRadius: 6,
    }}>
      <Horizontal alignItems="center" justifyContent="space-between" style={{ marginBottom: 6 }}>
        <Horizontal alignItems="center" style={{ gap: '6px' }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: threshold.colorDot,
            flexShrink: 0,
          }} />
          <Texto weight="500" style={{ fontSize: 13 }}>{threshold.component}</Texto>
        </Horizontal>
        <span style={{
          padding: '1px 6px',
          borderRadius: 3,
          fontSize: 10,
          fontWeight: 600,
          background: sc.bg,
          color: sc.color,
        }}>
          {threshold.severity}
        </span>
      </Horizontal>
      <Texto style={{ fontSize: 12, fontFamily: 'monospace' }}>
        ${threshold.floor.toFixed(4)} – ${threshold.ceiling.toFixed(4)}
      </Texto>
    </div>
  )
}

/* ---------- Profile Edit/Create Mode ---------- */
function ProfileEditMode({
  editMode,
  editForm,
  setEditForm,
  profiles,
  onCancel,
  onSave,
}: {
  editMode: 'edit' | 'create'
  editForm: EditForm
  setEditForm: (f: EditForm) => void
  profiles: ExceptionProfile[]
  onCancel: () => void
  onSave: () => void
}) {
  const updateThreshold = (index: number, field: string, value: any) => {
    const updated = [...editForm.thresholds]
    updated[index] = { ...updated[index], [field]: value }
    setEditForm({ ...editForm, thresholds: updated })
  }

  return (
    <>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--gray-200)',
        flexShrink: 0,
      }}>
        <Texto category="h5" weight="600">
          {editMode === 'edit' ? `Edit ${editForm.name}` : 'New Exception Profile'}
        </Texto>
      </div>

      {/* Body — scrollable */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {/* Name + Description */}
        <div style={{ marginBottom: 16, maxWidth: 400 }}>
          <Texto style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Name</Texto>
          <Input
            size="small"
            value={editForm.name}
            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Profile name..."
          />
        </div>
        <div style={{ marginBottom: 16, maxWidth: 400 }}>
          <Texto style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Description</Texto>
          <Input.TextArea
            rows={2}
            value={editForm.description}
            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
            placeholder="Brief description..."
          />
        </div>

        {/* Ownership toggle */}
        <div style={{ marginBottom: 16 }}>
          <Texto style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Ownership</Texto>
          <Horizontal style={{ gap: '8px' }}>
            <span style={{
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              border: '1px solid',
              borderColor: editForm.ownership === 'personal' ? '#2563eb' : 'var(--gray-200)',
              background: editForm.ownership === 'personal' ? '#eff6ff' : 'transparent',
              color: editForm.ownership === 'personal' ? '#2563eb' : 'var(--gray-500)',
              cursor: 'pointer',
            }}
              onClick={() => setEditForm({ ...editForm, ownership: 'personal' })}
            >
              Personal
            </span>
            <span style={{
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              border: '1px solid var(--gray-200)',
              background: 'var(--gray-50)',
              color: 'var(--gray-400)',
              cursor: 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <LockOutlined style={{ fontSize: 10 }} />
              Organization
            </span>
          </Horizontal>
        </div>

        {/* Start From (create mode) */}
        {editMode === 'create' && (
          <div style={{ marginBottom: 16, maxWidth: 400 }}>
            <Texto style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Start From</Texto>
            <Select
              size="small"
              value={editForm.startFrom}
              onChange={val => {
                const source = profiles.find(p => p.key === val)
                if (source) {
                  setEditForm({
                    ...editForm,
                    startFrom: val,
                    thresholds: source.thresholds.map(t => ({ ...t })),
                  })
                }
              }}
              style={{ width: '100%' }}
              options={profiles.map(p => ({ value: p.key, label: p.name }))}
            />
          </div>
        )}

        {/* 7 threshold editor cards */}
        <Texto style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Thresholds</Texto>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
          {editForm.thresholds.map((t, i) => (
            <ThresholdEditorCard
              key={t.component}
              threshold={t}
              onSeverityChange={(s) => updateThreshold(i, 'severity', s)}
              onFloorChange={(v) => updateThreshold(i, 'floor', v)}
              onCeilingChange={(v) => updateThreshold(i, 'ceiling', v)}
            />
          ))}
        </div>

        {/* Scope */}
        <div style={{ marginTop: 20, marginBottom: 16, maxWidth: 400 }}>
          <Texto style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Scope</Texto>
          <Horizontal style={{ gap: '12px', marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <Texto appearance="medium" style={{ fontSize: 11, marginBottom: 4 }}>Terminal</Texto>
              <Select
                size="small"
                value={editForm.scopeTerminal}
                onChange={val => setEditForm({ ...editForm, scopeTerminal: val })}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: 'All Terminals' },
                  { value: 'houston', label: 'Houston Term.' },
                  { value: 'dallas', label: 'Dallas Hub' },
                  { value: 'chicago', label: 'Chicago Term.' },
                ]}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Texto appearance="medium" style={{ fontSize: 11, marginBottom: 4 }}>Product</Texto>
              <Select
                size="small"
                value={editForm.scopeProduct}
                onChange={val => setEditForm({ ...editForm, scopeProduct: val })}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: 'All Products' },
                  { value: 'diesel', label: 'Diesel #2' },
                  { value: 'unleaded', label: 'Unleaded 87' },
                  { value: 'premium', label: 'Premium 91' },
                  { value: 'jet', label: 'Jet-A' },
                ]}
              />
            </div>
          </Horizontal>
          <Texto appearance="medium" style={{ fontSize: 11 }}>
            Scope determines which rows this profile can be applied to.
          </Texto>
        </div>
      </div>

      {/* Footer */}
      <Horizontal
        justifyContent="flex-end"
        alignItems="center"
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--gray-200)',
          flexShrink: 0,
          gap: '8px',
        }}
      >
        <GraviButton buttonText="Cancel" onClick={onCancel} />
        <GraviButton
          theme1
          buttonText={editMode === 'create' ? 'Create Profile' : 'Save Changes'}
          onClick={onSave}
        />
      </Horizontal>
    </>
  )
}

/* ---------- Threshold Editor Card ---------- */
function ThresholdEditorCard({
  threshold,
  onSeverityChange,
  onFloorChange,
  onCeilingChange,
}: {
  threshold: EditForm['thresholds'][0]
  onSeverityChange: (s: ThresholdSeverity) => void
  onFloorChange: (v: number) => void
  onCeilingChange: (v: number) => void
}) {
  const severities: ThresholdSeverity[] = ['Soft', 'Hard', 'Off']

  return (
    <div style={{
      padding: '10px 12px',
      border: '1px solid var(--gray-200)',
      borderRadius: 6,
      maxWidth: 520,
    }}>
      {/* Header: dot + name */}
      <Horizontal alignItems="center" style={{ gap: '6px', marginBottom: 8 }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: threshold.colorDot,
          flexShrink: 0,
        }} />
        <Texto weight="500" style={{ fontSize: 13 }}>{threshold.component}</Texto>
      </Horizontal>

      {/* Severity segmented control */}
      <div style={{
        display: 'inline-flex',
        border: '1px solid var(--gray-200)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
        maxWidth: 180,
      }}>
        {severities.map(s => (
          <span
            key={s}
            onClick={() => onSeverityChange(s)}
            style={{
              width: 60,
              padding: '4px 0',
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              background: threshold.severity === s ? (s === 'Hard' ? '#fef2f2' : s === 'Soft' ? '#fffbeb' : 'var(--gray-100)') : 'transparent',
              color: threshold.severity === s ? (s === 'Hard' ? '#dc2626' : s === 'Soft' ? '#d97706' : 'var(--gray-500)') : 'var(--gray-400)',
              transition: 'all 0.1s',
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Floor + Ceiling inputs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: 6, width: 'fit-content' }}>
        <div style={{ width: 120 }}>
          <Texto appearance="medium" style={{ fontSize: 10, marginBottom: 2 }}>Floor</Texto>
          <Input
            size="small"
            value={threshold.floor.toFixed(4)}
            onChange={e => {
              const v = parseFloat(e.target.value)
              if (!isNaN(v)) onFloorChange(v)
            }}
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
        </div>
        <div style={{ width: 120 }}>
          <Texto appearance="medium" style={{ fontSize: 10, marginBottom: 2 }}>Ceiling</Texto>
          <Input
            size="small"
            value={threshold.ceiling.toFixed(4)}
            onChange={e => {
              const v = parseFloat(e.target.value)
              if (!isNaN(v)) onCeilingChange(v)
            }}
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
        </div>
      </div>

      {/* Org limit locked row */}
      <div style={{
        padding: '4px 8px',
        border: '1px dashed var(--gray-200)',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'not-allowed',
      }}>
        <LockOutlined style={{ fontSize: 10, color: 'var(--gray-400)' }} />
        <Texto appearance="medium" style={{ fontSize: 10 }}>
          Org limit: ${threshold.orgFloor.toFixed(4)} – ${threshold.orgCeiling.toFixed(4)}
        </Texto>
      </div>
    </div>
  )
}

/* ---------- Profile Card (sidebar item) ---------- */
function ProfileCard({
  name,
  description,
  badge,
  isSelected,
  isActive,
  onClick,
}: {
  name: string
  description: string
  badge: { text: string; variant: string } | null
  isSelected: boolean
  isActive: boolean
  onClick: () => void
}) {
  const badgeColors: Record<string, { bg: string; color: string }> = {
    warning: { bg: '#fffbeb', color: '#d97706' },
    error: { bg: '#fef2f2', color: '#dc2626' },
    primary: { bg: '#eff6ff', color: '#2563eb' },
    default: { bg: 'var(--gray-100)', color: 'var(--gray-500)' },
  }

  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        transition: 'background 0.15s',
        marginBottom: 2,
        borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
        background: isSelected ? '#eff6ff' : 'transparent',
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--gray-50)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
    >
      <Horizontal alignItems="center" style={{ gap: '6px', marginBottom: 2 }}>
        <Texto weight="500" style={{ fontSize: 13 }}>{name}</Texto>
        {badge && (
          <span style={{
            padding: '1px 6px',
            borderRadius: 3,
            fontSize: 10,
            fontWeight: 600,
            background: badgeColors[badge.variant]?.bg || badgeColors.default.bg,
            color: badgeColors[badge.variant]?.color || badgeColors.default.color,
          }}>
            {badge.text}
          </span>
        )}
        {isActive && (
          <span style={{
            padding: '1px 6px',
            borderRadius: 3,
            fontSize: 10,
            fontWeight: 600,
            background: '#f0fdf4',
            color: '#16a34a',
          }}>
            Active
          </span>
        )}
      </Horizontal>
      <Texto appearance="medium" style={{ fontSize: 11, lineHeight: 1.3 }}>
        {description}
      </Texto>
    </div>
  )
}
