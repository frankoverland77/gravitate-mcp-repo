import {
  Horizontal,
  Vertical,
  Texto,
  GraviButton,
  BBDTag,
} from "@gravitate-js/excalibrr";
import {
  FontSizeOutlined,
  EditOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Card, Select, Switch, Slider, ColorPicker, Divider, Space, Button, Input } from "antd";
import { useState } from "react";

const { Option } = Select;

export function TextoExample() {
  // Interactive demo state
  const [selectedCategory, setSelectedCategory] = useState("p1");
  const [selectedAppearance, setSelectedAppearance] = useState("primary");
  const [selectedWeight, setSelectedWeight] = useState("normal");
  const [selectedAlign, setSelectedAlign] = useState("left");
  const [customColor, setCustomColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [showResponsive, setShowResponsive] = useState(false);

  const categories = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "heading", "heading-small", "p1", "p2"
  ];

  const appearances = [
    "primary", "secondary", "light", "medium",
    "error", "success", "warning"
  ];

  const sampleText = "The quick brown fox jumps over the lazy dog";
  const longText = "This is a longer text sample that demonstrates how Texto handles extended content with proper line height, spacing, and readability across different screen sizes and content lengths.";

  return (
    <Vertical style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <Texto className="mb-3" category="h3">
        Typography Showcase - Texto Component
      </Texto>

      {/* Typography Hierarchy */}
      <Card title="Typography Hierarchy" className="mb-4">
        <Vertical style={{ gap: "16px" }}>
          <Texto category="h6" style={{ color: "var(--theme-color-2)", marginBottom: "12px" }}>
            Heading Categories:
          </Texto>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'baseline' }}>
            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>h1:</Texto>
            <Texto category="h1">Main Page Title</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>h2:</Texto>
            <Texto category="h2">Section Heading</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>h3:</Texto>
            <Texto category="h3">Subsection Heading</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>h4:</Texto>
            <Texto category="h4">Component Title</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>h5:</Texto>
            <Texto category="h5">Card Header</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>h6:</Texto>
            <Texto category="h6">Small Header</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>heading:</Texto>
            <Texto category="heading">Primary Heading</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>heading-small:</Texto>
            <Texto category="heading-small">Secondary Heading</Texto>
          </div>

          <Divider />

          <Texto category="h6" style={{ color: "var(--theme-color-2)", marginBottom: "12px" }}>
            Body Text Categories:
          </Texto>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'baseline' }}>
            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>p1:</Texto>
            <Texto category="p1">Main body text with good readability for primary content</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>p2:</Texto>
            <Texto category="p2">Secondary text that's smaller and lighter for supporting information</Texto>

            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>default:</Texto>
            <Texto>Default text styling when no category is specified</Texto>
          </div>
        </Vertical>
      </Card>

      {/* Appearance Variations */}
      <Card title="Appearance Variations" className="mb-4">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Standard Appearances:</Texto>
            <Vertical style={{ gap: "8px" }}>
              <Texto appearance="primary">Primary text emphasis</Texto>
              <Texto appearance="secondary">Secondary text, less prominent</Texto>
              <Texto appearance="light">Light text for subtle content</Texto>
              <Texto appearance="medium">Medium emphasis text</Texto>
            </Vertical>
          </div>

          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Status Appearances:</Texto>
            <Vertical style={{ gap: "8px" }}>
              <Texto appearance="error">
                <ExclamationCircleOutlined className="mr-1" />
                Error message text
              </Texto>
              <Texto appearance="success">
                <CheckCircleOutlined className="mr-1" />
                Success message text
              </Texto>
              <Texto appearance="warning">
                <WarningOutlined className="mr-1" />
                Warning message text
              </Texto>
            </Vertical>
          </div>
        </div>
      </Card>

      {/* Interactive Demo */}
      <Card title="Interactive Typography Playground" className="mb-4">
        <Vertical style={{ gap: "20px" }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <Texto category="p2" className="mb-2">Category:</Texto>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: '100%' }}
              >
                {categories.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </div>

            <div>
              <Texto category="p2" className="mb-2">Appearance:</Texto>
              <Select
                value={selectedAppearance}
                onChange={setSelectedAppearance}
                style={{ width: '100%' }}
              >
                {appearances.map(app => (
                  <Option key={app} value={app}>{app}</Option>
                ))}
              </Select>
            </div>

            <div>
              <Texto category="p2" className="mb-2">Weight:</Texto>
              <Select
                value={selectedWeight}
                onChange={setSelectedWeight}
                style={{ width: '100%' }}
              >
                <Option value="normal">Normal</Option>
                <Option value="bold">Bold</Option>
                <Option value="600">Semi-bold (600)</Option>
                <Option value="300">Light (300)</Option>
              </Select>
            </div>

            <div>
              <Texto category="p2" className="mb-2">Alignment:</Texto>
              <Select
                value={selectedAlign}
                onChange={setSelectedAlign}
                style={{ width: '100%' }}
              >
                <Option value="left">Left</Option>
                <Option value="center">Center</Option>
                <Option value="right">Right</Option>
                <Option value="justify">Justify</Option>
              </Select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <Texto category="p2" className="mb-2">Font Size: {fontSize}px</Texto>
              <Slider
                min={10}
                max={32}
                value={fontSize}
                onChange={setFontSize}
              />
            </div>

            <div>
              <Texto category="p2" className="mb-2">Line Height: {lineHeight}</Texto>
              <Slider
                min={1}
                max={2.5}
                step={0.1}
                value={lineHeight}
                onChange={setLineHeight}
              />
            </div>

            <div>
              <Texto category="p2" className="mb-2">Letter Spacing: {letterSpacing}px</Texto>
              <Slider
                min={-1}
                max={3}
                step={0.1}
                value={letterSpacing}
                onChange={setLetterSpacing}
              />
            </div>
          </div>

          <div style={{ padding: '20px', border: '2px dashed var(--theme-color-3)', borderRadius: '8px', backgroundColor: 'var(--theme-bg-elevated)' }}>
            <Texto category="p2" className="mb-3" style={{ color: "var(--theme-color-3)" }}>
              Live Preview:
            </Texto>
            <Texto
              category={selectedCategory as any}
              appearance={selectedAppearance as any}
              weight={selectedWeight}
              align={selectedAlign as any}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}px`,
              }}
            >
              {longText}
            </Texto>
          </div>
        </Vertical>
      </Card>

      {/* Color and Theme Examples */}
      <Card title="Color and Theming" className="mb-4">
        <Vertical style={{ gap: "20px" }}>
          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Theme Colors:</Texto>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              <Texto style={{ color: 'var(--theme-color-2)' }}>
                Theme color 2 (var(--theme-color-2))
              </Texto>
              <Texto style={{ color: 'var(--theme-color-3)' }}>
                Theme color 3 (var(--theme-color-3))
              </Texto>
              <Texto style={{ color: 'var(--theme-error)' }}>
                Error theme color (var(--theme-error))
              </Texto>
              <Texto style={{ color: 'var(--theme-success)' }}>
                Success theme color (var(--theme-success))
              </Texto>
              <Texto style={{ color: 'var(--theme-warning)' }}>
                Warning theme color (var(--theme-warning))
              </Texto>
              <Texto style={{ color: 'var(--theme-primary)' }}>
                Primary theme color (var(--theme-primary))
              </Texto>
            </div>
          </div>

          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Custom Colors:</Texto>
            <Horizontal style={{ gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Texto style={{ color: '#1890ff' }}>Custom blue (#1890ff)</Texto>
              <Texto style={{ color: '#52c41a' }}>Custom green (#52c41a)</Texto>
              <Texto style={{ color: '#faad14' }}>Custom orange (#faad14)</Texto>
              <Texto style={{ color: '#f5222d' }}>Custom red (#f5222d)</Texto>
              <Texto style={{ color: '#722ed1' }}>Custom purple (#722ed1)</Texto>
            </Horizontal>
          </div>
        </Vertical>
      </Card>

      {/* Interactive Text Patterns */}
      <Card title="Interactive Text Patterns" className="mb-4">
        <Vertical style={{ gap: "20px" }}>
          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Clickable Text:</Texto>
            <Horizontal style={{ gap: '16px', flexWrap: 'wrap' }}>
              <Texto
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: 'var(--theme-primary)'
                }}
                onClick={() => alert('Link clicked!')}
              >
                <LinkOutlined className="mr-1" />
                Clickable link text
              </Texto>

              <Texto
                style={{ cursor: 'pointer' }}
                className="hover:text-blue-600"
                onClick={() => alert('Action triggered!')}
              >
                <EditOutlined className="mr-1" />
                Edit action
              </Texto>

              <Texto
                style={{
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                className="hover:bg-gray-100"
                onClick={() => alert('Button-style text clicked!')}
              >
                <CopyOutlined className="mr-1" />
                Copy to clipboard
              </Texto>
            </Horizontal>
          </div>

          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Text with States:</Texto>
            <Vertical style={{ gap: '8px' }}>
              <Texto style={{ opacity: 0.5 }}>
                Disabled text (reduced opacity)
              </Texto>
              <Texto style={{ textDecoration: 'line-through', color: 'var(--theme-color-3)' }}>
                Strikethrough text (deleted)
              </Texto>
              <Texto style={{ backgroundColor: '#fff2b8', padding: '2px 4px', borderRadius: '3px' }}>
                Highlighted text
              </Texto>
            </Vertical>
          </div>
        </Vertical>
      </Card>

      {/* Common UI Patterns */}
      <Card title="Common UI Patterns" className="mb-4">
        <Vertical style={{ gap: "24px" }}>
          {/* Card Header Pattern */}
          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Card Headers:</Texto>
            <Card size="small">
              <Texto category="h5" className="mb-2" style={{ color: 'var(--theme-color-2)' }}>
                Card Title
              </Texto>
              <Texto category="p2" appearance="secondary">
                Card description or subtitle providing additional context
              </Texto>
            </Card>
          </div>

          {/* Form Labels Pattern */}
          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Form Labels:</Texto>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <Texto category="p1" style={{ fontWeight: '600', marginBottom: '4px' }}>
                  Required Field *
                </Texto>
                <Input placeholder="Enter value" />
                <Texto category="p2" appearance="secondary" style={{ marginTop: '4px' }}>
                  Additional field information or hints
                </Texto>
              </div>

              <div>
                <Texto category="p1" style={{ fontWeight: '600', marginBottom: '4px' }}>
                  Field with Error
                </Texto>
                <Input placeholder="Enter value" status="error" />
                <Texto category="p2" appearance="error" style={{ marginTop: '4px' }}>
                  <ExclamationCircleOutlined className="mr-1" />
                  This field is required
                </Texto>
              </div>
            </div>
          </div>

          {/* Navigation Pattern */}
          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Navigation Items:</Texto>
            <Horizontal style={{ gap: '24px' }}>
              <Texto
                category="p1"
                style={{
                  fontWeight: 'bold',
                  color: 'var(--theme-primary)',
                  borderBottom: '2px solid var(--theme-primary)',
                  paddingBottom: '4px'
                }}
              >
                Active Menu Item
              </Texto>
              <Texto
                category="p1"
                appearance="secondary"
                style={{ cursor: 'pointer', paddingBottom: '4px' }}
              >
                Inactive Menu Item
              </Texto>
              <Texto
                category="p1"
                style={{
                  cursor: 'pointer',
                  paddingBottom: '4px',
                  opacity: 0.5
                }}
              >
                Disabled Menu Item
              </Texto>
            </Horizontal>
          </div>

          {/* Data Display Pattern */}
          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>Data Display:</Texto>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '16px',
              border: '1px solid var(--theme-color-3)',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Texto category="p2" appearance="secondary">Name:</Texto>
                <Texto category="p2" weight="bold">John Doe</Texto>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Texto category="p2" appearance="secondary">Email:</Texto>
                <Texto category="p2">john@example.com</Texto>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Texto category="p2" appearance="secondary">Status:</Texto>
                <BBDTag success>Active</BBDTag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Texto category="p2" appearance="secondary">Balance:</Texto>
                <Texto
                  category="p1"
                  weight="bold"
                  style={{
                    fontFamily: 'monospace',
                    color: 'var(--theme-success)'
                  }}
                >
                  $1,234.56
                </Texto>
              </div>
            </div>
          </div>

          {/* User Profile Pattern */}
          <div>
            <Texto category="h6" style={{ marginBottom: "12px" }}>User Profile Card:</Texto>
            <Card size="small" style={{ maxWidth: '400px' }}>
              <Horizontal style={{ gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--theme-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  <UserOutlined />
                </div>
                <Vertical style={{ flex: 1 }}>
                  <Texto category="h6" style={{ marginBottom: '4px' }}>
                    Sarah Wilson
                  </Texto>
                  <Texto category="p2" appearance="secondary">
                    <MailOutlined className="mr-1" />
                    sarah.wilson@company.com
                  </Texto>
                  <Texto category="p2" appearance="secondary">
                    <CalendarOutlined className="mr-1" />
                    Joined March 2023
                  </Texto>
                </Vertical>
              </Horizontal>
            </Card>
          </div>
        </Vertical>
      </Card>

      {/* Responsive Typography */}
      <Card title="Responsive Typography" className="mb-4">
        <Vertical style={{ gap: "16px" }}>
          <Horizontal style={{ gap: '16px', alignItems: 'center' }}>
            <Texto category="p2">Show responsive examples:</Texto>
            <Switch checked={showResponsive} onChange={setShowResponsive} />
          </Horizontal>

          {showResponsive && (
            <div>
              <Texto category="p2" className="mb-3" style={{ color: 'var(--theme-color-3)' }}>
                Resize your browser window to see how these responsive text examples adapt:
              </Texto>

              <Vertical style={{ gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  border: '1px solid var(--theme-color-3)',
                  borderRadius: '8px'
                }}>
                  <Texto
                    category="h3"
                    style={{
                      fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                      lineHeight: '1.4'
                    }}
                  >
                    Responsive Heading
                  </Texto>
                  <Texto
                    category="p1"
                    style={{
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                      lineHeight: 'clamp(1.4, 1.6, 1.8)',
                      marginTop: 'clamp(0.5rem, 2vw, 1rem)'
                    }}
                  >
                    This paragraph text scales smoothly between minimum and maximum sizes
                    based on the viewport width, providing optimal readability across all device sizes.
                  </Texto>
                </div>

                <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>
                  Responsive typography uses CSS clamp() function to scale smoothly between breakpoints.
                </Texto>
              </Vertical>
            </div>
          )}
        </Vertical>
      </Card>

      {/* Best Practices */}
      <Card title="Best Practices & Guidelines" className="mb-4" style={{ backgroundColor: "var(--theme-bg-elevated)" }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div>
            <Texto category="p1" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
              Hierarchy & Consistency:
            </Texto>
            <ul style={{ marginLeft: '16px', lineHeight: '1.6' }}>
              <li><Texto category="p2">Use heading categories for proper document structure</Texto></li>
              <li><Texto category="p2">Maintain consistent spacing between text elements</Texto></li>
              <li><Texto category="p2">Use appearance props for semantic meaning</Texto></li>
              <li><Texto category="p2">Combine category and appearance for optimal readability</Texto></li>
            </ul>
          </div>

          <div>
            <Texto category="p1" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
              Performance & Styling:
            </Texto>
            <ul style={{ marginLeft: '16px', lineHeight: '1.6' }}>
              <li><Texto category="p2">Prefer CSS classes over inline styles</Texto></li>
              <li><Texto category="p2">Use theme CSS variables for consistent coloring</Texto></li>
              <li><Texto category="p2">Avoid excessive nesting of styled components</Texto></li>
              <li><Texto category="p2">Use appropriate font weights without overuse</Texto></li>
            </ul>
          </div>

          <div>
            <Texto category="p1" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
              Accessibility & UX:
            </Texto>
            <ul style={{ marginLeft: '16px', lineHeight: '1.6' }}>
              <li><Texto category="p2">Ensure sufficient color contrast for all text</Texto></li>
              <li><Texto category="p2">Use semantic categories for screen readers</Texto></li>
              <li><Texto category="p2">Provide clear visual hierarchy with sizing</Texto></li>
              <li><Texto category="p2">Test text scaling and responsive behavior</Texto></li>
            </ul>
          </div>
        </div>
      </Card>
    </Vertical>
  );
}