import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BodyData, SendEmailDto } from './dto/email.dto';
import { readFileSync } from 'fs';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async sendEmail(body: SendEmailDto): Promise<number> {
    const { body_data, delayed_send, email, key, subject } = body;

    const delay = this.getDelay(delayed_send);
    await this.emailQueue.add('emails', { foo: 'bar' }, { delay });
    console.log('Hello, i am sesfsdsnding email');
    return delay;
  }

  /**
   * @param delayed_send
   * @returns delay value in milliseconds
   */
  getDelay(delayed_send: string) {
    return delayed_send
      ? new Date(delayed_send).valueOf() - new Date().valueOf()
      : 0;
  }
  /**
   * TBD change properties for body_data
   * @param body_data
   * @returns
   */
  formatEmailBody(body_data: BodyData): string {
    // console.log(body_data);
    return '';
  }
}
