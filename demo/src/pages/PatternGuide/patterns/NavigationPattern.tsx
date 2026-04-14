import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'

const SECTIONS = [
  { id: 'parent-child', title: 'Parent-Child Navigation' },
  { id: 'back-button', title: 'Back Button Pattern' },
  { id: 'breadcrumbs', title: 'Breadcrumbs' },
  { id: 'list-to-detail', title: 'List to Detail' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

export function NavigationPattern() {
  return (
    <PatternShell
      title="Parent-Child Navigation"
      subtitle="Consistent patterns for navigating between list and detail views, back buttons, and breadcrumb trails."
      accentColor="#eb2f96"
      sections={SECTIONS}
    >
      <PatternSection id="parent-child" title="Parent-Child Navigation" description="When a row click or link navigates to a detail page, the child page always provides a way back.">
        <PatternExample
          label="Navigation Flow"
          caption="List page → row click → detail page with back button in header. Use React Router for navigation."
        >
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'stretch' }}>
            <div style={{ flex: 1, border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 16px', background: '#f0f0f0', borderBottom: '1px solid #e8e8e8' }}>
                <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11 }}>List Page</Texto>
              </div>
              <div style={{ padding: 16 }}>
                <Vertical gap={8}>
                  <Texto category="h5" weight="600">Contracts</Texto>
                  <div style={{ padding: '8px 12px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 6, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Texto category="p2">CTR-2024-001</Texto>
                    <RightOutlined style={{ fontSize: 10, color: '#1890ff' }} />
                  </div>
                  <div style={{ padding: '8px 12px', background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 6 }}>
                    <Texto category="p2" appearance="medium">CTR-2024-002</Texto>
                  </div>
                  <div style={{ padding: '8px 12px', background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 6 }}>
                    <Texto category="p2" appearance="medium">CTR-2024-003</Texto>
                  </div>
                </Vertical>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: '#1890ff', fontSize: 20 }}>&#8594;</div>

            <div style={{ flex: 1, border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 16px', background: '#f0f0f0', borderBottom: '1px solid #e8e8e8' }}>
                <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11 }}>Detail Page</Texto>
              </div>
              <div style={{ padding: 16 }}>
                <Vertical gap={12}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LeftOutlined style={{ fontSize: 12, color: '#1890ff', cursor: 'pointer' }} />
                    <Texto category="h5" weight="600">CTR-2024-001</Texto>
                  </div>
                  <div style={{ padding: 12, background: '#fafafa', borderRadius: 6 }}>
                    <Texto category="p2" appearance="medium">Contract details, tabs, actions...</Texto>
                  </div>
                </Vertical>
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="back-button" title="Back Button Pattern" description="Icon button (LeftOutlined) to the left of the page title, gap 8px.">
        <PatternExample
          label="Standard Back Button"
          caption="GraviButton with type='text', LeftOutlined icon. Placed in the page header, left of the title."
          code={`<Horizontal alignItems="center" gap={8}>
  <GraviButton type="text" icon={<LeftOutlined />} onClick={() => navigate(-1)} />
  <Texto category="h3" weight="600">Contract Details</Texto>
</Horizontal>`}
        >
          <div style={{ padding: '12px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraviButton type="text" icon={<LeftOutlined />} />
            <Texto category="h3" weight="600">Contract Details</Texto>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="breadcrumbs" title="Breadcrumbs" description="Only for 3+ level nesting. Use Ant Design Breadcrumb. For 2 levels, the back button is sufficient.">
        <PatternExample
          label="When to Use Breadcrumbs"
          caption="3+ levels deep: Contracts > CTR-2024-001 > Measurements. For 2 levels, just use the back button."
        >
          <div style={{ padding: '8px 24px', background: '#fafafa', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
            <span style={{ color: '#1890ff', cursor: 'pointer' }}>Contracts</span>
            <span style={{ margin: '0 8px', color: '#d9d9d9' }}>/</span>
            <span style={{ color: '#1890ff', cursor: 'pointer' }}>CTR-2024-001</span>
            <span style={{ margin: '0 8px', color: '#d9d9d9' }}>/</span>
            <span style={{ color: '#262626' }}>Measurements</span>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="list-to-detail" title="List to Detail" description="Standard pattern for grid/list rows that navigate to a detail page.">
        <PatternExample
          label="Row Navigation"
          caption="Clickable row with visual affordance (hover state, right arrow). Click navigates to /entity/:id route."
          code={`// In columnDefs, use a link renderer:
cellRenderer: (params) => (
  <a onClick={() => navigate(\`/contracts/\${params.data.id}\`)}>
    {params.value}
  </a>
)`}
        >
          <Vertical gap={4}>
            <div style={{ padding: '10px 16px', border: '1px solid #e8e8e8', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff' }}>
              <div style={{ display: 'flex', gap: 24 }}>
                <Texto category="p2" style={{ color: '#1890ff', textDecoration: 'underline' }}>CTR-2024-001</Texto>
                <Texto category="p2" appearance="medium">Annual Supply</Texto>
                <Texto category="p2" appearance="medium">Active</Texto>
              </div>
              <RightOutlined style={{ fontSize: 10, color: '#d9d9d9' }} />
            </div>
            <div style={{ padding: '10px 16px', border: '1px solid #e8e8e8', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
              <div style={{ display: 'flex', gap: 24 }}>
                <Texto category="p2" appearance="medium">CTR-2024-002</Texto>
                <Texto category="p2" appearance="medium">Spot Purchase</Texto>
                <Texto category="p2" appearance="medium">Draft</Texto>
              </div>
              <RightOutlined style={{ fontSize: 10, color: '#d9d9d9' }} />
            </div>
          </Vertical>
        </PatternExample>
      </PatternSection>

      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <div style={{ padding: '12px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 8 }}>
              <LeftOutlined style={{ fontSize: 12, color: '#1890ff', cursor: 'pointer' }} />
              <Texto category="h3" weight="600">Details</Texto>
            </div>
          }
          dontExample={
            <div style={{ padding: '12px 24px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ padding: '4px 12px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <LeftOutlined style={{ fontSize: 14 }} />
                  <span style={{ fontSize: 14 }}>Back to Offers</span>
                </div>
              </div>
            </div>
          }
          doCaption="Standard pattern: icon button (LeftOutlined) + title (h3 weight 600), gap 8px, in page header with border-bottom."
          dontCaption="Custom back button with embedded text, no border-bottom, arbitrary gap (10px), inconsistent font treatment."
        />
      </PatternSection>
    </PatternShell>
  )
}
