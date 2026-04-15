import api from "./axios";

export const processOCR = async (file: File, extractionMode: string = 'ai') => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("extraction_mode", extractionMode);

  return await api.post("/ocr/process/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const downloadOCRDocx = async (positions: any[], pages: any[], filename: string) => {
  return await api.post("/ocr/download-docx/", { positions, pages, filename }, {
    responseType: 'blob'
  });
};
