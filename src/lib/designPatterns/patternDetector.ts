// Enhanced Figma Design Pattern Detection
// Automatically detects common UI patterns and suggests Excalibrr implementations

export interface DetectedPattern {
  type: 'dashboard' | 'data-grid' | 'form-page' | 'navigation' | 'detail-view' | 'landing-page';
  confidence: number;
  components: ComponentMapping[];
  layout: LayoutStructure;
  theme: ThemeMapping;
  suggestions: string[];
}

export interface ComponentMapping {
  figmaNode: {
    id: string;
    name: string;
    type: string;
  };
  excalibrr: {
    component: string;
    props: Record<string, any>;
    confidence: number;
  };
  reasoning: string;
}

export interface LayoutStructure {
  type: 'horizontal' | 'vertical' | 'grid' | 'flex';
  children: LayoutStructure[];
  props: Record<string, any>;
}

export interface ThemeMapping {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  effects: Record<string, string>;
}

export class DesignPatternDetector {
  /**
   * Analyze a Figma file and detect common design patterns
   */
  detectPatterns(figmaFile: any): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];
    
    // Analyze the document structure
    if (figmaFile.document && figmaFile.document.children) {
      for (const page of figmaFile.document.children) {
        if (page.type === 'CANVAS') {
          const pagePatterns = this.analyzePage(page);
          patterns.push(...pagePatterns);
        }
      }
    }
    
    return patterns;
  }

  /**
   * Analyze a single page for patterns
   */
  private analyzePage(page: any): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];
    
    if (page.children) {
      for (const frame of page.children) {
        if (frame.type === 'FRAME') {
          const pattern = this.analyzeFrame(frame);
          if (pattern) {
            patterns.push(pattern);
          }
        }
      }
    }
    
    return patterns;
  }

  /**
   * Analyze a frame to detect UI patterns
   */
  private analyzeFrame(frame: any): DetectedPattern | null {
    // Dashboard pattern detection
    if (this.isDashboardPattern(frame)) {
      return this.createDashboardPattern(frame);
    }
    
    // Data grid pattern detection
    if (this.isDataGridPattern(frame)) {
      return this.createDataGridPattern(frame);
    }
    
    // Form pattern detection
    if (this.isFormPattern(frame)) {
      return this.createFormPattern(frame);
    }
    
    // Navigation pattern detection
    if (this.isNavigationPattern(frame)) {
      return this.createNavigationPattern(frame);
    }
    
    return null;
  }

  /**
   * Detect dashboard patterns
   */
  private isDashboardPattern(frame: any): boolean {
    if (!frame.children || frame.children.length < 2) return false;
    
    // Look for typical dashboard elements
    const hasCharts = frame.children.some((child: any) => 
      this.isChartLike(child)
    );
    
    const hasCards = frame.children.some((child: any) => 
      this.isCardLike(child)
    );
    
    const hasGrid = frame.children.some((child: any) => 
      this.isGridLike(child)
    );
    
    // Dashboard typically has multiple widgets/cards
    const cardCount = frame.children.filter((child: any) => this.isCardLike(child)).length;
    
    return (hasCharts || hasCards || hasGrid) && cardCount >= 2;
  }

  /**
   * Detect data grid patterns
   */
  private isDataGridPattern(frame: any): boolean {
    if (!frame.children) return false;
    
    // Look for table-like structures
    const hasTableStructure = frame.children.some((child: any) => 
      this.isTableLike(child)
    );
    
    // Look for headers/filters above table
    const hasFilters = frame.children.some((child: any) => 
      this.isFilterBarLike(child)
    );
    
    // Look for pagination
    const hasPagination = frame.children.some((child: any) => 
      this.isPaginationLike(child)
    );
    
    return hasTableStructure || (hasFilters && frame.children.length >= 2);
  }

  /**
   * Detect form patterns
   */
  private isFormPattern(frame: any): boolean {
    if (!frame.children) return false;
    
    // Count form field-like elements
    const formFieldCount = frame.children.filter((child: any) => 
      this.isFormFieldLike(child)
    ).length;
    
    // Look for buttons (submit/cancel)
    const hasButtons = frame.children.some((child: any) => 
      this.isButtonLike(child)
    );
    
    return formFieldCount >= 2 && hasButtons;
  }

  /**
   * Detect navigation patterns
   */
  private isNavigationPattern(frame: any): boolean {
    if (!frame.children) return false;
    
    // Look for navigation-like structures
    const isHorizontalNav = this.isHorizontalNavigation(frame);
    const isVerticalNav = this.isVerticalNavigation(frame);
    const isBreadcrumb = this.isBreadcrumbLike(frame);
    
    return isHorizontalNav || isVerticalNav || isBreadcrumb;
  }

  // Helper methods for pattern detection
  private isChartLike(node: any): boolean {
    return node.name?.toLowerCase().includes('chart') ||
           node.name?.toLowerCase().includes('graph') ||
           (node.type === 'FRAME' && node.children?.length > 5); // Complex visual structure
  }

  private isCardLike(node: any): boolean {
    return (node.type === 'FRAME' || node.type === 'RECTANGLE') &&
           node.children &&
           node.children.length >= 1 &&
           node.children.some((child: any) => child.type === 'TEXT');
  }

  private isGridLike(node: any): boolean {
    return node.name?.toLowerCase().includes('grid') ||
           node.name?.toLowerCase().includes('table') ||
           (node.children && this.hasGridLayout(node.children));
  }

  private isTableLike(node: any): boolean {
    return node.name?.toLowerCase().includes('table') ||
           node.name?.toLowerCase().includes('grid') ||
           node.name?.toLowerCase().includes('list') ||
           (node.children && this.hasTableStructure(node.children));
  }

  private isFilterBarLike(node: any): boolean {
    return node.name?.toLowerCase().includes('filter') ||
           node.name?.toLowerCase().includes('search') ||
           node.name?.toLowerCase().includes('toolbar') ||
           (node.children && this.hasFilterElements(node.children));
  }

  private isPaginationLike(node: any): boolean {
    return node.name?.toLowerCase().includes('pagination') ||
           node.name?.toLowerCase().includes('page') ||
           (node.children && this.hasPaginationElements(node.children));
  }

  private isFormFieldLike(node: any): boolean {
    return node.name?.toLowerCase().includes('input') ||
           node.name?.toLowerCase().includes('field') ||
           node.name?.toLowerCase().includes('select') ||
           node.name?.toLowerCase().includes('dropdown') ||
           (node.type === 'RECTANGLE' && this.hasInputStyling(node));
  }

  private isButtonLike(node: any): boolean {
    return node.name?.toLowerCase().includes('button') ||
           node.name?.toLowerCase().includes('btn') ||
           (node.type === 'RECTANGLE' && this.hasButtonStyling(node));
  }

  private isHorizontalNavigation(frame: any): boolean {
    if (!frame.children || frame.children.length < 2) return false;
    
    const horizontalLayout = frame.layoutMode === 'HORIZONTAL' ||
                           this.hasHorizontalAlignment(frame.children);
    
    const hasNavItems = frame.children.filter((child: any) => 
      this.isNavItemLike(child)
    ).length >= 2;
    
    return horizontalLayout && hasNavItems;
  }

  private isVerticalNavigation(frame: any): boolean {
    if (!frame.children || frame.children.length < 2) return false;
    
    const verticalLayout = frame.layoutMode === 'VERTICAL' ||
                          this.hasVerticalAlignment(frame.children);
    
    const hasNavItems = frame.children.filter((child: any) => 
      this.isNavItemLike(child)
    ).length >= 2;
    
    return verticalLayout && hasNavItems;
  }

  private isBreadcrumbLike(frame: any): boolean {
    return frame.name?.toLowerCase().includes('breadcrumb') ||
           (frame.children && this.hasBreadcrumbStructure(frame.children));
  }

  private isNavItemLike(node: any): boolean {
    return node.name?.toLowerCase().includes('nav') ||
           node.name?.toLowerCase().includes('menu') ||
           node.name?.toLowerCase().includes('tab') ||
           (node.type === 'TEXT' || (node.children && node.children.some((child: any) => child.type === 'TEXT')));
  }

  // Layout analysis helpers
  private hasGridLayout(children: any[]): boolean {
    // Simple heuristic: multiple rows and columns
    return children.length >= 4; // Minimum for 2x2 grid
  }

  private hasTableStructure(children: any[]): boolean {
    // Look for repeated row-like structures
    const rowLikeCount = children.filter(child => 
      child.children && child.children.length >= 2
    ).length;
    
    return rowLikeCount >= 2;
  }

  private hasFilterElements(children: any[]): boolean {
    return children.some(child => 
      this.isFormFieldLike(child) || this.isButtonLike(child)
    );
  }

  private hasPaginationElements(children: any[]): boolean {
    const hasNumbers = children.some(child => 
      child.type === 'TEXT' && /\d+/.test(child.characters || '')
    );
    
    const hasNavButtons = children.some(child =>
      child.name?.toLowerCase().includes('prev') ||
      child.name?.toLowerCase().includes('next') ||
      child.name?.toLowerCase().includes('arrow')
    );
    
    return hasNumbers || hasNavButtons;
  }

  private hasInputStyling(node: any): boolean {
    // Look for common input styling patterns
    return node.fills && node.fills.some((fill: any) => 
      fill.type === 'SOLID' && fill.color
    ) && node.cornerRadius !== undefined;
  }

  private hasButtonStyling(node: any): boolean {
    // Look for common button styling patterns
    return node.fills && node.fills.length > 0 && 
           node.cornerRadius !== undefined &&
           node.children && node.children.some((child: any) => child.type === 'TEXT');
  }

  private hasHorizontalAlignment(children: any[]): boolean {
    if (children.length < 2) return false;
    
    // Simple heuristic: similar Y positions, different X positions
    const firstY = children[0].absoluteBoundingBox?.y || 0;
    const tolerance = 20; // pixels
    
    return children.every(child => 
      Math.abs((child.absoluteBoundingBox?.y || 0) - firstY) <= tolerance
    );
  }

  private hasVerticalAlignment(children: any[]): boolean {
    if (children.length < 2) return false;
    
    // Simple heuristic: similar X positions, different Y positions
    const firstX = children[0].absoluteBoundingBox?.x || 0;
    const tolerance = 20; // pixels
    
    return children.every(child => 
      Math.abs((child.absoluteBoundingBox?.x || 0) - firstX) <= tolerance
    );
  }

  private hasBreadcrumbStructure(children: any[]): boolean {
    // Look for text elements separated by dividers
    const textElements = children.filter(child => child.type === 'TEXT').length;
    const totalElements = children.length;
    
    return textElements >= 2 && totalElements >= 3; // Text + separators
  }

  // Pattern creators
  private createDashboardPattern(frame: any): DetectedPattern {
    return {
      type: 'dashboard',
      confidence: 0.8,
      components: this.mapDashboardComponents(frame),
      layout: this.analyzeDashboardLayout(frame),
      theme: this.extractTheme(frame),
      suggestions: [
        'Use Horizontal/Vertical layout components for structure',
        'Consider DashboardWidget for card-like elements',
        'Use GraviGrid for any tabular data',
        'Add proper navigation with PageWrapper'
      ]
    };
  }

  private createDataGridPattern(frame: any): DetectedPattern {
    return {
      type: 'data-grid',
      confidence: 0.9,
      components: this.mapDataGridComponents(frame),
      layout: this.analyzeDataGridLayout(frame),
      theme: this.extractTheme(frame),
      suggestions: [
        'Use GraviGrid as the main component',
        'Add SearchGridHeader for filtering',
        'Consider ConfigurableGridViews for user customization',
        'Use proper column definitions with cell renderers'
      ]
    };
  }

  private createFormPattern(frame: any): DetectedPattern {
    return {
      type: 'form-page',
      confidence: 0.85,
      components: this.mapFormComponents(frame),
      layout: this.analyzeFormLayout(frame),
      theme: this.extractTheme(frame),
      suggestions: [
        'Use Vertical layout for form structure',
        'Wrap in Modal or Drawer if appropriate',
        'Add form validation with proper error handling',
        'Use consistent spacing between fields'
      ]
    };
  }

  private createNavigationPattern(frame: any): DetectedPattern {
    return {
      type: 'navigation',
      confidence: 0.8,
      components: this.mapNavigationComponents(frame),
      layout: this.analyzeNavigationLayout(frame),
      theme: this.extractTheme(frame),
      suggestions: [
        'Use PageToolbar for horizontal navigation',
        'Consider VerticalNav for sidebar navigation',
        'Add proper routing integration',
        'Use consistent navigation styling'
      ]
    };
  }

  // Component mapping methods
  private mapDashboardComponents(frame: any): ComponentMapping[] {
    const mappings: ComponentMapping[] = [];
    
    if (frame.children) {
      for (const child of frame.children) {
        if (this.isCardLike(child)) {
          mappings.push({
            figmaNode: {
              id: child.id,
              name: child.name,
              type: child.type
            },
            excalibrr: {
              component: 'DashboardWidget',
              props: {
                title: this.extractTitle(child),
                size: this.calculateSize(child)
              },
              confidence: 0.8
            },
            reasoning: 'Card-like structure suggests DashboardWidget'
          });
        } else if (this.isChartLike(child)) {
          mappings.push({
            figmaNode: {
              id: child.id,
              name: child.name,
              type: child.type
            },
            excalibrr: {
              component: 'Custom Chart Component',
              props: {
                type: this.detectChartType(child),
                data: 'Connect to your data source'
              },
              confidence: 0.7
            },
            reasoning: 'Complex visual structure suggests chart component'
          });
        } else if (this.isGridLike(child)) {
          mappings.push({
            figmaNode: {
              id: child.id,
              name: child.name,
              type: child.type
            },
            excalibrr: {
              component: 'GraviGrid',
              props: {
                columns: 'Define column structure',
                data: 'Connect to data source'
              },
              confidence: 0.9
            },
            reasoning: 'Grid-like structure maps to GraviGrid'
          });
        }
      }
    }
    
    return mappings;
  }

  private mapDataGridComponents(frame: any): ComponentMapping[] {
    const mappings: ComponentMapping[] = [];
    
    if (frame.children) {
      for (const child of frame.children) {
        if (this.isTableLike(child)) {
          mappings.push({
            figmaNode: {
              id: child.id,
              name: child.name,
              type: child.type
            },
            excalibrr: {
              component: 'GraviGrid',
              props: {
                columns: this.analyzeTableColumns(child),
                rowSelection: true,
                pagination: true
              },
              confidence: 0.95
            },
            reasoning: 'Table structure maps directly to GraviGrid'
          });
        } else if (this.isFilterBarLike(child)) {
          mappings.push({
            figmaNode: {
              id: child.id,
              name: child.name,
              type: child.type
            },
            excalibrr: {
              component: 'SearchGridHeader',
              props: {
                filters: this.analyzeFilterFields(child)
              },
              confidence: 0.8
            },
            reasoning: 'Filter bar maps to SearchGridHeader'
          });
        }
      }
    }
    
    return mappings;
  }

  private mapFormComponents(frame: any): ComponentMapping[] {
    const mappings: ComponentMapping[] = [];
    
    if (frame.children) {
      for (const child of frame.children) {
        if (this.isFormFieldLike(child)) {
          const fieldType = this.detectFormFieldType(child);
          mappings.push({
            figmaNode: {
              id: child.id,
              name: child.name,
              type: child.type
            },
            excalibrr: {
              component: this.getExcalibrFormComponent(fieldType),
              props: {
                label: this.extractFieldLabel(child),
                required: this.isFieldRequired(child)
              },
              confidence: 0.8
            },
            reasoning: `Form field detected as ${fieldType}`
          });
        } else if (this.isButtonLike(child)) {
          mappings.push({
            figmaNode: {
              id: child.id,
              name: child.name,
              type: child.type
            },
            excalibrr: {
              component: 'GraviButton',
              props: {
                type: this.detectButtonType(child),
                text: this.extractButtonText(child)
              },
              confidence: 0.9
            },
            reasoning: 'Button-like element maps to GraviButton'
          });
        }
      }
    }
    
    return mappings;
  }

  private mapNavigationComponents(frame: any): ComponentMapping[] {
    const mappings: ComponentMapping[] = [];
    
    if (this.isHorizontalNavigation(frame)) {
      mappings.push({
        figmaNode: {
          id: frame.id,
          name: frame.name,
          type: frame.type
        },
        excalibrr: {
          component: 'PageToolbar',
          props: {
            items: this.extractNavigationItems(frame)
          },
          confidence: 0.9
        },
        reasoning: 'Horizontal navigation maps to PageToolbar'
      });
    } else if (this.isVerticalNavigation(frame)) {
      mappings.push({
        figmaNode: {
          id: frame.id,
          name: frame.name,
          type: frame.type
        },
        excalibrr: {
          component: 'VerticalNav',
          props: {
            items: this.extractNavigationItems(frame)
          },
          confidence: 0.9
        },
        reasoning: 'Vertical navigation maps to VerticalNav'
      });
    }
    
    return mappings;
  }

  // Layout analysis methods
  private analyzeDashboardLayout(frame: any): LayoutStructure {
    // Analyze the overall dashboard layout
    const isGrid = this.hasGridLayout(frame.children || []);
    
    if (isGrid) {
      return {
        type: 'grid',
        children: [],
        props: {
          columns: this.calculateGridColumns(frame.children),
          gap: 16
        }
      };
    } else {
      return {
        type: 'vertical',
        children: [],
        props: {
          gap: 24,
          padding: 20
        }
      };
    }
  }

  private analyzeDataGridLayout(frame: any): LayoutStructure {
    return {
      type: 'vertical',
      children: [
        {
          type: 'horizontal',
          children: [],
          props: { justifyContent: 'space-between' }
        },
        {
          type: 'vertical',
          children: [],
          props: { flex: 1 }
        }
      ],
      props: {
        height: '100%',
        gap: 16
      }
    };
  }

  private analyzeFormLayout(frame: any): LayoutStructure {
    return {
      type: 'vertical',
      children: [],
      props: {
        gap: 16,
        padding: 24,
        maxWidth: 600
      }
    };
  }

  private analyzeNavigationLayout(frame: any): LayoutStructure {
    if (this.isHorizontalNavigation(frame)) {
      return {
        type: 'horizontal',
        children: [],
        props: {
          gap: 24,
          alignItems: 'center'
        }
      };
    } else {
      return {
        type: 'vertical',
        children: [],
        props: {
          gap: 8,
          width: 250
        }
      };
    }
  }

  // Theme extraction
  private extractTheme(frame: any): ThemeMapping {
    const theme: ThemeMapping = {
      colors: {},
      spacing: {},
      typography: {},
      effects: {}
    };

    this.extractColors(frame, theme.colors);
    this.extractSpacing(frame, theme.spacing);
    this.extractTypography(frame, theme.typography);
    this.extractEffects(frame, theme.effects);

    return theme;
  }

  private extractColors(node: any, colors: Record<string, string>): void {
    if (node.fills) {
      node.fills.forEach((fill: any, index: number) => {
        if (fill.type === 'SOLID' && fill.color) {
          const { r, g, b } = fill.color;
          const hex = this.rgbToHex(r * 255, g * 255, b * 255);
          colors[`color_${node.name}_${index}`] = hex;
        }
      });
    }

    if (node.children) {
      node.children.forEach((child: any) => {
        this.extractColors(child, colors);
      });
    }
  }

  private extractSpacing(node: any, spacing: Record<string, string>): void {
    if (node.paddingTop !== undefined) {
      spacing.padding = `${node.paddingTop}px`;
    }
    if (node.itemSpacing !== undefined) {
      spacing.gap = `${node.itemSpacing}px`;
    }
  }

  private extractTypography(node: any, typography: Record<string, any>): void {
    if (node.type === 'TEXT' && node.style) {
      const style = node.style;
      typography[node.name || 'text'] = {
        fontFamily: style.fontFamily,
        fontSize: `${style.fontSize}px`,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeightPx ? `${style.lineHeightPx}px` : undefined,
        letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined
      };
    }

    if (node.children) {
      node.children.forEach((child: any) => {
        this.extractTypography(child, typography);
      });
    }
  }

  private extractEffects(node: any, effects: Record<string, string>): void {
    if (node.effects && node.effects.length > 0) {
      node.effects.forEach((effect: any, index: number) => {
        if (effect.type === 'DROP_SHADOW') {
          effects[`shadow_${node.name}_${index}`] = this.effectToCss(effect);
        }
      });
    }

    if (node.children) {
      node.children.forEach((child: any) => {
        this.extractEffects(child, effects);
      });
    }
  }

  // Helper utility methods
  private extractTitle(node: any): string {
    if (node.children) {
      const textNode = node.children.find((child: any) => child.type === 'TEXT');
      if (textNode && textNode.characters) {
        return textNode.characters;
      }
    }
    return node.name || 'Widget Title';
  }

  private calculateSize(node: any): 'small' | 'medium' | 'large' {
    if (!node.absoluteBoundingBox) return 'medium';
    
    const { width, height } = node.absoluteBoundingBox;
    const area = width * height;
    
    if (area < 20000) return 'small';
    if (area > 80000) return 'large';
    return 'medium';
  }

  private detectChartType(node: any): string {
    const name = node.name?.toLowerCase() || '';
    if (name.includes('pie')) return 'pie';
    if (name.includes('bar')) return 'bar';
    if (name.includes('line')) return 'line';
    return 'bar'; // default
  }

  private analyzeTableColumns(node: any): any[] {
    // Simple heuristic for column detection
    if (node.children) {
      const firstRow = node.children[0];
      if (firstRow && firstRow.children) {
        return firstRow.children.map((cell: any, index: number) => ({
          field: `column${index + 1}`,
          headerName: this.extractCellText(cell) || `Column ${index + 1}`,
          width: cell.absoluteBoundingBox?.width || 150
        }));
      }
    }
    return [];
  }

  private analyzeFilterFields(node: any): any[] {
    if (!node.children) return [];
    
    return node.children
      .filter(child => this.isFormFieldLike(child))
      .map(field => ({
        name: field.name || 'filter',
        type: this.detectFormFieldType(field),
        label: this.extractFieldLabel(field)
      }));
  }

  private detectFormFieldType(node: any): string {
    const name = node.name?.toLowerCase() || '';
    if (name.includes('select') || name.includes('dropdown')) return 'select';
    if (name.includes('date')) return 'date';
    if (name.includes('number')) return 'number';
    if (name.includes('email')) return 'email';
    if (name.includes('textarea')) return 'textarea';
    return 'text';
  }

  private getExcalibrFormComponent(fieldType: string): string {
    switch (fieldType) {
      case 'select': return 'Select';
      case 'date': return 'MomentDatePicker';
      case 'textarea': return 'TextArea';
      default: return 'Input';
    }
  }

  private extractFieldLabel(node: any): string {
    if (node.children) {
      const labelNode = node.children.find(child => child.type === 'TEXT');
      if (labelNode && labelNode.characters) {
        return labelNode.characters;
      }
    }
    return node.name || 'Field Label';
  }

  private isFieldRequired(node: any): boolean {
    const name = node.name?.toLowerCase() || '';
    return name.includes('required') || name.includes('*');
  }

  private detectButtonType(node: any): 'primary' | 'secondary' | 'default' {
    const name = node.name?.toLowerCase() || '';
    if (name.includes('primary') || name.includes('submit')) return 'primary';
    if (name.includes('secondary') || name.includes('cancel')) return 'secondary';
    return 'default';
  }

  private extractButtonText(node: any): string {
    if (node.children) {
      const textNode = node.children.find(child => child.type === 'TEXT');
      if (textNode && textNode.characters) {
        return textNode.characters;
      }
    }
    return node.name || 'Button';
  }

  private extractNavigationItems(frame: any): any[] {
    if (!frame.children) return [];
    
    return frame.children
      .filter(child => this.isNavItemLike(child))
      .map(item => ({
        label: this.extractNavItemText(item),
        path: `/${this.slugify(this.extractNavItemText(item))}`
      }));
  }

  private extractNavItemText(node: any): string {
    if (node.type === 'TEXT' && node.characters) {
      return node.characters;
    }
    
    if (node.children) {
      const textNode = node.children.find(child => child.type === 'TEXT');
      if (textNode && textNode.characters) {
        return textNode.characters;
      }
    }
    
    return node.name || 'Nav Item';
  }

  private calculateGridColumns(children: any[]): number {
    if (!children || children.length === 0) return 1;
    
    // Simple heuristic: find the most common Y position (row)
    const yPositions = children.map(child => 
      Math.round((child.absoluteBoundingBox?.y || 0) / 50) * 50
    );
    
    const yGroups: Record<number, number> = {};
    yPositions.forEach(y => {
      yGroups[y] = (yGroups[y] || 0) + 1;
    });
    
    return Math.max(...Object.values(yGroups));
  }

  private extractCellText(node: any): string {
    if (node.type === 'TEXT' && node.characters) {
      return node.characters;
    }
    
    if (node.children) {
      const textNode = node.children.find(child => child.type === 'TEXT');
      if (textNode && textNode.characters) {
        return textNode.characters;
      }
    }
    
    return '';
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + Math.round(r).toString(16).padStart(2, '0') +
                 Math.round(g).toString(16).padStart(2, '0') +
                 Math.round(b).toString(16).padStart(2, '0');
  }

  private effectToCss(effect: any): string {
    if (effect.type === 'DROP_SHADOW') {
      const { offset, radius, color } = effect;
      const { r, g, b } = color;
      const alpha = color.a || 1;
      return `${offset.x}px ${offset.y}px ${radius}px rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
    }
    return '';
  }

  private slugify(text: string): string {
    return text.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
