import api from "./axios";

export const processOCR = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

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
