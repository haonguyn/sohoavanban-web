// // src/api/documentApi.ts
// import api from "./axios";
// import { Document, DocumentPayload } from "../types/DocumentTypes";

// export const documentApi = {
//   list(): Promise<Document[]> {
//     return api.get("/documents").then((r) => r.data);
//   },

//   detail(id: string): Promise<Document> {
//     return api.get(`/documents/${id}`).then((r) => r.data);
//   },

//   create(payload: DocumentPayload) {
//     return api.post("/documents", payload);
//   },

//   remove(id: string) {
//     return api.delete(`/documents/${id}`);
//   },
// };
