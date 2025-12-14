import api from "./axios";

export const processOCR = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/ocr/process/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
