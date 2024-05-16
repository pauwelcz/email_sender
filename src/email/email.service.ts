import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BodyData, SendEmailDto } from './dto/email.dto';
import { readFileSync } from 'fs';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async sendEmail(body: SendEmailDto): Promise<string> {
    const { body_data, delayed_send, email, key, subject } = body;
    console.log(subject)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    console.log('sending email');

    // console.log(formattedEmailBody);
    // const promise = [];
    // for (let i = 0; i < 100; i++) {
    //   promise.push(this.emailQueue.add('emails', { foo: i }));
    // }

    // await Promise.all(promise);

    console.log('Hello, i am sending email');
    return 'string';
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
