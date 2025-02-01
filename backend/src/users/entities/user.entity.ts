import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @ApiProperty({ description: 'ID пользователя' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Имя пользователя', example: 'Карлсон' })
  @Column({ unique: true })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty({
    description: 'Информация о пользователе',
    example: 'Мужчина в самом расцвете сил',
  })
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  @IsOptional()
  about: string;

  @ApiProperty({
    description: 'Аватар пользователя',
    example: 'https://i.pravatar.cc/300',
  })
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @ApiProperty({
    description: 'email пользователя',
    example: 'email@email.com',
  })
  @Column({
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty() //проверка на то, что поле не пустое
  email: string;

  @ApiProperty({ description: ' пароль пользователя', example: '123456' })
  @Column({ select: false })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ type: () => Wish, description: 'список желаемых подарков' })
  @OneToMany(() => Wish, (wish) => wish.owner, { nullable: true })
  wishes?: Wish[];

  @ApiProperty({ type: () => Offer, description: 'список людей' })
  @IsNotEmpty()
  @OneToMany(() => Offer, (offer) => offer.user, { nullable: true })
  offer: Offer[];

  @ApiProperty({
    type: () => Wishlist,
    description:
      'содержит список подарков, на которые скидывается пользователь',
  })
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner, { nullable: true })
  wishlists: Wishlist[];
}
