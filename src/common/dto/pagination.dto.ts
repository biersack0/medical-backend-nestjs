import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PaginationDto {
  @IsOptional()
  @IsPositive({
    message: i18nValidationMessage('validation.MUST_BE_A_POSITIVE_NUMBER'),
  })
  @IsNumber()
  @Min(1, {
    message: i18nValidationMessage('validation.MIN_NUMBER'),
  })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsPositive({
    message: i18nValidationMessage('validation.MUST_BE_A_POSITIVE_NUMBER'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.MUST_BE_AN_INTEGER_NUMBER'),
    },
  )
  @Type(() => Number)
  page?: number;
}
