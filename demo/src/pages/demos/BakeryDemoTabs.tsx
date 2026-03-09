import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { ShoppingCartOutlined, CalculatorOutlined, TruckOutlined } from '@ant-design/icons';
import { Horizontal } from '@gravitate-js/excalibrr';
import { ProductGrid } from './grids/ProductGrid/ProductGrid';
import { FormulaManager } from './grids/FormulaManager';
import { DeliveryManager } from './delivery/DeliveryManager';

export function BakeryDemoTabs() {
  /* MCP Theme Script */
  // Set BP theme for this demo (follows ControlPanel pattern)
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("TYPE_OF_THEME", "BP");
    }
  }, []);
  /* End MCP Theme Script */

  return (
    <Tabs style={{ minWidth: "100%" }} items={[
      {
        key: 'products',
        label: <span><ShoppingCartOutlined /> Products</span>,
        children: <Horizontal><ProductGrid /></Horizontal>,
      },
      {
        key: 'formulas',
        label: <span><CalculatorOutlined /> Formula Manager</span>,
        children: <Horizontal><FormulaManager /></Horizontal>,
      },
      {
        key: 'deliveries',
        label: <span><TruckOutlined /> Deliveries</span>,
        children: <Horizontal><DeliveryManager /></Horizontal>,
      },
    ]} />
  );
}