import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignupUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
] as const) {}
