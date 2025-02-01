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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Wishlist } from './entities/wishlist.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorators';
import { User } from '../users/entities/user.entity';

@ApiExtraModels(Wishlist)
@ApiTags('wishlists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @AuthUser() user: User) {
    return this.wishlistsService.create(createWishlistDto, user.id);
  }

  @Get()
  findAll() {
    return this.wishlistsService.getAllWishlists();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOneById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthUser() user: User) {
    await this.wishlistsService.remove(id, user);
    return { message: `Удален wishlist с id ${id}` };
  }
}
