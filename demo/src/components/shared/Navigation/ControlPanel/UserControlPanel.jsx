import './alerts.css'

import React, { useState } from 'react'

import { ControlPanel } from './ControlPanel'
import { UserSummary } from './UserSummary'

export function UserControlPanel() {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }

  return (
    <>
      <div onClick={showDrawer} style={{ minWidth: 180 }} className='flex px-3 items-center control-panel-trigger'>
        <UserSummary />
      </div>
      <ControlPanel onClose={onClose} visible={visible} />
    </>
  )
}
