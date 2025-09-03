import { getThemeCSS } from "../utils/gridFontFix.js";

interface ShellTemplateArgs {
  name: string;
  theme: string;
  componentContent: string;
}

/**
 * Creates a lightweight HTML shell that loads real Excalibrr components
 *
 * This template:
 * - Uses ES modules to import real @gravitate-js/excalibrr
 * - Includes proper theme CSS and font fixes
 * - Provides minimal mock navigation that looks authentic
 * - Sets up React with proper error boundaries
 */
export function shellTemplate({
  name,
  theme,
  componentContent,
}: ShellTemplateArgs): string {
  const themeCSS = getThemeCSS(theme);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Excalibrr Demo</title>
    
    <!-- Theme CSS with font fixes -->
    <style>
        ${themeCSS}
        
        /* Ensure proper layout */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--grv-color-background-default);
            color: var(--grv-color-text-primary);
        }
        
        #root {
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .demo-container {
            flex: 1;
            padding: 24px;
            overflow: auto;
        }
        
        /* Loading state */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-size: 18px;
            color: var(--grv-color-text-secondary);
        }
        
        /* Error boundary styles */
        .error-boundary {
            padding: 24px;
            background-color: var(--grv-color-background-error);
            border: 1px solid var(--grv-color-border-error);
            border-radius: 8px;
            margin: 24px;
        }
        
        .error-title {
            color: var(--grv-color-text-error);
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .error-details {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
            white-space: pre-wrap;
            color: var(--grv-color-text-secondary);
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading">Loading ${name}...</div>
    </div>
    
    <!-- React and dependencies -->
    <script type="importmap">
    {
        "imports": {
            "react": "../shared/node_modules/react/index.js",
            "react-dom/client": "../shared/node_modules/react-dom/client.js",
            "@gravitate-js/excalibrr": "../shared/node_modules/@gravitate-js/excalibrr/dist/index.js"
        }
    }
    </script>
    
    <!-- Mock Navigation -->
    <script type="module" src="./nav.js"></script>
    
    <!-- Main Application -->
    <script type="module">
        import React from 'react';
        import { createRoot } from 'react-dom/client';
        
        // Error Boundary Component
        class ErrorBoundary extends React.Component {
            constructor(props) {
                super(props);
                this.state = { hasError: false, error: null };
            }
            
            static getDerivedStateFromError(error) {
                return { hasError: true, error };
            }
            
            componentDidCatch(error, errorInfo) {
                console.error('Demo Error:', error, errorInfo);
            }
            
            render() {
                if (this.state.hasError) {
                    return React.createElement('div', { className: 'error-boundary' }, [
                        React.createElement('div', { className: 'error-title', key: 'title' }, 'Demo Error'),
                        React.createElement('div', { className: 'error-details', key: 'details' }, 
                            this.state.error?.message || 'Unknown error occurred'
                        )
                    ]);
                }
                
                return this.props.children;
            }
        }
        
        // Main Demo Component
        ${componentContent}
        
        // Render the application
        const root = createRoot(document.getElementById('root'));
        root.render(
            React.createElement(ErrorBoundary, null,
                React.createElement(DemoApp)
            )
        );
    </script>
</body>
</html>`;
}
