// Central exports for all visual preview functions
// This provides a clean API for consumers of the visual preview functionality

// Screenshot generation
export {
  generateComponentScreenshot,
  generateBatchScreenshots,
} from "./screenshotGenerator.js";

// Gallery generation
export {
  generateComponentGallery,
  type GalleryOptions,
  type GalleryResult,
} from "./galleryGenerator.js";

// Shareable preview generation
export {
  generateShareablePreview,
  type ShareableOptions,
  type ShareableResult,
} from "./shareableGenerator.js";

// Re-export types and helpers from previewHelpers
export type {
  PreviewOptions,
  ScreenshotResult,
  LivePreviewResult,
} from "./previewHelpers.js";

export {
  generatePreviewHTML,
  saveHTMLPreview,
  createPreviewDirectory,
} from "./previewHelpers.js";
