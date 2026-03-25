// Grid Font Fix - Ensures Lato font is properly applied to ag-Grid components
// This module provides the correct CSS for ag-Grid font integration

// Theme CSS variables for different Gravitate themes
const THEME_CONFIGS = {
  OSP: {
    primary: "#0066cc",
    primarySubtle: "#e6f2ff",
    backgroundDefault: "#ffffff",
    backgroundElevated: "#f8f9fa",
    backgroundSecondary: "#e9ecef",
    textPrimary: "#212529",
    textSecondary: "#6c757d",
    borderDefault: "#dee2e6",
    borderError: "#dc3545",
    backgroundError: "#f8d7da",
    textError: "#721c24",
  },
  PE: {
    primary: "#28a745",
    primarySubtle: "#d4edda",
    backgroundDefault: "#ffffff",
    backgroundElevated: "#f8f9fa",
    backgroundSecondary: "#e9ecef",
    textPrimary: "#212529",
    textSecondary: "#6c757d",
    borderDefault: "#dee2e6",
    borderError: "#dc3545",
    backgroundError: "#f8d7da",
    textError: "#721c24",
  },
  BP: {
    primary: "#6f42c1",
    primarySubtle: "#e2d9f3",
    backgroundDefault: "#ffffff",
    backgroundElevated: "#f8f9fa",
    backgroundSecondary: "#e9ecef",
    textPrimary: "#212529",
    textSecondary: "#6c757d",
    borderDefault: "#dee2e6",
    borderError: "#dc3545",
    backgroundError: "#f8d7da",
    textError: "#721c24",
  },
  default: {
    primary: "#007bff",
    primarySubtle: "#cce7ff",
    backgroundDefault: "#ffffff",
    backgroundElevated: "#f8f9fa",
    backgroundSecondary: "#e9ecef",
    textPrimary: "#212529",
    textSecondary: "#6c757d",
    borderDefault: "#dee2e6",
    borderError: "#dc3545",
    backgroundError: "#f8d7da",
    textError: "#721c24",
  },
};

/**
 * Get complete theme CSS including colors and fonts
 */
export function getThemeCSS(theme: string): string {
  const themeConfig =
    THEME_CONFIGS[theme as keyof typeof THEME_CONFIGS] || THEME_CONFIGS.default;

  return `/* Theme CSS with Font Fix */
:root {
  --grv-color-primary: ${themeConfig.primary};
  --grv-color-primary-subtle: ${themeConfig.primarySubtle};
  --grv-color-background-default: ${themeConfig.backgroundDefault};
  --grv-color-background-elevated: ${themeConfig.backgroundElevated};
  --grv-color-background-secondary: ${themeConfig.backgroundSecondary};
  --grv-color-text-primary: ${themeConfig.textPrimary};
  --grv-color-text-secondary: ${themeConfig.textSecondary};
  --grv-color-border-default: ${themeConfig.borderDefault};
  --grv-color-border-error: ${themeConfig.borderError};
  --grv-color-background-error: ${themeConfig.backgroundError};
  --grv-color-text-error: ${themeConfig.textError};
}

${getAgGridFontCSS()}

/* Additional theme-specific styling */
.ag-theme-alpine {
  --ag-foreground-color: ${themeConfig.textPrimary};
  --ag-background-color: ${themeConfig.backgroundDefault};
  --ag-header-foreground-color: ${themeConfig.textPrimary};
  --ag-header-background-color: ${themeConfig.backgroundElevated};
  --ag-odd-row-background-color: ${themeConfig.backgroundDefault};
  --ag-border-color: ${themeConfig.borderDefault};
  --ag-selected-row-background-color: ${themeConfig.primarySubtle};
}
/* End Theme CSS */`;
}

