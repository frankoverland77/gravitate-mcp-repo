import React, { useState } from 'react';
import { Switch, Select, Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { useDelivery } from '../contexts/DeliveryContext';

interface SimulationControlDrawerProps {
  className?: string;
}

export function SimulationControlDrawer({ className = '' }: SimulationControlDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    simulationState, 
    toggleSimulation, 
    setSimulationSpeed, 
    orders, 
    routes, 
    drivers 
  } = useDelivery();

  const activeRoutes = routes.filter(route => route.status === 'ACTIVE');
  const eventsGenerated = simulationState.eventsGenerated || Math.floor(Math.random() * 50) + 20;
  const activeAlerts = simulationState.activeAlerts || Math.floor(Math.random() * 5) + 1;

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleSpeedChange = (value: string) => {
    setSimulationSpeed(parseFloat(value));
  };

  return (
    <div className={className}>
      {/* Fixed position drawer container */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '350px',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderBottom: 'none',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        {/* Always visible title bar */}
        <div
          onClick={toggleDrawer}
          style={{
            padding: '12px 16px',
            backgroundColor: '#fafafa',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            borderBottom: isOpen ? '1px solid #d9d9d9' : 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            userSelect: 'none'
          }}
        >
          <span style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎮 Real-time Simulation Control
            {simulationState.isRunning && (
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#52c41a',
                animation: 'pulse 2s infinite'
              }} />
            )}
          </span>
          {isOpen ? <UpOutlined style={{ fontSize: '12px', color: '#666' }} /> : <DownOutlined style={{ fontSize: '12px', color: '#666' }} />}
        </div>

        {/* Expandable content */}
        {isOpen && (
          <div className="p-2">
            {/* Main Controls Row */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              {/* Start/Stop Button */}
              <Button
                type={simulationState.isRunning ? "default" : "primary"}
                icon={simulationState.isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={toggleSimulation}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  fontWeight: 500
                }}
              >
                {simulationState.isRunning ? 'Stop' : 'Start'}
              </Button>

              {/* Speed Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>Speed:</span>
                <Select
                  value={simulationState.speed?.toString() || '1'}
                  onChange={handleSpeedChange}
                  size="small"
                  style={{ width: '80px' }}
                >
                  <Select.Option value="0.5">0.5x</Select.Option>
                  <Select.Option value="1">1x</Select.Option>
                  <Select.Option value="2">2x</Select.Option>
                  <Select.Option value="5">5x</Select.Option>
                  <Select.Option value="10">10x</Select.Option>
                </Select>
              </div>
            </div>

            {/* Status Information Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderTop: '1px solid #f0f0f0'
            }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>Active Routes</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
                  {activeRoutes.length}
                </div>
              </div>

              <div style={{ width: '1px', height: '30px', backgroundColor: '#f0f0f0' }} />

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>Events Generated</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
                  {eventsGenerated}
                </div>
              </div>

              <div style={{ width: '1px', height: '30px', backgroundColor: '#f0f0f0' }} />

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>Active Alerts</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
                  {activeAlerts}
                </div>
              </div>
            </div>

            {/* Additional Status if Running */}
            {simulationState.isRunning && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#389e0d',
                textAlign: 'center'
              }}>
                🟢 Simulation running at {simulationState.speed || 1}x speed
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add the pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}