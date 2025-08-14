// Complete App Template for Grid Generation
// src/server/tools/templates/completeAppTemplate.ts

export const COMPLETE_APP_TEMPLATE = `import React, { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ThemeContextProvider,
  NavigationContextProvider,
} from "@gravitate-js/excalibrr";
import { BrowserRouter as Router } from "react-router-dom";
import { {{FeatureName}}Page } from "./components/{{FeatureName}}Page";
import { createPageConfig } from "./mocks/mockPageConfig";
import { mockScopes } from "./mocks/mockScopes";
import { MockUserControlPanel } from "./mocks/MockUserControlPanel";
import { themeConfigs, getFilteredThemes } from "./components/themeConfig";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ThemeWrapper() {
  const filteredConfigs = useMemo(() => getFilteredThemes(), []);

  useEffect(() => {
    if (!localStorage.getItem("TYPE_OF_THEME")) {
      const defaultThemeKey = Object.keys(filteredConfigs).find(
        (key) => filteredConfigs[key].default
      );
      localStorage.setItem(
        "TYPE_OF_THEME",
        defaultThemeKey || Object.keys(filteredConfigs)[0]
      );
    }
  }, [filteredConfigs]);

  if (!filteredConfigs || Object.entries(filteredConfigs)?.length <= 0) {
    return <div>Loading themes...</div>;
  }

  console.log("ThemeWrapper: Using theme configs:", filteredConfigs);

  return (
    <ThemeContextProvider themeConfigs={filteredConfigs}>
      <NavigationContextProvider
        getScopes={async () => mockScopes}
        handleLogout={() => console.log("Logout clicked")}
        pageConfig={createPageConfig()}
        userControlPane={<MockUserControlPanel />}
        navStyle="vertical"
      >
        <{{FeatureName}}Page />
      </NavigationContextProvider>
    </ThemeContextProvider>
  );
}

export function App() {
  console.log("App component rendering with theme config:", themeConfigs);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeWrapper />
      </Router>
    </QueryClientProvider>
  );
}`;

export const THEME_CONFIG_TEMPLATE = `import React from 'react';

export const themeConfigs = {
  {{ThemeKey}}: {
    display: '{{ThemeDisplay}}',
    key: '{{ThemeKey}}',
    ThemeImportComponent: React.lazy(() => import('./ThemeComponents/{{ThemeKey}}Theme')),
    isDark: {{isDark}},
    default: true,
    colors: {{themeColors}},
  },
};

export const getFilteredThemes = () => {
  const defaultKey = Object.entries(themeConfigs).find(
    ([_, theme]) => theme.default
  )?.[0];
  
  const augmentedThemes = Object.entries(themeConfigs)
    .reduce((obj, [key, value]) => {
      obj[key] = { ...value, default: defaultKey === key };
      return obj;
    }, {} as Record<string, any>);
    
  return augmentedThemes;
};

export type ThemeConfigs = typeof themeConfigs;
export type ThemeConfigDisplay = ThemeConfigs[keyof ThemeConfigs]['display'];`;

export const THEME_COMPONENT_TEMPLATE = `import React from 'react';
import '../../Theming/Themes/{{ThemeKey}}/{{themeCssFile}}';
import '@gravitate-js/excalibrr/dist/index.css';

const {{ThemeKey}}Theme: React.FC = () => <React.Fragment />;
export default {{ThemeKey}}Theme;`;

export const THEME_CSS_TEMPLATE = `/* {{ThemeDisplay}} Theme Variables */
:root {
  --primary-color: {{primaryColor}};
  --info-color: {{infoColor}};
  --nav1-color: {{nav1Color}};
  --nav2-color: {{nav2Color}};
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

.{{featureName}}-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Additional theme customizations */
.ant-btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.ant-btn-primary:hover {
  background-color: var(--info-color);
  border-color: var(--info-color);
}`;
