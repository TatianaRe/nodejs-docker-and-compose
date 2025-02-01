import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  IsNumber,
  IsInt,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @ApiProperty({ description: 'ID подарка' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Наименование подарка',
    example: 'Present-example',
  })
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({
    description: 'Ссылка на подарок',
    example: 'https://www.sportmaster.ru',
  })
  @Column()
  @IsUrl()
  @IsOptional()
  link: string;

  @ApiProperty({
    description: 'Картинка подарка',
    example: 'https://i.pravatar.cc/799',
  })
  @Column()
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Стоимость подарка',
    example: '1000',
  })
  @Column()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ description: 'Сумма, которую скинули' })
  @Column({ default: 0 })
  @IsInt()
  @IsOptional()
  raised: number;

  @ApiProperty({ type: () => User, description: 'владелец' })
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ApiProperty({
    description: 'Описание подарка',
    example: 'Жизненно необходимый',
  })
  @Column()
  @IsString()
  @Length(1, 1024)
  description?: string;

  @ApiProperty({
    type: () => Offer,
    description: 'массив ссылок на заявки скинуться от других пользователей',
  })
  @OneToMany(() => Offer, (offer) => offer.item)
  //@OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer;

  @ApiProperty({
    description: 'счетчик тех, кто скопировал подарок себе.',
  })
  @Column({ default: 0 })
  @IsNumber()
  copied?: number;

  @ApiProperty({ type: () => Wishlist, description: 'lists' })
  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  lists?: Wishlist[];
}
