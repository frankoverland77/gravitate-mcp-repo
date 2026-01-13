import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { LeftOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { OverviewTab, ScenarioAnalysisTab, PerformanceDetailsTab, BenchmarksTab } from './tabs';
import styles from './ContractMeasurementDetails.module.css';

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
    <div className={styles.detailsPage}>
      {/* Page Header with Back Button - flexShrink: 0 prevents compression */}
      <Horizontal alignItems="center" className={styles.pageHeader} style={{ gap: '12px' }}>
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

      {/* Tabs - CSS handles flex + scroll behavior */}
      <Tabs defaultActiveKey="overview" className={styles.detailsTabs}>
        <TabPane tab="Overview" key="overview">
          <OverviewTab />
        </TabPane>
        <TabPane tab="Scenario Analysis" key="scenario-analysis">
          <ScenarioAnalysisTab />
        </TabPane>
        <TabPane tab="Performance Details" key="performance-details">
          <PerformanceDetailsTab />
        </TabPane>
        <TabPane tab="Benchmarks" key="benchmarks">
          <BenchmarksTab />
        </TabPane>
      </Tabs>
    </div>
  );
}
