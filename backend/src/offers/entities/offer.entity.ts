import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsBoolean, IsNumber } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Offer {
  @ApiProperty({ description: 'ID спорно' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => User, description: 'id, желающего скинуться' })
  @ManyToOne(() => User, (user) => user.offer)
  user?: User; //id желающего скинуться

  @ApiProperty({ type: () => Wish, description: 'товар' })
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @ApiProperty({ description: 'сумма, которую кидает человек' })
  @Column()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'скрыть или нет информацию о скидывающемся' })
  @Column()
  @IsBoolean()
  hidden?: boolean; //флаг инфа о скидывающемся
}
