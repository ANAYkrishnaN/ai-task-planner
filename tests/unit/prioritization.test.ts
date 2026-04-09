import { describe, expect, it } from "vitest";
import {
  classifyTask,
  createTaskExplanation,
  type PrioritizationInput,
} from "@/src/lib/prioritization";

const classify = (input: PrioritizationInput) => classifyTask(input).bucket;

describe("prioritization rules", () => {
  it("returns Needs Info when no deadline and no importance are available", () => {
    expect(classify({ deadline: null, importance: null })).toBe("Needs Info");
  });

  it("returns Do Now when deadline is soon", () => {
    expect(classify({ deadline: "soon", importance: null })).toBe("Do Now");
  });

  it("returns Do Soon when importance is high", () => {
    expect(classify({ deadline: null, importance: "high" })).toBe("Do Soon");
  });

  it("returns Can Wait otherwise", () => {
    expect(classify({ deadline: "later", importance: "medium" })).toBe(
      "Can Wait",
    );
  });
});

describe("explanation generation", () => {
  it("generates a deterministic explanation for Do Now", () => {
    const task = classifyTask({ deadline: "soon", importance: null });
    expect(createTaskExplanation(task)).toBe(
      "Marked Do Now because this task has a near deadline.",
    );
  });

  it("explains missing fields for Needs Info", () => {
    const task = classifyTask({ deadline: null, importance: null });
    expect(createTaskExplanation(task)).toBe(
      "Marked Needs Info because deadline and importance are missing.",
    );
  });
});
