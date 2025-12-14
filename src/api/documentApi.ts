import api from './axios'; // axios instance

export const fetchDocuments = () => api.get('/documents/');
export const getDocumentDetail = (id: number) => api.get(`/documents/${id}/`);
export const createDocument = (data: FormData) => api.post('/documents/create/', data);
export const updateDocument = (id: number, data: any) => api.put(`/documents/${id}/update/`, data);
export const deleteDocument = (id: number) => api.delete(`/documents/${id}/delete/`);
export const filterDocuments = (params: any) => api.get('/documents/filter/', { params });
