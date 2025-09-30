import { useMemo } from 'react';
import { GraviGrid, BBDTag, GraviButton } from '@gravitate-js/excalibrr';
import { ArrowUpOutlined, ArrowDownOutlined, TrophyOutlined, CalendarOutlined, SyncOutlined } from '@ant-design/icons';
import { DatePicker, Select, Spin, Alert } from 'antd';
import dayjs from 'dayjs';
import { useDelivery } from '../contexts/DeliveryContext';
import { 
  mockWeeklyDeliveries, 
  mockHourlyDeliveries, 
  ChartData,
  CostData 
} from '../data/delivery.mock-data';
import {
  formatCurrency,
  formatLargeCurrency,
  getOnTimeRateColor,
  getEfficiencyColor
} from '../utils/data-mappers';

export function Analytics() {
  const {
    dateRangeState,
    setDateRange,
    performanceState,
    refreshPerformanceData,
    getDriverRankings,
    generatePerformanceReport,
    isUpdating
  } = useDelivery();

  // Generate real KPI data from performance metrics
  const realTimeKPIs = useMemo(() => {
    if (!performanceState.currentMetrics) {
      return [];
    }

    const metrics = performanceState.currentMetrics;
    const previousMetrics = performanceState.historicalMetrics[performanceState.historicalMetrics.length - 2];

    const calculateChange = (current: number, previous: number | undefined) => {
      if (!previous) return 0;
      return Number(((current - previous) / previous * 100).toFixed(1));
    };

    return [
      {
        title: 'On-Time Delivery Rate',
        value: `${metrics.onTimeDeliveryRate.toFixed(1)}%`,
        color: metrics.onTimeDeliveryRate >= 95 ? '#52c41a' : metrics.onTimeDeliveryRate >= 90 ? '#fa8c16' : '#ff4d4f',
        icon: '🎯',
        change: calculateChange(metrics.onTimeDeliveryRate, previousMetrics?.onTimeDeliveryRate),
        changeType: metrics.onTimeDeliveryRate >= (previousMetrics?.onTimeDeliveryRate || 0) ? 'increase' : 'decrease'
      },
      {
        title: 'Average Delivery Time',
        value: `${metrics.avgDeliveryTime.toFixed(0)}m`,
        color: metrics.avgDeliveryTime <= 30 ? '#52c41a' : metrics.avgDeliveryTime <= 45 ? '#fa8c16' : '#ff4d4f',
        icon: '⏱️',
        change: Math.abs(calculateChange(metrics.avgDeliveryTime, previousMetrics?.avgDeliveryTime)),
        changeType: metrics.avgDeliveryTime <= (previousMetrics?.avgDeliveryTime || 999) ? 'decrease' : 'increase'
      },
      {
        title: 'Cost Per Delivery',
        value: formatCurrency(metrics.costPerDelivery),
        color: metrics.costPerDelivery <= 12 ? '#52c41a' : metrics.costPerDelivery <= 15 ? '#fa8c16' : '#ff4d4f',
        icon: '💰',
        change: Math.abs(calculateChange(metrics.costPerDelivery, previousMetrics?.costPerDelivery)),
        changeType: metrics.costPerDelivery <= (previousMetrics?.costPerDelivery || 999) ? 'decrease' : 'increase'
      },
      {
        title: 'Driver Efficiency',
        value: `${metrics.driverEfficiency.toFixed(1)}%`,
        color: metrics.driverEfficiency >= 80 ? '#52c41a' : metrics.driverEfficiency >= 70 ? '#fa8c16' : '#ff4d4f',
        icon: '👨‍💼',
        change: calculateChange(metrics.driverEfficiency, previousMetrics?.driverEfficiency),
        changeType: metrics.driverEfficiency >= (previousMetrics?.driverEfficiency || 0) ? 'increase' : 'decrease'
      },
      {
        title: 'Customer Satisfaction',
        value: `${metrics.customerSatisfaction.toFixed(1)}/5`,
        color: metrics.customerSatisfaction >= 4.5 ? '#52c41a' : metrics.customerSatisfaction >= 4.0 ? '#fa8c16' : '#ff4d4f',
        icon: '⭐',
        change: calculateChange(metrics.customerSatisfaction, previousMetrics?.customerSatisfaction),
        changeType: metrics.customerSatisfaction >= (previousMetrics?.customerSatisfaction || 0) ? 'increase' : 'decrease'
      },
      {
        title: 'Total Revenue',
        value: formatLargeCurrency(metrics.totalRevenue),
        color: '#1890ff',
        icon: '💼',
        change: calculateChange(metrics.totalRevenue, previousMetrics?.totalRevenue),
        changeType: metrics.totalRevenue >= (previousMetrics?.totalRevenue || 0) ? 'increase' : 'decrease'
      }
    ];
  }, [performanceState.currentMetrics, performanceState.historicalMetrics]);

  // Generate cost breakdown from analytics
  const costBreakdown = useMemo(() => {
    if (!performanceState.costAnalytics) {
      return [];
    }

    const cost = performanceState.costAnalytics;
    const totalCost = cost.fuelCosts + cost.laborCosts + cost.vehicleMaintenance + cost.operationalOverhead;

    return [
      {
        category: 'Labor Costs',
        amount: cost.laborCosts,
        percentage: Number(((cost.laborCosts / totalCost) * 100).toFixed(1)),
        color: '#1890ff'
      },
      {
        category: 'Fuel Costs',
        amount: cost.fuelCosts,
        percentage: Number(((cost.fuelCosts / totalCost) * 100).toFixed(1)),
        color: '#52c41a'
      },
      {
        category: 'Vehicle Maintenance',
        amount: cost.vehicleMaintenance,
        percentage: Number(((cost.vehicleMaintenance / totalCost) * 100).toFixed(1)),
        color: '#fa8c16'
      },
      {
        category: 'Operational Overhead',
        amount: cost.operationalOverhead,
        percentage: Number(((cost.operationalOverhead / totalCost) * 100).toFixed(1)),
        color: '#f5222d'
      }
    ];
  }, [performanceState.costAnalytics]);

  // Convert driver efficiency metrics to leaderboard data
  const driverLeaderboardData = useMemo(() => {
    return getDriverRankings().map((driver, index) => ({
      driverId: driver.driverId,
      rank: index + 1,
      name: driver.driverName,
      deliveries: driver.totalDeliveries,
      onTimeRate: driver.onTimeRate.percentage,
      rating: driver.customerRating.averageRating,
      revenue: driver.totalDeliveries * 25, // Estimate $25 per delivery
      efficiency: driver.overall.score
    }));
  }, [getDriverRankings]);

  // Simple CSS Bar Chart Component
  const BarChart = ({ data, title, maxValue }: { data: ChartData[], title: string, maxValue?: number }) => {
    const max = maxValue || Math.max(...data.map(d => d.value));
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>
          {title}
        </h4>
        <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '120px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'end',
                height: '100px',
                width: '100%',
                position: 'relative'
              }}>
                {/* Target line if exists */}
                {item.target && (
                  <div style={{
                    position: 'absolute',
                    bottom: `${(item.target / max) * 100}%`,
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#fa8c16',
                    zIndex: 2
                  }}>
                    <div style={{
                      position: 'absolute',
                      right: '-2px',
                      top: '-2px',
                      width: '4px',
                      height: '4px',
                      backgroundColor: '#fa8c16',
                      borderRadius: '50%'
                    }} />
                  </div>
                )}
                
                {/* Bar */}
                <div style={{
                  width: '100%',
                  height: `${(item.value / max) * 100}%`,
                  backgroundColor: item.value >= (item.target || 0) ? '#52c41a' : '#1890ff',
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  alignItems: 'start',
                  justifyContent: 'center',
                  paddingTop: '4px',
                  fontSize: '10px',
                  color: '#fff',
                  fontWeight: 'bold',
                  minHeight: '20px'
                }}>
                  {item.value}
                </div>
              </div>
              
              <div style={{ 
                fontSize: '11px', 
                color: '#666', 
                marginTop: '4px',
                fontWeight: 500
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple CSS Pie Chart Component
  const PieChart = ({ data, title }: { data: CostData[], title: string }) => {
    let cumulativePercentage = 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>
          {title}
        </h4>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Pie Chart */}
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg width="120" height="120" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="#f0f0f0"
                strokeWidth="3"
              />
              {data.map((item, index) => {
                const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                const strokeDashoffset = `-${cumulativePercentage}`;
                cumulativePercentage += item.percentage;
                
                return (
                  <circle
                    key={index}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </svg>
            
            {/* Center total */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                {formatLargeCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>
                Total
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {data.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: item.color,
                  borderRadius: '2px'
                }} />
                <div style={{ fontSize: '12px', color: '#333', flex: 1 }}>
                  {item.category}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>
                  {item.percentage}%
                </div>
                <div style={{ fontSize: '12px', color: '#333', fontWeight: 600, minWidth: '50px', textAlign: 'right' }}>
                  {formatLargeCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Driver leaderboard grid columns
  const driverColumnDefs = useMemo(() => [
    {
      field: "rank",
      headerName: "Rank",
      width: 80,
      cellRenderer: (params: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {params.value <= 3 && (
            <TrophyOutlined style={{ 
              color: params.value === 1 ? '#ffd700' : params.value === 2 ? '#c0c0c0' : '#cd7f32',
              fontSize: '14px'
            }} />
          )}
          <span style={{ fontWeight: params.value <= 3 ? 'bold' : 'normal' }}>
            #{params.value}
          </span>
        </div>
      )
    },
    {
      field: "name",
      headerName: "Driver Name",
      width: 150,
      resizable: true,
      cellRenderer: (params: any) => (
        <div style={{ fontWeight: 500 }}>
          {params.value}
        </div>
      )
    },
    {
      field: "deliveries",
      headerName: "Deliveries",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: '#1890ff' }}>
          {params.value}
        </span>
      )
    },
    {
      field: "onTimeRate",
      headerName: "On-Time Rate",
      width: 120,
      cellRenderer: (params: any) => (
        <BBDTag style={{
          color: getOnTimeRateColor(params.value),
          backgroundColor: params.value >= 97 ? '#f6ffed' : params.value >= 95 ? '#fff7e6' : '#fff2f0',
          width: 'fit-content'
        }}>
          {params.value}%
        </BBDTag>
      )
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 100,
      cellRenderer: (params: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⭐</span>
          <span style={{ fontWeight: 500 }}>{params.value}</span>
        </div>
      )
    },
    {
      field: "revenue",
      headerName: "Revenue",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: '#52c41a' }}>
          {formatLargeCurrency(params.value)}
        </span>
      )
    },
    {
      field: "efficiency",
      headerName: "Efficiency",
      width: 100,
      cellRenderer: (params: any) => {
        const color = getEfficiencyColor(params.value);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '40px',
              height: '6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${params.value}%`,
                height: '100%',
                backgroundColor: color,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color }}>
              {params.value}%
            </span>
          </div>
        );
      }
    }
  ], []);

  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.driverId,
  }), []);

  const controlBarProps = useMemo(() => ({
    title: 'Driver Performance Leaderboard',
    hideActiveFilters: false,
  }), []);

  const updateEP = async (params: any) => {
    console.log('Update called with:', params);
    return Promise.resolve();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
            Analytics & Performance Dashboard
          </h2>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Comprehensive insights into delivery operations and performance metrics
          </div>
          {performanceState.lastCalculated && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              Last updated: {dayjs(performanceState.lastCalculated).format('MMM D, h:mm A')}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Performance Status */}
          {performanceState.kpiAlerts.length > 0 && (
            <Alert
              message={`${performanceState.kpiAlerts.length} KPI Alert${performanceState.kpiAlerts.length > 1 ? 's' : ''}`}
              description={performanceState.kpiAlerts.find(a => a.severity === 'critical') ? 'Critical performance issues detected' : 'Performance warnings detected'}
              type={performanceState.kpiAlerts.find(a => a.severity === 'critical') ? 'error' : 'warning'}
              showIcon
              style={{ marginBottom: 0 }}
            />
          )}
          
          {/* Refresh Button */}
          <GraviButton
            buttonText="Refresh Data"
            appearance="outlined"
            size="small"
            icon={isUpdating ? <Spin size="small" /> : <SyncOutlined />}
            disabled={isUpdating}
            onClick={refreshPerformanceData}
          />
        </div>
      </div>
      
      {/* Date Range Controls */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#fafafa', 
        borderRadius: '8px',
        border: '1px solid #d9d9d9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarOutlined style={{ color: '#666' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Analysis Period:</span>
          </div>
          
          <DatePicker.RangePicker
            value={[
              dateRangeState.analytics.start ? dayjs(dateRangeState.analytics.start) : null,
              dateRangeState.analytics.end ? dayjs(dateRangeState.analytics.end) : null
            ]}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange('analytics', {
                  start: dates[0].format('YYYY-MM-DD'),
                  end: dates[1].format('YYYY-MM-DD')
                });
              } else {
                setDateRange('analytics', {
                  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  end: new Date().toISOString().split('T')[0]
                });
              }
            }}
            placeholder={['Start Date', 'End Date']}
            format="YYYY-MM-DD"
            allowClear
          />
          
          <Select
            placeholder="Quick Range"
            style={{ minWidth: 120 }}
            value={undefined}
            onChange={(value: string) => {
              const today = new Date();
              let start: Date;
              
              switch (value) {
                case 'today':
                  start = new Date(today);
                  break;
                case 'week':
                  start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  break;
                case 'month':
                  start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                  break;
                case 'quarter':
                  start = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                  break;
                default:
                  start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
              }
              
              setDateRange('analytics', {
                start: start.toISOString().split('T')[0],
                end: today.toISOString().split('T')[0]
              });
            }}
          >
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="week">Last 7 Days</Select.Option>
            <Select.Option value="month">Last 30 Days</Select.Option>
            <Select.Option value="quarter">Last 90 Days</Select.Option>
          </Select>
          
          <GraviButton 
            buttonText="Export Data"
            appearance="outlined"
            size="small"
          />
          
          <span style={{ fontSize: '12px', color: '#666', marginLeft: 'auto' }}>
            Data from {dayjs(dateRangeState.analytics.start).format('MMM D')} to {dayjs(dateRangeState.analytics.end).format('MMM D, YYYY')}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
          Key Performance Indicators
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {realTimeKPIs.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: '#666' }}>Loading performance metrics...</div>
            </div>
          ) : (
            realTimeKPIs.map((kpi, index) => (
            <div
              key={index}
              style={{
                padding: '20px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '24px' }}>
                  {kpi.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {kpi.changeType === 'increase' ? (
                    <ArrowUpOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: kpi.changeType === 'decrease' && kpi.title.includes('Cost') || kpi.title.includes('Time') ? '#52c41a' : '#ff4d4f', fontSize: '12px' }} />
                  )}
                  <span style={{ 
                    fontSize: '12px', 
                    color: kpi.changeType === 'increase' ? '#52c41a' : 
                           (kpi.changeType === 'decrease' && (kpi.title.includes('Cost') || kpi.title.includes('Time')) ? '#52c41a' : '#ff4d4f'),
                    fontWeight: 500 
                  }}>
                    {kpi.change}%
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: kpi.color }}>
                  {kpi.value}
                </div>
              </div>
              
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                {kpi.title}
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        
        {/* Weekly Deliveries Chart */}
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}>
          <BarChart 
            data={mockWeeklyDeliveries} 
            title="Weekly Delivery Performance" 
            maxValue={110}
          />
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
            Orange dots indicate targets
          </div>
        </div>
        
        {/* Hourly Distribution Chart */}
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}>
          <BarChart 
            data={mockHourlyDeliveries.slice(0, 10)} 
            title="Peak Delivery Hours" 
            maxValue={40}
          />
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
            Deliveries by hour (6AM - 3PM)
          </div>
        </div>
        
        {/* Cost Breakdown Pie Chart */}
        <div style={{
          padding: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}>
          <PieChart 
            data={costBreakdown.length > 0 ? costBreakdown : [
              { category: 'Loading...', amount: 100, percentage: 100, color: '#f0f0f0' }
            ]} 
            title="Monthly Cost Breakdown" 
          />
        </div>
      </div>

      {/* Driver Leaderboard */}
      <div style={{ flex: 1, minHeight: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
          Driver Performance Leaderboard
        </h3>
        
        <div style={{ height: '400px' }}>
          <GraviGrid
            storageKey="analytics-driver-leaderboard"
            rowData={driverLeaderboardData}
            columnDefs={driverColumnDefs}
            agPropOverrides={agPropOverrides}
            controlBarProps={controlBarProps}
            updateEP={updateEP}
          />
        </div>
      </div>
    </div>
  );
}