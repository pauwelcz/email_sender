import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    console.log(`${new Date()} - Sending email from job with id: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<any>) {
    console.log(`${new Date()} - Email from job with id: ${job.id} sent`);
  }
}
