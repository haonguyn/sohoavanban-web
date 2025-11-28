// src/composables/useFetch.ts
import { ref } from "vue";
import api from "../api/axios";

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const execute = async () => {
    try {
      loading.value = true;
      const res = await api.get(url);
      data.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Lỗi tải dữ liệu";
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, error, execute };
}
