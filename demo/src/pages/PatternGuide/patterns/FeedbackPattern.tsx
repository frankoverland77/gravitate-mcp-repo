import { Vertical, Texto, NothingMessage } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'

const SECTIONS = [
  { id: 'overview', title: 'Feedback Types' },
  { id: 'toast', title: 'Toast Notifications' },
  { id: 'empty-state', title: 'Empty States' },
  { id: 'loading', title: 'Loading States' },
  { id: 'inline-alert', title: 'Inline Alerts' },
  { id: 'confirmation', title: 'Confirmation Dialogs' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

export function FeedbackPattern() {
  return (
    <PatternShell
      title="Feedback & Messaging"
      subtitle="Consistent feedback patterns for every user action. Use the right pattern for the right context — toasts for confirmations, NothingMessage for empty states, LoadingAnimation for fetches."
      accentColor="#13c2c2"
      sections={SECTIONS}
    >
      <PatternSection id="overview" title="Feedback Types" description="Five patterns, each with a specific use case. Don't mix them.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <FeedbackTypeCard
            title="Toast Notification"
            when="After save, delete, or action confirmation"
            component="NotificationMessage(title, msg, isError)"
          />
          <FeedbackTypeCard
            title="Empty State"
            when="Empty grids, empty lists, no search results"
            component='<NothingMessage message="..." />'
          />
          <FeedbackTypeCard
            title="Loading"
            when="Data fetching, async operations"
            component="<LoadingAnimation />"
          />
          <FeedbackTypeCard
            title="Inline Alert"
            when="Form validation context, warnings, info banners"
            component='<Alert type="warning" message="..." />'
          />
        </div>
      </PatternSection>

      <PatternSection id="toast" title="Toast Notifications" description="Use NotificationMessage for transient confirmations. Appears top-right, auto-dismisses.">
        <PatternExample
          label="Toast Usage"
          caption="Call NotificationMessage after successful or failed actions. First arg: title, second: message, third: isError boolean."
          code={`// Success
NotificationMessage('Saved', 'Contract updated successfully', false)

// Error
NotificationMessage('Error', 'Failed to save changes. Please try again.', true)`}
        >
          <Vertical gap={12}>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid #b7eb8f', background: '#f6ffed', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#52c41a', fontSize: 18 }}>&#10003;</span>
              <div>
                <Texto category="p2" weight="600">Saved</Texto>
                <Texto category="p2" appearance="medium">Contract updated successfully</Texto>
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid #ffa39e', background: '#fff2f0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#ff4d4f', fontSize: 18 }}>&#10007;</span>
              <div>
                <Texto category="p2" weight="600">Error</Texto>
                <Texto category="p2" appearance="medium">Failed to save changes. Please try again.</Texto>
              </div>
            </div>
          </Vertical>
        </PatternExample>
      </PatternSection>

      <PatternSection id="empty-state" title="Empty States" description="Always use the NothingMessage component. Never build custom empty state divs.">
        <PatternExample
          label="NothingMessage Component"
          caption="The standard empty state. Centered, with a message. Used for empty grids, empty lists, and no-results states."
          code={`<NothingMessage message="No contracts match your filters" />`}
        >
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
            <NothingMessage title="No Results" message="No contracts match your filters" />
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="loading" title="Loading States" description="Use LoadingAnimation for data fetching. Center it in the content area.">
        <PatternExample
          label="LoadingAnimation Component"
          caption="The standard loading state. Centered spinner with optional text."
        >
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 'var(--space-7)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ width: 32, height: 32, border: '3px solid #f0f0f0', borderTop: '3px solid #1890ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <Texto category="p2" appearance="medium">Loading data...</Texto>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="inline-alert" title="Inline Alerts" description="Use Ant Design Alert for contextual messages that need to persist in the UI — form validation summaries, warnings, info banners.">
        <PatternExample
          label="Alert Types"
          caption="warning: user action needed. error: validation failure. info: contextual guidance. success: operation complete (rare — prefer toast)."
        >
          <Vertical gap={12}>
            <div style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ffe58f', background: '#fffbe6' }}>
              <Texto category="p2" weight="600" style={{ color: '#d48806' }}>Warning</Texto>
              <Texto category="p2" style={{ color: '#d48806' }}>3 rows have values outside the expected range</Texto>
            </div>
            <div style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ffa39e', background: '#fff2f0' }}>
              <Texto category="p2" weight="600" style={{ color: '#cf1322' }}>Validation Error</Texto>
              <Texto category="p2" style={{ color: '#cf1322' }}>Please fix the highlighted fields before submitting</Texto>
            </div>
            <div style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #91d5ff', background: '#e6f7ff' }}>
              <Texto category="p2" weight="600" style={{ color: '#096dd9' }}>Info</Texto>
              <Texto category="p2" style={{ color: '#096dd9' }}>Prices will be recalculated when you save</Texto>
            </div>
          </Vertical>
        </PatternExample>
      </PatternSection>

      <PatternSection id="confirmation" title="Confirmation Dialogs" description="Use a small modal (480px, sm tier) for destructive actions that need explicit user confirmation.">
        <PatternExample
          label="Confirmation Modal"
          caption="Title states the action. Body explains consequences. Buttons: Cancel (default) + Confirm (error for destructive, theme1 for non-destructive)."
        >
          <div style={{ width: 400, margin: '0 auto', borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <Texto category="h5" weight="600">Delete Contract?</Texto>
            </div>
            <div style={{ padding: '16px 24px' }}>
              <Texto category="p2" appearance="medium">This will permanently remove CTR-2024-001 and all associated data. This action cannot be undone.</Texto>
            </div>
            <div style={{ padding: '12px 24px', background: '#fafafa', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <div style={{ padding: '4px 16px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13, cursor: 'pointer', background: '#fff' }}>Cancel</div>
              <div style={{ padding: '4px 16px', border: '1px solid #ff4d4f', borderRadius: 6, fontSize: 13, cursor: 'pointer', background: '#ff4d4f', color: '#fff' }}>Delete</div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
              <NothingMessage title="Empty" message="No items found" />
            </div>
          }
          dontExample={
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>No Data</div>
              <div style={{ marginTop: 8, fontSize: 14 }}>No data available for the selected offer</div>
            </div>
          }
          doCaption="Use the NothingMessage component for all empty states. Consistent styling, centered, reusable."
          dontCaption="Don't build custom empty states with inline styles. Every one looks different and none match."
        />
      </PatternSection>
    </PatternShell>
  )
}

function FeedbackTypeCard({ title, when, component }: { title: string; when: string; component: string }) {
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 'var(--space-4)' }}>
      <Texto category="h5" weight="600">{title}</Texto>
      <Texto category="p2" appearance="medium" style={{ marginTop: 'var(--space-1)' }}>{when}</Texto>
      <code style={{ display: 'block', marginTop: 'var(--space-2)', fontFamily: "'SF Mono', monospace", fontSize: 11, color: '#8c8c8c', background: '#fafafa', padding: '4px 8px', borderRadius: 4 }}>
        {component}
      </code>
    </div>
  )
}
