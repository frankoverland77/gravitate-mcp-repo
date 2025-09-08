import { ThunderboltOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  Allocation,
  AllocationAssociationMetadataResponse,
  CounterPartySetupOption,
} from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import { toAntOption } from '@utils/index'
import { Popconfirm, Radio, Select, Space, Tooltip } from 'antd'
import React, { useMemo } from 'react'
interface ForeignRowBase {
  AllocationId: number
}
interface GravitateRowBase {
  AuthorizationAllocationLinkId?: number | null
  [key: string]: any
}
type FlexibleForeignRow = Allocation | ForeignRowBase
type FlexibleGravitateRow = CounterPartySetupOption | GravitateRowBase

export interface LinkUnlinkAssociationActionButtonsProps {
  selectedForeignRow?: FlexibleForeignRow
  selectedGravitateRowsToAssociate?: FlexibleGravitateRow[]
  handleLink: () => void
  canLink: boolean
  canUnlink: boolean
  handleUnlink: () => void
  canWrite: boolean
  canAutoMap?: boolean
  handleAutoMap?: () => void
  isDeleteMode?: boolean
  deleteList?: number[]
  cancelUnlink?: () => void
  setIsDeleteMode?: React.Dispatch<React.SetStateAction<boolean>>
  showUnLinkAllButton?: boolean
  isUnLinkAll?: 'ALL' | 'SELECTED' | undefined
  setIsUnLinkAll?: React.Dispatch<React.SetStateAction<'ALL' | 'SELECTED' | undefined>>
  handleUnLinkAll?: () => void
  canUnLinkAll?: boolean
  metadata?: AllocationAssociationMetadataResponse
  bulkSelectedRefreshRate?: number
  setBulkSelectedRefreshRate?: React.Dispatch<React.SetStateAction<number | undefined>>
  bulkUpdateRefreshRate?: () => void
}

