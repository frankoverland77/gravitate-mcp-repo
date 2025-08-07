// Figma API types and interfaces
// src/lib/figma/types.ts

export interface FigmaFile {
  name: string;
  document: FigmaNode;
  components: Record<string, FigmaComponent>;
  styles: Record<string, FigmaStyle>;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  effects?: FigmaEffect[];
  constraints?: FigmaConstraints;
  absoluteBoundingBox?: FigmaRectangle;
  size?: FigmaVector;
  relativeTransform?: number[][];
  clipsContent?: boolean;
  background?: FigmaFill[];
  backgroundColor?: FigmaColor;
  exportSettings?: FigmaExportSetting[];
  blendMode?: string;
  preserveRatio?: boolean;
  layoutAlign?: string;
  layoutGrow?: number;
  opacity?: number;
  isMask?: boolean;
  visible?: boolean;
  // Text-specific properties
  characters?: string;
  style?: FigmaTypeStyle;
  characterStyleOverrides?: number[];
  styleOverrideTable?: Record<number, FigmaTypeStyle>;
}

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  documentationLinks: any[];
}

export interface FigmaStyle {
  key: string;
  name: string;
  description: string;
  styleType: "FILL" | "TEXT" | "EFFECT" | "GRID";
  remote: boolean;
}

export interface FigmaFill {
  blendMode: string;
  type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND" | "IMAGE";
  color?: FigmaColor;
  gradientHandlePositions?: FigmaVector[];
  gradientStops?: FigmaColorStop[];
  opacity?: number;
  visible?: boolean;
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaColorStop {
  color: FigmaColor;
  position: number;
}

export interface FigmaStroke {
  blendMode: string;
  type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND" | "IMAGE";
  color: FigmaColor;
  opacity?: number;
  visible?: boolean;
}

export interface FigmaEffect {
  type: "INNER_SHADOW" | "DROP_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR";
  visible: boolean;
  radius: number;
  color?: FigmaColor;
  blendMode?: string;
  offset?: FigmaVector;
  spread?: number;
}

export interface FigmaConstraints {
  vertical: "TOP" | "BOTTOM" | "CENTER" | "TOP_BOTTOM" | "SCALE";
  horizontal: "LEFT" | "RIGHT" | "CENTER" | "LEFT_RIGHT" | "SCALE";
}

export interface FigmaRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigmaVector {
  x: number;
  y: number;
}

export interface FigmaExportSetting {
  suffix: string;
  format: "JPG" | "PNG" | "SVG" | "PDF";
  constraint: {
    type: "SCALE" | "WIDTH" | "HEIGHT";
    value: number;
  };
}

export interface FigmaTypeStyle {
  fontFamily: string;
  fontPostScriptName?: string;
  paragraphSpacing?: number;
  paragraphIndent?: number;
  listSpacing?: number;
  italic?: boolean;
  fontWeight: number;
  fontSize: number;
  textCase?: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE";
  textDecoration?: "NONE" | "UNDERLINE" | "STRIKETHROUGH";
  textAlignHorizontal?: "LEFT" | "RIGHT" | "CENTER" | "JUSTIFIED";
  textAlignVertical?: "TOP" | "CENTER" | "BOTTOM";
  letterSpacing: number;
  fills?: FigmaFill[];
  hyperlink?: {
    type: "URL" | "NODE";
    url?: string;
    nodeID?: string;
  };
  opentypeFlags?: Record<string, number>;
  lineHeightPx: number;
  lineHeightPercent?: number;
  lineHeightPercentFontSize?: number;
  lineHeightUnit: "PIXELS" | "FONT_SIZE_%" | "INTRINSIC_%";
}

// Design token extraction types
export interface DesignTokens {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  effects: EffectToken[];
}

export interface ColorToken {
  name: string;
  value: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  usage: string[];
}

export interface TypographyToken {
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  usage: string[];
}

export interface SpacingToken {
  name: string;
  value: number;
  usage: string[];
}

export interface EffectToken {
  name: string;
  type: string;
  value: any;
  css: string;
  usage: string[];
}

// Component mapping types
export interface FigmaToExcalibrMapping {
  figmaComponent: string;
  excalibrComponent: string;
  propMapping: Record<string, string>;
  confidence: number;
  notes: string[];
}

export interface LayoutAnalysis {
  type: "HORIZONTAL" | "VERTICAL" | "GRID" | "FLEX";
  direction: "row" | "column";
  gap: number;
  alignment: string;
  children: LayoutChild[];
  excalibrCode: string;
}

export interface LayoutChild {
  id: string;
  name: string;
  type: string;
  bounds: FigmaRectangle;
  suggestedComponent?: string;
}
