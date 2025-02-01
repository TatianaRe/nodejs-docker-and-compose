import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const { itemsId, ...rest } = createWishlistDto;
    if (!itemsId || itemsId.length === 0) {
      throw new NotFoundException('itemsId не найден');
    }
    const wishes = await Promise.all(
      itemsId.map((wishId) => this.wishesService.findByIdOrFail(wishId)),
    );
    const owner = await this.usersService.findOne({ where: { id: userId } });
    return this.wishlistRepository.save({
      ...rest,
      items: wishes,
      owner,
    });
  }

  async getAllWishlists() {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  //for @Get(':id')
  async findOneById(id: number) {
    const wishlist = await this.wishlistRepository.findOneOrFail({
      where: { id },
      relations: ['owner', 'items'],
    });
    return wishlist;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Это чужой wishlist');
    }
    return this.wishlistRepository.save({ ...wishlist, ...updateWishlistDto });
  }

  async remove(id: number, user: User) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wishlist) {
      throw new NotFoundException('wishlist не найден');
    }
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('это чужой wishlist');
    }
    return this.wishlistRepository.remove(wishlist);
  }
}
