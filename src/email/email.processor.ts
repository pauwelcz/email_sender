import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    console.log(job.name, job.data);
    switch (job.name) {
      case 'start':
        return this.start(job);
      case 'stop':
        return this.stop(job);
      default:
        throw new Error(`Process ${job.name} not implemented`);
    }
  }

  async start(job: Job<any>): Promise<any> {
    return Promise.resolve(`START ${job.id}`)
  }

  async stop(job: Job<any>): Promise<any> {
    return Promise.resolve(`STOP ${job.id}`)
  }
}