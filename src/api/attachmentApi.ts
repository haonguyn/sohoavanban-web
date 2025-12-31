import type { Attach } from "../types/DocumentTypes";
import api from "./axios";

export const fetchAttachmentsByDoc = (docId: number) => {
  return api.get<Attach[]>("/attachments/", {
    params: { doc_id: docId, include_file: 1 },
  });
};

export const uploadAttachment = async (document_id: number, file: File): Promise<Attach> => {
  const formData = new FormData();
  formData.append("document_id", String(document_id));
  formData.append("file", file);
  const res = await api.post<Attach>("/attachments/create/", formData);
  return res.data;
};