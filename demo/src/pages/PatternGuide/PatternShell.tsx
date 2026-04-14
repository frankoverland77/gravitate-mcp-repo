import styles from './PatternShell.module.css'

interface PatternShellProps {
  title: string
  subtitle?: string
  accentColor?: string
  sections?: { id: string; title: string }[]
  children: React.ReactNode
}

export function PatternShell({
  title,
  subtitle,
  accentColor = '#1890ff',
  sections,
  children,
}: PatternShellProps) {
  return (
    <div className={styles.canvas}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            className={styles['accent-bar']}
            style={{ background: accentColor }}
          />
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      </div>

      {sections && sections.length > 0 && (
        <nav className={styles.toc}>
          <div className={styles['toc-title']}>On this page</div>
          <ul className={styles['toc-list']}>
            {sections.map((s) => (
              <li key={s.id}>
                <a className={styles['toc-link']} href={`#${s.id}`}>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  )
}
