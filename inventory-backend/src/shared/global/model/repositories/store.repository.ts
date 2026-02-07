import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { DataSource } from 'typeorm';
import { Store } from '../entities';

@Injectable()
export class StoreRepository extends AbstractRepository<Store> {
  constructor(private dataSource: DataSource) {
    super(Store, dataSource);
  }

  async getInventorySummary(storeId: number) {
    return this.createQueryBuilder('store')
      .leftJoinAndSelect('store.products', 'product')
      .where('store.id = :storeId', { storeId })
      .select('store.id', 'storeId')
      .addSelect('store.name', 'storeName')
      .addSelect('COUNT(product.id)', 'totalProducts')
      .addSelect('SUM(product.quantity)', 'totalItems')
      .addSelect('SUM(product.price * product.quantity)', 'totalInventoryValue')
      .addSelect('AVG(product.price)', 'averageProductPrice')
      .groupBy('store.id')
      .getRawOne();
  }
}
