<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo/Tên trang web -->
                <div class="flex-shrink-0 flex items-center">
                    <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span class="ml-2 text-xl font-bold text-gray-800">OCR</span>
                </div>

                <!-- Menu điều hướng -->
                <div class="hidden md:flex md:items-center md:space-x-6">
                    <RouterLink v-for="item in menu" :key="item.to" :to="item.to"
                        class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        :class="isActive(item.to) ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'">
                        {{ item.label }}
                    </RouterLink>
                </div>

                <!-- Nút Đăng ký / Đăng nhập -->
                <div class="flex items-center space-x-3">
                    <!-- Nút Đăng ký (Text/Ghost style) -->
                    <RouterLink to="/register"
                        class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-500 hover:text-white transition-colors">
                        Đăng ký
                    </RouterLink>

                    <!-- Nút Đăng nhập (Filled style) -->
                    <RouterLink to="/login"
                        class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-500 hover:text-white transition-colors">
                        Đăng nhập
                    </RouterLink>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    name: 'HeaderMenu',
    data() {
        return {
            menu: [
                { to: '/', label: 'Trang chủ' },
                { to: '/tra-cuu', label: 'Tra cứu' },
                { to: '/quan-ly', label: 'Quản lý' },
                { to: '/ocr-vanban', label: 'OCR Văn bản' }
            ]
        }
    },
    methods: {
        isActive(path: string) {
            const route = useRoute()
            return route.path === path
        }
    }
})
</script>