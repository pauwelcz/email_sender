import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Inject,
  Res,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/email.dto';
import { AuthGuard } from '../auth/auth.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Response } from 'express';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailsService: EmailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async sendEmail(@Body() sendEmailDto: SendEmailDto, @Res() res: Response) {
    this.logger.info(`Request received`);
    const data = await this.emailsService.sendEmail(sendEmailDto);

    res
      .status(data.delay === 0 ? HttpStatus.OK : HttpStatus.ACCEPTED)
      .json(data.object);
  }
}
