import React, { useMemo, useState, useCallback } from 'react';
import { GraviGrid, GraviButton, Texto } from '@gravitate-js/excalibrr';
import { Tabs, Drawer, Radio, Button, Form } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useFeatureMode } from '../../contexts/FeatureModeContext';
import { generateBuyPromptsData, generateBuyForwardsData } from '../../shared/data';
import {
    IndexOfferRow,
    generateIndexOffers,
    formatDifferential,
} from './components/indexOfferData';
import { IndexOfferPlaceOrderDrawer } from './components/IndexOfferPlaceOrderDrawer';

export function OnlineSellingPlatformHome() {
    const { featureMode, setFeatureMode } = useFeatureMode();
    const [activeTab, setActiveTab] = useState('index-offers');
    const [drawerVisible, setDrawerVisible] = useState(false);

    // Create Order drawer state
    const [orderDrawerVisible, setOrderDrawerVisible] = useState(false);
    const [selectedOrderData, setSelectedOrderData] = useState<IndexOfferRow | null>(null);
    const [placeOrderForm] = Form.useForm();

    // Handler for Create Order button - wrapped in useCallback to avoid closure issues
    const handleCreateOrder = useCallback((rowData: IndexOfferRow) => {
        setSelectedOrderData(rowData);
        setOrderDrawerVisible(true);
        placeOrderForm.resetFields();
    }, [placeOrderForm]);

    const handleClosePlaceOrder = useCallback(() => {
        setOrderDrawerVisible(false);
        setSelectedOrderData(null);
    }, []);

    // Buy Prompts tab data - generated from shared data
    const buyPromptsRowData = useMemo(() => generateBuyPromptsData(15), []);

    // Buy Forwards tab data - generated from shared data
    const buyForwardsRowData = useMemo(() => generateBuyForwardsData(10), []);

    // Index Offers tab data - uses the same index offer shape as IndexOfferBuyNow
    const indexOffersRowData = useMemo(() => generateIndexOffers(12), []);

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
            field: 'location',
            headerName: 'LOCATION',
            width: 180,
            sortable: true,
            filter: true,
            enableRowGroup: true,
        },
        {
            field: 'product',
            headerName: 'PRODUCT',
            width: 170,
            sortable: true,
            filter: true,
        },
        {
            field: 'formulaName',
            headerName: 'FORMULA NAME',
            width: 420,
            sortable: true,
            filter: true,
            wrapText: true,
            autoHeight: true,
        },
        {
            field: 'formulaDifferential',
            headerName: 'DIFF',
            width: 110,
            sortable: true,
            filter: 'agNumberColumnFilter',
            type: 'rightAligned',
            valueFormatter: ({ value }: any) => formatDifferential(value),
        },
        {
            field: 'actions',
            headerName: 'ACTIONS',
            width: 160,
            pinned: 'right',
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: (params: any) => (
                <GraviButton
                    buttonText="Create Order"
                    onClick={() => handleCreateOrder(params.data)}
                    size="small"
                />
            ),
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
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
                    { key: 'index-offers', label: 'Index Offers' },
                    { key: 'buy-prompts', label: 'Buy Prompts' },
                    { key: 'buy-forwards', label: 'Buy Forwards' },
                ]} />
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
                open={drawerVisible}
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

            </Drawer>


            {/* Index Offer Place Order Drawer (mirrors IndexOfferBuyNow) */}
            <IndexOfferPlaceOrderDrawer
                open={orderDrawerVisible}
                offer={selectedOrderData}
                onClose={handleClosePlaceOrder}
                form={placeOrderForm}
                editableLiftingDates
            />
        </div>
    );
}
