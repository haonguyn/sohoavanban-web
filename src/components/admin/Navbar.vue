<template>
  <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0">
    <!-- Logo -->
    <div class="p-6 flex items-center gap-3">
      <div class="bg-blue-700 text-white p-2 rounded-lg font-bold text-xl shadow-lg shadow-blue-200">
        DMS
      </div>
      <h1 class="font-extrabold text-slate-800 tracking-tight text-lg">
        ManagerDocs
      </h1>
    </div>

    <!-- Menu -->
    <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
      <p class="px-6 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Chức năng chính</p>

      <RouterLink v-for="item in features" :key="item.to" :to="item.to"
        class='flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition'
        :class="isActive(item.to) ? 'bg-blue-50 text-blue-600 font-bold border-r-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50'">
        <i :class="item.icon" class="text-base"></i>
        {{ item.label }}
      </RouterLink>

      <p class="px-6 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Quản trị</p>

      <RouterLink v-for="item in manages" :key="item.to" :to="item.to"
        class='flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition'
        :class="isActive(item.to) ? 'bg-blue-50 text-blue-600 font-bold border-r-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50'">
        <i :class="item.icon" class="text-base"></i>
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-slate-100 bg-slate-50">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
          {{ currentUser.username.charAt(0).toUpperCase() }}
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-bold truncate text-slate-800">{{ currentUser.full_name }}</p>
          <p class="text-xs text-slate-500 font-medium bg-slate-200 px-2 rounded-full inline-block mt-0.5">
            {{ currentUser.username }}</p>
        </div>
      </div>
      <button @click="handleLogout"
        class="flex items-center justify-center w-full gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 py-2 hover:bg-rose-50 rounded-lg transition">
        <i class="fas fa-right-from-bracket w-4 h-4"></i> Đăng xuất
      </button>
    </div>
  </aside>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from 'vue-router'
import { doLogout } from "../../utils/authUtils";

export default defineComponent({
  name: 'NavbarAdmin',
  data() {
    return {
      currentUser: { username: "", full_name: "", role: "", },
      features: [
        { to: '/admin/', icon: 'layout-dashboard', label: 'Dashboard' },
        { to: '/admin/create-ocr', icon: 'plus-circle', label: 'Tạo mới (OCR)' },
        { to: '/admin/manager', icon: 'file-text', label: 'Kho văn bản' },
      ],
      manages: [
        { to: '/admin/report', icon: 'bar-chart-3', label: 'Báo cáo' },
        { to: '/admin/system-user', icon: 'settings', label: 'Hệ thống & User' },
      ]
    }
  },
  mounted() { const userInfo = localStorage.getItem("user_info"); if (userInfo) { this.currentUser = JSON.parse(userInfo); } },
  methods: {
    isActive(path: string) {
      const route = useRoute()
      return route.path === path
    },
    async handleLogout() { await doLogout(); }
  }
});
</script>
