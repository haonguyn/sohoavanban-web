<template>
    <Header />
    <div class="bg-gray-100 h-[70vh] flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <!-- Thẻ Đăng nhập -->
            <div class="bg-white p-8 rounded-xl shadow-xl">
                <!-- Logo và Tiêu đề -->
                <div class="flex flex-col items-center mb-6">
                    <div class="flex-shrink-0 flex items-center mb-3">
                        <svg class="h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        <span class="ml-2 text-2xl font-bold text-gray-800">Văn Bản Số</span>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-800">
                        Đăng nhập tài khoản
                    </h2>
                    <p class="text-gray-600 mt-1 text-sm">
                        Chào mừng bạn trở lại!
                    </p>
                </div>

                <!-- Form đăng nhập -->
                <form @submit.prevent="handleLogin">
                    <div class="space-y-4">
                        <!-- username -->
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input id="username" v-model="username" placeholder="ten@example.com" required
                                class="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
                        </div>

                        <!-- Mật khẩu -->
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label for="password" class="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <a href="#" tabindex="-1" class="text-sm text-blue-600 hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <input type="password" id="password" v-model="password" placeholder="••••••••" required
                                class="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
                        </div>

                        <!-- Nút Đăng nhập -->
                        <div>
                            <button type="submit"
                                class="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                </form>

                <!-- Link Đăng ký -->
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Chưa có tài khoản?
                        <a href="#" class="font-medium text-blue-600 hover:underline">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";
import { login } from "../api/userApi";

export default defineComponent({
    name: "LoginForm",
    components: { Header, Footer },
    data() {
        return {
            username: "" as string,
            password: "" as string,
            errorMessage: "" as string,
        };
    },
    methods: {
        async handleLogin() {
            if (!this.username || !this.password) {
                this.errorMessage = "Vui lòng nhập đầy đủ thông tin";
                return;
            }
            try {
                // xử lý login ở đây
                const res = await login({ username: this.username, password: this.password });

                // lưu token vào localStorage để interceptor axios dùng
                localStorage.setItem("access_token", res.access_token);

                // có thể lưu thêm thông tin user nếu cần
                // localStorage.setItem("username", res.username);
                // localStorage.setItem("role", res.role);
                this.$router.push("/");
            } catch (e) {
                this.errorMessage = "Đăng nhập thất bại";
            }
        },
    },
});
</script>
