// Vertical Component Examples

export interface ComponentExample {
  id?: string;
  name: string;
  description: string;
  code: string;
  category?: string;
  complexity: "simple" | "medium" | "complex";
  tags?: string[];
  props?: Record<string, any>;
  dependencies?: string[];
  notes?: string;
  sourceFile?: string;
}

export const VERTICAL_EXAMPLES: ComponentExample[] = [
  {
    name: "Simple Container Wrapper",
    description:
      "Basic vertical container with flex property - simplest usage pattern",
    category: "layout",
    complexity: "simple",
    tags: ["container", "flex", "simple", "wrapper"],
    code: `import { Vertical } from '@gravitate-js/excalibrr';
import React from 'react';

function SimpleContainer({ children }) {
  return (
    <Vertical flex={1}>
      {children}
    </Vertical>
  );
}

export default SimpleContainer;`,
  },

  {
    name: "Label Value Display",
    description: "Simple label-value pattern common in forms and displays",
    category: "display",
    complexity: "simple",
    tags: ["label", "value", "display", "text"],
    code: `import { Vertical, Texto } from '@gravitate-js/excalibrr';
import React from 'react';

function LabelValueDisplay({ label, value, width = 100 }) {
  return (
    <Vertical style={{ width }}>
      <Texto category='p2'>{label}</Texto>
      <Texto category='h5' className='mt-3' weight={600} style={{ whiteSpace: 'pre-wrap' }}>
        {value}
      </Texto>
    </Vertical>
  );
}

export default LabelValueDisplay;`,
  },

  {
    name: "Quick Metrics Display",
    description: "Vertical stack of metric components with consistent spacing",
    category: "metrics",
    complexity: "simple",
    tags: ["metrics", "spacing", "gap", "stack"],
    code: `import { Vertical } from '@gravitate-js/excalibrr';
import { DollarOutlined, LineChartOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import React from 'react';

function QuickMetricsDisplay({ quickMetrics, QuickMetric }) {
  return (
    <Vertical gap="0.5rem" justifyContent='space-evenly'>
      <QuickMetric
        icon={DollarOutlined}
        label='Average Benchmark Diff'
        value={quickMetrics?.AverageDelta}
        format='price'
      />
      <QuickMetric
        icon={VerticalAlignBottomOutlined}
        label='Average Lifting'
        value={quickMetrics?.AverageLifting}
        format='volume'
      />
      <QuickMetric 
        icon={LineChartOutlined} 
        label='Average Margin' 
        value={quickMetrics?.AverageMargin} 
        format='price' 
      />
    </Vertical>
  );
}

export default QuickMetricsDisplay;`,
  },

  {
    name: "Radio Button Group with Mapping",
    description:
      "Form field with mapped radio options using consistent spacing",
    category: "forms",
    complexity: "medium",
    tags: ["radio", "mapping", "form", "options"],
    code: `import { Vertical, Texto } from '@gravitate-js/excalibrr';
import { Form, Radio } from 'antd';
import React from 'react';

function RadioButtonGroup({ subTypes, selectedSubtype, onChange }) {
  return (
    <Vertical flex={2} gap={16}>
      <Texto
        className='pb-1'
        category='h5'
        style={{ borderBottom: 'solid 1px var(--gray-500)', color: 'var(--theme-option)' }}
      >
        DEAL TYPE
      </Texto>
      <Form.Item
        name='SelectedSubtype'
        rules={[{ required: true, message: 'Deal Type is required' }]}
      >
        <Radio.Group onChange={onChange}>
          {subTypes?.map((option) => (
            <Radio
              className='mb-4'
              key={option.MarketPlatformInstrumentSubtypeId}
              value={option?.MarketPlatformInstrumentSubtypeId}
            >
              <Texto category='h4'>{option.Name}</Texto>
              <Texto category='p1'>{option.Description}</Texto>
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </Vertical>
  );
}

export default RadioButtonGroup;`,
  },

  {
    name: "Form Field Container",
    description: "Structured form field with label and input components",
    category: "forms",
    complexity: "medium",
    tags: ["form", "field", "label", "input", "structure"],
    code: `import { Vertical, Texto } from '@gravitate-js/excalibrr';
import { Form, Input } from 'antd';
import React from 'react';

function FormFieldContainer({ label, name, required = false, placeholder }) {
  return (
    <Vertical flex={1} className='my-2 mx-4'>
      <Texto className='py-2'>{label}</Texto>
      <Form.Item 
        hasFeedback 
        name={name}
        rules={required ? [{ required: true, message: \`\${label} is required\` }] : []}
      >
        <Input placeholder={placeholder} />
      </Form.Item>
    </Vertical>
  );
}

export default FormFieldContainer;`,
  },

  {
    name: "Two Column Layout Component",
    description:
      "Layout building block using flex ratios for responsive design",
    category: "layout",
    complexity: "medium",
    tags: ["layout", "flex", "ratio", "responsive", "columns"],
    code: `import { Horizontal, Vertical } from '@gravitate-js/excalibrr';
import React from 'react';

function TwoColumnLayout({ 
  LeftComponent, 
  RightComponent, 
  leftFlex = 1, 
  rightFlex = 3,
  spacing 
}) {
  return (
    <Horizontal 
      className='p-3' 
      gap={spacing}
      fullHeight
    >
      <Vertical flex={leftFlex}>
        <LeftComponent />
      </Vertical>
      <Vertical flex={rightFlex}>
        <RightComponent />
      </Vertical>
    </Horizontal>
  );
}

export default TwoColumnLayout;`,
  },

  {
    name: "Stacked Data Grids",
    description: "Vertical stack of data grids with equal heights and spacing",
    category: "data",
    complexity: "medium",
    tags: ["grid", "stack", "data", "equal-height"],
    code: `import { Vertical, Horizontal, GraviGrid } from '@gravitate-js/excalibrr';
import React from 'react';

function StackedDataGrids({ promptData, forwardData, isFetching, columnDefs }) {
  return (
    <Vertical className='mt-4 justify-sb'>
      <Horizontal className='bg-1' height='50%'>
        <div style={{ width: '100%' }}>
          <GraviGrid
            agPropOverrides={{
              rowGroupPanelShow: 'never',
              columnDefs: columnDefs.prompt,
              getRowId: (row) => row?.data?.TradeEntryId,
            }}
            rowData={promptData}
            loading={isFetching}
            controlBarProps={{ title: 'Pending Prompts' }}
          />
        </div>
      </Horizontal>
      <Horizontal height='50%' className='bg-1 mt-4'>
        <div style={{ width: '100%' }}>
          <GraviGrid
            agPropOverrides={{
              rowGroupPanelShow: 'never',
              columnDefs: columnDefs.forward,
              getRowId: (row) => row?.data?.TradeEntryId,
            }}
            rowData={forwardData}
            loading={isFetching}
            controlBarProps={{ title: 'Pending Forwards' }}
          />
        </div>
      </Horizontal>
    </Vertical>
  );
}

export default StackedDataGrids;`,
  },

  {
    name: "Product Listing Container",
    description: "List container with header and scrollable mapped content",
    category: "list",
    complexity: "medium",
    tags: ["list", "mapping", "scroll", "header"],
    code: `import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr';
import React from 'react';

function ProductListingContainer({ groupedProductListings, ProductListing }) {
  return (
    <Vertical height='100%'>
      <Horizontal className='p-4 bg-2' verticalCenter>
        <Texto category='h3'>Product Listings</Texto>
      </Horizontal>
      <div style={{ overflowY: 'auto' }}>
        {groupedProductListings?.map((item) => (
          <ProductListing listing={item} key={item.LocationName} />
        ))}
      </div>
    </Vertical>
  );
}

// Inside ProductListing component example:
function ProductListing({ listing }) {
  return (
    <Vertical>
      {listing?.Products.map((product) => (
        <ProductListingRow product={product} key={product?.ProductId} />
      ))}
    </Vertical>
  );
}

export default ProductListingContainer;`,
  },

  {
    name: "Complex Form Section with Card Styling",
    description:
      "Form section with styled container, header, and multiple field groups",
    category: "forms",
    complexity: "complex",
    tags: ["form", "card", "styled", "groups", "complex"],
    code: `import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr';
import { Form, Input, Select } from 'antd';
import React from 'react';

function ComplexFormSection({ metadata, title }) {
  return (
    <Vertical 
      className='bg-1 bordered pb-4' 
      style={{ borderRadius: 8, overflow: 'hidden' }} 
      flex='none' 
      height='auto'
    >
      <Horizontal className='p-4 bg-2 border-bottom'>
        <Texto category='h6' className='ml-3 font-weight-normal'>
          {title}
        </Texto>
      </Horizontal>
      <Horizontal className='px-4 py-3' />
      <Horizontal className='px-4 w-100'>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Internal Contract Number</Texto>
          <Form.Item hasFeedback name='InternalContractNumber'>
            <Input />
          </Form.Item>
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>External Contract Number</Texto>
          <Form.Item hasFeedback name='ExternalContractNumber'>
            <Input />
          </Form.Item>
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Movement Type</Texto>
          <Form.Item hasFeedback name='MovementTypeCvId'>
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              options={metadata?.MovementTypes?.map((item) => ({
                value: Number(item.Value),
                label: item.Text,
              }))}
            />
          </Form.Item>
        </Vertical>
      </Horizontal>
    </Vertical>
  );
}

export default ComplexFormSection;`,
  },

  {
    name: "Multi-Row Header Display",
    description:
      "Structured header with multiple information rows and status display",
    category: "header",
    complexity: "complex",
    tags: ["header", "multi-row", "status", "information"],
    code: `import { Vertical, Horizontal, Texto, BBDTag } from '@gravitate-js/excalibrr';
import { ClockCircleOutlined } from '@ant-design/icons';
import React from 'react';

function MultiRowHeaderDisplay({ orderDetails, getStatus }) {
  const showOrderPrice = orderDetails?.ContractPricingMethodCodeValueMeaning !== 'DeliveryPeriod';

  return (
    <Horizontal className='secondary-gradient-background py-2 px-4' width='100%' flex={1}>
      <Vertical className='py-2' gap={2}>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Texto appearance='white' category='h4'>
            Order# {orderDetails?.TradeEntryId}
          </Texto>
          {getStatus(orderDetails?.OrderStatusCodeValueMeaning)}
        </Horizontal>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Texto appearance='white' category='h3'>
            {orderDetails?.ProductName}
          </Texto>
          <Texto appearance='white' category='h3'>
            {orderDetails?.Quantity || 0} GAL(S)
          </Texto>
        </Horizontal>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Texto appearance='white' category='h4'>
            {orderDetails?.FromLocationName}
          </Texto>
          {showOrderPrice && (
            <Texto appearance='white' category='h4'>
              {orderDetails?.Price || 0} gal
            </Texto>
          )}
        </Horizontal>
      </Vertical>
    </Horizontal>
  );
}

export default MultiRowHeaderDisplay;`,
  },

  {
    name: "Split Pane Modal Layout",
    description: "Complex modal with scrollable main content and fixed sidebar",
    category: "modal",
    complexity: "complex",
    tags: ["modal", "split", "scrollable", "sidebar", "complex"],
    code: `import { Horizontal, Vertical } from '@gravitate-js/excalibrr';
import React from 'react';

function SplitPaneModalLayout({ 
  PricingInformation, 
  VolumeAllocation, 
  AdditionalOptions, 
  OrderDisplay,
  form,
  orderEntryInfo 
}) {
  return (
    <Horizontal fullHeight>
      <Vertical className='mx-4' flex={5.5}>
        <div style={{ overflowY: 'auto' }}>
          <Horizontal className='mx-4 pb-2' gap={20}>
            <PricingInformation 
              form={form} 
              orderEntryInfo={orderEntryInfo} 
            />
            <VolumeAllocation 
              form={form}
              orderEntryInfo={orderEntryInfo}
            />
          </Horizontal>
          <Horizontal className='mx-4 mb-2 pt-4 border-top'>
            <AdditionalOptions 
              form={form}
              orderEntryInfo={orderEntryInfo}
            />
          </Horizontal>
        </div>
      </Vertical>
      <Vertical style={{ backgroundColor: 'var(--gray-800)', flex: 2 }}>
        <OrderDisplay 
          form={form}
          orderEntryInfo={orderEntryInfo}
        />
      </Vertical>
    </Horizontal>
  );
}

export default SplitPaneModalLayout;`,
  },

  {
    name: "Conditional Error Display",
    description:
      "Error display with conditional rendering and nested layout components",
    category: "feedback",
    complexity: "complex",
    tags: ["error", "conditional", "nested", "feedback"],
    code: `import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';
import { ClockCircleFilled } from '@ant-design/icons';
import React from 'react';

function ConditionalErrorDisplay({ error }) {
  return (
    error && (
      <Horizontal
        className='px-4 py-2 round-border'
        style={{ backgroundColor: 'var(--theme-error-dim)' }}
        flex={1}
        verticalCenter
      >
        <Vertical verticalCenter flex={0}>
          <Horizontal verticalCenter gap={10}>
            <ClockCircleFilled style={{ color: 'var(--theme-error)', fontSize: 12 }} />
            <Texto category='p2' appearance='error'>
              VOLUME ERROR
            </Texto>
          </Horizontal>
        </Vertical>
        <Vertical verticalCenter flex={0}>
          <Horizontal className='justify-end'>
            <Texto category='p2' weight={900} appearance='error'>
              {error}
            </Texto>
          </Horizontal>
        </Vertical>
      </Horizontal>
    )
  );
}

export default ConditionalErrorDisplay;`,
  },

  {
    name: "Dashboard Widget Grid Columns",
    description: "Dashboard layout with mapped widgets and dynamic spacing",
    category: "dashboard",
    complexity: "complex",
    tags: ["dashboard", "widgets", "mapping", "spacing", "dynamic"],
    code: `import { Horizontal, Vertical } from '@gravitate-js/excalibrr';
import React from 'react';

function DashboardWidgetGrid({ widgets, WidgetContainer }) {
  return (
    <>
      <Horizontal 
        style={{ width: '100%', height: '100%' }} 
        flex={1} 
        justifyContent='space-between' 
        className='mb-4'
      >
        {widgets.slice(0, 3).map((widget, index) => {
          if (index < 3) {
            const className = index === 1 ? 'mx-4 mb-2' : 'mb-2';
            return (
              <Vertical flex={1} key={widget.title} className={className}>
                <WidgetContainer
                  title={widget.title}
                  columnDefs={widget.columnDefs}
                  gridDataWithStatus={widget.data}
                  gridSettings={widget.settings}
                  isLoading={widget.isLoading}
                />
              </Vertical>
            );
          }
          return null;
        })}
      </Horizontal>
      <Vertical flex={1} className='mb-4'>
        {widgets.slice(3).map((widget) => (
          <WidgetContainer
            title={widget.title}
            columnDefs={widget.columnDefs}
            gridDataWithStatus={widget.data}
            key={widget.title}
          />
        ))}
      </Vertical>
    </>
  );
}

export default DashboardWidgetGrid;`,
  },

  {
    name: "Complex Form with Conditional Sections",
    description:
      "Advanced form layout with conditional sections and mixed content types",
    category: "forms",
    complexity: "complex",
    tags: ["form", "conditional", "sections", "complex", "mixed"],
    code: `import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr';
import { Form, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React from 'react';

function ComplexConditionalForm({ 
  selectedAdditionalProducts,
  selectedAdditionalLocations,
  AdditionalProducts,
  AdditionalLocations,
  DestinationStates,
  LoadingNumbers,
  ContactSelect,
  InternalCounterparty,
  currentCounterParty,
  orderEntryInfo 
}) {
  return (
    <Vertical>
      {selectedAdditionalProducts && (
        <div>
          <Horizontal className='justify-sb' verticalCenter>
            <Texto category='h5' className='mb-1' appearance='secondary'>
              Additional Products
              <Tooltip title='Additional product pricing is an average across the period'>
                <InfoCircleOutlined className='ml-2' style={{ color: 'var(--theme-warning)' }} />
              </Tooltip>
            </Texto>
            <Texto category='p1' appearance='medium'>
              *Checked products can be optionally lifted
            </Texto>
          </Horizontal>
          <AdditionalProducts />
        </div>
      )}
      
      {selectedAdditionalLocations && (
        <div>
          <Horizontal className='justify-sb' verticalCenter>
            <Texto category='h5' className='mb-1' appearance='secondary'>
              Additional Locations
            </Texto>
          </Horizontal>
          <AdditionalLocations />
        </div>
      )}
      
      <Vertical className='border-bottom'>
        <DestinationStates orderEntryInfo={orderEntryInfo} />
        <LoadingNumbers orderEntryInfo={orderEntryInfo} />
      </Vertical>
      
      <Texto category='h5' className='my-3' appearance='secondary'>
        Counterparty Info
      </Texto>
      <Horizontal gap={20}>
        {currentCounterParty && (
          <Vertical style={{ width: 100 }}>
            <Texto category='p2'>COUNTERPARTY</Texto>
            <Texto category='h5' className='mt-3' weight={600}>
              {currentCounterParty}
            </Texto>
          </Vertical>
        )}
        {orderEntryInfo?.Data?.IsInternalUser && (
          <>
            <Vertical>
              <ContactSelect orderEntryInfo={orderEntryInfo} />
            </Vertical>
            <Vertical>
              <InternalCounterparty orderEntryInfo={orderEntryInfo} />
            </Vertical>
          </>
        )}
      </Horizontal>
    </Vertical>
  );
}

export default ComplexConditionalForm;`,
  },

  {
    name: "Footer Button Groups",
    description: "Footer layout with button groups and conditional rendering",
    category: "navigation",
    complexity: "medium",
    tags: ["footer", "buttons", "conditional", "groups"],
    code: `import { Horizontal, Vertical, GraviButton } from '@gravitate-js/excalibrr';
import { SaveOutlined, ArrowRightOutlined, UploadOutlined } from '@ant-design/icons';
import React from 'react';

function FooterButtonGroups({ 
  onClickCancel, 
  onClick, 
  disabled, 
  loading, 
  buttonTitle, 
  contract,
  isMakingActive 
}) {
  return (
    <Horizontal flex='none' width='auto'>
      {onClickCancel && (
        <Vertical horizontalCenter>
          <GraviButton
            style={{ height: 35, fontSize: 15 }}
            className='px-4 mr-3'
            onClick={onClickCancel}
            disabled={disabled}
            buttonText='Cancel'
          />
        </Vertical>
      )}
      <Vertical />
      <Vertical>
        <GraviButton
          icon={buttonTitle.includes('Save') ? <SaveOutlined /> : <ArrowRightOutlined />}
          style={{ height: 35, fontSize: 15 }}
          theme2={contract?.OrderStatusCodeValueDisplay !== 'Draft'}
          loading={loading}
          onClick={() => onClick('SaveChanges')}
          disabled={disabled}
          buttonText={buttonTitle}
          className='px-4 mr-3'
        />
      </Vertical>
      {contract?.OrderStatusCodeValueDisplay === 'Draft' && (
        <GraviButton
          icon={<UploadOutlined />}
          style={{ height: 35, fontSize: 15 }}
          theme2
          loading={isMakingActive}
          disabled={isMakingActive || loading}
          onClick={() => onClick('MakeActive')}
          buttonText='Make Contract Active'
        />
      )}
    </Horizontal>
  );
}

export default FooterButtonGroups;`,
  },

  {
    name: "Empty Vertical Spacer",
    description: "Using empty Vertical component as a spacer element",
    category: "layout",
    complexity: "simple",
    tags: ["spacer", "empty", "layout", "spacing"],
    code: `import { Horizontal, Vertical, GraviButton } from '@gravitate-js/excalibrr';
import React from 'react';

function ButtonGroupWithSpacer({ buttons }) {
  return (
    <Horizontal flex='none' width='auto'>
      <Vertical horizontalCenter>
        <GraviButton buttonText={buttons[0].text} onClick={buttons[0].onClick} />
      </Vertical>
      <Vertical /> {/* Empty spacer */}
      <Vertical>
        <GraviButton buttonText={buttons[1].text} onClick={buttons[1].onClick} />
      </Vertical>
    </Horizontal>
  );
}

export default ButtonGroupWithSpacer;`,
  },
];
