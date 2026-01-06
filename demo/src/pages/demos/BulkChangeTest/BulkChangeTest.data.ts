export type BulkChangeMode = 'replace' | 'increment' | 'decrement';

export interface ProductRow {
  ProductId: string;
  Name: string;
  Categories: string[];
  Tags: string[];
  Regions: string[];
  Price: number;
  IsActive: boolean;
}

export interface SelectOption {
  Value: string;
  Text: string;
}

export const categoryOptions: SelectOption[] = [
  { Value: 'electronics', Text: 'Electronics' },
  { Value: 'clothing', Text: 'Clothing' },
  { Value: 'food', Text: 'Food & Beverage' },
  { Value: 'home', Text: 'Home & Garden' },
  { Value: 'sports', Text: 'Sports & Outdoors' },
  { Value: 'beauty', Text: 'Beauty & Health' },
];

export const tagOptions: SelectOption[] = [
  { Value: 'new', Text: 'New Arrival' },
  { Value: 'sale', Text: 'On Sale' },
  { Value: 'featured', Text: 'Featured' },
  { Value: 'bestseller', Text: 'Bestseller' },
  { Value: 'limited', Text: 'Limited Edition' },
  { Value: 'clearance', Text: 'Clearance' },
];

export const regionOptions: SelectOption[] = [
  { Value: 'us-east', Text: 'US East' },
  { Value: 'us-west', Text: 'US West' },
  { Value: 'eu', Text: 'Europe' },
  { Value: 'apac', Text: 'Asia Pacific' },
  { Value: 'latam', Text: 'Latin America' },
];

export const mockProducts: ProductRow[] = [
  {
    ProductId: 'P001',
    Name: 'Wireless Headphones',
    Categories: ['electronics'],
    Tags: ['new', 'featured'],
    Regions: ['us-east', 'us-west'],
    Price: 149.99,
    IsActive: true,
  },
  {
    ProductId: 'P002',
    Name: 'Running Shoes',
    Categories: ['sports', 'clothing'],
    Tags: ['bestseller'],
    Regions: ['us-east', 'eu'],
    Price: 89.99,
    IsActive: true,
  },
  {
    ProductId: 'P003',
    Name: 'Organic Coffee Beans',
    Categories: ['food'],
    Tags: ['new', 'featured'],
    Regions: ['us-west', 'eu', 'apac'],
    Price: 24.99,
    IsActive: true,
  },
  {
    ProductId: 'P004',
    Name: 'Smart Watch',
    Categories: ['electronics'],
    Tags: ['bestseller', 'featured'],
    Regions: ['us-east', 'us-west', 'eu'],
    Price: 299.99,
    IsActive: true,
  },
  {
    ProductId: 'P005',
    Name: 'Yoga Mat',
    Categories: ['sports', 'home'],
    Tags: ['sale'],
    Regions: ['us-east'],
    Price: 34.99,
    IsActive: true,
  },
  {
    ProductId: 'P006',
    Name: 'Face Moisturizer',
    Categories: ['beauty'],
    Tags: ['new'],
    Regions: ['us-west', 'eu'],
    Price: 45.99,
    IsActive: true,
  },
  {
    ProductId: 'P007',
    Name: 'Garden Tool Set',
    Categories: ['home'],
    Tags: ['clearance'],
    Regions: ['us-east', 'latam'],
    Price: 79.99,
    IsActive: false,
  },
  {
    ProductId: 'P008',
    Name: 'Bluetooth Speaker',
    Categories: ['electronics'],
    Tags: ['sale', 'bestseller'],
    Regions: ['us-east', 'us-west', 'apac'],
    Price: 59.99,
    IsActive: true,
  },
  {
    ProductId: 'P009',
    Name: 'Winter Jacket',
    Categories: ['clothing'],
    Tags: ['limited'],
    Regions: ['eu', 'us-east'],
    Price: 199.99,
    IsActive: true,
  },
  {
    ProductId: 'P010',
    Name: 'Protein Bars (12-pack)',
    Categories: ['food', 'sports'],
    Tags: ['new', 'sale'],
    Regions: ['us-west', 'latam'],
    Price: 29.99,
    IsActive: true,
  },
];
