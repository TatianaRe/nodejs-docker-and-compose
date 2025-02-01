import { PickType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';

import { IsArray } from 'class-validator';

export class CreateWishlistDto extends PickType(Wishlist, [
  'name',
  'image',
  'description',
]) {
  @IsArray()
  itemsId: number[];
}
