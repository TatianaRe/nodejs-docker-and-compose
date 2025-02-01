import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from '../common/helpers/hash';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({
      select: { username: true, password: true, id: true },
      where: { username },
    });

    if (user && (await verifyHash(password, user.password))) {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const { username, id: sub } = user;

    const token = await this.jwtService.signAsync({ username, sub });
    return {
      access_token: token,
    };
  }
}
