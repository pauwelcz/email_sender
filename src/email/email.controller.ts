import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailsService: EmailService) {}

  @Post()
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const delay = await this.emailsService.sendEmail(sendEmailDto);

    if (delay === 0) throw new HttpException('OK', HttpStatus.OK);

    throw new HttpException('Accepted', HttpStatus.ACCEPTED);
  }
}
