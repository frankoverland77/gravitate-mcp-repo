import React, { useState, useMemo } from 'react';
import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { Table, Popover, Menu } from 'antd';
import { MoreOutlined, PlusOutlined, StarOutlined, InfoCircleOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { AddBenchmarkDrawer } from '../../components/AddBenchmarkDrawer';
import {
  Benchmark,
  BenchmarkData,
  ComparisonRowData,
  DEFAULT_BENCHMARKS,
  MAX_BENCHMARKS,
} from '../../types/benchmark.types';

// Delta cell renderer - shows arrow, value, and "avg historical"
const renderDeltaCell = (value: number | null) => {
  if (value === null) return <div style={{ textAlign: 'center', color: '#8c8c8c' }}>—</div>;
  const isPositive = value >= 0;
  const color = isPositive ? '#51b073' : '#ff4d4f';
  const arrow = isPositive ? '↗' : '↘';
  const displayValue = isPositive ? `+$${Math.abs(value).toFixed(4)}` : `-$${Math.abs(value).toFixed(4)}`;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color, fontWeight: 500 }}>
        <span style={{ marginRight: '4px' }}>{arrow}</span>
        {displayValue}
      </div>
      <div style={{ color: '#8c8c8c', fontSize: '12px' }}>avg historical</div>
    </div>
  );
};

// Financial impact cell renderer - shows colored value
const renderImpactCell = (value: number | null) => {
  if (value === null) return <div style={{ textAlign: 'right', color: '#8c8c8c' }}>—</div>;
  const isPositive = value >= 0;
  const color = isPositive ? '#51b073' : '#ff4d4f';
  const prefix = isPositive ? '+' : '-';
  const displayValue = `${prefix}$${Math.abs(value).toLocaleString()}`;

  return (
    <div style={{ color, fontWeight: 500, textAlign: 'right' }}>
      {displayValue}
    </div>
  );
};

// Initial comparison data with benchmark values
const initialComparisonData: ComparisonRowData[] = [
  {
    key: '1',
    product: '87 Octane',
    location: 'Houston Terminal',
    volume: 24000,
    percentTotal: 25.2,
    benchmarkData: {
      'rack-average': { delta: -0.0439, impact: -1 },
      'rack-low': { delta: -0.0212, impact: -508 },
    },
  },
  {
    key: '2',
    product: '89 Octane',
    location: 'Houston Terminal',
    volume: 19000,
    percentTotal: 19.9,
    benchmarkData: {
      'rack-average': { delta: -0.0821, impact: -2 },
      'rack-low': { delta: 0.0288, impact: 547 },
    },
  },
  {
    key: '3',
    product: 'Diesel',
    location: 'Dallas Terminal',
    volume: 28500,
    percentTotal: 29.9,
    benchmarkData: {
      'rack-average': { delta: 0.0686, impact: 2 },
      'rack-low': { delta: -0.0521, impact: -1 },
    },
  },
  {
    key: '4',
    product: '93 Octane',
    location: 'Austin Terminal',
    volume: 23750,
    percentTotal: 24.9,
    benchmarkData: {
      'rack-average': { delta: -0.0321, impact: 762 },
      'rack-low': { delta: 0.0788, impact: 2 },
    },
  },
];

// Generate random placeholder data for new benchmarks
const generatePlaceholderData = (): BenchmarkData => ({
  delta: (Math.random() - 0.5) * 0.2,
  impact: Math.round((Math.random() - 0.5) * 2000),
});

