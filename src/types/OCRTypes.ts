// src/types/OCRTypes.ts

export interface OCRResult {
  job_id: string;
  status: "pending" | "processing" | "done" | "error";
  text?: string;
  created_at?: string;
}
