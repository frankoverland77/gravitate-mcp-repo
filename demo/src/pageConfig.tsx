import {
  SmileFilled,
  TableOutlined,
  EditOutlined,
  DashboardOutlined,
  ShopOutlined,
  CalculatorOutlined,
  GlobalOutlined,
  CreditCardOutlined,
  BellOutlined,
  FileTextOutlined,
  SwapOutlined,
  DollarOutlined,
  BgColorsOutlined,
  LineChartOutlined,
  BookOutlined,
  SyncOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import { WelcomePage } from './pages/WelcomePages/WelcomePage';
import { ProjectHub } from './pages/ProjectHub/ProjectHub';
import { PriceElasticity } from './pages/demos/PriceElasticity/PriceElasticity';
import { ContractManagementPage, CreateContractPage } from './pages/ContractManagement';
import { CustomerForm } from './pages/demos/forms/CustomerForm/CustomerForm';
import { ProductGrid } from './pages/demos/grids/ProductGrid/ProductGrid';
import { FormulaManager } from './pages/demos/grids/FormulaManager';
import { DeliveryManager } from './pages/demos/delivery/DeliveryManager';
import { PromptsGrid } from './pages/demos/grids/PromptsGrid';
import { FormulaTemplates } from './pages/demos/grids/FormulaTemplates';

import { ContractDetails } from './pages/demos/grids/ContractDetails';
import { OnlineSellingPlatformHome } from './pages/OnlineSellingPlatform/OnlineSellingPlatformHome';
import { IndexOfferManagement } from './pages/OnlineSellingPlatform/IndexOfferManagement';
import { IndexOfferBuyNow } from './pages/OnlineSellingPlatform/IndexOfferBuyNow';
import { SupplierAnalysis } from './pages/OnlineSellingPlatform/SupplierAnalysis';
import { SupplierDetails } from './pages/OnlineSellingPlatform/SupplierDetails';
import { GlobalTieredPricing } from './pages/GlobalTieredPricing/GlobalTieredPricing';
import { ContractMeasurementGrid } from './pages/ContractMeasurement/ContractMeasurementGrid';
import { ContractMeasurementDetails } from './pages/ContractMeasurement/ContractMeasurementDetails';
import { ThemeRouteWrapper } from './components/shared/ThemeRouteWrapper';
import { BulkChangeTest } from './pages/demos/BulkChangeTest/BulkChangeTest';
import { SubscriptionManagement } from './pages/SubscriptionManagement/SubscriptionManagement';
import { RFPManagement } from './pages/RFP';
import { SellerRFPPage } from './pages/SellerRFP';
import { NegotiationModePage } from './pages/NegotiationMode/NegotiationModePage';
import { DeliveredPricing } from './pages/DeliveredPricing/DeliveredPricing';
import { FreightManagement } from './pages/DeliveredPricing/FreightManagement/FreightManagement';
import { TaxManagement } from './pages/DeliveredPricing/TaxManagement/TaxManagement';
import { QuotebookWholesale } from './pages/QuotebookWholesale/QuotebookWholesale';
import { QuoteBook } from './pages/QuotePricing/QuoteBook/QuoteBook';
import { ManageQuoteRows } from './pages/QuotePricing/ManageQuoteRows/ManageQuoteRows';
import { QuotebookQoLPage } from './pages/QuotebookQoL';
import { RowRefreshPage } from './pages/QuotebookQoL/RowRefresh';
import { PriceEntryPage } from './pages/QuotebookQoL/PriceEntry';
import {
  TypographyShowcase,
  ButtonsShowcase,
  TagsShowcase,
  DataDisplayShowcase,
  HeadersShowcase,
  LayoutShowcase,
  DateTimeShowcase,
  FormControlsShowcase,
  FeedbackShowcase,
  NavigationShowcase,
  CellRenderersShowcase,
  GridShowcase,
  ColorsShowcase,
} from './pages/DesignSystem';
import { AllPricesPage, ContractValuesPage } from './pages/PriceManagement';

// Demo registry - automatically populated by MCP server
interface DemoRoute {
  key: string;
  title: string;
  element: JSX.Element;
  path: string;
  description: string;
  created: string;
  category: 'grids' | 'forms' | 'dashboards' | 'contract-management';
}

interface RouteConfig {
  hasPermission: () => boolean;
  key: string;
  title: string;
  element?: JSX.Element;
  path?: string;
  description?: string;
  hidden?: boolean;
}

interface SectionConfig {
  hasPermission: () => boolean;
  key: string;
  icon: JSX.Element;
  title: string;
  element?: JSX.Element;
  path?: string;
  routes?: RouteConfig[];
}

type PageConfig = Record<string, SectionConfig>;

// Helper to convert demo routes to route config
const mapDemoToRoute = (demo: DemoRoute): RouteConfig => ({
  hasPermission: () => true,
  key: demo.key,
  title: demo.title,
  element: demo.element,
  path: demo.path,
  description: demo.description,
});

// Helper to filter and map demos by category
const getRoutesByCategory = (category: DemoRoute['category']) =>
  demoRegistry.filter((demo) => demo.category === category).map(mapDemoToRoute);

// Registry of all available demos - MCP server will populate this
export const demoRegistry: DemoRoute[] = [
  {
    key: 'BakeryProducts',
    title: 'Bakery Products',
    element: <ProductGrid />,
    path: '/demos/grids/bakery-products',
    description: 'Interactive bakery product data grid with real-time updates',
    created: new Date().toISOString(),
    category: 'grids',
  },
  {
    key: 'FormulaManager',
    title: 'Formula Manager',
    element: <FormulaManager />,
    path: '/demos/grids/formula-manager',
    description: 'Manage and apply pricing formulas dynamically',
    created: new Date().toISOString(),
    category: 'grids',
  },
  {
    key: 'DeliveryManagement',
    title: 'Delivery Management',
    element: <DeliveryManager />,
    path: '/demos/grids/delivery-management',
    description: 'Complete delivery management with routes, drivers, and tracking',
    created: new Date().toISOString(),
    category: 'grids',
  },
  {
    key: 'CustomerForm',
    title: 'Customer Form',
    element: <CustomerForm />,
    path: '/demos/forms/customer-form',
    description: 'Customer management form with validation',
    created: new Date().toISOString(),
    category: 'forms',
  },
  {
    key: 'PromptsGrid',
    title: 'Contracts',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <PromptsGrid />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/PromptsGrid',
    description: 'Contract formula prompts management grid',
    created: new Date().toISOString(),
    category: 'contract-management',
  },
  {
    key: 'FormulaTemplates',
    title: 'Formula Template Manager',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <FormulaTemplates />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/FormulaTemplates',
    description: 'Manage and organize pricing formula templates',
    created: new Date().toISOString(),
    category: 'contract-management',
  },
  {
    key: 'ContractDetails',
    title: 'Contract Details',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <ContractDetails />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/ContractDetails/:id',
    description: 'Contract details view',
    created: new Date().toISOString(),
    category: 'contract-management',
  },
  {
    key: 'SupplierAnalysis',
    title: 'Competitor Price Analysis',
    element: (
      <ThemeRouteWrapper theme="OSP">
        <SupplierAnalysis />
      </ThemeRouteWrapper>
    ),
    path: '/SupplierAnalysis/SupplierAnalysis',
    description: 'Analyze supplier profiles and pricing strategies',
    created: new Date().toISOString(),
    category: 'grids',
  },
  {
    key: 'SupplierDetails',
    title: 'Competitor Details',
    element: (
      <ThemeRouteWrapper theme="OSP">
        <SupplierDetails />
      </ThemeRouteWrapper>
    ),
    path: '/SupplierAnalysis/SupplierDetails',
    description: 'Detailed supplier analysis',
    created: new Date().toISOString(),
    category: 'grids',
  },
  {
    key: 'ContractMeasurementGrid',
    title: 'Contract Measurement',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <ContractMeasurementGrid />
      </ThemeRouteWrapper>
    ),
    path: '/ContractMeasurement/ContractMeasurementGrid',
    description: 'Contract measurement tracking grid',
    created: new Date().toISOString(),
    category: 'grids',
  },
  {
    key: 'ContractMeasurementDetails',
    title: 'Measurement Details',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <ContractMeasurementDetails />
      </ThemeRouteWrapper>
    ),
    path: '/ContractMeasurement/ContractMeasurementDetails',
    description: 'Contract measurement details view',
    created: new Date().toISOString(),
    category: 'grids',
  },
  // Contract Management routes
  {
    key: 'ContractsList',
    title: 'Contracts - New',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <ContractManagementPage />
      </ThemeRouteWrapper>
    ),
    path: '/Contracts/ContractsList',
    description: 'View and manage all contracts',
    created: new Date().toISOString(),
    category: 'contract-management',
  },
  {
    key: 'CreateContract',
    title: 'Create Contract - New',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <CreateContractPage />
      </ThemeRouteWrapper>
    ),
    path: '/Contracts/CreateContract',
    description: 'Create a new contract',
    created: new Date().toISOString(),
    category: 'contract-management',
  },
  {
    key: 'EditContract',
    title: 'Edit Contract - New',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <CreateContractPage />
      </ThemeRouteWrapper>
    ),
    path: '/Contracts/EditContract',
    description: 'Edit or view an existing contract',
    created: new Date().toISOString(),
    category: 'contract-management',
  },
  // Delivered Pricing
  {
    key: 'DeliveredPricingQuoteBook',
    title: 'Delivered Pricing',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <DeliveredPricing />
      </ThemeRouteWrapper>
    ),
    path: '/DeliveredPricing/QuoteBook',
    description: 'End of Day delivered pricing quote book with cost, freight, and margin analysis',
    created: new Date().toISOString(),
    category: 'grids',
  },
  // Quotebook Wholesale
  {
    key: 'QuotebookWholesale',
    title: 'Quotebook Wholesale',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <QuotebookWholesale />
      </ThemeRouteWrapper>
    ),
    path: '/quotebookwholesale',
    description: 'End of Day wholesale pricing quote book with 25 dummy rows across 5 products and 5 locations',
    created: new Date().toISOString(),
    category: 'grids',
  },
  // Quotebook Quality of Life
  {
    key: 'QuotebookQoLAdHoc',
    title: 'Ad-Hoc Valuation (Story 1)',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <QuotebookQoLPage />
      </ThemeRouteWrapper>
    ),
    path: '/QuotebookQoL/AdHocValuation',
    description:
      'Ad-hoc valuation revalue button design prototype — Story 1 from Quotebook QoL epic',
    created: new Date().toISOString(),
    category: 'grids',
  },
  {
    key: 'QuotebookQoLRowRefresh',
    title: 'Row Refresh (Story 2)',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <RowRefreshPage />
      </ThemeRouteWrapper>
    ),
    path: '/QuotebookQoL/RowRefresh',
    description:
      'Single-row refresh with live revaluation after spread override save — Story 2 from Quotebook QoL epic',
    created: new Date().toISOString(),
    category: 'grids',
  },
  {
    key: 'QuotebookQoLPriceEntry',
    title: 'Price Entry (Story 4)',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <PriceEntryPage />
      </ThemeRouteWrapper>
    ),
    path: '/QuotebookQoL/PriceEntry',
    description:
      'Stacked price entry drawer with price history grid, date range filter, conflict check, and save & revalue flow — Story 4 from Quotebook QoL epic',
    created: new Date().toISOString(),
    category: 'grids',
  },
  // MCP server will add more demos here automatically
];

