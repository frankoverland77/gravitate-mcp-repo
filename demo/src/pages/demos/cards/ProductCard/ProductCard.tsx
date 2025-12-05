import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Tag } from 'antd';
import './ProductCard.css';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div className="product-card">
      <Vertical className="p-3">
        <Horizontal justifyContent="space-between" alignItems="center" className="mb-2">
          <Texto category="h4" weight="600">
            {product.name}
          </Texto>
          <Tag color={product.inStock ? 'green' : 'red'}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </Tag>
        </Horizontal>

        <Texto category="p2" appearance="medium" className="mb-2">
          {product.category}
        </Texto>

        <Texto category="p1" className="mb-3">
          {product.description}
        </Texto>

        <Horizontal justifyContent="space-between" alignItems="center">
          <Texto category="h3" weight="700" style={{ color: 'var(--theme-color-primary)' }}>
            ${product.price.toFixed(2)}
          </Texto>

          <Horizontal style={{ gap: '8px' }}>
            <GraviButton
              buttonText="Details"
              appearance="secondary"
              onClick={() => onViewDetails?.(product)}
            />
            <GraviButton
              buttonText="Add to Cart"
              appearance="success"
              onClick={() => onAddToCart?.(product)}
              disabled={!product.inStock}
            />
          </Horizontal>
        </Horizontal>
      </Vertical>
    </div>
  );
}
