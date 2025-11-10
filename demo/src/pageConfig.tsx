import {
  SmileFilled,
  TableOutlined,
  EditOutlined,
  DashboardOutlined,
  ShopOutlined,
  CalculatorOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

import { WelcomePage } from "./pages/WelcomePages/WelcomePage";
import { CustomerForm } from "./pages/demos/forms/CustomerForm/CustomerForm";
import { ProductGrid } from "./pages/demos/grids/ProductGrid/ProductGrid";
import { FormulaManager } from "./pages/demos/grids/FormulaManager";
import { DeliveryManager } from "./pages/demos/delivery/DeliveryManager";
import { PromptsGrid } from "./pages/demos/grids/PromptsGrid";
import { FormulaTemplates } from "./pages/demos/grids/FormulaTemplates";
import { FormulaTemplateDetails } from "./pages/demos/grids/FormulaTemplateDetails";
import { ContractDetails } from "./pages/demos/grids/ContractDetails";
import { OnlineSellingPlatformHome } from "./pages/OnlineSellingPlatform/OnlineSellingPlatformHome";
import { IndexOfferManagement } from "./pages/OnlineSellingPlatform/IndexOfferManagement";
import { CompetitorAnalysis } from "./pages/OnlineSellingPlatform/CompetitorAnalysis";
import { CompetitorDetails } from "./pages/OnlineSellingPlatform/CompetitorDetails";
import { GlobalTieredPricing } from "./pages/GlobalTieredPricing/GlobalTieredPricing";
import { ThemeRouteWrapper } from "./components/shared/ThemeRouteWrapper";

// Demo registry - automatically populated by MCP server
interface DemoRoute {
  key: string;
  title: string;
  element: JSX.Element;
  path: string;
  description: string;
  created: string;
  category: "grids" | "forms" | "dashboards" | "contract-management";
}

// Registry of all available demos - MCP server will populate this
export const demoRegistry: DemoRoute[] = [
  {
    key: "BakeryProducts",
    title: "Bakery Products", 
    element: <ProductGrid />,
    path: "/demos/grids/bakery-products",
    description: "Interactive bakery product data grid with real-time updates",
    created: new Date().toISOString(),
    category: "grids",
  },
  {
    key: "FormulaManager",
    title: "Formula Manager",
    element: <FormulaManager />,
    path: "/demos/grids/formula-manager", 
    description: "Manage and apply pricing formulas dynamically",
    created: new Date().toISOString(),
    category: "grids",
  },
  {
    key: "DeliveryManagement",
    title: "Delivery Management",
    element: <DeliveryManager />,
    path: "/demos/grids/delivery-management",
    description: "Complete delivery management with routes, drivers, and tracking",
    created: new Date().toISOString(),
    category: "grids",
  },
  {
    key: "CustomerForm",
    title: "Customer Form",
    element: <CustomerForm />,
    path: "/demos/forms/customer-form",
    description: "Customer management form with validation",
    created: new Date().toISOString(),
    category: "forms",
  },
  {
    key: "PromptsGrid",
    title: "Prompts",
    element: <ThemeRouteWrapper theme="PE_LIGHT"><PromptsGrid /></ThemeRouteWrapper>,
    path: "/ContractFormulas/PromptsGrid",
    description: "Contract formula prompts management grid",
    created: new Date().toISOString(),
    category: "contract-management",
  },
  {
    key: "FormulaTemplates",
    title: "Formula Template Manager",
    element: <ThemeRouteWrapper theme="PE_LIGHT"><FormulaTemplates /></ThemeRouteWrapper>,
    path: "/ContractFormulas/FormulaTemplates",
    description: "Manage and organize pricing formula templates",
    created: new Date().toISOString(),
    category: "contract-management",
  },
  {
    key: "FormulaTemplateDetails",
    title: "Formula Template Details",
    element: <ThemeRouteWrapper theme="PE_LIGHT"><FormulaTemplateDetails /></ThemeRouteWrapper>,
    path: "/ContractFormulas/FormulaTemplateDetails/:id",
    description: "View formula template details",
    created: new Date().toISOString(),
    category: "contract-management",
  },
  {
    key: "ContractDetails",
    title: "Contract Details",
    element: <ThemeRouteWrapper theme="PE_LIGHT"><ContractDetails /></ThemeRouteWrapper>,
    path: "/ContractFormulas/ContractDetails/:id",
    description: "Contract details view",
    created: new Date().toISOString(),
    category: "contract-management",
  },
  {
    key: "CompetitorAnalysis",
    title: "Competitor Profile & Price Analysis",
    element: <ThemeRouteWrapper theme="OSP"><CompetitorAnalysis /></ThemeRouteWrapper>,
    path: "/CompetitorAnalysis/CompetitorAnalysis",
    description: "Analyze competitor profiles and pricing strategies",
    created: new Date().toISOString(),
    category: "grids",
  },
  {
    key: "CompetitorDetails",
    title: "Competitor Details",
    element: <ThemeRouteWrapper theme="OSP"><CompetitorDetails /></ThemeRouteWrapper>,
    path: "/CompetitorAnalysis/CompetitorDetails",
    description: "Detailed competitor analysis",
    created: new Date().toISOString(),
    category: "grids",
  },
  // MCP server will add more demos here automatically
];

export const createPageConfig = () => {
  // IMPORTANT: When adding new sections here (Grids, Forms, Dashboards, etc.),
  // you MUST also add the corresponding scope to the scopes object in
  // src/_Main/AuthenticatedRoute.jsx or the menu item will not appear!

  // Group demos by category
  const gridsRoutes = demoRegistry
    .filter((demo) => demo.category === "grids")
    .map((demo) => ({
      hasPermission: () => true,
      key: demo.key,
      title: demo.title,
      element: demo.element,
      path: demo.path,
      description: demo.description,
    }));

  const formsRoutes = demoRegistry
    .filter((demo) => demo.category === "forms")
    .map((demo) => ({
      hasPermission: () => true,
      key: demo.key,
      title: demo.title,
      element: demo.element,
      path: demo.path,
      description: demo.description,
    }));

  const dashboardRoutes = demoRegistry
    .filter((demo) => demo.category === "dashboards")
    .map((demo) => ({
      hasPermission: () => true,
      key: demo.key,
      title: demo.title,
      element: demo.element,
      path: demo.path,
      description: demo.description,
    }));

  const config: any = {
    Welcome: {
      hasPermission: () => true,
      key: "Sandbox",
      icon: <SmileFilled />,
      title: "Sandbox",
      element: <WelcomePage />,
    },
  };

  // Add Bakery section if there are grid demos
  if (gridsRoutes.length > 0) {
    config.Bakery = {
      hasPermission: () => true,
      key: "Bakery",
      icon: <ShopOutlined />,
      title: "Bakery",
      routes: gridsRoutes,
    };
  }

  // Add Forms section if there are form demos
  if (formsRoutes.length > 0) {
    config.Forms = {
      hasPermission: () => true,
      key: "Forms",
      icon: <EditOutlined />,
      title: "Forms",
      routes: formsRoutes,
    };
  }

  // Add Dashboards section if there are dashboard demos
  if (dashboardRoutes.length > 0) {
    config.Dashboards = {
      hasPermission: () => true,
      key: "Dashboards",
      icon: <DashboardOutlined />,
      title: "Dashboards",
      routes: dashboardRoutes,
    };
  }

  // Add Contract Management section with Prompts grid (PE_LIGHT theme)
  config.ContractFormulas = {
    hasPermission: () => true,
    key: "ContractFormulas",
    icon: <CalculatorOutlined />,
    title: "Contract Management",
    routes: [
      {
        hasPermission: () => true,
        key: "PromptsGrid",
        title: "Prompts",
        element: <ThemeRouteWrapper theme="PE_LIGHT"><PromptsGrid /></ThemeRouteWrapper>,
        path: "/ContractFormulas/PromptsGrid",
        description: "Contract formula prompts management grid",
      },
      {
        hasPermission: () => true,
        key: "FormulaTemplates",
        title: "Formula Templates",
        element: <ThemeRouteWrapper theme="PE_LIGHT"><FormulaTemplates /></ThemeRouteWrapper>,
        path: "/ContractFormulas/FormulaTemplates",
        description: "Manage and organize pricing formula templates",
      },
      {
        hasPermission: () => true,
        key: "FormulaTemplateDetails",
        title: "Formula Template Details",
        element: <ThemeRouteWrapper theme="PE_LIGHT"><FormulaTemplateDetails /></ThemeRouteWrapper>,
        path: "/ContractFormulas/FormulaTemplateDetails/:id",
        description: "View formula template details",
        hidden: true,
      },
      {
        hasPermission: () => true,
        key: "ContractDetails",
        title: "Contract Details",
        element: <ThemeRouteWrapper theme="PE_LIGHT"><ContractDetails /></ThemeRouteWrapper>,
        path: "/ContractFormulas/ContractDetails/:id",
        description: "Contract details view",
        hidden: true,
      }
    ],
  };

  // Add Online Selling Platform section (uses OSP theme)
  // Menu shows "Online Selling Platform", page header shows "Buy Now"
  config.OnlineSellingPlatform = {
    hasPermission: () => true,
    key: "OnlineSellingPlatform",
    icon: <GlobalOutlined />,
    title: "Buy Now",
    element: (
      <ThemeRouteWrapper theme="OSP">
        <OnlineSellingPlatformHome />
      </ThemeRouteWrapper>
    ),
    path: "/OnlineSellingPlatform",
  };

  // Add Market Platform section for sellers (uses OSP theme)
  config.MarketPlatform = {
    hasPermission: () => true,
    key: "MarketPlatform",
    icon: <ShopOutlined />,
    title: "Market Platform",
    routes: [
      {
        hasPermission: () => true,
        key: "IndexOfferManagement",
        title: "Index Offer Management",
        element: (
          <ThemeRouteWrapper theme="OSP">
            <IndexOfferManagement />
          </ThemeRouteWrapper>
        ),
        path: "/MarketPlatform/IndexOfferManagement",
        description: "Manage index pricing offers for buyers",
      },
    ],
  };

  // Add Competitor Analysis section (uses OSP theme)
  config.CompetitorAnalysis = {
    hasPermission: () => true,
    key: "CompetitorAnalysis",
    icon: <DashboardOutlined />,
    title: "Competitor Analysis",
    routes: [
      {
        hasPermission: () => true,
        key: "CompetitorProfileAnalysis",
        title: "Competitor Profile & Price Analysis",
        element: (
          <ThemeRouteWrapper theme="OSP">
            <CompetitorAnalysis />
          </ThemeRouteWrapper>
        ),
        path: "/CompetitorAnalysis/CompetitorAnalysis",
        description: "Analyze competitor profiles and pricing strategies",
      },
      {
        hasPermission: () => true,
        key: "CompetitorDetails",
        title: "Competitor Details",
        element: (
          <ThemeRouteWrapper theme="OSP">
            <CompetitorDetails />
          </ThemeRouteWrapper>
        ),
        path: "/CompetitorAnalysis/CompetitorDetails",
        description: "Detailed competitor analysis",
        hidden: true,
      },
    ],
  };

  // Add Global Tiered Pricing (uses PE_LIGHT theme)
  config.GlobalTieredPricing = {
    hasPermission: () => true,
    key: "GlobalTieredPricing",
    icon: <TableOutlined />,
    title: "Global Tiered Pricing",
    element: (
      <ThemeRouteWrapper theme="PE_LIGHT">
        <GlobalTieredPricing />
      </ThemeRouteWrapper>
    ),
    path: "/GlobalTieredPricing",
  };

  return config;
};

// Helper function to get all demos (used by WelcomePage)
export const getAllDemos = () => demoRegistry;

// Helper function to add a new demo to the registry
export const addDemoToRegistry = (demo: DemoRoute) => {
  // Remove any existing demo with the same key to avoid duplicates
  const existingIndex = demoRegistry.findIndex(
    (existing) => existing.key === demo.key
  );
  if (existingIndex >= 0) {
    demoRegistry[existingIndex] = demo;
  } else {
    demoRegistry.push(demo);
  }
};