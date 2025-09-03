import {
  DashboardOutlined,
  SlidersOutlined,
  MoneyCollectFilled,
  FileOutlined,
  FileSyncOutlined,
  FileProtectOutlined,
  LineChartOutlined,
  DiffOutlined,
  SmileFilled,
} from "@ant-design/icons";

import { WelcomePage } from "./pages/WelcomePage";
import { ProductGrid } from "./pages/demos/ProductGrid";
import { ProductForm } from "./pages/demos/ProductForm";

export const createPageConfig = () => ({
  Welcome: {
    hasPermission: () => true,
    key: "Sandbox",
    icon: <SmileFilled />,
    title: "Sandbox",
    element: <WelcomePage />,
  },
  ProductGrid: {
    hasPermission: () => true,
    key: "ProductGrid",
    icon: <FileOutlined />,
    title: "Product Grid",
    element: <ProductGrid />,
  },
  ProductForm: {
    hasPermission: () => true,
    key: "ProductForm",
    icon: <FileOutlined />,
    title: "Product Form",
    element: <ProductForm />,
  },
});
