import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinDate,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsNotOlderThanToday } from '../../validators/isNotOlderThanToday';

class Link {
  @IsString()
  label: string;

  @IsUrl()
  url: string;
}

export class BodyData {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  days: number;

  @IsNotEmptyObject()
  @Type(() => Link)
  @ValidateNested()
  link: Link;
}

export class SendEmailDto {
  @IsString()
  key: string;

  @IsString()
  @MinLength(1)
  subject: string;

  @IsDateString()
  @IsNotOlderThanToday({
    message: `Date in 'delayed_send' older than current date: ${new Date().toISOString()}`,
  })
  @IsOptional()
  delayed_send?: string;

  @Transform(({ value }) => [...new Set(value)])
  @IsEmail({}, { each: true })
  @ArrayNotEmpty()
  email: string[];

  @Transform(({ value }) => [...new Set(value)])
  @IsEmail({}, { each: true })
  @ArrayNotEmpty()
  bcc: string[];

  @IsNotEmptyObject()
  @Type(() => BodyData)
  @ValidateNested()
  body_data: BodyData;
}
