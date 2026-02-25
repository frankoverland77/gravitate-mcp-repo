import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraviGrid, Vertical, Horizontal, Texto, GraviButton, NotificationMessage } from '@gravitate-js/excalibrr';
import { RightOutlined, WarningOutlined, MoreOutlined, FileTextOutlined, LineChartOutlined, DollarOutlined, SettingOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';
import { Popover, Menu, Button, Segmented } from 'antd';
import { MEASUREMENT_DATA } from './ContractMeasurement.data';
import { RatabilitySettingsDrawer } from './components/RatabilitySettingsDrawer';
import { CMViewSettingsDrawer } from './components/CMViewSettingsDrawer';
import { useFeatureMode } from '../../contexts/FeatureModeContext';

export function ContractMeasurementGrid() {
  const navigate = useNavigate();
  const { isFutureMode } = useFeatureMode();
  const [isRatabilitySettingsOpen, setIsRatabilitySettingsOpen] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
  const [measurements, setMeasurements] = useState(MEASUREMENT_DATA);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const filteredData = useMemo(
    () => measurements.filter((m) => (viewMode === 'archived' ? m.isArchived : !m.isArchived)),
    [measurements, viewMode],
  );

  const handleArchive = (id: number) => {
    setMeasurements((prev) => prev.map((m) => (m.id === id ? { ...m, isArchived: true } : m)));
    NotificationMessage('Archived', 'Measurement moved to archive', false);
  };

  const handleRestore = (id: number) => {
    setMeasurements((prev) => prev.map((m) => (m.id === id ? { ...m, isArchived: false } : m)));
    NotificationMessage('Restored', 'Measurement restored to active list', false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const columnDefs = useMemo(() => {
    const cols: any[] = [
      {
        field: 'contractId',
        headerName: 'CONTRACT ID',
        width: 120,
        cellRenderer: (params: any) => (
          <span
            style={{ color: '#52c41a', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/ContractMeasurement/ContractMeasurementDetails', { state: params.data })}
          >
            {params.value}
          </span>
        ),
      },
      {
        field: 'customer',
        headerName: 'CUSTOMER',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'type',
        headerName: 'TYPE',
        width: 100,
      },
      {
        field: 'instrument',
        headerName: 'INSTRUMENT',
        width: 130,
      },
      {
        field: 'contractPeriod',
        headerName: 'CONTRACT PERIOD',
        width: 180,
        valueGetter: (params: any) => params.data,
        cellRenderer: (params: any) => (
          <span>
            {formatDate(params.data.startDate)} — {formatDate(params.data.endDate)}
          </span>
        ),
      },
      {
        field: 'daysLeft',
        headerName: 'DAYS LEFT',
        width: 100,
        cellRenderer: (params: any) => (
          <span style={{ color: '#52c41a', fontWeight: 600 }}>
            {params.value} days
          </span>
        ),
      },
      {
        field: 'volumeProgress',
        headerName: 'VOLUME PROGRESS',
        width: 180,
        valueGetter: (params: any) => params.data,
        cellRenderer: (params: any) => {
          const pct = Math.round((params.data.volumeCompleted / params.data.volumeTotal) * 100);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {pct}%
                </span>
                <span style={{ fontSize: '11px', color: '#8c8c8c' }}>
                  {params.data.volumeCompleted.toLocaleString()} / {params.data.volumeTotal.toLocaleString()}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e8e8e8',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  backgroundColor: '#52c41a',
                  borderRadius: '3px',
                }} />
              </div>
            </div>
          );
        },
      },
      {
        field: 'ratability',
        headerName: 'RATABILITY',
        width: 110,
        cellRenderer: (params: any) => {
          const value = params.value;
          return (
            <Horizontal style={{ alignItems: 'center', gap: '4px' }}>
              <span>{value}%</span>
              {value < 70 && <WarningOutlined style={{ color: '#faad14', fontSize: '14px' }} />}
            </Horizontal>
          );
        },
      },
      {
        field: 'riskLevel',
        headerName: 'RISK LEVEL',
        width: 100,
      },
      {
        field: 'financialImpact',
        headerName: 'BENCHMARK IMPACT',
        width: 140,
        cellRenderer: (params: any) => {
          const value = params.value;
          const color = value >= 0 ? '#52c41a' : '#cf1322';
          const prefix = value > 0 ? '+' : '';
          return (
            <span style={{ color, fontWeight: 600 }}>
              {prefix}${Math.abs(value).toLocaleString()}
            </span>
          );
        },
      },
      {
        field: 'margin',
        headerName: 'MARGIN (CPG)',
        width: 130,
        type: 'numericColumn',
        cellRenderer: (params: any) => {
          const value = params.value;
          const color = value >= 0 ? '#52c41a' : '#cf1322';
          const prefix = value >= 0 ? '+' : '';
          return (
            <span style={{ color, fontWeight: 600 }}>
              {prefix}${value.toFixed(4)}
            </span>
          );
        },
      },
      {
        field: 'profitability',
        headerName: 'PROFITABILITY',
        width: 140,
        valueGetter: (params: any) => params.data.margin * params.data.volumeCompleted,
        cellRenderer: (params: any) => {
          const value = params.value;
          const color = value >= 0 ? '#52c41a' : '#cf1322';
          const prefix = value >= 0 ? '+' : '';
          return (
            <span style={{ color, fontWeight: 600 }}>
              {prefix}${Math.round(value).toLocaleString()}
            </span>
          );
        },
      },
    ];

    cols.push(
      {
        field: 'actions',
        headerName: '',
        width: 80,
        pinned: 'right',
        cellRenderer: (params: any) => {
          const isArchivedRow = params.data.isArchived;
          const menuContent = (
            <Menu style={{ border: 'none', boxShadow: 'none' }}>
              {!isArchivedRow && (
                <Menu.Item key="edit" onClick={() => console.log('Edit', params.data)}>
                  Edit Contract
                </Menu.Item>
              )}
              <Menu.Item
                key='open-contract'
                icon={<LinkOutlined />}
                onClick={() =>
                  navigate(`/ContractFormulas/ContractDetails/${params.data.contractId}`, {
                    state: { id: params.data.contractId, externalCompany: params.data.customer },
                  })
                }
              >
                Open Contract
              </Menu.Item>
              <Menu.Item key="download" onClick={() => console.log('Download', params.data)}>
                Download Report
              </Menu.Item>
              <Menu.Divider />
              {!isArchivedRow && !isReadOnly && (
                <Menu.Item key="archive" onClick={() => handleArchive(params.data.id)}>
                  Archive
                </Menu.Item>
              )}
              {isArchivedRow && !isReadOnly && (
                <Menu.Item key="restore" onClick={() => handleRestore(params.data.id)}>
                  Restore
                </Menu.Item>
              )}
              <Menu.Item key="delete" danger onClick={() => console.log('Delete', params.data)}>
                Delete
              </Menu.Item>
            </Menu>
          );

          return (
            <Horizontal style={{ justifyContent: 'center', alignItems: 'center', height: '100%', gap: '12px' }}>
              <Popover content={menuContent} trigger="click" placement="bottomRight">
                <MoreOutlined style={{ fontSize: '16px', color: '#595959', cursor: 'pointer' }} />
              </Popover>
              <RightOutlined
                style={{ fontSize: '16px', color: '#595959', cursor: 'pointer' }}
                onClick={() => navigate('/ContractMeasurement/ContractMeasurementDetails', { state: params.data })}
              />
            </Horizontal>
          );
        },
      },
    );

    return cols;
  }, [navigate, isFutureMode, isReadOnly, viewMode]);

  const controlBarProps = useMemo(() => ({
    title: viewMode === 'archived' ? 'Archived Measurements' : 'Measurements',
    hideActiveFilters: false,
  }), [viewMode]);

  const agPropOverrides = useMemo(() => ({
    domLayout: 'normal' as const,
    headerHeight: 40,
    rowHeight: 50,
  }), []);

  const updateEP = async (params: any) => {
    console.log('Update called with:', params);
    return Promise.resolve();
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '100%' }}>
      {/* Page Header */}
      <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Texto category="h3" weight="600">
            Contract Measurement
          </Texto>
          <Texto category="p1" appearance="medium">
            Track and manage contract performance metrics
          </Texto>
        </div>
        <GraviButton
          icon={<SettingOutlined />}
          buttonText="Ratability Settings"
          appearance="outlined"
          onClick={() => setIsRatabilitySettingsOpen(true)}
        />
      </Horizontal>

      {/* Tiles Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isFutureMode ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        {/* Tile 1: Total Contracts */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Vertical style={{ gap: '12px' }}>
            <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
              <FileTextOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Contracts
              </Texto>
            </Horizontal>
            <Texto category="h3" weight="600">
              5
            </Texto>
            <Texto category="p2" appearance="medium">
              2 active
            </Texto>
          </Vertical>
        </div>

        {/* Tile 2: At Risk */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Vertical style={{ gap: '12px' }}>
            <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
              <WarningOutlined style={{ fontSize: '16px', color: '#cf1322' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                At Risk
              </Texto>
            </Horizontal>
            <Texto category="h3" weight="600" style={{ color: '#cf1322' }}>
              2
            </Texto>
            <Texto category="p2" appearance="medium">
              Require immediate attention
            </Texto>
          </Vertical>
        </div>

        {/* Tile 3: Total Volume (Future State only) */}
        {isFutureMode && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <Vertical style={{ gap: '12px' }}>
              <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                <LineChartOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
                <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Volume
                </Texto>
              </Horizontal>
              <Horizontal style={{ alignItems: 'baseline', gap: '12px' }}>
                <Texto category="h3" weight="600">
                  650,000
                </Texto>
                <Texto category="p2" style={{ color: '#52c41a' }}>
                  ↗ 8.2% vs last month
                </Texto>
              </Horizontal>
              <Texto category="p2" appearance="medium">
                Units across all contracts
              </Texto>
            </Vertical>
          </div>
        )}

        {/* Tile 4: Benchmark Impact */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Vertical style={{ gap: '12px' }}>
            <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
              <DollarOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Benchmark Impact
              </Texto>
            </Horizontal>
            <Horizontal style={{ alignItems: 'baseline', gap: '12px' }}>
              <Texto category="h3" weight="600" style={{ color: '#52c41a' }}>
                +$14,832
              </Texto>
              <Texto category="p2" style={{ color: '#52c41a' }}>
                ↗ 12.5% vs last month
              </Texto>
            </Horizontal>
            <Texto category="p2" appearance="medium">
              Net impact this period
            </Texto>
          </Vertical>
        </div>
      </div>

      {/* Active / Archived Toggle */}
      <div style={{ alignSelf: 'flex-start' }}>
        <Segmented
          size='large'
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Archived', value: 'archived' },
          ]}
          value={viewMode}
          onChange={(v) => setViewMode(v as 'active' | 'archived')}
        />
      </div>

      {/* Grid Section */}
      <div style={{ height: '500px' }}>
        <GraviGrid
          rowData={filteredData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          updateEP={updateEP}
        />
      </div>

      {/* Ratability Settings Drawer */}
      <RatabilitySettingsDrawer
        visible={isRatabilitySettingsOpen}
        onClose={() => setIsRatabilitySettingsOpen(false)}
        onSettingsChange={(settings) => console.log('Ratability settings updated:', settings)}
      />

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
      <CMViewSettingsDrawer
        visible={settingsDrawerVisible}
        onClose={() => setSettingsDrawerVisible(false)}
        isReadOnly={isReadOnly}
        onReadOnlyChange={setIsReadOnly}
      />
    </div>
  );
}
