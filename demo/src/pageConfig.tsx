import { SmileFilled, TableOutlined, EditOutlined } from "@ant-design/icons";

import { WelcomePage } from "./pages/WelcomePage";
import { ProductGrid } from "./pages/demos/ProductGrid";

export const createPageConfig = () => ({
  Welcome: {
    hasPermission: () => true,
    key: "Sandbox",
    icon: <SmileFilled />,
    title: "Sandbox",
    element: <WelcomePage />
  },
  Grids: {
    hasPermission: () => true,
    key: "Grids",
    icon: <TableOutlined />,
    title: "Grids",
    element: <ProductGrid />,
    routes: [
      {
        hasPermission: () => true,
        key: "ProductGrid",
        title: "Product Grid",
        element: <ProductGrid />
      }
    ]
  }
});
