import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { QueryFailedError } from 'typeorm';
import { PostgresErrorCode2 } from '../helpers/postgrsql-error-codes';

function throwDefaultError(
  message: string,
  status: HttpStatus = HttpStatus.BAD_REQUEST,
): never {
  throw new HttpException(message, status);
}
@Injectable()
export class TypeOrmErrorMapperInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (!(error instanceof QueryFailedError)) throw error;

        const { code = -1, detail = '' } = error.driverError || {};

        const errorText =
          PostgresErrorCode2[code].error_text + detail ||
          'Неизвестная ошибка: ';
        throwDefaultError(errorText);
      }),
    );
  }
}
