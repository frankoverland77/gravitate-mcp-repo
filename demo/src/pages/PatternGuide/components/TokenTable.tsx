import React from 'react'

interface TokenRow {
  token: string
  value: string
  cssVar: string
  usage: string
}

interface TokenTableProps {
  tokens: TokenRow[]
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  background: '#f0f0f0',
  borderBottom: '2px solid #e8e8e8',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: '#595959',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #f0f0f0',
  color: '#262626',
}

const monoStyle: React.CSSProperties = {
  fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
  fontSize: 12,
  color: '#d4380d',
  background: '#fff2e8',
  padding: '2px 6px',
  borderRadius: 3,
}

export function TokenTable({ tokens }: TokenTableProps) {
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Token</th>
            <th style={thStyle}>Value</th>
            <th style={thStyle}>CSS Variable</th>
            <th style={thStyle}>Usage</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.token}>
              <td style={tdStyle}>
                <span style={{ fontWeight: 600 }}>{t.token}</span>
              </td>
              <td style={tdStyle}>
                <span style={monoStyle}>{t.value}</span>
              </td>
              <td style={tdStyle}>
                <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#8c8c8c' }}>
                  {t.cssVar}
                </code>
              </td>
              <td style={{ ...tdStyle, color: '#595959' }}>{t.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
