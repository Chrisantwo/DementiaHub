import { describe, expect, it } from "vitest";
import { resolveTargetStageName } from "./services/ghl";
import { deriveOutcome } from "./services/postCallSync";

describe("GHL safety stage mapping", () => {
  it("routes UNSAFE cases directly to escalated safety review", () => {
    expect(resolveTargetStageName("UNSAFE", false, "needs_staff")).toBe(
      "Escalated - Safety Review"
    );
  });
});

describe("post-call safety outcome merge", () => {
  it("upgrades a weak external SAFE result when local transcript triage detects UNSAFE", () => {
    const outcome = deriveOutcome({
      outcome: {
        safety_result: "SAFE",
        safety_flag_type: "none",
        topic_classified: "general",
        callback_requested: false,
        resolution_type: "self_serve",
        escalation_triggered: false,
      },
      transcriptEntries: [
        {
          role: "user",
          message: "I cannot cope anymore. I want to die and I cannot go on.",
        },
      ],
      fallbackSummary: "External summary",
    });

    expect(outcome).toMatchObject({
      safety_result: "UNSAFE",
      safety_flag_type: "self_harm_risk",
      topic_classified: "safety",
      resolution_type: "needs_staff",
      escalation_triggered: true,
    });
  });

  it("keeps an external UNSAFE result even when local rules see only routine language", () => {
    const outcome = deriveOutcome({
      outcome: {
        safety_result: "UNSAFE",
        safety_flag_type: "manual_escalation",
        topic_classified: "safety",
        callback_requested: true,
        resolution_type: "needs_staff",
        escalation_triggered: true,
        call_summary: "External unsafe summary",
      },
      transcriptEntries: [
        {
          role: "user",
          message: "Please tell me about dementia support group timings.",
        },
      ],
      fallbackSummary: "Fallback summary",
    });

    expect(outcome).toMatchObject({
      safety_flag_type: "manual_escalation",
      call_summary: "External unsafe summary",
    });
    expect(outcome).not.toHaveProperty("safety_result", "SAFE");
  });

  it("fills missing structured outcome fields from local triage", () => {
    const outcome = deriveOutcome({
      outcome: {
        safety_result: "SAFE",
      },
      transcriptEntries: [
        {
          role: "user",
          message: "Can someone call me about respite care subsidies?",
        },
      ],
      fallbackSummary: "Fallback summary",
    });

    expect(outcome).toMatchObject({
      safety_result: "SAFE",
      topic_classified: "resources",
      callback_requested: true,
      resolution_type: "needs_staff",
      escalation_triggered: true,
    });
  });
});
