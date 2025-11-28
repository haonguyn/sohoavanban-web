// // src/api/ocrApi.ts
// import api from "./axios";
// import { OCRResult } from "../types/OCRTypes";

// export const ocrApi = {
//   upload(file: File): Promise<OCRResult> {
//     const form = new FormData();
//     form.append("file", file);

//     return api.post("/ocr/scan", form).then((r) => r.data);
//   },

//   status(jobId: string): Promise<OCRResult> {
//     return api.get(`/ocr/${jobId}`).then((r) => r.data);
//   },
// };
