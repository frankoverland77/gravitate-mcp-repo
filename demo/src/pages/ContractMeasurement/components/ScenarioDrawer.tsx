import { useState, useEffect } from 'react';
import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { CloseOutlined, DollarCircleOutlined, AreaChartOutlined } from '@ant-design/icons';
import { Drawer, Input, Select, Button, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
import type {
  Scenario,
  ScenarioFormData,
  ProductSelection,
  EntryMethod,
  ScenarioFormulaComponent,
  SelectedBenchmark,
} from '../types/scenario.types';
import { PRODUCT_OPTIONS, COUNTERPARTY_OPTIONS } from '../types/scenario.types';
import { BenchmarkSelector } from './benchmark';
import { FormulaComponentsGrid } from '../../OnlineSellingPlatform/components/FormulaComponentsGrid';
import type { FormulaComponent } from '../../OnlineSellingPlatform/IndexOfferManagement.types';
import {
  PLACEHOLDER_VALUES,
  buildAutoFormulaPreview,
  buildFormulaPreview,
  FormulaTemplate,
  TemplateComponent,
} from '../../demos/grids/FormulaTemplates.data';
import { TemplateChooser } from '../../../components/shared/TemplateChooser';
import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext';
import { VolumeTabContent } from './VolumeTabContent';
import { ConfigurationStatus } from './ConfigurationStatus';
import { EntryMethodSelector } from './EntryMethodSelector';
import styles from './ScenarioDrawer.module.css';

interface ScenarioDrawerProps {
  visible: boolean;
  onClose: () => void;
  scenario?: Scenario;
  onSave: (data: ScenarioFormData) => void;
}

export function ScenarioDrawer({ visible, onClose, scenario, onSave }: ScenarioDrawerProps) {
  const isEditMode = !!scenario;
  const navigate = useNavigate();
  const { templates } = useFormulaTemplateContext();

  const [name, setName] = useState('');
  const [counterparty, setCounterparty] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<ProductSelection>('all');
  const [entryMethod, setEntryMethod] = useState<EntryMethod>('benchmark');
  const [activeTab, setActiveTab] = useState<'price' | 'volume'>('price');
  const [formulaComponents, setFormulaComponents] = useState<ScenarioFormulaComponent[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<SelectedBenchmark | undefined>(
    undefined
  );
  const [diffSign, setDiffSign] = useState<'+' | '-'>('+');
  const [diffAmount, setDiffAmount] = useState<number>(0);
  const [showTemplateChooser, setShowTemplateChooser] = useState(false);

  useEffect(() => {
    if (visible) {
      setActiveTab('price');
      setFormulaComponents([]);
      setShowTemplateChooser(false);
      setSelectedBenchmark(undefined);
      setDiffSign('+');
      setDiffAmount(0);
      if (scenario) {
        setName(scenario.name);
        setCounterparty(scenario.counterparty);
        setProducts(scenario.products);
        setEntryMethod(scenario.entryMethod);
      } else {
        setName('');
        setCounterparty(undefined);
        setProducts('all');
        setEntryMethod('benchmark');
      }
    }
  }, [visible, scenario]);

  const handleAddFormulaRow = () => {
    const maxId = Math.max(0, ...formulaComponents.map((c) => c.id));
    const newComponent: ScenarioFormulaComponent = {
      id: maxId + 1,
      percentage: PLACEHOLDER_VALUES.PERCENTAGE,
      source: PLACEHOLDER_VALUES.SOURCE,
      instrument: PLACEHOLDER_VALUES.INSTRUMENT,
      type: PLACEHOLDER_VALUES.TYPE,
      dateRule: PLACEHOLDER_VALUES.DATE_RULE,
      required: false,
    };
    setFormulaComponents([...formulaComponents, newComponent]);
  };

  const handleTemplateSelect = (template: FormulaTemplate) => {
    const maxId = Math.max(0, ...formulaComponents.map((c) => c.id));
    const newComponents: ScenarioFormulaComponent[] = template.components.map(
      (comp: TemplateComponent, index: number) => ({
        id: maxId + index + 1,
        percentage: comp.percentage,
        source: comp.source,
        instrument: comp.instrument,
        type: comp.type,
        dateRule: comp.dateRule,
        required: false,
      })
    );
    setFormulaComponents([...formulaComponents, ...newComponents]);
    setShowTemplateChooser(false);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      counterparty,
      products,
      entryMethod,
      benchmark: selectedBenchmark,
    });
  };
  const noop = () => {
    /* TBD */
  };

  return (
    <Drawer
      placement="bottom"
      height="70%"
      visible={visible}
      onClose={onClose}
      closable={false}
      title={null}
      headerStyle={{ display: 'none' }}
      bodyStyle={{
        backgroundColor: '#f5f5f5',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      zIndex={2000}
      destroyOnClose
    >
      <div className={styles.header}>
        <Horizontal justifyContent="space-between" alignItems="center">
          <Vertical gap="4px">
            <Texto className={styles.headerTitle}>
              {isEditMode ? 'Edit Scenario' : 'Add Scenario'}
            </Texto>
            <Texto className={styles.headerSubtitle}>
              Configure pricing and volume settings for this scenario
            </Texto>
          </Vertical>
          <Button type="text" onClick={onClose} className={styles.closeButton}>
            <CloseOutlined />
          </Button>
        </Horizontal>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'price' | 'volume')}
        className="scenario-drawer-tabs"
        tabBarStyle={{
          margin: 0,
          padding: '0 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e8e8e8',
          flexShrink: 0,
        }}
      >
        <TabPane
          tab={
            <Horizontal className={styles.tabIcon}>
              <DollarCircleOutlined />
              <span>Price</span>
            </Horizontal>
          }
          key="price"
        >
          {showTemplateChooser ? (
            <TemplateChooser
              templates={templates}
              onTemplateSelect={handleTemplateSelect}
              buildFormulaPreview={buildFormulaPreview}
              showManageButton
              title="Formula Template Chooser"
              subtitle="Select a pre-built formula template to quickly apply common pricing calculations to your scenario."
              onManageTemplates={() => navigate('/ContractFormulas/FormulaTemplates')}
              onClose={() => setShowTemplateChooser(false)}
              showExternalName={false}
            />
          ) : (
            <div className={styles.tabContent}>
              <Vertical gap="24px">
                <Vertical gap="16px">
                  <Texto
                    category="p2"
                    weight="600"
                    appearance="medium"
                    className={styles.sectionLabel}
                  >
                    Scenario Settings
                  </Texto>
                  <Vertical gap="8px">
                    <Texto category="p2" appearance="medium">
                      Scenario Name
                    </Texto>
                    <Input
                      placeholder="Enter scenario name..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                    />
                  </Vertical>
                  <Horizontal gap="24px">
                    <Vertical gap="8px" flex={1}>
                      <Texto category="p2" appearance="medium">
                        Counterparty
                      </Texto>
                      <Select
                        placeholder="Select counterparty..."
                        value={counterparty}
                        onChange={setCounterparty}
                        options={COUNTERPARTY_OPTIONS}
                        style={{ width: '100%' }}
                        allowClear
                      />
                    </Vertical>
                    <Vertical gap="8px" flex={1}>
                      <Texto category="p2" appearance="medium">
                        Products
                      </Texto>
                      <Select
                        placeholder="Select products..."
                        value={products}
                        onChange={(val) => setProducts(val as ProductSelection)}
                        options={PRODUCT_OPTIONS}
                        style={{ width: '100%' }}
                      />
                    </Vertical>
                  </Horizontal>
                </Vertical>
                <div className={styles.divider} />
                <Vertical gap="12px">
                  <Texto
                    category="p2"
                    weight="600"
                    appearance="medium"
                    className={styles.sectionLabel}
                  >
                    Entry Method
                  </Texto>
                  <EntryMethodSelector
                    entryMethod={entryMethod}
                    onEntryMethodChange={setEntryMethod}
                  />
                </Vertical>
                <Vertical gap="12px">
                  <Texto
                    category="p2"
                    weight="600"
                    appearance="medium"
                    className={styles.sectionLabel}
                  >
                    {entryMethod === 'benchmark' ? 'Benchmark Selection' : 'Formula Components'}
                  </Texto>
                  {entryMethod === 'benchmark' ? (
                    <BenchmarkSelector
                      selectedBenchmark={selectedBenchmark}
                      onBenchmarkChange={setSelectedBenchmark}
                      diffSign={diffSign}
                      diffAmount={diffAmount}
                      onDiffSignChange={setDiffSign}
                      onDiffAmountChange={(val) => setDiffAmount(val ?? 0)}
                    />
                  ) : (
                    <>
                      {formulaComponents.length > 0 && (
                        <div className={styles.formulaPreview}>
                          <Texto
                            category="p2"
                            appearance="medium"
                            className={styles.formulaPreviewLabel}
                          >
                            Formula Preview:
                          </Texto>
                          <Texto weight="600">{buildAutoFormulaPreview(formulaComponents)}</Texto>
                        </div>
                      )}
                      <FormulaComponentsGrid
                        components={formulaComponents as unknown as FormulaComponent[]}
                        setComponents={
                          setFormulaComponents as unknown as React.Dispatch<
                            React.SetStateAction<FormulaComponent[]>
                          >
                        }
                        onAddRow={handleAddFormulaRow}
                        onOpenTemplateChooser={() => setShowTemplateChooser(true)}
                      />
                    </>
                  )}
                </Vertical>
                <Vertical gap="12px">
                  <Texto
                    category="p2"
                    weight="600"
                    appearance="medium"
                    className={styles.sectionLabel}
                  >
                    Configuration Status
                  </Texto>
                  <ConfigurationStatus completeCount={5} incompleteCount={1} remainingCount={41} />
                </Vertical>
              </Vertical>
            </div>
          )}
        </TabPane>
        <TabPane
          tab={
            <Horizontal className={styles.tabIcon}>
              <AreaChartOutlined />
              <span>Volume</span>
            </Horizontal>
          }
          key="volume"
        >
          <VolumeTabContent
            onAllocationConfig={noop}
            onRateabilityConfig={noop}
            onPenaltiesConfig={noop}
          />
        </TabPane>
      </Tabs>

      <div className={styles.footer}>
        <Horizontal justifyContent="flex-end" className={styles.footerButtons}>
          <Button size="large" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            disabled={!name.trim()}
            className={styles.saveButton}
          >
            {isEditMode ? 'Save Changes' : 'Add Scenario'}
          </Button>
        </Horizontal>
      </div>
    </Drawer>
  );
}
