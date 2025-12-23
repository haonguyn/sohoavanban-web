<template>
    <Header />
    <div class="bg-gray-100 min-h-[80vh] flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <!-- Thẻ Đăng ký -->
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
                        Đăng ký tài khoản
                    </h2>
                    <p class="text-gray-600 mt-1 text-sm">
                        Tạo tài khoản mới để trải nghiệm dịch vụ
                    </p>
                </div>

                <!-- Form đăng ký -->
                <form @submit.prevent="handleRegister">
                    <div class="space-y-4">
                        <!-- Họ và tên -->
                        <div>
                            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên
                            </label>
                            <input type="text" id="fullName" v-model="fullName" placeholder="Nguyễn Văn A" required
                                class="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input type="email" id="email" v-model="email" placeholder="ten@example.com" required
                                class="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
                        </div>

                        <!-- Mật khẩu -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <input type="password" id="password" v-model="password" placeholder="••••••••" required
                                class="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
                        </div>

                        <!-- Nhập lại Mật khẩu -->
                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu
                            </label>
                            <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="••••••••"
                                required
                                class="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
                        </div>

                        <!-- Nút Đăng ký -->
                        <div>
                            <button type="submit"
                                class="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </form>

                <!-- Link Đăng nhập -->
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Đã có tài khoản?
                        <RouterLink
                            to="/login"
                            class="font-medium text-blue-600 hover:underline"
                            >
                            Đăng nhập ngay
                        </RouterLink>
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
// import api from "../api/userApi"

export default defineComponent({
    name: "RegisterForm",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            fullName: "" as string,
            email: "" as string,
            password: "" as string,
            confirmPassword: "" as string,
        };
    },

    methods: {
        async handleRegister() {
            // Kiểm tra mật khẩu nhập lại
            if (this.password !== this.confirmPassword) {
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }

            // if (!this.fullName || !this.email || !this.password) {
            //     console.error("Vui lòng nhập đầy đủ thông tin");
            //     return;
            // }

            // try {
            //     const payload = {
            //         full_name: this.fullName,
            //         email: this.email,
            //         password: this.password
            //     };
            //     const res = await api.post("/auth/register/", payload);
            //     console.log("Đăng ký thành công:", res.data);
            //     alert("Đăng ký thành công! Vui lòng đăng nhập.");
            //     this.$router.push("/login");
            // } catch (e) { 
            //     console.error(e);
            //     alert("Đăng ký thất bại"); 
            // }
            
            console.log("Submit Register:", {
                name: this.fullName,
                email: this.email,
                password: this.password
            });
        },
    },
});
</script>