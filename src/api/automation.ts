import { cronScheduler } from "../core/CronScheduler";
import { taskPipeline } from "../core/TaskPipeline";

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class AutomationAPIHandler {
  /**
   * Register a new cron job.
   * POST /api/automation/jobs
   */
  static registerJob(body: {
    name: string;
    cronExpression: string;
    targetDivision: string;
  }): APIResponse<any> {
    if (!body.name || !body.cronExpression || !body.targetDivision) {
      return {
        success: false,
        error: "Missing required fields: name, cronExpression, or targetDivision.",
        timestamp: new Date().toISOString(),
      };
    }

    const job = cronScheduler.registerJob(body.name, body.cronExpression, body.targetDivision);
    return {
      success: true,
      data: job,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute a scheduled cron job immediately.
   * POST /api/automation/jobs/:id/run
   */
  static triggerJob(jobId: string): APIResponse<any> {
    const result = cronScheduler.executeJob(jobId);
    if (!result.success) {
      return {
        success: false,
        error: result.message,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: result.job,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create and run a multi-step task pipeline.
   * POST /api/automation/pipelines
   */
  static createAndRunPipeline(body: {
    pipelineName: string;
    steps: Array<{ division: string; action: string }>;
  }): APIResponse<any> {
    if (!body.pipelineName || !body.steps || body.steps.length === 0) {
      return {
        success: false,
        error: "Missing required fields: pipelineName or steps.",
        timestamp: new Date().toISOString(),
      };
    }

    const pipeline = taskPipeline.createPipeline(body.pipelineName, body.steps);
    const executed = taskPipeline.runPipeline(pipeline.id);

    return {
      success: true,
      data: executed,
      timestamp: new Date().toISOString(),
    };
  }
}
