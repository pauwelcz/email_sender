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

  // TBD: date format YYYY-MM-DD HH:mm
  // TBD: date should be greater than new date (+10 seconds?)
  @IsDateString()
  @MinDate(new Date())
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
