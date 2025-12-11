/**
 * TEST FILE: Anti-patterns that should be caught by validation
 * 
 * This file intentionally contains code violations to test the validation rules.
 * Run `validate_code` against this file - it should catch ALL of these issues.
 */

import { useState } from 'react'
import { Vertical, Horizontal, Texto, GraviButton, GraviGrid } from '@gravitate/gravitate-uikit'
import { Modal, Drawer, Form, Input } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

// ============================================================
// EXPECTED ERRORS (severity: error)
// ============================================================

export function TestComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      {/* ERROR: use-flex-prop-not-style
          Should use: <Vertical flex="1"> */}
      <Vertical style={{ flex: 1 }}>
        <Texto>Content</Texto>
      </Vertical>

      {/* ERROR: use-flex-prop-not-style (Horizontal variant) */}
      <Horizontal style={{ flex: '1 0 auto' }}>
        <Texto>Content</Texto>
      </Horizontal>

      {/* ERROR: modal-drawer-visible-not-open (Modal)
          Should use: <Modal visible={isModalOpen}> */}
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <Texto>Modal content</Texto>
      </Modal>

      {/* ERROR: modal-drawer-visible-not-open (Drawer)
          Should use: <Drawer visible={isDrawerOpen}> */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Texto>Drawer content</Texto>
      </Drawer>

      {/* ERROR: no-horizontal-gap-prop
          Should use: style={{ gap: '12px' }} or className="gap-12" */}
      <Horizontal gap={12}>
        <GraviButton buttonText="One" />
        <GraviButton buttonText="Two" />
      </Horizontal>
    </>
  )
}

// ============================================================
// EXPECTED WARNINGS (severity: warning)
// ============================================================

export function WarningTestComponent() {
  return (
    <>
      {/* WARNING: use-gap-utility-class
          Should use: className="gap-12" */}
      <Horizontal style={{ gap: '12px' }}>
        <GraviButton buttonText="One" />
        <GraviButton buttonText="Two" />
      </Horizontal>

      {/* WARNING: use-gap-utility-class (Vertical variant) */}
      <Vertical style={{ gap: '8px' }}>
        <Texto>Item 1</Texto>
        <Texto>Item 2</Texto>
      </Vertical>

      {/* WARNING: prefer-component-props-for-alignment
          Should use: <Horizontal justifyContent="space-between"> */}
      <Horizontal style={{ justifyContent: 'space-between' }}>
        <Texto>Left</Texto>
        <Texto>Right</Texto>
      </Horizontal>

      {/* WARNING: prefer-component-props-for-alignment (alignItems) */}
      <Vertical style={{ alignItems: 'center' }}>
        <Texto>Centered</Texto>
      </Vertical>

      {/* WARNING: gravigrid-agpropoverrides
          Should include: agPropOverrides={{}} */}
      <GraviGrid
        columnDefs={[]}
        rowData={[]}
      />
    </>
  )
}

// ============================================================
// CORRECT PATTERNS (should NOT trigger any issues)
// ============================================================

export function CorrectComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      {/* CORRECT: Using flex prop */}
      <Vertical flex="1">
        <Texto category="h4">Content</Texto>
      </Vertical>

      {/* CORRECT: Using height prop */}
      <Vertical height="100%">
        <Texto category="p1">Full height content</Texto>
      </Vertical>

      {/* CORRECT: Using visible prop on Modal */}
      <Modal visible={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <Texto category="p1">Modal content</Texto>
      </Modal>

      {/* CORRECT: Using visible prop on Drawer */}
      <Drawer visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Texto category="p1">Drawer content</Texto>
      </Drawer>

      {/* CORRECT: Using className for gap */}
      <Horizontal className="gap-12">
        <GraviButton buttonText="One" />
        <GraviButton buttonText="Two" />
      </Horizontal>

      {/* CORRECT: Using component props for alignment */}
      <Horizontal justifyContent="space-between" alignItems="center">
        <Texto category="h4">Left</Texto>
        <Texto category="p1">Right</Texto>
      </Horizontal>

      {/* CORRECT: GraviGrid with agPropOverrides */}
      <GraviGrid
        columnDefs={[]}
        rowData={[]}
        agPropOverrides={{}}
      />
    </>
  )
}

// ============================================================
// FALSE POSITIVE TEST (should NOT trigger)
// These contain HTML-like strings but are NOT actual HTML elements
// ============================================================

export function FalsePositiveTest() {
  const description = `Are you sure you want to delete this <span>item</span>?`
  const htmlExample = "Use <p> tags for paragraphs"
  const templateMessage = `The <h1> element is for headings`

  return (
    <Vertical>
      <Texto category="p1">{description}</Texto>
      <Texto category="p2" appearance="medium">{htmlExample}</Texto>
    </Vertical>
  )
}
