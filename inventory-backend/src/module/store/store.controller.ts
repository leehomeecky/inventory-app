import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, UpdateStoreDto } from 'src/shared/global/schemas/dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  async findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.storeService.findOne(id);
  }

  @Get(':id/inventory-summary')
  async getInventorySummary(@Param('id') id: number) {
    return this.storeService.getInventorySummary(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return this.storeService.remove(id);
  }
}
