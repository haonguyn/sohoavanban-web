import type { Attach } from "../types/DocumentTypes";
import api from "./axios";

export const fetchAttachmentsByDoc = async (docId: number) => {
  return await api.get<Attach[]>("/attachments/", {
    params: { doc_id: docId, include_file: 0 }, // Optimized: Do not fetch binary data by default
  });
};

export const fetchAttachmentDetail = async (id: number | string) => {
  return await api.get<Attach>(`/attachments/${id}/`, {
    params: { include_file: 1 } // Only fetch binary data when specifically requested (e.g. download)
  });
};

export const uploadAttachment = async (document_id: number, file: File): Promise<Attach> => {
  const formData = new FormData();
  formData.append("document_id", String(document_id));
  formData.append("file", file);
  const res = await api.post<Attach>("/attachments/create/", formData);
  return res.data;
};