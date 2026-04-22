import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  GraviGrid,
  GraviButton,
  Vertical,
  Texto,
  Horizontal,
  BBDTag,
} from '@gravitate-js/excalibrr';
import {
  Drawer,
  Button,
  Tag,
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox,
  Switch,
  Radio,
  message,
  Tabs,
  DatePicker,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
  SettingOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
  ReloadOutlined,
  LeftOutlined,
  SendOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useFormulaTemplateContext } from '../../contexts/FormulaTemplateContext';
import {
  buildFormulaPreview,
  PLACEHOLDER_VALUES,
  isPlaceholder,
  getPlaceholderDisplayText,
} from '../demos/grids/FormulaTemplates.data';
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor';
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors';
import { TemplateChooser } from '../../components/shared/TemplateChooser';
import { SaveTemplateForm } from '../../components/shared/SaveTemplateModal';
import {
  generateMarketContextData,
  getMarketContextForOffer,
  MarketContextData,
} from './IndexOfferManagement.data';
import { generateIndexOfferData } from '../../shared/data';
import { MarketContextPanel } from './components/MarketContextPanel';
import { BulkProposedDiffEditor } from './components/BulkProposedDiffEditor';
import { useFeatureMode } from '../../contexts/FeatureModeContext';

const { TextArea } = Input;

type AnalyticsPaneView = 'panel' | 'analytics';

interface AnalyticsPaneProps {
  open: boolean;
  view: AnalyticsPaneView;
  onViewChange: (view: AnalyticsPaneView) => void;
  selectedRow: any;
  onClearSelection: () => void;
  marketData: MarketContextData | null;
  analyticsRowData: any[];
  analyticsColumnDefs: any[];
  storageKey: string;
}

const ANALYTICS_VIEW_OPTIONS: { value: AnalyticsPaneView; label: string }[] = [
  { value: 'analytics', label: 'Analytics Grid' },
  { value: 'panel', label: 'Analytics Panel' },
];

function AnalyticsPane({
  open,
  view,
  onViewChange,
  selectedRow,
  onClearSelection,
  marketData,
  analyticsRowData,
  analyticsColumnDefs,
  storageKey,
}: AnalyticsPaneProps) {
  if (!open) return null;

  const contextLabel = selectedRow
    ? `${selectedRow.product ?? ''}${selectedRow.location ? ` @ ${selectedRow.location}` : ''}`
    : '';

  return (
    <div
      style={{
        height: '420px',
        minHeight: '420px',
        flexShrink: 0,
        overflow: 'hidden',
        borderBottom: '1px solid #e8e8e8',
      }}
    >
      <Vertical
        style={{ padding: '12px 16px', height: '100%', boxSizing: 'border-box', gap: 8 }}
      >
        <Horizontal
          gap={12}
          style={{ alignItems: 'center', flexShrink: 0, justifyContent: 'space-between' }}
        >
          <Horizontal gap={12} style={{ alignItems: 'center' }}>
            <Texto category="h5" weight="600">
              Quote Analytics
            </Texto>
            <Select
              style={{ width: 200 }}
              value={view}
              onChange={onViewChange}
              options={ANALYTICS_VIEW_OPTIONS}
            />
            {contextLabel && (
              <>
                <div style={{ width: 1, height: 20, background: '#e8e8e8' }} />
                <Texto appearance="medium" style={{ fontSize: 13 }}>
                  {contextLabel}
                </Texto>
              </>
            )}
          </Horizontal>
          {selectedRow && (
            <Button size="small" onClick={onClearSelection}>
              Clear
            </Button>
          )}
        </Horizontal>

        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {!selectedRow ? (
            <Vertical
              style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Texto appearance="medium">Select a row to view analytics</Texto>
            </Vertical>
          ) : view === 'analytics' ? (
            <div style={{ height: '100%' }}>
              <GraviGrid
                storageKey={storageKey}
                rowData={analyticsRowData}
                columnDefs={analyticsColumnDefs}
                agPropOverrides={{
                  getRowId: (params: any) => params.data.id,
                  domLayout: 'normal',
                  headerHeight: 40,
                  rowHeight: 44,
                  suppressRowClickSelection: true,
                  enableCellTextSelection: true,
                  rowGroupPanelShow: 'never',
                  suppressDragLeaveHidesColumns: true,
                }}
                controlBarProps={{
                  title: 'Competitive Analysis',
                  hideActiveFilters: true,
                  hideFilterRow: true,
                }}
              />
            </div>
          ) : (
            <MarketContextPanel marketData={marketData} />
          )}
        </div>
      </Vertical>
    </div>
  );
}

