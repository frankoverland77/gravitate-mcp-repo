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
} from '@ant-design/icons';

import { WelcomePage } from './pages/WelcomePages/WelcomePage';
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
import { SupplierAnalysis } from './pages/OnlineSellingPlatform/SupplierAnalysis';
import { SupplierDetails } from './pages/OnlineSellingPlatform/SupplierDetails';
import { GlobalTieredPricing } from './pages/GlobalTieredPricing/GlobalTieredPricing';
import { ContractMeasurementGrid } from './pages/ContractMeasurement/ContractMeasurementGrid';
import { ContractMeasurementDetails } from './pages/ContractMeasurement/ContractMeasurementDetails';
import { ThemeRouteWrapper } from './components/shared/ThemeRouteWrapper';
import { BulkChangeTest } from './pages/demos/BulkChangeTest/BulkChangeTest';
import { SubscriptionManagement } from './pages/SubscriptionManagement/SubscriptionManagement';
import { RFPManagement } from './pages/RFP';

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
