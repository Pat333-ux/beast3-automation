export type JobStatus = "Idle" | "Running" | "Success" | "Failed";

export interface ScheduledJob {
  id: string;
  name: string;
  cronExpression: string;
  targetDivision: string;
  lastRun: string | null;
  status: JobStatus;
  enabled: boolean;
}

export class CronScheduler {
  private jobs: Map<string, ScheduledJob> = new Map();

  /**
   * Register a new automated background cron job.
   */
  registerJob(
    name: string,
    cronExpression: string,
    targetDivision: string
  ): ScheduledJob {
    const job: ScheduledJob = {
      id: crypto.randomUUID(),
      name,
      cronExpression,
      targetDivision,
      lastRun: null,
      status: "Idle",
      enabled: true,
    };

    this.jobs.set(job.id, job);
    return job;
  }

  /**
   * Trigger execution of a registered job.
   */
  executeJob(jobId: string): { success: boolean; message: string; job?: ScheduledJob } {
    const job = this.jobs.get(jobId);
    if (!job) {
      return { success: false, message: "Scheduled job not found." };
    }

    if (!job.enabled) {
      return { success: false, message: "Job is currently disabled." };
    }

    job.status = "Running";
    job.lastRun = new Date().toISOString();
    
    // Simulate successful background execution
    job.status = "Success";
    this.jobs.set(jobId, job);

    return { success: true, message: `Job '${job.name}' executed successfully.`, job };
  }

  /**
   * Toggle job enabled/disabled status.
   */
  toggleJob(jobId: string): ScheduledJob | undefined {
    const job = this.jobs.get(jobId);
    if (!job) return undefined;

    job.enabled = !job.enabled;
    this.jobs.set(jobId, job);
    return job;
  }

  /**
   * List all registered scheduled jobs.
   */
  getAllJobs(): ScheduledJob[] {
    return Array.from(this.jobs.values());
  }
}

export const cronScheduler = new CronScheduler();