// Contract Management routes configuration
const getContractManagementRoutes = (): RouteConfig[] => [
  {
    hasPermission: () => true,
    key: 'PromptsGrid',
    title: 'Contracts',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <PromptsGrid />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/PromptsGrid',
    description: 'Contract formula prompts management grid',
  },
  {
    hasPermission: () => true,
    key: 'FormulaTemplates',
    title: 'Formula Templates',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <FormulaTemplates />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/FormulaTemplates',
    description: 'Manage and organize pricing formula templates',
  },
  {
    hasPermission: () => true,
    key: 'ContractDetails',
    title: 'Contract Details',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <ContractDetails />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/ContractDetails/:id',
    description: 'Contract details view',
    hidden: true,
  },
  {
    hasPermission: () => true,
    key: 'RFPManagement',
    title: 'RFP Management',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <RFPManagement />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/RFPManagement',
    description: 'Manage RFPs and supplier bidding rounds',
  },
  {
    hasPermission: () => true,
    key: 'SellerRFPResponse',
    title: 'Seller RFP Response',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <SellerRFPPage />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/SellerRFPResponse',
    description: 'Manage seller-side RFP responses with cost-aware pricing',
  },
  {
    hasPermission: () => true,
    key: 'ContractMeasurementGrid',
    title: 'Measurements',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <ContractMeasurementGrid />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/ContractMeasurementGrid',
    description: 'Contract measurement tracking grid',
  },
  {
    hasPermission: () => true,
    key: 'ContractMeasurementDetails',
    title: 'Measurement Details',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <ContractMeasurementDetails />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/ContractMeasurementDetails',
    description: 'Contract measurement details view',
    hidden: true,
  },
  {
    hasPermission: () => true,
    key: 'ContractsList',
    title: 'Contracts - New',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <ContractManagementPage />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/ContractsList',
    description: 'View and manage all contracts',
  },
  {
    hasPermission: () => true,
    key: 'CreateContract',
    title: 'Create Contract - New',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <CreateContractPage />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/CreateContract',
    description: 'Create a new contract',
    hidden: true,
  },
  {
    hasPermission: () => true,
    key: 'EditContract',
    title: 'Edit Contract - New',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <CreateContractPage />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/EditContract',
    hidden: true,
  },
];

