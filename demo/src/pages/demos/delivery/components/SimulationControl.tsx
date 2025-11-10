import React from 'react';
import { Button, Select, Badge, Tooltip, Card, Progress } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, StopOutlined, SettingOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { GraviButton, BBDTag } from '@gravitate-js/excalibrr';
import { useDelivery } from '../contexts/DeliveryContext';

interface SimulationControlProps {
  compact?: boolean;
  showProgressBars?: boolean;
}

export function SimulationControl({ compact = false, showProgressBars = false }: SimulationControlProps) {
  const {
    simulationState,
    routes,
    startSimulation,
    stopSimulation,
    pauseSimulation,
    resumeSimulation,
    setSimulationSpeed,
    dismissAlert,
    clearAllAlerts
  } = useDelivery();

  const activeRoutes = routes.filter(route => route.status === 'ACTIVE');
  const runTime = simulationState.startTime 
    ? Math.floor((Date.now() - simulationState.startTime.getTime()) / 1000) 
    : 0;

  const formatRunTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Badge 
          status={simulationState.isRunning ? "processing" : "default"} 
          text={simulationState.isRunning ? `${simulationState.speed}x` : 'Stopped'}
        />
        
        <div style={{ display: 'flex', gap: '4px' }}>
          {!simulationState.isRunning ? (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => startSimulation(simulationState.speed)}
            >
              Start
            </Button>
          ) : (
            <>
              <Button
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={pauseSimulation}
              >
                Pause
              </Button>
              <Button
                size="small"
                icon={<StopOutlined />}
                onClick={stopSimulation}
                danger
              >
                Stop
              </Button>
            </>
          )}
        </div>

        <Select
          size="small"
          value={simulationState.speed}
          onChange={setSimulationSpeed}
          style={{ width: 60 }}
          disabled={!simulationState.isRunning}
        >
          <Select.Option value={0.5}>0.5x</Select.Option>
          <Select.Option value={1}>1x</Select.Option>
          <Select.Option value={2}>2x</Select.Option>
          <Select.Option value={5}>5x</Select.Option>
          <Select.Option value={10}>10x</Select.Option>
        </Select>

        {simulationState.alerts.length > 0 && (
          <Badge count={simulationState.alerts.length} size="small">
            <Button
              size="small"
              type="text"
              icon={<SettingOutlined />}
              onClick={clearAllAlerts}
              title="Clear all alerts"
            />
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClockCircleOutlined />
          <span>Real-time Simulation Control</span>
          {simulationState.isRunning && (
            <BBDTag style={{ color: '#52c41a', backgroundColor: '#f6ffed' }}>
              LIVE
            </BBDTag>
          )}
        </div>
      }
      size="small"
      className="mb-2"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!simulationState.isRunning ? (
              <GraviButton
                buttonText="Start Simulation"
                theme1
                size="medium"
                onClick={() => startSimulation(simulationState.speed)}
              />
            ) : (
              <>
                <GraviButton
                  buttonText="Pause"
                  appearance="outlined"
                  size="medium"
                  onClick={pauseSimulation}
                />
                <GraviButton
                  buttonText="Stop"
                  appearance="outlined"
                  size="medium"
                  onClick={stopSimulation}
                />
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Speed:</span>
            <Select
              value={simulationState.speed}
              onChange={setSimulationSpeed}
              style={{ width: 80 }}
            >
              <Select.Option value={0.5}>0.5x</Select.Option>
              <Select.Option value={1}>1x</Select.Option>
              <Select.Option value={2}>2x</Select.Option>
              <Select.Option value={5}>5x</Select.Option>
              <Select.Option value={10}>10x</Select.Option>
            </Select>
          </div>

          {simulationState.isRunning && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Runtime:</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1890ff' }}>
                {formatRunTime(runTime)}
              </span>
            </div>
          )}
        </div>

        {/* Status Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          <div className="text-center">
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
              {activeRoutes.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Active Routes</div>
          </div>
          
          <div className="text-center">
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
              {simulationState.events.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Events Generated</div>
          </div>
          
          <div className="text-center">
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: simulationState.alerts.length > 0 ? '#ff4d4f' : '#52c41a' }}>
              {simulationState.alerts.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Active Alerts</div>
          </div>
        </div>

        {/* Route Progress Bars */}
        {showProgressBars && activeRoutes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
              Route Progress (Live Updates)
            </div>
            {activeRoutes.slice(0, 3).map(route => {
              const animatedProgress = simulationState.progressAnimations[route.id]?.currentProgress || 
                                     (route.progress.completed / route.progress.total * 100);
              
              return (
                <div key={route.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', minWidth: '100px', color: '#666' }}>
                    {route.name}
                  </span>
                  <Progress
                    percent={Math.round(animatedProgress)}
                    size="small"
                    style={{ flex: 1 }}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#52c41a',
                    }}
                  />
                  <span style={{ fontSize: '12px', color: '#666', minWidth: '40px' }}>
                    {route.progress.completed}/{route.progress.total}
                  </span>
                </div>
              );
            })}
            {activeRoutes.length > 3 && (
              <div style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
                ... and {activeRoutes.length - 3} more routes
              </div>
            )}
          </div>
        )}

        {/* Recent Alerts */}
        {simulationState.alerts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                Recent Alerts ({simulationState.alerts.length})
              </span>
              <Button 
                size="small" 
                onClick={clearAllAlerts}
                type="text"
              >
                Clear All
              </Button>
            </div>
            
            <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {simulationState.alerts.slice(-5).reverse().map(alert => (
                <div
                  key={alert.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    backgroundColor: 
                      alert.type === 'error' ? '#fff2f0' :
                      alert.type === 'warning' ? '#fff7e6' :
                      alert.type === 'success' ? '#f6ffed' : '#e6f7ff',
                    borderLeft: `3px solid ${
                      alert.type === 'error' ? '#ff4d4f' :
                      alert.type === 'warning' ? '#fa8c16' :
                      alert.type === 'success' ? '#52c41a' : '#1890ff'
                    }`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                      {alert.title}
                    </div>
                    <div style={{ color: '#666' }}>
                      {alert.message}
                    </div>
                    <div style={{ color: '#999', fontSize: '10px', marginTop: '2px' }}>
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => dismissAlert(alert.id)}
                    style={{ padding: '0 4px', height: 'auto', fontSize: '10px' }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}