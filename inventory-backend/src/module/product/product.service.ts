import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  ProductRepository,
  StoreRepository,
  CurrencyRepository,
} from 'src/shared/global/model/repositories';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
} from 'src/shared/global/schemas/dto';
import { Product } from 'src/shared/global/model/entities';
import { ProductRelationEnum } from 'src/shared/global/enums/product.enum';
import {
  DEFAULT_STORAGE_NAME,
  IStorage,
  STORAGE_FOLDER,
} from 'src/shared/global';

@Injectable()
export class ProductService {
  constructor(
    private readonly storeRepo: StoreRepository,
    private readonly productRepo: ProductRepository,
    private readonly currencyRepo: CurrencyRepository,
    @Inject(DEFAULT_STORAGE_NAME) private readonly storageService: IStorage,
  ) {}

  async create(payload: CreateProductDto) {
    const {
      name,
      price,
      storeId,
      category,
      quantity,
      imageFile,
      currencyId,
      description,
    } = payload;

    const [store, currency] = await Promise.all([
      this.storeRepo.getOneByColumn({ id: storeId }),
      this.currencyRepo.getOneByColumn({ id: currencyId }),
    ]);

    if (!store) throw new NotFoundException(`Store not found`);
    if (!currency) throw new NotFoundException(`Currency not found`);

    let imageData;
    if (imageFile) {
      const uploadResult = await this.storageService.uploadFile(
        STORAGE_FOLDER.PRODUCT,
        imageFile,
      );
      if (uploadResult?.length) imageData = uploadResult[0];
    }

    const productData: Partial<Product> = {
      name,
      price,
      store,
      category,
      quantity,
      currency,
      description,
      image: imageData,
    };
    return this.productRepo.save(productData);
  }

  async findAll(filters: ProductFilterDto) {
    return this.productRepo.findWithFilters(filters);
  }

  async findOne(id: number) {
    const product = await this.productRepo.getOneByColumn({ id }, [
      ProductRelationEnum.CURRENCY,
      ProductRelationEnum.STORE,
    ]);

    if (!product) throw new NotFoundException(`Product not found`);
    return product;
  }

  async update(id: number, payload: UpdateProductDto) {
    const {
      name,
      price,
      storeId,
      category,
      quantity,
      imageFile,
      currencyId,
      description,
    } = payload;

    const product = await this.productRepo.getOneByColumn({ id });

    if (!product) throw new NotFoundException(`Product not found`);

    if (storeId) {
      const store = await this.storeRepo.getOneByColumn({ id: storeId });
      if (!store) throw new NotFoundException(`Store not found`);

      product.store = store;
    }

    if (currencyId) {
      const currency = await this.currencyRepo.getOneByColumn({
        id: currencyId,
      });
      if (!currency) throw new NotFoundException(`Currency not found`);

      product.currency = currency;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (quantity) product.quantity = quantity;
    if (description) product.description = description;

    if (imageFile) {
      if (product.image) await this.storageService.deleteFile(product.image);

      const uploadResult = await this.storageService.uploadFile(
        STORAGE_FOLDER.PRODUCT,
        imageFile,
      );

      if (uploadResult?.length) product.image = uploadResult[0];
    }

    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepo.getOneByColumn({ id });
    if (!product) throw new NotFoundException(`Product not found`);

    if (product.image) await this.storageService.deleteFile(product.image);

    await this.productRepo.delete(id);
  }
}
