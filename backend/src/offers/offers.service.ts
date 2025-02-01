import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { itemId, amount, hidden, ...rest } = createOfferDto;

    const user = await this.usersService.findOne({ where: { id: userId } });
    const wish = await this.wishesService.findOne(itemId);

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('На свой подарок скидываться нельзя');
    }

    if (amount > wish.price) {
      throw new BadRequestException('Сумма больше цены подарка');
    }

    const remainingAmount = wish.price - wish.raised;
    if (amount > remainingAmount) {
      throw new BadRequestException(
        `Сумма больше, чем требуется, ${remainingAmount}`,
      );
    }

    if (wish.raised === wish.price) {
      throw new ConflictException('Сбор окончен');
    }

    const newRaisedAmount = wish.raised + amount;
    await this.wishesService.updateRaisedAmount(itemId, newRaisedAmount);
    const newOffer = this.offerRepository.create({
      user,
      item: wish,
      amount,
      hidden,
      ...rest,
    });

    if (newOffer.hidden === true) {
      delete newOffer.user;
    }
    return this.offerRepository.save(newOffer);
  }

  getAllOffers() {
    return this.offerRepository.find({
      relations: ['user', 'item'],
    });
  }

  async findOneById(id: number) {
    const offer = await this.offerRepository.findOneOrFail({
      where: { id },
      relations: ['user', 'item'],
    });
    return offer;
  }
}
