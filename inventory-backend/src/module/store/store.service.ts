import { Injectable, NotFoundException } from '@nestjs/common';
import {
  StoreRepository,
  ProductRepository,
} from 'src/shared/global/model/repositories';
import { CreateStoreDto, UpdateStoreDto } from 'src/shared/global/schemas/dto';
import { faker } from '@faker-js/faker';
import { Store } from 'src/shared/global/model/entities';
import { StoreRelationEnum } from 'src/shared/global/enums/store.enum';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepo: StoreRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const { name, description, location } = createStoreDto;

    const storRef = faker.string.uuid();

    const storeData: Partial<Store> = {
      name,
      storRef,
      location,
      description,
    };
    return this.storeRepo.save(storeData);
  }

  async findAll() {
    return this.storeRepo.find({
      relations: [StoreRelationEnum.PRODUCT],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const store = await this.storeRepo.getOneByColumn({ id }, [
      StoreRelationEnum.PRODUCT,
    ]);

    if (!store) throw new NotFoundException(`Store  not found`);

    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const { name, description, location } = updateStoreDto;

    const store = await this.storeRepo.getOneByColumn({ id });
    if (!store) throw new NotFoundException(`Store not found`);

    if (name) store.name = name;
    if (location) store.location = location;
    if (description) store.description = description;

    return this.storeRepo.save(store);
  }

  async remove(id: number): Promise<void> {
    const store = await this.storeRepo.getColumnCount({ id });
    if (!store) throw new NotFoundException(`Store not found`);

    await this.storeRepo.delete(id);
  }

  async getInventorySummary(id: number) {
    const store = await this.storeRepo.getOneByColumn({ id });
    if (!store) throw new NotFoundException(`Store not found`);

    const [summary, productsByCategory] = await Promise.all([
      this.storeRepo.getInventorySummary(id),
      this.productRepo.getProductsByCategory(id),
    ]);

    return {
      storeId: summary.storeId,
      storeName: summary.storeName,
      totalItems: parseInt(summary.totalItems) || 0,
      totalProducts: parseInt(summary.totalProducts) || 0,
      totalInventoryValue: parseFloat(summary.totalInventoryValue) || 0,
      averageProductPrice: parseFloat(summary.averageProductPrice) || 0,
      productsByCategory: productsByCategory.map((item) => ({
        category: item.category,
        count: parseInt(item.count),
        totalQuantity: parseInt(item.totalQuantity) || 0,
      })),
    };
  }
}
