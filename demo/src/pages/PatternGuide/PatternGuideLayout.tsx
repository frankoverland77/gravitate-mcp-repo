import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ColumnWidthOutlined,
  FormOutlined,
  ExpandOutlined,
  LayoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  VerticalAlignBottomOutlined,
  AppstoreOutlined,
  SplitCellsOutlined,
  CreditCardOutlined,
  BlockOutlined,
  BellOutlined,
  CompassOutlined,
  EyeOutlined,
  DesktopOutlined,
  PicLeftOutlined,
  DashboardOutlined,
  TableOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import styles from './PatternGuideLayout.module.css'
import gravLogo from '../../assets/SiteImages/grav-logo.svg'

const PATTERN_PAGES = [
  { path: '/PatternGuide/SpacingTokens', label: 'Design Tokens', icon: <ColumnWidthOutlined /> },
  { path: '/PatternGuide/Forms', label: 'Forms', icon: <FormOutlined /> },
  { path: '/PatternGuide/Modals', label: 'Modals', icon: <ExpandOutlined /> },
  { path: '/PatternGuide/Sections', label: 'Sections & Content', icon: <LayoutOutlined /> },
  { path: '/PatternGuide/RightDrawers', label: 'Right Drawers', icon: <MenuUnfoldOutlined /> },
  { path: '/PatternGuide/BottomDrawers', label: 'Bottom Drawers', icon: <VerticalAlignBottomOutlined /> },
  { path: '/PatternGuide/PageLayouts', label: 'Page Layouts', icon: <AppstoreOutlined /> },
  { path: '/PatternGuide/Panels', label: 'Panels', icon: <SplitCellsOutlined /> },
  { path: '/PatternGuide/Cards', label: 'Cards', icon: <CreditCardOutlined /> },
  { path: '/PatternGuide/ButtonGroups', label: 'Button Groups', icon: <BlockOutlined /> },
  { path: '/PatternGuide/Feedback', label: 'Feedback & Messaging', icon: <BellOutlined /> },
  { path: '/PatternGuide/Navigation', label: 'Navigation', icon: <CompassOutlined /> },
]

const EXAMPLE_PAGES = [
  { path: '/PatternGuide/Examples', label: 'Overview', icon: <EyeOutlined /> },
  { path: '/PatternExamples/ExFullWidth', label: 'Full-Width Page', icon: <DesktopOutlined /> },
  { path: '/PatternExamples/ExSidebarMain', label: 'Sidebar + Main', icon: <PicLeftOutlined /> },
  { path: '/PatternExamples/ExDashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { path: '/PatternExamples/ExGridPage', label: 'Grid Page', icon: <TableOutlined /> },
]

interface PatternGuideLayoutProps {
  children: React.ReactNode
}

export function PatternGuideLayout({ children }: PatternGuideLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={styles.layout}>
      <nav className={`${styles.sidebar} ${collapsed ? styles['sidebar-collapsed'] : ''}`}>
        {/* Logo area */}
        <div className={styles.logo}>
          <img src={gravLogo} alt="Gravitate" className={styles['logo-img']} />
          <span className={styles['logo-text']}>Pattern Guide</span>
        </div>

        {/* Search hint */}
        <button className={styles.search} onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <SearchOutlined className={styles['search-icon']} />
          <span className={styles['search-label']}>Search</span>
          <kbd className={styles['search-kbd']}>⌘K</kbd>
        </button>

        {/* Nav items */}
        <div className={styles.nav}>
          <div className={styles['section-title']}>
            <span>Patterns</span>
          </div>
          {PATTERN_PAGES.map((page) => {
            const active = location.pathname === page.path
            return (
              <button
                key={page.path}
                className={`${styles['nav-item']} ${active ? styles['nav-item-active'] : ''}`}
                onClick={() => navigate(page.path)}
                title={collapsed ? page.label : undefined}
              >
                {active && <span className={styles['active-dot']} />}
                <span className={styles['nav-icon']}>{page.icon}</span>
                <span className={styles['nav-label']}>{page.label}</span>
              </button>
            )
          })}

          <div className={styles.divider} />

          <div className={styles['section-title']}>
            <span>Examples</span>
          </div>
          {EXAMPLE_PAGES.map((page) => {
            const active = location.pathname === page.path
            return (
              <button
                key={page.path}
                className={`${styles['nav-item']} ${active ? styles['nav-item-active'] : ''}`}
                onClick={() => navigate(page.path)}
                title={collapsed ? page.label : undefined}
              >
                {active && <span className={styles['active-dot']} />}
                <span className={styles['nav-icon']}>{page.icon}</span>
                <span className={styles['nav-label']}>{page.label}</span>
              </button>
            )
          })}
        </div>

        {/* Toggle button */}
        <button className={styles.toggle} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          <span className={styles['toggle-label']}>{collapsed ? '' : 'Collapse'}</span>
        </button>
      </nav>

      <div className={styles.main}>
        {children}
      </div>
    </div>
  )
}
