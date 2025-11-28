// import { defineStore } from "pinia";
// import { listDocumentsApi, uploadDocumentApi } from "@/api/documentApi";

// export const useDocumentStore = defineStore("document", {
//   state: () => ({
//     docs: [],
//   }),

//   actions: {
//     async loadDocuments() {
//       const res = await listDocumentsApi();
//       this.docs = res.data;
//     },

//     async uploadDocument(file: File) {
//       await uploadDocumentApi(file);
//       await this.loadDocuments();
//     }
//   }
// });
