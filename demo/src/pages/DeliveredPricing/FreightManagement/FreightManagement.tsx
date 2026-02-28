/**
 * Freight Management Page
 *
 * Reference data management grid for carrier lane freight rates.
 * Allows viewing and editing freight rates by carrier, origin, destination,
 * commodity, expressed in cents per gallon (CPG).
 *
 * Nested under the Delivered Pricing menu as a subpage.
 */

import { useMemo, useState } from 'react'
import { GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { getFreightManagementColumnDefs } from './FreightManagement.columnDefs'
import { freightLaneRates, type FreightLaneRate } from './FreightManagement.data'

export function FreightManagement() {
  const [rowData] = useState<FreightLaneRate[]>(freightLaneRates)

  const columnDefs = useMemo(() => getFreightManagementColumnDefs(), [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => String(params.data?.id),
      domLayout: 'normal' as const,
      groupDefaultExpanded: 1,
      autoGroupColumnDef: {
        headerName: 'Carrier / Origin',
        minWidth: 260,
        cellRendererParams: {
          suppressCount: false,
        },
      },
    }),
    []
  )

  const laneCount = rowData.length
  const carrierCount = new Set(rowData.map((r) => r.CarrierName)).size
  const originCount = new Set(rowData.map((r) => r.OriginLocationName)).size
  const destinationCount = new Set(rowData.map((r) => r.DestinationLocationName)).size

  const controlBarProps = useMemo(
    () => ({
      title: 'Freight Management',
      subtitle: 'Manage carrier freight rates by lane and commodity.',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal verticalCenter style={{ gap: '0.75rem' }}>
          <Horizontal verticalCenter style={{ gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#595959',
                backgroundColor: '#f5f5f5',
                padding: '1px 8px',
                borderRadius: 3,
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {carrierCount} Carriers
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#595959',
                backgroundColor: '#f5f5f5',
                padding: '1px 8px',
                borderRadius: 3,
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {originCount} Origins
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#595959',
                backgroundColor: '#f5f5f5',
                padding: '1px 8px',
                borderRadius: 3,
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {destinationCount} Destinations
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--theme-primary, #1890ff)',
                backgroundColor: 'rgba(24, 144, 255, 0.08)',
                padding: '1px 8px',
                borderRadius: 3,
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {laneCount} Lane Rates
            </span>
          </Horizontal>
        </Horizontal>
      ),
    }),
    [carrierCount, originCount, destinationCount, laneCount]
  )

  const updateEP = async () => {
    return Promise.resolve()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraviGrid
          storageKey="freight-management-grid"
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          updateEP={updateEP}
          headerHeight={33}
        />
      </div>
    </div>
  )
}
