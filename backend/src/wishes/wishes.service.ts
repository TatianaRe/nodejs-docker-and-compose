import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.usersRepository.findOneOrFail({
      where: { id: userId },
    });
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner,
    });

    return this.wishesRepository.save(wish);
  }

  async findOne(id: number) {
    return await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  //для Get 'users/:username/wishes' - getUserWishes
  async findWishByOwnerId(ownerId: number) {
    return await this.wishesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  async findByIdOrFail(
    id: number,
    fields?: FindOptionsSelect<Wish>,
    join?: FindOptionsRelations<Wish>,
  ) {
    return this.wishesRepository.findOneOrFail({
      where: { id },
      select: fields,
      relations: join,
    });
  }

  //  @Get('wishes/last')
  async findLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  //  @Get('wishes/top')
  async findTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner', 'offers'],
    });
  }

  //@Patch(':id')
  async update(id: number, updateWishDto: any, user: User) {
    const wish = await this.wishesRepository.findOneOrFail({
      where: { id },
      relations: ['owner'],
    });
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете изменять чужой подарок');
    }
    if (wish.raised > 0) {
      throw new ConflictException('Нельзя менять спонсируемый подарок');
    }
    return this.wishesRepository.update(id, updateWishDto);
  }

  //@Delete(':id')
  async remove(id: number, user: User) {
    const wish = await this.wishesRepository.findOneOrFail({
      where: { id },
      relations: ['owner'],
    });
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Не стоит удалять чужие подарки');
    }
    return this.wishesRepository.remove(wish);
  }

  //@Post(':id/copy')
  async copy(id: number, user: User) {
    const wish = await this.wishesRepository.findOneOrFail({
      where: { id },
      relations: ['owner'],
    });

    if (
      await this.wishesRepository.findOne({
        where: { owner: { id: user.id }, name: wish.name },
      })
    ) {
      return { message: 'Подарок уже скопирован' };
    }
    wish.copied += 1;
    await this.wishesRepository.save(wish);
    wish.owner = user;
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      id: wishId,
      createdAt,
      updatedAt,
      offers,
      copied,
      raised,
      ...wishCopy
    } = wish;
    return await this.wishesRepository.save(wishCopy);
  }

  //createOffer
  async updateRaisedAmount(id: number, newRaisedAmount: number) {
    await this.wishesRepository.update(id, { raised: newRaisedAmount });
  }
}
