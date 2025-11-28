// src/types/DocumentTypes.ts

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  author?: string;
}

export interface DocumentPayload {
  title: string;
  description?: string;
  file?: File | null;
}
