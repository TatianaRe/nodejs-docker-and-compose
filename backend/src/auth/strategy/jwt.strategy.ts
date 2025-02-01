import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //чтобы считать заголовки
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }
  // для AuthService
  async validate(payload: any) {
    return this.userService.findById(payload.sub);
  }
}
