import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraviGrid, Vertical, Horizontal, Texto, GraviButton, NotificationMessage } from '@gravitate-js/excalibrr';
import { RightOutlined, MoreOutlined, FileTextOutlined, LineChartOutlined, DollarOutlined, SettingOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';
import { Popover, Menu, Segmented } from 'antd';
import type { ColDef, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { MEASUREMENT_DATA } from './ContractMeasurement.data';
import type { ContractMeasurementRecord } from './ContractMeasurement.data';
import { RatabilitySettingsDrawer } from './components/RatabilitySettingsDrawer';
import { CMViewSettingsDrawer } from './components/CMViewSettingsDrawer';
import { useFeatureMode } from '../../contexts/FeatureModeContext';

import styles from './ContractMeasurementGrid.module.css';

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
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const columnDefs = useMemo(() => {
    const cols: ColDef<ContractMeasurementRecord>[] = [
      {
        field: 'contractId',
        headerName: 'Id',
        width: 100,
        cellRenderer: (params: ICellRendererParams<ContractMeasurementRecord>) => (
          <Texto
            className={styles.clickableLink}
            onClick={() => navigate('/ContractMeasurement/ContractMeasurementDetails', { state: params.data })}
          >
            {params.value}
          </Texto>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
      },
      {
        field: 'createdDate',
        headerName: 'Created',
        width: 120,
        valueFormatter: (params: ValueFormatterParams) => formatDate(params.value),
      },
      {
        field: 'startDate',
        headerName: 'Contract From',
        width: 130,
        valueFormatter: (params: ValueFormatterParams) => formatDate(params.value),
      },
      {
        field: 'endDate',
        headerName: 'Contract To',
        width: 130,
        valueFormatter: (params: ValueFormatterParams) => formatDate(params.value),
      },
      {
        field: 'externalCounterparty',
        headerName: 'External Counterparty',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 100,
      },
      {
        field: 'instrument',
        headerName: 'Instrument',
        width: 140,
      },
      {
        field: 'locations',
        headerName: 'Locations',
        minWidth: 180,
        cellRenderer: (params: ICellRendererParams<ContractMeasurementRecord>) => {
          const locations: string[] = params.value;
          if (!locations || locations.length === 0) return 'N/A';
          if (locations.length === 1) return locations[0];
          return (
            <Popover
              placement="bottomLeft"
              content={
                <Vertical>
                  {locations.map((loc: string) => (
                    <Horizontal key={loc}><Texto>{loc}</Texto></Horizontal>
                  ))}
                </Vertical>
              }
            >
              <Texto className={styles.dottedUnderline}>Multiple Locations</Texto>
            </Popover>
          );
        },
      },
      {
        field: 'products',
        headerName: 'Products',
        minWidth: 180,
        flex: 1,
        cellRenderer: (params: ICellRendererParams<ContractMeasurementRecord>) => {
          const products: string[] = params.value;
          if (!products || products.length === 0) return 'N/A';
          if (products.length <= 2) return products.join(', ');
          return (
            <Popover
              placement="bottomLeft"
              content={
                <Vertical>
                  {products.map((p: string) => (
                    <Horizontal key={p}><Texto>{p}</Texto></Horizontal>
                  ))}
                </Vertical>
              }
            >
              <Texto className={styles.dottedUnderline}>Multiple Products</Texto>
            </Popover>
          );
        },
      },
      {
        field: 'description',
        headerName: 'Description',
        minWidth: 200,
      },
      {
        field: 'benchmarkImpactCpg',
        headerName: 'Benchmark Impact',
        width: 160,
        cellRenderer: (params: ICellRendererParams<ContractMeasurementRecord>) => {
          const value = params.value;
          if (value === null || value === undefined) return '';
          const type = params.data?.type;
          const isFavorable = type === 'Purchase' ? value < 0 : value > 0;
          const colorClass = value === 0 ? styles.textNeutral : isFavorable ? styles.textSuccess : styles.textDanger;
          const formatted = `$ .${Math.abs(value).toFixed(4).split('.')[1]}`;
          return (
            <Texto weight="600" className={colorClass}>
              {value < 0 ? `-${formatted}` : formatted}
            </Texto>
          );
        },
      },
      {
        field: 'internalContractNumber',
        headerName: 'Internal Contract#',
        minWidth: 160,
        hide: true,
      },
      {
        field: 'externalContractNumber',
        headerName: 'External Contract#',
        minWidth: 160,
        hide: true,
      },
    ];

    if (isFutureMode) {
      cols.push({
        field: 'daysLeft',
        headerName: 'Days Left',
        width: 100,
        cellRenderer: (params: ICellRendererParams<ContractMeasurementRecord>) => (
          <Texto weight="600" className={params.value < 30 ? styles.textDanger : styles.textSuccess}>
            {params.value} days
          </Texto>
        ),
      });
      cols.push({
        field: 'financialImpact',
        headerName: 'Benchmark Impact',
        width: 150,
        cellRenderer: (params: ICellRendererParams<ContractMeasurementRecord>) => {
          const value = params.value;
          const colorClass = value >= 0 ? styles.textSuccess : styles.textDanger;
          const prefix = value > 0 ? '+' : '';
          return (
            <Texto weight="600" className={colorClass}>
              {prefix}${Math.abs(value).toLocaleString()}
            </Texto>
          );
        },
      });
    }

    cols.push(
      {
        field: 'actions',
        headerName: '',
        width: 80,
        pinned: 'right',
        cellRenderer: (params: ICellRendererParams<ContractMeasurementRecord>) => {
          const isArchivedRow = params.data?.isArchived;
          const menuContent = (
            <Menu
              style={{ border: 'none', boxShadow: 'none' }}
              items={[
                ...(!isArchivedRow ? [{
                  key: 'edit',
                  label: 'Edit Contract',
                  onClick: () => { /* noop for demo */ },
                }] : []),
                {
                  key: 'open-contract',
                  icon: <LinkOutlined />,
                  label: 'Open Contract',
                  onClick: () =>
                    navigate(`/ContractFormulas/ContractDetails/${params.data?.contractId}`, {
                      state: { id: params.data?.contractId, externalCompany: params.data?.externalCounterparty },
                    }),
                },
                {
                  key: 'download',
                  label: 'Download Report',
                  onClick: () => { /* noop for demo */ },
                },
                ...(isFutureMode ? [{ type: 'divider' as const }] : []),
                ...(isFutureMode && !isArchivedRow && !isReadOnly ? [{
                  key: 'archive',
                  label: 'Archive',
                  onClick: () => handleArchive(params.data!.id),
                }] : []),
                ...(isFutureMode && isArchivedRow && !isReadOnly ? [{
                  key: 'restore',
                  label: 'Restore',
                  onClick: () => handleRestore(params.data!.id),
                }] : []),
                ...(isFutureMode ? [{
                  key: 'delete',
                  label: 'Delete',
                  danger: true,
                  onClick: () => { /* noop for demo */ },
                }] : []),
              ]}
            />
          );

          return (
            <Horizontal gap={12} justifyContent="center" alignItems="center" height="100%">
              <Popover content={menuContent} trigger="click" placement="bottomRight">
                <MoreOutlined className={styles.actionIcon} />
              </Popover>
              <RightOutlined
                className={styles.actionIcon}
                onClick={() => navigate('/ContractMeasurement/ContractMeasurementDetails', { state: params.data })}
              />
            </Horizontal>
          );
        },
      },
    );

    return cols;
  }, [navigate, isFutureMode, isReadOnly]);

  const controlBarProps = useMemo(() => ({
    title: viewMode === 'archived' ? 'Archived Measurements' : 'Measurements',
    hideActiveFilters: false,
  }), [viewMode]);

  const agPropOverrides = useMemo(() => ({
    domLayout: 'normal' as const,
    headerHeight: 40,
    rowHeight: 50,
  }), []);

  const updateEP = async () => {
    return Promise.resolve();
  };

  return (
    <Vertical padding="24px" gap={24} style={{ minHeight: '100%' }}>
      {/* Page Header */}
      <Horizontal justifyContent="space-between" alignItems="flex-start">
        <Vertical gap={8}>
          <Texto category="h3" weight="600">
            Contract Measurement
          </Texto>
          <Texto category="p1" appearance="medium">
            Track and manage contract performance metrics
          </Texto>
        </Vertical>
        {isFutureMode && (
          <GraviButton
            icon={<SettingOutlined />}
            buttonText="Ratability Settings"
            appearance="outlined"
            onClick={() => setIsRatabilitySettingsOpen(true)}
          />
        )}
      </Horizontal>

      {/* Tiles Section */}
      <Horizontal gap={20} className={styles.tilesContainer}>
        {/* Tile 1: Total Contracts */}
        <Vertical className={styles.tile}>
          <Vertical gap={12}>
            <Horizontal gap={8} alignItems="center">
              <FileTextOutlined className={styles.tileIcon} />
              <Texto category="p2" appearance="medium" className={styles.tileLabel}>
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
        </Vertical>

        {/* Tile 2: Total Volume (Future State only) */}
        {isFutureMode && (
          <Vertical className={styles.tile}>
            <Vertical gap={12}>
              <Horizontal gap={8} alignItems="center">
                <LineChartOutlined className={styles.tileIcon} />
                <Texto category="p2" appearance="medium" className={styles.tileLabel}>
                  Total Volume
                </Texto>
              </Horizontal>
              <Horizontal gap={12} alignItems="baseline">
                <Texto category="h3" weight="600">
                  650,000
                </Texto>
                <Texto category="p2" className={styles.textSuccess}>
                  ↗ 8.2% vs last month
                </Texto>
              </Horizontal>
              <Texto category="p2" appearance="medium">
                Units across all contracts
              </Texto>
            </Vertical>
          </Vertical>
        )}

        {/* Tile 3: Benchmark Impact (Future State only) */}
        {isFutureMode && (
          <Vertical className={styles.tile}>
            <Vertical gap={12}>
              <Horizontal gap={8} alignItems="center">
                <DollarOutlined className={styles.tileIcon} />
                <Texto category="p2" appearance="medium" className={styles.tileLabel}>
                  Benchmark Impact
                </Texto>
              </Horizontal>
              <Horizontal gap={12} alignItems="baseline">
                <Texto category="h3" weight="600" className={styles.textSuccess}>
                  +$14,832
                </Texto>
                <Texto category="p2" className={styles.textSuccess}>
                  ↗ 12.5% vs last month
                </Texto>
              </Horizontal>
              <Texto category="p2" appearance="medium">
                Net impact this period
              </Texto>
            </Vertical>
          </Vertical>
        )}
      </Horizontal>

      {/* Active / Archived Toggle (Future State only) */}
      {isFutureMode && (
        <Vertical alignItems="flex-start">
          <Segmented
            size='large'
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Archived', value: 'archived' },
            ]}
            value={viewMode}
            onChange={(v) => setViewMode(v as 'active' | 'archived')}
          />
        </Vertical>
      )}

      {/* Grid Section */}
      <Vertical height="500px">
        <GraviGrid
          rowData={filteredData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          updateEP={updateEP}
        />
      </Vertical>

      {/* Ratability Settings Drawer */}
      <RatabilitySettingsDrawer
        open={isRatabilitySettingsOpen}
        onClose={() => setIsRatabilitySettingsOpen(false)}
        onSettingsChange={() => { /* noop for demo */ }}
      />

      {/* View Settings Floating Button */}
      <GraviButton
        icon={<EyeOutlined />}
        onClick={() => setSettingsDrawerVisible(true)}
        className={styles.floatingButton}
      />

      {/* View Settings Drawer */}
      <CMViewSettingsDrawer
        open={settingsDrawerVisible}
        onClose={() => setSettingsDrawerVisible(false)}
        isReadOnly={isReadOnly}
        onReadOnlyChange={setIsReadOnly}
      />
    </Vertical>
  );
}
