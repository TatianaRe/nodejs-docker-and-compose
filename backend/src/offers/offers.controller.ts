import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Offer } from './entities/offer.entity';
import { AuthUser } from '../common/decorators/user.decorators';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiExtraModels(Offer)
@ApiTags('offers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user: User) {
    return this.offersService.create(createOfferDto, user.id);
  }

  @Get()
  findAll() {
    return this.offersService.getAllOffers();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOneById(+id);
  }
}
