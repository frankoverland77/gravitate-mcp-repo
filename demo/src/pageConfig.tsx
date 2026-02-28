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
} from '@ant-design/icons';

import { WelcomePage } from './pages/WelcomePages/WelcomePage';
import { PriceElasticity } from './pages/demos/PriceElasticity/PriceElasticity';
import { ContractManagementPage, CreateContractPage } from './pages/ContractManagement';
import { CustomerForm } from './pages/demos/forms/CustomerForm/CustomerForm';
import { ProductGrid } from './pages/demos/grids/ProductGrid/ProductGrid';
import { FormulaManager } from './pages/demos/grids/FormulaManager';
import { DeliveryManager } from './pages/demos/delivery/DeliveryManager';
import { PromptsGrid } from './pages/demos/grids/PromptsGrid';
import { FormulaTemplates } from './pages/demos/grids/FormulaTemplates';
import { FormulaTemplateDetails } from './pages/demos/grids/FormulaTemplateDetails';
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
import { NegotiationModePage } from './pages/NegotiationMode/NegotiationModePage';
import { DeliveredPricing } from './pages/DeliveredPricing/DeliveredPricing';
import { FreightManagement } from './pages/DeliveredPricing/FreightManagement/FreightManagement';
import { TaxManagement } from './pages/DeliveredPricing/TaxManagement/TaxManagement';
import { QuotebookWholesale } from './pages/QuotebookWholesale/QuotebookWholesale';
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
} from './pages/DesignSystem';

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
    title: 'Prompts',
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
    key: 'FormulaTemplateDetails',
    title: 'Formula Template Details',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <FormulaTemplateDetails />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/FormulaTemplateDetails/:id',
    description: 'View formula template details',
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
    title: 'Supplier Price Analysis',
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
    title: 'Supplier Details',
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
    title: 'All Contracts',
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
    title: 'Create Contract',
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
    title: 'Edit Contract',
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
  // MCP server will add more demos here automatically
];

// Contract Management routes configuration
const getContractManagementRoutes = (): RouteConfig[] => [
  {
    hasPermission: () => true,
    key: 'PromptsGrid',
    title: 'Prompts',
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
    key: 'FormulaTemplateDetails',
    title: 'Formula Template Details',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <FormulaTemplateDetails />
      </ThemeRouteWrapper>
    ),
    path: '/ContractFormulas/FormulaTemplateDetails/:id',
    description: 'View formula template details',
    hidden: true,
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
];

// Supplier Analysis routes configuration
const getSupplierAnalysisRoutes = (): RouteConfig[] => [
  {
    hasPermission: () => true,
    key: 'SupplierProfileAnalysis',
    title: 'Supplier Price Analysis',
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
    title: 'Supplier Details',
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
  const formsRoutes = getRoutesByCategory('forms');
  const dashboardRoutes = getRoutesByCategory('dashboards');

  const config: PageConfig = {
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

  if (formsRoutes.length > 0) {
    config.Forms = {
      hasPermission: () => true,
      key: 'Forms',
      icon: <EditOutlined />,
      title: 'Forms',
      routes: formsRoutes,
    };
  }

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

  config.OnlineSellingPlatform = {
    hasPermission: () => true,
    key: 'OnlineSellingPlatform',
    icon: <GlobalOutlined />,
    title: 'Buy Now',
    element: (
      <ThemeRouteWrapper theme="OSP">
        <OnlineSellingPlatformHome />
      </ThemeRouteWrapper>
    ),
    path: '/OnlineSellingPlatform',
  };

  config.MarketPlatform = {
    hasPermission: () => true,
    key: 'MarketPlatform',
    icon: <ShopOutlined />,
    title: 'Market Platform',
    routes: [
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
    ],
  };

  config.SupplierAnalysis = {
    hasPermission: () => true,
    key: 'SupplierAnalysis',
    icon: <DashboardOutlined />,
    title: 'Supplier Analysis',
    routes: getSupplierAnalysisRoutes(),
  };

  config.GlobalTieredPricing = {
    hasPermission: () => true,
    key: 'GlobalTieredPricing',
    icon: <TableOutlined />,
    title: 'Global Tiered Pricing',
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
  config.ContractMeasurement = {
    hasPermission: () => true,
    key: 'ContractMeasurement',
    icon: <DashboardOutlined />,
    title: 'Contract Measurement',
    routes: [
      {
        hasPermission: () => true,
        key: 'ContractMeasurementGrid',
        title: 'Measurements',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <ContractMeasurementGrid />
          </ThemeRouteWrapper>
        ),
        path: '/ContractMeasurement/ContractMeasurementGrid',
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
        path: '/ContractMeasurement/ContractMeasurementDetails',
        description: 'Contract measurement details view',
        hidden: true,
      },
    ],
  };

  config.NegotiationMode = {
    hasPermission: () => true,
    key: 'NegotiationMode',
    icon: <SwapOutlined />,
    title: 'Negotiation Mode',
    element: (
      <ThemeRouteWrapper theme="OSP">
        <NegotiationModePage />
      </ThemeRouteWrapper>
    ),
    path: '/NegotiationMode',
  };

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

  config.BulkChangeTest = {
    hasPermission: () => true,
    key: 'BulkChangeTest',
    icon: <TableOutlined />,
    title: 'Bulk Change Test',
    element: <BulkChangeTest />,
    path: '/BulkChangeTest',
  };

  config.SubscriptionManagement = {
    hasPermission: () => true,
    key: 'SubscriptionManagement',
    icon: <CreditCardOutlined />,
    title: 'Subscription Management',
    element: <SubscriptionManagement />,
    path: '/SubscriptionManagement',
  };

  // Contract Management (Quick Entry / Full Entry)
  config.Contracts = {
    hasPermission: () => true,
    key: 'Contracts',
    icon: <FileTextOutlined />,
    title: 'Contracts',
    routes: [
      {
        hasPermission: () => true,
        key: 'ContractsList',
        title: 'All Contracts',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <ContractManagementPage />
          </ThemeRouteWrapper>
        ),
        path: '/Contracts/ContractsList',
        description: 'View and manage all contracts',
      },
      {
        hasPermission: () => true,
        key: 'CreateContract',
        title: 'Create Contract',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <CreateContractPage />
          </ThemeRouteWrapper>
        ),
        path: '/Contracts/CreateContract',
        description: 'Create a new contract',
        hidden: true,
      },
      {
        hasPermission: () => true,
        key: 'EditContract',
        title: 'Edit Contract',
        element: (
          <ThemeRouteWrapper theme="PE_LIGHT">
            <CreateContractPage />
          </ThemeRouteWrapper>
        ),
        path: '/Contracts/EditContract',
        hidden: true,
      },
    ],
  };

  config.PriceElasticity = {
    hasPermission: () => true,
    key: 'PriceElasticity',
    icon: <LineChartOutlined />,
    title: 'Price Elasticity',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <PriceElasticity />
      </ThemeRouteWrapper>
    ),
    path: '/PriceElasticity',
  };

  config.QuotebookWholesale = {
    hasPermission: () => true,
    key: 'QuotebookWholesale',
    icon: <DollarOutlined />,
    title: 'Quotebook Wholesale',
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <QuotebookWholesale />
      </ThemeRouteWrapper>
    ),
    path: '/quotebookwholesale',
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
