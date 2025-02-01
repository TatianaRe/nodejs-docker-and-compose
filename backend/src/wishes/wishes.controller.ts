import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from '../common/decorators/user.decorators';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@ApiExtraModels(Wish)
@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user: User,
  ) {
    return this.wishesService.update(+id, updateWishDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: number, @AuthUser() user: User) {
    await this.wishesService.remove(id, user);
    return { message: `Удален подарок с id ${id}` };
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async copy(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.copy(id, user);
  }
}
