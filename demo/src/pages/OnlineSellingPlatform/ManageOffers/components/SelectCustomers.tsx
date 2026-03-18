import { BBDTag, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Form, Popover } from 'antd';
import type { FormInstance } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useMemo } from 'react';

import { ELIGIBLE_CUSTOMERS } from '../ManageOffers.data';
import type { CustomerGroupTag, EligibleCustomer } from '../ManageOffers.types';

interface SelectCustomersProps {
  currentStep: number;
  form: FormInstance;
}

const customerColumns: ColDef<EligibleCustomer>[] = [
  {
    headerName: '',
    field: 'checkbox' as any,
    maxWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    pinned: 'left',
    suppressMenu: true,
    sortable: false,
    filter: false,
    resizable: false,
    enableRowGroup: false,
  },
  { field: 'CounterPartyName', headerName: 'Customer', flex: 2 },
  {
    headerName: 'Groups',
    field: 'AssociatedGroupTags',
    minWidth: 200,
    flex: 2,
    autoHeight: true,
    valueGetter: ({ data }) => {
      const groups: CustomerGroupTag[] = data?.AssociatedGroupTags || [];
      return groups.map((g) => g.TagName).sort((a, b) => a.localeCompare(b));
    },
    cellRenderer: ({ data }: { data: EligibleCustomer }) => {
      const groups: CustomerGroupTag[] = data?.AssociatedGroupTags || [];
      if (!groups || groups.length === 0) {
        return null;
      }

      const sortedGroups = [...groups].sort((a, b) => a.TagName.localeCompare(b.TagName));
      if (sortedGroups.length <= 2) {
        return (
          <Horizontal gap={4} fullHeight verticalCenter>
            {sortedGroups.map((group) => (
              <BBDTag key={group.TagId}>{group.TagName}</BBDTag>
            ))}
          </Horizontal>
        );
      }

      return (
        <Popover
          placement="bottomLeft"
          content={
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {sortedGroups.map((group) => (
                <Horizontal key={group.TagId}>
                  <Texto>{group.TagName}</Texto>
                </Horizontal>
              ))}
            </div>
          }
        >
          <span style={{ cursor: 'pointer' }}>MULTIPLE GROUPS ({sortedGroups.length})</span>
        </Popover>
      );
    },
  },
  { field: 'City', headerName: 'City', flex: 1 },
  { field: 'State', headerName: 'State', width: 80 },
  { field: 'CreditStatus', headerName: 'Credit Status', flex: 1 },
];

export function SelectCustomers({ currentStep, form }: SelectCustomersProps) {
  const onSelectionChanged = useCallback(
    (event: any) => {
      const selected = event.api.getSelectedRows();
      form.setFieldsValue({ CounterPartyIds: selected.map((r: EligibleCustomer) => r.CounterPartyId) });
    },
    [form],
  );

  const agPropOverrides = useMemo(
    () => ({
      rowSelection: 'multiple' as const,
      getRowId: (params: any) => params.data.CounterPartyId.toString(),
    }),
    [],
  );

  return (
    <Vertical
      style={{ display: currentStep === 3 ? 'block' : 'none', visibility: currentStep === 3 ? 'visible' : 'hidden' }}
      className="p-4"
    >
      <Texto category="h5">Who should receive this deal?</Texto>
      <Texto className="mb-2 text-14">Choose which customers can participate</Texto>
      <div style={{ height: '300px' }}>
        <GraviGrid
          storageKey="ManageOffers-CustomerSelect"
          columnDefs={customerColumns}
          rowData={ELIGIBLE_CUSTOMERS}
          onSelectionChanged={onSelectionChanged}
          agPropOverrides={agPropOverrides}
        />
      </div>
      <Form.Item name="CounterPartyIds" rules={[{ required: true, message: 'At least one customer is required' }]}>
        <input type="hidden" />
      </Form.Item>
    </Vertical>
  );
}
