import React, { useState, useCallback } from 'react'
import { ShowcaseShell, SectionDivider } from './ShowcaseShell'
import styles from './ColorsShowcase.module.css'

interface ColorEntry {
  hex: string
  cssVar: string
  description: string
  example?: 'button' | 'tag' | 'badge'
  exampleLabel?: string
}

function CopyableText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }, [text])

  return (
    <span
      className={`${styles.copyable} ${copied ? styles.copied : ''}`}
      onClick={handleCopy}
      title="Click to copy"
    >
      {copied ? 'Copied!' : text}
    </span>
  )
}

function ColorExample({ color, type, label }: { color: string; type: 'button' | 'tag' | 'badge'; label?: string }) {
  if (type === 'button') {
    return <span className={styles['example-button']} style={{ backgroundColor: color }}>{label || 'Button'}</span>
  }
  if (type === 'tag') {
    return <span className={styles['example-tag']} style={{ backgroundColor: color }}>{label || 'Tag'}</span>
  }
  return <span className={styles['example-badge']} style={{ backgroundColor: color }} />
}

function ColorRow({ hex, cssVar, description, example, exampleLabel }: ColorEntry) {
  return (
    <div className={styles['color-row']}>
      <div className={styles['color-swatch']} style={{ backgroundColor: hex }} />
      <div className={styles['color-info']}>
        <div className={styles['color-var-name']}>{cssVar}</div>
        <div className={styles['color-desc']}>{description}</div>
      </div>
      <div className={styles['color-right']}>
        {example && (
          <div className={styles['color-example']}>
            <ColorExample color={hex} type={example} label={exampleLabel} />
          </div>
        )}
        <CopyableText text={cssVar} />
        <CopyableText text={hex} />
      </div>
    </div>
  )
}

function ColorSection({ colors }: { colors: ColorEntry[] }) {
  return (
    <div className={styles['color-section']}>
      {colors.map((c) => (
        <ColorRow key={c.cssVar + c.hex + c.description} {...c} />
      ))}
    </div>
  )
}

// Collapsible tenant theme section
interface TenantTheme {
  name: string
  colors: ColorEntry[]
}

