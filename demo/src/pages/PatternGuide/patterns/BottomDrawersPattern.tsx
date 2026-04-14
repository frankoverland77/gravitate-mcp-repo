import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'
import { TokenTable } from '../components/TokenTable'

const SECTIONS = [
  { id: 'size-tiers', title: 'Size Tiers' },
  { id: 'drawer-anatomy', title: 'Drawer Anatomy' },
  { id: 'header-pattern', title: 'Header Pattern' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

const SIZE_TOKENS = [
  { token: 'compact', value: '50vh', cssVar: '--drawer-height-compact', usage: 'Simple editors: single form, confirmation, quick-edit panels' },
  { token: 'standard', value: '70vh', cssVar: '--drawer-height-standard', usage: 'Scenario / formula editors: multi-field forms, tabbed content' },
  { token: 'full', value: '85vh', cssVar: '--drawer-height-full', usage: 'Complex multi-panel: split views, grids + detail, profile managers' },
]

export function BottomDrawersPattern() {
  return (
    <PatternShell
      title="Bottom Drawers"
      subtitle="Bottom drawers slide up from the page footer. Three height tiers cover every use case. Always use viewport-height units, always use a custom header bar, and always make the footer sticky."
      accentColor="#722ed1"
      sections={SECTIONS}
    >
      <PatternSection
        id="size-tiers"
        title="Size Tiers"
        description="Pick the tier that matches content complexity. Never invent a new height — one of these three will fit."
      >
        <TokenTable tokens={SIZE_TOKENS} />

        <PatternExample
          label="Tier Selection Guide"
          caption="Choose the smallest tier that fits the content without scrolling the primary action area. Upgrade to the next tier only when the content genuinely needs it."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <TierCard
              tier="compact"
              height="50vh"
              color="#d3adf7"
              examples={['Quick-edit field', 'Confirmation dialog', 'Single form section']}
            />
            <TierCard
              tier="standard"
              height="70vh"
              color="#b37feb"
              examples={['Scenario editor', 'Formula builder', 'Tabbed settings panel']}
            />
            <TierCard
              tier="full"
              height="85vh"
              color="#722ed1"
              examples={['Quote exception drawer', 'Profile manager + preview', 'Grid + detail split']}
            />
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection
        id="drawer-anatomy"
        title="Drawer Anatomy"
        description="Every bottom drawer follows the same three-zone structure: custom header, scrollable body, and sticky footer."
      >
        <PatternExample
          label="Anatomy Diagram"
          caption="Header: padding 12px 24px, title left, close button right. Body: padding 0, flex column, overflow-y auto. Footer: sticky to bottom, padding 12px 24px, buttons right-aligned with 8px gap. Always use vh units for drawer height."
          code={`<Drawer
  placement="bottom"
  height="70vh"
  title={null}
  closable={false}
  styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
>
  {/* Custom header bar */}
  <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
    <Texto category="h5">Drawer Title</Texto>
    <CloseOutlined onClick={onClose} style={{ cursor: 'pointer' }} />
  </div>

  {/* Scrollable body */}
  <div style={{ flex: 1, overflowY: 'auto' }}>
    {children}
  </div>

  {/* Sticky footer */}
  <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
    <GraviButton onClick={onClose}>Cancel</GraviButton>
    <GraviButton primary onClick={onSave}>Save</GraviButton>
  </div>
</Drawer>`}
        >
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
            {/* Simulated drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', height: 280 }}>
              {/* Header zone */}
              <div style={{
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f0f0f0',
                background: '#fafafa',
              }}>
                <Texto category="p1" weight="600">Drawer Title</Texto>
                <span style={{ color: '#8c8c8c', cursor: 'pointer', fontSize: 14 }}>&#10005;</span>
              </div>

              {/* Body zone */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf', fontSize: 13 }}>
                <Vertical gap={4} alignItems="center">
                  <span style={{ fontSize: 24 }}>&#9744;</span>
                  <span>Scrollable body content</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#d9d9d9' }}>padding: 0 / flex: 1 / overflow-y: auto</span>
                </Vertical>
              </div>

              {/* Footer zone */}
              <div style={{
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                borderTop: '1px solid #f0f0f0',
                background: '#fafafa',
              }}>
                <div style={{ padding: '4px 16px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13, color: '#595959' }}>Cancel</div>
                <div style={{ padding: '4px 16px', background: '#1890ff', borderRadius: 6, fontSize: 13, color: '#fff' }}>Save</div>
              </div>
            </div>

            {/* Annotation labels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #e8e8e8' }}>
              <AnatomyLabel zone="Header" spec="padding: 12px 24px" color="#722ed1" />
              <AnatomyLabel zone="Body" spec="padding: 0, flex column" color="#722ed1" />
              <AnatomyLabel zone="Footer" spec="padding: 12px 24px, sticky" color="#722ed1" />
            </div>
          </div>
        </PatternExample>

        <PatternExample
          label="Key Props"
          caption="These four props disable the default antd Drawer chrome so you can provide a consistent custom header."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PropCard prop="title={null}" reason="Removes the default header title entirely" />
            <PropCard prop="closable={false}" reason="Removes the default close icon from the header" />
            <PropCard prop='height="70vh"' reason="Viewport-relative height, consistent across screen sizes" />
            <PropCard prop="styles={{ body: { padding: 0 } }}" reason="Resets body padding so content controls its own spacing" />
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection
        id="header-pattern"
        title="Header Pattern"
        description="The custom header bar replaces antd's default title/close. Title on the left, close button on the right, consistent padding."
      >
        <PatternExample
          label="Custom Header Wireframe"
          caption="12px vertical padding, 24px horizontal padding. Title is a Texto h5 on the left. Close button (CloseOutlined) is on the right. A 1px bottom border separates the header from the body."
        >
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
            {/* Header wireframe with annotations */}
            <div style={{ position: 'relative' }}>
              {/* Padding guide - top */}
              <div style={{ height: 12, background: '#f9f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: '#b37feb', fontFamily: 'monospace' }}>12px</span>
              </div>

              <div style={{ display: 'flex' }}>
                {/* Padding guide - left */}
                <div style={{ width: 24, background: '#f9f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl' }}>
                  <span style={{ fontSize: 9, color: '#b37feb', fontFamily: 'monospace' }}>24px</span>
                </div>

                {/* Header content */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  background: '#fff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 18, background: '#722ed1', borderRadius: 2 }} />
                    <Texto category="p1" weight="600">Drawer Title</Texto>
                  </div>
                  <div style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    border: '1px dashed #d9d9d9',
                    color: '#8c8c8c',
                    fontSize: 12,
                  }}>
                    &#10005;
                  </div>
                </div>

                {/* Padding guide - right */}
                <div style={{ width: 24, background: '#f9f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl' }}>
                  <span style={{ fontSize: 9, color: '#b37feb', fontFamily: 'monospace' }}>24px</span>
                </div>
              </div>

              {/* Padding guide - bottom */}
              <div style={{ height: 12, background: '#f9f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: '#b37feb', fontFamily: 'monospace' }}>12px</span>
              </div>

              {/* Border annotation */}
              <div style={{ height: 1, background: '#722ed1' }} />
              <div style={{ padding: '4px 12px', fontSize: 10, color: '#722ed1', fontFamily: 'monospace', textAlign: 'center' }}>
                1px solid border-bottom separates header from body
              </div>
            </div>
          </div>
        </PatternExample>

        <PatternExample
          label="Header Code"
          caption="This exact structure should be used in every bottom drawer."
          code={`{/* Custom header — replaces antd default */}
<div style={{
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #f0f0f0',
}}>
  <Texto category="h5">Edit Scenario</Texto>
  <CloseOutlined
    onClick={onClose}
    style={{ cursor: 'pointer', fontSize: 14, color: '#8c8c8c' }}
  />
</div>`}
        >
          <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
            <div><span style={{ color: '#8c8c8c' }}>{'<Drawer'}</span></div>
            <div>&nbsp;&nbsp;<span style={{ color: '#722ed1' }}>placement</span>="bottom"</div>
            <div>&nbsp;&nbsp;<span style={{ color: '#722ed1' }}>height</span>="70vh"</div>
            <div>&nbsp;&nbsp;<span style={{ color: '#722ed1' }}>title</span>={'{null}'}</div>
            <div>&nbsp;&nbsp;<span style={{ color: '#722ed1' }}>closable</span>={'{false}'}</div>
            <div><span style={{ color: '#8c8c8c' }}>{'>'}</span></div>
            <div>&nbsp;&nbsp;<span style={{ color: '#52c41a' }}>{'// custom header bar here'}</span></div>
            <div><span style={{ color: '#8c8c8c' }}>{'</Drawer>'}</span></div>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
              <div><span style={{ color: '#722ed1' }}>compact:</span> height="<span style={{ color: '#52c41a' }}>50vh</span>"</div>
              <div><span style={{ color: '#722ed1' }}>standard:</span> height="<span style={{ color: '#52c41a' }}>70vh</span>"</div>
              <div><span style={{ color: '#722ed1' }}>full:</span> height="<span style={{ color: '#52c41a' }}>85vh</span>"</div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#8c8c8c' }}>Consistent viewport-height units across all drawers.</div>
            </div>
          }
          dontExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
              <div>height="<span style={{ color: '#ff4d4f' }}>70%</span>"</div>
              <div>height="<span style={{ color: '#ff4d4f' }}>80vh</span>"</div>
              <div>height="<span style={{ color: '#ff4d4f' }}>720px</span>"</div>
              <div>height="<span style={{ color: '#ff4d4f' }}>820px</span>"</div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#8c8c8c' }}>Mixing units. Arbitrary values outside the tier system.</div>
            </div>
          }
          doCaption="Use the three standard vh tiers. Consistent units make drawers predictable across every screen size."
          dontCaption="Mixing percentage, vh, and px heights produces inconsistent drawer sizes. 80vh and 720px aren't in the tier system."
        />

        <DosDonts
          doExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
              <div>{'title={null}'}</div>
              <div>{'closable={false}'}</div>
              <div style={{ marginTop: 4, color: '#52c41a' }}>{'// custom header bar with:'}</div>
              <div>&nbsp;&nbsp;{'<Texto category="h5">Title</Texto>'}</div>
              <div>&nbsp;&nbsp;{'<CloseOutlined onClick={onClose} />'}</div>
            </div>
          }
          dontExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
              <div>{'title="Edit Scenario"'}</div>
              <div style={{ marginTop: 4, color: '#8c8c8c' }}>{'// another drawer:'}</div>
              <div>{'title={<span>Custom Title</span>}'}</div>
              <div>{'closable={true}'}</div>
              <div style={{ marginTop: 4, color: '#8c8c8c' }}>{'// yet another:'}</div>
              <div>{'title={null}'}</div>
              <div>{'extra={<CloseOutlined />}'}</div>
            </div>
          }
          doCaption="Always null out the default title and close, then add a custom header bar. Every drawer looks identical."
          dontCaption="Mixing antd's default title prop with custom titles and inconsistent close button placement. Each drawer looks different."
        />
      </PatternSection>
    </PatternShell>
  )
}

function TierCard({ tier, height, color, examples }: { tier: string; height: string; color: string; examples: string[] }) {
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px', background: color, color: '#fff', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between' }}>
        <span>{tier}</span>
        <span style={{ fontFamily: 'monospace' }}>{height}</span>
      </div>
      <div style={{ padding: 12 }}>
        {examples.map((ex, i) => (
          <div key={i} style={{ fontSize: 12, color: '#595959', padding: '3px 0' }}>
            {ex}
          </div>
        ))}
      </div>
    </div>
  )
}

function AnatomyLabel({ zone, spec, color }: { zone: string; spec: string; color: string }) {
  return (
    <div style={{ padding: '8px 12px', textAlign: 'center', borderRight: '1px solid #f0f0f0' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color }}>{zone}</div>
      <div style={{ fontSize: 10, color: '#8c8c8c', fontFamily: 'monospace', marginTop: 2 }}>{spec}</div>
    </div>
  )
}

function PropCard({ prop, reason }: { prop: string; reason: string }) {
  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 12 }}>
      <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#722ed1' }}>{prop}</code>
      <div style={{ marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>{reason}</div>
    </div>
  )
}
