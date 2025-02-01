import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { hashValue } from 'src/common/helpers/hash';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private wishesService: WishesService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.usersRepository.save(user);
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOneOrFail(query);
  }
  // в метод авторизации
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  //me/wishes
  async getMeWishes(userId: number) {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId },
      relations: ['wishes'],
    });
    return user.wishes || [];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.usersRepository.findOneOrFail({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { username },
    });
    return user;
  }

  async getUserWishes(username: string): Promise<Wish[]> {
    const user = await this.findByUsername(username);
    return this.wishesService.findWishByOwnerId(user.id);
  }

  async findUsersByUsernameOrEmail(query: FindUsersDto) {
    return (
      (await this.usersRepository.find({
        where: [
          { username: ILike(`%${query.query}%`) },
          { email: ILike(`%${query.query}%`) },
        ],
      })) || []
    );
  }
}
