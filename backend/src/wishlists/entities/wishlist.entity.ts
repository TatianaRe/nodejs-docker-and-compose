import {
  ManyToOne,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wishlist {
  @ApiProperty({ description: 'ID коллекции' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Наименование коллекции',
    example: 'example',
  })
  @Column()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Описание коллекции',
    example: 'Все надо',
  })
  @Column({ nullable: true, default: 'Коллекция лучших подарков' })
  @Length(0, 1500)
  @IsOptional()
  description?: string; //описание коллекции подарков

  @ApiProperty({
    description: 'Картинка коллекции',
    example: 'https://i.pravatar.cc/799',
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({ type: () => Wish, description: 'список подарков' })
  @ManyToMany(() => Wish, (wish) => wish.lists)
  @JoinTable()
  items?: Wish[];

  @ApiProperty({ type: () => User, description: 'Владелец коллекции' })
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
}
