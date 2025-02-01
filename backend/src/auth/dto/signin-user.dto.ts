import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/mapped-types';
import { User } from '../../users/entities/user.entity';

export class SigninUserResponseDto {
  @ApiProperty({
    description: 'Access token',
    example: '123dsfsdfsf45fsdfsdfsdfsdf6',
  })
  access_token: string;
}

export class SigninUserDto extends PickType(User, ['username', 'password']) {
  @ApiProperty({
    description: 'Usernamer',
    example: 'test',
  })
  username: string;

  @ApiProperty({
    description: 'Password',
    example: '12345678',
  })
  password: string;
}
