import { Country, Currency, State } from '../../shared/global/model/entities';
import {
  CountryRepository,
  CurrencyRepository,
  StateRepository,
  StoreRepository,
  ProductRepository,
} from '../../shared/global/model/repositories';
import {
  countrySeedData,
  stateSeedData,
  storeSeedData,
  generateProductSeedData,
} from '../../shared/global/model/seeds';
import { currencySeedData } from '../../shared/global/model/seeds/currency.seed';
import {
  CountryRelationEnum,
  ErrorMessage,
  StateRelationEnum,
} from '../../shared/global';
import { outputError } from '../../shared/util';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MiscellaneousService {
  constructor(
    private readonly storeRepo: StoreRepository,
    private readonly stateRepo: StateRepository,
    private readonly productRepo: ProductRepository,
    private readonly countryRepo: CountryRepository,
    private readonly currencyRepo: CurrencyRepository,
  ) {}

  async onModuleInit() {
    try {
      const store = await this.storeRepo.count();
      const state = await this.stateRepo.count();
      const country = await this.countryRepo.count();
      const product = await this.productRepo.count();
      const currency = await this.currencyRepo.count();

      if (!country) {
        Logger.log('>>>>>>>> Country Seed Started');
        await this.countryRepo.save(countrySeedData);
        Logger.log('>>>>>>>> Country Seed Completed');
      }

      if (!state) {
        Logger.log('>>>>>>>> State Seed Started');
        await this.stateRepo.save(stateSeedData);
        Logger.log('>>>>>>>> State Seed Completed');
      }

      if (!currency) {
        Logger.log('>>>>>>>> currency Seed Started');
        await this.currencyRepo.save(currencySeedData);
        Logger.log('>>>>>>>> currency Seed Completed');
      }

      if (!store) {
        Logger.log('>>>>>>>> Store Seed Started');
        const savedStores = await this.storeRepo.save(storeSeedData);
        Logger.log('>>>>>>>> Store Seed Completed');

        if (!product && savedStores.length > 0) {
          Logger.log('>>>>>>>> Product Seed Started');
          const storeIds = savedStores.map((s) => s.id).filter(Boolean);
          const productSeedData = generateProductSeedData(storeIds);
          await this.productRepo.save(productSeedData);
          Logger.log('>>>>>>>> Product Seed Completed');
        }
      }
    } catch (error) {
      const message = ErrorMessage.INTERNAL_SERVER_ERROR;
      outputError({ error, message });
    }
  }

  async checkStatus() {
    return 'miscellaneous service is up!';
  }

  async getAllCountry(): Promise<Country[]> {
    try {
      return await this.countryRepo.find();
    } catch (error) {
      const message = ErrorMessage.INTERNAL_SERVER_ERROR;
      outputError({ error, message });
    }
  }

  async getCountry(countryCode: string): Promise<Country> {
    try {
      return await this.countryRepo.getOneByColumn({ id: countryCode }, [
        CountryRelationEnum.STATE,
      ]);
    } catch (error) {
      const message = ErrorMessage.INTERNAL_SERVER_ERROR;
      outputError({ error, message });
    }
  }

  async getAllState(): Promise<State[]> {
    try {
      return await this.stateRepo.find();
    } catch (error) {
      const message = ErrorMessage.INTERNAL_SERVER_ERROR;
      outputError({ error, message });
    }
  }

  async getState(stateId: number): Promise<State> {
    try {
      return await this.stateRepo.getOneByColumn({ id: stateId }, [
        StateRelationEnum.COUNTRY,
      ]);
    } catch (error) {
      const message = ErrorMessage.INTERNAL_SERVER_ERROR;
      outputError({ error, message });
    }
  }

  async getAllCurrency(): Promise<Currency[]> {
    try {
      return await this.currencyRepo.find();
    } catch (error) {
      const message = ErrorMessage.INTERNAL_SERVER_ERROR;
      outputError({ error, message });
    }
  }

  async getCurrency(currencyId: string): Promise<Currency> {
    try {
      return await this.currencyRepo.getOneByColumn({ id: currencyId });
    } catch (error) {
      const message = ErrorMessage.INTERNAL_SERVER_ERROR;
      outputError({ error, message });
    }
  }
}
