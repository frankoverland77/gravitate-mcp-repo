import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'

const SECTIONS = [
  { id: 'vs-drawer', title: 'Panel vs Drawer' },
  { id: 'inline-panel', title: 'Inline Panel' },
  { id: 'split-panel', title: 'Split Panel' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

export function PanelsPattern() {
  return (
    <PatternShell
      title="Panels"
      subtitle="Panels differ from drawers: the main content stays active and interactive. No shim overlay. The panel slides in beside the content, pushing or overlaying without blocking."
      accentColor="#fa8c16"
      sections={SECTIONS}
    >
      <PatternSection id="vs-drawer" title="Panel vs Drawer" description="The key distinction: a drawer deactivates the content behind it (shim overlay). A panel keeps it active.">
        <PatternExample label="When to Use Each">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 'var(--space-4)' }}>
              <Texto category="h5" weight="600" style={{ color: '#fa8c16' }}>Panel</Texto>
              <Vertical gap={8} style={{ marginTop: 'var(--space-2)' }}>
                <BulletItem text="Content area stays interactive" />
                <BulletItem text="User can click/scroll main content while panel is open" />
                <BulletItem text="Used for: settings sidebars, detail previews, filter panels" />
                <BulletItem text="No shim/overlay" />
              </Vertical>
            </div>
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 'var(--space-4)' }}>
              <Texto category="h5" weight="600" style={{ color: '#1890ff' }}>Drawer</Texto>
              <Vertical gap={8} style={{ marginTop: 'var(--space-2)' }}>
                <BulletItem text="Content behind is deactivated" />
                <BulletItem text="Shim overlay blocks interaction" />
                <BulletItem text="Used for: creation forms, multi-step workflows, formula editors" />
                <BulletItem text="Requires explicit close action" />
              </Vertical>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="inline-panel" title="Inline Panel" description="The panel pushes content aside. Main area shrinks to accommodate. Content remains fully interactive.">
        <PatternExample
          label="Inline Panel — Right Side"
          caption="Main content shrinks via flex. Panel appears with border-left, own scroll. Width: 320-400px depending on content."
        >
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', height: 240 }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flex: 1, padding: 'var(--space-5)', background: '#fff', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Texto category="h5" weight="600">Main Content</Texto>
                <div style={{ flex: 1, background: '#fafafa', borderRadius: 6, padding: 'var(--space-3)', border: '1px dashed #d9d9d9' }}>
                  <Texto category="p2" appearance="medium">Interactive content area — clickable, scrollable, fully active</Texto>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <ActionChip label="Edit" />
                  <ActionChip label="Filter" active />
                  <ActionChip label="Export" />
                </div>
              </div>
              <div style={{ width: 280, borderLeft: '1px solid #e8e8e8', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Texto category="p2" weight="600">Filters</Texto>
                  <span style={{ cursor: 'pointer', color: '#8c8c8c', fontSize: 14 }}>&#10005;</span>
                </div>
                <div style={{ padding: 'var(--space-4)', flex: 1 }}>
                  <Vertical gap={12}>
                    <FilterField label="Status" />
                    <FilterField label="Date Range" />
                    <FilterField label="Category" />
                  </Vertical>
                </div>
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="split-panel" title="Split Panel" description="A persistent two-pane layout. Left pane: list/navigation. Right pane: detail/content. Both interactive.">
        <PatternExample
          label="Split Panel — List + Detail"
          caption="Left: fixed-width list (280-320px). Right: flex-1 detail. Border between. Both fully scrollable."
        >
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', height: 260 }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ width: 240, borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid #e8e8e8', background: '#fafafa' }}>
                  <Texto category="p2" weight="600">Profiles</Texto>
                </div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <ListItem label="Default Profile" active />
                  <ListItem label="Conservative" />
                  <ListItem label="Aggressive" />
                  <ListItem label="Custom A" />
                </div>
              </div>
              <div style={{ flex: 1, padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Texto category="h5" weight="600">Default Profile</Texto>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <DetailField label="Threshold" value="5%" />
                  <DetailField label="Direction" value="Both" />
                  <DetailField label="Override" value="Manual" />
                  <DetailField label="Status" value="Active" />
                </div>
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <div style={{ display: 'flex', height: 120, border: '1px solid #e8e8e8', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ flex: 1, padding: 12, background: '#fff' }}>
                <Texto category="p2" appearance="medium">Main content (active)</Texto>
              </div>
              <div style={{ width: 180, borderLeft: '1px solid #e8e8e8', padding: 12, background: '#fafafa' }}>
                <Texto category="p2" weight="500">Panel</Texto>
              </div>
            </div>
          }
          dontExample={
            <div style={{ position: 'relative', height: 120, border: '1px solid #e8e8e8', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ padding: 12, background: '#fff', height: '100%', opacity: 0.3 }}>
                <Texto category="p2" appearance="medium">Main content (blocked!)</Texto>
              </div>
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 180, padding: 12, background: '#fff', borderLeft: '1px solid #e8e8e8', boxShadow: '-4px 0 12px rgba(0,0,0,0.1)' }}>
                <Texto category="p2" weight="500">Panel</Texto>
              </div>
            </div>
          }
          doCaption="Panel: content stays fully active, no overlay. Panel pushes content or sits beside it."
          dontCaption="Don't use drawer-style overlays for panels. If the content is dimmed/blocked, use a Drawer instead."
        />
      </PatternSection>
    </PatternShell>
  )
}

function BulletItem({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
      <span style={{ color: '#8c8c8c' }}>&#8226;</span>
      <Texto category="p2">{text}</Texto>
    </div>
  )
}

function ActionChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <div style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, border: '1px solid ' + (active ? '#1890ff' : '#d9d9d9'), color: active ? '#1890ff' : '#595959', background: active ? '#e6f7ff' : '#fff', cursor: 'pointer' }}>
      {label}
    </div>
  )
}

function FilterField({ label }: { label: string }) {
  return (
    <div>
      <Texto category="p2" weight="500" style={{ fontSize: 14, marginBottom: 4 }}>{label}</Texto>
      <div style={{ height: 28, background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4 }} />
    </div>
  )
}

function ListItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', background: active ? '#e6f7ff' : 'transparent', cursor: 'pointer', borderLeft: active ? '3px solid #1890ff' : '3px solid transparent' }}>
      <Texto category="p2" weight={active ? '600' : '400'}>{label}</Texto>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Texto category="p2" weight="500" style={{ fontSize: 14 }}>{label}</Texto>
      <Texto category="p2" style={{ marginTop: 2 }}>{value}</Texto>
    </div>
  )
}