// Supplier Analysis routes configuration
const getSupplierAnalysisRoutes = (): RouteConfig[] => [
  {
    hasPermission: () => true,
    key: 'SupplierProfileAnalysis',
    title: 'Competitor Price Analysis',
    element: (
      <ThemeRouteWrapper theme="OSP">
        <SupplierAnalysis />
      </ThemeRouteWrapper>
    ),
    path: '/SupplierAnalysis/SupplierAnalysis',
    description: 'Analyze supplier profiles and pricing strategies',
  },
  {
    hasPermission: () => true,
    key: 'SupplierDetails',
    title: 'Competitor Details',
    element: (
      <ThemeRouteWrapper theme="OSP">
        <SupplierDetails />
      </ThemeRouteWrapper>
    ),
    path: '/SupplierAnalysis/SupplierDetails',
    description: 'Detailed supplier analysis',
    hidden: true,
  },
];

export const createPageConfig = (): PageConfig => {
  // IMPORTANT: When adding new sections here (Grids, Forms, Dashboards, etc.),
  // you MUST also add the corresponding scope to the scopes object in
  // src/_Main/AuthenticatedRoute.jsx or the menu item will not appear!

  const gridsRoutes = getRoutesByCategory('grids');

  const dashboardRoutes = getRoutesByCategory('dashboards');

  const config: PageConfig = {
    ProjectHub: {
      hasPermission: () => true,
      key: 'ProjectHub',
      icon: <AppstoreOutlined />,
      title: 'Project Hub',
      element: <ProjectHub />,
      path: '/',
    },
    Welcome: {
      hasPermission: () => true,
      key: 'Sandbox',
      icon: <SmileFilled />,
      title: 'Sandbox',
      element: <WelcomePage />,
    },
  };

  config.DesignSystem = {
    hasPermission: () => true,
    key: 'DesignSystem',
    icon: <BgColorsOutlined />,
    title: 'Design System',
    routes: [
      {
        hasPermission: () => true,
        key: 'Typography',
        title: 'Typography',
        element: <TypographyShowcase />,
        path: '/DesignSystem/Typography',
      },
      {
        hasPermission: () => true,
        key: 'Buttons',
        title: 'Buttons',
        element: <ButtonsShowcase />,
        path: '/DesignSystem/Buttons',
      },
      {
        hasPermission: () => true,
        key: 'Tags',
        title: 'Tags',
        element: <TagsShowcase />,
        path: '/DesignSystem/Tags',
      },
      {
        hasPermission: () => true,
        key: 'DataDisplay',
        title: 'Data Display',
        element: <DataDisplayShowcase />,
        path: '/DesignSystem/DataDisplay',
      },
      {
        hasPermission: () => true,
        key: 'Headers',
        title: 'Headers',
        element: <HeadersShowcase />,
        path: '/DesignSystem/Headers',
      },
      {
        hasPermission: () => true,
        key: 'Layout',
        title: 'Layout',
        element: <LayoutShowcase />,
        path: '/DesignSystem/Layout',
      },
      {
        hasPermission: () => true,
        key: 'DateTime',
        title: 'Date & Time',
        element: <DateTimeShowcase />,
        path: '/DesignSystem/DateTime',
      },
      {
        hasPermission: () => true,
        key: 'FormControls',
        title: 'Form Controls',
        element: <FormControlsShowcase />,
        path: '/DesignSystem/FormControls',
      },
      {
        hasPermission: () => true,
        key: 'Feedback',
        title: 'Feedback',
        element: <FeedbackShowcase />,
        path: '/DesignSystem/Feedback',
      },
      {
        hasPermission: () => true,
        key: 'DSNavigation',
        title: 'Navigation',
        element: <NavigationShowcase />,
        path: '/DesignSystem/DSNavigation',
      },
      {
        hasPermission: () => true,
        key: 'CellRenderers',
        title: 'Cell Renderers',
        element: <CellRenderersShowcase />,
        path: '/DesignSystem/CellRenderers',
      },
      {
        hasPermission: () => true,
        key: 'Grid',
        title: 'Grid',
        element: <GridShowcase />,
        path: '/DesignSystem/Grid',
      },
      {
        hasPermission: () => true,
        key: 'Colors',
        title: 'Colors',
        element: <ColorsShowcase />,
        path: '/DesignSystem/Colors',
      },
    ],
  };

  if (gridsRoutes.length > 0) {
    config.Bakery = {
      hasPermission: () => true,
      key: 'Bakery',
      icon: <ShopOutlined />,
      title: 'Bakery',
      routes: gridsRoutes,
    };
  }

  config.BulkChangeTest = {
    hasPermission: () => true,
    key: 'BulkChangeTest',
    icon: <TableOutlined />,
    title: 'Bulk Change Test',
    element: <BulkChangeTest />,
    path: '/BulkChangeTest',
  };

  config.CustomerForm = {
    hasPermission: () => true,
    key: 'CustomerForm',
    icon: <EditOutlined />,
    title: 'Customer Form',
    element: <CustomerForm />,
    path: '/demos/forms/customer-form',
  };

  if (dashboardRoutes.length > 0) {
    config.Dashboards = {
      hasPermission: () => true,
      key: 'Dashboards',
      icon: <DashboardOutlined />,
      title: 'Dashboards',
      routes: dashboardRoutes,
    };
  }

  config.ContractFormulas = {
    hasPermission: () => true,
    key: 'ContractFormulas',
    icon: <CalculatorOutlined />,
    title: 'Contract Management',
    routes: getContractManagementRoutes(),
  };

  config.MarketPlatform = {
    hasPermission: () => true,
    key: 'MarketPlatform',
    icon: <ShopOutlined />,
    title: 'Online Selling Platform',
    routes: [
      {
        hasPermission: () => true,
        key: 'OnlineSellingPlatform',
        title: 'Buy Now',
        element: (
          <ThemeRouteWrapper theme="OSP">
            <OnlineSellingPlatformHome />
          </ThemeRouteWrapper>
        ),
        path: '/MarketPlatform/BuyNow',
        description: 'Online selling platform home',
      },
      {
        hasPermission: () => true,
        key: 'IndexOfferManagement',
        title: 'Index Offer Management',
        element: (
          <ThemeRouteWrapper theme="OSP">
            <IndexOfferManagement />
          </ThemeRouteWrapper>
        ),
        path: '/MarketPlatform/IndexOfferManagement',
        description: 'Manage index pricing offers for buyers',
      },
      {
        hasPermission: () => true,
        key: 'IndexOfferBuyNow',
        title: 'Index Offer Buy Now',
        element: (
          <ThemeRouteWrapper theme="OSP">
            <IndexOfferBuyNow />
          </ThemeRouteWrapper>
        ),
        path: '/MarketPlatform/IndexOfferBuyNow',
        description: 'Buyer experience for placing index pricing orders with pickup window dates',
      },
      {
        hasPermission: () => true,
        key: 'NegotiationMode',
        title: 'Negotiation Mode',
        element: (
          <ThemeRouteWrapper theme="OSP">
            <NegotiationModePage />
          </ThemeRouteWrapper>
        ),
        path: '/MarketPlatform/NegotiationMode',
        description: 'Negotiation mode for online selling',
      },
    ],
  };

  config.SupplierAnalysis = {
    hasPermission: () => true,
    key: 'SupplierAnalysis',
    icon: <DashboardOutlined />,
    title: 'Competitor Profile',
    routes: getSupplierAnalysisRoutes(),
  };

  config.GlobalTieredPricing = {
    hasPermission: () => true,
    key: 'GlobalTieredPricing',
    icon: <TableOutlined />,
    title: 'Global Tiered Diff',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <GlobalTieredPricing />
      </ThemeRouteWrapper>
    ),
    path: '/GlobalTieredPricing',
  };

  // Add Subscription Management section
  config.SubscriptionManagement = {
    hasPermission: () => true,
    key: 'SubscriptionManagement',
    icon: <BellOutlined />,
    title: 'Subscriptions',
    element: <SubscriptionManagement />,
    path: '/SubscriptionManagement',
  };

  // Add Contract Measurement section (uses PE_LIGHT theme)
  config.DeliveredPricing = {
    hasPermission: () => true,
    key: 'DeliveredPricing',
    icon: <DollarOutlined />,
    title: 'Delivered Pricing',
    routes: [
      {
        hasPermission: () => true,
        key: 'DeliveredPricingQuoteBook',
        title: 'Quote Book',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <DeliveredPricing />
          </ThemeRouteWrapper>
        ),
        path: '/DeliveredPricing/QuoteBook',
      },
      {
        hasPermission: () => true,
        key: 'FreightManagement',
        title: 'Freight Management',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <FreightManagement />
          </ThemeRouteWrapper>
        ),
        path: '/DeliveredPricing/FreightManagement',
      },
      {
        hasPermission: () => true,
        key: 'TaxManagement',
        title: 'Tax Management',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <TaxManagement />
          </ThemeRouteWrapper>
        ),
        path: '/DeliveredPricing/TaxManagement',
      },
    ],
  };

  config.SubscriptionManagement = {
    hasPermission: () => true,
    key: 'SubscriptionManagement',
    icon: <CreditCardOutlined />,
    title: 'Price Notifications',
    element: <SubscriptionManagement />,
    path: '/SubscriptionManagement',
  };

  // Contract Management (Quick Entry / Full Entry)
  config.PriceElasticity = {
    hasPermission: () => true,
    key: 'PriceElasticity',
    icon: <LineChartOutlined />,
    title: 'Price Elasticity - Needs work',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <PriceElasticity />
      </ThemeRouteWrapper>
    ),
    path: '/PriceElasticity',
  };

  config.QuotePricing = {
    hasPermission: () => true,
    key: 'QuotePricing',
    icon: <BookOutlined />,
    title: 'Pricing Engine (exceptions)',
    routes: [
      {
        hasPermission: () => true,
        key: 'QuoteBook',
        title: 'Quote Book Exceptions',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <QuoteBook />
          </ThemeRouteWrapper>
        ),
        path: '/QuotePricing/QuoteBook',
        description: 'Live pricing grid for managing and publishing quote group prices',
      },
      {
        hasPermission: () => true,
        key: 'ManageQuoteRows',
        title: 'Quote Rows',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <ManageQuoteRows />
          </ThemeRouteWrapper>
        ),
        path: '/QuotePricing/ManageQuoteRows',
        description: 'Configure which products and locations have active quote rows',
      },
      {
        hasPermission: () => true,
        key: 'QuotebookWholesale',
        title: 'Quotebook Wholesale',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <QuotebookWholesale />
          </ThemeRouteWrapper>
        ),
        path: '/QuotePricing/QuotebookWholesale',
        description: 'Wholesale quotebook pricing',
      },
    ],
  };

  config.QuotebookQoL = {
    hasPermission: () => true,
    key: 'QuotebookQoL',
    icon: <SyncOutlined />,
    title: 'Valuation, Refresh, Entry',
    routes: [
      {
        hasPermission: () => true,
        key: 'QuotebookQoLAdHoc',
        title: 'Ad-Hoc Valuation (Story 1)',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <QuotebookQoLPage />
          </ThemeRouteWrapper>
        ),
        path: '/QuotebookQoL/AdHocValuation',
        description: 'Ad-hoc valuation revalue button design prototype',
      },
      {
        hasPermission: () => true,
        key: 'QuotebookQoLRowRefresh',
        title: 'Row Refresh (Story 2)',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <RowRefreshPage />
          </ThemeRouteWrapper>
        ),
        path: '/QuotebookQoL/RowRefresh',
        description: 'Single-row refresh with live revaluation after spread override save',
      },
      {
        hasPermission: () => true,
        key: 'QuotebookQoLPriceEntry',
        title: 'Price Entry (Story 4)',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <PriceEntryPage />
          </ThemeRouteWrapper>
        ),
        path: '/QuotebookQoL/PriceEntry',
        description: 'Stacked price entry drawer with price history grid, conflict check, and save & revalue flow',
      },
    ],
  };

  config.PriceManagement = {
    hasPermission: () => true,
    key: 'PriceManagement',
    icon: <DollarOutlined />,
    title: 'Price Management',
    routes: [
      {
        hasPermission: () => true,
        key: 'AllPrices',
        title: 'All Prices',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <AllPricesPage />
          </ThemeRouteWrapper>
        ),
        path: '/PriceManagement/AllPrices',
        description: 'View all price instruments with inline price upload via reusable drawer',
      },
      {
        hasPermission: () => true,
        key: 'ContractValues',
        title: 'Contract Values',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <ContractValuesPage />
          </ThemeRouteWrapper>
        ),
        path: '/PriceManagement/ContractValues',
        description: 'Contract values with formula breakdown drawer and stacked price entry',
      },
    ],
  };

  return config;
};

// Helper function to get all demos (used by WelcomePage)
export const getAllDemos = () => demoRegistry;

// Helper function to add a new demo to the registry
export const addDemoToRegistry = (demo: DemoRoute) => {
  // Remove any existing demo with the same key to avoid duplicates
  const existingIndex = demoRegistry.findIndex((existing) => existing.key === demo.key);
  if (existingIndex >= 0) {
    demoRegistry[existingIndex] = demo;
  } else {
    demoRegistry.push(demo);
  }
};
