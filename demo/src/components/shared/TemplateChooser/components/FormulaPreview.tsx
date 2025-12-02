/**
 * Component for displaying formula previews with optional internal/external display names
 */

import { Texto, Vertical } from '@gravitate-js/excalibrr';
import { renderFormulaPreview } from '../utils/formulaPreview';

export interface FormulaPreviewProps {
  /** The preview text to display */
  previewText: string;

  /** Whether to show external name section */
  showExternalName?: boolean;

  /** Compact mode for smaller display */
  compact?: boolean;

  /** Title for the preview section */
  title?: string;
}

/**
 * Renders a formula preview with optional internal/external sections
 */
export function FormulaPreview({
  previewText,
  showExternalName = false,
  compact = false,
  title,
}: FormulaPreviewProps) {
  if (compact) {
    // Compact view (for list view or simple displays)
    return (
      <div className="formula-preview-compact">
        {title && (
          <Texto
            category="label"
            appearance="medium"
            weight={600}
            textTransform="uppercase"
            className="formula-preview-label"
          >
            {title}
          </Texto>
        )}
        <Texto category="p2" className="formula-preview-code">
          {renderFormulaPreview(previewText)}
        </Texto>
      </div>
    );
  }

  // Full view with internal/external names (for card view)
  // Wrapper div with flexShrink: 0 prevents this section from collapsing in flex containers
  return (
    <div style={{ flexShrink: 0 }}>
      {/* Internal Display Name */}
      <Vertical className={showExternalName ? 'formula-preview-section-spacing' : ''}>
        <Texto
          category="label"
          appearance="medium"
          weight={600}
          className="formula-preview-label-small"
        >
          Internal Display Name:
        </Texto>
        <div className="formula-preview-box">
          <Texto category="p2" appearance="hint" className="formula-preview-code-small">
            {renderFormulaPreview(previewText)}
          </Texto>
        </div>
      </Vertical>

      {/* External Display Name */}
      {showExternalName && (
        <Vertical>
          <Texto
            category="label"
            appearance="medium"
            weight={600}
            className="formula-preview-label-small"
          >
            External Display Name:
          </Texto>
          <div className="formula-preview-box">
            <Texto category="p2" appearance="hint" className="formula-preview-code-small">
              {renderFormulaPreview(previewText)}
            </Texto>
          </div>
        </Vertical>
      )}
    </div>
  );
}
