// src/api/feedbackApi.ts
import api from './axios';
import type { Feedback } from '../types/FeedbackTypes';

export const fetchFeedbacks = async (docId: number) => 
  await api.get<Feedback[]>(`/documents/${docId}/feedbacks/`);

export const submitFeedback = async (docId: number, content: string) => 
  await api.post(`/documents/${docId}/feedbacks/`, { content });
