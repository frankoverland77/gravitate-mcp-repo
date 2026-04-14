import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'
import { TokenTable } from '../components/TokenTable'

const SECTIONS = [
  { id: 'size-tiers', title: 'Size Tiers' },
  { id: 'anatomy', title: 'Drawer Anatomy' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

const SIZE_TOKENS = [
  { token: 'narrow', value: '400px', cssVar: '--drawer-narrow', usage: 'Settings, configuration panels, simple option lists' },
  { token: 'standard', value: '520px', cssVar: '--drawer-standard', usage: 'Edit forms, detail panels, single-entity views' },
  { token: 'wide', value: '50vw', cssVar: '--drawer-wide', usage: 'Data-heavy content: grids alongside forms, split layouts' },
]

export function RightDrawersPattern() {
  return (
    <PatternShell
      title="Right Drawers"
      subtitle="Three width tiers cover every right-drawer use case. Pick the tier that fits the content density, then use the standard anatomy for title, body, and footer."
      accentColor="#722ed1"
      sections={SECTIONS}
    >
      <PatternSection
        id="size-tiers"
        title="Size Tiers"
        description="Every right drawer in the app uses one of three widths. No ad-hoc pixel values."
      >
        <TokenTable tokens={SIZE_TOKENS} />
      </PatternSection>

      <PatternSection
        id="anatomy"
        title="Drawer Anatomy"
        description="Every drawer has three zones: a title bar (via the Drawer title prop), a scrollable body, and a sticky footer. Closable is always true."
      >
        <PatternExample
          label="Standard Drawer Wireframe"
          caption="Title bar uses the Drawer title prop (not a custom header). Body has 24px padding. Footer buttons are right-aligned with 8px gap."
        >
          <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
            <div style={{
              width: 360,
              border: '2px solid #d9d9d9',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              {/* Title bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                borderBottom: '1px solid #e8e8e8',
                background: '#fafafa',
              }}>
                <Texto category="p1" weight="600">Drawer Title</Texto>
                <span style={{ fontSize: 16, color: '#8c8c8c', cursor: 'default' }}>&#10005;</span>
              </div>

              {/* Annotation: title bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 24px',
                background: '#f9f0ff',
                borderBottom: '1px dashed #d3adf7',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#722ed1' }} />
                <Texto category="p2" appearance="medium">Title bar — use Drawer title prop</Texto>
              </div>

              {/* Body */}
              <div style={{ padding: 24, minHeight: 140, background: '#fff' }}>
                <Vertical gap={16}>
                  <div style={{ height: 14, width: '80%', background: '#f0f0f0', borderRadius: 4 }} />
                  <div style={{ height: 32, background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 6 }} />
                  <div style={{ height: 14, width: '60%', background: '#f0f0f0', borderRadius: 4 }} />
                  <div style={{ height: 32, background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 6 }} />
                  <div style={{ height: 14, width: '70%', background: '#f0f0f0', borderRadius: 4 }} />
                  <div style={{ height: 32, background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 6 }} />
                </Vertical>
              </div>

              {/* Annotation: body */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 24px',
                background: '#f9f0ff',
                borderBottom: '1px dashed #d3adf7',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#722ed1' }} />
                <Texto category="p2" appearance="medium">Body — 24px padding, scrollable</Texto>
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                padding: '12px 24px',
                borderTop: '1px solid #e8e8e8',
                background: '#fafafa',
              }}>
                <div style={{
                  padding: '4px 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#595959',
                  background: '#fff',
                }}>
                  Cancel
                </div>
                <div style={{
                  padding: '4px 16px',
                  border: '1px solid #1890ff',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#fff',
                  background: '#1890ff',
                }}>
                  Save
                </div>
              </div>

              {/* Annotation: footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 24px',
                background: '#f9f0ff',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#722ed1' }} />
                <Texto category="p2" appearance="medium">Footer — buttons right-aligned, gap 8px</Texto>
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
              <div>{'<Drawer'}</div>
              <div>{'  title="Edit Customer"'}</div>
              <div>{'  closable'}</div>
              <div>{'  width={520}'}</div>
              <div>{'>'}</div>
            </div>
          }
          dontExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
              <div>{'<Drawer closable={false} width={520}>'}</div>
              <div style={{ color: '#ff4d4f' }}>{'  <div className="custom-header">'}</div>
              <div style={{ color: '#ff4d4f' }}>{'    <h3>Edit Customer</h3>'}</div>
              <div style={{ color: '#ff4d4f' }}>{'    <CloseOutlined onClick={onClose} />'}</div>
              <div style={{ color: '#ff4d4f' }}>{'  </div>'}</div>
            </div>
          }
          doCaption="Use the Drawer title prop for the header. It renders the standard title bar and close button automatically."
          dontCaption="A custom header component duplicates built-in behavior, introduces inconsistency, and requires manual close wiring."
        />

        <DosDonts
          doExample={
            <Vertical gap={8}>
              <Texto category="p2" weight="600">Consistent widths across the app:</Texto>
              <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
                <div>{'Settings drawer:  width={400}'}</div>
                <div>{'Edit form drawer: width={520}'}</div>
                <div>{'Data grid drawer: width="50vw"'}</div>
              </div>
            </Vertical>
          }
          dontExample={
            <Vertical gap={8}>
              <Texto category="p2" weight="600">Arbitrary widths per feature:</Texto>
              <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#262626' }}>
                <div style={{ color: '#ff4d4f' }}>{'Settings A: width={400}'}</div>
                <div style={{ color: '#ff4d4f' }}>{'Settings B: width={420}'}</div>
                <div style={{ color: '#ff4d4f' }}>{'Edit form:  width={450}'}</div>
                <div style={{ color: '#ff4d4f' }}>{'Detail:     width={500}'}</div>
                <div style={{ color: '#ff4d4f' }}>{'Other form: width={520}'}</div>
              </div>
            </Vertical>
          }
          doCaption="Three tiers (400 / 520 / 50vw) keep drawers predictable. Users build spatial memory when the same width signals the same content density."
          dontCaption="Five different widths across five features. Each feels slightly off from the last. Users can't predict how much screen space a drawer will claim."
        />
      </PatternSection>
    </PatternShell>
  )
}
