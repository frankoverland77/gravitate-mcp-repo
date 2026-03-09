import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraviGrid, BBDTag, Horizontal } from '@gravitate-js/excalibrr';
import {
    RightOutlined,
    BarChartOutlined,
    DollarOutlined,
    EllipsisOutlined
} from '@ant-design/icons';

// Detail row data for expanded contracts
const getContractDetails = (contractId: number) => {
    // Sample detail data - in real app this would come from API
    const detailsMap: Record<number, any[]> = {
        73: [
            { from: "ABERDEEN - 1941", to: "", product: "#1 B2 DYED - 0423", volume: "13", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "ALEXANDRIA - 250", to: "", product: "#1 ULSD - 0033", volume: "1443", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "BETTENDORF MAG - 1279", to: "", product: "#2 ULSD DYED - 0034", volume: "144586", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "CARROLLTON - 1533", to: "", product: "5% BIO DYED - 0430", volume: "144586", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "COLUMBUS - 313", to: "", product: "BIO 20% PREM - 0457", volume: "1445899", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "GENEVA - 1629", to: "", product: "ELITE WTR B10 11% - 1172", volume: "1445899", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "KANSAS CITY SINC - 1391", to: "", product: "M10% LVP 7.0 - 0486", volume: "1445899", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "MISSOULA - 820", to: "", product: "PROPANE - 0174", volume: "1445899", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "PHOENIX AZ - 930", to: "", product: "RENEWABLE TALLOW 9962 - 1099", volume: "1445899", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "FT MDILL - 345", to: "", product: "MG109L - 0028", volume: "1445899", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" },
            { from: "GREAT BEND - 1380", to: "", product: "BD (RI95) DYED - 0958", volume: "1445899", contractFrom: "05/22/2025, 12:00 AM", contractTo: "05/02/2026, 11:59 PM", asOfDate: "09/30/2025, 1:56 PM", recentPrice: "", recentStatus: "" }
        ]
    };

    return detailsMap[contractId] || [];
};

// Detail grid component
const DetailGrid = ({ data }: { data: any[] }) => {
    const detailColumnDefs = useMemo(() => [
        { field: "from", headerName: "FROM", width: 180 },
        { field: "to", headerName: "TO", width: 120 },
        { field: "product", headerName: "PRODUCT", width: 220 },
        { field: "volume", headerName: "VOLUME", width: 100 },
        { field: "contractFrom", headerName: "CONTRACT FROM", width: 180 },
        { field: "contractTo", headerName: "CONTRACT TO", width: 180 },
        { field: "asOfDate", headerName: "AS OF DATE", width: 180 },
        { field: "recentPrice", headerName: "RECENT PRICE", width: 130 },
        { field: "recentStatus", headerName: "RECENT STATUS", width: 140 }
    ], []);

    const detailControlBarProps = useMemo(() => ({
        title: `Details`,
        hideActiveFilters: false,
    }), []);

    const detailAgPropOverrides = useMemo(() => ({
        domLayout: 'normal',
        headerHeight: 40,
        rowHeight: 40,
        suppressRowGroupHidesColumns: true,
        rowGroupPanelShow: 'never',
        suppressMakeColumnVisibleAfterUnGroup: true
    }), []);

    const updateEP = async (params: any) => {
        console.log('Detail update called with:', params);
        return Promise.resolve();
    };

    return (
        <div style={{ paddingLeft: '10px', paddingRight: '10px', backgroundColor: '#fafafa' }}>
            <div style={{ height: '400px', backgroundColor: 'white' }}>
                <GraviGrid
                    rowData={data}
                    columnDefs={detailColumnDefs}
                    agPropOverrides={detailAgPropOverrides}
                    controlBarProps={detailControlBarProps}
                    updateEP={updateEP}
                />
            </div>
        </div>
    );
};

// AG Grid detail cell renderer component
const DetailCellRenderer = (props: any) => {
    return <DetailGrid data={props.detailData} />;
};

// Static contract data matching the screenshot
const CONTRACTS_DATA = [
    {
        id: 73,
        status: "Draft",
        description: "Testing table issue",
        created: "05/22/2025",
        contractFrom: "05/22/2025",
        contractTo: "05/02/2026",
        type: "Purchase",
        instrument: "Day - Fixed",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "284 FUEL SUPPLY LLC - 1104546",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "10,411,921",
        strategy: ""
    },
    {
        id: 6,
        status: "Accepted",
        description: "",
        created: "05/12/2025",
        contractFrom: "05/15/2025",
        contractTo: "04/30/2026",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "MAVERIK INC - 1100199",
        locations: "CEDAR CITY - 2161",
        products: "More Available Group",
        volume: "34,049,972",
        strategy: ""
    },
    {
        id: 7,
        status: "Accepted",
        description: "",
        created: "05/12/2025",
        contractFrom: "05/15/2025",
        contractTo: "04/30/2026",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "MAVERIK INC - 1100199",
        locations: "LAS VEGAS HP - 3142",
        products: "PRIM106 - 0041 #21",
        volume: "13,680,000",
        strategy: ""
    },
    {
        id: 11,
        status: "Accepted",
        description: "",
        created: "05/13/2025",
        contractFrom: "10/01/2024",
        contractTo: "10/01/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "THE KROGER CO - 1100742",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "43,875,000",
        strategy: ""
    },
    {
        id: 14,
        status: "Accepted",
        description: "",
        created: "05/13/2025",
        contractFrom: "11/01/2024",
        contractTo: "10/31/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "OFFEN PETROLEUM LLC - 1104641",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "16,400,000",
        strategy: ""
    },
    {
        id: 17,
        status: "Accepted",
        description: "",
        created: "05/13/2025",
        contractFrom: "10/22/2024",
        contractTo: "10/14/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "MAVERIK INC - 1100199",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "39,506,922",
        strategy: ""
    },
    {
        id: 20,
        status: "Accepted",
        description: "",
        created: "05/13/2025",
        contractFrom: "01/01/2024",
        contractTo: "10/31/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "BRAD HALL & ASSOCIATES - 1100086",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "14,966,644",
        strategy: ""
    },
    {
        id: 28,
        status: "Accepted",
        description: "IMC - 2) CA43110049-01",
        created: "05/13/2025",
        contractFrom: "10/01/2024",
        contractTo: "09/30/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "CASEY'S MARKETING CO - 1103493",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "2,760,000",
        strategy: ""
    },
    {
        id: 29,
        status: "Accepted",
        description: "IMC - 3) B0531100971-01",
        created: "05/13/2025",
        contractFrom: "02/01/2025",
        contractTo: "01/31/2026",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "BOSSELMAN'S INC - 1105971",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "33,984,000",
        strategy: ""
    },
    {
        id: 30,
        status: "Accepted",
        description: "IMC - 5)",
        created: "05/14/2025",
        contractFrom: "11/01/2024",
        contractTo: "10/31/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "HARMS OIL COMPANY - 1105317",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "780,000",
        strategy: ""
    },
    {
        id: 31,
        status: "Accepted",
        description: "ISW - 1) MAVE1100199",
        created: "05/14/2025",
        contractFrom: "01/01/2025",
        contractTo: "12/31/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "MAVERIK INC - 1100199",
        locations: "Multiple Locations",
        products: "More Available Group",
        volume: "39,900,000",
        strategy: ""
    },
    {
        id: 33,
        status: "Accepted",
        description: "",
        created: "05/15/2025",
        contractFrom: "10/01/2024",
        contractTo: "09/30/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "TA OPERATING LLC - 1100282",
        locations: "Multiple Locations",
        products: "#2 ULSD - 0032",
        volume: "24,000,000",
        strategy: ""
    },
    {
        id: 35,
        status: "Accepted",
        description: "",
        created: "05/15/2025",
        contractFrom: "08/15/2024",
        contractTo: "01/24/2028",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "COSTCO WHOLESALE CORPORATION - 1100",
        locations: "FOUNTAIN - 1143",
        products: "ULS100L - 0037 #1 U",
        volume: "3,019,988",
        strategy: ""
    },
    {
        id: 36,
        status: "Accepted",
        description: "",
        created: "05/15/2025",
        contractFrom: "10/01/2023",
        contractTo: "10/01/2025",
        type: "Purchase",
        instrument: "Term - Formula",
        internalCounterparty: "HP Sinclair - 2005",
        externalCompany: "MINI MART INC - 1100580",
        locations: "FOUNTAIN - 1143",
        products: "More Available Group",
        volume: "53,925,000",
        strategy: ""
    }
];

export function PromptsGrid() {
    const navigate = useNavigate();

    const columnDefs = useMemo(() => [
        {
            field: "id",
            headerName: "ID",
            width: 80,
            cellRenderer: 'agGroupCellRenderer'
        },
        {
            field: "status",
            headerName: "STATUS",
            width: 120,
            cellRenderer: (params: any) => (
                <BBDTag success style={{ width: 'fit-content' }}>
                    {params.value}
                </BBDTag>
            )
        },
        {
            field: "description",
            headerName: "DESCRIPTION",
            resizable: true,
            width: 200
        },
        {
            field: "created",
            headerName: "CREATED",
            width: 120
        },
        {
            field: "contractFrom",
            headerName: "CONTRACT FROM",
            width: 140
        },
        {
            field: "contractTo",
            headerName: "CONTRACT TO",
            width: 140
        },
        {
            field: "type",
            headerName: "TYPE",
            width: 110
        },
        {
            field: "instrument",
            headerName: "INSTRUMENT",
            width: 150
        },
        {
            field: "internalCounterparty",
            headerName: "INTERNAL COUNTERPARTY",
            resizable: true,
            width: 200
        },
        {
            field: "externalCompany",
            headerName: "EXTERNAL COMPANY",
            resizable: true,
            width: 220
        },
        {
            field: "locations",
            headerName: "LOCATIONS",
            resizable: true,
            width: 180
        },
        {
            field: "products",
            headerName: "PRODUCTS",
            resizable: true,
            width: 200
        },
        {
            field: "volume",
            headerName: "VOLUME",
            width: 130
        },
        {
            field: "strategy",
            headerName: "STRATEGY",
            width: 120
        },
        {
            headerName: "ACTIONS",
            width: 140,
            pinned: 'right',
            cellRenderer: (params: any) => (
                <Horizontal gap={12} style={{ alignItems: 'center', height: '100%' }}>
                    <RightOutlined
                        style={{
                            color: '#595959',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                        onClick={() => navigate('/ContractFormulas/ContractDetails', {
                            state: {
                                id: params.data.id,
                                description: params.data.description,
                                externalCompany: params.data.externalCompany,
                                status: params.data.status
                            }
                        })}
                        title="View details"
                    />
                    <BarChartOutlined
                        style={{
                            color: '#595959',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                        onClick={() => console.log('View charts:', params.data.id)}
                        title="View analytics"
                    />
                    <DollarOutlined
                        style={{
                            color: '#595959',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                        onClick={() => console.log('View pricing:', params.data.id)}
                        title="View pricing"
                    />
                    <EllipsisOutlined
                        style={{
                            color: '#595959',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                        onClick={() => console.log('More options:', params.data.id)}
                        title="More options"
                    />
                </Horizontal>
            )
        }
    ], [navigate]);

    const storageKey = 'contracts-grid';

    const agPropOverrides = useMemo(() => ({
        getRowId: (params: any) => params.data.id,
        masterDetail: true,
        detailRowAutoHeight: true,
        detailCellRendererParams: (params: any) => ({
            detailData: getContractDetails(params.data.id)
        }),
        detailCellRenderer: DetailCellRenderer
    }), []);

    const controlBarProps = useMemo(() => ({
        title: 'Contracts',
        hideActiveFilters: false,
    }), []);

    const updateEP = async (params: any) => {
        console.log('Update called with:', params);
        return Promise.resolve();
    };

    return (
        <div style={{ height: '100%' }}>
            <GraviGrid
                storageKey={storageKey}
                rowData={CONTRACTS_DATA}
                columnDefs={columnDefs}
                agPropOverrides={agPropOverrides}
                controlBarProps={controlBarProps}
                updateEP={updateEP}
            />
        </div>
    );
}
