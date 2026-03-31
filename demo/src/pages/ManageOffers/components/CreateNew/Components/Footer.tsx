import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { steps } from '../../../utils/Constants/FormConstants'
import type { FormInstance } from 'antd'

interface FooterProps {
  finished: boolean
  setFinished: React.Dispatch<React.SetStateAction<boolean>>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  validateFormAndNavigate: () => void
  form: FormInstance
}

export function Footer({
  finished,
  setFinished,
  currentStep,
  setCurrentStep,
  validateFormAndNavigate,
  form,
}: FooterProps) {
  const goBack = () => setCurrentStep((current) => current - 1)

  return (
    <Vertical style={{ minHeight: '75px' }} verticalCenter className={'bg-1 border-radius-10 bordered'}>
      <Horizontal verticalCenter className={'p-4'} justifyContent='space-between'>
        <GraviButton
          disabled={currentStep === 0 || finished}
          className={'border-radius-5'}
          onClick={() => goBack()}
          appearance='outlined'
          buttonText={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ArrowLeftOutlined />
              <Texto style={{ color: 'inherit' }}>Previous</Texto>
            </div>
          }
        />
        <div className='gap-10' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Texto>
            Step {currentStep + 1} of {steps.length}
          </Texto>
          <GraviButton
            loading={finished}
            theme1
            className={'border-radius-5'}
            buttonText={
              currentStep === steps.length - 1 ? (
                'Finish'
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Texto style={{ color: 'inherit' }}>Next</Texto>
                  <ArrowRightOutlined />
                </div>
              )
            }
            onClick={() => {
              if (currentStep === steps.length - 1) {
                setFinished(true)
                form.submit()
              } else validateFormAndNavigate()
            }}
          />
        </div>
      </Horizontal>
    </Vertical>
  )
}
