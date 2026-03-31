import { CloseOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Tag } from 'antd'

export function DrawerTitle({ handleClose }: { handleClose: () => void }) {
  return (
    <Horizontal>
      <Vertical>
        <Horizontal className={'gap-10 mb-2'}>
          <Texto appearance={'white'} category={'h5'}>Create Index Offer</Texto>
          <Tag color='blue'>Formula</Tag>
        </Horizontal>
        <Texto appearance={'white'} weight={'normal'}>
          Configure your index-based pricing offer with contract price formula
        </Texto>
      </Vertical>
      <GraviButton
        className={'ghost-gravi-button'}
        icon={
          <Texto appearance={'white'}>
            <CloseOutlined style={{ color: 'inherit' }} />
          </Texto>
        }
        onClick={handleClose}
      />
    </Horizontal>
  )
}
