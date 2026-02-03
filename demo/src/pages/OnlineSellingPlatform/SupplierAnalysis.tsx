import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraviGrid, GraviButton, Vertical, BBDTag } from '@gravitate-js/excalibrr';
import { RightOutlined, FilterOutlined, DownloadOutlined } from '@ant-design/icons';
import { generateSupplierAnalysisData } from '../../shared/data';

export function SupplierAnalysis() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    // Generate supplier analysis data from shared suppliers, locations, and products
    const rowData = useMemo(() => generateSupplierAnalysisData(15), []);

    const columnDefs = useMemo(() => [
        {
            field: 'supplier',
            headerName: 'SUPPLIER',
            width: 180,
            sortable: true,
            filter: true
        },
        {
            field: 'location',
            headerName: 'LOCATION',
            width: 150,
            sortable: true,
            filter: true
        },
        {
            field: 'locationGroup',
            headerName: 'LOCATION GROUP',
            width: 150,
            sortable: true,
            filter: true
        },
        {
            field: 'product',
            headerName: 'PRODUCT',
            width: 140,
            sortable: true,
            filter: true
        },
        {
            field: 'productGroup',
            headerName: 'PRODUCT GROUP',
            width: 150,
            sortable: true,
            filter: true
        },
        {
            field: 'brand',
            headerName: 'BRAND',
            width: 120,
            sortable: true,
            filter: true
        },
        {
            field: 'strategyTag',
            headerName: 'STRATEGY TAG',
            width: 130,
            sortable: true,
            filter: true,
            cellRenderer: (params: any) => {
                const strategy = params.value;
                if (strategy === 'Leader') {
                    return <span style={{ fontWeight: 600 }}>{strategy}</span>;
                }
                return strategy;
            }
        },
        {
            field: 'spotDeltaCapture',
            headerName: 'SPOT DELTA CAPTURE',
            width: 180,
            sortable: true,
            filter: true,
            type: 'numericColumn',
            valueFormatter: (params: any) => `${params.value}%`
        },
        {
            field: 'consistency',
            headerName: 'CONSISTENCY',
            width: 150,
            sortable: true,
            filter: true,
            cellRenderer: (params: any) => {
                const { level, percentage } = params.value;
                if (level === 'High') {
                    return <BBDTag success style={{ width: 'fit-content' }}>{level} {percentage}%</BBDTag>;
                }
                if (level === 'Medium') {
                    return <BBDTag warning style={{ width: 'fit-content' }}>{level} {percentage}%</BBDTag>;
                }
                if (level === 'Low') {
                    return <BBDTag error style={{ width: 'fit-content' }}>{level} {percentage}%</BBDTag>;
                }
                return <BBDTag style={{ width: 'fit-content' }}>{level} {percentage}%</BBDTag>;
            },
            comparator: (valueA: any, valueB: any) => {
                // Sort by percentage value
                return valueA.percentage - valueB.percentage;
            }
        },
        {
            field: 'actions',
            headerName: 'ACTIONS',
            width: 120,
            pinned: 'right',
            sortable: false,
            filter: false,
            cellRenderer: (params: any) => {
                return (
                    <div
                        style={{
                            cursor: 'pointer',
                            color: '#595959',
                            textDecoration: 'underline',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                        onClick={() => {
                            navigate('/SupplierAnalysis/SupplierDetails', {
                                state: { supplier: params.data }
                            });
                        }}
                    >
                        <span>Analyze</span>
                        <RightOutlined style={{ fontSize: '12px' }} />
                    </div>
                );
            }
        }
    ], [navigate]);

    return (
        <Vertical style={{ height: '100%', gap: 0 }}>
            <GraviGrid
                storageKey="supplier-analysis-grid"
                rowData={rowData}
                columnDefs={columnDefs}
                agPropOverrides={{
                    getRowId: (params: any) => params.data.id,
                    domLayout: 'normal',
                    suppressRowClickSelection: true,
                    enableCellTextSelection: true,
                    rowGroupPanelShow: 'never'
                }}
                controlBarProps={{
                    title: 'Supplier Price Analysis',
                    subtitle: `${rowData.length} Suppliers`,
                    hideActiveFilters: true,
                    hideFilterRow: true,
                    actionButtons: (
                        <>
                            <GraviButton
                                buttonText="Filters"
                                icon={<FilterOutlined />}
                                appearance="outlined"
                                onClick={() => {
                                    // Filter functionality to be implemented
                                    console.log('Filters clicked');
                                }}
                            />
                            <GraviButton
                                buttonText="Export"
                                icon={<DownloadOutlined />}
                                appearance="outlined"
                                onClick={() => {
                                    // Export functionality to be implemented
                                    console.log('Export clicked');
                                }}
                            />
                        </>
                    )
                }}
            />
        </Vertical>
    );
}
