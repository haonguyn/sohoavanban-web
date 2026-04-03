<template>
  <aside :class="isCollapsed ? 'w-24' : 'w-72'"
    class="bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0 transition-all duration-500 ease-in-out">
    <!-- Logo -->
    <div class="p-4 flex items-center justify-between h-20 box-border">
      <div class="flex items-center gap-3">
        <div @click="toggleSidebar"
          class="bg-blue-700 text-white p-2 rounded-lg font-bold text-xl shadow-lg shadow-blue-200 shrink-0 transition-all cursor-pointer">
          DMS
        </div>
        <h1 v-show="!isCollapsed"
          class="font-extrabold text-slate-800 tracking-tight text-lg whitespace-nowrap transition-opacity duration-300">
          ManagerDocs
        </h1>
      </div>
      <button @click="toggleSidebar"
        class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
        :class="isCollapsed ? 'mx-auto' : ''" :title="isCollapsed ? 'Mở rộng' : 'Thu nhỏ'">
        <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>
    </div>
    <!-- Menu -->
    <nav class="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
      <p v-show="!isCollapsed"
        class="px-6 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2 transition duration-500">
        Chức
        năng chính</p>

      <RouterLink v-for="item in features" :key="item.to" :to="item.to" @click="handleMenuClick(item)"
        class='flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition'
        :title="isCollapsed ? item.label : ''" 
        :class="[isActive(item.to) ? 'bg-blue-50 font-bold border-r-4 border-blue-600' : 'hover:bg-slate-50', 
                 isActive(item.to) ? (item.label === 'Kho văn bản' && unreadDocsCount > 0 ? 'text-red-600' : 'text-blue-600') : (item.label === 'Kho văn bản' && unreadDocsCount > 0 ? 'text-red-500 font-bold' : 'text-slate-600'),
                 isCollapsed ? 'justify-center' : '']">
        <i :class="item.icon" class="text-base relative">
          <span v-if="item.label === 'Kho văn bản' && unreadDocsCount > 0 && isCollapsed" 
            class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
        </i>
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-500 flex items-center gap-2">
          {{ item.label }}
          <span v-if="item.label === 'Kho văn bản' && unreadDocsCount > 0" 
            class="inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full font-bold shadow-sm animate-pulse">
            {{ unreadDocsCount }}
          </span>
        </span>
      </RouterLink>

      <p v-show="!isCollapsed"
        class="px-6 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 transition duration-500">
        Quản trị
      </p>

      <RouterLink v-for="item in manages" :key="item.to" :to="item.to"
        class='flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition'
        :title="isCollapsed ? item.label : ''" :class="[isActive(item.to) ? 'bg-blue-50 text-blue-600 font-bold border-r-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50',
        isCollapsed ? 'justify-center' : '']">
        <i :class="item.icon" class="text-base"></i>
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-500">
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-slate-100 bg-slate-50">
      <div class="flex items-center gap-3" :title="isCollapsed ? currentUser.full_name : ''"
        :class="isCollapsed ? 'justify-center flex-col' : 'mb-4'">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
          {{ currentUser.username.charAt(0).toUpperCase() }}
        </div>
        <div v-show="!isCollapsed" class="overflow-hidden transition-all duration-500">
          <p class="text-sm font-bold truncate text-slate-800">{{ currentUser.full_name }}</p>
          <p class="text-xs text-slate-500 font-medium bg-slate-200 px-2 rounded-full inline-block mt-0.5">
            {{ currentUser.username }}</p>
        </div>
      </div>
      <RouterLink to="/"
        class="flex items-center justify-center w-full gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 py-2 hover:bg-emerald-50 rounded-lg transition overflow-hidden"
        :class="isCollapsed ? 'mt-4' : 'mt-2'" :title="isCollapsed ? 'Trang chủ' : ''">
        <i class="fas fa-house w-4 h-4 shrink-0 text-center"></i>
        <span v-show="!isCollapsed" class="whitespace-nowrap">Trang chủ</span>
      </RouterLink>
      
      <button @click="handleLogout"
        class="flex items-center justify-center w-full gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 py-2 hover:bg-rose-50 rounded-lg transition overflow-hidden mt-1"
        :title="isCollapsed ? 'Đăng xuất' : ''">
        <i class="fas fa-right-from-bracket w-4 h-4 shrink-0 text-center"></i>
        <span v-show="!isCollapsed" class="whitespace-nowrap">Đăng xuất</span>
      </button>
    </div>
  </aside>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from 'vue-router'
import { doLogout } from "../../utils/authUtils";
import { unreadDocsCount, resetCount, connectWS } from "../../store/wsStore";

export default defineComponent({
  name: 'NavbarAdmin',
  data() {
    return {
      isCollapsed: localStorage.getItem("sidebar_collapsed") === 'true',
      currentUser: { username: "", full_name: "", role: "", },
      features: [
        { to: '/admin/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
        { to: '/admin/create-ocr', icon: 'fas fa-plus-circle', label: 'Tạo mới (OCR)' },
        { to: '/admin/manager', icon: 'fas fa-file-alt', label: 'Kho văn bản' },
      ],
      manages: [
        { to: '/admin/report', icon: 'fas fa-chart-bar', label: 'Báo cáo' },
        { to: '/admin/system-user', icon: 'fas fa-cog', label: 'Hệ thống & User' },
      ]
    }
  },
  mounted() { 
    const userInfo = localStorage.getItem("user_info"); 
    if (userInfo) { this.currentUser = JSON.parse(userInfo); } 
    connectWS();
  },
  computed: {
    unreadDocsCount(): number {
      return unreadDocsCount.value;
    }
  },
  methods: {
    handleMenuClick(item: any) {
      if (item.label === 'Kho văn bản') {
        resetCount();
      }
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      localStorage.setItem("sidebar_collapsed", String(this.isCollapsed));
    },
    isActive(path: string) {
      const route = useRoute()
      return route.path === path
    },
    async handleLogout() { await doLogout(); }
  }
});
</script>
