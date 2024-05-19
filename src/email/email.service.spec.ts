import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bull';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SendEmailDto } from './dto/email.dto';

describe('EmailSErvice', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
      imports: [BullModule.registerQueue({ name: 'emails' })],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDelay', () => {
    it('should return positive delay', () => {
      const delay = service.getDelay('3000-12-12');
      expect(delay).toBeGreaterThan(1);
    });

    it('should return zero delay', () => {
      const delay = service.getDelay('1900-12-12');
      expect(delay).toBe(0);
    });
  });

  describe('getEmlFile', () => {
    it('should return bad request (file by key does not exist)', () => {
      expect(() => {
        service.getEmlFile('bad_key');
      }).toThrow(new BadRequestException('Template does not exists'));
    });

    it('should return eml file', () => {
      const file = service.getEmlFile('task-icewarp');
      expect(file).toBeDefined();
    });
  });

  describe('fillIceWarTemplate', () => {
    const requestBody: SendEmailDto = {
      key: 'key',
      email: ['pavel@email.com'],
      subject: 'Hello Pavel',
      bcc: ['pavla@seznam.cz'],
      body_data: {
        name: 'Test_name',
        link: {
          label: 'Test_label',
          url: 'https://www.google.cz/',
        },
        days: 1,
      },
    };

    const data = {
      text: '{{BODY_NAME}} {{BODY_SUBJECT}} {{BODY_DATA_LINK_LABEL}} {{BODY_DAYS}} {{BODY_DATA_LINK_URL}}',
    };

    it('should return internal server error', () => {
      expect(() => {
        service.fillIceWarpTemplate(data, requestBody, 'non_exists');
      }).toThrow(InternalServerErrorException);
    });

    it('should return formatted text', () => {
      const text = service.fillIceWarpTemplate(data, requestBody, 'text');
      expect(text).toBe(
        'Test_name Hello Pavel Test_label 1 https://www.google.cz/',
      );
    });
  });
});
