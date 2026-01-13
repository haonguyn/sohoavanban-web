import type { Doc } from '../types/DocumentTypes';
import api from './axios'; // axios instance

export const fetchDocuments = async () => await api.get<Doc[]>('/documents/');
export const fetchFeaturedDocs = async () => await api.get<Doc[]>('/documents/latest/')
export const getDocumentDetail = async (id: number) => await api.get<Doc>(`/documents/${id}/`);
export const createDocument = async (data: FormData) => await api.post('/documents/create/', data);
export const updateDocument = async (id: number, data: any) => await api.put(`/documents/${id}/update/`, data);
export const deleteDocument = async (id: number) => await api.delete(`/documents/${id}/delete/`);
export const filterDocuments = async (params: any) => await api.get('/documents/filter/', { params });