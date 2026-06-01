import { scoringService } from "../modules/scoring/scoring.service.js";

export const scoringJobs = {
  "score.recalculate.app": (appId: string, reason?: string) =>
    scoringService.runJob({ job: "score.recalculate.app", appId, reason }),

  "score.recalculate.entity": (entityId: string, reason?: string) =>
    scoringService.runJob({ job: "score.recalculate.entity", entityId, reason }),

  "score.recalculate.all": (reason?: string) => scoringService.runJob({ job: "score.recalculate.all", reason }),

  "complaint.summary.rebuild": (appId: string, reason?: string) =>
    scoringService.runJob({ job: "complaint.summary.rebuild", appId, reason }),

  "risk.signal.detect": (reason?: string) => scoringService.runJob({ job: "risk.signal.detect", reason }),
};

