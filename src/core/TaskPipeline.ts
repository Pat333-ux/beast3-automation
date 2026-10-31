export type PipelineStatus = "Pending" | "Executing" | "Completed" | "Failed";

export interface PipelineStep {
  stepNumber: number;
  division: string;
  action: string;
  status: PipelineStatus;
}

export interface PipelineExecution {
  id: string;
  pipelineName: string;
  steps: PipelineStep[];
  status: PipelineStatus;
  createdAt: string;
}

export class TaskPipeline {
  private pipelines: Map<string, PipelineExecution> = new Map();

  /**
   * Create and trigger a multi-step automated execution pipeline.
   */
  createPipeline(pipelineName: string, stepsData: Array<{ division: string; action: string }>): PipelineExecution {
    const steps: PipelineStep[] = stepsData.map((s, idx) => ({
      stepNumber: idx + 1,
      division: s.division,
      action: s.action,
      status: "Pending",
    }));

    const pipeline: PipelineExecution = {
      id: crypto.randomUUID(),
      pipelineName,
      steps,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  /**
   * Execute pipeline steps sequentially.
   */
  runPipeline(pipelineId: string): PipelineExecution | undefined {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) return undefined;

    pipeline.status = "Executing";

    for (const step of pipeline.steps) {
      step.status = "Executing";
      // Simulate step completion
      step.status = "Completed";
    }

    pipeline.status = "Completed";
    this.pipelines.set(pipelineId, pipeline);
    return pipeline;
  }

  /**
   * Get execution status of a pipeline.
   */
  getPipeline(pipelineId: string): PipelineExecution | undefined {
    return this.pipelines.get(pipelineId);
  }
}

export const taskPipeline = new TaskPipeline();
