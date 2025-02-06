import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthUser } from '../common/decorators/user.decorators';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto, SigninUserResponseDto } from './dto/signin-user.dto';
import { instanceToPlain } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(
    @Body() signinUserDto: SigninUserDto,
    @AuthUser() user,
  ): Promise<SigninUserResponseDto> {
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.signup(createUserDto);
    return instanceToPlain(user);
  }
}
