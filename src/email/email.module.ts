import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'emails' })],
  controllers: [EmailController],
  providers: [EmailService, EmailProcessor],
})
export class EmailModule {}
