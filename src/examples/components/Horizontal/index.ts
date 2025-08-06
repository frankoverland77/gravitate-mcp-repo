// Horizontal Component Examples

import type { ComponentExample } from "../../index.js";

export const HORIZONTAL_EXAMPLES: ComponentExample[] = [
  {
    name: "Simple Icon Text Container",
    description:
      "Basic horizontal layout combining an icon with text using vertical alignment",
    category: "layout",
    complexity: "basic",
    tags: ["icon", "text", "alignment", "simple"],
    code: `import { Horizontal, Texto } from '@gravitate-js/excalibrr';
import { CheckCircleOutlined } from '@ant-design/icons';
import React from 'react';

function IconTextContainer({ icon, text }) {
  return (
    <Horizontal verticalCenter>
      {icon || <CheckCircleOutlined />}
      <Texto>{text}</Texto>
    </Horizontal>
  );
}

export default IconTextContainer;`,
  },

  {
    name: "Success Message Display",
    description:
      "Centered success message with icon and text using horizontal and vertical centering",
    category: "feedback",
    complexity: "basic",
    tags: ["success", "message", "centered", "modal"],
    code: `import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';
import { CheckCircleFilled } from '@ant-design/icons';
import React from 'react';

function SuccessMessage({ orderNumber }) {
  return (
    <Horizontal verticalCenter horizontalCenter style={{ minWidth: 500 }}>
      <Vertical className='p-3'>
        <CheckCircleFilled style={{ fontSize: 50 }} />
      </Vertical>
      <Vertical>
        <Texto category='h4' appearance='default'>
          Order #{orderNumber || ''} Saved Successfully
        </Texto>
      </Vertical>
    </Horizontal>
  );
}

export default SuccessMessage;`,
  },

  {
    name: "Status Bar Display",
    description:
      "Simple status bar with background color and justified content",
    category: "status",
    complexity: "basic",
    tags: ["status", "bar", "background", "justify"],
    code: `import { Horizontal } from '@gravitate-js/excalibrr';
import React from 'react';

function StatusBar({ text, backgroundColor = 'var(--gray-100)' }) {
  return (
    <Horizontal 
      className='p-3' 
      justifyContent='space-between' 
      style={{ backgroundColor }}
    >
      {text}
    </Horizontal>
  );
}

export default StatusBar;`,
  },

  {
    name: "Header Control Bar",
    description:
      "Complex header layout with nested horizontal containers for organized controls",
    category: "navigation",
    complexity: "intermediate",
    tags: ["header", "controls", "nested", "responsive"],
    code: `import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { Switch } from 'antd';
import React from 'react';

function HeaderControlBar({ 
  currentlySelectedPageView, 
  alertsOnly, 
  setAlertsOnly,
  setIsPageViewSettingsDrawerOpen 
}) {
  return (
    <Horizontal justifyContent='space-between' verticalCenter className='w-full p-2'>
      <Horizontal verticalCenter>
        <Horizontal verticalCenter className='mr-4'>
          <Texto className='mr-2 text-truncate' style={{ maxWidth: '25vw' }}>
            View: {currentlySelectedPageView || 'Default'}
          </Texto>
          <GraviButton 
            buttonText={'Page Views'} 
            onClick={() => setIsPageViewSettingsDrawerOpen((prev) => !prev)} 
          />
        </Horizontal>
        <Horizontal verticalCenter>
          <Texto className='mr-2'>Alerts Only </Texto>
          <Switch 
            checked={alertsOnly} 
            onChange={(checked) => setAlertsOnly(checked)} 
          />
        </Horizontal>
      </Horizontal>
    </Horizontal>
  );
}

export default HeaderControlBar;`,
  },

  {
    name: "Form Field Layout",
    description:
      "Form layout with controlled spacing using gap and flex properties",
    category: "forms",
    complexity: "intermediate",
    tags: ["form", "fields", "gap", "flex", "spacing"],
    code: `import { Horizontal } from '@gravitate-js/excalibrr';
import React from 'react';

function FormFieldLayout({ 
  PriceAndVolumeFields, 
  ExpiryField, 
  canWrite, 
  orderDetails 
}) {
  return (
    <Horizontal 
      verticalCenter 
      className='m-1' 
      justifyContent='flex-end' 
      style={{ gap: '15px' }}
    >
      <Horizontal flex={1} verticalCenter style={{ minWidth: '325px' }}>
        <PriceAndVolumeFields />
      </Horizontal>
      <ExpiryField canWrite={canWrite} orderDetails={orderDetails} />
    </Horizontal>
  );
}

export default FormFieldLayout;`,
  },

  {
    name: "Action Button Toolbar",
    description:
      "Toolbar with action buttons using consistent spacing and conditional rendering",
    category: "actions",
    complexity: "intermediate",
    tags: ["toolbar", "buttons", "conditional", "spacing"],
    code: `import { Horizontal, GraviButton } from '@gravitate-js/excalibrr';
import { DownloadOutlined } from '@ant-design/icons';
import React from 'react';

function ActionButtonToolbar({ 
  IsInternalUser,
  onlyAssigned,
  toggleOnlyAssigned,
  handleClearSelection,
  handleCSVExport,
  AssignedSwitch 
}) {
  return (
    <Horizontal style={{ gap: '0.5rem' }} alignItems='center'>
      {IsInternalUser && (
        <div data-testid='tasToggleWrapper'>
          <AssignedSwitch 
            onlyAssigned={onlyAssigned} 
            toggleOnlyAssigned={toggleOnlyAssigned} 
          />
        </div>
      )}
      <GraviButton
        data-testid='clearSelectionButton'
        buttonText='Clear Selection'
        onClick={handleClearSelection}
      />
      <GraviButton
        data-testid='exportToCsvButton'
        buttonText='Export to CSV'
        onClick={handleCSVExport}
        icon={<DownloadOutlined />}
      />
    </Horizontal>
  );
}

export default ActionButtonToolbar;`,
  },

  {
    name: "Data Metrics Card",
    description:
      "Card layout for displaying metrics with header and data sections",
    category: "data",
    complexity: "intermediate",
    tags: ["metrics", "card", "data", "display"],
    code: `import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';
import React from 'react';

function DataMetricsCard({ title, data }) {
  return (
    <Horizontal flex={1} justifyContent='center' className='my-1 mx-2 px-4 display-card-container'>
      <Vertical flex={1} className='p-2 px-5 bordered bg-1 border-radius-5'>
        <Horizontal className='mb-2' justifyContent='space-between'>
          <Texto category='h6'>{title}</Texto>
        </Horizontal>
        <Horizontal flex={1} className='mb-2' justifyContent='space-between'>
          <Vertical flex={1}>
            <Texto weight='bold' category='p2'>{data[0].value}</Texto>
            <Texto className='display-card-lighter-text'>{data[0].label}</Texto>
          </Vertical>
          <Vertical flex={1}>
            <Texto weight='bold' category='p2'>{data[1].value}</Texto>
            <Texto className='display-card-lighter-text'>{data[1].label}</Texto>
          </Vertical>
        </Horizontal>
      </Vertical>
    </Horizontal>
  );
}

export default DataMetricsCard;`,
  },

  {
    name: "Sidebar Layout Pattern",
    description:
      "Main page layout with sidebar and conditional content using flex ratios",
    category: "layout",
    complexity: "advanced",
    tags: ["sidebar", "layout", "conditional", "flex", "responsive"],
    code: `import { Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Empty } from 'antd';
import React from 'react';

function SidebarLayout({ 
  ProductGroups, 
  PriceConfigurationDetail, 
  selectedProductGroup 
}) {
  return (
    <Horizontal style={{ minWidth: 1000, height: '100%' }}>
      <Vertical flex={3} className='bg-1' style={{ minWidth: 300 }}>
        <ProductGroups />
      </Vertical>
      {selectedProductGroup.locationId && selectedProductGroup.productId && (
        <Vertical flex={12}>
          <PriceConfigurationDetail />
        </Vertical>
      )}
      {!selectedProductGroup.locationId && !selectedProductGroup.productId && (
        <Vertical flex={12} horizontalCenter>
          <Empty description='Select a product group to get started' />
        </Vertical>
      )}
    </Horizontal>
  );
}

export default SidebarLayout;`,
  },

  {
    name: "Dashboard Widget Grid",
    description:
      "Dashboard layout with equal-width widgets and smart spacing distribution",
    category: "dashboard",
    complexity: "advanced",
    tags: ["dashboard", "widgets", "grid", "responsive", "mapping"],
    code: `import { Horizontal, Vertical } from '@gravitate-js/excalibrr';
import React from 'react';

function DashboardWidgetGrid({ widgets, WidgetContainer }) {
  return (
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
                rowData={widget.rowData}
                loading={widget.loading}
              />
            </Vertical>
          );
        }
        return null;
      })}
    </Horizontal>
  );
}

export default DashboardWidgetGrid;`,
  },

  {
    name: "Modal Step Layout",
    description:
      "Complex modal layout with scrollable main content and fixed sidebar",
    category: "modal",
    complexity: "advanced",
    tags: ["modal", "steps", "scrollable", "sidebar", "complex"],
    code: `import { Horizontal, Vertical } from '@gravitate-js/excalibrr';
import React from 'react';

function ModalStepLayout({ 
  PricingInformation, 
  VolumeAllocation, 
  AdditionalOptions, 
  OrderDisplay 
}) {
  return (
    <Horizontal fullHeight>
      <Vertical className='mx-4' flex={5.5}>
        <div style={{ overflowY: 'auto' }}>
          <Horizontal className='mx-4 pb-2' style={{ gap: 20 }}>
            <PricingInformation />
            <VolumeAllocation />
          </Horizontal>
          <Horizontal className='mx-4 mb-2 pt-4 border-top'>
            <AdditionalOptions />
          </Horizontal>
        </div>
      </Vertical>
      <Vertical style={{ backgroundColor: 'var(--gray-800)', flex: 2 }}>
        <OrderDisplay />
      </Vertical>
    </Horizontal>
  );
}

export default ModalStepLayout;`,
  },

  {
    name: "Detail View Split Layout",
    description:
      "Split view with header display and tabbed content with conditional rendering",
    category: "detail",
    complexity: "advanced",
    tags: ["split", "tabs", "conditional", "detail", "view"],
    code: `import { Horizontal, Vertical } from '@gravitate-js/excalibrr';
import React from 'react';

function DetailViewSplitLayout({ 
  HeaderDisplay, 
  TabsControl, 
  AllDetails, 
  DetailManager, 
  activeTabId,
  pageStyles 
}) {
  return (
    <Horizontal 
      className='p-3' 
      style={{ gap: pageStyles.gridSpacing }} 
      fullHeight
    >
      <Vertical flex={1}>
        <HeaderDisplay />
      </Vertical>
      <Vertical flex={3}>
        <Horizontal>
          <TabsControl />
        </Horizontal>
        <Horizontal fullHeight>
          {activeTabId === '0' ? <AllDetails /> : <DetailManager />}
        </Horizontal>
      </Vertical>
    </Horizontal>
  );
}

export default DetailViewSplitLayout;`,
  },

  {
    name: "Responsive Form Section",
    description:
      "Form section with wrapping capability for responsive multi-line layouts",
    category: "forms",
    complexity: "advanced",
    tags: ["responsive", "wrap", "form", "multi-line", "adaptive"],
    code: `import { Horizontal } from '@gravitate-js/excalibrr';
import React from 'react';

function ResponsiveFormSection({ 
  AdditionalItems, 
  TradeNotes, 
  VolumeAllocation, 
  AdditionalInfo, 
  CounterPartyInfo,
  orderDetails, 
  isPrompt 
}) {
  return (
    <Horizontal className='m-4' style={{ flexWrap: 'wrap' }}>
      <AdditionalItems order={orderDetails} type='Product' />
      <AdditionalItems order={orderDetails} type='Location' />
      <TradeNotes orderDetails={orderDetails} />
      <VolumeAllocation />
      <AdditionalInfo />
      {isPrompt && <CounterPartyInfo orderDetails={orderDetails} />}
    </Horizontal>
  );
}

export default ResponsiveFormSection;`,
  },

  {
    name: "Label Input Pair",
    description:
      "Form field pattern with controlled width ratios for labels and inputs",
    category: "forms",
    complexity: "intermediate",
    tags: ["label", "input", "ratio", "form", "field"],
    code: `import { Horizontal, Texto } from '@gravitate-js/excalibrr';
import { DatePicker } from 'antd';
import React from 'react';

function LabelInputPair({ label, value, onChange, type = 'date' }) {
  return (
    <Horizontal flex={1} verticalCenter className='m-1' justifyContent='flex-end'>
      <Horizontal flex={0.2} verticalCenter>
        <Texto>{label}</Texto>
      </Horizontal>
      <Horizontal flex={0.8} verticalCenter>
        {type === 'date' ? (
          <DatePicker value={value} onChange={onChange} />
        ) : (
          <input value={value} onChange={onChange} />
        )}
      </Horizontal>
    </Horizontal>
  );
}

export default LabelInputPair;`,
  },

  {
    name: "Nested Section Layout",
    description:
      "Nested horizontal and vertical layout with section headers and grouped controls",
    category: "layout",
    complexity: "intermediate",
    tags: ["nested", "section", "header", "grouped", "spacing"],
    code: `import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';
import React from 'react';

function NestedSectionLayout({ SubTypeSelect, OrderVolume }) {
  return (
    <Horizontal>
      <Vertical className='mx-4'>
        <Horizontal>
          <Texto category='h4' className='mb-3' appearance='secondary'>
            Order Information
          </Texto>
        </Horizontal>
        <Horizontal className='m-4' style={{ gap: 30 }}>
          <SubTypeSelect />
          <OrderVolume />
        </Horizontal>
      </Vertical>
    </Horizontal>
  );
}

export default NestedSectionLayout;`,
  },
];
