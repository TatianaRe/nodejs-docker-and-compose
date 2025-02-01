import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//для регистрации
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
