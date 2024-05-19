import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { SendEmailDto } from './dto/email.dto';
import { readFileSync } from 'fs';
import { cwd } from 'process';
import { join } from 'path';
import * as emlFormat from 'eml-format';
import { EmlObject } from '../types/eml';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async sendEmail(body: SendEmailDto): Promise<{
    object: EmlObject;
    delay: number;
  }> {
    const { delayed_send, key } = body;

    const delay = this.getDelay(delayed_send);

    const emlObject = this.getEmlObject(key, body);

    await this.sendEmlObjectToQueue(emlObject, delay);

    return {
      object: emlObject,
      delay,
    };
  }

  async sendEmlObjectToQueue(emlObject: EmlObject, delay: number) {
    await this.emailQueue.add('emails', emlObject, {
      delay,
      removeOnComplete: {
        age: parseInt(process.env.BULLMQ_REMOVE_ON_COMLETE_AGE || '3600'),
      },
      removeOnFail: {
        age: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL_AGE || '86400'),
      },
    });
  }

  getEmlObject(key: string, body: SendEmailDto): EmlObject {
    try {
      const emlFile = this.getEmlFile(key);

      const { email, bcc, subject } = body;
      const emlObject: EmlObject = {
        from: 'sender@bar.com',
        to: email,
        bcc,
        subject,
        text: '',
        html: '',
      };

      emlFormat.read(emlFile, (error, data) => {
        if (error) {
          new InternalServerErrorException(error);
        }

        emlObject.text = this.fillIceWarpTemplate(data, body, 'kokot');
        emlObject.html = this.fillIceWarpTemplate(data, body, 'html');
      });

      return emlObject;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  getEmlFile(key: string) {
    try {
      const path = join(cwd(), `src/templates/${key}.eml`);
      return readFileSync(path, 'utf-8');
    } catch (e) {
      throw new BadRequestException('Template does not exists');
    }
  }

  fillIceWarpTemplate(data: unknown, body: SendEmailDto, key: string): string {
    const { body_data, subject } = body;
    const { name, link, days } = body_data;
    const { label, url } = link;
    if (data[key] === undefined) {
      throw new InternalServerErrorException();
    }

    let replacedText: string = data[key]
      .toString()
      .replace('{{BODY_NAME}}', name);

    replacedText = replacedText.replace('{{BODY_SUBJECT}}', subject);
    replacedText = replacedText.replace('{{BODY_DATA_LINK_LABEL}}', label);
    replacedText = replacedText.replace('{{BODY_DAYS}}', days.toString());
    replacedText = replacedText.replace('{{BODY_DATA_LINK_URL}}', url);
    return replacedText;
  }

  /**
   * @param delayed_send
   * @returns delay value in milliseconds
   */
  getDelay(delayed_send: string) {
    const delay = new Date(delayed_send).valueOf() - new Date().valueOf();
    return delay > 0 ? delay : 0;
  }
}
