import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { MiscellaneousService } from './miscellaneous.service';
import { SuccessMessageEnum } from '../../shared/global';
import { Request, Response } from 'express';
import {
  GetStateDto,
  GetCountryDto,
  GetCurrencyDto,
} from '../../shared/global/schemas/dto';

@Controller('miscellaneous')
export class MiscellaneousController {
  constructor(private readonly miscellaneousService: MiscellaneousService) {}

  @Get()
  @Post()
  async checkSvcMiscellaneousStatus(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.miscellaneousService.checkStatus();

    resp.json({
      result,
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }

  @Get('country/list')
  async getAllCountry(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const countries = await this.miscellaneousService.getAllCountry();

    resp.json({
      countries,
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }

  @Get('country')
  async getCountry(
    @Req() req: Request,
    @Query() query: GetCountryDto,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const country = await this.miscellaneousService.getCountry(
      query.countryCode,
    );

    resp.json({
      country,
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }

  @Get('state/list')
  async getAllState(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const states = await this.miscellaneousService.getAllState();

    resp.json({
      states,
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }

  @Get('state')
  async getState(
    @Req() req: Request,
    @Query() query: GetStateDto,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const state = await this.miscellaneousService.getState(query.stateId);

    resp.json({
      state,
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }

  @Get('currency/list')
  async getAllCurrency(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const currencies = await this.miscellaneousService.getAllCurrency();

    resp.json({
      currencies,
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }

  @Get('currency')
  async getCurrency(
    @Req() req: Request,
    @Query() query: GetCurrencyDto,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const currency = await this.miscellaneousService.getCurrency(
      query.currencyId,
    );

    resp.json({
      currency,
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }
}
