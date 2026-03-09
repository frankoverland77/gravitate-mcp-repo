/**
 * Bulk Create Drawer
 *
 * Side drawer for creating multiple details via product × location matrix.
 */

import { useState, useCallback } from 'react'
import { Drawer, Checkbox } from 'antd'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { AppstoreAddOutlined } from '@ant-design/icons'

import { PRODUCT_OPTIONS, LOCATION_OPTIONS } from '../../data/contract.data'
import styles from './BulkCreateDrawer.module.css'

interface BulkCreateDrawerProps {
  open: boolean
  onClose: () => void
  onCreate: (products: string[], locations: string[]) => void
}

export function BulkCreateDrawer({ open, onClose, onCreate }: BulkCreateDrawerProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  // Calculate preview count
  const previewCount = selectedProducts.length * selectedLocations.length

  // Reset state on close
  const handleClose = useCallback(() => {
    setSelectedProducts([])
    setSelectedLocations([])
    onClose()
  }, [onClose])

  // Handle create
  const handleCreate = useCallback(() => {
    if (previewCount > 0) {
      onCreate(selectedProducts, selectedLocations)
    }
  }, [selectedProducts, selectedLocations, previewCount, onCreate])

  // Toggle product selection
  const handleProductToggle = useCallback((product: string, checked: boolean) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, product] : prev.filter((p) => p !== product)
    )
  }, [])

  // Toggle location selection
  const handleLocationToggle = useCallback((location: string, checked: boolean) => {
    setSelectedLocations((prev) =>
      checked ? [...prev, location] : prev.filter((l) => l !== location)
    )
  }, [])

  // Select all products
  const handleSelectAllProducts = useCallback((checked: boolean) => {
    setSelectedProducts(checked ? PRODUCT_OPTIONS.map((p) => p.name) : [])
  }, [])

  // Select all locations
  const handleSelectAllLocations = useCallback((checked: boolean) => {
    setSelectedLocations(checked ? LOCATION_OPTIONS.map((l) => l.name) : [])
  }, [])

  // Check if all are selected
  const allProductsSelected = selectedProducts.length === PRODUCT_OPTIONS.length
  const allLocationsSelected = selectedLocations.length === LOCATION_OPTIONS.length

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title='Bulk Create Details'
      placement='right'
      width={500}
      footer={
        <Horizontal justifyContent='space-between' alignItems='center'>
          <Texto category='p1' weight='500'>
            {previewCount > 0
              ? `${previewCount} detail${previewCount !== 1 ? 's' : ''} will be created`
              : 'Select products and locations'}
          </Texto>
          <Horizontal gap={8}>
            <GraviButton buttonText='Cancel' onClick={handleClose} />
            <GraviButton
              buttonText='Create Details'
              theme1
              icon={<AppstoreAddOutlined />}
              onClick={handleCreate}
              disabled={previewCount === 0}
            />
          </Horizontal>
        </Horizontal>
      }
    >
      <Vertical gap={24}>
        {/* Products Selection */}
        <Vertical>
          <Horizontal justifyContent='space-between' alignItems='center' className='mb-2'>
            <Texto
              category='h5'
              appearance='medium'
              weight='600'
              style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Products
            </Texto>
            <Checkbox
              checked={allProductsSelected}
              indeterminate={selectedProducts.length > 0 && !allProductsSelected}
              onChange={(e) => handleSelectAllProducts(e.target.checked)}
            >
              Select All
            </Checkbox>
          </Horizontal>

          <Vertical className={styles.checkboxList}>
            {PRODUCT_OPTIONS.map((product) => (
              <Horizontal key={product.id} className={styles.checkboxItem}>
                <Checkbox
                  checked={selectedProducts.includes(product.name)}
                  onChange={(e) => handleProductToggle(product.name, e.target.checked)}
                >
                  <Texto category='p1'>{product.name}</Texto>
                </Checkbox>
                <Texto category='p2' appearance='medium'>
                  {product.group}
                </Texto>
              </Horizontal>
            ))}
          </Vertical>
        </Vertical>

        {/* Locations Selection */}
        <Vertical>
          <Horizontal justifyContent='space-between' alignItems='center' className='mb-2'>
            <Texto
              category='h5'
              appearance='medium'
              weight='600'
              style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Locations
            </Texto>
            <Checkbox
              checked={allLocationsSelected}
              indeterminate={selectedLocations.length > 0 && !allLocationsSelected}
              onChange={(e) => handleSelectAllLocations(e.target.checked)}
            >
              Select All
            </Checkbox>
          </Horizontal>

          <Vertical className={styles.checkboxList}>
            {LOCATION_OPTIONS.map((location) => (
              <Horizontal key={location.id} className={styles.checkboxItem}>
                <Checkbox
                  checked={selectedLocations.includes(location.name)}
                  onChange={(e) => handleLocationToggle(location.name, e.target.checked)}
                >
                  <Texto category='p1'>{location.name}</Texto>
                </Checkbox>
                <Texto category='p2' appearance='medium'>
                  {location.region}
                </Texto>
              </Horizontal>
            ))}
          </Vertical>
        </Vertical>

        {/* Preview */}
        {previewCount > 0 && (
          <Vertical className={styles.preview}>
            <Texto category='p2' appearance='medium' weight='500' className='mb-1'>
              Preview
            </Texto>
            <Texto category='p2' appearance='medium'>
              Creating {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} ×{' '}
              {selectedLocations.length} location{selectedLocations.length !== 1 ? 's' : ''} ={' '}
              <Texto category='p2' weight='600'>
                {previewCount} detail row{previewCount !== 1 ? 's' : ''}
              </Texto>
            </Texto>
          </Vertical>
        )}
      </Vertical>
    </Drawer>
  )
}
