import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/email.dto';
import { AuthGuard } from '../auth/auth.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailsService: EmailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    this.logger.info(`${new Date()} - Request received`);
    const delay = await this.emailsService.sendEmail(sendEmailDto);

    if (delay === 0) throw new HttpException('OK', HttpStatus.OK);

    throw new HttpException('Accepted', HttpStatus.ACCEPTED);
  }
}
