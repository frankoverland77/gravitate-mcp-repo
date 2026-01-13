import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Horizontal, Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { LeftOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { OverviewTab, ScenarioAnalysisTab, PerformanceDetailsTab, BenchmarksTab } from './tabs';

const { TabPane } = Tabs;

export function ContractMeasurementDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Get data from navigation state or use defaults
  const data = location.state || {
    id: params.id || 1,
    column1: 'Default Value',
    column2: 'Default Value',
    column3: 'Default Value',
    column4: 'Default Value',
  };

  const handleBack = () => {
    navigate('/ContractMeasurement/ContractMeasurementGrid');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      {/* Page Header with Back Button */}
      <Horizontal alignItems="center" style={{ gap: '12px', marginBottom: '16px' }}>
        <GraviButton
          type="text"
          icon={<LeftOutlined />}
          onClick={handleBack}
          style={{ padding: '4px 8px' }}
        />
        <Texto category="h3" weight="600">
          Measurement Details - ID: {data.id}
        </Texto>
      </Horizontal>

      {/* Tabs */}
      <Tabs defaultActiveKey="overview" style={{ flex: 1 }}>
        <TabPane tab="Overview" key="overview">
          <div style={{ paddingTop: '24px' }}>
            <OverviewTab />
          </div>
        </TabPane>
        <TabPane tab="Scenario Analysis" key="scenario-analysis">
          <div style={{ paddingTop: '40px' }}>
            <ScenarioAnalysisTab />
          </div>
        </TabPane>
        <TabPane tab="Performance Details" key="performance-details">
          <div style={{ paddingTop: '40px' }}>
            <PerformanceDetailsTab />
          </div>
        </TabPane>
        <TabPane tab="Benchmarks" key="benchmarks">
          <div style={{ paddingTop: '40px' }}>
            <BenchmarksTab />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
