import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BodyData, SendEmailDto } from './dto/email.dto';
import { readFileSync } from 'fs';
import { cwd } from 'process';
import { join } from 'path';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async sendEmail(body: SendEmailDto): Promise<number> {
    const { body_data, delayed_send, email, key, subject } = body;

    const delay = this.getDelay(delayed_send);

    // const eml = this.getEmlFile(key);

    await this.emailQueue.add('emails', { foo: 'bar' }, { delay });
    return delay;
  }

  /**
   *
   */
  getEmlFile(key: string) {
    try {
      const path = join(cwd(), `./src/email/templates/${key}.eml`);
      const neco = readFileSync(path);
      return neco;
    } catch (e) {
      throw new HttpException('File does not exists', HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * @param delayed_send
   * @returns delay value in milliseconds
   */
  getDelay(delayed_send: string) {
    const delay = new Date(delayed_send).valueOf() - new Date().valueOf();
    return delay > 0 ? delay : 0;
  }
  /**
   * TBD change properties for body_data
   * @param body_data
   * @returns
   */
  formatEmailBody(body_data: BodyData): string {
    // TBD: check, if fileExists
    // console.log(body_data);
    return '';
  }
}
