import type { Attach } from "../types/DocumentTypes";
import api from "./axios";

export const fetchAttachmentsByDoc = (docId: number) => {
  return api.get<Attach[]>("/attachments/", {
    params: { doc_id: docId, include_file: 1 },
  });
};
export interface CreateAttachmentPayload {
  document_id: number;
  file: File;
}
export function createAttachment(documentId: number, file: File) {
  const formData = new FormData();
  formData.append("document_id", String(documentId));
  formData.append("file", file);

  return api.post("/api/attachments/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}