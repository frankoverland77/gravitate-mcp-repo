// Design token extraction from Figma
// src/lib/figma/tokenExtractor.ts

import type { 
  FigmaFile, 
  FigmaNode, 
  FigmaColor, 
  FigmaFill,
  DesignTokens,
  ColorToken,
  TypographyToken,
  SpacingToken,
  EffectToken
} from './types.js';

export class TokenExtractor {
  /**
   * Extract design tokens from a Figma file
   */
  extractTokens(figmaFile: FigmaFile): DesignTokens {
    return {
      colors: this.extractColors(figmaFile),
      typography: this.extractTypography(figmaFile),
      spacing: this.extractSpacing(figmaFile),
      effects: this.extractEffects(figmaFile)
    };
  }

  /**
   * Extract color tokens from Figma styles and usage
   */
  private extractColors(figmaFile: FigmaFile): ColorToken[] {
    const colors: ColorToken[] = [];
    const colorMap = new Map<string, { count: number; usage: string[] }>();

    // Extract from Figma styles
    for (const [styleId, style] of Object.entries(figmaFile.styles)) {
      if (style.styleType === 'FILL') {
        // This would need to be enhanced to get actual color values
        // For now, we'll extract colors from usage in the document
      }
    }

    // Extract colors from document usage
    this.traverseNode(figmaFile.document, (node) => {
      if (node.fills) {
        node.fills.forEach(fill => {
          if (fill.type === 'SOLID' && fill.color) {
            const hex = this.figmaColorToHex(fill.color);
            const key = `${node.name}-${hex}`;
            
            if (!colorMap.has(hex)) {
              colorMap.set(hex, { count: 0, usage: [] });
            }
            
            const existing = colorMap.get(hex)!;
            existing.count++;
            if (!existing.usage.includes(node.name)) {
              existing.usage.push(node.name);
            }
          }
        });
      }
    });

    // Convert to color tokens
    let index = 0;
    for (const [hex, data] of colorMap.entries()) {
      if (data.count > 1) { // Only include colors used multiple times
        colors.push({
          name: `color-${index}`,
          value: hex,
          hex,
          rgb: this.hexToRgb(hex),
          usage: data.usage
        });
        index++;
      }
    }

    return colors;
  }

  /**
   * Extract typography tokens
   */
  private extractTypography(figmaFile: FigmaFile): TypographyToken[] {
    const typography: TypographyToken[] = [];
    const typeMap = new Map<string, { style: any; usage: string[] }>();

    this.traverseNode(figmaFile.document, (node) => {
      if (node.type === 'TEXT' && node.style) {
        const key = `${node.style.fontFamily}-${node.style.fontSize}-${node.style.fontWeight}`;
        
        if (!typeMap.has(key)) {
          typeMap.set(key, { style: node.style, usage: [] });
        }
        
        const existing = typeMap.get(key)!;
        if (!existing.usage.includes(node.name)) {
          existing.usage.push(node.name);
        }
      }
    });

    // Convert to typography tokens
    let index = 0;
    for (const [key, data] of typeMap.entries()) {
      typography.push({
        name: `typography-${index}`,
        fontFamily: data.style.fontFamily,
        fontSize: data.style.fontSize,
        fontWeight: data.style.fontWeight,
        lineHeight: data.style.lineHeightPx || data.style.fontSize * 1.2,
        letterSpacing: data.style.letterSpacing || 0,
        usage: data.usage
      });
      index++;
    }

    return typography;
  }

  /**
   * Extract spacing tokens from layout patterns
   */
  private extractSpacing(figmaFile: FigmaFile): SpacingToken[] {
    const spacing: SpacingToken[] = [];
    const spacingMap = new Map<number, string[]>();

    this.traverseNode(figmaFile.document, (node) => {
      if (node.children && node.children.length > 1) {
        // Calculate gaps between children
        for (let i = 0; i < node.children.length - 1; i++) {
          const current = node.children[i];
          const next = node.children[i + 1];
          
          if (current.absoluteBoundingBox && next.absoluteBoundingBox) {
            // Calculate horizontal gap
            const hGap = next.absoluteBoundingBox.x - (current.absoluteBoundingBox.x + current.absoluteBoundingBox.width);
            // Calculate vertical gap
            const vGap = next.absoluteBoundingBox.y - (current.absoluteBoundingBox.y + current.absoluteBoundingBox.height);
            
            if (hGap > 0 && hGap < 200) {
              if (!spacingMap.has(hGap)) spacingMap.set(hGap, []);
              spacingMap.get(hGap)!.push(`${node.name} (horizontal)`);
            }
            
            if (vGap > 0 && vGap < 200) {
              if (!spacingMap.has(vGap)) spacingMap.set(vGap, []);
              spacingMap.get(vGap)!.push(`${node.name} (vertical)`);
            }
          }
        }
      }
    });

    // Convert to spacing tokens
    let index = 0;
    for (const [value, usage] of spacingMap.entries()) {
      if (usage.length > 1) { // Only include spacing used multiple times
        spacing.push({
          name: `spacing-${index}`,
          value: Math.round(value),
          usage
        });
        index++;
      }
    }

    return spacing.sort((a, b) => a.value - b.value);
  }

  /**
   * Extract effect tokens (shadows, blurs)
   */
  private extractEffects(figmaFile: FigmaFile): EffectToken[] {
    const effects: EffectToken[] = [];
    const effectMap = new Map<string, { effect: any; usage: string[] }>();

    this.traverseNode(figmaFile.document, (node) => {
      if (node.effects && node.effects.length > 0) {
        node.effects.forEach(effect => {
          if (effect.visible) {
            const key = `${effect.type}-${effect.radius}-${JSON.stringify(effect.color || {})}`;
            
            if (!effectMap.has(key)) {
              effectMap.set(key, { effect, usage: [] });
            }
            
            const existing = effectMap.get(key)!;
            if (!existing.usage.includes(node.name)) {
              existing.usage.push(node.name);
            }
          }
        });
      }
    });

    // Convert to effect tokens
    let index = 0;
    for (const [key, data] of effectMap.entries()) {
      const effect = data.effect;
      let css = '';
      
      if (effect.type === 'DROP_SHADOW') {
        const color = effect.color ? this.figmaColorToRgba(effect.color) : 'rgba(0,0,0,0.25)';
        const offsetX = effect.offset?.x || 0;
        const offsetY = effect.offset?.y || 0;
        css = `box-shadow: ${offsetX}px ${offsetY}px ${effect.radius}px ${color};`;
      }
      
      effects.push({
        name: `effect-${index}`,
        type: effect.type,
        value: effect,
        css,
        usage: data.usage
      });
      index++;
    }

    return effects;
  }

  /**
   * Traverse Figma node tree
   */
  private traverseNode(node: FigmaNode, callback: (node: FigmaNode) => void): void {
    callback(node);
    
    if (node.children) {
      node.children.forEach(child => this.traverseNode(child, callback));
    }
  }

  /**
   * Convert Figma color to hex
   */
  private figmaColorToHex(color: FigmaColor): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Convert Figma color to rgba
   */
  private figmaColorToRgba(color: FigmaColor): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `rgba(${r}, ${g}, ${b}, ${color.a})`;
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}
