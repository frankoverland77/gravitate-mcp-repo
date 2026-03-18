import { ArrowLeftOutlined } from '@ant-design/icons';
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Drawer, Form, message } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import { OFFER_TEMPLATES, PRODUCT_LOCATIONS, STEPS, getNextOfferId } from '../ManageOffers.data';
import type { OfferGridRow } from '../ManageOffers.types';

import { PreviewPanel } from './PreviewPanel';
import { SelectCustomers } from './SelectCustomers';
import { SelectDealType } from './SelectDealType';
import { SelectProductAndLocation } from './SelectProductAndLocation';
import { SelectTimingWindows } from './SelectTimingWindows';
import { StepIndicator } from './StepIndicator';
import { WizardFooter } from './WizardFooter';

interface CreateNewOfferDrawerProps {
  open: boolean;
  onClose: () => void;
  onOfferCreated: (offer: OfferGridRow) => void;
}

export function CreateNewOfferDrawer({ open, onClose, onOfferCreated }: CreateNewOfferDrawerProps) {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>('auction');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | undefined>(1);
  const [finished, setFinished] = useState(false);

  const clearAndClose = () => {
    form.resetFields();
    setCurrentStep(0);
    setSelectedCategory('auction');
    setSelectedTemplateId(1);
    setFinished(false);
    onClose();
  };

  const templates = useMemo(() => {
    if (!selectedCategory) return [];
    return OFFER_TEMPLATES.filter((t) => t.CategoryType === selectedCategory);
  }, [selectedCategory]);

  const currentTemplate = useMemo(
    () => OFFER_TEMPLATES.find((t) => t.SpecialOfferTemplateId === selectedTemplateId),
    [selectedTemplateId],
  );

  const isIndexPricing = currentTemplate?.PricingMechanismMeaning === 'Index';
  const isAuction = selectedCategory === 'auction';

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    const templatesForCategory = OFFER_TEMPLATES.filter((t) => t.CategoryType === category);
    if (templatesForCategory.length > 0) {
      handleSelectTemplate(templatesForCategory[0].SpecialOfferTemplateId);
    }
  };

  const handleSelectTemplate = (id: number) => {
    const template = OFFER_TEMPLATES.find((t) => t.SpecialOfferTemplateId === id);
    if (template) {
      setSelectedTemplateId(id);
      form.setFieldsValue({
        MinimumVolumePerOrder: template.DefaultMinimumVolumePerOrder,
        MaximumVolumePerOrder: template.DefaultMaximumVolumePerOrder,
        VolumeIncrement: template.DefaultVolumeIncrement,
      });
    }
  };

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === STEPS.length - 1) {
      // Final step - create the offer
      const values = form.getFieldsValue();
      const product = PRODUCT_LOCATIONS.find((p) => p.TradeEntrySetupId === values.ProductLocation);
      const template = OFFER_TEMPLATES.find((t) => t.SpecialOfferTemplateId === selectedTemplateId);

      const newOffer: OfferGridRow = {
        SpecialOfferId: getNextOfferId(),
        OfferName: `${product?.ProductName || 'Unknown'} ${product?.LocationName || ''} ${template?.Name || ''}`,
        OfferType: template?.Name || '',
        PricingMechanism: template?.PricingMechanismMeaning || 'Fixed',
        ProductName: product?.ProductName || '',
        LocationName: product?.LocationName || '',
        TotalVolume: values.TotalVolume || 0,
        FixedPrice: isIndexPricing ? null : values.ReservePrice || null,
        Status: 'Active',
        VisibilityStart: values.VisibilityWindowStartDate
          ? dayjs(values.VisibilityWindowStartDate).format('YYYY-MM-DD HH:mm')
          : '',
        VisibilityEnd: values.VisibilityWindowEndDate
          ? dayjs(values.VisibilityWindowEndDate).format('YYYY-MM-DD HH:mm')
          : '',
        PickupStart: values.PickupWindowStartDate
          ? dayjs(values.PickupWindowStartDate).format('YYYY-MM-DD HH:mm')
          : '',
        PickupEnd: values.PickupWindowEndDate
          ? dayjs(values.PickupWindowEndDate).format('YYYY-MM-DD HH:mm')
          : '',
        CustomerCount: values.CounterPartyIds?.length || 0,
        CreatedDate: dayjs().format('YYYY-MM-DD'),
      };

      onOfferCreated(newOffer);
      message.success('Offer created successfully!');
      clearAndClose();
      return;
    }

    // Validate current step fields before proceeding
    const fieldsToValidate = getFieldsForStep(currentStep);
    form
      .validateFields(fieldsToValidate)
      .then(() => {
        setCurrentStep((s) => s + 1);
      })
      .catch(() => {
        // Validation errors shown by form
      });
  }, [currentStep, form, selectedTemplateId, isIndexPricing]);

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['ProductLocation', 'TotalVolume', 'MinimumVolumePerOrder', 'MaximumVolumePerOrder', 'VolumeIncrement', 'ReservePrice'];
      case 2:
        return [
          'InviteTriggerDate', 'InviteTriggerTime',
          'VisibilityWindowStartDate', 'VisibilityWindowStartTime', 'VisibilityWindowEndDate', 'VisibilityWindowEndTime',
          'PickupWindowStartDate', 'PickupWindowStartTime', 'PickupWindowEndDate', 'PickupWindowEndTime',
        ];
      case 3:
        return ['CounterPartyIds'];
      default:
        return [];
    }
  };

  return (
    <Drawer
      width="100%"
      height="100%"
      open={open}
      onClose={clearAndClose}
      title="Create New Offer"
      styles={{ body: { backgroundColor: 'var(--bg-2)' } }}
      placement="bottom"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Vertical gap={24} style={{ maxWidth: '1216px', margin: '0 auto', height: '100%' }}>
          <GraviButton
            className="ghost-gravi-button p-0"
            style={{ alignSelf: 'flex-start' }}
            buttonText={
              <Horizontal gap={10} verticalCenter className="p-0">
                <ArrowLeftOutlined />
                <Texto className="text-14 ml-2" weight="normal">
                  Back to Offers
                </Texto>
              </Horizontal>
            }
            onClick={clearAndClose}
          />

          <Horizontal gap={20} style={{ maxWidth: '1216px', minWidth: '1216px', margin: '0 auto', height: '100%' }}>
            <Vertical gap={20} flex="2" style={{ minWidth: '802px', maxWidth: '802px' }}>
              <Vertical className="bg-1 border-radius-10 bordered pb-4">
                <Vertical className="p-4" style={{ maxHeight: 'fit-content' }}>
                  <Texto category="h3" className="text-24">
                    Create New Offer
                  </Texto>
                  <Texto className="text-14">Complete all steps to create your offer</Texto>
                </Vertical>
                <StepIndicator currentStep={currentStep} steps={STEPS} />
                {currentStep === 0 && (
                  <SelectDealType
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    selectedTemplateId={selectedTemplateId}
                    onSelectTemplate={handleSelectTemplate}
                    templates={templates}
                  />
                )}
                <SelectProductAndLocation
                  currentStep={currentStep}
                  form={form}
                  isIndexPricing={isIndexPricing}
                  isAuction={isAuction}
                  currentTemplate={currentTemplate}
                />
                <SelectTimingWindows currentStep={currentStep} form={form} />
                <SelectCustomers currentStep={currentStep} form={form} />
              </Vertical>
              <WizardFooter
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                onNext={handleNext}
                finished={finished}
                setFinished={setFinished}
              />
            </Vertical>

            <Vertical flex="1" className="bg-1 border-radius-10 bordered p-4" style={{ maxWidth: '390px' }}>
              <Horizontal horizontalCenter>
                <PreviewPanel
                  selectedTemplateId={selectedTemplateId}
                  form={form}
                  isIndexPricing={isIndexPricing}
                  isAuction={isAuction}
                />
              </Horizontal>
            </Vertical>
          </Horizontal>
        </Vertical>
      </Form>
    </Drawer>
  );
}
