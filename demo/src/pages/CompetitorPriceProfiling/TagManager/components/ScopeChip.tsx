import { BBDTag } from '@gravitate-js/excalibrr';
import { PresetScope } from '../PPTagManager.types';

interface ScopeChipProps {
  scope: PresetScope;
}

export function ScopeChip({ scope }: ScopeChipProps) {
  const label = (() => {
    switch (scope.type) {
      case 'all':
        return 'All terminals';
      case 'terminal':
        return `Terminal: ${scope.value ?? ''}`;
      case 'region':
        return `Region: ${scope.value ?? ''}`;
      case 'product-group':
        return `Product: ${scope.value ?? ''}`;
    }
  })();

  return <BBDTag style={{ width: 'fit-content' }}>{label}</BBDTag>;
}
