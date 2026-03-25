/**
 * Component Registry Data
 * Metadata for all Excalibrr components
 */

import { ComponentMetadata } from "../types.js";
import { graviGridComponent } from "./GraviGrid.js";
import { graviButtonComponent } from "./GraviButton.js";
import { formComponent } from "./Form.js";
import { selectComponent } from "./Select.js";
import { textoComponent } from "./Texto.js";
import { modalComponent } from "./Modal.js";
import { popoverComponent } from "./Popover.js";
import { horizontalComponent } from "./Horizontal.js";
import { verticalComponent } from "./Vertical.js";
import { tabsComponent } from "./Tabs.js";

/**
 * Complete registry of all Excalibrr components
 */
export const componentRegistry: ComponentMetadata[] = [
  graviGridComponent,
  graviButtonComponent,
  formComponent,
  selectComponent,
  textoComponent,
  modalComponent,
  popoverComponent,
  horizontalComponent,
  verticalComponent,
  tabsComponent,
];

export {
  graviGridComponent,
  graviButtonComponent,
  formComponent,
  selectComponent,
  textoComponent,
  modalComponent,
  popoverComponent,
  horizontalComponent,
  verticalComponent,
  tabsComponent,
};