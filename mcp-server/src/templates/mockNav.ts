interface MockNavTemplateArgs {
  theme: string;
}

/**
 * Creates a simple mock navigation that looks like production Gravitate nav
 * but doesn't require complex routing or authentication
 */
export function mockNavTemplate({ theme }: MockNavTemplateArgs): string {
  return `
// Mock Navigation for Demo
import React from 'react';

// Simple mock navigation that looks authentic
function MockNavigation() {
    const navItems = [
        { label: 'Dashboard', active: false },
        { label: 'Data Management', active: true },
        { label: 'Reports', active: false },
        { label: 'Settings', active: false },
    ];
    
    return React.createElement('div', {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            backgroundColor: 'var(--grv-color-background-elevated)',
            borderBottom: '1px solid var(--grv-color-border-default)',
            minHeight: '56px'
        }
    }, [
        // Logo/Brand
        React.createElement('div', {
            key: 'brand',
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }
        }, [
            React.createElement('div', {
                key: 'logo',
                style: {
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--grv-color-primary)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px'
                }
            }, 'G'),
            React.createElement('span', {
                key: 'title',
                style: {
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--grv-color-text-primary)'
                }
            }, 'Gravitate ${theme}')
        ]),
        
        // Navigation Items
        React.createElement('div', {
            key: 'nav',
            style: {
                display: 'flex',
                gap: '8px'
            }
        }, navItems.map((item, index) => 
            React.createElement('button', {
                key: index,
                style: {
                    padding: '8px 16px',
                    backgroundColor: item.active ? 'var(--grv-color-primary-subtle)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: item.active ? 'var(--grv-color-primary)' : 'var(--grv-color-text-secondary)',
                    fontSize: '14px',
                    fontWeight: item.active ? '500' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                },
                onClick: () => console.log(\`Navigate to \${item.label}\`)
            }, item.label)
        )),
        
        // User Menu
        React.createElement('div', {
            key: 'user',
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }
        }, [
            React.createElement('span', {
                key: 'username',
                style: {
                    fontSize: '14px',
                    color: 'var(--grv-color-text-secondary)'
                }
            }, 'Demo User'),
            React.createElement('div', {
                key: 'avatar',
                style: {
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--grv-color-background-secondary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--grv-color-text-primary)',
                    cursor: 'pointer'
                }
            }, 'DU')
        ])
    ]);
}

// Mount the navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('mock-nav-container');
    if (container && window.React && window.ReactDOM) {
        const root = window.ReactDOM.createRoot(container);
        root.render(React.createElement(MockNavigation));
    }
});

// Also try mounting after a short delay in case React isn't ready yet
setTimeout(() => {
    const container = document.getElementById('mock-nav-container');
    if (container && !container.hasChildNodes() && window.React && window.ReactDOM) {
        const root = window.ReactDOM.createRoot(container);
        root.render(React.createElement(MockNavigation));
    }
}, 100);
`;
}
