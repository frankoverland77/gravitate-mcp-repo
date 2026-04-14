import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'

const SECTIONS = [
  { id: 'full-width', title: 'Full-Width Layout' },
  { id: 'sidebar-main', title: 'Sidebar + Main' },
  { id: 'grid-first', title: 'Grid-First' },
  { id: 'page-header', title: 'Page Header Standard' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

/* ── shared wireframe styles ── */

const wireframeContainer: React.CSSProperties = {
  border: '2px solid #d9d9d9',
  borderRadius: 8,
  overflow: 'hidden',
  height: 320,
  display: 'flex',
  flexDirection: 'column',
  background: '#fff',
}

const wireframeLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#8c8c8c',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.6px',
}

const wireframeRegion: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...wireframeLabel,
}

/* ── wireframe components ── */

function FullWidthWireframe() {
  return (
    <div style={wireframeContainer}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '2px solid #d9d9d9',
          background: '#fff',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 80, height: 14, borderRadius: 3, background: '#595959' }} />
          <div style={{ width: 40, height: 18, borderRadius: 10, background: '#e6f7ff', border: '1px solid #91d5ff' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 60, height: 24, borderRadius: 4, background: '#f0f0f0', border: '1px solid #d9d9d9' }} />
          <div style={{ width: 60, height: 24, borderRadius: 4, background: '#1890ff' }} />
        </div>
      </div>
      {/* Content area */}
      <div
        style={{
          flex: 1,
          padding: 24,
          background: '#fafafa',
          ...wireframeRegion,
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <span style={wireframeLabel}>Content Area</span>
        <span style={{ ...wireframeLabel, fontWeight: 400, fontSize: 10, color: '#bfbfbf' }}>
          flex: 1 / overflow: auto / padding: 24px
        </span>
      </div>
    </div>
  )
}

function SidebarMainWireframe() {
  return (
    <div style={wireframeContainer}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '2px solid #d9d9d9',
          background: '#fff',
          flexShrink: 0,
        }}
      >
        <div style={{ width: 100, height: 14, borderRadius: 3, background: '#595959' }} />
      </div>
      {/* Body: sidebar + main */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <div
          style={{
            width: 120,
            background: '#f0f0f0',
            borderRight: '2px solid #d9d9d9',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            flexShrink: 0,
          }}
        >
          <span style={{ ...wireframeLabel, marginBottom: 4 }}>Sidebar</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                height: 10,
                borderRadius: 2,
                background: i === 1 ? '#1890ff' : '#d9d9d9',
                width: i === 1 ? '100%' : `${60 + Math.random() * 30}%`,
              }}
            />
          ))}
          <span style={{ ...wireframeLabel, fontWeight: 400, fontSize: 9, color: '#bfbfbf', marginTop: 'auto' }}>
            240-280px fixed
          </span>
        </div>
        {/* Main content */}
        <div
          style={{
            flex: 1,
            padding: 24,
            background: '#fafafa',
            ...wireframeRegion,
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <span style={wireframeLabel}>Main Content</span>
          <span style={{ ...wireframeLabel, fontWeight: 400, fontSize: 10, color: '#bfbfbf' }}>
            flex: 1 / padding: 24px
          </span>
        </div>
      </div>
    </div>
  )
}

