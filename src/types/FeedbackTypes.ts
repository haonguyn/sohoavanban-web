// src/types/FeedbackTypes.ts

export interface Feedback {
  id: number;
  document: number;
  user: string | null;
  username: string;
  full_name: string;
  content: string;
  created_at: string;
}
