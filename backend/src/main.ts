import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { TypeOrmErrorMapperInterceptor } from './common/interceptors/TypeOrmErrorMapperInterceptor';
import { EntityNotFoundExceptionFilter } from './common/filter/entity-not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ProjectKupiPodariDay')
    .setDescription('API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory(), {
    customCssUrl: '/swagger/swagger.css',
    swaggerOptions: {
      persistAuthorisation: true,
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalInterceptors(new TypeOrmErrorMapperInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