function GridFirstWireframe() {
  return (
    <div style={wireframeContainer}>
      {/* Control bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '2px solid #d9d9d9',
          background: '#fff',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 80, height: 24, borderRadius: 4, background: '#f0f0f0', border: '1px solid #d9d9d9' }} />
          <div style={{ width: 80, height: 24, borderRadius: 4, background: '#f0f0f0', border: '1px solid #d9d9d9' }} />
          <div style={{ width: 24, height: 24, borderRadius: 4, background: '#f0f0f0', border: '1px solid #d9d9d9' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 60, height: 24, borderRadius: 4, background: '#f0f0f0', border: '1px solid #d9d9d9' }} />
          <div style={{ width: 60, height: 24, borderRadius: 4, background: '#1890ff' }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 16px', borderBottom: '2px solid #d9d9d9', gap: 6, background: '#fff', flexShrink: 0 }}>
        <span style={{ ...wireframeLabel, fontSize: 9, color: '#bfbfbf' }}>Filters + Actions</span>
      </div>
      {/* Grid area */}
      <div style={{ flex: 1, background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
        {/* Grid header */}
        <div
          style={{
            display: 'flex',
            padding: '8px 16px',
            borderBottom: '1px solid #d9d9d9',
            background: '#f5f5f5',
            gap: 8,
          }}
        >
          {['Name', 'Status', 'Value', 'Date', 'Actions'].map((col) => (
            <div key={col} style={{ flex: col === 'Name' ? 2 : 1 }}>
              <span style={{ ...wireframeLabel, fontSize: 9 }}>{col}</span>
            </div>
          ))}
        </div>
        {/* Grid rows */}
        {[1, 2, 3, 4, 5, 6].map((row) => (
          <div
            key={row}
            style={{
              display: 'flex',
              padding: '6px 16px',
              borderBottom: '1px solid #f0f0f0',
              gap: 8,
            }}
          >
            {[2, 1, 1, 1, 1].map((flex, ci) => (
              <div key={ci} style={{ flex }}>
                <div style={{ height: 8, borderRadius: 2, background: '#e8e8e8', width: `${50 + Math.random() * 40}%` }} />
              </div>
            ))}
          </div>
        ))}
        <div style={{ ...wireframeRegion, flex: 1, minHeight: 30 }}>
          <span style={{ ...wireframeLabel, fontWeight: 400, fontSize: 10, color: '#bfbfbf' }}>
            Grid: flex 1
          </span>
        </div>
      </div>
    </div>
  )
}

export function PageLayoutsPattern() {
  return (
    <PatternShell
      title="Page Layouts"
      subtitle="Three layout archetypes cover every page in the application. Each starts from a consistent page header and fills the remaining viewport height."
      accentColor="#722ed1"
      sections={SECTIONS}
    >
      {/* ── Full-Width Layout ── */}
      <PatternSection
        id="full-width"
        title="Full-Width Layout"
        description="The most common layout. A page header with title, badges, and action buttons sits above a scrollable content area that fills the remaining height."
      >
        <PatternExample
          label="Full-Width Wireframe"
          caption="Header uses border-bottom to separate from content. Content area is flex: 1 with overflow: auto and 24px padding. This is the default for dashboards, detail pages, and form pages."
        >
          <FullWidthWireframe />
        </PatternExample>

        <div style={{ marginTop: 16, fontFamily: "'SF Mono', monospace", fontSize: 12, lineHeight: 1.8, color: '#595959', padding: '12px 16px', background: '#f9f9f9', borderRadius: 6, border: '1px solid #f0f0f0' }}>
          {'<Vertical height="100%">'}<br />
          {'  <PageHeader />          /* border-bottom, flex-shrink: 0 */'}<br />
          {'  <div style={{ flex: 1, overflow: "auto", padding: 24 }}>'}<br />
          {'    {/* content */}'}<br />
          {'  </div>'}<br />
          {'</Vertical>'}
        </div>
      </PatternSection>

      {/* ── Sidebar + Main ── */}
      <PatternSection
        id="sidebar-main"
        title="Sidebar + Main"
        description="Page header spans full width. Below it, a fixed-width sidebar (240-280px) sits beside a flex: 1 main content area. Used for settings, profile management, and navigation-heavy pages."
      >
        <PatternExample
          label="Sidebar + Main Wireframe"
          caption="Sidebar is fixed-width (240-280px) with background #f0f0f0 and a right border. Main content is flex: 1 with 24px padding. The page header spans the full width above both."
        >
          <SidebarMainWireframe />
        </PatternExample>

        <div style={{ marginTop: 16, fontFamily: "'SF Mono', monospace", fontSize: 12, lineHeight: 1.8, color: '#595959', padding: '12px 16px', background: '#f9f9f9', borderRadius: 6, border: '1px solid #f0f0f0' }}>
          {'<Vertical height="100%">'}<br />
          {'  <PageHeader />          /* full width */'}<br />
          {'  <Horizontal flex="1" style={{ overflow: "hidden" }}>'}<br />
          {'    <Sidebar />           /* width: 240-280px, flex-shrink: 0 */'}<br />
          {'    <div style={{ flex: 1, overflow: "auto", padding: 24 }}>'}<br />
          {'      {/* main content */}'}<br />
          {'    </div>'}<br />
          {'  </Horizontal>'}<br />
          {'</Vertical>'}
        </div>
      </PatternSection>

      {/* ── Grid-First ── */}
      <PatternSection
        id="grid-first"
        title="Grid-First"
        description="A control bar with filters and action buttons sits above a data grid that fills the remaining height. No page-level padding since the grid owns its own spacing."
      >
        <PatternExample
          label="Grid-First Wireframe"
          caption="Control bar contains filter dropdowns, search, and action buttons. The grid fills flex: 1 below it. No extra wrapper padding — the grid manages its own cell spacing."
        >
          <GridFirstWireframe />
        </PatternExample>

        <div style={{ marginTop: 16, fontFamily: "'SF Mono', monospace", fontSize: 12, lineHeight: 1.8, color: '#595959', padding: '12px 16px', background: '#f9f9f9', borderRadius: 6, border: '1px solid #f0f0f0' }}>
          {'<Vertical height="100%">'}<br />
          {'  <ControlBar />          /* filters + actions, border-bottom */'}<br />
          {'  <GraviGrid              /* flex: 1 */'}<br />
          {'    agPropOverrides={{...}}'}<br />
          {'  />'}<br />
          {'</Vertical>'}
        </div>
      </PatternSection>

      {/* ── Page Header Standard ── */}
      <PatternSection
        id="page-header"
        title="Page Header Standard"
        description="Consistent header anatomy across every page: title left, actions right, optional back button."
      >
        <PatternExample
          label="Standard Page Header"
          caption="Title: Texto h3 weight 600. Back button: icon button left of title with gap 8px. Action buttons: right-aligned. The header row uses justify-content: space-between."
        >
          <Vertical gap={16}>
            {/* Without back button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #e8e8e8',
                background: '#fff',
                borderRadius: 8,
                border: '1px solid #e8e8e8',
              }}
            >
              <Texto category="h3" weight="600">Page Title</Texto>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ padding: '4px 12px', borderRadius: 4, background: '#f0f0f0', border: '1px solid #d9d9d9', fontSize: 12, color: '#595959' }}>
                  Secondary
                </div>
                <div style={{ padding: '4px 12px', borderRadius: 4, background: '#1890ff', fontSize: 12, color: '#fff' }}>
                  Primary
                </div>
              </div>
            </div>

            {/* With back button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #e8e8e8',
                background: '#fff',
                borderRadius: 8,
                border: '1px solid #e8e8e8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 4,
                    border: '1px solid #d9d9d9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: '#595959',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                >
                  &#8592;
                </div>
                <Texto category="h3" weight="600">Detail Page</Texto>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ padding: '4px 12px', borderRadius: 4, background: '#f0f0f0', border: '1px solid #d9d9d9', fontSize: 12, color: '#595959' }}>
                  Cancel
                </div>
                <div style={{ padding: '4px 12px', borderRadius: 4, background: '#1890ff', fontSize: 12, color: '#fff' }}>
                  Save
                </div>
              </div>
            </div>
          </Vertical>
        </PatternExample>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
          <HeaderSpecCard
            title="Title"
            specs={[
              ['Component', 'Texto h3'],
              ['Weight', '600'],
              ['Position', 'Left-aligned'],
            ]}
          />
          <HeaderSpecCard
            title="Back Button"
            specs={[
              ['Type', 'Icon button'],
              ['Position', 'Left of title'],
              ['Gap', '8px'],
            ]}
          />
          <HeaderSpecCard
            title="Action Buttons"
            specs={[
              ['Position', 'Right-aligned'],
              ['Gap', '8px between buttons'],
              ['Order', 'Secondary, then Primary'],
            ]}
          />
        </div>
      </PatternSection>

      {/* ── Do's & Don'ts ── */}
      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <Vertical gap={12}>
              {/* Consistent headers */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '2px solid #e8e8e8' }}>
                <Texto category="h3" weight="600" style={{ fontSize: 14 }}>Quotes</Texto>
                <div style={{ width: 48, height: 20, borderRadius: 4, background: '#1890ff' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '2px solid #e8e8e8' }}>
                <Texto category="h3" weight="600" style={{ fontSize: 14 }}>Contracts</Texto>
                <div style={{ width: 48, height: 20, borderRadius: 4, background: '#1890ff' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '2px solid #e8e8e8' }}>
                <Texto category="h3" weight="600" style={{ fontSize: 14 }}>Settings</Texto>
                <div style={{ width: 48, height: 20, borderRadius: 4, background: '#1890ff' }} />
              </div>
            </Vertical>
          }
          dontExample={
            <Vertical gap={12}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '2px solid #e8e8e8' }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Quotes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '6px 8px' }}>
                <span style={{ fontSize: 13, fontWeight: 400, color: '#8c8c8c' }}>Contracts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 24px', borderBottom: '3px solid #1890ff' }}>
                <span style={{ fontSize: 16, fontWeight: 500, textTransform: 'uppercase' as const }}>Settings</span>
              </div>
            </Vertical>
          }
          doCaption="Consistent page headers: same Texto h3 weight 600, same padding, same border-bottom treatment across all pages."
          dontCaption="Mixed header styles: different font sizes, inconsistent weights, varying padding, missing or different borders between pages."
        />

        <DosDonts
          doExample={
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
              <div>{'padding: 24px           /* space-5 */'}</div>
              <div>{'padding: 24px           /* space-5 */'}</div>
              <div>{'padding: 24px           /* space-5 */'}</div>
            </div>
          }
          dontExample={
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
              <div>{'padding: 20px'}</div>
              <div>{'padding: 32px 16px'}</div>
              <div>{'padding: 12px 24px 8px'}</div>
            </div>
          }
          doCaption="Standard content padding of 24px (space-5) for all content areas. Every page feels the same."
          dontCaption="Arbitrary padding values on each page. 20px, mixed shorthand, asymmetric padding — content areas feel inconsistent across pages."
        />
      </PatternSection>
    </PatternShell>
  )
}

function HeaderSpecCard({ title, specs }: { title: string; specs: [string, string][] }) {
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px', background: '#f0f0f0', borderBottom: '1px solid #e8e8e8', fontSize: 12, fontWeight: 600, color: '#595959' }}>
        {title}
      </div>
      <div style={{ padding: 12 }}>
        {specs.map(([label, value], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < specs.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            <span style={{ fontSize: 13, color: '#595959' }}>{label}</span>
            <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#722ed1' }}>{value}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
