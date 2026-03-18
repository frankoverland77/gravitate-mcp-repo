import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';

import { STEPS } from '../ManageOffers.data';

interface WizardFooterProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onNext: () => void;
  finished: boolean;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
}

export function WizardFooter({ currentStep, setCurrentStep, onNext, finished, setFinished }: WizardFooterProps) {
  const goBack = () => setCurrentStep((c) => c - 1);

  return (
    <Vertical style={{ minHeight: '75px' }} verticalCenter className="bg-1 border-radius-10 bordered">
      <Horizontal verticalCenter className="p-4" justifyContent="space-between">
        <GraviButton
          disabled={currentStep === 0 || finished}
          className="border-radius-5"
          onClick={goBack}
          appearance="outlined"
          buttonText={
            <Horizontal gap={10} verticalCenter>
              <ArrowLeftOutlined />
              <Texto style={{ color: 'inherit' }}>Previous</Texto>
            </Horizontal>
          }
        />
        <div className="gap-10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Texto>
            Step {currentStep + 1} of {STEPS.length}
          </Texto>
          <GraviButton
            loading={finished}
            theme1
            className="border-radius-5"
            buttonText={
              currentStep === STEPS.length - 1 ? (
                'Finish'
              ) : (
                <Horizontal gap={5} verticalCenter>
                  <Texto style={{ color: 'inherit' }}>Next</Texto>
                  <ArrowRightOutlined />
                </Horizontal>
              )
            }
            onClick={() => {
              if (currentStep === STEPS.length - 1) {
                setFinished(true);
              }
              onNext();
            }}
          />
        </div>
      </Horizontal>
    </Vertical>
  );
}