export function IndexOfferManagement() {
  const navigate = useNavigate();
  const { templates, getTemplateById, addTemplate } = useFormulaTemplateContext();
  const { featureMode, setFeatureMode, isFutureMode } = useFeatureMode();

  const [offerDrawerVisible, setOfferDrawerVisible] = useState(false);
  const [selectedOfferData, setSelectedOfferData] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<'panel' | 'columns' | 'rank' | 'analytics'>(() => {
    const saved = localStorage.getItem('index-offer-view-mode');
    return (saved as 'panel' | 'columns' | 'rank' | 'analytics') || 'analytics';
  });
  const [selectedRowForContext, setSelectedRowForContext] = useState<any>(null);

  // Analytics panel toggle (show/hide the collapsible analytics panel above the grid)
  const [showAnalytics, setShowAnalytics] = useState<boolean>(() => {
    const saved = localStorage.getItem('index-offer-show-analytics');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('index-offer-show-analytics', String(showAnalytics));
  }, [showAnalytics]);

  // Tab state for Future State mode
  const [activeTab, setActiveTab] = useState('offer-management');

  // State for selected pricing row in Offer Pricing tab (triggers competitive analysis display)
  const [selectedPricingRow, setSelectedPricingRow] = useState<any>(null);

  // Bulk change visibility state (using GraviGrid's built-in bulk change mode)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState<boolean>(false);

  // Publish drawer state
  const [publishDrawerVisible, setPublishDrawerVisible] = useState(false);
  const [selectedRowsToPublish, setSelectedRowsToPublish] = useState<any[]>([]);
  const [publishDateTime, setPublishDateTime] = useState<any>(null);
  const [publishSearchText, setPublishSearchText] = useState('');

  // Grid API reference for pricing grid (using externalRef pattern)
  const pricingGridApiRef = useRef<any>(null);

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('index-offer-view-mode', viewMode);
  }, [viewMode]);

  // Load market context data
  const marketContextData = useMemo(() => generateMarketContextData(), []);
  const selectedMarketContext = useMemo(() => {
    if (!selectedRowForContext) return null;
    return getMarketContextForOffer(selectedRowForContext.id);
  }, [selectedRowForContext]);

  // Filter selected rows for publish drawer
  const filteredPublishRows = useMemo(() => {
    if (!publishSearchText) return selectedRowsToPublish;
    const lower = publishSearchText.toLowerCase();
    return selectedRowsToPublish.filter(row =>
      row.location?.toLowerCase().includes(lower) ||
      row.product?.toLowerCase().includes(lower)
    );
  }, [selectedRowsToPublish, publishSearchText]);

  // Template chooser state
  const [showTemplateChooser, setShowTemplateChooser] = useState(false);

  // Save template form state
  const [showSaveTemplateForm, setShowSaveTemplateForm] = useState(false);

  // Formula components state
  const [components, setComponents] = useState<any[]>([]);

  // Form state
  const [form] = Form.useForm();
  const [product, setProduct] = useState('');
  const [location, setLocation] = useState('');
  const [differential, setDifferential] = useState('0.0000');
  const [isActive, setIsActive] = useState(true); // Default to active
  const [sendNotification, setSendNotification] = useState(false);

  // Formula preview state
  const [useInternalOverride, setUseInternalOverride] = useState(false);
  const [internalOverride, setInternalOverride] = useState('');
  const [useExternalOverride, setUseExternalOverride] = useState(false);
  const [externalOverride, setExternalOverride] = useState('');

  // Pricing Rules state
  const [validFor, setValidFor] = useState('midnight-midnight');
  const [weekendRule, setWeekendRule] = useState('use-friday');
  const [holidayRule, setHolidayRule] = useState('use-last-business-day');
  const [terms, setTerms] = useState('');

  // Additional state variables
  const [internalName, setInternalName] = useState('');
  const [externalName, setExternalName] = useState('');
  const [isInternalOnly, setIsInternalOnly] = useState(false);
  const [sameAsInternal, setSameAsInternal] = useState(false);

  // Handler for Create/Edit Offer button
  const handleCreateOffer = useCallback(() => {
    setSelectedOfferData(null);
    setIsEditMode(false);
    setComponents([]);
    setShowTemplateChooser(false);
    setProduct('');
    setLocation('');
    setDifferential('0.0000');
    setIsActive(true); // Default to active
    setSendNotification(false);
    setValidFor('midnight-midnight');
    setWeekendRule('use-friday');
    setHolidayRule('use-last-business-day');
    setTerms('');
    setUseInternalOverride(false);
    setInternalOverride('');
    setUseExternalOverride(false);
    setExternalOverride('');
    form.resetFields();
    setOfferDrawerVisible(true);
  }, [form]);

  const handleEditOffer = useCallback((rowData: any) => {
    setSelectedOfferData(rowData);
    setIsEditMode(true);
    setProduct(rowData.product || '');
    setLocation(rowData.terminal || '');
    setInternalName(rowData.formulaTemplate || '');
    setExternalName(rowData.formulaTemplate || '');
    setDifferential(rowData.differential || '0.0000');
    setIsActive(rowData.status === 'Active');
    setIsInternalOnly(false);
    setSameAsInternal(false);
    setSendNotification(false);
    setValidFor('midnight-midnight');
    setWeekendRule('use-friday');
    setHolidayRule('use-last-business-day');
    setTerms('Standard terms and conditions apply. Payment due within 30 days of delivery.');
    setOfferDrawerVisible(true);
  }, []);

  // Handler for Add Row button
  const handleAddRow = useCallback(() => {
    const newRow = {
      id: Date.now(),
      percentage: PLACEHOLDER_VALUES.PERCENTAGE, // [*PCT*]
      operator: '+',
      source: PLACEHOLDER_VALUES.SOURCE, // [*SRC*]
      instrument: PLACEHOLDER_VALUES.INSTRUMENT, // [*INSTR*]
      type: PLACEHOLDER_VALUES.TYPE, // [*TYPE*]
      dateRule: PLACEHOLDER_VALUES.DATE_RULE, // [*DATE*]
      diff: 0,
      required: true,
    };
    setComponents([...components, newRow]);
  }, [components]);

  // Handler for Add Template button
  const handleOpenTemplateChooser = useCallback(() => {
    setShowTemplateChooser(true);
  }, []);

  // Handler for template selection
  const handleTemplateSelect = useCallback(
    (template: any) => {
      // Add template components to existing components with unique IDs
      const maxId = components.length > 0 ? Math.max(...components.map((c) => c.id || 0)) : 0;
      const newComponents = template.components.map((comp: any, index: number) => ({
        ...comp,
        id: maxId + index + 1,
        required: true,
      }));
      setComponents([...components, ...newComponents]);

      // Close template chooser
      setShowTemplateChooser(false);
    },
    [components]
  );

  // Handler for saving current formula as template
  const handleSaveAsTemplate = useCallback(
    (templateData: any) => {
      try {
        // Components already match template format closely
        const transformedComponents = templateData.components.map((comp: any) => ({
          id: comp.id,
          percentage: comp.percentage || '100',
          operator: comp.operator || '+',
          source: comp.source,
          instrument: comp.instrument,
          dateRule: comp.dateRule,
          type: comp.type,
        }));

        const template = {
          name: templateData.name,
          contractType: templateData.category, // Category becomes contractType
          usedInProducts: templateData.products || [], // Already arrays from modal
          usedInLocations: templateData.locations || [], // Already arrays from modal
          description: templateData.description,
          createdBy: templateData.createdBy,
          components: transformedComponents,
          customFormulaPreview: templateData.customFormulaPreview,
        };

        const newTemplate = addTemplate(template);
        message.success(`Template "${newTemplate.name}" saved successfully`);
      } catch (error) {
        message.error('Failed to save template');
        console.error('Save template error:', error);
      }
    },
    [addTemplate]
  );

  const handleSaveOffer = useCallback(
    (saveAsActive: boolean) => {
      // TODO: Implement actual save logic here
      // Available data: isEditMode, product, location, components, useInternalOverride,
      // internalOverride, useExternalOverride, externalOverride, differential, saveAsActive,
      // isInternalOnly, sendNotification, validFor, weekendRule, holidayRule, terms

      // Close drawer
      setOfferDrawerVisible(false);
    },
    [
      isEditMode,
      product,
      location,
      components,
      useInternalOverride,
      internalOverride,
      useExternalOverride,
      externalOverride,
      differential,
      isInternalOnly,
      sendNotification,
      validFor,
      weekendRule,
      holidayRule,
      terms,
    ]
  );

  // Handler for confirming publish
  const handleConfirmPublish = useCallback(() => {
    if (selectedRowsToPublish.length === 0) {
      message.warning('No offers selected for publishing');
      return;
    }

    const publishTime = publishDateTime
      ? publishDateTime.format('MM/DD/YYYY hh:mm A')
      : 'immediately';

    message.success(
      `Publishing ${selectedRowsToPublish.length} offer(s) ${publishTime === 'immediately' ? 'immediately' : `scheduled for ${publishTime}`}`
    );

    // Reset and close
    setPublishDrawerVisible(false);
    setSelectedRowsToPublish([]);
    setPublishDateTime(null);
    setPublishSearchText('');
  }, [selectedRowsToPublish, publishDateTime]);

  // Generate index offers from shared data (15 rows from shared terminals and products)
  const rowData = useMemo(() => generateIndexOfferData(15), []);

  // Analytics Grid Sample Data
  const analyticsRowData = useMemo(
    () => [
      {
        id: 1,
        competitor: 'Your Offer (Selected)',
        publisher: 'Internal',
        location: 'Houston',
        price: 2.45,
        change: 0.02,
        changeDate: '2025-11-02',
        rank: 4,
        rolling30Rank: 4,
        deltaToRow: 0.0,
        isSelected: true,
      },
      {
        id: 2,
        competitor: 'Platts USGC Index',
        publisher: 'Platts',
        location: 'USGC',
        price: 2.48,
        change: 0.01,
        changeDate: '2025-11-03',
        rank: 1,
        rolling30Rank: 2,
        deltaToRow: 0.03,
        isSelected: false,
      },
      {
        id: 3,
        competitor: 'Argus CBOB Index',
        publisher: 'Argus',
        location: 'USGC',
        price: 2.47,
        change: -0.01,
        changeDate: '2025-11-03',
        rank: 2,
        rolling30Rank: 3,
        deltaToRow: 0.02,
        isSelected: false,
      },
      {
        id: 4,
        competitor: 'Competitor A Rack Post',
        publisher: 'OPIS',
        location: 'Houston',
        price: 2.46,
        change: 0.0,
        changeDate: '2025-11-02',
        rank: 3,
        rolling30Rank: 5,
        deltaToRow: 0.01,
        isSelected: false,
      },
      {
        id: 5,
        competitor: 'Competitor B Rack Post',
        publisher: 'OPIS',
        location: 'Houston',
        price: 2.44,
        change: -0.02,
        changeDate: '2025-11-01',
        rank: 5,
        rolling30Rank: 4,
        deltaToRow: -0.01,
        isSelected: false,
      },
      {
        id: 6,
        competitor: 'Bottom Line Average',
        publisher: 'Internal',
        location: 'Houston',
        price: 2.42,
        change: 0.03,
        changeDate: '2025-11-03',
        rank: 6,
        rolling30Rank: 6,
        deltaToRow: -0.03,
        isSelected: false,
      },
      {
        id: 7,
        competitor: 'Internal Contract Low',
        publisher: 'Internal',
        location: 'Houston',
        price: 2.40,
        change: 0.01,
        changeDate: '2025-11-01',
        rank: 7,
        rolling30Rank: 7,
        deltaToRow: -0.05,
        isSelected: false,
      },
    ],
    []
  );

  // Sample Pricing Grid Data (for Tab 2: Offer Pricing)
  const [samplePricingRowData, setSamplePricingRowData] = useState(() => [
    {
      id: 1,
      product: '87 Gas',
      location: 'Houston',
      type: 'Argus',
      formula: '90% Prior Day Argus CBOB USGC, 10% Prior Day Argus CBOB USGC',
      currentDiff: 0.02,
      currentPrice: 2.45,
      proposedDiff: 0.025,
      proposedPrice: 2.455,
    },
    {
      id: 2,
      product: 'ULSD 2',
      location: 'Houston',
      type: 'OPIS',
      formula: '100% Prior Day OPIS Houston ULSD',
      currentDiff: 0.0,
      currentPrice: 2.78,
      proposedDiff: 0.005,
      proposedPrice: 2.785,
    },
    {
      id: 3,
      product: '87 Gas',
      location: 'Nashville Terminal',
      type: 'Argus',
      formula: '90% Prior Day Argus CBOB USGC, 10% Current OPIS RIN',
      currentDiff: 0.03,
      currentPrice: 2.47,
      proposedDiff: 0.028,
      proposedPrice: 2.468,
    },
    {
      id: 4,
      product: 'ULSD 2',
      location: 'Nashville Terminal',
      type: 'OPIS',
      formula: '100% Prior Day OPIS Nashville ULSD Rack',
      currentDiff: 0.01,
      currentPrice: 2.79,
      proposedDiff: 0.012,
      proposedPrice: 2.792,
    },
    {
      id: 5,
      product: '87 Gas',
      location: 'Detroit Terminal',
      type: 'Argus',
      formula: '95% Prior Day Argus CBOB Group 3, Less 5% OPIS RIN',
      currentDiff: 0.02,
      currentPrice: 2.46,
      proposedDiff: 0.018,
      proposedPrice: 2.458,
    },
    {
      id: 6,
      product: 'ULSD 2',
      location: 'Detroit Terminal',
      type: 'OPIS',
      formula: '100% Prior Day OPIS Detroit ULSD',
      currentDiff: 0.0,
      currentPrice: 2.775,
      proposedDiff: 0.0075,
      proposedPrice: 2.7825,
    },
    {
      id: 7,
      product: '93 Premium',
      location: 'Columbia Terminal',
      type: 'Argus',
      formula: '90% Prior Day Argus Premium USGC, 10% Prior Day Argus RFG USGC',
      currentDiff: 0.05,
      currentPrice: 2.82,
      proposedDiff: 0.045,
      proposedPrice: 2.815,
    },
    {
      id: 8,
      product: '87 Gas',
      location: 'Columbia Terminal',
      type: 'OPIS',
      formula: '100% Current Day OPIS Columbia Rack',
      currentDiff: 0.01,
      currentPrice: 2.465,
      proposedDiff: 0.015,
      proposedPrice: 2.47,
    },
    {
      id: 9,
      product: 'B7 GHL',
      location: 'Columbia Terminal',
      type: 'Argus',
      formula: '93% Prior Day Argus ULSD, 7% Prior Day Argus Biodiesel',
      currentDiff: 0.0,
      currentPrice: 2.81,
      proposedDiff: 0.01,
      proposedPrice: 2.82,
    },
    {
      id: 10,
      product: 'Mid-Grade 88',
      location: 'Columbia Terminal',
      type: 'Platts',
      formula: '50% Prior Day OPIS 87 Gas, 50% Prior Day OPIS 93 Premium',
      currentDiff: 0.02,
      currentPrice: 2.64,
      proposedDiff: 0.022,
      proposedPrice: 2.642,
    },
  ]);

  // Sample Pricing Grid Column Definitions (for bulk change mode)
  const samplePricingColumnDefs: any[] = useMemo(
    () => [
      {
        field: 'location',
        headerName: 'LOCATION',
        width: 160,
        sortable: true,
        filter: true,
      },
      {
        field: 'product',
        headerName: 'PRODUCT',
        width: 130,
        sortable: true,
        filter: true,
      },
      {
        field: 'type',
        headerName: 'TYPE',
        width: 100,
        sortable: true,
        filter: true,
      },
      {
        field: 'formula',
        headerName: 'FORMULA',
        width: 400,
        sortable: true,
        filter: true,
        cellStyle: { fontSize: '12px' },
      },
      {
        field: 'currentDiff',
        headerName: 'CURRENT DIFF',
        width: 130,
        sortable: true,
        filter: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => (params.value != null ? params.value.toFixed(4) : ''),
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'currentPrice',
        headerName: 'CURRENT PRICE',
        width: 140,
        sortable: true,
        filter: true,
        type: 'numericColumn',
        valueFormatter: (params: any) =>
          params.value != null ? `$${params.value.toFixed(4)}` : '',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'proposedDiff',
        headerName: 'PROPOSED DIFF',
        width: 140,
        sortable: true,
        filter: 'agNumberColumnFilter',
        editable: true,
        isBulkEditable: true,
        bulkCellEditor: BulkProposedDiffEditor,
        bulkCellEditorParams: { isBulkChangeCompactMode: true },
        type: 'numericColumn',
        valueFormatter: (params: any) => (params.value != null ? params.value.toFixed(4) : ''),
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'proposedPrice',
        headerName: 'PROPOSED PRICE',
        width: 150,
        sortable: true,
        filter: 'agNumberColumnFilter',
        editable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) =>
          params.value != null ? `$${params.value.toFixed(4)}` : '',
        cellStyle: { textAlign: 'right' },
      },
    ],
    []
  );

  // Pricing Grid AG Prop Overrides - Using GraviGrid's built-in bulk change mode
  const pricingGridAgPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.id,
      domLayout: 'normal' as const,
      headerHeight: 40,
      rowHeight: 40,
      // Enable row selection for bulk change mode (required for header checkbox to work)
      rowSelection: 'multiple' as const,
      // Enable range selection for bulk editing
      enableRangeSelection: true,
      suppressMultiRangeSelection: false,
      // Don't suppress row click when not in bulk mode (allows competitive analysis row click)
      suppressRowClickSelection: isBulkChangeVisible,
      enableCellTextSelection: true,
      onRowClicked: !isBulkChangeVisible
        ? (event: any) => {
            // Handle competitive analysis display (only when not in bulk change mode)
            setSelectedPricingRow(event.data);
          }
        : undefined,
    }),
    [isBulkChangeVisible]
  );

  // Analytics Grid Column Definitions
  const analyticsColumnDefs = useMemo(
    () => {
      const selectedCellStyle = {
        backgroundColor: '#000000',
        color: '#ffffff',
        fontWeight: 600,
      };
      const signedCellStyle = (params: any) => {
        if (params.data?.isSelected) {
          return { ...selectedCellStyle, textAlign: 'right' };
        }
        const value = params.value ?? 0;
        let color = '#262626';
        if (value > 0) color = '#cf1322';
        else if (value < 0) color = '#389e0d';
        return { color, textAlign: 'right', fontWeight: 600 };
      };
      const formatSigned4 = (params: any) => {
        const v = params.value;
        if (v == null) return '';
        const sign = v > 0 ? '+' : v < 0 ? '-' : '';
        return `${sign}$${Math.abs(v).toFixed(4)}`;
      };

      return [
        {
          field: 'rank',
          headerName: 'RANK',
          width: 100,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          cellStyle: (params: any) =>
            params.data?.isSelected
              ? { ...selectedCellStyle, textAlign: 'right' }
              : { textAlign: 'right' },
        },
        {
          field: 'competitor',
          headerName: 'COMPETITOR / SOURCE',
          width: 220,
          sortable: true,
          filter: true,
          cellStyle: (params: any) =>
            params.data?.isSelected ? selectedCellStyle : {},
        },
        {
          field: 'publisher',
          headerName: 'PUBLISHER',
          width: 130,
          sortable: true,
          filter: true,
          cellStyle: (params: any) =>
            params.data?.isSelected ? selectedCellStyle : {},
        },
        {
          field: 'price',
          headerName: 'PRICE',
          width: 130,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          valueFormatter: (params: any) =>
            params.value != null ? `$${params.value.toFixed(4)}` : '',
          cellStyle: (params: any) =>
            params.data?.isSelected
              ? { ...selectedCellStyle, textAlign: 'right' }
              : { textAlign: 'right' },
        },
        {
          field: 'change',
          headerName: 'CHANGE',
          width: 120,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          valueFormatter: formatSigned4,
          cellStyle: signedCellStyle,
        },
        {
          field: 'deltaToRow',
          headerName: 'DELTA TO ROW',
          width: 140,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          valueFormatter: formatSigned4,
          cellStyle: signedCellStyle,
        },
        {
          field: 'changeDate',
          headerName: 'CHANGE DATE',
          width: 140,
          sortable: true,
          filter: 'agDateColumnFilter',
          cellStyle: (params: any) =>
            params.data?.isSelected ? selectedCellStyle : {},
        },
        {
          field: 'location',
          headerName: 'LOCATION',
          width: 140,
          sortable: true,
          filter: true,
          cellStyle: (params: any) =>
            params.data?.isSelected ? selectedCellStyle : {},
        },
        {
          field: 'rolling30Rank',
          headerName: 'ROLLING 30 RANK',
          width: 150,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          cellStyle: (params: any) =>
            params.data?.isSelected
              ? { ...selectedCellStyle, textAlign: 'right' }
              : { textAlign: 'right' },
        },
      ];
    },
    []
  );

  // Publish drawer column definitions with grouped headers
  const publishColumnDefs = useMemo(
    () => [
      {
        field: 'location',
        headerName: 'LOCATION',
        width: 150,
      },
      {
        field: 'product',
        headerName: 'PRODUCT',
        width: 140,
      },
      {
        headerName: 'Prev. Posting',
        children: [
          {
            field: 'currentDiff',
            headerName: 'DIFF',
            width: 100,
            valueFormatter: (params: any) =>
              params.value != null ? `$${params.value.toFixed(4)}` : '$0.0000',
            cellStyle: { textAlign: 'right' },
          },
          {
            field: 'currentPrice',
            headerName: 'PRICE',
            width: 110,
            valueFormatter: (params: any) =>
              params.value != null ? `$${params.value.toFixed(4)}` : '',
            cellStyle: { textAlign: 'right' },
          },
        ],
      },
      {
        headerName: 'Proposed Posting',
        children: [
          {
            field: 'proposedDiff',
            headerName: 'DIFF',
            width: 100,
            valueFormatter: (params: any) =>
              params.value != null ? `$${params.value.toFixed(4)}` : '$0.0000',
            cellStyle: { textAlign: 'right' },
          },
          {
            field: 'proposedPrice',
            headerName: 'PRICE',
            width: 110,
            valueFormatter: (params: any) =>
              params.value != null ? `$${params.value.toFixed(4)}` : '',
            cellStyle: { textAlign: 'right' },
          },
        ],
      },
    ],
    []
  );

  // Column definitions with conditional market context columns
  const columnDefs = useMemo(() => {
    const baseColumns = [
      {
        field: 'terminal',
        headerName: 'LOCATION',
        width: 200,
        sortable: true,
        filter: true,
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'product',
        headerName: 'PRODUCT',
        width: 200,
        sortable: true,
        filter: true,
      },
      {
        field: 'formulaTemplate',
        headerName: 'FORMULA TEMPLATE',
        width: 500,
        sortable: true,
        filter: true,
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
      {
        field: 'differential',
        headerName: 'DIFFERENTIAL',
        width: 120,
        sortable: true,
        filter: true,
        type: 'rightAligned',
      },
      {
        field: 'status',
        headerName: 'STATUS',
        width: 120,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          const isActive = status === 'Active';
          return (
            <BBDTag theme1={isActive} theme3={!isActive} style={{ width: 'fit-content' }}>
              {status}
            </BBDTag>
          );
        },
      },
    ];

    // Market context columns based on view mode (only in Future State mode)
    const marketContextColumns = [];

    if (isFutureMode && viewMode === 'columns') {
      // Full market data columns
      marketContextColumns.push(
        {
          field: 'opusContractLow',
          headerName: 'OPUS LOW',
          width: 120,
          sortable: true,
          filter: true,
          type: 'rightAligned',
          valueGetter: (params: any) => {
            const context = marketContextData.find((m) => m.offerId === params.data.id);
            return context?.opusContractLow;
          },
          cellRenderer: (params: any) => {
            if (params.value === null || params.value === undefined) return 'N/A';
            return `$${params.value.toFixed(4)}`;
          },
        },
        {
          field: 'opusContractAvg',
          headerName: 'OPUS AVG',
          width: 120,
          sortable: true,
          filter: true,
          type: 'rightAligned',
          valueGetter: (params: any) => {
            const context = marketContextData.find((m) => m.offerId === params.data.id);
            return context?.opusContractAvg;
          },
          cellRenderer: (params: any) => {
            if (params.value === null || params.value === undefined) return 'N/A';
            return `$${params.value.toFixed(4)}`;
          },
        },
        {
          field: 'argusPrice',
          headerName: 'ARGUS',
          width: 120,
          sortable: true,
          filter: true,
          type: 'rightAligned',
          valueGetter: (params: any) => {
            const context = marketContextData.find((m) => m.offerId === params.data.id);
            return context?.argusPrice;
          },
          cellRenderer: (params: any) => {
            if (params.value === null || params.value === undefined) return 'N/A';
            return `$${params.value.toFixed(4)}`;
          },
        },
        {
          field: 'rackDelta',
          headerName: 'RACK DELTA',
          width: 120,
          sortable: true,
          filter: true,
          type: 'rightAligned',
          valueGetter: (params: any) => {
            const context = marketContextData.find((m) => m.offerId === params.data.id);
            return context?.rackPriceDelta;
          },
          cellRenderer: (params: any) => {
            if (params.value === null || params.value === undefined) return 'N/A';
            const color = params.value < 0 ? '#52c41a' : params.value > 0 ? '#ff4d4f' : '#1890ff';
            return (
              <span style={{ color, fontWeight: 600 }}>
                {params.value > 0 ? '+' : ''}${params.value.toFixed(4)}
              </span>
            );
          },
        },
        {
          field: 'marketRank',
          headerName: 'RANK',
          width: 100,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          valueGetter: (params: any) => {
            const context = marketContextData.find((m) => m.offerId === params.data.id);
            return context?.marketRank ?? null;
          },
          cellStyle: { textAlign: 'right' },
        }
      );
    } else if (isFutureMode && viewMode === 'rank') {
      // Just rank column
      marketContextColumns.push({
        field: 'marketRank',
        headerName: 'MARKET RANK',
        width: 140,
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueGetter: (params: any) => {
          const context = marketContextData.find((m) => m.offerId === params.data.id);
          return context?.marketRank ?? null;
        },
        cellStyle: { textAlign: 'right' },
      });
    }

    // Remaining base columns
    const endColumns = [
      {
        field: 'createdBy',
        headerName: 'CREATED BY',
        width: 150,
        sortable: true,
        filter: true,
      },
      {
        field: 'createdDate',
        headerName: 'CREATED DATE',
        width: 140,
        sortable: true,
        filter: true,
      },
      {
        field: 'actions',
        headerName: 'ACTIONS',
        width: 100,
        pinned: 'right',
        cellRenderer: (params: any) => {
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <EditOutlined
                onClick={() => handleEditOffer(params.data)}
                style={{
                  fontSize: '16px',
                  color: '#595959',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#262626')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#595959')}
              />
            </div>
          );
        },
      },
    ];

    return [...baseColumns, ...marketContextColumns, ...endColumns];
  }, [handleEditOffer, viewMode, marketContextData, isFutureMode]);

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.id,
      domLayout: 'normal',
      suppressRowClickSelection: true,
      headerHeight: 40,
      enableCellTextSelection: true,
      ensureDomOrder: true,
      suppressMakeColumnVisibleAfterUnGroup: true,
      groupDefaultExpanded: -1,
      sideBar: false,
      suppressContextMenu: false,
      suppressHorizontalScroll: true,
      alwaysShowHorizontalScroll: false,
      onRowClicked:
        isFutureMode && (viewMode === 'panel' || viewMode === 'analytics')
          ? (event: any) => {
              setSelectedRowForContext(event.data);
            }
          : undefined,
      rowClassRules:
        isFutureMode && (viewMode === 'panel' || viewMode === 'analytics')
          ? {
              'selected-row': (params: any) => params.data.id === selectedRowForContext?.id,
            }
          : undefined,
    }),
    [viewMode, selectedRowForContext, isFutureMode]
  );

  const controlBarProps = useMemo(
    () => ({
      title: 'Index Offer Management',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal gap={12} style={{ alignItems: 'center' }}>
          {isFutureMode && (
            <Tooltip title="Toggle analytics panel">
              <Switch
                checked={showAnalytics}
                onChange={setShowAnalytics}
                checkedChildren={<BarChartOutlined />}
                unCheckedChildren={<BarChartOutlined />}
              />
            </Tooltip>
          )}
          <GraviButton
            buttonText="Create New Offer"
            icon={<PlusOutlined />}
            appearance="solid"
            onClick={handleCreateOffer}
            style={{
              fontWeight: 'bold',
              backgroundColor: '#51b073',
              color: 'white',
            }}
          />
        </Horizontal>
      ),
    }),
    [handleCreateOffer, isFutureMode, showAnalytics]
  );

  const updateEP = async (_params: any) => {
    // TODO: Implement actual update logic
    return Promise.resolve();
  };

  // Auto-generated formula preview from components
  const autoGeneratedPreview = useMemo(() => {
    if (components.length === 0) return '';
    return buildFormulaPreview({ components });
  }, [components]);

  // Components grid column definitions
  const componentsColumnDefs = useMemo(
    () => [
      {
        rowDrag: true,
        width: 40,
        suppressMenu: true,
        lockPosition: true,
        pinned: 'left',
        rowDragText: (params: any) => params.rowNode.data.percentage,
      },
      {
        field: 'percentage',
        headerName: '%',
        width: 100,
        editable: true,
        cellEditor: SearchableSelect,
        suppressKeyboardEvent,
        cellEditorParams: {
          options: [
            { value: PLACEHOLDER_VALUES.PERCENTAGE, label: PLACEHOLDER_VALUES.PERCENTAGE },
            { value: '0%', label: '0%' },
            { value: '5%', label: '5%' },
            { value: '10%', label: '10%' },
            { value: '25%', label: '25%' },
            { value: '50%', label: '50%' },
            { value: '75%', label: '75%' },
            { value: '90%', label: '90%' },
            { value: '95%', label: '95%' },
            { value: '100%', label: '100%' },
          ],
          showSearch: true,
          closeOnBlur: true,
        },
        cellStyle: (params: any) => {
          if (isPlaceholder(params.value)) {
            return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
          }
          return {};
        },
      },
      {
        field: 'source',
        headerName: 'PUBLISHER',
        width: 120,
        editable: true,
        cellEditor: SearchableSelect,
        suppressKeyboardEvent,
        cellEditorParams: {
          options: [
            { value: PLACEHOLDER_VALUES.SOURCE, label: PLACEHOLDER_VALUES.SOURCE },
            { value: 'Argus', label: 'Argus' },
            { value: 'OPIS', label: 'OPIS' },
            { value: 'Platts', label: 'Platts' },
            { value: 'Bloomberg', label: 'Bloomberg' },
            { value: 'ICE', label: 'ICE' },
            { value: 'NYMEX', label: 'NYMEX' },
            { value: 'Fixed', label: 'Fixed' },
            { value: 'Formula', label: 'Formula' },
          ],
          showSearch: true,
          closeOnBlur: true,
        },
        cellStyle: (params: any) => {
          if (isPlaceholder(params.value)) {
            return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
          }
          return {};
        },
      },
      {
        field: 'instrument',
        headerName: 'INSTRUMENT',
        width: 180,
        editable: true,
        cellEditor: SearchableSelect,
        suppressKeyboardEvent,
        cellEditorParams: {
          options: [
            { value: PLACEHOLDER_VALUES.INSTRUMENT, label: PLACEHOLDER_VALUES.INSTRUMENT },
            { value: 'CBOB USGC', label: 'CBOB USGC' },
            { value: 'CBOB', label: 'CBOB' },
            { value: 'CBOB Chicago', label: 'CBOB Chicago' },
            { value: 'CBOB Gulf', label: 'CBOB Gulf' },
            { value: 'Premium USGC', label: 'Premium USGC' },
            { value: 'CARBOB', label: 'CARBOB' },
            { value: 'ULSD', label: 'ULSD' },
            { value: 'Jet Fuel', label: 'Jet Fuel' },
            { value: 'Ethanol', label: 'Ethanol' },
            { value: 'RBOB Futures', label: 'RBOB Futures' },
            { value: 'Renewable Diesel', label: 'Renewable Diesel' },
            { value: 'Differential', label: 'Differential' },
            { value: 'Discount', label: 'Discount' },
            { value: 'Shell Discount', label: 'Shell Discount' },
            { value: 'Volume Discount', label: 'Volume Discount' },
            { value: 'Marathon Discount', label: 'Marathon Discount' },
            { value: 'BP Discount', label: 'BP Discount' },
            { value: 'Partner Discount', label: 'Partner Discount' },
            { value: 'Seasonal Factor', label: 'Seasonal Factor' },
            { value: 'Terminal Fee', label: 'Terminal Fee' },
            { value: 'Quality Premium', label: 'Quality Premium' },
            { value: 'Octane Premium', label: 'Octane Premium' },
            { value: 'Volume Rebate', label: 'Volume Rebate' },
            { value: 'Freight Diff', label: 'Freight Diff' },
            { value: 'Spot Discount', label: 'Spot Discount' },
            { value: 'Airport Fee', label: 'Airport Fee' },
            { value: 'Quality Cert', label: 'Quality Cert' },
            { value: 'Delivery Charge', label: 'Delivery Charge' },
            { value: 'Contract Discount', label: 'Contract Discount' },
            { value: 'RIN Credit D6', label: 'RIN Credit D6' },
            { value: 'D4 RIN Credit', label: 'D4 RIN Credit' },
            { value: 'Transport Charge', label: 'Transport Charge' },
            { value: 'Weekend Premium', label: 'Weekend Premium' },
            { value: 'Holiday Factor', label: 'Holiday Factor' },
            { value: 'Loyalty Credit', label: 'Loyalty Credit' },
            { value: 'CARB Fee', label: 'CARB Fee' },
            { value: 'Spec Premium', label: 'Spec Premium' },
            { value: 'LCFS Credit', label: 'LCFS Credit' },
            { value: 'Regional Diff', label: 'Regional Diff' },
            { value: 'Local Discount', label: 'Local Discount' },
            { value: 'Basis Adjustment', label: 'Basis Adjustment' },
            { value: 'Hedge Cost', label: 'Hedge Cost' },
            { value: 'Contango Factor', label: 'Contango Factor' },
            { value: 'Summer Premium', label: 'Summer Premium' },
            { value: 'RVP Compliance', label: 'RVP Compliance' },
            { value: 'Volume Tier', label: 'Volume Tier' },
            { value: 'Winter Premium', label: 'Winter Premium' },
            { value: 'Cold Filter', label: 'Cold Filter' },
            { value: 'Additive Cost', label: 'Additive Cost' },
            { value: 'Brand Premium', label: 'Brand Premium' },
            { value: 'Arbitrage Factor', label: 'Arbitrage Factor' },
            { value: 'Transaction Cost', label: 'Transaction Cost' },
            { value: 'Pipeline Diff', label: 'Pipeline Diff' },
            { value: 'Regional Discount', label: 'Regional Discount' },
            { value: 'Tier 1 Discount', label: 'Tier 1 Discount' },
            { value: 'Tier 2 Discount', label: 'Tier 2 Discount' },
            { value: 'Loyalty Bonus', label: 'Loyalty Bonus' },
            { value: 'Base Terminal Fee', label: 'Base Terminal Fee' },
            { value: 'Renewable Premium', label: 'Renewable Premium' },
            { value: 'Volume Incentive', label: 'Volume Incentive' },
            { value: 'Blend Credit', label: 'Blend Credit' },
          ],
          showSearch: true,
          closeOnBlur: true,
        },
        cellStyle: (params: any) => {
          if (isPlaceholder(params.value)) {
            return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
          }
          return {};
        },
      },
      {
        field: 'type',
        headerName: 'TYPE',
        width: 120,
        editable: true,
        cellEditor: SearchableSelect,
        suppressKeyboardEvent,
        cellEditorParams: {
          options: [
            { value: PLACEHOLDER_VALUES.TYPE, label: PLACEHOLDER_VALUES.TYPE },
            { value: 'Settle', label: 'Settle' },
            { value: 'Average', label: 'Average' },
            { value: 'Fixed', label: 'Fixed' },
            { value: 'High', label: 'High' },
            { value: 'Low', label: 'Low' },
            { value: 'Spot', label: 'Spot' },
            { value: 'Variable', label: 'Variable' },
            { value: 'Futures', label: 'Futures' },
          ],
          showSearch: true,
          closeOnBlur: true,
        },
        cellStyle: (params: any) => {
          if (isPlaceholder(params.value)) {
            return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
          }
          return {};
        },
      },
      {
        field: 'dateRule',
        headerName: 'DATE RULE',
        width: 130,
        editable: true,
        cellEditor: SearchableSelect,
        suppressKeyboardEvent,
        cellEditorParams: {
          options: [
            { value: PLACEHOLDER_VALUES.DATE_RULE, label: PLACEHOLDER_VALUES.DATE_RULE },
            { value: 'Prior Day', label: 'Prior Day' },
            { value: 'Current', label: 'Current' },
            { value: 'Next Day', label: 'Next Day' },
            { value: 'Month Average', label: 'Month Average' },
            { value: 'Week Average', label: 'Week Average' },
            { value: 'Friday Close', label: 'Friday Close' },
            { value: 'Settlement', label: 'Settlement' },
          ],
          showSearch: true,
          closeOnBlur: true,
        },
        cellStyle: (params: any) => {
          if (isPlaceholder(params.value)) {
            return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
          }
          return {};
        },
      },
      {
        field: 'required',
        headerName: 'Required',
        width: 100,
        cellRenderer: (params: any) => <Checkbox checked={params.value} disabled />,
      },
      {
        field: 'display',
        headerName: 'DISPLAY',
        width: 200,
        editable: true,
        valueGetter: (params: any) => {
          // Use custom display name if set, otherwise auto-generate
          const comp = params.data;
          if (!comp) return '';
          if (comp.customDisplayName) return comp.customDisplayName;
          return `${comp.percentage || ''} ${comp.source || ''} ${comp.instrument || ''} ${comp.dateRule || ''} ${comp.type || ''}`.trim();
        },
        valueSetter: (params: any) => {
          // Save custom display name
          params.data.customDisplayName = params.newValue;
          return true;
        },
        cellStyle: (params: any) => {
          // Show visual distinction for custom vs auto-generated names
          if (params.data?.customDisplayName) {
            return { fontWeight: 600, color: '#262626' };
          }
          return { backgroundColor: '#f5f5f5', fontStyle: 'italic', color: '#595959' };
        },
      },
      {
        headerName: 'ACTIONS',
        width: 100,
        pinned: 'right',
        cellRenderer: (params: any) => {
          const hasCustomName = !!params.data?.customDisplayName;

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              {hasCustomName && (
                <Popconfirm
                  title="Reset display name?"
                  description="This will restore the auto-generated display name."
                  onConfirm={() => {
                    params.data.customDisplayName = null;
                    params.api.refreshCells({ rowNodes: [params.node], force: true });
                  }}
                  okText="Reset"
                  cancelText="Cancel"
                >
                  <UndoOutlined
                    style={{
                      color: '#595959',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#262626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#595959')}
                  />
                </Popconfirm>
              )}
              <DeleteOutlined
                style={{
                  color: '#595959',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#262626')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#595959')}
                onClick={() => {
                  setComponents(components.filter((c) => c.id !== params.data.id));
                }}
              />
            </div>
          );
        },
      },
    ],
    [components]
  );

  const componentsGridAgProps = useMemo(
    () => ({
      rowDragManaged: true,
      rowDragEntireRow: true,
      animateRows: true,
      suppressRowClickSelection: true,
      suppressMovableColumns: true,
      domLayout: 'normal',
      headerHeight: 40,
      rowHeight: 40,
      defaultColDef: {
        sortable: false,
        filter: false,
        resizable: true,
      },
      onCellValueChanged: (event: any) => {
        // Force re-render to update formula preview
        setComponents([...components]);
      },
      onRowDragEnd: (event: any) => {
        // Get all rows in their new order
        const newOrder: any[] = [];
        event.api.forEachNode((node: any) => newOrder.push(node.data));
        setComponents(newOrder);
      },
    }),
    [components]
  );

  // Valid For time options
  const validForOptions = [
    // Quick select options
    { value: 'midnight-midnight', label: '12 to 12 (Midnight to Midnight)' },
    { value: '6pm-6pm', label: '6 to 6 (6 PM to 6 PM)' },
    { value: 'divider', label: '─────────────────────────────', disabled: true },
    // Full hourly options
    { value: '12am-12am', label: '12 AM to 12 AM' },
    { value: '1am-1am', label: '1 AM to 1 AM' },
    { value: '2am-2am', label: '2 AM to 2 AM' },
    { value: '3am-3am', label: '3 AM to 3 AM' },
    { value: '4am-4am', label: '4 AM to 4 AM' },
    { value: '5am-5am', label: '5 AM to 5 AM' },
    { value: '6am-6am', label: '6 AM to 6 AM' },
    { value: '7am-7am', label: '7 AM to 7 AM' },
    { value: '8am-8am', label: '8 AM to 8 AM' },
    { value: '9am-9am', label: '9 AM to 9 AM' },
    { value: '10am-10am', label: '10 AM to 10 AM' },
    { value: '11am-11am', label: '11 AM to 11 AM' },
    { value: '12pm-12pm', label: '12 PM to 12 PM' },
    { value: '1pm-1pm', label: '1 PM to 1 PM' },
    { value: '2pm-2pm', label: '2 PM to 2 PM' },
    { value: '3pm-3pm', label: '3 PM to 3 PM' },
    { value: '4pm-4pm', label: '4 PM to 4 PM' },
    { value: '5pm-5pm', label: '5 PM to 5 PM' },
    { value: '6pm-6pm', label: '6 PM to 6 PM' },
    { value: '7pm-7pm', label: '7 PM to 7 PM' },
    { value: '8pm-8pm', label: '8 PM to 8 PM' },
    { value: '9pm-9pm', label: '9 PM to 9 PM' },
    { value: '10pm-10pm', label: '10 PM to 10 PM' },
    { value: '11pm-11pm', label: '11 PM to 11 PM' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {isFutureMode ? (
        /* Future State Mode: Show Tabs */
        <>
          <style>{`
                    .index-offer-tabs {
                        flex: 1 !important;
                        min-height: 0;
                    }
                    .index-offer-tabs .ant-tabs-content-holder {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                    }
                    .index-offer-tabs .ant-tabs-content {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        min-height: 0;
                    }
                    .index-offer-tabs .ant-tabs-tabpane-active {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        min-height: 0;
                    }
                    .index-offer-tabs .ant-tabs-tabpane[aria-hidden="true"] {
                        display: none;
                    }
                `}</style>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            className="index-offer-tabs"
            items={[
              {
                key: 'offer-management',
                label: 'Offer Management',
                children: (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <AnalyticsPane
                      open={showAnalytics}
                      view={viewMode === 'analytics' ? 'analytics' : 'panel'}
                      onViewChange={(v) => setViewMode(v)}
                      selectedRow={selectedRowForContext}
                      onClearSelection={() => setSelectedRowForContext(null)}
                      marketData={selectedMarketContext ?? null}
                      analyticsRowData={analyticsRowData}
                      analyticsColumnDefs={analyticsColumnDefs}
                      storageKey="offer-management-analytics-grid"
                    />
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <GraviGrid
                        key="offer-management-grid"
                        storageKey="index-offer-management-grid"
                        rowData={rowData}
                        columnDefs={columnDefs}
                        agPropOverrides={agPropOverrides}
                        controlBarProps={controlBarProps}
                        updateEP={updateEP}
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: 'offer-pricing',
                label: 'Offer Pricing',
                children: (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <AnalyticsPane
                      open={showAnalytics}
                      view={viewMode === 'analytics' ? 'analytics' : 'panel'}
                      onViewChange={(v) => setViewMode(v)}
                      selectedRow={selectedPricingRow}
                      onClearSelection={() => setSelectedPricingRow(null)}
                      marketData={
                        selectedPricingRow
                          ? getMarketContextForOffer(selectedPricingRow.id) ?? null
                          : null
                      }
                      analyticsRowData={analyticsRowData}
                      analyticsColumnDefs={analyticsColumnDefs}
                      storageKey="offer-pricing-analytics-grid"
                    />

                    {/* Price Offers Grid with Built-in Bulk Change Mode */}
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <GraviGrid
                        externalRef={pricingGridApiRef}
                        rowData={samplePricingRowData}
                        columnDefs={samplePricingColumnDefs}
                        agPropOverrides={pricingGridAgPropOverrides}
                        controlBarProps={{
                          title: 'Price Offers',
                          hideActiveFilters: false,
                          actionButtons: (
                            <Horizontal gap={12} style={{ alignItems: 'center' }}>
                              <Tooltip title="Toggle analytics panel">
                                <Switch
                                  checked={showAnalytics}
                                  onChange={setShowAnalytics}
                                  checkedChildren={<BarChartOutlined />}
                                  unCheckedChildren={<BarChartOutlined />}
                                />
                              </Tooltip>
                              <GraviButton
                                buttonText="Publish"
                                icon={<SendOutlined />}
                                appearance="solid"
                                onClick={() => {
                                  if (isBulkChangeVisible) {
                                    // In bulk change mode: publish only selected rows
                                    const gridApi = pricingGridApiRef.current?.api || pricingGridApiRef.current;
                                    const selectedRows = gridApi?.getSelectedRows?.() || [];
                                    setSelectedRowsToPublish(selectedRows);
                                  } else {
                                    // Not in bulk change mode: publish all rows
                                    setSelectedRowsToPublish(samplePricingRowData);
                                  }
                                  setPublishDrawerVisible(true);
                                }}
                                style={{ backgroundColor: '#51b073', color: 'white', borderColor: '#51b073' }}
                              />
                            </Horizontal>
                          ),
                        }}
                        isBulkChangeVisible={isBulkChangeVisible}
                        setIsBulkChangeVisible={setIsBulkChangeVisible}
                        isBulkChangeCompactMode
                        hideSaveDisplay
                        hideBulkSaveButtons
                        updateEP={async (changes: any) => {
                          // Handle bulk changes - update the state
                          if (Array.isArray(changes)) {
                            setSamplePricingRowData((prevData: any[]) => {
                              return prevData.map((row: any) => {
                                const updatedRow = changes.find((c: any) => c.id === row.id);
                                return updatedRow || row;
                              });
                            });
                          }
                          return Promise.resolve();
                        }}
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </>
      ) : (
        /* MVP Mode: Just show main grid without tabs */
        <div style={{ flex: 1, minHeight: 0 }}>
          <GraviGrid
            storageKey="index-offer-management-grid"
            rowData={rowData}
            columnDefs={columnDefs}
            agPropOverrides={agPropOverrides}
            controlBarProps={controlBarProps}
            updateEP={updateEP}
          />
        </div>
      )}

      {/* Floating Action Button for View Settings */}
      <Button
        type="primary"
        shape="circle"
        icon={<EyeOutlined />}
        size="large"
        onClick={() => setSettingsDrawerVisible(true)}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '96px',
          width: '56px',
          height: '56px',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      {/* Bottom Drawer */}
      <Drawer
        title={null}
        placement="bottom"
        height="80vh"
        onClose={() => setOfferDrawerVisible(false)}
        open={offerDrawerVisible}
        mask={true}
        closable={false}
        destroyOnHidden
        styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#002140',
            padding: '20px 24px',
            flexShrink: 0,
          }}
        >
          <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Vertical gap={4}>
              <Horizontal gap={12} style={{ alignItems: 'center' }}>
                <Texto style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                  {isEditMode ? 'Edit Index Offer' : 'Create Index Offer'}
                </Texto>
                <BBDTag style={{ margin: 0 }}>Formula</BBDTag>
              </Horizontal>
              <Texto style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
                Configure your index-based pricing offer with contract price formula
              </Texto>
            </Vertical>
            <Button
              type="link"
              onClick={() => setOfferDrawerVisible(false)}
              style={{ color: '#ffffff', fontSize: '20px', padding: 0, height: 'auto' }}
            >
              ×
            </Button>
          </Horizontal>
        </div>

        {/* Content - Either Save Template Form, Template Chooser, or Main Form */}
        {showSaveTemplateForm ? (
          /* Save Template Form View */
          <SaveTemplateForm
            key={Date.now()}
            initialData={{
              formulaName: '', // Index offers don't have a formula name
              components: components,
              product: product,
              location: location,
            }}
            onSave={(templateData) => {
              handleSaveAsTemplate(templateData);
              setShowSaveTemplateForm(false);
            }}
            onCancel={() => setShowSaveTemplateForm(false)}
          />
        ) : showTemplateChooser ? (
          /* Template Chooser View */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <TemplateChooser
              templates={templates}
              onTemplateSelect={handleTemplateSelect}
              buildFormulaPreview={buildFormulaPreview}
              showManageButton={true}
              title="Select a Formula Template"
              subtitle="Choose a pre-configured pricing formula to add to your offer"
              defaultFilters={{
                'contractType-Index Deal': { value: 'Index Deal', enabled: true },
              }}
              onManageTemplates={() => {
                window.open('/ContractFormulas/FormulaTemplates', '_blank');
              }}
              onClose={() => setShowTemplateChooser(false)}
              showExternalName={true}
            />
          </div>
        ) : (
          /* Main Form View */
          <Vertical
            gap={24} style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '24px' }}
          >
            {/* SECTION 1: Reference Data */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '16px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Reference Data
              </Texto>
              <Horizontal gap={16}>
                <div style={{ width: '25%' }}>
                  <Texto
                    style={{
                      fontSize: '11px',
                      color: '#8c8c8c',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Product <span style={{ color: '#ff4d4f' }}>*</span>
                  </Texto>
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select product"
                    value={product}
                    onChange={setProduct}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                      { value: '87 Gas', label: '87 Gas' },
                      { value: 'ULSD 2', label: 'ULSD 2' },
                      { value: '93 Premium', label: '93 Premium' },
                      { value: 'B7 GHL', label: 'B7 GHL' },
                      { value: 'Mid-Grade 88', label: 'Mid-Grade 88' },
                    ]}
                  />
                </div>
                <div style={{ width: '25%' }}>
                  <Texto
                    style={{
                      fontSize: '11px',
                      color: '#8c8c8c',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Location <span style={{ color: '#ff4d4f' }}>*</span>
                  </Texto>
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select location"
                    value={location}
                    onChange={setLocation}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                      { value: 'Houston', label: 'Houston' },
                      { value: 'Nashville Terminal', label: 'Nashville Terminal' },
                      { value: 'Detroit Terminal', label: 'Detroit Terminal' },
                      { value: 'Columbia Terminal', label: 'Columbia Terminal' },
                    ]}
                  />
                </div>
              </Horizontal>
            </div>

            {/* SECTION 2: Formula Display Name */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Formula Display Name
              </Texto>

              {/* Auto-Generated Display Name */}
              <div className="mb-2">
                <Texto
                  style={{
                    fontSize: '11px',
                    color: '#8c8c8c',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Auto-Generated Formula
                </Texto>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: '1.8',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    minHeight: '60px',
                  }}
                >
                  {autoGeneratedPreview || 'No components added yet'}
                </div>
              </div>

              {/* Internal Override Checkbox */}
              <div className="mb-2">
                <Checkbox
                  checked={useInternalOverride}
                  onChange={(e) => setUseInternalOverride(e.target.checked)}
                >
                  Override Internal Display Name (Seller View)
                </Checkbox>
              </div>

              {/* Internal Override Field */}
              {useInternalOverride && (
                <div className="mb-2">
                  <Texto
                    style={{
                      fontSize: '11px',
                      color: '#8c8c8c',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Internal Display Name (Seller View)
                  </Texto>
                  <TextArea
                    placeholder="Enter custom formula display name for internal/seller view"
                    value={internalOverride}
                    onChange={(e) => setInternalOverride(e.target.value)}
                    rows={3}
                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '13px' }}
                  />
                </div>
              )}

              {/* External Override Checkbox */}
              <div className="mb-2">
                <Checkbox
                  checked={useExternalOverride}
                  onChange={(e) => setUseExternalOverride(e.target.checked)}
                >
                  Override External Display Name (Buyer View)
                </Checkbox>
              </div>

              {/* External Override Field */}
              {useExternalOverride && (
                <div>
                  <Texto
                    style={{
                      fontSize: '11px',
                      color: '#8c8c8c',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    External Display Name (Buyer View)
                  </Texto>
                  <TextArea
                    placeholder="Enter custom formula display name for external/buyer view"
                    value={externalOverride}
                    onChange={(e) => setExternalOverride(e.target.value)}
                    rows={3}
                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '13px' }}
                  />
                </div>
              )}
            </div>

            {/* SECTION 3: Formula Components */}
            <div>
              <Horizontal
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <Texto
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#595959',
                  }}
                >
                  Components
                </Texto>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <GraviButton
                    buttonText="Add Row"
                    icon={<PlusOutlined />}
                    appearance="success"
                    onClick={handleAddRow}
                  />
                  <GraviButton
                    buttonText="Add Template"
                    icon={<PlusOutlined />}
                    appearance="outlined"
                    onClick={handleOpenTemplateChooser}
                  />
                  <GraviButton
                    buttonText="Save as Template"
                    icon={<SettingOutlined />}
                    appearance="outlined"
                    onClick={() => setShowSaveTemplateForm(true)}
                  />
                </div>
              </Horizontal>
              <div style={{ height: '300px', width: '100%' }}>
                <GraviGrid
                  rowData={components}
                  columnDefs={componentsColumnDefs}
                  agPropOverrides={componentsGridAgProps}
                  hideControlBar={true}
                />
              </div>
            </div>

            {/* SECTION 4: Additional Terms */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '16px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Additional Terms
              </Texto>

              {/* First Row: Three dropdowns at 75% width */}
              <div style={{ width: '75%', marginBottom: '16px' }}>
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
                >
                  {/* Effective Time */}
                  <div>
                    <Texto
                      style={{
                        fontSize: '11px',
                        color: '#8c8c8c',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Effective Time <span style={{ color: '#ff4d4f' }}>*</span>
                    </Texto>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Select valid hours"
                      value={validFor}
                      onChange={setValidFor}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={validForOptions}
                    />
                  </div>

                  {/* Weekend Rule */}
                  <div>
                    <Texto
                      style={{
                        fontSize: '11px',
                        color: '#8c8c8c',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Weekend Rule <span style={{ color: '#ff4d4f' }}>*</span>
                    </Texto>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Select weekend rule"
                      value={weekendRule}
                      onChange={setWeekendRule}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'use-friday', label: 'Use Friday' },
                        { value: 'use-saturday', label: 'Use Saturday' },
                      ]}
                    />
                  </div>

                  {/* Holiday Rule */}
                  <div>
                    <Texto
                      style={{
                        fontSize: '11px',
                        color: '#8c8c8c',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Holiday Rule <span style={{ color: '#ff4d4f' }}>*</span>
                    </Texto>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Select holiday rule"
                      value={holidayRule}
                      onChange={setHolidayRule}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'use-last-business-day', label: 'Use Last Business Day' },
                        { value: 'use-next-business-day', label: 'Use Next Business Day' },
                      ]}
                    />
                  </div>

                </div>
              </div>

              {/* Second Row: Terms at 75% width */}
              <div style={{ width: '75%' }}>
                <Texto
                  style={{
                    fontSize: '11px',
                    color: '#8c8c8c',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Terms
                </Texto>
                <TextArea
                  rows={4}
                  maxLength={500}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Enter terms and conditions (optional)"
                />
              </div>
            </div>

            {/* SECTION 5 & 6: Formula Differential and Calculated Price - Side by Side */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: isFutureMode ? '1fr 1fr' : '1fr', gap: '24px' }}>
                {/* Formula Differential */}
                <div>
                  <Texto
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      marginBottom: '12px',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: '#595959',
                    }}
                  >
                    Formula Differential
                  </Texto>
                  <InputNumber
                    style={{
                      width: '100%',
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                    step={0.0001}
                    value={parseFloat(differential)}
                    onChange={(value) => setDifferential(value?.toFixed(4) || '0.0000')}
                    precision={4}
                    prefix="$"
                    controls={false}
                  />
                  <Texto
                    style={{
                      fontSize: '11px',
                      color: '#8c8c8c',
                      marginTop: '8px',
                      display: 'block',
                    }}
                  >
                    Added to calculated formula price
                  </Texto>
                </div>

                {/* Current Calculated Price - Future State Only */}
                {isFutureMode && (
                  <div>
                    <Texto
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        marginBottom: '12px',
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#595959',
                      }}
                    >
                      Current Calculated Price
                    </Texto>
                    <div
                      style={{
                        backgroundColor: '#fafafa',
                        padding: '16px',
                        borderRadius: '4px',
                        border: '1px solid #e8e8e8',
                      }}
                    >
                      <Horizontal
                        style={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <Texto style={{ fontSize: '24px', fontWeight: 600, color: '#8c8c8c' }}>
                          $0.0000
                        </Texto>
                        <Button
                          type="text"
                          size="small"
                          icon={<ReloadOutlined />}
                          style={{ padding: '4px 8px', color: '#595959' }}
                        >
                          Refresh
                        </Button>
                      </Horizontal>
                      <Texto
                        style={{
                          fontSize: '11px',
                          color: '#8c8c8c',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        As of: --
                      </Texto>
                      <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block' }}>
                        Current price. Invoice generated with effective price at time of lifting.
                      </Texto>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 7: Configuration */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Configuration
              </Texto>
              <div>
                <Checkbox
                  checked={isInternalOnly}
                  onChange={(e) => setIsInternalOnly(e.target.checked)}
                >
                  Internal Only (Hide from external buyers)
                </Checkbox>
              </div>
            </div>
          </Vertical>
        )}

        {/* Fixed Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #d9d9d9',
            backgroundColor: '#ffffff',
            flexShrink: 0,
            zIndex: 100,
          }}
        >
          <Horizontal gap={16} style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <Texto style={{ fontSize: '14px', fontWeight: 500 }}>Make Active</Texto>
              <Switch checked={isActive} onChange={setIsActive} />
            </Horizontal>
            <Button
              size="large"
              onClick={() => setOfferDrawerVisible(false)}
              style={{ minWidth: '100px' }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => handleSaveOffer(isActive)}
              style={{ minWidth: '100px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Save
            </Button>
          </Horizontal>
        </div>
      </Drawer>

      {/* View Settings Drawer */}
      <Drawer
        title="View Settings"
        placement="right"
        width={450}
        onClose={() => setSettingsDrawerVisible(false)}
        open={settingsDrawerVisible}
        zIndex={2000}
        maskClosable={true}
      >
        <Vertical gap={24}>
          {/* Feature Prioritization Section */}
          <div>
            <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
              Feature Prioritization
            </Texto>
            <Texto
              category="p2"
              appearance="medium"
              style={{ marginBottom: '16px', display: 'block', color: '#8c8c8c' }}
            >
              Control which features are visible
            </Texto>

            <Radio.Group
              value={featureMode}
              onChange={(e) => setFeatureMode(e.target.value)}
              style={{ width: '100%' }}
            >
              <Vertical gap={12}>
                {/* MVP Mode */}
                <div
                  style={{
                    padding: '16px',
                    border: featureMode === 'mvp' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: '8px',
                    backgroundColor: featureMode === 'mvp' ? '#f0f7ff' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setFeatureMode('mvp')}
                >
                  <Radio value="mvp" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                      MVP Mode
                    </Texto>
                  </Radio>
                  <Texto
                    style={{
                      fontSize: '12px',
                      color: '#8c8c8c',
                      display: 'block',
                      marginLeft: '24px',
                    }}
                  >
                    Shows core features ready for production. Hides future-state features.
                  </Texto>
                </div>

                {/* Future State Mode */}
                <div
                  style={{
                    padding: '16px',
                    border:
                      featureMode === 'future-state' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: '8px',
                    backgroundColor: featureMode === 'future-state' ? '#f0f7ff' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setFeatureMode('future-state')}
                >
                  <Radio value="future-state" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                      Future State
                    </Texto>
                  </Radio>
                  <Texto
                    style={{
                      fontSize: '12px',
                      color: '#8c8c8c',
                      display: 'block',
                      marginLeft: '24px',
                    }}
                  >
                    Shows all features including upcoming competitive analytics and market context.
                  </Texto>
                </div>
              </Vertical>
            </Radio.Group>

            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#e6f4ff',
                borderRadius: '4px',
                border: '1px solid #91caff',
              }}
            >
              <Texto style={{ fontSize: '12px', color: '#0958d9', fontWeight: 500 }}>
                ℹ️ This setting applies globally across all pages
              </Texto>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #d9d9d9' }} />

          {/* Market Context View Mode (only visible in Future State) */}
          {isFutureMode && (
            <div>
              <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
                Market Context Display
              </Texto>
              <Texto
                category="p2"
                appearance="medium"
                style={{ marginBottom: '16px', display: 'block', color: '#8c8c8c' }}
              >
                Choose how competitive pricing context is displayed
              </Texto>

              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                style={{ width: '100%' }}
              >
                <Vertical gap={12}>
                  {/* Panel Mode */}
                  <div
                    style={{
                      padding: '16px',
                      border: viewMode === 'panel' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      backgroundColor: viewMode === 'panel' ? '#f0f7ff' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setViewMode('panel')}
                  >
                    <Radio value="panel" style={{ marginBottom: '8px' }}>
                      <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                        Analytics Panel View
                      </Texto>
                    </Radio>
                    <Texto
                      style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        display: 'block',
                        marginLeft: '24px',
                      }}
                    >
                      Click any row to see detailed market context in a panel above the grid. Shows
                      Opus contracts, rack pricing, publisher data, volume pacing, and competitive
                      rank.
                    </Texto>
                  </div>

                  {/* Columns Mode */}
                  <div
                    style={{
                      padding: '16px',
                      border: viewMode === 'columns' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      backgroundColor: viewMode === 'columns' ? '#f0f7ff' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setViewMode('columns')}
                  >
                    <Radio value="columns" style={{ marginBottom: '8px' }}>
                      <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                        Grid Columns View
                      </Texto>
                    </Radio>
                    <Texto
                      style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        display: 'block',
                        marginLeft: '24px',
                      }}
                    >
                      Add market data columns directly to the grid showing Opus low/avg prices,
                      Argus pricing, rack delta, and competitive rank. Best for side-by-side
                      comparison.
                    </Texto>
                  </div>

                  {/* Rank Mode */}
                  <div
                    style={{
                      padding: '16px',
                      border: viewMode === 'rank' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      backgroundColor: viewMode === 'rank' ? '#f0f7ff' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setViewMode('rank')}
                  >
                    <Radio value="rank" style={{ marginBottom: '8px' }}>
                      <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                        Rank Only View
                      </Texto>
                    </Radio>
                    <Texto
                      style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        display: 'block',
                        marginLeft: '24px',
                      }}
                    >
                      Show a single compact column with your competitive ranking (1-10). Minimal
                      view for quick assessment of competitiveness.
                    </Texto>
                  </div>

                  {/* Analytics Grid Mode */}
                  <div
                    style={{
                      padding: '16px',
                      border: viewMode === 'analytics' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      backgroundColor: viewMode === 'analytics' ? '#f0f7ff' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setViewMode('analytics')}
                  >
                    <Radio value="analytics" style={{ marginBottom: '8px' }}>
                      <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                        Analytics Grid View
                      </Texto>
                    </Radio>
                    <Texto
                      style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        display: 'block',
                        marginLeft: '24px',
                      }}
                    >
                      Click any row to see detailed competitive analysis in a grid format. Shows
                      competitor prices, rankings, trends, and differences in a sortable table with
                      visual indicators.
                    </Texto>
                  </div>
                </Vertical>
              </Radio.Group>
            </div>
          )}

          {/* Divider */}
          {isFutureMode && <div style={{ borderTop: '1px solid #d9d9d9' }} />}

          {/* Grid Options */}
          <div>
            <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
              Grid Display Options
            </Texto>
            <Texto category="p2" appearance="medium">
              Configure how index offers are displayed in the grid.
            </Texto>
          </div>

          <div>
            <Texto category="p2" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
              Column Visibility
            </Texto>
            <Texto
              category="p2"
              appearance="medium"
              style={{ marginBottom: '12px', display: 'block' }}
            >
              Show/hide columns using the grid's column menu (click the hamburger icon in any column
              header).
            </Texto>
          </div>

          <div>
            <Texto category="p2" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
              Grouping
            </Texto>
            <Texto category="p2" appearance="medium">
              Drag column headers to the grouping area at the top of the grid to group by that
              column.
            </Texto>
          </div>
        </Vertical>
      </Drawer>

      {/* Publish Drawer */}
      <Drawer
        title={null}
        placement="bottom"
        height="80vh"
        onClose={() => {
          setPublishDrawerVisible(false);
          setPublishSearchText('');
          setPublishDateTime(null);
        }}
        open={publishDrawerVisible}
        mask={true}
        closable={false}
        destroyOnHidden
        styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#002140',
            padding: '20px 24px',
            flexShrink: 0,
          }}
        >
          <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Vertical gap={4}>
              <Texto style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                Publish Index Offers
              </Texto>
              <Texto style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
                Publish selected price offers
              </Texto>
            </Vertical>
            <Button
              type="link"
              onClick={() => {
                setPublishDrawerVisible(false);
                setPublishSearchText('');
                setPublishDateTime(null);
              }}
              style={{ color: '#ffffff', fontSize: '20px', padding: 0, height: 'auto' }}
            >
              ×
            </Button>
          </Horizontal>
        </div>

        {/* Results Count and Search Bar */}
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #e8e8e8',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Texto style={{ color: '#1890ff', fontWeight: 600 }}>
            {filteredPublishRows.length} Results
          </Texto>
          <Input
            placeholder="Search here"
            value={publishSearchText}
            onChange={(e) => setPublishSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        {/* Main Grid Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <GraviGrid
            storageKey="publish-drawer-grid"
            rowData={filteredPublishRows}
            columnDefs={publishColumnDefs}
            agPropOverrides={{
              getRowId: (params: any) => String(params.data.id),
              domLayout: 'normal',
              headerHeight: 40,
              rowHeight: 40,
              suppressRowClickSelection: true,
            }}
            hideControlBar
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #d9d9d9',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {/* Left side - Publisher label and date picker */}
          <Horizontal gap={16} style={{ alignItems: 'center' }}>
            <Texto style={{ color: '#1890ff', fontWeight: 600 }}>Publisher</Texto>
            <DatePicker
              showTime
              format="MM/DD/YYYY hh:mm A"
              placeholder="Schedule (optional)"
              value={publishDateTime}
              onChange={setPublishDateTime}
              style={{ width: 220 }}
            />
          </Horizontal>

          {/* Right side - Action buttons */}
          <Horizontal gap={12}>
            <Button
              onClick={() => {
                setPublishDrawerVisible(false);
                setPublishSearchText('');
                setPublishDateTime(null);
              }}
            >
              Keep Editing
            </Button>
            <GraviButton
              buttonText="Confirm Publish"
              appearance="solid"
              onClick={handleConfirmPublish}
              disabled={filteredPublishRows.length === 0}
              style={{ backgroundColor: '#51b073', borderColor: '#51b073', color: '#ffffff' }}
            />
          </Horizontal>
        </div>
      </Drawer>
    </div>
  );
}
