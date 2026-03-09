import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { LeftOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { BenchmarksTab } from './tabs';
import { CMViewSettingsDrawer } from './components/CMViewSettingsDrawer';
import styles from './ContractMeasurementDetails.module.css';

export function ContractMeasurementDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

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

  const handleViewContract = () => {
    navigate(`/ContractFormulas/ContractDetails/${data.contractId}`, {
      state: { id: data.contractId, externalCompany: data.externalCounterparty },
    })
  };

  return (
    <div className={styles.detailsPage}>
      {/* Page Header with Back Button - flexShrink: 0 prevents compression */}
      <Horizontal alignItems="center" className={styles.pageHeader} gap={12} style={{ background: 'transparent' }}>
        <GraviButton
          type="text"
          icon={<LeftOutlined />}
          onClick={handleBack}
          style={{ padding: '4px 8px', background: 'transparent', border: 'none', boxShadow: 'none' }}
        />
        <Texto category="h3" weight="600">
          Measurement Details
        </Texto>
        {data.contractId && (
          <GraviButton
            type='text'
            icon={<LinkOutlined />}
            buttonText={data.contractId}
            onClick={handleViewContract}
            style={{ color: '#595959', textDecoration: 'underline', fontWeight: 500, background: 'transparent', border: 'none', boxShadow: 'none' }}
          />
        )}
      </Horizontal>

      <div className={styles.benchmarksContainer}>
        <BenchmarksTab />
      </div>

      {/* View Settings Floating Button */}
      <Button
        type='primary'
        shape='circle'
        icon={<EyeOutlined />}
        size='large'
        onClick={() => setSettingsDrawerVisible(true)}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '96px',
          zIndex: 9999,
          width: '48px',
          height: '48px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      />

      {/* View Settings Drawer */}
      <CMViewSettingsDrawer open={settingsDrawerVisible} onClose={() => setSettingsDrawerVisible(false)} />
    </div>
  );
}