export function LinkUnlinkAssociationActionButtons({
  selectedForeignRow,
  selectedGravitateRowsToAssociate,
  handleLink,
  canLink,
  canUnlink,
  handleUnlink,
  canWrite,
  canAutoMap,
  handleAutoMap,
  isDeleteMode,
  deleteList,
  setIsDeleteMode,
  cancelUnlink,
  showUnLinkAllButton,
  isUnLinkAll,
  setIsUnLinkAll,
  handleUnLinkAll,
  canUnLinkAll,
  metadata,
  bulkSelectedRefreshRate,
  setBulkSelectedRefreshRate,
  bulkUpdateRefreshRate,
}: LinkUnlinkAssociationActionButtonsProps) {
  const getLinkTitle = useMemo(() => {
    const confirmText = `This action will create a link from ${selectedGravitateRowsToAssociate?.length} Gravitate data rows to external allocation ID ${selectedForeignRow?.AllocationId}. Proceed with link action?`
    return <Texto category='p2'>{confirmText}</Texto>
  }, [selectedForeignRow, selectedGravitateRowsToAssociate])

  const getUnlinkTitle = useMemo(() => {
    const confirmText = `This action will unlink ${
      deleteList?.length ? deleteList.length : selectedGravitateRowsToAssociate?.length
    } Gravitate data rows from external allocation. Proceed with unlink action?`
    return <Texto category='p2'>{confirmText}</Texto>
  }, [selectedForeignRow, selectedGravitateRowsToAssociate, deleteList])
  const AutoMapTitle = `Auto Map will create relationships between Gravitate market platform setups and external allocation data based on underlying mappings of counterparties, terminals, and products. External allocations without matches on all underlying mappings will remain unmapped. Only currently unmapped external allocations will have new mappings created. Proceed with auto map?`

  const refreshRateSelectOptions = useMemo(() => {
    const freqList = metadata?.Data?.FrequencyTypeList
    if (!freqList) return []
    return freqList.map(toAntOption)
  }, [metadata])

  const canBulkEditRefreshRate = useMemo(() => {
    const hasMappedCount =
      !!selectedGravitateRowsToAssociate?.length &&
      selectedGravitateRowsToAssociate?.every((row) => !!row?.AuthorizationAllocationLinkId)
    return (
      hasMappedCount &&
      !!refreshRateSelectOptions?.length &&
      typeof setBulkSelectedRefreshRate === 'function' &&
      canWrite
    )
  }, [selectedGravitateRowsToAssociate, canWrite, refreshRateSelectOptions, setBulkSelectedRefreshRate])

  return (
    <Horizontal style={{ gap: 10 }} className='mr-4'>
      {canAutoMap && (
        <Popconfirm
          title={<Texto category='p2'>{AutoMapTitle}</Texto>}
          onConfirm={handleAutoMap}
          okText='Yes'
          cancelText='No'
          placement='bottomLeft'
          overlayStyle={{ width: 350 }}
        >
          <GraviButton disabled={!canWrite} buttonText='Auto Map' theme2 icon={<ThunderboltOutlined />} />
        </Popconfirm>
      )}

      <Popconfirm
        title={getLinkTitle}
        onConfirm={handleLink}
        okText='Yes'
        cancelText='No'
        placement='bottomLeft'
        overlayStyle={{ width: 350 }}
      >
        <GraviButton buttonText='Link' theme1 disabled={!canLink || isDeleteMode} />
      </Popconfirm>
      {deleteList && isDeleteMode && (
        <GraviButton className='ml-4' buttonText='Cancel' onClick={() => cancelUnlink && cancelUnlink()} />
      )}
      {deleteList && !isDeleteMode ? (
        <GraviButton
          buttonText='Unlink Items'
          error
          onClick={() => {
            if (!isDeleteMode && setIsDeleteMode) {
              setIsDeleteMode((prev) => !prev)
            }
          }}
        />
      ) : (
        <Popconfirm
          title={getUnlinkTitle}
          onConfirm={handleUnlink}
          okText='Yes'
          cancelText='No'
          placement='bottomLeft'
          overlayStyle={{ width: 350 }}
        >
          <GraviButton
            buttonText={deleteList ? 'Unlink Selected' : 'Unlink'}
            error
            disabled={!canUnlink || !canWrite}
          />
        </Popconfirm>
      )}
      {showUnLinkAllButton && (
        <Popconfirm
          title={
            <Vertical>
              <Horizontal>
                <Texto>Unlink selected external allocation ID {selectedForeignRow?.AllocationId} from: </Texto>
              </Horizontal>
              <Radio.Group value={isUnLinkAll} onChange={(e) => setIsUnLinkAll && setIsUnLinkAll(e?.target?.value)}>
                <Space direction='vertical'>
                  <Radio checked={isUnLinkAll === 'ALL'} value='ALL' key='true'>
                    All Rows
                  </Radio>
                  <Radio checked={isUnLinkAll === 'SELECTED'} value='SELECTED' key='false'>
                    Selected Rows
                  </Radio>
                </Space>
              </Radio.Group>
            </Vertical>
          }
          onConfirm={handleUnLinkAll}
          okText='Yes'
          cancelText='No'
          placement='bottomLeft'
          overlayStyle={{ width: 350 }}
        >
          <GraviButton buttonText='Unlink All' error disabled={!canUnLinkAll} />
        </Popconfirm>
      )}
      {canWrite && refreshRateSelectOptions && (
        <>
          {!canBulkEditRefreshRate ? (
            <Tooltip title='All selected rows must be mapped to an external allocation'>
              <GraviButton buttonText='Refresh Rate' className='disabled-gravi-button' />
            </Tooltip>
          ) : (
            <Popconfirm
              title={
                <Vertical>
                  <Texto category='p2' className='mb-1 mr-2'>
                    Select a refresh rate to apply to all selected rows:
                  </Texto>
                  <Horizontal className='my-2'>
                    <Select
                      options={refreshRateSelectOptions}
                      value={bulkSelectedRefreshRate}
                      onChange={(value) => setBulkSelectedRefreshRate && setBulkSelectedRefreshRate(value)}
                      style={{ width: '100%' }}
                    />
                  </Horizontal>
                </Vertical>
              }
              placement='bottomLeft'
              okText='Save'
              cancelText='Cancel'
              overlayStyle={{ width: 350 }}
              onCancel={() => setBulkSelectedRefreshRate && setBulkSelectedRefreshRate(undefined)}
              onConfirm={bulkUpdateRefreshRate}
            >
              <GraviButton buttonText='Refresh Rate' disabled={!canBulkEditRefreshRate} />
            </Popconfirm>
          )}
        </>
      )}
    </Horizontal>
  )
}
