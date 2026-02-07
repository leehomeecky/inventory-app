import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { DataSource } from 'typeorm';
import { Product } from '../entities';
import { ProductFilterDto } from 'src/shared/global/schemas/dto';
import { DEFAULT_LIMIT } from '../../constants';

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource);
  }

  async findWithFilters(filters: ProductFilterDto) {
    const {
      limit,
      search,
      offset,
      storeId,
      category,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
    } = filters;

    const safeLimit = Number(limit) || DEFAULT_LIMIT;
    const safeOffset = Number(offset) || 0;

    const queryBuilder = this.createQueryBuilder('product')
      .leftJoinAndSelect('product.store', 'store')

      .leftJoinAndSelect('product.currency', 'currency')
      .where('product.deletedAt IS NULL');

    if (category)
      queryBuilder.andWhere('product.category = :category', { category });

    if (storeId)
      queryBuilder.andWhere('product.storeId = :storeId', { storeId });

    if (minPrice)
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });

    if (maxPrice)
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });

    if (minQuantity)
      queryBuilder.andWhere('product.quantity >= :minQuantity', {
        minQuantity,
      });

    if (maxQuantity) {
      queryBuilder.andWhere('product.quantity <= :maxQuantity', {
        maxQuantity,
      });
    }

    if (search)
      queryBuilder.andWhere(
        `(product.name ILIKE :search 
        OR product.category ILIKE :search 
        OR product.description ILIKE :search)`,
        { search: `%${search}%` },
      );

    const total = await queryBuilder.getCount();
    const products = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip(safeOffset)
      .take(safeLimit)
      .getMany();

    return {
      data: products,
      pagination: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getProductsByCategory(storeId: number) {
    return this.createQueryBuilder('product')
      .where('product.storeId = :storeId', { storeId })
      .andWhere('product.deletedAt IS NULL')
      .select('product.category', 'category')
      .addSelect('COUNT(product.id)', 'count')
      .addSelect('SUM(product.quantity)', 'totalQuantity')
      .groupBy('product.category')
      .getRawMany();
  }
}
