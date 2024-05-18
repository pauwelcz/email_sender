import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import * as winston from 'winston';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLEL_TTL || '10000'),
        limit: parseInt(process.env.THROTTLEL_LIMIT || '10'),
      },
    ]),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `logs/${process.env.LOGGER_REQUEST_NAME || 'request'}.log`,
          level: 'info',
        }),
      ],
    }),
    EmailModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
