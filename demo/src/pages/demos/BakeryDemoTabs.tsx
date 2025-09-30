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
    <Tabs style={{ minWidth: "100%" }}>
      <Tabs.TabPane
        tab={
          <span>
            <ShoppingCartOutlined /> Products
          </span>
        }
        key="products"
      >
        <Horizontal><ProductGrid /></Horizontal>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <CalculatorOutlined /> Formula Manager
          </span>
        }
        key="formulas"
      >
        <Horizontal><FormulaManager /></Horizontal>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <TruckOutlined /> Deliveries
          </span>
        }
        key="deliveries"
      >
        <Horizontal><DeliveryManager /></Horizontal>
      </Tabs.TabPane>
    </Tabs>
  );
}