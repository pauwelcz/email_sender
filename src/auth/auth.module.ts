import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_EXPIRATION_TIME || 'secret',
      signOptions: {
        expiresIn: `${process.env.TOKEN_EXPIRATION_TIME || 3600}s`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
