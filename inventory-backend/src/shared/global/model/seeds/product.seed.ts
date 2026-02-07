import { Currency, Store } from '../entities';
import { Product } from '../entities/product.entity';
import { faker } from '@faker-js/faker';

// This will be populated dynamically based on created stores
export const generateProductSeedData = (
  storeIds: number[],
): Array<Partial<Product>> => {
  const categories = [
    'Toys',
    'Books',
    'Clothing',
    'Electronics',
    'Home & Garden',
    'Health & Beauty',
    'Food & Beverages',
    'Sports & Outdoors',
  ];

  const products: Array<Partial<Product>> = [];
  const currency = new Currency({ id: 'NGN' });

  storeIds.forEach((storeId) => {
    const productsPerStore = 8 + Math.floor(Math.random() * 7); // 8-14 products per store

    for (let i = 0; i < productsPerStore; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const price = parseFloat((Math.random() * 500 + 10).toFixed(2)); // $10-$510
      const quantity = Math.floor(Math.random() * 100) + 1; // 1-100

      products.push({
        price,
        currency,
        quantity,
        category,
        store: new Store({ id: storeId }),
        description: faker.commerce.productDescription(),
        name: `${category} - ${faker.commerce.productName()}`,
      });
    }
  });

  return products;
};
