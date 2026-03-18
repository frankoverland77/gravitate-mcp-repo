import { CheckOutlined } from '@ant-design/icons';
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Fragment } from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <Vertical style={{ maxHeight: 'fit-content', width: '100%' }} className="border-bottom border-top p-0">
      <Horizontal className="px-2 py-4">
        {steps.map((step, index) => {
          const showActiveColor = currentStep >= index;
          const showCheck = currentStep > index;
          return (
            <Fragment key={step}>
              <Horizontal verticalCenter style={{ width: '100%' }}>
                <Vertical verticalCenter horizontalCenter>
                  <div className={`step-circle ${showActiveColor ? 'active' : 'inactive'}`}>
                    {showCheck ? (
                      <Texto appearance={showActiveColor ? 'white' : 'default'}>
                        <CheckOutlined style={{ color: 'inherit' }} />
                      </Texto>
                    ) : (
                      <Texto appearance={showActiveColor ? 'white' : 'default'}>{index + 1}</Texto>
                    )}
                  </div>
                  <Texto
                    style={{ color: showActiveColor ? 'var(--theme-color-1)' : 'var(--gray-600)' }}
                    className="mt-2"
                  >
                    {step}
                  </Texto>
                </Vertical>
              </Horizontal>
              {index < steps.length - 1 && (
                <Horizontal verticalCenter style={{ width: '100%' }}>
                  <div style={{ height: '2px', backgroundColor: 'var(--bg-3)', width: '100%', marginBottom: '10px' }} />
                </Horizontal>
              )}
            </Fragment>
          );
        })}
      </Horizontal>
    </Vertical>
  );
}
