/**
 * Modal Component Examples Database
 *
 * This file contains high-quality Modal component examples extracted from production codebase.
 * Examples are categorized by complexity and usage patterns to help generate appropriate code.
 *
 * Source: Gravitate.Dotnet.Next/frontend production codebase
 * Component: Ant Design Modal
 */

export interface ModalExample {
  id?: string;
  name: string;
  description: string;
  complexity: "simple" | "medium" | "complex";
  category?: string;
  tags: string[];
  code: string;
  props?: Record<string, any>;
  dependencies?: string[];
  notes?: string;
  sourceFile?: string;
}

export const ModalExamples: ModalExample[] = [
  // SIMPLE EXAMPLES
  {
    name: "Basic Confirmation Modal",
    description:
      "Simple confirmation dialog with custom title and footer buttons",
    complexity: "simple",
    category: "interactive",
    tags: ["confirmation", "basic", "buttons", "excalibrr"],
    code: `<Modal
  visible={isVisible}
  onCancel={onCancel}
  title={
    <Horizontal alignItems='center'>
      <ExclamationCircleOutlined className='mr-2' style={{ color: 'var(--theme-error)' }} />
      <Texto category='h6'>Confirm Revaluation</Texto>
    </Horizontal>
  }
  footer={
    <Horizontal justifyContent='flex-end' style={{ gap: 10 }}>
      <GraviButton buttonText='Cancel' onClick={onCancel} />
      <GraviButton buttonText='Confirm Revaluation' theme1 onClick={() => onConfirm()} />
    </Horizontal>
  }
>
  <Vertical style={{ fontSize: '12px' }}>
    <Texto category='h6' className='mb-2'>
      Are you sure you want to revalue the selected contract detail(s)?
    </Texto>
    <Horizontal style={{ gap: 10 }}>
      <Texto category='p2'>Start date: </Texto>
      <Texto category='p2'>{moment(startDate).format(dateFormat.SHORT_DATE_YEAR_TIME)}</Texto>
    </Horizontal>
    <Texto category='p2'>This action cannot be undone.</Texto>
  </Vertical>
</Modal>`,
  },

  {
    name: "Basic Form Modal",
    description: "Simple modal with form and default OK/Cancel buttons",
    complexity: "simple",
    category: "forms",
    tags: ["form", "basic", "input", "submit"],
    code: `<Modal visible={visible} onCancel={onCancel} onOk={form.submit} okText='Submit'>
  <Form form={form} layout='vertical' onFinish={onCreateProxy}>
    <Vertical style={{ gap: '1rem' }}>
      <Form.Item label='Configuration Name' name='ConfigurationName' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label='Default Cost Source' name='DefaultCostSourceMarkerId'>
        <Select allowClear showSearch optionFilterProp='children'>
          {metadata?.CostSources?.filter((cst) => cst.IsMarker).map((option) => (
            <Select.Option key={option.Value} value={option.Value}>
              <FunctionOutlined /> {option.Text}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Vertical>
  </Form>
</Modal>`,
  },

  {
    name: "Basic Save Modal",
    description: "Simple modal for save operations with custom styling",
    complexity: "simple",
    category: "interactive",
    tags: ["save", "basic", "minimal", "custom-styling"],
    code: `<Modal
  visible={isDraftModalVisible}
  title={<Texto category='p1'>{saveAsModalTitle}</Texto>}
  destroyOnClose
  style={{ minWidth: '20vw' }}
  className='save-as-modal'
  footer={null}
  onCancel={() => setDraftModalVisible(false)}
>
  <SaveAsModal 
    header={header} 
    saveContract={saveContract} 
    setDraftModalVisible={setDraftModalVisible} 
  />
</Modal>`,
  },

  // INTERMEDIATE COMPLEXITY EXAMPLES
  {
    name: "Full-Screen Grid Modal",
    description: "Full-screen modal containing a data grid with custom styling",
    complexity: "medium",
    category: "data",
    tags: ["fullscreen", "grid", "data", "custom-styling", "widget"],
    code: `<Modal
  visible={isModalOpen}
  onCancel={closeModal}
  title={null}
  footer={null}
  bodyStyle={{ height: '95vh', padding: '0px' }}
  width='95vw'
  centered
>
  <div style={{ width: '100%', height: '100%' }}>
    <WidgetContainer
      title={widget.title as WidgetTitle}
      columnDefs={widget.columnDefs}
      gridDataWithStatus={widget.data}
      isLoading={widget.isLoading}
      gridSettings={widget.settings}
      setGridSettings={widget.setSettings}
      storageKey={widget.storageKey}
      gridApiRef={widget.gridApiRef}
      columnHeadersByColumnId={widget.columnHeadersByColumnId}
      alertsOnly={alertsOnly}
    />
  </div>
</Modal>`,
  },

  {
    name: "Settings Modal with Form Validation",
    description:
      "Modal with form validation, API integration, and custom footer",
    complexity: "medium",
    category: "forms",
    tags: ["settings", "form", "validation", "api", "custom-footer"],
    code: `<Modal
  title='Command Center Page Settings'
  visible={isModalOpen}
  onCancel={onClose}
  footer={
    <PageSettingsModalFooter
      onCancel={onClose}
      onSave={() => {
        form.submit()
      }}
    />
  }
>
  <Form form={form} layout='vertical' onFinish={onFinish}>
    <Vertical className='p-4'>
      <Vertical verticalCenter className='mb-4'>
        <Texto category='h6'>Location Hierarchy</Texto>
        <Form.Item name='LocationHierarchy'>
          <Select options={locationHeirarchyList} className='w-full' />
        </Form.Item>
      </Vertical>
      <Vertical className='p-4 bordered bg-2 mt-4'>
        <Horizontal verticalCenter className='mb-2'>
          <InfoCircleOutlined />
          <Texto category='h6' className='ml-2'>Important Note</Texto>
        </Horizontal>
        <Texto category='p2'>
          Changing these hierarchies will affect how data is aggregated.
        </Texto>
      </Vertical>
    </Vertical>
  </Form>
</Modal>`,
  },

  {
    name: "Data Grid Modal with Loading States",
    description:
      "Modal containing data grid with loading states and dynamic content",
    complexity: "medium",
    category: "data",
    tags: ["data-grid", "loading", "dynamic", "api-integration"],
    code: `<Modal
  visible={visible}
  title={\`Price Conflicts (\${conflictIds.length})\`}
  footer={[
    <GraviButton 
      key='close' 
      icon={<CloseOutlined />} 
      buttonText='Close' 
      onClick={handleClose} 
    />
  ]}
  onCancel={handleClose}
  destroyOnClose
  width='80vw'
  bodyStyle={{ height: '60vh' }}
>
  <GraviGrid
    columnDefs={columnDefs as any}
    rowData={conflictData}
    loading={loading}
    controlBarProps={controlBarProps}
    agPropOverrides={agPropOverrides}
  />
</Modal>`,
  },

  // ADVANCED COMPLEXITY EXAMPLES
  {
    name: "Multi-Step Wizard Modal",
    description:
      "Complex wizard modal with multiple steps, form handling, and custom navigation",
    complexity: "complex",
    category: "forms",
    tags: ["wizard", "multi-step", "form", "navigation", "api-calls"],
    code: `<Modal
  visible={isModalOpen}
  title={<ModalTitle />}
  destroyOnClose={true}
  onCancel={onClose}
  className='manual-revaluation-modal'
  width='65vw'
  footer={
    <ManualRevaluationFooter
      totalSteps={revaluationSteps?.length}
      activeStepIndex={activeStepIndex}
      onBack={onBack}
      onNext={onNext}
      onClose={onClose}
    />
  }
>
  <div className={'content-container'}>
    <RevaluationStepHeader
      activeStepIndex={activeStepIndex}
      step={currentStep}
      totalSteps={revaluationSteps?.length}
    />
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <StepContent
        metadata={metadata}
        form={form}
        selectedPriceInstruments={selectedPriceInstruments}
        setSelectedPriceInstruments={setSelectedPriceInstruments}
        setSelectedContractDetails={setSelectedContractDetails}
        selectedContractDetails={selectedContractDetails}
        setActiveStepIndex={setActiveStepIndex}
        revaluationResults={revaluationResults}
        selectedDates={selectedDates}
        isLoadingResults={isLoadingResults}
        onClose={onClose}
      />
    </Form>
  </div>
</Modal>`,
  },

  {
    name: "Trading Modal with Timer Integration",
    description:
      "Advanced trading modal with timer, conditional rendering, and complex state management",
    complexity: "complex",
    category: "interactive",
    tags: ["trading", "timer", "conditional", "state-management", "audio"],
    code: `<Modal
  className='forwards-modal-container'
  visible={isModalVisible}
  centered
  destroyOnClose
  footer={
    isPriceExpired ? null : (
      <OrderFooter
        error={error}
        setIsModalVisible={setIsModalVisible}
        setOrderEntryStep={setOrderEntryStep}
        orderEntryStep={orderEntryStep}
        form={form}
        pendingChanges={pendingChanges}
        disableSubmit={disableSubmit}
      />
    )
  }
  closable={false}
  title={
    <OrderExpirationModal
      isPriceExpired={isPriceExpired}
      tradeTimer={tradeTimer}
      handleRefresh={handleRefresh}
      orderEntryInfo={orderEntryInfo}
    />
  }
  style={{ minWidth: 1100 }}
>
  <ModalContents
    orderEntryStep={orderEntryStep}
    setOrderEntryStep={setOrderEntryStep}
    error={error}
    setError={setError}
    form={form}
    setPendingChanges={setPendingChanges}
    setDisableSubmit={setDisableSubmit}
    handleRefresh={handleRefresh}
    setIsModalVisible={setIsModalVisible}
    setShowConfetti={setShowConfetti}
    messageApi={messageApi}
  />
</Modal>`,
  },

  {
    name: "Dynamic Configuration Modal",
    description:
      "Modal with dynamic component rendering using spread props and configuration objects",
    complexity: "complex",
    category: "ui",
    tags: ["dynamic", "configuration", "spread-props", "component-map"],
    code: `export function EntityActionModal({
  primaryKey,
  currentItemId,
  selectedEntityAction,
  isInfoModalOpen,
  setIsInfoModalOpen,
  dataQuery,
}) {
  const actionComponents = useMemo(() => {
    return {
      RollBackExtract: {
        component: (
          <RollBackExtract
            currentItemId={currentItemId}
            setIsInfoModalOpen={setIsInfoModalOpen}
            dataQuery={dataQuery}
          />
        ),
        config: {
          title: <Texto>{selectedEntityAction}</Texto>,
          destroyOnClose: true,
          visible: isInfoModalOpen,
          style: { minWidth: '30vw' },
          footer: null,
          onCancel: () => setIsInfoModalOpen(false),
        },
      },
      OnlineOrdersViewDetails: {
        component: (
          <ViewOnlineOrderDetails
            setIsInfoModalOpen={setIsInfoModalOpen}
            primaryKey={primaryKey}
            currentItemId={currentItemId}
            dataQuery={dataQuery}
            refetchData={dataQuery.refetch}
            isAdmin={false}
          />
        ),
        config: {
          title: <Texto>View Details</Texto>,
          destroyOnClose: true,
          className: 'no-ant-modal-body-padding',
          visible: isInfoModalOpen,
          style: { minWidth: '50vw' },
          footer: null,
          onCancel: () => setIsInfoModalOpen(false),
        },
      },
    }
  }, [isInfoModalOpen])

  const selectedComponentConfig = () => {
    return actionComponents[selectedEntityAction]?.config
  }

  const SelectedComponent = () => {
    return actionComponents[selectedEntityAction].component
  }

  return (
    <Modal {...selectedComponentConfig()}>
      <SelectedComponent />
    </Modal>
  )
}`,
  },

  {
    name: "Input Focus Management Modal",
    description:
      "Modal with advanced input focus management, async operations, and validation",
    complexity: "complex",
    category: "forms",
    tags: [
      "focus-management",
      "async",
      "validation",
      "input-number",
      "precision",
    ],
    code: `<Modal
  className='spread-override-modal'
  visible={isSpreadOverrideModalOpen}
  title={<Texto category='h6'>Override Spread Differential</Texto>}
  destroyOnClose
  width={400}
  centered
  cancelButtonProps={{ disabled: saveSpreadOverrides?.isLoading, tabIndex: 1 }}
  onCancel={() => {
    setIsSpreadOverrideModalOpen(false)
  }}
  okButtonProps={{
    disabled: !overrideValue,
    loading: saveSpreadOverrides?.isLoading,
    tabIndex: 0,
  }}
  okText='Apply Override'
  onOk={() => {
    applyOverride().then(() => {
      handleAdjustmentUpdate()
    })
  }}
>
  <Vertical>
    <Texto className='mb-2' category='h5'>Product:</Texto>
    <Texto className='mb-4' category='p2'>{selectedSpreadOverrideRow?.ProductName}</Texto>
    <Texto>Override Differential for Current Period</Texto>
    <InputNumber
      className='w-full mt-1'
      autoFocus
      defaultValue={defaultValue ?? 0}
      step='0.0001'
      prefix='$'
      precision={fmt.currentPrecision}
      onChange={(value) => setOverrideValue(value)}
      ref={inputRef}
    />
    <Texto className='mt-2' category='p2'>
      <span style={{ fontWeight: 'bolder' }}>Important: </span>
      This override will only apply to the current pricing period.
    </Texto>
  </Vertical>
</Modal>`,
  },
];

export default ModalExamples;
