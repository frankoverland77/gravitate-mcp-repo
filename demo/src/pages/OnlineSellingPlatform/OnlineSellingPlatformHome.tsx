import React, { useMemo, useState, useCallback } from 'react';
import { GraviGrid, GraviButton, Vertical, Texto, Horizontal } from '@gravitate-js/excalibrr';
import { Tabs, Drawer, Radio, Button, Form, InputNumber, DatePicker, Input, Select, Tag, Collapse, Checkbox, Segmented, Calendar } from 'antd';
import { EyeOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { useFeatureMode } from '../../contexts/FeatureModeContext';
import { generateBuyPromptsData, generateBuyForwardsData, generateHomeIndexOffersData } from '../../shared/data';

const { TabPane } = Tabs;
const { Panel } = Collapse;

export function OnlineSellingPlatformHome() {
    const { featureMode, setFeatureMode, isFutureMode } = useFeatureMode();
    const [activeTab, setActiveTab] = useState('buy-prompts');
    const [drawerVisible, setDrawerVisible] = useState(false);

    // A/B Test states
    const [abTestVariant, setAbTestVariant] = useState('panel');
    const [orderDrawerVisible, setOrderDrawerVisible] = useState(false);
    const [selectedOrderData, setSelectedOrderData] = useState<any>(null);
    const [orderMode, setOrderMode] = useState<'market' | 'bid'>('market');
    const [bidDifferential, setBidDifferential] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'internal' | 'external'>('internal');
    const [liftingDateRange, setLiftingDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [sendNotification, setSendNotification] = useState(false);

    // Handler for Create Order button - wrapped in useCallback to avoid closure issues
    const handleCreateOrder = useCallback((rowData: any) => {
        setSelectedOrderData(rowData);
        setOrderDrawerVisible(true);
    }, []);

    // Buy Prompts tab data - generated from shared data
    const buyPromptsRowData = useMemo(() => generateBuyPromptsData(15), []);

    // Buy Forwards tab data - generated from shared data
    const buyForwardsRowData = useMemo(() => generateBuyForwardsData(10), []);

    // Index Offers tab data - generated from shared data
    const indexOffersRowData = useMemo(() => generateHomeIndexOffersData(12), []);

    // Buy Prompts column definitions
    const buyPromptsColumnDefs = useMemo(() => [
        {
            field: 'location',
            headerName: 'LOCATION',
            width: 200,
            sortable: true,
            filter: true,
            rowGroup: false,
            enableRowGroup: true,
        },
        {
            field: 'product',
            headerName: 'PRODUCT',
            width: 300,
            sortable: true,
            filter: true,
        },
        {
            field: 'price',
            headerName: 'PRICE',
            width: 130,
            sortable: true,
            filter: true,
            type: 'rightAligned',
        },
        {
            field: 'dailyHigh',
            headerName: 'DAILY HIGH',
            width: 130,
            sortable: true,
            filter: true,
            type: 'rightAligned',
        },
        {
            field: 'dailyLow',
            headerName: 'DAILY LOW',
            width: 130,
            sortable: true,
            filter: true,
            type: 'rightAligned',
        },
        {
            field: 'actions',
            headerName: 'ACTIONS',
            width: 160,
            pinned: 'right',
            cellRenderer: (params: any) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <GraviButton
                            buttonText="Create Order"
                            onClick={() => handleCreateOrder(params.data)}
                            size="small"
                        />
                    </div>
                );
            },
        },
    ], [handleCreateOrder]);

    // Buy Forwards column definitions - placeholder structure
    const buyForwardsColumnDefs = useMemo(() => [
        {
            field: 'location',
            headerName: 'LOCATION',
            width: 200,
            sortable: true,
            filter: true,
            rowGroup: false,
            enableRowGroup: true,
        },
        {
            field: 'product',
            headerName: 'PRODUCT',
            width: 250,
            sortable: true,
            filter: true,
        },
        {
            field: 'deliveryMonth',
            headerName: 'DELIVERY MONTH',
            width: 150,
            sortable: true,
            filter: true,
        },
        {
            field: 'price',
            headerName: 'PRICE',
            width: 130,
            sortable: true,
            filter: true,
            type: 'rightAligned',
        },
        {
            field: 'dailyHigh',
            headerName: 'DAILY HIGH',
            width: 130,
            sortable: true,
            filter: true,
            type: 'rightAligned',
        },
        {
            field: 'dailyLow',
            headerName: 'DAILY LOW',
            width: 130,
            sortable: true,
            filter: true,
            type: 'rightAligned',
        },
        {
            field: 'actions',
            headerName: 'ACTIONS',
            width: 160,
            pinned: 'right',
            cellRenderer: (params: any) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <GraviButton
                            buttonText="Create Order"
                            onClick={() => handleCreateOrder(params.data)}
                            size="small"
                        />
                    </div>
                );
            },
        },
    ], [handleCreateOrder]);

    // Index Offers column definitions - cleaner, formula-focused
    const indexOffersColumnDefs = useMemo(() => [
        {
            field: 'terminal',
            headerName: 'TERMINAL',
            width: 200,
            sortable: true,
            filter: true,
            rowGroup: false,
            enableRowGroup: true,
        },
        {
            field: 'product',
            headerName: 'PRODUCT',
            width: 200,
            sortable: true,
            filter: true,
        },
        {
            field: 'type',
            headerName: 'TYPE',
            width: 150,
            sortable: true,
            filter: true,
        },
        {
            field: 'formulaName',
            headerName: 'FORMULA NAME',
            width: 500,
            sortable: true,
            filter: true,
            wrapText: true,
            autoHeight: true,
        },
        {
            field: 'diff',
            headerName: 'DIFF',
            width: 100,
            sortable: true,
            filter: true,
            type: 'rightAligned',
        },
        {
            field: 'actions',
            headerName: 'ACTIONS',
            width: 160,
            pinned: 'right',
            cellRenderer: (params: any) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <GraviButton
                            buttonText="Create Order"
                            onClick={() => handleCreateOrder(params.data)}
                            size="small"
                        />
                    </div>
                );
            },
        },
    ], [handleCreateOrder]);

    // Get current grid configuration based on active tab
    const getCurrentGridConfig = () => {
        switch (activeTab) {
            case 'buy-prompts':
                return {
                    data: buyPromptsRowData,
                    columns: buyPromptsColumnDefs,
                    title: 'Buy Prompts',
                    storageKey: 'buy-now-prompts-grid',
                };
            case 'buy-forwards':
                return {
                    data: buyForwardsRowData,
                    columns: buyForwardsColumnDefs,
                    title: 'Buy Forwards',
                    storageKey: 'buy-now-forwards-grid',
                };
            case 'index-offers':
                return {
                    data: indexOffersRowData,
                    columns: indexOffersColumnDefs,
                    title: 'Index Offers',
                    storageKey: 'buy-now-index-offers-grid',
                };
            default:
                return {
                    data: buyPromptsRowData,
                    columns: buyPromptsColumnDefs,
                    title: 'Buy Prompts',
                    storageKey: 'buy-now-prompts-grid',
                };
        }
    };

    const gridConfig = getCurrentGridConfig();

    const agPropOverrides = useMemo(() => ({
        getRowId: (params: any) => params.data.id,
        domLayout: 'normal',
        suppressRowClickSelection: true,
        rowHeight: activeTab === 'index-offers' ? undefined : 48,
        headerHeight: 40,
        enableCellTextSelection: true,
        ensureDomOrder: true,
        rowGroupPanelShow: 'always',
        suppressMakeColumnVisibleAfterUnGroup: true,
        groupDefaultExpanded: -1,
    }), [activeTab]);

    const controlBarProps = useMemo(() => ({
        title: gridConfig.title,
        hideActiveFilters: false,
    }), [gridConfig.title]);

    const updateEP = async (params: any) => {
        console.log('Update called with:', params);
        return Promise.resolve();
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Tabs */}
            <div style={{ padding: '0 24px', borderBottom: '1px solid #d9d9d9' }}>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Buy Prompts" key="buy-prompts" />
                    <TabPane tab="Buy Forwards" key="buy-forwards" />
                    <TabPane tab="Index Offers" key="index-offers" />
                </Tabs>
            </div>

            {/* Grid */}
            <div style={{ flex: 1 }}>
                <GraviGrid
                    storageKey={gridConfig.storageKey}
                    rowData={gridConfig.data}
                    columnDefs={gridConfig.columns}
                    agPropOverrides={agPropOverrides}
                    controlBarProps={controlBarProps}
                    updateEP={updateEP}
                />
            </div>

            {/* Custom Floating Action Button */}
            <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
                size="large"
                onClick={() => setDrawerVisible(true)}
                style={{
                    position: 'fixed',
                    right: '24px',
                    bottom: '24px',
                    width: '48px',
                    height: '48px',
                    fontSize: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                }}
            />

            {/* View Settings Drawer */}
            <Drawer
                title="View Settings"
                placement="right"
                width={400}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
            >
                {/* Feature Prioritization Section */}
                <div style={{ marginBottom: '24px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'block' }}>
                        Feature Prioritization
                    </Texto>
                    <Radio.Group
                        onChange={(e) => setFeatureMode(e.target.value)}
                        value={featureMode}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                        <Radio value="mvp">
                            <div>
                                <div style={{ fontWeight: 500 }}>MVP Mode</div>
                                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Shows core features ready for production</div>
                            </div>
                        </Radio>
                        <Radio value="future-state">
                            <div>
                                <div style={{ fontWeight: 500 }}>Future State</div>
                                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Shows all features including upcoming functionality</div>
                            </div>
                        </Radio>
                    </Radio.Group>
                </div>

                {/* Page Options Section - Only show on Index Offers tab */}
                {activeTab === 'index-offers' && (
                    <div style={{ marginBottom: '24px' }}>
                        <Texto style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'block' }}>
                            Page Options
                        </Texto>
                        <Texto style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '12px', display: 'block' }}>
                            A/B Test: Create Order Display
                        </Texto>
                        <Radio.Group
                            onChange={(e) => setAbTestVariant(e.target.value)}
                            value={abTestVariant}
                            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                        >
                            <Radio value="panel">
                                <div>
                                    <div style={{ fontWeight: 500 }}>Side Panel (No Backdrop)</div>
                                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Opens as right-side panel without overlay</div>
                                </div>
                            </Radio>
                            <Radio value="drawer">
                                <div>
                                    <div style={{ fontWeight: 500 }}>Bottom Drawer</div>
                                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Opens as bottom drawer with backdrop overlay</div>
                                </div>
                            </Radio>
                        </Radio.Group>
                    </div>
                )}
            </Drawer>

            {/* A/B Test: Side Panel (No Backdrop) */}
            {abTestVariant === 'panel' && (
                <Drawer
                    title={
                        selectedOrderData && (
                            <Texto style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>
                                {selectedOrderData.product} • {selectedOrderData.terminal} • Current Price: ${selectedOrderData.diff || '0.00'}
                            </Texto>
                        )
                    }
                    placement="right"
                    width={600}
                    onClose={() => setOrderDrawerVisible(false)}
                    visible={orderDrawerVisible}
                    mask={false}
                    destroyOnClose
                    headerStyle={{
                        backgroundColor: '#2C3E50',
                        borderBottom: 'none'
                    }}
                    closeIcon={<span style={{ color: '#ffffff', fontSize: '20px' }}>×</span>}
                    bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    {/* Volume Input - Sticky Header */}
                    <Horizontal
                        style={{
                            backgroundColor: '#2C3E50',
                            justifyContent: 'space-between',
                            padding: '20px 24px',
                            alignItems: 'center',
                            flexShrink: 0
                        }}
                    >
                        <Texto style={{ fontSize: '11px', fontWeight: 600, color: 'white', letterSpacing: '0.5px' }}>
                            VOLUME
                        </Texto>
                        <Form.Item name="volume" style={{ width: '60%', margin: 0 }}>
                            <InputNumber
                                autoFocus
                                controls={false}
                                placeholder="Enter volume"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                style={{
                                    width: '100%',
                                    textAlign: 'right',
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: 0,
                                }}
                            />
                        </Form.Item>
                    </Horizontal>

                    {/* Scrollable Content */}
                    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                        <Form>
                                <div style={{ borderBottom: '1px solid #d9d9d9' }} />

                                {/* Index Purchase Section */}
                                <div className="p-3">
                                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <Texto style={{ fontSize: '13px', fontWeight: 600 }}>
                                            Index Purchase
                                        </Texto>
                                        <Tag style={{ margin: 0, backgroundColor: '#1890ff', color: '#ffffff', border: 'none' }}>Spot Index</Tag>
                                    </Horizontal>

                                    {/* Formula Display */}
                                    <div className="mb-2">
                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Formula
                                        </Texto>
                                        <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                                            <Texto style={{ fontSize: '13px', lineHeight: '1.5', fontFamily: 'monospace' }}>
                                                {selectedOrderData?.formulaName || 'No formula selected'}
                                            </Texto>
                                        </div>
                                    </div>

                                    {/* Prices Table */}
                                    <div className="mb-2">
                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Prices
                                        </Texto>
                                        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px' }}>
                                            <Horizontal style={{ borderBottom: '1px solid #e8e8e8', padding: '10px 12px', alignItems: 'center' }}>
                                                <Texto style={{ fontSize: '12px', fontWeight: 600, width: '60px' }}>90%</Texto>
                                                <Texto style={{ fontSize: '12px', flex: 1 }}>Argus Prior Day CBOB USGC</Texto>
                                            </Horizontal>
                                            <Horizontal style={{ borderBottom: '1px solid #e8e8e8', padding: '10px 12px', alignItems: 'center' }}>
                                                <Texto style={{ fontSize: '12px', fontWeight: 600, width: '60px' }}>10%</Texto>
                                                <Texto style={{ fontSize: '12px', flex: 1 }}>Argus Prior Day CBOB USGC</Texto>
                                            </Horizontal>
                                            <Horizontal style={{ borderBottom: '1px solid #e8e8e8', padding: '10px 12px', alignItems: 'center' }}>
                                                <Texto style={{ fontSize: '12px', fontWeight: 600, width: '60px', color: '#ff4d4f' }}>-10%</Texto>
                                                <Texto style={{ fontSize: '12px', flex: 1 }}>OPIS Current Year RIN</Texto>
                                            </Horizontal>
                                            <Horizontal style={{ borderBottom: '1px solid #e8e8e8', padding: '10px 12px', alignItems: 'center', backgroundColor: '#fafafa' }}>
                                                <Texto style={{ fontSize: '12px', fontWeight: 600, width: '60px' }}>100%</Texto>
                                                <Texto style={{ fontSize: '12px', flex: 1, fontWeight: 600 }}>Formula Differential</Texto>
                                                <Texto style={{ fontSize: '12px', fontWeight: 600 }}>
                                                    {selectedOrderData?.diff || '0.10'}
                                                </Texto>
                                            </Horizontal>
                                            <Horizontal style={{ padding: '12px', alignItems: 'center', backgroundColor: '#d4edda' }}>
                                                <Texto style={{ fontSize: '13px', fontWeight: 700, flex: 1, color: '#000000' }}>Calculated Price</Texto>
                                                <Texto style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                                                    $2.7510
                                                </Texto>
                                            </Horizontal>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderBottom: '1px solid #d9d9d9' }} />

                                {/* Pricing Basis Section */}
                                <div className="p-3">
                                    <Texto style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                                        Pricing Basis
                                    </Texto>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                        {/* Price Validity Period */}
                                        <div>
                                            <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                PRICE VALIDITY
                                            </Texto>
                                            <Texto style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                                Midnight - Midnight
                                            </Texto>
                                        </div>

                                        {/* Weekend Rule */}
                                        <div>
                                            <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                WEEKEND RULE
                                            </Texto>
                                            <Texto style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                                Use Friday
                                            </Texto>
                                        </div>

                                        {/* Holiday Rule */}
                                        <div>
                                            <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                HOLIDAY RULE
                                            </Texto>
                                            <Texto style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                                Use prior business day
                                            </Texto>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderBottom: '1px solid #e8e8e8' }} />

                                {/* Lifting Dates Section */}
                                <div className="p-3">
                                    <Texto style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                                        Lifting Dates
                                    </Texto>

                                    {/* From Date */}
                                    <div className="mb-2">
                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            From
                                        </Texto>
                                        <Form.Item name="fromDate" style={{ margin: 0 }}>
                                            <DatePicker
                                                showTime
                                                format="MM/DD/YYYY hh:mm a"
                                                placeholder="10/1/2025 12:00 am CST"
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* To Date */}
                                    <div>
                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            To
                                        </Texto>
                                        <Form.Item name="toDate" style={{ margin: 0 }}>
                                            <DatePicker
                                                showTime
                                                format="MM/DD/YYYY hh:mm a"
                                                placeholder="10/31/2025 11:59 pm CST"
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                <div style={{ borderBottom: '1px solid #e8e8e8' }} />

                                {/* Terms Section */}
                                <div className="p-3">
                                    <Texto style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                                        Terms
                                    </Texto>

                                    <Form.Item name="terms" style={{ margin: 0 }}>
                                        <Input.TextArea
                                            rows={4}
                                            placeholder="Enter additional terms or notes"
                                        />
                                    </Form.Item>
                                </div>

                                <div style={{ borderBottom: '1px solid #e8e8e8' }} />

                                {/* Additional Options - No Collapse */}
                                <div className="p-3">
                                    <Texto style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                                        Additional Options
                                    </Texto>

                                    {/* Counterparty */}
                                    <div className="mb-2">
                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Counterparty
                                        </Texto>
                                        <Form.Item name="counterparty" style={{ margin: 0 }}>
                                            <Select placeholder="Gravitate Purchasing">
                                                <Select.Option value="gravitate">Gravitate Purchasing</Select.Option>
                                                <Select.Option value="acme">ACME Corporation</Select.Option>
                                                <Select.Option value="globex">Globex Industries</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    {/* Contact */}
                                    <div className="mb-2">
                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Contact
                                        </Texto>
                                        <Form.Item name="contact" style={{ margin: 0 }}>
                                            <Select placeholder="Select contact">
                                                <Select.Option value="john">John Smith</Select.Option>
                                                <Select.Option value="jane">Jane Doe</Select.Option>
                                                <Select.Option value="bob">Bob Johnson</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    {/* Internal Counterparty */}
                                    <div className="mb-2">
                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Internal Counterparty
                                        </Texto>
                                        <Form.Item name="internalCounterparty" style={{ margin: 0 }}>
                                            <Select placeholder="Select internal counterparty">
                                                <Select.Option value="dept1">Department 1</Select.Option>
                                                <Select.Option value="dept2">Department 2</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    {/* Send External Notification */}
                                    <Form.Item name="sendNotification" valuePropName="checked" style={{ margin: 0 }}>
                                        <Checkbox>Send External Notification</Checkbox>
                                    </Form.Item>
                                </div>
                        </Form>
                    </div>

                    {/* Sticky Footer with Buttons */}
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid #d9d9d9',
                        backgroundColor: '#ffffff',
                        flexShrink: 0
                    }}>
                        <Horizontal style={{ justifyContent: 'space-between', gap: '12px' }}>
                            <Button
                                size="large"
                                onClick={() => setOrderDrawerVisible(false)}
                                style={{
                                    minWidth: '120px',
                                    backgroundColor: '#d9d9d9',
                                    borderColor: '#d9d9d9',
                                    color: '#000000'
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                size="large"
                                onClick={() => {
                                    console.log('Order confirmed');
                                    setOrderDrawerVisible(false);
                                }}
                                style={{
                                    minWidth: '120px',
                                    backgroundColor: '#ffffff',
                                    borderColor: '#ffffff',
                                    color: '#000000'
                                }}
                            >
                                Confirm
                            </Button>
                        </Horizontal>
                    </div>
                </Drawer>
            )}

            {/* A/B Test: Bottom Drawer (With Backdrop) */}
            {abTestVariant === 'drawer' && (
                <Drawer
                    title={null}
                    placement="bottom"
                    height="75vh"
                    onClose={() => setOrderDrawerVisible(false)}
                    visible={orderDrawerVisible}
                    mask={true}
                    closable={false}
                    destroyOnClose
                    bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    {/* Custom Header */}
                    <div style={{
                        backgroundColor: '#2C3E50',
                        padding: '20px 24px',
                        flexShrink: 0
                    }}>
                        <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Vertical style={{ gap: '4px' }}>
                                <Tag style={{ margin: 0, marginBottom: '4px', backgroundColor: '#1890ff', color: '#ffffff', border: 'none', fontSize: '12px', fontWeight: 600, width: 'fit-content' }}>
                                    Index Purchase
                                </Tag>
                                <Texto style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                                    {selectedOrderData?.product} • {selectedOrderData?.terminal} • Current Price: ${selectedOrderData?.diff || '0.00'}
                                </Texto>
                            </Vertical>
                            <Button
                                type="text"
                                onClick={() => setOrderDrawerVisible(false)}
                                style={{ color: '#ffffff', fontSize: '20px', padding: 0, height: 'auto' }}
                            >
                                ×
                            </Button>
                        </Horizontal>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        {/* Mode Toggle Bar */}
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid #e8e8e8',
                            backgroundColor: '#fafafa'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Texto style={{ fontSize: '13px', fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Purchase Type
                                </Texto>
                                <Segmented
                                    value={orderMode}
                                    onChange={(value) => setOrderMode(value as 'market' | 'bid')}
                                    options={[
                                        { label: 'Market', value: 'market' },
                                        { label: 'Bid', value: 'bid' }
                                    ]}
                                    size="large"
                                    style={{ fontWeight: 600 }}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                />
                            </div>
                        </div>

                        <Form style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {/* Scrollable Content Area */}
                            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px' }}>
                                {/* 3-Column Grid Layout: 25% / 40% / 35% */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1.6fr 1.4fr',
                                    gap: '20px'
                                }}>
                                    {/* Column 1: Details (25%) */}
                                    <div>
                                        <Texto style={{ fontSize: '12px', fontWeight: 700, marginBottom: '16px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', color: '#595959' }}>
                                            Details
                                        </Texto>

                                        {/* Product & Location - Two Columns */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                            {/* Product */}
                                            <div>
                                                <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>
                                                    Product
                                                </Texto>
                                                <Texto category="p1" weight="600">
                                                    {selectedOrderData?.product || 'ULSD 2'}
                                                </Texto>
                                            </div>

                                            {/* Location */}
                                            <div>
                                                <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>
                                                    Location
                                                </Texto>
                                                <Texto category="p1" weight="600">
                                                    {selectedOrderData?.terminal || 'Nashville Terminal'}
                                                </Texto>
                                            </div>
                                        </div>

                                        {/* Volume Section */}
                                        <div className="mb-2">
                                            <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>
                                                Volume
                                            </Texto>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Form.Item name="volume" style={{ margin: 0, flex: '0 0 50%' }}>
                                                    <InputNumber
                                                        autoFocus
                                                        controls={false}
                                                        placeholder="Enter volume"
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                                                        disabled={orderMode === 'market'}
                                                        style={{
                                                            width: '100%',
                                                            textAlign: 'right',
                                                            fontSize: '14px',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Tag style={{ margin: 0, backgroundColor: '#f0f0f0', color: '#595959', border: 'none', fontSize: '10px', fontWeight: 500 }}>
                                                    GAL
                                                </Tag>
                                            </div>
                                        </div>

                                        {/* Lifting Dates - Future State Only */}
                                        {isFutureMode && (
                                            <div style={{ marginTop: '24px' }}>
                                                <Texto style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', color: '#595959' }}>
                                                    Lifting Dates
                                                </Texto>

                                                {/* Date Range Inputs */}
                                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>Start</Texto>
                                                        <Input
                                                            value={liftingDateRange[0] ? liftingDateRange[0].format('MM/DD/YYYY') : ''}
                                                            placeholder="mm/dd/yyyy"
                                                            readOnly
                                                            style={{
                                                                cursor: 'default',
                                                                backgroundColor: '#ffffff'
                                                            }}
                                                            suffix={<span style={{ color: '#8c8c8c' }}>📅</span>}
                                                        />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>End</Texto>
                                                        <Input
                                                            value={liftingDateRange[1] ? liftingDateRange[1].format('MM/DD/YYYY') : ''}
                                                            placeholder="mm/dd/yyyy"
                                                            readOnly
                                                            style={{
                                                                cursor: 'default',
                                                                backgroundColor: '#ffffff'
                                                            }}
                                                            suffix={<span style={{ color: '#8c8c8c' }}>📅</span>}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Always-visible Calendar */}
                                                <style>
                                                    {`
                                                        .lifting-dates-calendar .ant-picker-calendar-header {
                                                            padding: 12px 16px;
                                                            border-bottom: 1px solid #e8e8e8;
                                                        }
                                                        .lifting-dates-calendar .ant-picker-content {
                                                            padding: 8px;
                                                        }
                                                        .lifting-dates-calendar .ant-picker-cell {
                                                            color: #595959;
                                                        }
                                                        .lifting-dates-calendar .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
                                                            background: #e6f7ff !important;
                                                            border: 2px solid #1890ff;
                                                            color: #000000;
                                                            font-weight: 600;
                                                        }
                                                        .lifting-dates-calendar .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
                                                        .lifting-dates-calendar .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
                                                            background: #52c41a !important;
                                                            border: 2px solid #389e0d;
                                                            color: #ffffff;
                                                            font-weight: 600;
                                                        }
                                                        .lifting-dates-calendar .ant-picker-cell-in-view.ant-picker-cell-in-range .ant-picker-cell-inner {
                                                            background: #e6f7ff;
                                                            border: 2px solid #91d5ff;
                                                        }
                                                        .lifting-dates-calendar .ant-picker-cell-today .ant-picker-cell-inner {
                                                            border: 2px solid #000000;
                                                        }
                                                    `}
                                                </style>
                                                <div className="lifting-dates-calendar">
                                                    <Calendar
                                                        fullscreen={false}
                                                        onSelect={(date) => {
                                                            if (!liftingDateRange[0] || (liftingDateRange[0] && liftingDateRange[1])) {
                                                                // Start new range
                                                                setLiftingDateRange([date, null]);
                                                            } else {
                                                                // Complete the range
                                                                const [start] = liftingDateRange;
                                                                if (date.isBefore(start)) {
                                                                    setLiftingDateRange([date, start]);
                                                                } else {
                                                                    setLiftingDateRange([start, date]);
                                                                }
                                                            }
                                                        }}
                                                        headerRender={({ value, onChange }) => {
                                                            const month = value.month();
                                                            return (
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Button
                                                                        type="text"
                                                                        size="small"
                                                                        onClick={() => {
                                                                            const newValue = value.clone().month(month - 1);
                                                                            onChange(newValue);
                                                                        }}
                                                                        style={{ fontSize: '18px', fontWeight: 'bold' }}
                                                                    >
                                                                        ‹
                                                                    </Button>
                                                                    <Texto style={{ fontSize: '15px', fontWeight: 600, color: '#262626' }}>
                                                                        {value.format('MMMM YYYY')}
                                                                    </Texto>
                                                                    <Button
                                                                        type="text"
                                                                        size="small"
                                                                        onClick={() => {
                                                                            const newValue = value.clone().month(month + 1);
                                                                            onChange(newValue);
                                                                        }}
                                                                        style={{ fontSize: '18px', fontWeight: 'bold' }}
                                                                    >
                                                                        ›
                                                                    </Button>
                                                                </div>
                                                            );
                                                        }}
                                                        dateFullCellRender={(date) => {
                                                            const isStart = liftingDateRange[0] && date.isSame(liftingDateRange[0], 'day');
                                                            const isEnd = liftingDateRange[1] && date.isSame(liftingDateRange[1], 'day');
                                                            const isInRange = liftingDateRange[0] && liftingDateRange[1] &&
                                                                date.isAfter(liftingDateRange[0], 'day') &&
                                                                date.isBefore(liftingDateRange[1], 'day');

                                                            return (
                                                                <div
                                                                    className={`ant-picker-cell-inner ${isStart ? 'ant-picker-cell-range-start' : ''} ${isEnd ? 'ant-picker-cell-range-end' : ''} ${isInRange ? 'ant-picker-cell-in-range' : ''}`}
                                                                    style={{
                                                                        height: '32px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        borderRadius: '4px',
                                                                        margin: '2px'
                                                                    }}
                                                                >
                                                                    {date.date()}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Loading Numbers */}
                                        <div style={{ marginTop: '24px' }}>
                                            <Texto style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', color: '#595959' }}>
                                                Loading Numbers (Optional)
                                            </Texto>
                                            <Form.Item name="loadingNumbers" style={{ margin: 0 }}>
                                                <Select
                                                    mode="multiple"
                                                    showSearch
                                                    placeholder="Select loading numbers"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                >
                                                    <Select.Option value="L001">Loading #001 - Rack A</Select.Option>
                                                    <Select.Option value="L002">Loading #002 - Rack B</Select.Option>
                                                    <Select.Option value="L003">Loading #003 - Rack C</Select.Option>
                                                    <Select.Option value="L004">Loading #004 - Rack D</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </div>

                                    {/* Column 2: Pricing - THE STAR (40%) */}
                                    <div>
                                        <Texto style={{ fontSize: '12px', fontWeight: 700, marginBottom: '16px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', color: '#595959' }}>
                                            Pricing
                                        </Texto>

                                        {/* Formula Template Name */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>
                                                Price Formula
                                            </Texto>
                                            <Texto category="p1" weight="600">
                                                {selectedOrderData?.formulaName || 'Standard Index Formula'}
                                            </Texto>
                                        </div>

                                        {/* Formula Differential - PROMINENT - THE STAR */}
                                        <div style={{
                                            backgroundColor: '#f5f5f5',
                                            border: '1px solid #8c8c8c',
                                            borderRadius: '6px',
                                            padding: '12px 16px',
                                            marginBottom: '24px',
                                            textAlign: 'center',
                                            display: 'inline-block',
                                            width: 'auto',
                                            minWidth: '150px'
                                        }}>
                                            <Texto style={{ fontSize: '11px', fontWeight: 600, color: '#595959', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Formula Differential
                                            </Texto>
                                            {orderMode === 'market' ? (
                                                <Texto category="h1" weight="700" style={{ margin: 0 }}>
                                                    {(() => {
                                                        const diff = selectedOrderData?.diff || '+0.10';
                                                        const numStr = diff.replace(/[^0-9.-]/g, '');
                                                        const num = parseFloat(numStr);
                                                        return `${num >= 0 ? '+' : ''}${num.toFixed(4)}`;
                                                    })()}
                                                </Texto>
                                            ) : (
                                                <Form.Item name="bidDifferential" style={{ margin: 0 }}>
                                                    <InputNumber
                                                        controls={false}
                                                        placeholder="0.0000"
                                                        step={0.0001}
                                                        formatter={(value) => {
                                                            if (!value) return '';
                                                            const num = Number(value);
                                                            return `${num >= 0 ? '+' : ''}${num.toFixed(4)}`;
                                                        }}
                                                        parser={(value) => value?.replace(/[^0-9.-]/g, '') as any}
                                                        style={{
                                                            width: '100%',
                                                            fontSize: '28px',
                                                            fontWeight: 700,
                                                            color: '#000000',
                                                            textAlign: 'center'
                                                        }}
                                                    />
                                                </Form.Item>
                                            )}
                                        </div>

                                        {/* Calculated Price - Subdued */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <Texto style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', color: '#595959' }}>
                                                Calculated Price
                                            </Texto>
                                            <Texto category="p1" weight="600" style={{ marginBottom: '6px' }}>
                                                $2.7510
                                            </Texto>
                                            <Texto style={{ fontSize: '11px', color: '#8c8c8c', lineHeight: '1.4', marginBottom: '4px' }}>
                                                Current price. Invoiced prices generated with effective price at time of lifting.
                                            </Texto>
                                            <Texto style={{ fontSize: '11px', color: '#8c8c8c', lineHeight: '1.4' }}>
                                                As of: 10/21/2025 2:45 PM CST
                                            </Texto>
                                        </div>

                                        {/* Formula Components Preview */}
                                        <div>
                                            <Texto style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', color: '#595959' }}>
                                                Formula Components
                                            </Texto>
                                            <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px' }}>
                                                <Horizontal style={{ borderBottom: '1px solid #e8e8e8', padding: '10px 12px', alignItems: 'center' }}>
                                                    <Texto category="p1" weight="600" style={{ width: '60px' }}>90%</Texto>
                                                    <Texto category="p1" style={{ flex: 1 }}>Argus Prior Day CBOB USGC</Texto>
                                                </Horizontal>
                                                <Horizontal style={{ borderBottom: '1px solid #e8e8e8', padding: '10px 12px', alignItems: 'center' }}>
                                                    <Texto category="p1" weight="600" style={{ width: '60px' }}>10%</Texto>
                                                    <Texto category="p1" style={{ flex: 1 }}>Argus Prior Day CBOB USGC</Texto>
                                                </Horizontal>
                                                <Horizontal style={{ borderBottom: '1px solid #e8e8e8', padding: '10px 12px', alignItems: 'center' }}>
                                                    <Texto category="p1" weight="600" style={{ width: '60px', color: '#ff4d4f' }}>-10%</Texto>
                                                    <Texto category="p1" style={{ flex: 1 }}>OPIS Current Year RIN</Texto>
                                                </Horizontal>
                                                <Horizontal style={{ padding: '10px 12px', alignItems: 'center', backgroundColor: '#fafafa', gap: '8px' }}>
                                                    <Texto category="p1" weight="600">Differential</Texto>
                                                    <Texto category="p1" weight="600" style={{ color: (() => {
                                                        const diff = selectedOrderData?.diff || '+0.10';
                                                        const numStr = diff.replace(/[^0-9.-]/g, '');
                                                        const num = parseFloat(numStr);
                                                        return num < 0 ? '#ff4d4f' : '#000000';
                                                    })()} }>
                                                        {(() => {
                                                            const diff = selectedOrderData?.diff || '+0.10';
                                                            const numStr = diff.replace(/[^0-9.-]/g, '');
                                                            const num = parseFloat(numStr);
                                                            return `${num >= 0 ? '+' : ''}${num.toFixed(4)}`;
                                                        })()}
                                                    </Texto>
                                                </Horizontal>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Additional Terms (35%) */}
                                    <div>
                                        <Texto style={{ fontSize: '12px', fontWeight: 700, marginBottom: '16px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', color: '#595959' }}>
                                            Additional Terms
                                        </Texto>

                                        {/* Pricing Rules */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                {/* Price Validity */}
                                                <div>
                                                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>
                                                        Price Validity
                                                    </Texto>
                                                    <Texto category="p1" weight="600">
                                                        Midnight - Midnight
                                                    </Texto>
                                                </div>

                                                {/* Weekend Rule */}
                                                <div>
                                                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>
                                                        Weekend Rule
                                                    </Texto>
                                                    <Texto category="p1" weight="600">
                                                        Use Friday
                                                    </Texto>
                                                </div>

                                                {/* Holiday Rule */}
                                                <div>
                                                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px', display: 'block' }}>
                                                        Holiday Rule
                                                    </Texto>
                                                    <Texto category="p1" weight="600">
                                                        Use prior business day
                                                    </Texto>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Terms - Scrollable */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <Texto style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', color: '#595959' }}>
                                                Terms
                                            </Texto>
                                            <div style={{
                                                maxHeight: '150px',
                                                overflowY: 'auto',
                                                backgroundColor: '#fafafa',
                                                padding: '12px',
                                                borderRadius: '4px',
                                                border: '1px solid #e8e8e8'
                                            }}>
                                                <Texto style={{ fontSize: '11px', color: '#595959', lineHeight: '1.6' }}>
                                                    All deliveries subject to force majeure provisions as outlined in master supply agreement dated January 1, 2024.
                                                    Buyer responsible for all applicable taxes, fees, and duties at point of delivery. Product specifications must
                                                    meet or exceed ASTM D975 Grade 2 standards with sulfur content not to exceed 15ppm. Quality testing to be
                                                    performed by independent third-party laboratory mutually agreed upon by both parties. Any quality claims must
                                                    be submitted in writing within 48 hours of delivery with supporting documentation. Price adjustments for quality
                                                    deviations shall be determined by industry standard compensation methods. Delivery windows are guaranteed within
                                                    +/- 4 hours of scheduled time, subject to weather and terminal operating conditions. Demurrage charges apply
                                                    after 2 hours at standard industry rates. All orders are subject to credit approval and existing credit limits.
                                                    Payment terms strictly enforced with 1.5% monthly interest on overdue balances. This agreement is governed by
                                                    the laws of the State of Texas with exclusive jurisdiction in Houston County courts.
                                                </Texto>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </Form>

                        {/* Sticky Footer with Action Buttons */}
                        <div style={{
                            borderTop: '1px solid #e8e8e8',
                            padding: '16px 24px',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            position: 'sticky',
                            bottom: 0,
                            zIndex: 10
                        }}>
                            <Checkbox checked={sendNotification} onChange={(e) => setSendNotification(e.target.checked)}>
                                Send External Notification
                            </Checkbox>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Button
                                    size="large"
                                    onClick={() => setOrderDrawerVisible(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        backgroundColor: orderMode === 'market' ? '#52c41a' : '#1890ff',
                                        borderColor: orderMode === 'market' ? '#52c41a' : '#1890ff'
                                    }}
                                >
                                    {orderMode === 'market' ? 'Create Order' : 'Submit Bid'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Drawer>
            )}
        </div>
    );
}
