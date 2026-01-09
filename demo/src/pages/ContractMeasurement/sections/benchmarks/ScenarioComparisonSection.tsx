import { useState, useMemo, useCallback } from 'react';
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { CheckSquareOutlined, BorderOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { Table, Checkbox, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Scenario, ComparisonRowData, ScenarioCellData } from '../../types/scenario.types';
import { ScenarioCellRenderer, getDeltaColorClass } from './ScenarioCellRenderer';
import styles from './ScenarioComparisonSection.module.css';

interface ScenarioComparisonSectionProps {
  scenarios: Scenario[];
  primarySelections: Record<string, string>;
  onSetPrimary: (detailId: string, scenarioId: string) => void;
  onSetColumnPrimary: (scenarioId: string) => void;
}

const SAMPLE_DETAILS = [
  {
    detailId: 'DTL-001',
    product: '87 Gas',
    location: 'Houston Terminal',
    volume: 120000,
    percentTotal: 25.8,
  },
  {
    detailId: 'DTL-002',
    product: '89 Gas',
    location: 'Houston Terminal',
    volume: 160000,
    percentTotal: 34.4,
  },
  {
    detailId: 'DTL-003',
    product: 'Diesel #2',
    location: 'Tulsa Terminal',
    volume: 85000,
    percentTotal: 18.3,
  },
  {
    detailId: 'DTL-004',
    product: 'Jet Fuel',
    location: 'Dallas Terminal',
    volume: 100000,
    percentTotal: 21.5,
  },
];

function generateScenarioCellData(
  scenarioId: string,
  isPrimary: boolean,
  detailIndex: number
): ScenarioCellData {
  const basePrice = 2.45 + Math.random() * 0.3 - 0.15;
  const primaryPrice = 2.45;
  const delta = isPrimary ? undefined : basePrice - primaryPrice;
  const allocation = SAMPLE_DETAILS[detailIndex].volume;
  const rateability = 85 + Math.random() * 25;

  return {
    scenarioId,
    price: basePrice,
    delta,
    deltaPercent: delta ? (delta / primaryPrice) * 100 : undefined,
    formulaRef: isPrimary
      ? 'OPIS Houston Rack + $0.03'
      : `OPIS Contract ${scenarioId.includes('A') ? 'Low' : 'High'}`,
    allocation,
    rateability,
    rateabilityStatus: rateability >= 90 ? 'on-track' : rateability >= 80 ? 'at-risk' : 'below-min',
    impact: delta ? Math.round(delta * allocation) : undefined,
    isPrimary,
  };
}

export function ScenarioComparisonSection({
  scenarios,
  primarySelections,
  onSetPrimary,
  onSetColumnPrimary,
}: ScenarioComparisonSectionProps) {
  const [isPrimaryMode, setIsPrimaryMode] = useState(false);

  const allRowsHaveSamePrimary = useMemo(() => {
    const selections = Object.values(primarySelections);
    if (selections.length === 0 || selections.length !== SAMPLE_DETAILS.length) return true;
    return selections.every((id) => id === selections[0]);
  }, [primarySelections]);

  const isColumnPrimary = useCallback(
    (scenarioId: string) => {
      if (!allRowsHaveSamePrimary) return false;
      const selections = Object.values(primarySelections);
      if (selections.length === 0)
        return scenarios.find((s) => s.id === scenarioId)?.isPrimary || false;
      return selections[0] === scenarioId;
    },
    [allRowsHaveSamePrimary, primarySelections, scenarios]
  );

  const hasRowPrimary = useCallback(
    (detailId: string, scenarioId: string) => {
      if (allRowsHaveSamePrimary) return false;
      return primarySelections[detailId] === scenarioId;
    },
    [allRowsHaveSamePrimary, primarySelections]
  );

  const comparisonData = useMemo(() => {
    return SAMPLE_DETAILS.map((detail, index) => {
      const scenarioData: Record<string, ScenarioCellData> = {};
      scenarios.forEach((scenario) => {
        const isPrimaryForRow =
          primarySelections[detail.detailId] === scenario.id ||
          (!primarySelections[detail.detailId] && scenario.isPrimary);
        scenarioData[scenario.id] = generateScenarioCellData(scenario.id, isPrimaryForRow, index);
      });
      return { ...detail, scenarios: scenarioData } as ComparisonRowData;
    });
  }, [scenarios, primarySelections]);

  const totals = useMemo(() => {
    const result: Record<string, { volume: number; impact: number }> = {};
    scenarios.forEach((scenario) => {
      let totalVolume = 0,
        totalImpact = 0;
      comparisonData.forEach((row) => {
        const cellData = row.scenarios[scenario.id];
        if (cellData) {
          totalVolume += cellData.allocation;
          totalImpact += cellData.impact || 0;
        }
      });
      result[scenario.id] = { volume: totalVolume, impact: totalImpact };
    });
    return result;
  }, [scenarios, comparisonData]);

  const renderScenarioCell = useCallback(
    (record: ComparisonRowData, scenario: Scenario) => {
      const cellData = record.scenarios[scenario.id];
      if (!cellData) return null;
      const isPrimaryForRow =
        primarySelections[record.detailId] === scenario.id ||
        (!primarySelections[record.detailId] && scenario.isPrimary);
      const showRowStar = hasRowPrimary(record.detailId, scenario.id);
      return (
        <ScenarioCellRenderer
          cellData={cellData}
          isPrimaryForRow={isPrimaryForRow}
          showRowStar={showRowStar}
          isPrimaryMode={isPrimaryMode}
          onSetPrimary={() => onSetPrimary(record.detailId, scenario.id)}
        />
      );
    },
    [primarySelections, hasRowPrimary, isPrimaryMode, onSetPrimary]
  );

  const columns: ColumnsType<ComparisonRowData> = useMemo(() => {
    const baseColumns: ColumnsType<ComparisonRowData> = [
      {
        title: 'DETAIL',
        dataIndex: 'product',
        key: 'detail',
        width: 180,
        fixed: 'left',
        render: (_: unknown, record: ComparisonRowData) => (
          <Vertical gap="2px">
            <Texto weight="600">{record.product}</Texto>
            <Texto category="p2" appearance="medium">
              {record.location}
            </Texto>
          </Vertical>
        ),
      },
      {
        title: 'VOLUME',
        dataIndex: 'volume',
        key: 'volume',
        width: 100,
        render: (_: unknown, record: ComparisonRowData) => (
          <Vertical gap="2px">
            <Texto>{(record.volume / 1000).toFixed(0)}K gal</Texto>
            <Texto category="p2" appearance="medium">
              {record.percentTotal.toFixed(1)}%
            </Texto>
          </Vertical>
        ),
      },
    ];

    const scenarioColumns: ColumnsType<ComparisonRowData> = scenarios.map((scenario) => ({
      title: (
        <Horizontal alignItems="center" gap="8px">
          {isPrimaryMode && (
            <Checkbox
              checked={
                Object.values(primarySelections).every((id) => id === scenario.id) &&
                Object.keys(primarySelections).length === SAMPLE_DETAILS.length
              }
              indeterminate={
                Object.values(primarySelections).some((id) => id === scenario.id) &&
                !Object.values(primarySelections).every((id) => id === scenario.id)
              }
              onChange={() => onSetColumnPrimary(scenario.id)}
            />
          )}
          <span>{scenario.name}</span>
          {isColumnPrimary(scenario.id) && (
            <Tooltip title="Primary">
              <StarFilled className={styles.starIconHeader} />
            </Tooltip>
          )}
        </Horizontal>
      ),
      dataIndex: scenario.id,
      key: scenario.id,
      width: 200,
      render: (_: unknown, record: ComparisonRowData) => renderScenarioCell(record, scenario),
    }));

    return [...baseColumns, ...scenarioColumns];
  }, [
    scenarios,
    primarySelections,
    isPrimaryMode,
    isColumnPrimary,
    onSetColumnPrimary,
    renderScenarioCell,
  ]);

  const summaryRow = () => (
    <Table.Summary fixed>
      <Table.Summary.Row className={styles.summaryRow}>
        <Table.Summary.Cell index={0}>
          <Texto weight="600">TOTAL</Texto>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1}>
          <Texto weight="600">
            {(SAMPLE_DETAILS.reduce((sum, d) => sum + d.volume, 0) / 1000).toFixed(0)}K gal
          </Texto>
        </Table.Summary.Cell>
        {scenarios.map((scenario, index) => (
          <Table.Summary.Cell key={scenario.id} index={index + 2}>
            <Vertical gap="4px">
              <Texto weight="600">{(totals[scenario.id]?.volume / 1000).toFixed(0)}K gal</Texto>
              {totals[scenario.id]?.impact !== 0 && (
                <Texto weight="600" className={getDeltaColorClass(totals[scenario.id]?.impact)}>
                  {totals[scenario.id]?.impact >= 0 ? '+' : ''}$
                  {(totals[scenario.id]?.impact / 1000).toFixed(1)}K
                </Texto>
              )}
            </Vertical>
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
    </Table.Summary>
  );

  if (scenarios.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Vertical alignItems="center" gap="16px">
          <StarOutlined className={styles.emptyIcon} />
          <Texto category="h4">No Scenarios</Texto>
          <Texto appearance="medium">
            Add a scenario from the sidebar to start comparing pricing options.
          </Texto>
        </Vertical>
      </div>
    );
  }

  return (
    <Vertical gap="16px">
      <Horizontal justifyContent="space-between" alignItems="center">
        <div>
          <Texto category="h4" weight="600">
            Scenario Comparison
          </Texto>
          <Texto category="p2" appearance="medium">
            Compare pricing scenarios across all product details
          </Texto>
        </div>
        <Horizontal gap="12px">
          <GraviButton
            buttonText={isPrimaryMode ? 'Done' : 'Set Primary'}
            icon={isPrimaryMode ? <CheckSquareOutlined /> : <BorderOutlined />}
            appearance={isPrimaryMode ? 'success' : 'outlined'}
            onClick={() => setIsPrimaryMode(!isPrimaryMode)}
          />
          <GraviButton buttonText="Export Results" appearance="outlined" />
        </Horizontal>
      </Horizontal>

      {isPrimaryMode && (
        <div className={styles.infoBar}>
          <Texto category="p2">
            <strong>Primary Selection Mode:</strong> Click cells or column headers to set which
            scenario is the primary reference for each row.
          </Texto>
        </div>
      )}

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={comparisonData}
          rowKey="detailId"
          pagination={false}
          scroll={{ x: 'max-content' }}
          summary={allRowsHaveSamePrimary ? summaryRow : undefined}
          size="small"
        />
      </div>
    </Vertical>
  );
}
