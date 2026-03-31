import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import type { FormInstance } from 'antd'

export function DrawerFooter({ handleClose, form }: { handleClose: () => void; form: FormInstance }) {
  return (
    <Horizontal className={'gap-10'} justifyContent={'flex-end'} verticalCenter>
      <GraviButton buttonText={'Cancel'} onClick={handleClose} />
      <GraviButton buttonText={'Save'} onClick={() => form.submit()} theme1 />
    </Horizontal>
  )
}
