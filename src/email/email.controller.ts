import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailsService: EmailService) {}

  @Post()
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<string> {
    await this.emailsService.sendEmail(sendEmailDto);
    return 'I am receiving email';
  }
}
