import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter } from './common/filters/i18n-validation-exception.filter';
import { HttpInterceptor } from './common/interceptors/http/http.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter(errors) {
        return errors.map(({ property, constraints }) => {
          const errors = Object.values(constraints);
          return {
            [property]: errors,
          };
        });
      },
    }),
  );
  app.useGlobalInterceptors(new HttpInterceptor());
  app.useGlobalPipes(
    new I18nValidationPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
