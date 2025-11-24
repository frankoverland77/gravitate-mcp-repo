/**
 * Component for displaying formula previews with optional internal/external display names
 */

import React from 'react';
import { Texto } from '@gravitate-js/excalibrr';
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
  title
}: FormulaPreviewProps) {
  if (compact) {
    // Compact view (for list view or simple displays)
    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '12px',
        borderRadius: '6px',
        borderLeft: '4px solid #1890ff',
        minHeight: '60px'
      }}>
        {title && (
          <Texto style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: '600',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '6px'
          }}>
            {title}
          </Texto>
        )}
        <Texto style={{
          margin: 0,
          fontSize: '12px',
          color: '#1a1a1a',
          lineHeight: '18px',
          fontFamily: 'monospace'
        }}>
          {renderFormulaPreview(previewText)}
        </Texto>
      </div>
    );
  }

  // Full view with internal/external names (for card view)
  return (
    <>
      {/* Internal Display Name */}
      <div style={{ marginBottom: showExternalName ? '6px' : '0', flexShrink: 0 }}>
        <Texto style={{
          margin: 0,
          fontSize: '9px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '3px'
        }}>
          Internal Display Name:
        </Texto>
        <div style={{
          padding: '4px 6px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          minHeight: '24px',
          maxHeight: '40px',
          overflowY: 'auto'
        }}>
          <Texto style={{
            margin: 0,
            fontSize: '9px',
            color: '#595959',
            lineHeight: '12px',
            fontFamily: 'monospace'
          }}>
            {renderFormulaPreview(previewText)}
          </Texto>
        </div>
      </div>

      {/* External Display Name */}
      {showExternalName && (
        <div style={{ marginBottom: '0', flexShrink: 0 }}>
          <Texto style={{
            margin: 0,
            fontSize: '9px',
            fontWeight: '600',
            color: '#666',
            marginBottom: '3px'
          }}>
            External Display Name:
          </Texto>
          <div style={{
            padding: '4px 6px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            minHeight: '24px',
            maxHeight: '40px',
            overflowY: 'auto'
          }}>
            <Texto style={{
              margin: 0,
              fontSize: '9px',
              color: '#595959',
              lineHeight: '12px',
              fontFamily: 'monospace'
            }}>
              {renderFormulaPreview(previewText)}
            </Texto>
          </div>
        </div>
      )}
    </>
  );
}
