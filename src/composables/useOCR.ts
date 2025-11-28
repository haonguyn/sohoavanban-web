// // src/composables/useOCR.ts
// import { ref } from "vue";
// import { ocrApi } from "../api/ocrApi";

// export function useOCR() {
//   const loading = ref(false);
//   const result = ref(null);
//   const error = ref<string | null>(null);

//   const upload = async (file: File) => {
//     try {
//       loading.value = true;
//       result.value = await ocrApi.upload(file);
//     } catch (err: any) {
//       error.value = "OCR upload thất bại";
//     } finally {
//       loading.value = false;
//     }
//   };

//   return { loading, result, error, upload };
// }
