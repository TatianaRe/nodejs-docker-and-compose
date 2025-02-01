import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  HttpStatus,
  Param,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUser } from 'src/common/decorators/user.decorators';
import { Wish } from '../wishes/entities/wish.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';
import { NoValidUserResponse } from './dto/no-valid-user-response.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { EntityNotFoundExceptionFilter } from '../common/filter/entity-not-found-exception.filter';
import { USER_FIELDS } from '../common/constants/users_constants';

@ApiExtraModels(User)
@ApiTags('users') //название блока
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService, //private wishesService: WishesService,
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'returns user',
    type: OmitType(User, ['password', 'email']),
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: NoValidUserResponse,
  })
  @Get('me')
  async getMe(@AuthUser() user: User): Promise<User> {
    return this.usersService.findOne({
      where: { id: user.id },
      select: USER_FIELDS,
    });
  }

  @Get('me/wishes')
  async getOwnWishes(@AuthUser() user: User): Promise<Wish[]> {
    return this.usersService.getMeWishes(user.id);
  }

  @ApiParam({
    name: 'username',
    description: 'Username',
    example: 'Карлсон',
  })
  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User> {
    return await this.usersService.findByUsername(username);
  }

  @ApiParam({
    name: 'username',
    description: 'Имя',
    example: 'test',
  })
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.getUserWishes(username);
  }

  @Patch('me')
  @UseFilters(EntityNotFoundExceptionFilter)
  async updateOne(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = user;
    return this.usersService.update(id, updateUserDto);
  }

  @Post('find')
  async findUsers(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findUsersByUsernameOrEmail(findUsersDto);
  }
}
