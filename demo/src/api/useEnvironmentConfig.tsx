import React, { createContext, useContext } from 'react';

// Mock environment config for demo
const mockConfig = {
  data: {
    environment: 'demo',
    version: '1.0.0',
  }
};

const EnvironmentConfigContext = createContext({
  configQuery: { data: mockConfig.data }
});

export function EnvironmentConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <EnvironmentConfigContext.Provider value={{ configQuery: { data: mockConfig.data } }}>
      {children}
    </EnvironmentConfigContext.Provider>
  );
}

export function useEnvironmentConfig() {
  return useContext(EnvironmentConfigContext);
}