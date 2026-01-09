import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { BarChartOutlined, FormOutlined } from '@ant-design/icons';
import type { EntryMethod } from '../types/scenario.types';
import styles from './ScenarioDrawer.module.css';

interface EntryMethodSelectorProps {
  entryMethod: EntryMethod;
  onEntryMethodChange: (method: EntryMethod) => void;
}

export function EntryMethodSelector({
  entryMethod,
  onEntryMethodChange,
}: EntryMethodSelectorProps) {
  const getTileClassName = (method: EntryMethod) => {
    const base = styles.entryMethodTile;
    return entryMethod === method ? `${base} ${styles.entryMethodTileSelected}` : base;
  };

  const getIconClassName = (method: EntryMethod) => {
    const base = styles.entryMethodIcon;
    return entryMethod === method ? `${base} ${styles.entryMethodIconSelected}` : base;
  };

  return (
    <Horizontal gap="16px">
      <div
        className={getTileClassName('benchmark')}
        onClick={() => onEntryMethodChange('benchmark')}
      >
        <Vertical alignItems="center" gap="8px">
          <BarChartOutlined className={getIconClassName('benchmark')} />
          <Texto weight="600">Benchmark</Texto>
          <Texto category="p2" appearance="medium">
            Use standard industry benchmarks
          </Texto>
        </Vertical>
      </div>
      <div className={getTileClassName('formula')} onClick={() => onEntryMethodChange('formula')}>
        <Vertical alignItems="center" gap="8px">
          <FormOutlined className={getIconClassName('formula')} />
          <Texto weight="600">Formula</Texto>
          <Texto category="p2" appearance="medium">
            Build custom pricing formula
          </Texto>
        </Vertical>
      </div>
    </Horizontal>
  );
}
