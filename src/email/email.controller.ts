import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/email.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('email')
export class EmailController {
  constructor(private readonly emailsService: EmailService) {}

  @UseGuards(AuthGuard)
  @Post()
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const delay = await this.emailsService.sendEmail(sendEmailDto);

    if (delay === 0) throw new HttpException('OK', HttpStatus.OK);

    throw new HttpException('Accepted', HttpStatus.ACCEPTED);
  }
}