export function DetailedComparisonSection() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>(DEFAULT_BENCHMARKS);
  const [comparisonData, setComparisonData] = useState<ComparisonRowData[]>(initialComparisonData);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [detailsPopoverOpen, setDetailsPopoverOpen] = useState<string | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  // Handle adding a new benchmark
  const handleAddBenchmark = (newBenchmark: Benchmark) => {
    if (benchmarks.length >= MAX_BENCHMARKS) return;

    // If this is the first benchmark, make it primary
    const benchmarkToAdd = {
      ...newBenchmark,
      isPrimary: benchmarks.length === 0 ? true : newBenchmark.isPrimary,
    };

    setBenchmarks((prev) => [...prev, benchmarkToAdd]);

    // Add placeholder data for the new benchmark to all rows
    setComparisonData((prev) =>
      prev.map((row) => ({
        ...row,
        benchmarkData: {
          ...row.benchmarkData,
          [newBenchmark.id]: generatePlaceholderData(),
        },
      }))
    );
  };

  // Handle setting a benchmark as primary
  const handleSetPrimary = (benchmarkId: string) => {
    setBenchmarks((prev) =>
      prev.map((b) => ({
        ...b,
        isPrimary: b.id === benchmarkId,
      }))
    );
  };

  // Handle removing a benchmark
  const handleRemove = (benchmarkId: string) => {
    const benchmarkToRemove = benchmarks.find((b) => b.id === benchmarkId);
    const wasPrimary = benchmarkToRemove?.isPrimary;

    setBenchmarks((prev) => {
      const remaining = prev.filter((b) => b.id !== benchmarkId);
      // If we removed the primary, promote the first remaining benchmark
      if (wasPrimary && remaining.length > 0) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });

    // Remove benchmark data from comparison rows
    setComparisonData((prev) =>
      prev.map((row) => {
        const { [benchmarkId]: _, ...restBenchmarkData } = row.benchmarkData;
        return { ...row, benchmarkData: restBenchmarkData };
      })
    );
  };

  // Handle clearing all benchmarks except primary
  const handleClearAll = () => {
    const primaryBenchmark = benchmarks.find((b) => b.isPrimary);

    if (primaryBenchmark) {
      // Keep only the primary benchmark
      setBenchmarks([primaryBenchmark]);
      // Keep only the primary benchmark's data
      setComparisonData((prev) =>
        prev.map((row) => ({
          ...row,
          benchmarkData: {
            [primaryBenchmark.id]: row.benchmarkData[primaryBenchmark.id],
          },
        }))
      );
    } else {
      // No primary, clear all
      setBenchmarks([]);
      setComparisonData((prev) =>
        prev.map((row) => ({
          ...row,
          benchmarkData: {},
        }))
      );
    }
    setClearConfirmOpen(false);
  };

  // Calculate non-primary benchmarks count for Clear All button visibility
  const nonPrimaryCount = benchmarks.filter((b) => !b.isPrimary).length;

  // More Details popover content
  const renderDetailsContent = (benchmark: Benchmark) => (
    <div style={{ width: '220px' }}>
      <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
        {benchmark.name}
      </Texto>
      <div style={{ borderTop: '1px solid #e8e8e8', marginBottom: '12px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Texto category="p2" appearance="medium">Publisher:</Texto>
          <Texto category="p2">{benchmark.publisher || 'TBD'}</Texto>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Texto category="p2" appearance="medium">Type:</Texto>
          <Texto category="p2">{benchmark.benchmarkType || 'TBD'}</Texto>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Texto category="p2" appearance="medium">Product Match:</Texto>
          <Texto category="p2">{benchmark.productHierarchy || 'TBD'}</Texto>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Texto category="p2" appearance="medium">Location Match:</Texto>
          <Texto category="p2">{benchmark.locationHierarchy || 'TBD'}</Texto>
        </div>
      </div>
    </div>
  );

  // Benchmark header with PRIMARY badge and menu
  const renderBenchmarkHeader = (benchmark: Benchmark) => {
    const menuContent = (
      <Menu style={{ border: 'none', boxShadow: 'none' }}>
        {!benchmark.isPrimary && (
          <Menu.Item key="primary" onClick={() => handleSetPrimary(benchmark.id)}>
            <StarOutlined style={{ marginRight: '8px' }} />
            Set as Primary
          </Menu.Item>
        )}
        <Menu.Item key="details">
          <Popover
            content={renderDetailsContent(benchmark)}
            trigger="click"
            placement="right"
            visible={detailsPopoverOpen === benchmark.id}
            onVisibleChange={(visible: boolean) => setDetailsPopoverOpen(visible ? benchmark.id : null)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <InfoCircleOutlined style={{ marginRight: '8px' }} />
              More Details
            </div>
          </Popover>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="remove" danger onClick={() => handleRemove(benchmark.id)}>
          <DeleteOutlined style={{ marginRight: '8px' }} />
          Remove Benchmark
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '32px' }}>
        {benchmark.isPrimary && (
          <div style={{
            position: 'absolute',
            top: -16,
            left: -9,
            backgroundColor: '#51b073',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '0 0 4px 0',
          }}>
            PRIMARY
          </div>
        )}
        <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{benchmark.name}</span>
        <Popover content={menuContent} trigger="click" placement="bottomRight">
          <MoreOutlined style={{
            position: 'absolute',
            right: -8,
            top: -8,
            cursor: 'pointer',
            fontSize: '14px'
          }} />
        </Popover>
      </div>
    );
  };

  // Generate dynamic columns based on benchmarks
  const comparisonColumns = useMemo(() => {
    const fixedColumns = [
      {
        title: 'PRODUCT',
        dataIndex: 'product',
        key: 'product',
        width: 100,
      },
      {
        title: 'LOCATION',
        dataIndex: 'location',
        key: 'location',
        width: 140,
      },
      {
        title: 'VOLUME',
        dataIndex: 'volume',
        key: 'volume',
        width: 80,
        align: 'right' as const,
        render: (value: number) => value.toLocaleString(),
      },
      {
        title: '% TOTAL',
        dataIndex: 'percentTotal',
        key: 'percentTotal',
        width: 80,
        align: 'right' as const,
        render: (value: number) => `${value.toFixed(1)}%`,
      },
    ];

    const benchmarkColumns = benchmarks.map((benchmark, index) => ({
      title: renderBenchmarkHeader(benchmark),
      className: 'benchmark-group-start',
      onHeaderCell: () => ({
        style: benchmark.isPrimary
          ? { backgroundColor: '#d4ece0' }
          : index > 0
          ? { borderLeft: '1px solid #e8e8e8' }
          : {},
      }),
      children: [
        {
          title: 'Delta ($/gal)',
          dataIndex: ['benchmarkData', benchmark.id, 'delta'],
          key: `${benchmark.id}-delta`,
          width: 125,
          align: 'center' as const,
          render: (_: any, record: ComparisonRowData) =>
            renderDeltaCell(record.benchmarkData[benchmark.id]?.delta ?? null),
          onCell: () => ({
            style: benchmark.isPrimary
              ? { backgroundColor: '#e8f5ed' }
              : index > 0
              ? { borderLeft: '1px solid #e8e8e8' }
              : {},
          }),
          onHeaderCell: () => ({
            style: benchmark.isPrimary
              ? { backgroundColor: '#d4ece0' }
              : index > 0
              ? { borderLeft: '1px solid #e8e8e8' }
              : {},
          }),
        },
        {
          title: 'Financial impact',
          dataIndex: ['benchmarkData', benchmark.id, 'impact'],
          key: `${benchmark.id}-impact`,
          width: 125,
          align: 'right' as const,
          render: (_: any, record: ComparisonRowData) =>
            renderImpactCell(record.benchmarkData[benchmark.id]?.impact ?? null),
          onCell: () => ({
            style: benchmark.isPrimary ? { backgroundColor: '#e8f5ed' } : {},
          }),
          onHeaderCell: () => ({
            style: benchmark.isPrimary ? { backgroundColor: '#d4ece0' } : {},
          }),
        },
      ],
    }));

    return [...fixedColumns, ...benchmarkColumns];
  }, [benchmarks, detailsPopoverOpen]);

  // Calculate total width based on number of benchmarks
  const tableWidth = 400 + benchmarks.length * 250;

  // Calculate summary totals
  const summaryTotals = useMemo(() => {
    const totalVolume = comparisonData.reduce((sum, row) => sum + row.volume, 0);
    const benchmarkTotals: Record<string, number> = {};

    benchmarks.forEach((benchmark) => {
      benchmarkTotals[benchmark.id] = comparisonData.reduce(
        (sum, row) => sum + (row.benchmarkData[benchmark.id]?.impact ?? 0),
        0
      );
    });

    return { totalVolume, benchmarkTotals };
  }, [comparisonData, benchmarks]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with Add Benchmark and Clear All buttons */}
      <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Texto category="h4" weight="600">Detailed Comparison</Texto>
          <Texto category="p2" appearance="medium">Compare contract pricing against multiple industry benchmarks</Texto>
        </div>
        <Horizontal style={{ gap: '8px' }}>
          {nonPrimaryCount > 0 && (
            <Popover
              content={
                <div style={{ width: '260px' }}>
                  <Texto category="p2" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
                    Clear non-primary benchmarks?
                  </Texto>
                  <Texto category="p2" appearance="medium" style={{ marginBottom: '16px', display: 'block' }}>
                    This will remove {nonPrimaryCount} benchmark{nonPrimaryCount !== 1 ? 's' : ''} from the comparison table. The primary benchmark will be kept.
                  </Texto>
                  <Horizontal style={{ justifyContent: 'flex-end', gap: '8px' }}>
                    <GraviButton
                      buttonText="Cancel"
                      appearance="outlined"
                      size="small"
                      onClick={() => setClearConfirmOpen(false)}
                    />
                    <GraviButton
                      buttonText="Clear"
                      appearance="danger"
                      size="small"
                      onClick={handleClearAll}
                    />
                  </Horizontal>
                </div>
              }
              trigger="click"
              placement="bottomRight"
              visible={clearConfirmOpen}
              onVisibleChange={(visible: boolean) => setClearConfirmOpen(visible)}
            >
              <GraviButton
                icon={<ClearOutlined />}
                buttonText="Clear All"
                appearance="outlined"
              />
            </Popover>
          )}
          {benchmarks.length < MAX_BENCHMARKS && (
            <GraviButton
              icon={<PlusOutlined />}
              buttonText="Add Benchmark"
              appearance="outlined"
              onClick={() => setIsAddDrawerOpen(true)}
            />
          )}
        </Horizontal>
      </Horizontal>

      {/* Max benchmarks info */}
      {benchmarks.length >= MAX_BENCHMARKS && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#e6f4ff',
            borderRadius: '4px',
            border: '1px solid #91caff',
          }}
        >
          <Texto category="p2" style={{ color: '#1890ff' }}>
            Maximum of {MAX_BENCHMARKS} benchmarks reached
          </Texto>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <style>{`
          /* PRIMARY group styling - dynamically applied via onCell/onHeaderCell */
          .primary-benchmark-table .ant-table-thead > tr > th {
            background-color: #fafafa;
          }
        `}</style>
        <div style={{ width: tableWidth + 2 }}>
          <Table
            className="primary-benchmark-table"
            columns={comparisonColumns}
            dataSource={comparisonData}
            pagination={false}
            size="middle"
            bordered
            tableLayout="fixed"
            style={{ width: tableWidth }}
            onRow={() => ({ style: { backgroundColor: '#ffffff' } })}
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <span style={{ fontWeight: 600 }}>Total</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <span style={{ fontWeight: 600 }}>{summaryTotals.totalVolume.toLocaleString()}</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <span style={{ fontWeight: 600 }}>100.0%</span>
                  </Table.Summary.Cell>
                  {benchmarks.map((benchmark, index) => (
                    <React.Fragment key={benchmark.id}>
                      <Table.Summary.Cell
                        index={4 + index * 2}
                        colSpan={1}
                      >
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={5 + index * 2}
                        align="right"
                      >
                        <span
                          style={{
                            color: summaryTotals.benchmarkTotals[benchmark.id] >= 0 ? '#51b073' : '#ff4d4f',
                            fontWeight: 500,
                          }}
                        >
                          {summaryTotals.benchmarkTotals[benchmark.id] >= 0 ? '+' : '-'}$
                          {Math.abs(summaryTotals.benchmarkTotals[benchmark.id]).toLocaleString()}
                        </span>
                      </Table.Summary.Cell>
                    </React.Fragment>
                  ))}
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>
      </div>

      {/* Add Benchmark Drawer */}
      <AddBenchmarkDrawer
        visible={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onAddBenchmark={handleAddBenchmark}
        currentCount={benchmarks.length}
      />
    </div>
  );
}