export function getAgGridFontCSS(): string {
  return `/* Critical Font Fix for ag-Grid Components */
  
/* 1. Font-face declarations - MUST come first */
@font-face {
  font-family: 'Lato';
  src: url('/assets/fonts/Lato-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('/assets/fonts/Lato-Bold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('/assets/fonts/Lato-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 2. Global font application */
* {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

/* 3. ag-Grid specific font overrides - matching production */
.ag-theme-alpine,
.ag-theme-alpine-dark,
.ag-theme-material,
.ag-theme-balham {
  /* Set the font family at the theme level */
  font-family: 'Lato', sans-serif !important;
  
  /* ag-Grid CSS variables for fonts */
  --ag-font-family: 'Lato', sans-serif !important;
  --ag-font-size: 12px !important;
  --ag-header-font-family: 'Lato', sans-serif !important;
  --ag-header-font-size: 12px !important;
  --ag-header-font-weight: 600 !important;
}

/* 4. Header cells - matching your production styling */
.ag-header-cell,
.ag-header-group-cell {
  font-family: 'Lato', sans-serif !important;
}

.ag-header-cell-label,
.ag-header-cell-text {
  font-family: 'Lato', sans-serif !important;
  text-transform: uppercase !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  letter-spacing: 0.5px !important;
}

/* 5. Grid cells */
.ag-cell {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
  font-weight: 400 !important;
}

/* 6. Cell values and text */
.ag-cell-value,
.ag-group-value {
  font-family: 'Lato', sans-serif !important;
}

/* 7. Filter and menu fonts */
.ag-filter,
.ag-menu,
.ag-menu-list,
.ag-filter-body-wrapper,
.ag-filter-condition {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 8. Pagination */
.ag-paging-panel,
.ag-paging-page-summary,
.ag-paging-description {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 9. Status bar */
.ag-status-bar {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 10. Overlay text (loading, no rows) */
.ag-overlay-loading-center,
.ag-overlay-no-rows-center {
  font-family: 'Lato', sans-serif !important;
}

/* 11. Force inheritance for all ag-Grid child elements */
.ag-root-wrapper,
.ag-root-wrapper * {
  font-family: inherit !important;
}

/* 12. GraviGrid specific overrides */
.gravi-grid-container {
  font-family: 'Lato', sans-serif !important;
}

.gravi-grid-container .ag-root-wrapper {
  font-family: 'Lato', sans-serif !important;
}

/* 13. Debug helper - add red border if font is not Lato */
@supports (font-family: 'Lato') {
  .ag-header-cell-text:not([style*="Lato"]) {
    /* This will help identify cells not using Lato */
    /* Remove this in production */
    /* border: 1px solid red !important; */
  }
}`;
}

export function getInlineFontStyles(): string {
  return `
    <style>
      @import url('/assets/fonts/lato.css');
      
      /* Inline critical font styles */
      .ag-theme-alpine {
        font-family: 'Lato', sans-serif !important;
        --ag-font-family: 'Lato', sans-serif !important;
      }
      
      .ag-header-cell-text {
        font-family: 'Lato', sans-serif !important;
        text-transform: uppercase !important;
        font-weight: 600 !important;
      }
      
      .ag-cell {
        font-family: 'Lato', sans-serif !important;
      }
    </style>
  `;
}

export function wrapGridWithFontFix(gridComponent: string): string {
  return `
${getInlineFontStyles()}

<div class="font-fix-wrapper">
  ${gridComponent}
</div>

<style>
  .font-fix-wrapper {
    font-family: 'Lato', sans-serif !important;
  }
  
  .font-fix-wrapper * {
    font-family: inherit !important;
  }
</style>
  `;
}

// Function to generate a complete HTML page with proper font loading
export function generateStandaloneHTMLWithFonts(
  title: string,
  content: string,
  theme: string = "alpine"
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Preload Lato fonts -->
  <link rel="preload" href="/assets/fonts/Lato-Regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/assets/fonts/Lato-Bold.ttf" as="font" type="font/ttf" crossorigin>
  
  <!-- ag-Grid CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community@30.2.1/styles/ag-grid.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community@30.2.1/styles/ag-theme-${theme}.css">
  
  <!-- Critical Font Styles -->
  <style>
    ${getAgGridFontCSS()}
  </style>
</head>
<body>
  <div id="root">
    ${content}
  </div>
  
  <!-- Ensure fonts are loaded before rendering -->
  <script>
    document.fonts.ready.then(() => {
      console.log('Fonts loaded successfully');
      // Force re-render if needed
      if (window.agGrid) {
        window.agGrid.refreshCells({ force: true });
      }
    });
  </script>
</body>
</html>`;
}

// Function to validate if fonts are being applied correctly
export function generateFontValidator(): string {
  return `
    <script>
      // Font validation helper
      function validateGridFonts() {
        const elements = document.querySelectorAll('.ag-header-cell-text, .ag-cell');
        let issues = [];
        
        elements.forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          const fontFamily = computedStyle.fontFamily;
          
          if (!fontFamily.includes('Lato')) {
            issues.push({
              element: el,
              class: el.className,
              currentFont: fontFamily
            });
          }
        });
        
        if (issues.length > 0) {
          console.warn('Font issues detected:', issues);
          return false;
        }
        
        console.log('✅ All grid elements using Lato font');
        return true;
      }
      
      // Run validation after grid loads
      setTimeout(validateGridFonts, 1000);
    </script>
  `;
}
