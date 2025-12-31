// src/types/DocumentTypes.ts

export interface Attach {
  id: number | string;
  doc_id: number | string;
  filename: string;
  file_size: number;
  file_base64?: string;
  preview_url?: string;
}

export interface Doc {
  id: number;
  doc_number: string;
  title?: string;
  issued_date: string;
  status: string;
  signer?: string;
  doc_type?: string;
  summary: string;
  visibility?: string;
  abstract?: string;
  issued_by?: string;
  full_text?: string;
  page_count?: number;
  attachments?: Attach | null;
  history?: Array<{ action: string; date: string; user: string }>;
}
