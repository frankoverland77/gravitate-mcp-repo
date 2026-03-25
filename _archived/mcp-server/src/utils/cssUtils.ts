/**
 * CSS Utility Class Validation for MCP Tools
 * 
 * This module ensures generated code only uses valid utility classes
 * that exist in the Excalibrr/Gravitate frontend system.
 */

// Available utility classes based on actual codebase usage
export const AVAILABLE_CLASSES = {
  // Margin utilities
  marginBottom: ['mb-1', 'mb-2', 'mb-3', 'mb-4'],
  marginTop: ['mt-1', 'mt-2', 'mt-3', 'mt-4'],
  marginLeft: ['ml-1', 'ml-2', 'ml-3', 'ml-4'],
  marginRight: ['mr-1', 'mr-2', 'mr-3', 'mr-4'],
  
  // Padding utilities
  padding: ['p-1', 'p-2', 'p-3', 'p-4'],
  paddingX: ['px-1', 'px-2', 'px-3', 'px-4'],
  paddingY: ['py-1', 'py-2', 'py-3', 'py-4'],
  
  // Gap utilities  
  gap: ['gap-10', 'gap-16'],
  
  // Other common utilities
  display: ['flex-div', 'vertical-flex'],
  alignment: ['items-center'],
  background: ['bg-theme2'],
  border: ['border-radius-5'],
  text: ['hint']
} as const;

// Flatten all available classes for validation
const ALL_CLASSES = Object.values(AVAILABLE_CLASSES).flat();

/**
 * Validates that a CSS class name exists in our known utility classes
 */
export function isValidUtilityClass(className: string): boolean {
  return ALL_CLASSES.includes(className as any);
}

/**
 * Get appropriate margin-bottom class for a given pixel value
 */
export function getMarginBottomClass(pixels: number): string {
  if (pixels <= 8) return 'mb-1';
  if (pixels <= 16) return 'mb-2'; 
  if (pixels <= 24) return 'mb-3';
  return 'mb-4'; // For 32px+
}

/**
 * Get appropriate padding class for a given pixel value  
 */
export function getPaddingClass(pixels: number): string {
  if (pixels <= 8) return 'p-1';
  if (pixels <= 16) return 'p-2';
  if (pixels <= 24) return 'p-3'; 
  return 'p-4'; // For 32px+
}

/**
 * Convert inline style values to utility classes where possible
 * Falls back to inline styles for unsupported values
 */
export function convertToUtilityClass(styleProp: string, value: string | number): {
  className?: string;
  inlineStyle?: Record<string, string | number>;
} {
  const numValue = typeof value === 'string' ? parseInt(value) : value;
  
  switch (styleProp) {
    case 'marginBottom':
      return { className: getMarginBottomClass(numValue) };
      
    case 'padding':
      return { className: getPaddingClass(numValue) };
      
    // For unsupported properties, fall back to inline styles
    default:
      return { inlineStyle: { [styleProp]: value } };
  }
}

/**
 * Rules enforcement: Generate component props with proper class usage
 */
export function generateComponentProps(props: {
  className?: string[];
  style?: Record<string, string | number>;
}): {
  className?: string;
  style?: Record<string, string | number>;
} {
  const result: { className?: string; style?: Record<string, string | number> } = {};
  
  // Handle className array
  if (props.className && props.className.length > 0) {
    // Validate all classes
    const validClasses = props.className.filter(cls => isValidUtilityClass(cls));
    if (validClasses.length > 0) {
      result.className = validClasses.join(' ');
    }
  }
  
  // Handle inline styles - convert to classes where possible
  if (props.style) {
    const remainingStyles: Record<string, string | number> = {};
    const additionalClasses: string[] = [];
    
    Object.entries(props.style).forEach(([prop, value]) => {
      const converted = convertToUtilityClass(prop, value);
      if (converted.className) {
        additionalClasses.push(converted.className);
      } else if (converted.inlineStyle) {
        Object.assign(remainingStyles, converted.inlineStyle);
      }
    });
    
    // Merge additional classes
    if (additionalClasses.length > 0) {
      result.className = result.className 
        ? `${result.className} ${additionalClasses.join(' ')}`
        : additionalClasses.join(' ');
    }
    
    // Keep remaining inline styles
    if (Object.keys(remainingStyles).length > 0) {
      result.style = remainingStyles;
    }
  }
  
  return result;
}