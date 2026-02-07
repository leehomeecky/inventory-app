import { Store } from '../entities/store.entity';
import { faker } from '@faker-js/faker';

export const storeSeedData: Array<Partial<Store>> = [
  {
    name: 'Downtown Electronics',
    storRef: faker.string.uuid(),
    location: '123 Main Street, New York, NY 10001',
    description:
      'Premium electronics store with the latest gadgets and accessories',
  },
  {
    name: 'Green Grocery Market',
    storRef: faker.string.uuid(),
    location: '456 Oak Avenue, Los Angeles, CA 90001',
    description: 'Fresh produce and organic groceries for healthy living',
  },
  {
    name: 'Fashion Forward Boutique',
    storRef: faker.string.uuid(),
    location: '789 Fashion District, Chicago, IL 60601',
    description: 'Trendy clothing and accessories for the modern fashionista',
  },
  {
    name: 'Home & Garden Center',
    storRef: faker.string.uuid(),
    location: '321 Garden Way, Houston, TX 77001',
    description: 'Everything you need for your home and garden projects',
  },
  {
    name: 'Sports Zone',
    storRef: faker.string.uuid(),
    location: '654 Athletic Boulevard, Phoenix, AZ 85001',
    description: 'Professional sports equipment and athletic gear',
  },
];
