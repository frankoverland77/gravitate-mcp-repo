// Generic component code generation functions
import { ComponentInfo, UseCase } from "../types.js";

export function generateLayoutCode(
  componentName: string,
  componentInfo: ComponentInfo,
  useCase: UseCase
): string {
  if (componentName === "Horizontal") {
    switch (useCase) {
      case "basic":
        return `<Horizontal>
  <div>Left content</div>
  <div>Right content</div>
</Horizontal>`;

      case "full-example":
        return `<Horizontal 
  fullHeight 
  horizontalCenter 
  verticalCenter
  flex={1}
  border="subtle"
  style={{ padding: '16px' }}
>
  <Vertical flex={1}>
    <h2>Main Content</h2>
    <p>Your main content goes here</p>
  </Vertical>
  
  <Vertical flex={0} style={{ minWidth: '200px' }}>
    <h3>Sidebar</h3>
    <p>Sidebar content</p>
  </Vertical>
</Horizontal>`;

      default:
        return `<Horizontal alignItems="center" justifyContent="space-between">
  {/* Your content here */}
</Horizontal>`;
    }
  }

  if (componentName === "Vertical") {
    switch (useCase) {
      case "basic":
        return `<Vertical>
  <div>Top content</div>
  <div>Bottom content</div>
</Vertical>`;

      case "full-example":
        return `<Vertical 
  fullHeight 
  justifyContent="space-between"
  style={{ padding: '24px' }}
>
  <div>Header area</div>
  
  <Vertical flex={1} scroll>
    <h1>Main Content Area</h1>
    <p>Scrollable content goes here</p>
  </Vertical>
  
  <div>Footer area</div>
</Vertical>`;

      default:
        return `<Vertical justifyContent="center" alignItems="stretch">
  {/* Your content here */}
</Vertical>`;
    }
  }

  return `<${componentName}>
  {/* Add your content here */}
</${componentName}>`;
}

export function generateFormCode(
  componentName: string,
  componentInfo: ComponentInfo,
  useCase: UseCase
): string {
  return `<${componentName}>
  {/* Form implementation */}
</${componentName}>`;
}

export function generateGenericCode(
  componentName: string,
  componentInfo: ComponentInfo,
  useCase: UseCase
): string {
  const props = Object.keys(componentInfo.props || {});

  if (useCase === "with-props" && props.length > 0) {
    const exampleProps = props
      .slice(0, 3)
      .map((prop) => `${prop}={/* value */}`)
      .join("\n  ");
    return `<${componentName}
  ${exampleProps}
>
  {/* Content */}
</${componentName}>`;
  }

  return `<${componentName}>
  {/* Add your content here */}
</${componentName}>`;
}
