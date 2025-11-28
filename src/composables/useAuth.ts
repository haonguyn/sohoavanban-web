// src/composables/useAuth.ts
import { ref } from "vue";
import { userApi } from "../api/userApi";
import { useUserStore } from "../store/userStore";

export function useAuth() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;

      const res = await userApi.login({ email, password });

      localStorage.setItem("access_token", res.data.access_token);

      const userStore = useUserStore();
      await userStore.fetchUser();

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Sai email hoặc mật khẩu";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { login, loading, error };
}
