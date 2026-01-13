<template>
  <nav class="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200 shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">

        <!-- Logo -->
        <RouterLink to="/home" class="flex items-center gap-2 group">
          <div
            class="h-9 w-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md group-hover:scale-105 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
            </svg>
          </div>
          <span class="text-lg font-bold text-gray-800 tracking-wide">
            OCR APP
          </span>
        </RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6">
          <RouterLink v-for="item in menu" :key="item.to" :to="item.to" class="relative text-sm font-medium transition"
            :class="isActive(item.to)
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-blue-600'">
            {{ item.label }}
            <span v-if="isActive(item.to)" class="absolute -bottom-1 left-0 h-0.5 w-full bg-blue-600 rounded-full" />
          </RouterLink>
        </div>

        <!-- Right -->
        <div class="flex items-center gap-3">
          <!-- Authenticated -->
          <template v-if="username">
            <div class="relative">
              <button
                class="peer flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {{ username.charAt(0).toUpperCase() }}
                </div>
                <span class="text-sm font-medium text-gray-700 hidden sm:block">
                  {{ fullName || username }}
                </span>
              </button>

              <div class="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border origin-top-right transition-all duration-200
                opacity-0 scale-95 invisible peer-hover:opacity-100 peer-hover:scale-100 peer-hover:visible
                hover:opacity-100 hover:scale-100 hover:visible">
                <RouterLink v-if="isAdmin" to="/admin/dashboard" class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  Admin
                </RouterLink>
                <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Đăng xuất
                </button>
              </div>
            </div>
          </template>

          <!-- Guest -->
          <template v-else>
            <RouterLink to="/login" class="text-sm font-medium text-gray-600 hover:text-blue-600">
              Đăng nhập
            </RouterLink>
          </template>

          <!-- Mobile button -->
          <button @click="open = !open" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
            ☰
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="open" class="md:hidden pb-4 space-y-2">
        <RouterLink v-for="item in menu" :key="item.to" :to="item.to"
          class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
          {{ item.label }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { doLogout, getRole } from "../../utils/authUtils";
import type { User } from "../../types/UserTypes";

export default defineComponent({
  name: "HeaderMenu",

  data() {
    const userInfo = localStorage.getItem("user_info");
    return {
      open: false,
      menu: [
        { to: "/", label: "Trang chủ" },
        { to: "/tra-cuu", label: "Tra cứu" },
        { to: "/quan-ly", label: "Quản lý" },
        { to: "/ocr-vanban", label: "OCR Văn bản" },
      ],
      user: userInfo ? (JSON.parse(userInfo) as User) : null,
    };
  },

  methods: {
    isActive(path: string) {
      const route = useRoute();
      return route.path === path;
    },

    async logout() { await doLogout(); }
  },
  computed: {
    username(): string | null {
      return this.user?.username ?? null;
    },
    fullName(): string | null {
      return this.user?.full_name ?? null;
    },

    isAdmin(): boolean {
      return getRole() === "admin";
    },
  },
});
</script>