function TenantSection({ theme }: { theme: TenantTheme }) {
  const [open, setOpen] = useState(false)
  const previewColors = theme.colors.slice(0, 4)

  return (
    <div className={styles['tenant-section']}>
      <div className={styles['tenant-toggle']} onClick={() => setOpen(!open)}>
        <span className={`${styles['tenant-arrow']} ${open ? styles['tenant-arrow-open'] : ''}`}>&#9654;</span>
        <span className={styles['tenant-name']}>{theme.name}</span>
        <div className={styles['tenant-preview']}>
          {previewColors.map((c) => (
            <div key={c.cssVar + c.hex} className={styles['tenant-preview-dot']} style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>
      <div className={styles['tenant-colors']} style={{ maxHeight: open ? '800px' : '0px' }}>
        <ColorSection colors={theme.colors} />
      </div>
    </div>
  )
}

// --- Color Data ---

const peColors: ColorEntry[] = [
  { hex: '#0C5A58', cssVar: '--theme-color-1', description: 'Navigation, headers, primary actions', example: 'button', exampleLabel: 'Primary' },
  { hex: '#51B073', cssVar: '--theme-color-2', description: 'Select, Create, Save buttons', example: 'button', exampleLabel: 'Save' },
  { hex: '#64D28D', cssVar: '--theme-color-3', description: 'Success states, positive indicators', example: 'tag', exampleLabel: 'Active' },
  { hex: '#725ac1', cssVar: '--theme-color-4', description: 'Highlights, special callouts', example: 'tag', exampleLabel: 'Special' },
  { hex: '#c79c02', cssVar: '--theme-optimal', description: 'Optimal / recommended indicators', example: 'tag', exampleLabel: 'Optimal' },
]

const ospColors: ColorEntry[] = [
  { hex: '#0F1121', cssVar: '--theme-color-1', description: 'Navigation, headers', example: 'button', exampleLabel: 'Primary' },
  { hex: '#4BADE9', cssVar: '--theme-color-2', description: 'Primary actions, links', example: 'button', exampleLabel: 'Buy Now' },
  { hex: '#466185', cssVar: '--theme-color-3', description: 'Supporting elements', example: 'tag', exampleLabel: 'Info' },
  { hex: '#F1AF0F', cssVar: '--theme-color-4', description: 'Highlights, featured items', example: 'tag', exampleLabel: 'Featured' },
  { hex: '#c79c02', cssVar: '--theme-optimal', description: 'Optimal / recommended indicators', example: 'tag', exampleLabel: 'Optimal' },
]

const actionColors: ColorEntry[] = [
  { hex: '#51B073', cssVar: '--theme-color-2', description: 'Select / Create / Save (PE)', example: 'button', exampleLabel: 'Save' },
  { hex: '#4BADE9', cssVar: '--theme-color-2', description: 'Select / Create / Save (OSP)', example: 'button', exampleLabel: 'Save' },
  { hex: '#f22939', cssVar: '--theme-error', description: 'Cancel / Exit / Delete (PE)', example: 'button', exampleLabel: 'Cancel' },
  { hex: '#E42A11', cssVar: '--theme-error', description: 'Cancel / Exit / Delete (OSP)', example: 'button', exampleLabel: 'Cancel' },
  { hex: '#f26e29', cssVar: '--theme-warning', description: 'Warning actions (PE)', example: 'tag', exampleLabel: 'Warning' },
  { hex: '#FF9900', cssVar: '--theme-warning', description: 'Warning actions (OSP)', example: 'tag', exampleLabel: 'Warning' },
  { hex: '#cce5ff', cssVar: '--theme-info', description: 'Informational (PE)', example: 'badge' },
  { hex: '#74CDD7', cssVar: '--theme-info', description: 'Informational (OSP)', example: 'badge' },
  { hex: '#8dabc4', cssVar: '--theme-option', description: 'Neutral option selection (shared)', example: 'tag', exampleLabel: 'Option' },
]

const statusColors: ColorEntry[] = [
  { hex: '#64d28d', cssVar: '--theme-success', description: 'Completion, positive outcomes', example: 'tag', exampleLabel: 'Complete' },
  { hex: '#f22939', cssVar: '--theme-error', description: 'Validation errors (PE)', example: 'badge' },
  { hex: '#E42A11', cssVar: '--theme-error', description: 'Validation errors (OSP)', example: 'badge' },
  { hex: '#f26e29', cssVar: '--theme-warning', description: 'Caution (PE)', example: 'badge' },
  { hex: '#FF9900', cssVar: '--theme-warning', description: 'Caution (OSP)', example: 'badge' },
  { hex: '#DBF4E4', cssVar: '--theme-success-dim', description: 'Subtle success backgrounds' },
  { hex: '#FCE0D1', cssVar: '--theme-warning-dim', description: 'Subtle warning backgrounds' },
  { hex: '#FCD1D5', cssVar: '--theme-error-dim', description: 'Subtle error backgrounds' },
]

const comparisonRoles = [
  { role: 'Primary', pe: peColors[0], osp: ospColors[0] },
  { role: 'Secondary', pe: peColors[1], osp: ospColors[1] },
  { role: 'Tertiary', pe: peColors[2], osp: ospColors[2] },
  { role: 'Accent', pe: peColors[3], osp: ospColors[3] },
  { role: 'Optimal', pe: peColors[4], osp: ospColors[4] },
]

const mkColors = (c1: string, c2: string, c3: string, c4: string, opt: string, err: string, suc: string, warn: string, info: string, option: string): ColorEntry[] => [
  { hex: c1, cssVar: '--theme-color-1', description: 'Primary' },
  { hex: c2, cssVar: '--theme-color-2', description: 'Secondary' },
  { hex: c3, cssVar: '--theme-color-3', description: 'Tertiary' },
  { hex: c4, cssVar: '--theme-color-4', description: 'Accent' },
  { hex: opt, cssVar: '--theme-optimal', description: 'Optimal' },
  { hex: err, cssVar: '--theme-error', description: 'Error' },
  { hex: suc, cssVar: '--theme-success', description: 'Success' },
  { hex: warn, cssVar: '--theme-warning', description: 'Warning' },
  { hex: info, cssVar: '--theme-info', description: 'Info' },
  { hex: option, cssVar: '--theme-option', description: 'Option' },
]

const tenantThemes: TenantTheme[] = [
  { name: 'Sunoco', colors: mkColors('#262F47', '#F04B34', '#47c2d0', '#F1AF0F', '#c79c02', '#E42A11', '#23A217', '#FF9900', '#74CDD7', '#8dabc4') },
  { name: 'BP', colors: mkColors('#007f00', '#339833', '#b8a600', '#007f00', '#c79c02', '#E42A11', '#23A217', '#FF9900', '#74CDD7', '#8dabc4') },
  { name: 'Murphy', colors: mkColors('#235BA8', '#2B2F35', '#DE241B', '#263476', '#c79c02', '#f22939', '#64d28d', '#f26e29', '#cce5ff', '#8dabc4') },
  { name: 'P66', colors: mkColors('#101921', '#4BADE9', '#DA291C', '#725ac1', '#8ad7cb', '#E42A11', '#64D28D', '#FF9900', '#74CDD7', '#8dabc4') },
  { name: 'Growmark', colors: mkColors('#000000', '#D50032', '#1677FF', '#666666', '#c79c02', '#E42A11', '#23A217', '#FF9900', '#74CDD7', '#8dabc4') },
  { name: 'DKB', colors: mkColors('#00326d', '#00c6ab', '#a30029', '#725ac1', '#8ad7cb', '#f22939', '#64d28d', '#f26e29', '#cce5ff', '#8dabc4') },
  { name: 'FHR', colors: mkColors('#2B2F35', '#BCB694', '#C9964A', '#725ac1', '#c79c02', '#f22939', '#64d28d', '#f26e29', '#cce5ff', '#8dabc4') },
  { name: 'Motiva', colors: mkColors('#0F1121', '#4BADE9', '#466185', '#F1AF0F', '#c79c02', '#E42A11', '#64D28D', '#FF9900', '#74CDD7', '#8dabc4') },
  { name: 'Dark', colors: mkColors('#102643', '#76abf3', '#bf2a45', '#725ac1', '#c79c02', '#f22939', '#64d28d', '#f26e29', '#cce5ff', '#8dabc4') },
  { name: 'Christmas', colors: mkColors('#0b601c', '#cc2223', '#6e040e', '#926e3c', '#c79c02', '#ff0d05', '#00ca28', '#d7ba5c', '#cce5ff', '#8dabc4') },
  { name: 'Thanksgiving', colors: mkColors('#996236', '#ed732e', '#f8b12c', '#859d3c', '#c79c02', '#9d221e', '#859d3c', '#f8b12c', '#cce5ff', '#8dabc4') },
]

export function ColorsShowcase() {
  return (
    <ShowcaseShell title="Colors" subtitle="Theme color palette — click any value to copy" accentColor="#0C5A58" gridMode="wide">
      <SectionDivider title="Pricing Engine (PE Light)" />
      <ColorSection colors={peColors} />

      <SectionDivider title="Online Selling Platform (OSP)" />
      <ColorSection colors={ospColors} />

      <SectionDivider title="PE vs OSP Comparison" />
      <div className={styles['comparison-grid']}>
        <div className={styles['comparison-column']}>
          <div className={styles['comparison-header']}>Pricing Engine</div>
          {comparisonRoles.map((r) => (
            <div key={r.role + '-pe'} className={styles['color-row']}>
              <div className={styles['color-swatch']} style={{ backgroundColor: r.pe.hex }} />
              <div className={styles['color-info']}>
                <div className={styles['color-var-name']}>{r.role}</div>
                <div className={styles['color-desc']}>{r.pe.description}</div>
              </div>
              <CopyableText text={r.pe.hex} />
            </div>
          ))}
        </div>
        <div className={styles['comparison-column']}>
          <div className={styles['comparison-header']}>Online Selling Platform</div>
          {comparisonRoles.map((r) => (
            <div key={r.role + '-osp'} className={styles['color-row']}>
              <div className={styles['color-swatch']} style={{ backgroundColor: r.osp.hex }} />
              <div className={styles['color-info']}>
                <div className={styles['color-var-name']}>{r.role}</div>
                <div className={styles['color-desc']}>{r.osp.description}</div>
              </div>
              <CopyableText text={r.osp.hex} />
            </div>
          ))}
        </div>
      </div>

      <SectionDivider title="Action Colors" />
      <ColorSection colors={actionColors} />

      <SectionDivider title="Status & Feedback" />
      <ColorSection colors={statusColors} />

      <SectionDivider title="Tenant Themes" />
      {tenantThemes.map((t) => (
        <TenantSection key={t.name} theme={t} />
      ))}
    </ShowcaseShell>
  )
}
