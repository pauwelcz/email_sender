import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    // TBD: sending email in process
    console.log(`Sending email from job with id: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<any>) {
    console.log(`Email from job with id: ${job.id} sent`);
  }
}
