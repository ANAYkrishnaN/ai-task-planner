export type Bucket = "Do Now" | "Do Soon" | "Can Wait" | "Needs Info";
export type Confidence = "High" | "Low";
export type DeadlineSignal = "soon" | "later" | null;
export type ImportanceSignal = "high" | "medium" | null;

export type PrioritizationInput = {
  deadline: DeadlineSignal;
  importance: ImportanceSignal;
};

export type PrioritizedTask = PrioritizationInput & {
  bucket: Bucket;
  confidence: Confidence;
  missingFields: Array<"deadline" | "importance">;
};

export type PrioritizedRawTask = {
  rawText: string;
  normalizedTitle: string;
  result: PrioritizedTask;
  explanation: string;
};

export function classifyTask(input: PrioritizationInput): PrioritizedTask {
  const missingFields: Array<"deadline" | "importance"> = [];
  if (!input.deadline) {
    missingFields.push("deadline");
  }
  if (!input.importance) {
    missingFields.push("importance");
  }

  if (!input.deadline && !input.importance) {
    return {
      ...input,
      bucket: "Needs Info",
      confidence: "Low",
      missingFields,
    };
  }

  if (input.deadline === "soon") {
    return {
      ...input,
      bucket: "Do Now",
      confidence: "High",
      missingFields,
    };
  }

  if (input.importance === "high") {
    return {
      ...input,
      bucket: "Do Soon",
      confidence: "High",
      missingFields,
    };
  }

  return {
    ...input,
    bucket: "Can Wait",
    confidence: missingFields.length > 0 ? "Low" : "High",
    missingFields,
  };
}

export function createTaskExplanation(task: PrioritizedTask): string {
  if (task.bucket === "Needs Info") {
    return "Marked Needs Info because deadline and importance are missing.";
  }

  if (task.deadline === "soon") {
    return "Marked Do Now because this task has a near deadline.";
  }

  if (task.importance === "high") {
    return "Marked Do Soon because this task is important.";
  }

  return "Marked Can Wait because there is no near deadline or high importance.";
}

export function normalizeTask(rawText: string): PrioritizationInput & { normalizedTitle: string } {
  const text = rawText.toLowerCase();

  return {
    normalizedTitle: rawText.trim(),
    deadline: text.includes("today") || text.includes("tomorrow") ? "soon" : null,
    importance: text.includes("important") || text.includes("urgent") ? "high" : null,
  };
}

export function saveToFile(filename: string, data: any) {
  fetch(`/api/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, data }),
  }).catch(console.error);
}

function inferSignals(rawText: string): PrioritizationInput {
  const text = rawText.toLowerCase();

  const deadlineSoon = /\b(today|tomorrow|asap|urgent|tonight|immediately)\b/.test(
    text,
  );
  const deadlineLater = /\b(next week|next month|later|someday)\b/.test(text);

  const importanceHigh = /\b(important|critical|final|exam|interview)\b/.test(
    text,
  );
  const importanceMedium = /\b(normal|routine|regular)\b/.test(text);

  return {
    deadline: deadlineSoon ? "soon" : deadlineLater ? "later" : null,
    importance: importanceHigh ? "high" : importanceMedium ? "medium" : null,
  };
}

export function prioritizeRawTask(rawText: string): PrioritizedRawTask {
  // Bronze: save raw input
  saveToFile("bronze", { rawText });

  const normalized = normalizeTask(rawText);
  // Silver: save ETL normalized
  saveToFile("silver", normalized);

  const signals = inferSignals(normalized.normalizedTitle);
  const result = classifyTask({ ...normalized, ...signals });
  const explanation = createTaskExplanation(result);
  // Gold: save final
  saveToFile("gold", { normalizedTitle: normalized.normalizedTitle, result });

  return {
    rawText,
    normalizedTitle: normalized.normalizedTitle,
    result,
    explanation,
  };
}
